/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import JokiForm from "./components/JokiForm";
import JokiTugas from "./components/JokiTugas";
import CekTransaksi from "./components/CekTransaksi";
import FaqTestimoni from "./components/FaqTestimoni";
import Footer from "./components/Footer";
import MeteorBackground from "./components/MeteorBackground";
import PromoModal from "./components/PromoModal";
import { JokiOrder } from "./types";
import { MOCK_ORDERS } from "./data";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Gamepad2, ShieldCheck, Trophy, BadgeAlert } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("joki");
  const [orders, setOrders] = useState<JokiOrder[]>([]);

  // Initialize orders state from localStorage or mock seed data
  useEffect(() => {
    const saved = localStorage.getItem("fannzz_joki_orders");
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        setOrders(MOCK_ORDERS);
      }
    } else {
      setOrders(MOCK_ORDERS);
      localStorage.setItem("fannzz_joki_orders", JSON.stringify(MOCK_ORDERS));
    }
  }, []);

  // Persist added orders
  const handleAddOrder = (newOrder: JokiOrder) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem("fannzz_joki_orders", JSON.stringify(updated));
  };

  const handleStartOrdering = () => {
    setActiveTab("joki");
    setTimeout(() => {
      const container = document.getElementById("order-form-container");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-white relative overflow-hidden">
      
      {/* Meteor Shooting Star Background Animation */}
      <MeteorBackground />

      {/* High-Impact Announcement & Contact Advertisement Popup */}
      <PromoModal />

      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 border-b border-violet-500/20 py-2 px-4 text-center shadow-lg relative z-10">
        <p className="text-[10px] md:text-xs font-mono font-bold text-white tracking-wider uppercase animate-pulse flex items-center justify-center gap-1.5">
          <Trophy className="w-4 h-4 text-white shrink-0" />
          FANNPEDIA: JASA JOKI PRO PLAYER &amp; TUGAS TERPERCAYA • HUBUNGI ADMIN WA 082146733143 • INSTAGRAM @PTRFANN_
        </p>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Container */}
      <main className="flex-1 relative z-10">
        {/* Render Hero and JokiForm on "joki" tab */}
        <AnimatePresence mode="wait">
          {activeTab === "joki" && (
            <motion.div
              key="joki-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Hero onStartOrdering={handleStartOrdering} />
              <JokiForm onOrderSuccess={handleAddOrder} scrollToTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === "tugas" && (
            <motion.div
              key="tugas-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <JokiTugas onOrderSuccess={handleAddOrder} scrollToTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === "cek" && (
            <motion.div
              key="cek-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <CekTransaksi orders={orders} />
            </motion.div>
          )}

          {activeTab === "faq" && (
            <motion.div
              key="faq-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <FaqTestimoni />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Trust seal bottom bar */}
      <div className="bg-neutral-900/60 border-t border-b border-neutral-800/80 backdrop-blur-md py-8 relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/50 hover:border-violet-500/30 transition-all duration-300">
            <span className="text-sm font-extrabold text-cyan-400 flex items-center gap-1.5 justify-center">🔐 Amanah & Legal</span>
            <span className="text-[11px] text-neutral-400 font-medium">100% Bebas Banned, Aman & Garansi</span>
          </div>
          <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/50 hover:border-violet-500/30 transition-all duration-300">
            <span className="text-sm font-extrabold text-cyan-400 flex items-center gap-1.5 justify-center">💰 Harga Termurah</span>
            <span className="text-[11px] text-neutral-400 font-medium">Mulai Rp 1.500 / Bintang, Sering Diskon</span>
          </div>
          <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/50 hover:border-violet-500/30 transition-all duration-300">
            <span className="text-sm font-extrabold text-cyan-400 flex items-center gap-1.5 justify-center">⚡ Super Cepat</span>
            <span className="text-[11px] text-neutral-400 font-medium">Layanan Dipegang Pro Player & Kilat</span>
          </div>
          <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/50 hover:border-violet-500/30 transition-all duration-300">
            <span className="text-sm font-extrabold text-cyan-400 flex items-center gap-1.5 justify-center">📞 Layanan 24 Jam</span>
            <span className="text-[11px] text-neutral-400 font-medium">WhatsApp CS Responsif & Friendly</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
