import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import OldApp from './old/App.tsx';
import './index.css';

const isOld = window.location.pathname.startsWith('/old');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isOld ? <OldApp /> : <App />}
  </StrictMode>,
);
