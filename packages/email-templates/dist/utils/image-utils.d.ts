/**
 * Convert an image file to base64 data URI for email embedding
 */
export declare function imageToDataUri(imagePath: string, mimeType: string): string;
/**
 * Get image data URI for email templates
 * Images are loaded from @ui/assets/images and converted to base64 data URIs
 *
 * @param imageName - Name of the image
 */
export declare function getImageDataUri(imageName: string): string;
