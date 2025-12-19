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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__schemaInitialized = void 0;
// Shared Drizzle schema for both Experience + SSO APIs
__exportStar(require("./products"), exports);
__exportStar(require("./product-plans"), exports);
__exportStar(require("./tenant"), exports);
__exportStar(require("./role"), exports);
__exportStar(require("./user-account"), exports);
__exportStar(require("./tenant-product-subscriptions"), exports);
__exportStar(require("./product-entitlements"), exports);
__exportStar(require("./product-role"), exports);
__exportStar(require("./user-product-permissions"), exports);
__exportStar(require("./zoho-billing-config"), exports);
__exportStar(require("./file"), exports);
__exportStar(require("./audit-event"), exports);
__exportStar(require("./password-reset-token"), exports);
__exportStar(require("./refresh-token"), exports);
__exportStar(require("./authorization-codes"), exports);
__exportStar(require("./mfa"), exports);
__exportStar(require("./sso-sessions"), exports);
__exportStar(require("./country"), exports);
__exportStar(require("./state"), exports);
__exportStar(require("./relations"), exports);
__exportStar(require("./billing-address-details"), exports);
__exportStar(require("./invoice"), exports);
__exportStar(require("./payment-transaction"), exports);
__exportStar(require("./user-notification-preferences"), exports);
exports.__schemaInitialized = true;
