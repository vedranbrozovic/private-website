import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import OldApp from './old/App.tsx';
import Reading from './Reading.tsx';
import VibeCoding from './VibeCoding.tsx';
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

  if (currentPath.startsWith('/old')) {
    return <OldApp />;
  }

  if (currentPath.startsWith('/reading')) {
    return <Reading />;
  }

  if (currentPath.startsWith('/vibecoding')) {
    return <VibeCoding />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
