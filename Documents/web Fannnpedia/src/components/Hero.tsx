import React from "react";
import { motion } from "motion/react";
import { Sparkles, Gamepad2, Play, Users, Trophy, ChevronRight, Zap } from "lucide-react";
import { ServiceType } from "../types";

// Import custom generated high-quality Mobile Legends thematic images
import imgRankStar from "../assets/images/mlbb_rank_star_1784114588719.jpg";
import imgPaketTier from "../assets/images/mlbb_paket_tier_1784114602008.jpg";
import imgMabarGendong from "../assets/images/mlbb_mabar_gendong_1784114615863.jpg";
import imgClassicBrawl from "../assets/images/mlbb_classic_brawl_1784114632478.jpg";
import imgWinrateHero from "../assets/images/mlbb_winrate_hero_1784114646228.jpg";
import imgMagicChess from "../assets/images/mlbb_magic_chess_1784114658952.jpg";

interface HeroProps {
  onStartOrdering: () => void;
}

export default function Hero({ onStartOrdering }: HeroProps) {
  // Game categories matched exactly to Image 2, all focused exclusively on Mobile Legends
  const popularProducts = [
    {
      id: "joki_star",
      title: "Joki Rank Per Star",
      developer: "Mobile Legends",
      image: imgRankStar,
      service: ServiceType.PER_STAR,
      badge: "POPULER",
      isAvailable: true
    },
    {
      id: "joki_paket",
      title: "Joki Rank Paket Tier",
      developer: "Mobile Legends",
      image: imgPaketTier,
      service: ServiceType.PAKET,
      badge: "BEST VALUE",
      isAvailable: true
    },
    {
      id: "joki_gendong",
      title: "Jasa Mabar Gendong",
      developer: "Mobile Legends",
      image: imgMabarGendong,
      service: ServiceType.GENDONG,
      badge: "FUN MABAR",
      isAvailable: true
    },
    {
      id: "joki_classic",
      title: "Joki Classic & Brawl",
      developer: "Mobile Legends",
      image: imgClassicBrawl,
      service: ServiceType.CLASSIC_BRAWL,
      badge: "WINRATE UP",
      isAvailable: true
    },
    {
      id: "joki_winrate",
      title: "Joki Winrate Hero",
      developer: "Mobile Legends",
      image: imgWinrateHero,
      service: ServiceType.CLASSIC_BRAWL,
      badge: "SPECIAL REQ",
      isAvailable: true
    },
    {
      id: "joki_chess",
      title: "Joki Magic Chess",
      developer: "Mobile Legends",
      image: imgMagicChess,
      service: ServiceType.PER_STAR,
      badge: "ARCADE MODE",
      isAvailable: false // Served manually via WA
    }
  ];

  const handleProductClick = (product: typeof popularProducts[0]) => {
    if (product.isAvailable) {
      // Set the active joki service type on the form via custom window event
      window.dispatchEvent(
        new CustomEvent("set-joki-service-type", { detail: product.service })
      );
      // Trigger scroll using the provided app callback
      onStartOrdering();
    }
  };

  return (
    <section className="relative px-4 md:px-8 pt-6 pb-12 max-w-7xl mx-auto space-y-12">
      
      {/* 1. SLIDER PROMO BANNER (Exactly styled like Image 2 top slider) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden w-full rounded-3xl border border-neutral-850/60 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 md:p-8 lg:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
      >
        {/* Background glow and lightning-bolt decorative overlay */}
        <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-violet-500/[0.05] via-transparent to-transparent pointer-events-none" />
        
        {/* Abstract metallic diagonal lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonal-stripes" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="#7c3aed" strokeWidth="4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />
          </svg>
        </div>

        {/* Banner content layout */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 text-left">
          
          {/* Left Column: Visual game phone overlay */}
          <div className="md:col-span-4 hidden md:flex justify-center relative">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-[190px] h-[340px] bg-neutral-950 border-4 border-neutral-800 rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                {/* Inner screen simulation */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#110e20] to-[#040306] opacity-90" />
                <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-cyan-400 font-mono">
                    <span>Fannpedia</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  
                  {/* Simulated Game Card Grid in the phone */}
                  <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                      <span className="text-[9px] font-black block text-cyan-400">STAR JOKI</span>
                      <span className="text-[8px] text-neutral-300 block">Rp 1.500/Star</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                      <span className="text-[9px] font-black block text-purple-400">PAKET TIER</span>
                      <span className="text-[8px] text-neutral-300 block">Hemat s/d 20%</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-[9px] font-black block text-blue-400">MABAR CS</span>
                      <span className="text-[8px] text-neutral-300 block">With Pro Players</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                      <span className="text-[9px] font-black block text-amber-400">JOKI TUGAS</span>
                      <span className="text-[8px] text-neutral-300 block">Tugas Akademik</span>
                    </div>
                  </div>

                  <div className="py-1 rounded bg-cyan-500 text-neutral-950 text-[10px] font-black text-center uppercase tracking-wider">
                    Verified Seller
                  </div>
                </div>
              </div>
              {/* Absolute badge floating */}
              <div className="absolute -bottom-2 -right-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 border border-violet-400/40 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-lg transform rotate-12 flex items-center gap-1 z-20">
                <Zap className="w-3 h-3 text-yellow-300 animate-bounce" />
                99% Winrate
              </div>
            </motion.div>
          </div>

          {/* Right Column: Dynamic Headline exactly like the second screenshot */}
          <div className="md:col-span-8 flex flex-col justify-center items-start space-y-5">
            <span className="inline-block bg-violet-600 text-white font-black text-[11px] md:text-xs tracking-wider px-3 py-1 rounded-md uppercase border-b-2 border-violet-800">
              NEW PRODUCT JOKI MOBILE LEGEND, JOKI TUGAS &amp; DESIGN
            </span>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight uppercase">
              Push Rank <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 glow-cyan">Super Kilat</span> &amp; Hemat!
            </h1>

            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-xl">
              Fannpedia menyediakan Jasa Joki Rank Mobile Legends yang dikerjakan oleh tim profesional dengan winrate joki minimal 85% (Tersedia Joki Rank, Gendong Mabar, &amp; Classic/Brawl). Tidak hanya game, kami juga siap membantu menyelesaikan tugas sekolah/kuliahmu lewat Jasa Joki Tugas, serta melayani Jasa Desain Grafis berkualitas tinggi. Semua aman, cepat, dan terpercaya. Langsung order sekarang!
            </p>

            {/* Glowing Order Disini Button */}
            <button
              onClick={onStartOrdering}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white font-black text-sm uppercase tracking-wider hover:from-violet-500 hover:to-violet-600 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300 shadow-xl cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white stroke-none" />
              Order Disini
            </button>
          </div>

        </div>
      </motion.div>


      {/* 2. "POPULER SEKARANG!" GRID SECTION (Precisely formatted like Image 2) */}
      <div className="space-y-6">
        
        {/* Section Heading with flame and neat description */}
        <div className="text-left space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="text-xl">🔥</span> POPULER SEKARANG!
          </h2>
          <p className="text-xs md:text-sm text-neutral-400">
            Berikut adalah beberapa produk yang paling populer saat ini.
          </p>
        </div>

        {/* 6 Grid cards styled exactly like the screenshot: grayscale overlay portrait + solid violet text banner at bottom */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularProducts.map((p, idx) => {
            const isLink = !p.isAvailable;
            const motionProps = {
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: idx * 0.05 },
            };
            const commonClassName = "group cursor-pointer rounded-2xl overflow-hidden border border-neutral-850 bg-neutral-950/60 shadow-lg flex flex-col justify-between h-[220px] md:h-[240px] relative hover:border-cyan-500/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]";

            const cardContent = (
              <>
                {/* Product Badge */}
                <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-neutral-950/80 border border-neutral-800 text-[9px] font-black uppercase text-cyan-400 rounded-md">
                  {p.badge}
                </span>

                {/* Game Character Portrait background - grayscale by default, colored on hover */}
                <div className="absolute inset-0 w-full h-[75%] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                  {/* Shading overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/20" />
                </div>

                {/* Empty spacing for background visibility */}
                <div className="flex-1" />

                {/* SOLID VIOLET/CYAN TEXT BANNER AT BOTTOM (Matches screenshot signature perfectly) */}
                <div className="bg-violet-600 group-hover:bg-violet-500 text-white p-2.5 min-h-[60px] flex flex-col justify-center items-start text-left relative z-10 transition-colors duration-200">
                  {/* Slanted subtle cut design on the banner top */}
                  <div className="absolute -top-1.5 left-0 right-0 h-2 bg-violet-600 group-hover:bg-violet-500 transform -skew-y-1 border-none" />
                  
                  <h3 className="text-[11px] md:text-xs font-black uppercase tracking-tight leading-tight line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-[9px] font-bold text-cyan-300 opacity-90 mt-0.5">
                    {p.developer}
                  </p>
                </div>
              </>
            );

            if (isLink) {
              const waTextForProduct = `Halo Fannpedia, saya ingin memesan *${p.title}* secara manual.`;
              return (
                <motion.a
                  key={p.id}
                  href={`https://wa.me/6282146733143?text=${encodeURIComponent(waTextForProduct)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...motionProps}
                  className={commonClassName}
                >
                  {cardContent}
                </motion.a>
              );
            }

            return (
              <motion.div
                key={p.id}
                onClick={() => handleProductClick(p)}
                {...motionProps}
                className={commonClassName}
              >
                {cardContent}
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
