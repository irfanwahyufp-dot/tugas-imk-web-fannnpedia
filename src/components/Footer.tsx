import React from "react";
import { ShieldCheck, MessageSquare, Mail, Instagram, Compass, BookOpen, Heart, AlertCircle, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050409] text-neutral-400 pt-16 pb-8 px-4 md:px-8 border-t border-neutral-900/60 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* SEO Description paragraph */}
        <div className="text-left text-xs md:text-sm text-neutral-400 space-y-4 max-w-5xl leading-relaxed border-b border-neutral-900 pb-10">
          <p>
            <span className="font-extrabold text-white">Fannpedia</span> Tempat Joki Game &amp; Jasa Tugas Termurah dan Sahabat Para Gamers Penuhi Kebutuhan
          </p>
          <p>
            Jadilah bagian dari komunitas gamers terbesar dan terpercaya dengan Fannpedia! Jangan Lupa Follow Sosial Media Kita Dapatkan info dan promo menarik
          </p>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left text-sm pt-4">
          
          {/* Column 1: Peta Situs */}
          <div className="space-y-4">
            <h4 className="text-amber-400 font-extrabold uppercase tracking-wide text-xs">Peta Situs</h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Beranda</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Masuk</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Daftar</a></li>
            </ul>
          </div>

          {/* Column 2: Layanan Populer */}
          <div className="space-y-4">
            <h4 className="text-amber-400 font-extrabold uppercase tracking-wide text-xs">Layanan Populer</h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Joki Mobile Legends</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Jasa Tugas Kuliah</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Jasa Desain Grafis</a></li>
            </ul>
          </div>

          {/* Column 3: Dukungan */}
          <div className="space-y-4">
            <h4 className="text-amber-400 font-extrabold uppercase tracking-wide text-xs">Dukungan</h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Hubungi Admin</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">WhatsApp CS</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">FAQ &amp; Testimoni</a></li>
            </ul>
          </div>

          {/* Column 4: SOCIAL MEDIA (Daftar Akun yang Sudah Diringkas) */}
          <div className="space-y-4">
            <h4 className="text-amber-400 font-extrabold uppercase tracking-wide text-xs">SOCIAL MEDIA</h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li>
                <a 
                  href="https://www.tiktok.com/@ptrfann_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-amber-400 transition-colors"
                >
                  Tiktok Fannpedia | Joki mlbb &amp; Tugas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Youtube Fannpedia Official
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/ptrfann_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-amber-400 transition-colors"
                >
                  Instagram Fannpedia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Discord Fannpedia
                </a>
              </li>
            </ul>
            
            {/* Bagian Icon Cepat */}
            <div className="flex space-x-4 text-neutral-400 pt-2 border-t border-neutral-900/60 mt-3">
              <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
                ⚡ Fannpedia Official
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-neutral-900/60 pt-8 text-center text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Fannpedia. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}