import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import OldApp from './old/App.tsx';
import Reading from './Reading.tsx';
import VibeCoding from './VibeCoding.tsx';
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

  if (currentPath.startsWith('/old')) {
    return <OldApp />;
  }

  if (currentPath.startsWith('/reading')) {
    return <Reading />;
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

