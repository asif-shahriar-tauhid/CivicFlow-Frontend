/**
 * Client-side image utility to convert and compress user-uploaded photos
 * (JPEG, PNG, HEIC) to WebP format for optimal loading performance,
 * reduced bandwidth, and fast field uploads.
 */

export interface ProcessedImageResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
}

/**
 * Converts an image file to WebP format using HTML5 Canvas.
 * Falls back to original file if browser does not support WebP canvas export.
 */
export async function convertToWebP(
  file: File,
  quality = 0.85,
  maxDimension = 1920,
): Promise<ProcessedImageResult> {
  // If it's already a small WebP or PDF, return as is
  if (file.type === "application/pdf") {
    return {
      file,
      previewUrl: "",
      originalSize: file.size,
      compressedSize: file.size,
      savedPercentage: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image."));
      img.onload = () => {
        let { width, height } = img;

        // Resize proportionally if dimensions exceed maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({
            file,
            previewUrl: event.target?.result as string,
            originalSize: file.size,
            compressedSize: file.size,
            savedPercentage: 0,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                previewUrl: event.target?.result as string,
                originalSize: file.size,
                compressedSize: file.size,
                savedPercentage: 0,
              });
              return;
            }

            // Construct new file name with .webp extension
            const originalName = file.name.replace(/\.[^/.]+$/, "");
            const webpFile = new File([blob], `${originalName}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const compressedSize = webpFile.size;
            const savedPercentage = Math.max(
              0,
              Math.round((1 - compressedSize / originalSize) * 100),
            );

            const previewUrl = URL.createObjectURL(webpFile);

            resolve({
              file: webpFile,
              previewUrl,
              originalSize,
              compressedSize,
              savedPercentage,
            });
          },
          "image/webp",
          quality,
        );
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Batch converts an array of files into WebP images.
 */
export async function convertBatchToWebP(
  files: File[],
  quality = 0.85,
): Promise<ProcessedImageResult[]> {
  return Promise.all(files.map((file) => convertToWebP(file, quality)));
}
