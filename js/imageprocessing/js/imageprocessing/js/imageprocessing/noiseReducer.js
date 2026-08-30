export class NoiseReducer {
  static apply(grayBuffer, width, height, intensity = 30) {
    if (intensity <= 0) return new Float32Array(grayBuffer);

    const len = width * height;
    const output = new Float32Array(len);
    const radius = intensity > 60 ? 2 : 1;
    const sigmaSpace = 1.5 + (intensity / 100) * 1.5;
    const sigmaColor = 15.0 + (intensity / 100) * 45.0;

    const twoSigmaSpaceSq = 2 * sigmaSpace * sigmaSpace;
    const twoSigmaColorSq = 2 * sigmaColor * sigmaColor;

    const spatialKernel = [];
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const distSq = dx * dx + dy * dy;
        spatialKernel.push({ dx, dy, weight: Math.exp(-distSq / twoSigmaSpaceSq) });
      }
    }

    for (let y = 0; y < height; y++) {
      const yOffset = y * width;
      for (let x = 0; x < width; x++) {
        const centerIdx = yOffset + x;
        const centerVal = grayBuffer[centerIdx];
        let sumWeights = 0, sumIntensity = 0;

        for (let k = 0; k < spatialKernel.length; k++) {
          const { dx, dy, weight: sWeight } = spatialKernel[k];
          const nx = x + dx, ny = y + dy;

          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neighborVal = grayBuffer[ny * width + nx];
            const diff = centerVal - neighborVal;
            const rWeight = Math.exp(-(diff * diff) / twoSigmaColorSq);
            const totalWeight = sWeight * rWeight;
            sumWeights += totalWeight;
            sumIntensity += neighborVal * totalWeight;
          }
        }
        output[centerIdx] = sumWeights > 0 ? sumIntensity / sumWeights : centerVal;
      }
    }
    return output;
  }
}
