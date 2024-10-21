import { render } from 'solid-js/web';
import App from './App';
import './index.css';

// Add PWA support to the app (this will add a service worker and a manifest file, you don't need to do anything else)
window.progressierAppRuntimeSettings = {
  uid: import.meta.env.VITE_PUBLIC_APP_ID,
  icon512: "https://your-icon-url.png",
  name: "Upgrade",
  shortName: "Upgrade"
};
let script = document.createElement('script');
script.setAttribute('src', 'https://progressier.app/your-progressier-id/script.js');
script.setAttribute('defer', 'true');
document.querySelector('head').appendChild(script);

render(() => <App />, document.getElementById('root'));