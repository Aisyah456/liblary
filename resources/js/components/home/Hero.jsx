import React from 'react';
import { GraduationCap, CheckCircle2, Library, Sparkles } from 'lucide-react';

export default function Hero({ hero }) {
    if (!hero) return null; 

    return (
        <section className="relative min-h-[600px] flex items-center bg-[#fdfeff] pt-20 pb-16 overflow-hidden">
            
            {/* --- KREASI BACKGROUND BARU --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Lingkaran Cahaya Utama (Animated) */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 to-purple-200/30 blur-[120px] rounded-full animate-pulse"></div>
                
                {/* Aksen Gradasi Lembut di Kiri Bawah */}
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-indigo-100/50 to-blue-50/20 blur-[100px] rounded-full"></div>

                {/* Pola Grid Halus Modern */}
                <div className="absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
                     style={{ backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
                </div>

                {/* Elemen Geometris Floating (Glassmorphism Effect) */}
                <div className="absolute top-1/4 left-10 w-12 h-12 border-2 border-blue-200/50 rounded-lg rotate-12 hidden lg:block animate-bounce" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-1/4 right-20 w-16 h-16 border-2 border-purple-200/40 rounded-full hidden lg:block animate-pulse"></div>
            </div>
            {/* --- END BACKGROUND --- */}

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Sisi Teks */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-white mb-8">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            <span className="text-[11px] text-slate-800 font-bold tracking-widest uppercase">
                                {hero.badge_text}
                            </span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                            {hero.title_line_1} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
                                {hero.title_highlight}
                            </span>
                        </h1>

                        <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
                            {hero.subtitle}
                        </p>

                        {/* Fitur Kecil */}
                        <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-green-50 rounded-full border border-green-100">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-slate-700 font-semibold text-sm">Akses 24/7 Digital</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-purple-50 rounded-full border border-purple-100">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="text-slate-700 font-semibold text-sm">AI Recommendation</span>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Gambar dengan Efek Stacked Card */}
                    <div className="relative">
                        <div className="relative z-10 group perspective-1000">
                            {/* Dekorasi Bingkai di belakang gambar */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-all duration-700"></div>
                            
                            {/* Main Image Container */}
                            <div className="relative rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
                                <img 
                                    src={hero.image_path.startsWith('http') ? hero.image_path : `/${hero.image_path}`} 
                                    alt={hero.title_line_1} 
                                    className="w-full object-cover aspect-[4/3] lg:aspect-[5/6] transform transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                            </div>

                            {/* Floating Stats Card (Glassmorphism) */}
                            <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white">
                                        <Library className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900 leading-none">
                                            {hero.stats_value}
                                        </p>
                                        <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                                            {hero.stats_label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}