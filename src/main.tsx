import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import OldApp from './old/App.tsx';
import Reading from './Reading.tsx';
import VibeCoding from './VibeCoding.tsx';
import CrotopiaApp from './crotopia/App.tsx';
import NbaGameApp from './nbagame/NbaGameApp.tsx';
import AcapEmailApp from './acap/AcapEmailApp.tsx';
import AnalyticsDashboard from './analytics/AnalyticsDashboard.tsx';
import { trackPageView } from './analytics/tracker.ts';
import {
  EducationPage,
  WorkPage,
  NonprofitPage,
  BallIsLifePage,
  BlogPage,
  FilmPage
} from './TopicPages.tsx';
import './index.css';

function Root() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    trackPageView(currentPath);
  }, [currentPath]);

  if (currentPath.toLowerCase().startsWith('/analytics')) {
    return <AnalyticsDashboard />;
  }

  if (currentPath.startsWith('/old')) {
    return <OldApp />;
  }

  if (currentPath.startsWith('/reading')) {
    return <Reading />;
  }

  if (currentPath.startsWith('/vibecoding/crotopia')) {
    return <CrotopiaApp />;
  }

  if (currentPath.startsWith('/vibecoding/nbagame')) {
    return <NbaGameApp />;
  }

  if (currentPath.toLowerCase().startsWith('/vibecoding/acapemail')) {
    return <AcapEmailApp />;
  }

  if (currentPath.startsWith('/vibecoding')) {
    return <VibeCoding />;
  }

  if (currentPath.startsWith('/education')) {
    return <EducationPage />;
  }

  if (currentPath.startsWith('/work')) {
    return <WorkPage />;
  }

  if (currentPath.startsWith('/nonprofit')) {
    return <NonprofitPage />;
  }

  if (currentPath.startsWith('/ballislife')) {
    return <BallIsLifePage />;
  }

  if (currentPath.startsWith('/blog')) {
    return <BlogPage />;
  }

  if (currentPath.startsWith('/film')) {
    return <FilmPage />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

