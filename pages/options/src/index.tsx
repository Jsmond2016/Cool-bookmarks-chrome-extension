import { createRoot } from 'react-dom/client';
import '@src/index.css';
import '@extension/ui/dist/global.css';
// import Options from '@src/Options';
import LayoutContainer from './layoutContainer';
import { HashRouter } from 'react-router';
function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(
    <HashRouter>
      <LayoutContainer />
    </HashRouter>,
  );
}

init();
