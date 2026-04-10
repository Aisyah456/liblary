<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


use App\Http\Controllers\Home\LandingPageController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Cms\HeroSectionController;
use App\Http\Controllers\Cms\FeedbackController;
use App\Http\Controllers\Api\LibraryFeedbackController;

/*
|--------------------------------------------------------------------------
| Public / Visitor Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [LandingPageController::class, 'index'])->name('home');

// News & Articles
Route::controller(NewsController::class)->group(function () {
    Route::get('news', 'index')->name('news.index');
    Route::get('news/{slug}', 'show')->name('news.show')->where('slug', '[a-z0-9\-]+');
});
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');

// Profil
Route::get('profil', [ProfilController::class, 'index'])->name('profil.index');

/* | Layanan Static Routes (Direct Inertia Render)
*/
Route::prefix('layanan')->group(function () {
    Route::inertia('sirkulasi', 'layanan/sirkulasi')->name('sirkulasi');
    Route::inertia('ruang-baca', 'layanan/ruang_baca')->name('ruang-baca');
    Route::inertia('bebas-pustaka', 'layanan/bebas-pustaka')->name('pustakas');
    Route::inertia('form-bebas-pustaka', 'layanan/form-pustaka')->name('form-bebas-pustaka');
    Route::inertia('cek-turnitin', 'layanan/turnitin')->name('cek-turnitin');

    Route::get('/form-cek-turnitin', [App\Http\Controllers\TurnitinSubmissionController::class, 'create'])->name('form-cek-turnitin.create');
    Route::post('/form-cek-turnitin/store', [App\Http\Controllers\TurnitinSubmissionController::class, 'store'])->name('form-cek-turnitin.store');


    Route::inertia('e-journal', 'layanan/journals')->name('e-journal');
    Route::inertia('form-pustaka', 'layanan/form-pustaka')->name('form-pustaka');
    Route::get('kontak', [App\Http\Controllers\Api\MessageController::class, 'index'])->name('messages.index');
});

/*
| API / Feedback Routes
*/
Route::prefix('api')->group(function () {
    Route::post('/library-feedback', [LibraryFeedbackController::class, 'store']);
    Route::get('/services', [App\Http\Controllers\Api\ServiceController::class, 'index']);
    Route::post('/kontak/send', [App\Http\Controllers\Api\MessageController::class, 'store'])->name('messages.store');
});

/*
|--------------------------------------------------------------------------
| Admin / CMS Routes (Authenticated)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('dashboard', fn() => Inertia::render('Dashboard'))->name('Dashboard');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::prefix('admin')->group(function () {
            Route::resource('partners', App\Http\Controllers\PartnerController::class);
            Route::resource('articles', App\Http\Controllers\Api\ArticleController::class);
            Route::resource('services', App\Http\Controllers\ServiceController::class);
            Route::post('news/{news}', [App\Http\Controllers\Cms\NewsController::class, 'update'])->name('news.update.post');
            Route::resource('news', App\Http\Controllers\Cms\NewsController::class);
            Route::get('/messages', [App\Http\Controllers\Cms\MessageController::class, 'index'])->name('messages.index');
            Route::resource('turnitin', App\Http\Controllers\TurnitinProcessController::class);
        });
    });

    // CMS Management Group
    Route::prefix('cms')->group(function () {

        // Resources Utama
        Route::resources([
            'hero'             => HeroSectionController::class,
     
            'student'          => App\Http\Controllers\StudentController::class,
            'lecturers'        => App\Http\Controllers\LecturerController::class,
            'memberships'      => App\Http\Controllers\MembershipController::class,
            'books'            => App\Http\Controllers\BookController::class,
            'ebooks'           => App\Http\Controllers\EbookController::class,
            'scientific-works' => App\Http\Controllers\ScientificWorkController::class,
            'shelves'          => App\Http\Controllers\ShelfController::class,
            'borrowings'       => App\Http\Controllers\BorrowingController::class,
            'bebas-pustaka'    => App\Http\Controllers\LibraryFreeController::class,
           
        ]);

        // Feedback Management
        Route::resource('feedback', FeedbackController::class);
        Route::resource('library-feedback', LibraryFeedbackController::class)->only(['index', 'show', 'destroy']);

        // Turnitin Sub-System
        Route::prefix('turnitin')->name('turnitin.')->group(function () {
            Route::resource('submissions', App\Http\Controllers\SubmissionController::class);
            Route::post('results', [App\Http\Controllers\SubmissionController::class, 'storeResult'])->name('results.store');
            Route::get('download/{id}', [App\Http\Controllers\SubmissionController::class, 'downloadFile'])->name('download');
            Route::resource('process', App\Http\Controllers\TurnitinProcessController::class);
        });

        // Other Library Admin Services
        Route::resources([
            'references'         => App\Http\Controllers\BookReferenceController::class,
            'library-clearances' => App\Http\Controllers\LibraryClearanceController::class,
            'loans'              => App\Http\Controllers\LoanController::class,
            'eresource-access'   => App\Http\Controllers\EresourceAccesController::class,
        ]);

        // API Internal for CMS
        Route::get('/api/majors/{facultyId}', [App\Http\Controllers\LibraryFreeController::class, 'getMajors']);
    });
});

require __DIR__ . '/settings.php';
