<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    AuthenticatedSessionController,
    EmailVerificationNotificationController,
    NewPasswordController,
    PasswordResetLinkController,
    RegisteredUserController,
    VerifyEmailController
};

// Guest routes
Route::middleware('guest')->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

// Authenticated routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
