export class FileHandler {
  static MAX_PROCESSING_WIDTH = 1600;
  static MAX_PROCESSING_HEIGHT = 1600;

  static calculateDimensions(origW, origH) {
    let targetW = origW;
    let targetH = origH;
    let isDownscaled = false;

    if (origW > this.MAX_PROCESSING_WIDTH || origH > this.MAX_PROCESSING_HEIGHT) {
      const ratio = Math.min(this.MAX_PROCESSING_WIDTH / origW, this.MAX_PROCESSING_HEIGHT / origH);
      targetW = Math.max(64, Math.round(origW * ratio));
      targetH = Math.max(64, Math.round(origH * ratio));
      isDownscaled = true;
    }
    return { targetWidth: targetW, targetHeight: targetH, isDownscaled };
  }

  static async loadAndScaleImage(file) {
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Selected file is not a valid image.');
    }

    let bitmap = null;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch (e) {
      console.warn('createImageBitmap fallback', e);
    }

    if (bitmap) {
      const origW = bitmap.width;
      const origH = bitmap.height;
      const { targetWidth, targetHeight, isDownscaled } = this.calculateDimensions(origW, origH);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close();

      return {
        canvas,
        metadata: {
          name: file.name,
          size: this.formatFileSize(file.size),
          originalDimensions: `${origW} × ${origH} px`,
          processingDimensions: `${targetWidth} × ${targetHeight} px`,
          isDownscaled
        }
      };
    }

    const objectUrl = URL.createObjectURL(file);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;
        const { targetWidth, targetHeight, isDownscaled } = this.calculateDimensions(origW, origH);

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        resolve({
          canvas,
          metadata: {
            name: file.name,
            size: this.formatFileSize(file.size),
            originalDimensions: `${origW} × ${origH} px`,
            processingDimensions: `${targetWidth} × ${targetHeight} px`,
            isDownscaled
          }
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image.'));
      };
      img.src = objectUrl;
    });
  }

  static formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }

  static downloadCanvas(canvas, filename = 'fingerprint_enhanced.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
