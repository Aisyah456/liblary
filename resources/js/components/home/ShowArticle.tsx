import { Head, Link } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import { Calendar, User, ArrowLeft, Clock, Eye } from 'lucide-react';

// 1. Definisi Interface Sinkron dengan Database articles
interface Article {
    id: number;
    title: string;
    slug: string;
    category: 'Berita Utama' | 'Akademik' | 'Koleksi' | 'Event' | 'Layanan';
    excerpt: string;
    content: string;
    thumbnail: string | null;
    reading_time: number;
    views: number;
    created_at: string;
    author?: {
        name: string;
    } | null;
}

interface Props {
    article: Article;
    auth?: any;
}

export default function NewsShow({ article, auth }: Props) {
    // 2. Helper Formatter Tanggal
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <>
            <Head title={`${article.title} - Warta Literasi`} />

            <Navbar auth={auth} />

            <main className="pt-32 pb-20 bg-slate-50/50 min-h-screen">
                <article className="mx-auto max-w-4xl px-6">

                    {/* Breadcrumb / Back - Diubah ke /articles sesuai permintaan sebelumnya */}
                    <Link
                        href="/articles"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-10 hover:text-indigo-700 transition-colors"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Warta Literasi
                    </Link>

                    {/* Header Section */}
                    <header className="mb-10 text-center">
                        {article.category && (
                            <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-100">
                                {article.category}
                            </span>
                        )}

                        <h1 className="mt-6 text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-slate-500 border-y border-slate-200/60 w-full py-5">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-indigo-500" />
                                <span>{formatDate(article.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-indigo-500" />
                                <span>{article.reading_time} Menit Baca</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-indigo-500" />
                                <span>{article.views.toLocaleString('id-ID')} Dilihat</span>
                            </div>
                            {article.author && (
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-indigo-500" />
                                    <span>{article.author.name}</span>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Thumbnail Section */}
                    {article.thumbnail && (
                        <div className="mb-12 overflow-hidden rounded-3xl shadow-2xl border border-white">
                            <img
                                src={article.thumbnail.startsWith('http') ? article.thumbnail : `/storage/${article.thumbnail}`}
                                alt={article.title}
                                className="w-full h-auto object-cover max-h-125"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000';
                                }}
                            />
                        </div>
                    )}

                    {/* Content Section */}
                    {/* Menggunakan bg-white card style agar teks lebih mudah dibaca */}
                    <div className="bg-white p-8 md:p-12 rounded-4xl shadow-sm border border-slate-100">
                        <div
                            className="prose prose-lg prose-indigo max-w-none 
                                prose-headings:text-slate-900 prose-headings:font-bold
                                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                                prose-img:rounded-2xl prose-img:shadow-lg
                                prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-slate-900 prose-blockquote:border-l-indigo-500
                                prose-blockquote:bg-indigo-50/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl"
                        >
                            {/* Render HTML Content */}
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>

                        {/* Tag/Footer Artikel */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-slate-400 text-sm italic">
                                Terakhir diperbarui: {formatDate(article.created_at)}
                            </p>
                            <div className="flex gap-2">
                                {/* Bisa ditambahkan tombol Share di sini */}
                            </div>
                        </div>
                    </div>

                </article>
            </main>

            <Footer />
        </>
    );
}