import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageSquare, Phone, Shield, ArrowRight, ExternalLink } from "lucide-react";

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user set "dont show again"
    const hideModal = localStorage.getItem("dont_show_fannnpedia_promo_v1");
    if (!hideModal) {
      // Show popup after 1.5 seconds for maximum impact
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("dont_show_fannnpedia_promo_v1", "true");
    }
    setIsOpen(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDontShowAgain(e.target.checked);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="promo-popup-modal">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-full max-w-lg bg-[#0c0a15] border-2 border-amber-500/30 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center flex flex-col max-h-[90vh] z-10"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-950/60 border border-neutral-800 hover:bg-rose-500 hover:border-rose-400 hover:text-white text-neutral-400 flex items-center justify-center cursor-pointer transition-all duration-200"
              aria-label="Tutup Iklan"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Violet Header with custom logo */}
            <div className="relative py-8 px-6 bg-gradient-to-b from-violet-500/20 via-violet-500/5 to-transparent flex flex-col items-center">
              {/* Badge Emblem Logo */}
              <div className="w-16 h-16 rounded-2xl bg-neutral-950 border-2 border-violet-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-4 animate-bounce">
                <span className="text-2xl font-black font-display text-white italic tracking-tighter flex items-center">
                  F<span className="text-cyan-400 font-sans font-extrabold text-xl">⚡</span>P
                </span>
              </div>

              {/* Promo Slogan styled after Fannnpedia */}
              <h2 className="text-2xl md:text-3xl font-black font-display text-cyan-400 tracking-tight leading-tight uppercase max-w-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Bungkus Dan Push Rank Terbaik Kalian
              </h2>
              <div className="h-1 w-20 bg-cyan-500 rounded-full mt-3" />
            </div>

            {/* Inner Content Body */}
            <div className="px-6 pb-6 space-y-6 overflow-y-auto flex-1">
              {/* Official Button */}
              <a
                href="https://wa.me/6282146733143"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-black text-sm md:text-base transition-all duration-200 shadow-[0_4px_12px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 group uppercase border-b-4 border-neutral-300"
              >
                Kontak Resmi Fannnpedia
                <ArrowRight className="w-4 h-4 text-neutral-950 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Admin Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Admin Joki Solo Card */}
                <div className="bg-neutral-950/80 border border-violet-500/25 rounded-2xl p-4 flex flex-col items-center justify-between space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Admin Joki MLBB Solo</span>
                  <a
                    href="https://wa.me/6282146733143"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 border border-emerald-500/40 hover:border-emerald-400 hover:bg-neutral-850 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400/10 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>+62 821-4673-3143</span>
                  </a>
                </div>

                {/* Admin Joki Mabar Card */}
                <div className="bg-neutral-950/80 border border-violet-500/25 rounded-2xl p-4 flex flex-col items-center justify-between space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Admin Joki MLBB Mabar</span>
                  <a
                    href="https://wa.me/6285878210649"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 border border-emerald-500/40 hover:border-emerald-400 hover:bg-neutral-850 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400/10 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>+62 858-7821-0649</span>
                  </a>
                </div>
              </div>

              {/* Sub branding header */}
              <div className="pt-2">
                <span className="px-3 py-1 bg-white text-neutral-950 text-[10px] font-black uppercase rounded-md tracking-wider">
                  Fannnpedia
                </span>
                <p className="text-xs font-extrabold text-neutral-200 mt-3 leading-tight tracking-wide">
                  JASA JOKI FAST FANNNPEDIA STORE
                </p>
                <a
                  href="https://wa.me/6282146733143"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline mt-1.5 inline-block cursor-pointer flex items-center justify-center gap-1"
                >
                  Klik Di Sini Brader
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Lower Footer with check mark */}
            <div className="bg-neutral-950 p-4 border-t border-neutral-900 flex items-center justify-center gap-2">
              <label className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded bg-neutral-900 border-neutral-800 text-cyan-500 focus:ring-cyan-500/20 cursor-pointer"
                />
                Jangan tampilkan lagi
              </label>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
