<?php


use App\Http\Controllers\Cms\MessageController as AdminMessageController;
use App\Http\Controllers\Cms\NewsController as AdminNewsController;
use App\Http\Controllers\Home\LandingPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public / Visitor Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [LandingPageController::class, 'index'])->name('home');

// News & Articles
Route::controller(App\Http\Controllers\NewsController::class)->group(function () {
    Route::get('news', 'index')->name('news.index');
    Route::get('news/{slug}', 'show')->name('news.show')->where('slug', '[a-z0-9\-]+');
});
Route::get('/articles', [App\Http\Controllers\ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{article:slug}', [App\Http\Controllers\ArticleController::class, 'show'])->name('articles.show');

Route::get('profil', [App\Http\Controllers\LibraryProfileController::class, 'index'])->name('profil.index');

/*
| Layanan Routes
*/
Route::prefix('layanan')->group(function () {
    Route::inertia('sirkulasi', 'layanan/sirkulasi')->name('sirkulasi');
    Route::inertia('ruang-baca', 'layanan/ruang_baca')->name('ruang-baca');
    Route::inertia('form-bebas-pustaka', 'layanan/form-pustaka')->name('form-bebas-pustaka');
    Route::inertia('cek-turnitin', 'layanan/turnitin')->name('cek-turnitin');
    Route::inertia('e-journal', 'layanan/journals')->name('e-journal');



    Route::resource('bebas-pustaka', App\Http\Controllers\LibraryFreeController::class);

    // Turnitin - Public Submission
    Route::get('form-cek-turnitin', [App\Http\Controllers\TurnitinSubmissionController::class, 'create'])->name('form-cek-turnitin.create');
    Route::post('form-cek-turnitin/store', [App\Http\Controllers\TurnitinSubmissionController::class, 'store'])->name('form-cek-turnitin.store');


    Route::get('kontak', [App\Http\Controllers\Api\MessageController::class, 'index'])->name('kontak');
});

/*
| API Routes
*/
Route::prefix('api')->name('api.')->group(function () {
    Route::post('/library-feedback', [App\Http\Controllers\Api\LibraryFeedbackController::class, 'store'])->name('feedback.store');
    Route::get('/services', [App\Http\Controllers\Api\ServiceController::class, 'index'])->name('services.index');
    Route::post('/kontak/send', [App\Http\Controllers\Api\MessageController::class, 'store'])->name('messages.send');
});



/*
|--------------------------------------------------------------------------
| Authenticated Routes (Admin & CMS)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\Cms\DashboardController::class, 'index'])->name('dashboard');

    // Global Admin Group (Semua diakses via /admin/...)
    Route::prefix('admin')->name('admin.')->group(function () {

        // --- Dashboard & Core Admin ---

        Route::get('/messages', [AdminMessageController::class, 'index'])->name('messages.index');
        Route::patch('/messages/{message}', [AdminMessageController::class, 'update'])->name('messages.update');
        Route::delete('/messages/{message}', [AdminMessageController::class, 'destroy'])->name('messages.destroy');

        // --- News & Articles ---
        Route::post('news/{news}', [AdminNewsController::class, 'update'])->name('news.update.post');
        Route::resource('news', AdminNewsController::class);
        Route::resource('articles', App\Http\Controllers\Api\ArticleController::class);

        Route::resource('bebas-pustaka', App\Http\Controllers\Cms\LibraryFreeController::class)
            ->parameters(['bebas-pustaka' => 'library_free']);

        // --- Basic Resources ---
        Route::resources([
            'partners' => App\Http\Controllers\PartnerController::class,
            'services' => App\Http\Controllers\ServiceController::class,
            'profile'  => App\Http\Controllers\ProfilController::class,
            'feedback' => App\Http\Controllers\Cms\FeedbackController::class,
        ]);
        Route::resource('reference-services', App\Http\Controllers\ReferenceServiceController::class)
            ->only(['destroy']);
        Route::put('/hero/{hero}', [App\Http\Controllers\Cms\HeroSectionController::class, 'update'])->name('hero.update');

        Route::resources([
            'hero'               => App\Http\Controllers\Cms\HeroSectionController::class,
            'student'            => App\Http\Controllers\StudentController::class,
            'lecturers'          => App\Http\Controllers\LecturerController::class,
            'memberships'        => App\Http\Controllers\MembershipController::class,
            'books'              => App\Http\Controllers\BookController::class,
            'ebooks'             => App\Http\Controllers\EbookController::class,
            'scientific-works'   => App\Http\Controllers\ScientificWorkController::class,
            'shelves'            => App\Http\Controllers\ShelfController::class,
            'borrowings'         => App\Http\Controllers\BorrowingController::class,
            'references'         => App\Http\Controllers\BookReferenceController::class,
            'library-clearances' => App\Http\Controllers\LibraryClearanceController::class,
            'loans'              => App\Http\Controllers\LoanController::class,
            'eresource-access'   => App\Http\Controllers\EresourceAccesController::class,
        ]);

        Route::resource('library-feedback', App\Http\Controllers\Api\LibraryFeedbackController::class)
            ->only(['index', 'show', 'destroy']);

        Route::get('/usulkan-buku', [App\Http\Controllers\Cms\PublicBookProposalController::class, 'create'])->name('public.book-proposal.create');
        Route::post('/usulkan-buku', [App\Http\Controllers\Cms\PublicBookProposalController::class, 'store'])->name('public.book-proposal.store');

        // --- Turnitin System ---
        Route::prefix('turnitin')->name('turnitin.')->group(function () {
            // Core Turnitin
            Route::post('results/store-direct', [App\Http\Controllers\TurnitinProcessController::class, 'storeResult'])->name('results.store_direct');
            Route::resource('process', App\Http\Controllers\TurnitinProcessController::class);


            // Submission Management
            Route::resource('submissions', App\Http\Controllers\SubmissionController::class);
            Route::post('results', [App\Http\Controllers\SubmissionController::class, 'storeResult'])->name('results.store');
            Route::get('download/{id}', [App\Http\Controllers\SubmissionController::class, 'downloadFile'])->name('download');
        });

        // --- Internal API Helpers ---
        Route::get('/api/majors/{facultyId}', [App\Http\Controllers\LibraryFreeController::class, 'getMajors'])->name('api.majors');
    });
});
require __DIR__ . '/settings.php';
