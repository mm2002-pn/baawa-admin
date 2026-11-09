import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const landingHosts = ['baawa-sn.com', 'www.baawa-sn.com']
if (landingHosts.includes(window.location.hostname)) {
  window.location.replace('/landing.html')
} else {
  createRoot(document.getElementById('root')!).render(<App />)
}
