<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\OrganizationsController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\SubmissionsController;
use Illuminate\Support\Facades\Route;

// Auth

Route::get('login', [LoginController::class, 'create'])
    ->name('login')
    ->middleware('guest');

Route::post('login', [LoginController::class, 'store'])
    ->name('login.store')
    ->middleware('guest');

Route::delete('logout', [LoginController::class, 'destroy'])
    ->name('logout');

// Dashboard

Route::get('/', [DashboardController::class, 'index'])
    ->name('dashboard')
    ->middleware('auth');

Route::get('/submissions/{submission}', [SubmissionsController::class, 'index'])
    ->name('submissions')
    ->middleware('auth');

    
//Chat
    
Route::get('chat', [ChatController::class, 'index'])
->name('chat')
->middleware('auth');

Route::post('chat', [ChatController::class, 'store'])
->name('chat.store')
->middleware('auth');