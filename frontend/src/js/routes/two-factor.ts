// This file defines the routes for the two-factor authentication settings page.

export function show(): string {
    return '/user/two-factor-authentication';
}

export function qrCode(): string {
    return '/user/two-factor-qr-code';
}

export function secretKey(): string {
    return '/user/two-factor-secret-key';
}

export function recoveryCodes(): string {
    return '/user/two-factor-recovery-codes';
}

export function regenerateRecoveryCodes(): string {
    return '/user/two-factor-recovery-codes';
}