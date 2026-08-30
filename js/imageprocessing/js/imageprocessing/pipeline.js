import { ContrastProcessor } from './contrastProcessor.js';
import { NoiseReducer } from './noiseReducer.js';
import { RidgeSharpener } from './ridgeSharpener.js';
import { ClarityScoreCalculator } from './clarityCalculator.js';

export class EnhancementPipeline {
  static async process(sourceCanvas, params = { contrast: 65, noiseReduction: 35, ridgeSharpening: 60 }, onProgress = null) {
    const startTime = performance.now();
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
    const rawImageData = sourceCtx.getImageData(0, 0, width, height);
    const initialGray = ContrastProcessor.toGrayscale(rawImageData);
    const rawScoreResult = ClarityScoreCalculator.calculate(initialGray, width, height);

    if (onProgress) onProgress('Normalizing lighting...');
    await new Promise(r => setTimeout(r, 0));
    const normGray = ContrastProcessor.normalizeIllumination(initialGray, width, height, 18);

    if (onProgress) onProgress('Applying local contrast...');
    await new Promise(r => setTimeout(r, 0));
    const claheEnhanced = ContrastProcessor.applyCLAHE(normGray, width, height, params.contrast);

    if (onProgress) onProgress('Denoising background...');
    await new Promise(r => setTimeout(r, 0));
    const denoised = NoiseReducer.apply(claheEnhanced, width, height, params.noiseReduction);

    if (onProgress) onProgress('Sharpening ridges...');
    await new Promise(r => setTimeout(r, 0));
    const sharpened = RidgeSharpener.apply(denoised, width, height, params.ridgeSharpening);
    const ridgeMapCanvas = RidgeSharpener.generateRidgeMap(sharpened, width, height);

    const enhancedScoreResult = ClarityScoreCalculator.calculate(sharpened, width, height);

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outCtx = outputCanvas.getContext('2d');
    const outImageData = outCtx.createImageData(width, height);
    const outData = outImageData.data;

    for (let i = 0, j = 0; i < outData.length; i += 4, j++) {
      const val = Math.round(sharpened[j]);
      outData[i] = val; outData[i + 1] = val; outData[i + 2] = val; outData[i + 3] = 255;
    }
    outCtx.putImageData(outImageData, 0, 0);

    const endTime = performance.now();
    const timeMs = Math.round(endTime - startTime);
    const delta = enhancedScoreResult.score - rawScoreResult.score;

    return {
      enhancedCanvas: outputCanvas,
      ridgeMapCanvas: ridgeMapCanvas,
      clarityScore: {
        rawScore: rawScoreResult.score,
        enhancedScore: enhancedScoreResult.score,
        delta: delta >= 0 ? `+${delta}` : `${delta}`,
        deltaNum: delta,
        metrics: enhancedScoreResult.metrics,
        hasCalculated: true
      },
      timeMs
    };
  }
}
