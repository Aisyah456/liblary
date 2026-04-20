import { Head, Link } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';

export interface NewsItem {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    category: string | null;
    excerpt: string | null;
    body: string;
    published_at: string | null;
    is_featured: boolean;
    author_id: number | null;
    created_at: string;
    updated_at: string;
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    news: {
        data: NewsItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: PaginatorLink[];
    };
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function NewsIndex({ news }: Props) {
    const { data: items, links, last_page } = news;

    return (
        <>
            <Head title="Berita - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50"> {/* Mengubah bg sedikit abu agar efek kaca terlihat */}
                <Navbar auth={undefined} />

                <main className="pt-32 pb-16"> {/* Menambah padding top agar tidak tertutup navbar */}
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">

                        {/* HEADER SECTION DENGAN EFEK GLASSMORPHISM */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/5 border border-slate-200/60 backdrop-blur-md p-8 md:p-16 mb-16 shadow-sm">
                            {/* Dekorasi Glossy di belakang teks (Opsional, untuk estetika) */}
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>

                            <div className="relative mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                                    Berita & <span className="text-indigo-600">Pengumuman</span>
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-slate-600">
                                    Informasi terbaru seputar perpustakaan, layanan, dan kegiatan akademik di lingkungan Perpustakaan UMHT.
                                </p>
                            </div>
                        </div>

                        {/* LIST BERITA */}
                        {items.length === 0 ? (
                            <div className="rounded-[2rem] bg-white border border-slate-200 p-12 text-center shadow-sm">
                                <p className="text-slate-500 italic">Belum ada berita yang dipublikasikan.</p>
                            </div>
                        ) : (
                            <>
                                <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={`/news/${item.slug}`}
                                                className="group block h-full rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1"
                                            >
                                                {item.thumbnail && (
                                                    <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-100 mb-5">
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                )}
                                                <div className="px-2">
                                                    {item.category && (
                                                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-3">
                                                            {item.category}
                                                        </span>
                                                    )}
                                                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 transition-colors">
                                                        {item.title}
                                                    </h2>
                                                    {item.excerpt && (
                                                        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2">
                                                            {item.excerpt}
                                                        </p>
                                                    )}
                                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                                        <p className="text-xs font-medium text-slate-400">
                                                            {formatDate(item.published_at)}
                                                        </p>
                                                        <span className="text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Baca →
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* PAGINATION */}
                                {last_page > 1 && (
                                    <nav className="mt-16 flex items-center justify-center gap-3" aria-label="Pagination">
                                        {links.map((link, i) => (
                                            <span key={i}>
                                                {link.url ? (
                                                    <Link
                                                        href={link.url}
                                                        className={`inline-flex items-center justify-center min-w-11 h-11 text-sm font-bold rounded-xl border transition-all ${link.active
                                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                                                            }`}
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </Link>
                                                ) : (
                                                    <span
                                                            className="inline-flex min-w-11 h-11 items-center justify-center text-sm text-slate-300"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )}
                                            </span>
                                        ))}
                                    </nav>
                                )}
                            </>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}