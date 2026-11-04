import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  createVukovarWaterTower, 
  createVucedolDove, 
  createKopackiRit, 
  createDjakovoStables,
  createStMarksChurch, 
  createTrakoscanCastle, 
  createLicitarWorkshop,
  createPlitviceTerraces, 
  createTeslaCoil, 
  createVelebitPeaks,
  createPulaArena, 
  createSeaOrgan, 
  createSuhozidKazun, 
  createDubrovnikWalls,
  createExplorerUnit,
  createFogCloud,
  createBiomeTree
} from './proceduralModels';
import {
  TileData,
  LandmarkData,
  CharacterCustomization,
  DEFAULT_CHARACTER_CUSTOMIZATION,
} from './types';
import { GRID_WIDTH, GRID_HEIGHT, SPAWN_X, SPAWN_Z, getTileKey } from './mapData';
import { findPathWaypoints, isTilePassable } from './logic';
import { sound } from './audio';

export interface WorldSceneCallbacks {
  onTileSelect: (tile: TileData, landmark?: LandmarkData) => void;
  onTileHover?: (tile: TileData | null) => void;
  onMoveComplete?: (x: number, z: number) => void;
  onPlayerTileEnter?: (x: number, z: number) => void;
}

function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  let diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * (1 - Math.exp(-lambda * dt));
}

export class WorldScene {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private isSoftwareGl: boolean = false;

  private frameId: number = 0;
  private lastTime: number = performance.now();
  private startTime: number = performance.now();

  // Grid objects & shared materials
  private tileMeshes = new Map<string, THREE.Mesh>();
  private treeMeshes: THREE.Object3D[] = [];
  private landmarkMeshes = new Map<string, THREE.Group>();
  private cloudMeshes = new Map<string, THREE.Group>();
  private tileDataMap = new Map<string, TileData>();
  private tileMatCache = new Map<string, THREE.MeshStandardMaterial>();

  // Springs & Interactive Bounce
  private springNodes: Array<{
    object: THREE.Object3D;
    scaleY: number;
    velY: number;
    targetScaleY: number;
  }> = [];

  // Particles
  private dustParticles: Array<{
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
  }> = [];
  private sharedDustGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
  private sharedDustMat = new THREE.MeshBasicMaterial({ color: 0xdfd3b8, transparent: true, opacity: 0.78 });
  private sharedPuffGeo = new THREE.DodecahedronGeometry(0.18, 0);
  private sharedPuffMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });

  // Player Unit & Smooth Movement State
  private playerGroup!: THREE.Group;
  private playerX: number = SPAWN_X;
  private playerZ: number = SPAWN_Z;
  private lastGridX: number = SPAWN_X;
  private lastGridZ: number = SPAWN_Z;
  private playerVel = new THREE.Vector2(0, 0);
  private manualInput = new THREE.Vector2(0, 0);
  private waypoints: Array<{ x: number; z: number }> = [];
  private walkCycleTime: number = 0;
  private stepDustTimer: number = 0;
  private stepSoundTimer: number = 0;
  private isMounted: boolean = false;
  private customization: CharacterCustomization = DEFAULT_CHARACTER_CUSTOMIZATION;

  // Camera Pan & Zoom with inertia
  private cameraTarget = new THREE.Vector3(SPAWN_X, 0, SPAWN_Z);
  private cameraCurrent = new THREE.Vector3(SPAWN_X, 0, SPAWN_Z);
  private zoomLevel: number = 14;
  private targetZoom: number = 14;
  private followPlayer: boolean = true;

  // Pointer & Multi-Touch Pinch State
  private activePointers = new Map<number, { x: number; y: number }>();
  private isDragging: boolean = false;
  private pointerDownPos = { x: 0, y: 0 };
  private previousPointerPos = { x: 0, y: 0 };
  private lastPinchDist: number = 0;
  private selectedTileKey: string | null = null;

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private interactiveMeshes: THREE.Mesh[] = [];

  // Highlight Selection Ring & Destination Marker
  private selectRing!: THREE.Mesh;
  private destMarker!: THREE.Mesh;
  private reachableRings: THREE.Mesh[] = [];

  private callbacks: WorldSceneCallbacks;
  private isDisposed: boolean = false;

  constructor(container: HTMLDivElement, callbacks: WorldSceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.init();
  }

  private init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const isMobileScreen = width < 640;

    // 1. Detect Software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.style.touchAction = 'none';

    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Dark Void Gradient Background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e141d);
    this.scene.fog = new THREE.FogExp2(0x0e141d, 0.0085);

    // 4. Studio Environment Lighting (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Orthographic Isometric Camera
    this.zoomLevel = isMobileScreen ? 11.5 : 14.5;
    this.targetZoom = this.zoomLevel;
    const aspect = width / height;
    const d = this.zoomLevel;
    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      -150,
      300
    );
    this.updateCameraTransform();

    // 6. Lighting Rig: Warm Key Sunlight + Cool Fill (scaled for 4x map)
    const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.2);
    sunLight.position.set(42, 65, 36);
    if (!this.isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.left = -45;
      sunLight.shadow.camera.right = 45;
      sunLight.shadow.camera.top = 45;
      sunLight.shadow.camera.bottom = -45;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    this.scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x7397b8, 0x243342, 1.25);
    this.scene.add(hemiLight);

    // 7. Floating Island Underside (Subterranean low-poly tapered rock crust for 42x40 world)
    this.buildFloatingIslandCrust();

    // 8. Selection Rings & Path Target Indicator
    this.buildSelectionIndicator();

    // 9. Player Character
    this.playerGroup = createExplorerUnit(this.isMounted, this.customization);
    this.setPlayerTilePosition(this.playerX, this.playerZ, false);
    this.scene.add(this.playerGroup);

    // 10. Event Listeners
    this.bindEvents();

    // 11. Start Loop
    this.tick = this.tick.bind(this);
    this.tick();
  }

  private buildFloatingIslandCrust() {
    const width = GRID_WIDTH;
    const depth = GRID_HEIGHT;
    const crustGeo = new THREE.CylinderGeometry(
      Math.max(width, depth) * 0.72,
      Math.max(width, depth) * 0.38,
      8.0,
      16,
      1
    );
    const crustMat = new THREE.MeshStandardMaterial({
      color: 0x1f262d,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    });
    const crust = new THREE.Mesh(crustGeo, crustMat);
    crust.position.set(width * 0.5 - 0.5, -4.05, depth * 0.5 - 0.5);
    crust.receiveShadow = !this.isSoftwareGl;
    this.scene.add(crust);
  }

  private buildSelectionIndicator() {
    const ringGeo = new THREE.RingGeometry(0.54, 0.65, 6);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    this.selectRing = new THREE.Mesh(ringGeo, ringMat);
    this.selectRing.rotation.x = -Math.PI / 2;
    this.selectRing.position.set(SPAWN_X, 0.52, SPAWN_Z);
    this.selectRing.visible = false;
    this.scene.add(this.selectRing);

    const destGeo = new THREE.RingGeometry(0.22, 0.36, 12);
    const destMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    this.destMarker = new THREE.Mesh(destGeo, destMat);
    this.destMarker.rotation.x = -Math.PI / 2;
    this.destMarker.visible = false;
    this.scene.add(this.destMarker);
  }

  private getTileMaterial(color: string, isLand: boolean): THREE.MeshStandardMaterial {
    const key = `${color}_${isLand ? 'land' : 'water'}`;
    let mat = this.tileMatCache.get(key);
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: isLand ? 0.82 : 0.3,
        metalness: isLand ? 0.05 : 0.25,
        flatShading: true,
      });
      this.tileMatCache.set(key, mat);
    }
    return mat;
  }

  public populateMap(tiles: TileData[], landmarks: Record<string, LandmarkData>) {
    this.tileMeshes.forEach(m => this.scene.remove(m));
    this.tileMeshes.clear();
    this.treeMeshes.forEach(t => this.scene.remove(t));
    this.treeMeshes = [];
    this.landmarkMeshes.forEach(m => this.scene.remove(m));
    this.landmarkMeshes.clear();
    this.cloudMeshes.forEach(m => this.scene.remove(m));
    this.cloudMeshes.clear();
    this.interactiveMeshes = [];
    this.tileDataMap.clear();

    const tileGeo = new THREE.BoxGeometry(0.96, 0.4, 0.96);

    tiles.forEach(tile => {
      const key = getTileKey(tile.x, tile.z);
      this.tileDataMap.set(key, tile);

      const mat = this.getTileMaterial(tile.baseColor, tile.isLand);
      const mesh = new THREE.Mesh(tileGeo, mat);
      const elevation = tile.height;
      mesh.position.set(tile.x, elevation * 0.5, tile.z);
      mesh.scale.set(1, 1 + elevation, 1);
      mesh.receiveShadow = !this.isSoftwareGl;
      mesh.castShadow = !this.isSoftwareGl && tile.isLand;
      mesh.userData = { tileKey: key };

      this.scene.add(mesh);
      this.tileMeshes.set(key, mesh);
      this.interactiveMeshes.push(mesh);

      if (tile.landmarkId && landmarks[tile.landmarkId]) {
        const lm = landmarks[tile.landmarkId];
        const lmGroup = this.createLandmarkMesh(lm.modelKey);
        if (lmGroup) {
          lmGroup.position.set(tile.x, elevation + 0.2, tile.z);
          lmGroup.userData = { landmarkId: lm.id, tileKey: key };
          lmGroup.scale.set(1, 1, 1);
          this.scene.add(lmGroup);
          this.landmarkMeshes.set(lm.id, lmGroup);

          this.springNodes.push({
            object: lmGroup,
            scaleY: 1,
            velY: 0,
            targetScaleY: 1,
          });
        }
      } else if (tile.isLand && (tile.type === 'forest' || (tile.type === 'hill' && (tile.x + tile.z) % 2 === 0))) {
        const tree = createBiomeTree(tile.biome);
        tree.position.set(tile.x, elevation + 0.2, tile.z);
        this.scene.add(tree);
        this.treeMeshes.push(tree);
      }

      if (!tile.revealed) {
        const cloud = createFogCloud();
        cloud.position.set(tile.x, elevation + 0.3, tile.z);
        this.scene.add(cloud);
        this.cloudMeshes.set(key, cloud);
      }
    });

    // Reposition player cleanly onto spawn tile height
    this.setPlayerTilePosition(this.playerX, this.playerZ, false);
  }

  private createLandmarkMesh(modelKey: string): THREE.Group | null {
    switch (modelKey) {
      case 'water_tower': return createVukovarWaterTower();
      case 'vucedol_dove': return createVucedolDove();
      case 'kopacki_rit': return createKopackiRit();
      case 'djakovo_stables': return createDjakovoStables();
      case 'st_marks': return createStMarksChurch();
      case 'trakoscan_castle': return createTrakoscanCastle();
      case 'licitar_workshop': return createLicitarWorkshop();
      case 'plitvice_terraces': return createPlitviceTerraces();
      case 'tesla_coil': return createTeslaCoil();
      case 'velebit_peaks': return createVelebitPeaks();
      case 'pula_arena': return createPulaArena();
      case 'sea_organ': return createSeaOrgan();
      case 'suhozid_kazun': return createSuhozidKazun();
      case 'dubrovnik_walls': return createDubrovnikWalls();
      default: return null;
    }
  }

  public revealTiles(newlyRevealedKeys: string[]) {
    newlyRevealedKeys.forEach(key => {
      const cloud = this.cloudMeshes.get(key);
      if (cloud) {
        if (newlyRevealedKeys.length <= 45) {
          this.spawnCloudPuff(cloud.position.x, cloud.position.y, cloud.position.z);
        }
        this.scene.remove(cloud);
        this.cloudMeshes.delete(key);
      }

      const tile = this.tileDataMap.get(key);
      if (tile?.landmarkId) {
        const lmGroup = this.landmarkMeshes.get(tile.landmarkId);
        if (lmGroup) {
          this.triggerBounce(lmGroup, 1.4);
        }
      }
    });
  }

  public updateReachableIndicators(reachableCoords: Array<{ x: number; z: number }>) {
    this.reachableRings.forEach(r => this.scene.remove(r));
    this.reachableRings = [];

    const ringGeo = new THREE.RingGeometry(0.36, 0.44, 6);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4df0a0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });

    reachableCoords.forEach(coord => {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      const tile = this.tileDataMap.get(getTileKey(coord.x, coord.z));
      const y = (tile?.height || 0.3) + 0.22;
      ring.position.set(coord.x, y, coord.z);
      this.scene.add(ring);
      this.reachableRings.push(ring);
    });
  }

  public triggerBounce(object: THREE.Object3D, intensity: number = 1.3) {
    const node = this.springNodes.find(n => n.object === object);
    if (node) {
      node.scaleY = 0.68;
      node.velY = intensity * 4.2;
    } else {
      this.springNodes.push({
        object,
        scaleY: 0.72,
        velY: intensity * 4.2,
        targetScaleY: 1,
      });
    }
  }

  public selectTile(x: number, z: number) {
    const rx = Math.round(x);
    const rz = Math.round(z);
    const key = getTileKey(rx, rz);
    const tile = this.tileDataMap.get(key);
    if (!tile) return;

    this.selectedTileKey = key;
    this.selectRing.position.set(rx, tile.height + 0.22, rz);
    this.selectRing.visible = true;

    if (tile.landmarkId) {
      const lm = this.landmarkMeshes.get(tile.landmarkId);
      if (lm) {
        this.triggerBounce(lm, 1.32);
      }
    } else {
      const tileMesh = this.tileMeshes.get(key);
      if (tileMesh) {
        this.triggerBounce(tileMesh, 1.12);
      }
    }
  }

  /**
   * Bilinearly interpolate terrain surface Y at continuous (x, z) coordinates
   * so the character glides smoothly across elevation changes.
   */
  private getSmoothGroundY(x: number, z: number): number {
    const x0 = Math.floor(x);
    const z0 = Math.floor(z);
    const x1 = x0 + 1;
    const z1 = z0 + 1;
    const fx = x - x0;
    const fz = z - z0;

    const h00 = (this.tileDataMap.get(getTileKey(x0, z0))?.height ?? 0.3) + 0.2;
    const h10 = (this.tileDataMap.get(getTileKey(x1, z0))?.height ?? h00 - 0.2) + 0.2;
    const h01 = (this.tileDataMap.get(getTileKey(x0, z1))?.height ?? h00 - 0.2) + 0.2;
    const h11 = (this.tileDataMap.get(getTileKey(x1, z1))?.height ?? h00 - 0.2) + 0.2;

    const hx0 = THREE.MathUtils.lerp(h00, h10, fx);
    const hx1 = THREE.MathUtils.lerp(h01, h11, fx);
    return THREE.MathUtils.lerp(hx0, hx1, fz);
  }

  /**
   * Set continuous manual directional input from Keyboard (WASD/Arrows) or Mobile Virtual Joystick
   */
  public setManualInput(dx: number, dz: number) {
    this.manualInput.set(dx, dz);
    if (dx !== 0 || dz !== 0) {
      // Cancel automatic click path when user steers manually
      this.waypoints = [];
      this.destMarker.visible = false;
      this.followPlayer = true;
    }
  }

  /**
   * Smoothly walk/ride the player along a path to (targetX, targetZ)
   */
  public movePlayerTo(targetX: number, targetZ: number) {
    const path = findPathWaypoints(this.playerX, this.playerZ, targetX, targetZ, this.tileDataMap);
    if (path.length === 0) return;

    this.waypoints = path;
    this.followPlayer = true;

    const finalWp = path[path.length - 1];
    const destTile = this.tileDataMap.get(getTileKey(finalWp.x, finalWp.z));
    this.destMarker.position.set(finalWp.x, (destTile?.height ?? 0.3) + 0.23, finalWp.z);
    this.destMarker.visible = true;
  }

  public setMountedState(mounted: boolean) {
    this.isMounted = mounted;
    this.rebuildPlayerMesh();
  }

  public setCharacterCustomization(customization: CharacterCustomization) {
    this.customization = customization;
    this.rebuildPlayerMesh();
  }

  private rebuildPlayerMesh() {
    const oldRot = this.playerGroup ? this.playerGroup.rotation.y : 0;
    if (this.playerGroup) {
      this.scene.remove(this.playerGroup);
    }
    this.playerGroup = createExplorerUnit(this.isMounted, this.customization);
    this.playerGroup.rotation.y = oldRot;
    const y = this.getSmoothGroundY(this.playerX, this.playerZ);
    this.playerGroup.position.set(this.playerX, y, this.playerZ);
    this.scene.add(this.playerGroup);
    this.triggerBounce(this.playerGroup, 1.35);
  }

  public setPlayerTilePosition(x: number, z: number, animate: boolean = true) {
    if (animate) {
      this.movePlayerTo(x, z);
    } else {
      this.waypoints = [];
      this.playerVel.set(0, 0);
      this.playerX = x;
      this.playerZ = z;
      this.lastGridX = Math.round(x);
      this.lastGridZ = Math.round(z);
      const y = this.getSmoothGroundY(x, z);
      if (this.playerGroup) {
        this.playerGroup.position.set(x, y, z);
      }
    }
  }

  public focusCameraOn(x: number, z: number) {
    this.followPlayer = false;
    this.cameraTarget.set(
      THREE.MathUtils.clamp(x - 0.8, 0, GRID_WIDTH - 1),
      0,
      THREE.MathUtils.clamp(z + 0.8, 0, GRID_HEIGHT - 1)
    );
  }

  public recenterOnPlayer() {
    this.followPlayer = true;
    this.cameraTarget.set(this.playerX - 0.6, 0, this.playerZ + 0.6);
  }

  public adjustZoom(delta: number) {
    this.targetZoom = THREE.MathUtils.clamp(this.targetZoom + delta, 6.5, 38);
  }

  private spawnDust(x: number, y: number, z: number, count: number = 4) {
    if (this.dustParticles.length > 60) return;
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.sharedDustGeo, this.sharedDustMat);
      mesh.position.set(x + (Math.random() - 0.5) * 0.26, y + 0.05, z + (Math.random() - 0.5) * 0.26);
      this.scene.add(mesh);
      this.dustParticles.push({
        mesh,
        vel: new THREE.Vector3((Math.random() - 0.5) * 1.1, Math.random() * 1.3 + 0.35, (Math.random() - 0.5) * 1.1),
        life: 0,
        maxLife: 0.28 + Math.random() * 0.16,
      });
    }
  }

  private spawnCloudPuff(x: number, y: number, z: number) {
    if (this.dustParticles.length > 80) return;
    for (let i = 0; i < 4; i++) {
      const mesh = new THREE.Mesh(this.sharedPuffGeo, this.sharedPuffMat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.dustParticles.push({
        mesh,
        vel: new THREE.Vector3((Math.random() - 0.5) * 2.2, Math.random() * 1.8 + 0.6, (Math.random() - 0.5) * 2.2),
        life: 0,
        maxLife: 0.38 + Math.random() * 0.18,
      });
    }
  }

  private updateCameraTransform() {
    const isoDist = 42;
    this.camera.position.set(
      this.cameraCurrent.x + isoDist,
      this.cameraCurrent.y + isoDist * 1.25,
      this.cameraCurrent.z + isoDist
    );
    this.camera.lookAt(this.cameraCurrent);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / height;
    const d = this.zoomLevel;

    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
  }

  private bindEvents() {
    const el = this.renderer.domElement;

    el.addEventListener('pointerdown', (e: PointerEvent) => {
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.activePointers.size === 1) {
        this.isDragging = true;
        this.pointerDownPos = { x: e.clientX, y: e.clientY };
        this.previousPointerPos = { x: e.clientX, y: e.clientY };
      } else if (this.activePointers.size === 2) {
        const pts = Array.from(this.activePointers.values());
        this.lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    });

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.activePointers.has(e.pointerId)) return;
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.activePointers.size === 2) {
        // 2-finger pinch to zoom on mobile/trackpad
        const pts = Array.from(this.activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (this.lastPinchDist > 0) {
          const delta = (this.lastPinchDist - dist) * 0.045;
          this.targetZoom = THREE.MathUtils.clamp(this.targetZoom + delta, 6.5, 38);
        }
        this.lastPinchDist = dist;
        return;
      }

      if (this.isDragging && this.activePointers.size === 1) {
        const dx = e.clientX - this.previousPointerPos.x;
        const dy = e.clientY - this.previousPointerPos.y;
        this.previousPointerPos = { x: e.clientX, y: e.clientY };

        if (Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y) > 8) {
          this.followPlayer = false;
        }

        const scale = (this.zoomLevel / (el.clientHeight || 800)) * 2.2;
        const worldDx = (-dx + dy) * scale * 0.5;
        const worldDz = (dx + dy) * scale * 0.5;

        this.cameraTarget.x = THREE.MathUtils.clamp(this.cameraTarget.x + worldDx, -2, GRID_WIDTH + 2);
        this.cameraTarget.z = THREE.MathUtils.clamp(this.cameraTarget.z + worldDz, -2, GRID_HEIGHT + 2);
      }
    });

    const handlePointerFinish = (e: PointerEvent) => {
      this.activePointers.delete(e.pointerId);
      if (this.activePointers.size < 2) {
        this.lastPinchDist = 0;
      }
      if (this.isDragging && this.activePointers.size === 0) {
        this.isDragging = false;
        const dragDist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
        if (dragDist < 9) {
          this.handlePointerClick(e);
        }
      }
    };

    window.addEventListener('pointerup', handlePointerFinish);
    window.addEventListener('pointercancel', handlePointerFinish);

    el.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.025;
      this.targetZoom = THREE.MathUtils.clamp(this.targetZoom + zoomDelta, 6.5, 38);
    }, { passive: false });

    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.renderer.setSize(w, h);
      this.updateCameraTransform();
    });
  }

  private handlePointerClick(e: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const tileKey = hit.object.userData.tileKey;
      if (tileKey) {
        const tile = this.tileDataMap.get(tileKey);
        if (tile) {
          sound.playTileClick();
          const wasAlreadySelected = this.selectedTileKey === tileKey;
          this.selectTile(tile.x, tile.z);
          this.callbacks.onTileSelect(tile);

          // If tapping an already-selected passable tile, smoothly walk there right away
          if (wasAlreadySelected && tile.type !== 'deep_water') {
            this.movePlayerTo(tile.x, tile.z);
          }
        }
      }
    }
  }

  private updatePlayerMovement(dt: number, time: number) {
    const maxSpeed = this.isMounted ? 6.8 : 4.6;
    let desiredDirX = 0;
    let desiredDirZ = 0;

    if (this.manualInput.lengthSq() > 0.001) {
      const len = Math.min(1, this.manualInput.length());
      desiredDirX = (this.manualInput.x / this.manualInput.length()) * len;
      desiredDirZ = (this.manualInput.y / this.manualInput.length()) * len;
    } else if (this.waypoints.length > 0) {
      const target = this.waypoints[0];
      const dx = target.x - this.playerX;
      const dz = target.z - this.playerZ;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.14) {
        this.waypoints.shift();
        if (this.waypoints.length === 0) {
          this.playerX = target.x;
          this.playerZ = target.z;
          this.destMarker.visible = false;
          sound.playLand();
          if (this.callbacks.onMoveComplete) {
            this.callbacks.onMoveComplete(Math.round(this.playerX), Math.round(this.playerZ));
          }
        }
      } else {
        desiredDirX = dx / dist;
        desiredDirZ = dz / dist;
      }
    }

    // Smoothly damp velocity toward desired velocity
    const targetVx = desiredDirX * maxSpeed;
    const targetVz = desiredDirZ * maxSpeed;
    const accelLambda = desiredDirX !== 0 || desiredDirZ !== 0 ? 14 : 18;
    this.playerVel.x = THREE.MathUtils.damp(this.playerVel.x, targetVx, accelLambda, dt);
    this.playerVel.y = THREE.MathUtils.damp(this.playerVel.y, targetVz, accelLambda, dt);

    const speed = this.playerVel.length();

    if (speed > 0.03) {
      const nextX = THREE.MathUtils.clamp(this.playerX + this.playerVel.x * dt, 0, GRID_WIDTH - 1);
      const nextZ = THREE.MathUtils.clamp(this.playerZ + this.playerVel.y * dt, 0, GRID_HEIGHT - 1);

      // Slide smoothly along shoreline if colliding with deep water
      if (isTilePassable(nextX, nextZ, this.tileDataMap)) {
        this.playerX = nextX;
        this.playerZ = nextZ;
      } else if (isTilePassable(nextX, this.playerZ, this.tileDataMap)) {
        this.playerX = nextX;
        this.playerVel.y = 0;
      } else if (isTilePassable(this.playerX, nextZ, this.tileDataMap)) {
        this.playerZ = nextZ;
        this.playerVel.x = 0;
      } else {
        this.playerVel.set(0, 0);
        this.waypoints = [];
        this.destMarker.visible = false;
      }

      // Smoothly orient character toward velocity vector
      const targetYaw = Math.atan2(this.playerVel.x, this.playerVel.y);
      this.playerGroup.rotation.y = dampAngle(this.playerGroup.rotation.y, targetYaw, 15, dt);

      // Check if player crossed into a new grid tile for live fog reveal & landmark discovery
      const curGridX = Math.round(this.playerX);
      const curGridZ = Math.round(this.playerZ);
      if (curGridX !== this.lastGridX || curGridZ !== this.lastGridZ) {
        this.lastGridX = curGridX;
        this.lastGridZ = curGridZ;
        if (this.callbacks.onPlayerTileEnter) {
          this.callbacks.onPlayerTileEnter(curGridX, curGridZ);
        }
      }

      // Footstep dust & subtle step cadence sound
      this.stepDustTimer += dt * speed;
      if (this.stepDustTimer > 1.4) {
        this.stepDustTimer = 0;
        const groundY = this.getSmoothGroundY(this.playerX, this.playerZ);
        this.spawnDust(this.playerX, groundY, this.playerZ, 2);
      }

      this.stepSoundTimer += dt * speed;
      if (this.stepSoundTimer > 2.6) {
        this.stepSoundTimer = 0;
        sound.playHop();
      }
    }

    // Update smooth ground elevation
    const groundY = this.getSmoothGroundY(this.playerX, this.playerZ);
    const currentY = this.playerGroup.position.y;
    const smoothY = THREE.MathUtils.damp(currentY, groundY, 18, dt);
    this.playerGroup.position.set(this.playerX, smoothY, this.playerZ);

    // Procedural Walk / Gallop Limb Animation
    const bodyPivot = this.playerGroup.getObjectByName('body_pivot');
    if (bodyPivot) {
      const normalizedSpeed = THREE.MathUtils.clamp(speed / maxSpeed, 0, 1);
      if (normalizedSpeed > 0.05) {
        this.walkCycleTime += dt * (this.isMounted ? 14 : 11) * (0.5 + normalizedSpeed * 0.5);
      } else {
        this.walkCycleTime = THREE.MathUtils.damp(this.walkCycleTime, Math.round(this.walkCycleTime / Math.PI) * Math.PI, 10, dt);
      }

      const swing = Math.sin(this.walkCycleTime) * 0.65 * normalizedSpeed;
      const bob = Math.abs(Math.sin(this.walkCycleTime)) * (this.isMounted ? 0.09 : 0.055) * normalizedSpeed;
      const idleBreath = Math.sin(time * 2.4) * 0.012 * (1 - normalizedSpeed);

      bodyPivot.position.y = bob + idleBreath;
      bodyPivot.rotation.z = Math.cos(this.walkCycleTime) * 0.04 * normalizedSpeed;

      const legL = bodyPivot.getObjectByName('leg_l');
      const legR = bodyPivot.getObjectByName('leg_r');
      const armL = bodyPivot.getObjectByName('arm_l');
      const armR = bodyPivot.getObjectByName('arm_r');

      if (legL) legL.rotation.x = swing;
      if (legR) legR.rotation.x = -swing;
      if (armL) armL.rotation.x = -swing * 0.8;
      if (armR) armR.rotation.x = swing * 0.8;

      if (this.isMounted) {
        const fl = bodyPivot.getObjectByName('horse_leg_fl');
        const fr = bodyPivot.getObjectByName('horse_leg_fr');
        const bl = bodyPivot.getObjectByName('horse_leg_bl');
        const br = bodyPivot.getObjectByName('horse_leg_br');
        if (fl) fl.rotation.x = swing * 1.1;
        if (fr) fr.rotation.x = -swing * 1.1;
        if (bl) bl.rotation.x = -swing * 1.1;
        if (br) br.rotation.x = swing * 1.1;
      }
    }

    // Smooth camera tracking while player moves
    if (this.followPlayer && (speed > 0.04 || this.waypoints.length > 0)) {
      this.cameraTarget.x = THREE.MathUtils.damp(this.cameraTarget.x, this.playerX - 0.5, 6, dt);
      this.cameraTarget.z = THREE.MathUtils.damp(this.cameraTarget.z, this.playerZ + 0.5, 6, dt);
    }
  }

  private tick() {
    if (this.isDisposed) return;

    const now = performance.now();
    const rawDt = (now - this.lastTime) * 0.001;
    this.lastTime = now;
    const dt = Math.min(rawDt, 0.05);
    const time = (now - this.startTime) * 0.001;

    // 1. Update Smooth Player Movement & Walk Cycle
    this.updatePlayerMovement(dt, time);

    // 2. Smooth Camera Inertia & Damping
    this.cameraCurrent.x = THREE.MathUtils.damp(this.cameraCurrent.x, this.cameraTarget.x, 8.5, dt);
    this.cameraCurrent.z = THREE.MathUtils.damp(this.cameraCurrent.z, this.cameraTarget.z, 8.5, dt);
    this.zoomLevel = THREE.MathUtils.damp(this.zoomLevel, this.targetZoom, 10, dt);
    this.updateCameraTransform();

    // 3. Spring Physics for Bouncing Meshes
    for (let i = this.springNodes.length - 1; i >= 0; i--) {
      const node = this.springNodes[i];
      const displacement = node.scaleY - node.targetScaleY;
      const springForce = -160 * displacement;
      const dampingForce = -14 * node.velY;
      node.velY += (springForce + dampingForce) * dt;
      node.scaleY += node.velY * dt;

      node.object.scale.set(
        1.0 + (1.0 - node.scaleY) * 0.5,
        Math.max(0.1, node.scaleY),
        1.0 + (1.0 - node.scaleY) * 0.5
      );

      if (Math.abs(displacement) < 0.005 && Math.abs(node.velY) < 0.05) {
        node.object.scale.set(1, 1, 1);
        this.springNodes.splice(i, 1);
      }
    }

    // 4. Update Particle Pool
    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      const p = this.dustParticles[i];
      p.life += dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.vel.y -= 4.2 * dt;

      const progress = p.life / p.maxLife;
      const scale = Math.max(0.01, 1 - progress);
      p.mesh.scale.set(scale, scale, scale);

      if (p.life >= p.maxLife) {
        this.scene.remove(p.mesh);
        this.dustParticles.splice(i, 1);
      }
    }

    // 5. Ambient Landmarks Motion
    const licitarHeart = this.scene.getObjectByName('rotating_licitar_heart');
    if (licitarHeart) {
      licitarHeart.rotation.y += dt * 1.5;
    }

    const teslaSparks = this.scene.getObjectByName('tesla_sparks');
    if (teslaSparks) {
      teslaSparks.rotation.y -= dt * 4.0;
      teslaSparks.scale.setScalar(0.9 + Math.sin(time * 25) * 0.2);
    }

    const cascades = this.scene.getObjectByName('plitvice_cascades');
    if (cascades) {
      cascades.children.forEach((c, idx) => {
        c.scale.y = 0.8 + Math.sin(time * 6 + idx * 2) * 0.25;
      });
    }

    if (this.destMarker.visible) {
      this.destMarker.rotation.z += dt * 2.5;
    }

    // 6. Render
    this.renderer.render(this.scene, this.camera);

    this.frameId = requestAnimationFrame(this.tick);
  }

  public dispose() {
    this.isDisposed = true;
    cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
