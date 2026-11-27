import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// The Astryx reset is the site's only stylesheet import: every other
// rule is StyleX, in App.tsx and the theme.
import '@astryxdesign/core/reset.css';

import {App} from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('missing #root container');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
