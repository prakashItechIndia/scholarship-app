import * as fs from 'fs';
import * as path from 'path';

/**
 * Get the path to the @ui package assets
 */
function getUiAssetsPath(): string {
  try {
    // Resolve from email-templates package to ui package
    // email-templates is at: packages/email-templates
    // ui is at: packages/ui
    const emailTemplatesRoot = path.resolve(__dirname, '..', '..');
    const packagesRoot = path.resolve(emailTemplatesRoot, '..');
    const uiAssetsPath = path.join(packagesRoot, 'ui', 'assets', 'images');
    return uiAssetsPath;
  } catch (error) {
    console.error('Failed to resolve UI assets path:', error);
    return '';
  }
}

/**
 * Convert an image file to base64 data URI for email embedding
 */
export function imageToDataUri(imagePath: string, mimeType: string): string {
  try {
    const fullPath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(imagePath);
    const imageBuffer = fs.readFileSync(fullPath);
    const base64 = imageBuffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to load image: ${imagePath}`, error);
    return '';
  }
}

/**
 * Get image data URI for email templates
 * Images are loaded from @ui/assets/images and converted to base64 data URIs
 * 
 * @param imageName - Name of the image
 */
export function getImageDataUri(imageName: string): string {
  const uiAssetsPath = getUiAssetsPath();
  if (!uiAssetsPath) {
    console.warn('Failed to resolve UI assets path');
    return '';
  }

  const imageMap: Record<
    string,
    { fileName: string; mimeType: string }[]
  > = {
    'icaptur-logo': [
      { fileName: 'icaptur-logo.png', mimeType: 'image/png' },
      { fileName: 'icaptur-logo.svg', mimeType: 'image/svg+xml' },
    ],
    'itech-logo': [
      { fileName: 'itech-logo.png', mimeType: 'image/png' },
      { fileName: 'itech-logo.svg', mimeType: 'image/svg+xml' },
    ],
    'invitation-illustration': [
      { fileName: 'invitation-illustration.png', mimeType: 'image/png' },
    ],
    'copy-icon': [{ fileName: 'copy-icon.png', mimeType: 'image/png' }],
    // fallback icons we might reuse for other emails
    'rocket-hero': [{ fileName: 'rocket.png', mimeType: 'image/png' }],
  };

  const variants = imageMap[imageName];
  if (!variants) {
    console.warn(`Image not found: ${imageName}`);
    return '';
  }

  for (const variant of variants) {
    const imagePath = path.join(uiAssetsPath, variant.fileName);
    if (fs.existsSync(imagePath)) {
      return imageToDataUri(imagePath, variant.mimeType);
    }
  }

  console.warn(`No existing variants for image: ${imageName}`);
  return '';
}

