import { Head, Link } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';

export interface NewsDetail {
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
    author?: { id: number; name: string } | null;
}

interface Props {
    news: NewsDetail;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function NewsShow({ news }: Props) {
    return (
        <>
            <Head title={`${news.title} - Berita Perpustakaan UMHT`} />

            <div className="min-h-screen bg-white">
                <Navbar auth={undefined} />

                <main className="pt-24 pb-16">
                    <article className="mx-auto max-w-3xl px-6 lg:px-8">
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-8"
                        >
                            <span aria-hidden>←</span> Kembali ke Berita
                        </Link>

                        {news.category && (
                            <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                                {news.category}
                            </span>
                        )}

                        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            {news.title}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            <time dateTime={news.published_at ?? undefined}>
                                {formatDate(news.published_at)}
                            </time>
                            {news.author?.name && (
                                <span>Oleh {news.author.name}</span>
                            )}
                        </div>

                        {news.thumbnail && (
                            <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-slate-100">
                                <img
                                    src={`/storage/${news.thumbnail}`}
                                    alt={news.title || "Thumbnail"}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        {news.excerpt && (
                            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
                                {news.excerpt}
                            </p>
                        )}

                        <div className="mt-8 prose prose-slate max-w-none prose-headings:font-bold prose-p:text-slate-700 prose-a:text-indigo-600">
                            {news.body.includes('<') ? (
                                <div dangerouslySetInnerHTML={{ __html: news.body }} />
                            ) : (
                                news.body.split(/\n\n+/).map((para, i) => (
                                    <p key={i} className="text-slate-700 leading-relaxed">
                                        {para}
                                    </p>
                                ))
                            )}
                        </div>
                    </article>
                </main>

                <Footer />
            </div>
        </>
    );
}
