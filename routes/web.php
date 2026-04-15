<?php

use App\Http\Controllers\Api\LibraryFeedbackController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Cms\FeedbackController;
use App\Http\Controllers\Cms\HeroSectionController;
use App\Http\Controllers\Cms\MessageController as AdminMessageController;
use App\Http\Controllers\Cms\NewsController as AdminNewsController;
use App\Http\Controllers\Home\LandingPageController;
use App\Http\Controllers\LibraryFreeController;
use App\Http\Controllers\LibraryProfileController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\TurnitinSubmissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
Route::get('profil', [LibraryProfileController::class, 'index'])->name('profil.index');

/*
| Layanan Routes
*/
Route::prefix('layanan')->group(function () {
    Route::inertia('sirkulasi', 'layanan/sirkulasi')->name('sirkulasi');
    Route::inertia('ruang-baca', 'layanan/ruang_baca')->name('ruang-baca');
    Route::inertia('form-bebas-pustaka', 'layanan/form-pustaka')->name('form-bebas-pustaka');
    Route::inertia('cek-turnitin', 'layanan/turnitin')->name('cek-turnitin');
    Route::inertia('e-journal', 'layanan/journals')->name('e-journal');

    // Bebas Pustaka - Public Submission
    Route::resource('bebas-pustaka', LibraryFreeController::class)->only(['index', 'store']);

    // Turnitin - Public Submission
    Route::get('form-cek-turnitin', [TurnitinSubmissionController::class, 'create'])->name('form-cek-turnitin.create');
    Route::post('form-cek-turnitin/store', [TurnitinSubmissionController::class, 'store'])->name('form-cek-turnitin.store');


    Route::get('kontak', [App\Http\Controllers\Api\MessageController::class, 'index'])->name('kontak');
});

/*
| API Routes
*/
Route::prefix('api')->name('api.')->group(function () {
    Route::post('/library-feedback', [LibraryFeedbackController::class, 'store'])->name('feedback.store');
    Route::get('/services', [App\Http\Controllers\Api\ServiceController::class, 'index'])->name('services.index');
    Route::post('/kontak/send', [App\Http\Controllers\Api\MessageController::class, 'store'])->name('messages.send');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Admin & CMS)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {


    // Admin Resources Group
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Cms\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('partners', App\Http\Controllers\PartnerController::class);
        Route::post('news/{news}', [AdminNewsController::class, 'update'])->name('news.update.post');
        Route::resource('news', AdminNewsController::class);

        //masih dalam maintenance articel
        Route::resource('articles', App\Http\Controllers\Api\ArticleController::class);
        //masih dalam penyesuaian
        Route::resource('services', App\Http\Controllers\ServiceController::class);
        //masih perbaikan di profile
        Route::resource('profile', App\Http\Controllers\ProfilController::class);
        //masih dalam maintenance 
        Route::get('/messages', [AdminMessageController::class, 'index'])->name('messages.index');

        // Turnitin Process
        Route::post('turnitin/results', [App\Http\Controllers\TurnitinProcessController::class, 'storeResult'])->name('turnitin.results.store');
        Route::resource('turnitin', App\Http\Controllers\TurnitinProcessController::class);
        Route::resource('feedback', App\Http\Controllers\Cms\FeedbackController::class);
    });

    // CMS Management Group
    Route::prefix('cms')->name('cms.')->group(function () {

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

        Route::resource('library-feedback', LibraryFeedbackController::class)->only(['index', 'show', 'destroy']);

        // Turnitin Sub-System CMS
        Route::prefix('turnitin')->name('turnitin.')->group(function () {
            Route::resource('submissions', App\Http\Controllers\SubmissionController::class);
            Route::post('results', [App\Http\Controllers\SubmissionController::class, 'storeResult'])->name('results.store');
            Route::get('download/{id}', [App\Http\Controllers\SubmissionController::class, 'downloadFile'])->name('download');
            Route::resource('process', App\Http\Controllers\TurnitinProcessController::class);
        });

        // Other Admin Services
        Route::resources([
            'references'         => App\Http\Controllers\BookReferenceController::class,
            'library-clearances' => App\Http\Controllers\LibraryClearanceController::class,
            'loans'              => App\Http\Controllers\LoanController::class,
            'eresource-access'   => App\Http\Controllers\EresourceAccesController::class,
        ]);

        // Internal CMS API
        Route::get('/api/majors/{facultyId}', [App\Http\Controllers\LibraryFreeController::class, 'getMajors'])->name('api.majors');
    });
});

require __DIR__ . '/settings.php';
