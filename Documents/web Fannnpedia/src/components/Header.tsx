import React from "react";
import { motion } from "motion/react";
import { Gamepad2, ShieldCheck, Search, PhoneCall, Instagram, BookOpen } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const menuItems = [
    { id: "joki", label: "Joki Game MLBB", icon: Gamepad2 },
    { id: "tugas", label: "Jasa Tugas & Desain", icon: BookOpen },
    { id: "cek", label: "Cek Transaksi", icon: Search },
    { id: "faq", label: "FAQ & Testimoni", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07060f]/80 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 md:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab("joki")}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-violet-700 shadow-[0_2px_15px_rgba(139,92,246,0.3)]">
            <Gamepad2 className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400">
              FANN<span className="text-white font-medium">PEDIA</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
              Gaming &amp; Academic Specialist
            </span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? "text-cyan-400 font-bold glow-cyan" 
                    : "text-neutral-300 hover:text-white hover:bg-neutral-900/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-neutral-400"}`} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Contacts Quick Link */}
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="https://instagram.com/ptrfann_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-pink-500 hover:border-pink-500/50 transition-colors"
            title="Follow Instagram @ptrfann_"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/6282146733143"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white font-black text-xs md:text-sm hover:from-violet-500 hover:to-violet-600 hover:shadow-[0_4px_15px_rgba(139,92,246,0.4)] transition-all duration-200"
          >
            <PhoneCall className="w-3.5 h-3.5 stroke-[2.5] text-white" />
            <span className="hidden sm:inline">Hubungi WA</span>
          </a>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex justify-around mt-3 pt-2 border-t border-neutral-800/80">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-md transition-colors ${
                isActive ? "text-cyan-400 font-semibold" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
