import { Icons } from '../utils/icons.js';
import { appState } from '../state.js';

export class NavigationComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.tabs = [
      { id: 'home', label: 'Home', icon: Icons.home },
      { id: 'upload', label: 'Upload', icon: Icons.upload },
      { id: 'enhance', label: 'Enhance', icon: Icons.auto_fix_high },
      { id: 'reagents', label: 'Reagents', icon: Icons.science },
      { id: 'scope', label: 'Scope', icon: Icons.psychology }
    ];
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <nav class="m3-bottom-nav">
        ${this.tabs.map(tab => `
          <button class="nav-item ${tab.id === appState.get('activeTab') ? 'active' : ''}" data-tab="${tab.id}">
            <div class="nav-pill-indicator">${tab.icon}</div>
            <span class="nav-label">${tab.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-item');
      if (!btn) return;
      appState.navigateTo(btn.dataset.tab);
    });

    appState.on('activeTab', (tab) => {
      this.container.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tab);
      });
    });
  }
}
