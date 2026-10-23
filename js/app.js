import { appState } from './state.js';
import { NavigationComponent } from './components/navigation.js';
import { HomeView } from './components/homeView.js';
import { UploadView } from './components/uploadView.js';
import { EnhanceView } from './components/enhanceView.js';
import { ReagentsView } from './components/reagentsView.js';
import { ScopeView } from './components/scopeView.js';
import { Icons } from './utils/icons.js';

class App {
  constructor() {
    this.initViews();
    this.initStatusBarClock();
    this.initDesktopControls();
  }

  initViews() {
    const nav = document.getElementById('bottom-nav-container');
    if (nav) new NavigationComponent(nav);

    const home = document.getElementById('screen-home');
    if (home) new HomeView(home);

    const upload = document.getElementById('screen-upload');
    if (upload) new UploadView(upload);

    const enhance = document.getElementById('screen-enhance');
    if (enhance) new EnhanceView(enhance);

    const reagents = document.getElementById('screen-reagents');
    if (reagents) new ReagentsView(reagents);

    const scope = document.getElementById('screen-scope');
    if (scope) new ScopeView(scope);
  }

  initStatusBarClock() {
    const timeEl = document.getElementById('status-time');
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      if (timeEl) timeEl.textContent = `${hours}:${mins}`;
    };
    updateTime();
    setInterval(updateTime, 30000);
  }

  initDesktopControls() {
    const frameBtn = document.getElementById('toggle-frame-btn');
    const themeBtn = document.getElementById('toggle-theme-desktop-btn');
    const mockup = document.querySelector('.phone-mockup');

    frameBtn?.addEventListener('click', () => {
      mockup?.classList.toggle('fullscreen');
      frameBtn.classList.toggle('active');
    });

    themeBtn?.addEventListener('click', () => {
      const current = appState.get('theme');
      const next = current === 'dark' ? 'light' : 'dark';
      appState.set('theme', next);
      document.documentElement.setAttribute('data-theme', next);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.__app = new App();
});
