export class ClarityScoreCalculator {
  static calculate(grayBuffer, width, height) {
    const len = width * height;
    if (len === 0) return { score: 0, metrics: { contrast: 0, separation: 0, sharpness: 0, snr: 0 } };

    let sum = 0, sumSq = 0;
    const hist = new Int32Array(256);

    for (let i = 0; i < len; i++) {
      const val = Math.max(0, Math.min(255, Math.round(grayBuffer[i])));
      sum += val;
      sumSq += val * val;
      hist[val]++;
    }

    const mean = sum / len;
    const variance = sumSq / len - mean * mean;
    const stdDev = Math.sqrt(Math.max(0, variance));
    const contrastMetric = Math.min(100, Math.round((stdDev / 68.0) * 100));

    let tenengradSum = 0, gradientCount = 0;
    for (let y = 1; y < height - 1; y += 2) {
      const yPrev = (y - 1) * width, yCurr = y * width, yNext = (y + 1) * width;
      for (let x = 1; x < width - 1; x += 2) {
        const gx = (grayBuffer[yPrev + x + 1] + 2 * grayBuffer[yCurr + x + 1] + grayBuffer[yNext + x + 1]) -
                   (grayBuffer[yPrev + x - 1] + 2 * grayBuffer[yCurr + x - 1] + grayBuffer[yNext + x - 1]);
        const gy = (grayBuffer[yNext + x - 1] + 2 * grayBuffer[yNext + x] + grayBuffer[yNext + x + 1]) -
                   (grayBuffer[yPrev + x - 1] + 2 * grayBuffer[yPrev + x] + grayBuffer[yPrev + x + 1]);
        tenengradSum += gx * gx + gy * gy;
        gradientCount++;
      }
    }

    const avgTenengrad = gradientCount > 0 ? tenengradSum / gradientCount : 0;
    const sharpnessMetric = Math.min(100, Math.round((Math.sqrt(avgTenengrad) / 150.0) * 100));

    let totalWeight = len, sumAll = 0;
    for (let t = 0; t < 256; t++) sumAll += t * hist[t];
    let sumB = 0, wB = 0, varMax = 0;

    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = totalWeight - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB, mF = (sumAll - sumB) / wF;
      const betweenVar = wB * wF * (mB - mF) * (mB - mF);
      if (betweenVar > varMax) varMax = betweenVar;
    }

    const totalVar = variance * totalWeight * totalWeight;
    const separationRatio = totalVar > 0 ? (varMax / totalVar) : 0;
    const separationMetric = Math.min(100, Math.round(separationRatio * 110));

    let overSharpenPenalty = 0;
    if (sharpnessMetric > 88 && separationMetric < 70) {
      overSharpenPenalty = (sharpnessMetric - 88) * 0.8;
    }

    const snrEstimate = Math.max(15, 100 - (100 - contrastMetric) * 0.4 - overSharpenPenalty);
    const snrMetric = Math.min(100, Math.round(snrEstimate));

    const composite = (sharpnessMetric * 0.35 + separationMetric * 0.30 + contrastMetric * 0.25 + snrMetric * 0.10 - overSharpenPenalty);
    const finalScore = Math.max(10, Math.min(99, Math.round(composite)));

    return {
      score: finalScore,
      metrics: { contrast: contrastMetric, separation: separationMetric, sharpness: sharpnessMetric, snr: snrMetric }
    };
  }
}
