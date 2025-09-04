import '@Assets/App.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import Router from './Router.tsx';

registerSW({
  onNeedRefresh() { },
  onOfflineReady() { },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
