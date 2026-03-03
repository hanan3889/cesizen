// This file defines the routes for the two-factor authentication settings page.

export function show(): string {
    return '/user/two-factor-authentication';
}

export function qrCode(): string {
    // This should correspond to an API endpoint that returns the QR code SVG or data
    return '/user/two-factor-qr-code';
}
