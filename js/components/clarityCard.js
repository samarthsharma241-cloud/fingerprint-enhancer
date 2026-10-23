import { Icons } from '../utils/icons.js';
import { appState } from '../state.js';

export class ClarityScoreCard {
  constructor(containerEl) {
    this.container = containerEl;
    this.render();
  }

  render() {
    const clarity = appState.get('clarityScore');
    const isEnhanced = clarity.hasCalculated;
    const score = isEnhanced ? clarity.enhancedScore : clarity.rawScore || 0;
    const rawScore = clarity.rawScore || 0;
    const delta = isEnhanced ? clarity.delta : '+0';
    const metrics = clarity.metrics || { contrast: 0, separation: 0, sharpness: 0, snr: 0 };
    const strokeDash = `${score}, 100`;

    this.container.innerHTML = `
      <div class="clarity-score-card">
        <div class="clarity-header">${Icons.auto_awesome} Clarity Score</div>
        <div class="clarity-meter-wrap">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <defs>
              <linearGradient id="clarityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" /><stop offset="100%" stop-color="#06b6d4" />
              </linearGradient>
            </defs>
            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="circle-progress" stroke-dasharray="${strokeDash}" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
          <div class="meter-inner-content">
            <span class="score-number">${score}</span>
            <span class="score-max">/ 100</span>
          </div>
        </div>

        <div class="clarity-comparison-row">
          <div class="score-comparison-pill">Before: <strong>${rawScore}</strong>/100</div>
          <div class="score-comparison-pill">After: <strong>${score}</strong>/100</div>
        </div>

        ${isEnhanced ? `<div class="score-delta-badge">${Icons.check_circle} Improvement: ${delta} pts</div>` : ''}

        <div class="clarity-metrics-grid">
          <div class="metric-factor-item"><div class="metric-factor-name"><span>Sharpness</span><strong>${metrics.sharpness}%</strong></div><div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${metrics.sharpness}%;"></div></div></div>
          <div class="metric-factor-item"><div class="metric-factor-name"><span>Separation</span><strong>${metrics.separation}%</strong></div><div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${metrics.separation}%;"></div></div></div>
          <div class="metric-factor-item"><div class="metric-factor-name"><span>Contrast</span><strong>${metrics.contrast}%</strong></div><div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${metrics.contrast}%;"></div></div></div>
          <div class="metric-factor-item"><div class="metric-factor-name"><span>SNR</span><strong>${metrics.snr}%</strong></div><div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${metrics.snr}%;"></div></div></div>
        </div>
      </div>
    `;
  }
}
