import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'

// @ts-expect-error updateSW is used for future PWA update notifications
const updateSW = registerSW({
  onNeedRefresh() {
    // Optional: Show a toast to user
  },
  onOfflineReady() {
    console.log('App is ready for offline work');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
