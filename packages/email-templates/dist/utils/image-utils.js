"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToDataUri = imageToDataUri;
exports.getImageDataUri = getImageDataUri;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Get the path to the @ui package assets
 */
function getUiAssetsPath() {
    try {
        // Resolve from email-templates package to ui package
        // email-templates is at: packages/email-templates
        // ui is at: packages/ui
        const emailTemplatesRoot = path.resolve(__dirname, '..', '..');
        const packagesRoot = path.resolve(emailTemplatesRoot, '..');
        const uiAssetsPath = path.join(packagesRoot, 'ui', 'assets', 'images');
        return uiAssetsPath;
    }
    catch (error) {
        console.error('Failed to resolve UI assets path:', error);
        return '';
    }
}
/**
 * Convert an image file to base64 data URI for email embedding
 */
function imageToDataUri(imagePath, mimeType) {
    try {
        const fullPath = path.isAbsolute(imagePath)
            ? imagePath
            : path.resolve(imagePath);
        const imageBuffer = fs.readFileSync(fullPath);
        const base64 = imageBuffer.toString('base64');
        return `data:${mimeType};base64,${base64}`;
    }
    catch (error) {
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
function getImageDataUri(imageName) {
    const uiAssetsPath = getUiAssetsPath();
    if (!uiAssetsPath) {
        console.warn('Failed to resolve UI assets path');
        return '';
    }
    const imageMap = {
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
