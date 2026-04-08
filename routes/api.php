<?php

use Illuminate\Support\Facades\Route;

Route::get('/get-majors/{facultyId}', [\App\Http\Controllers\Api\MajorController::class, 'getMajors']);
Route::get('/news', [\App\Http\Controllers\Api\NewsController::class, 'index']);
Route::post('/library-feedback', [\App\Http\Controllers\Api\LibraryFeedbackController::class, 'store']);
Route::post('/kontak/send', [App\Http\Controllers\Api\MessageController::class, 'store'])->name('messages.store');