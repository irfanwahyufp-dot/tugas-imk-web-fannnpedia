import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JokiOrder, OrderStatus } from "../types";
import { Search, History, HelpCircle, ShieldAlert, CheckCircle, Clock, XCircle, Gamepad2, Sparkles, MessageSquare } from "lucide-react";

interface CekTransaksiProps {
  orders: JokiOrder[];
}

export default function CekTransaksi({ orders }: CekTransaksiProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<JokiOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    if (!searchQuery.trim()) {
      setSearchedOrder(null);
      return;
    }

    const found = orders.find(
      (o) => o.id.trim().toLowerCase() === searchQuery.trim().toLowerCase()
    );

    setSearchedOrder(found || null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case OrderStatus.PROCESSING:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
            <Gamepad2 className="w-3.5 h-3.5 animate-spin" />
            {status}
          </span>
        );
      case OrderStatus.COMPLETED:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case OrderStatus.CANCELLED:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const getWhatsAppOrderInquiryLink = (order: JokiOrder) => {
    const text = `Halo Admin Fannpedia, saya ingin menanyakan status pengerjaan untuk order berikut:\n\n*ID Order:* ${order.id}\n*Nickname:* ${order.accountDetails.nickname}\n*Layanan:* ${order.orderDetails}\n*Total:* Rp ${order.totalPrice.toLocaleString("id-ID")}\n\nMohon diinfokan ya. Terimakasih!`;
    return `https://wa.me/6282146733143?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 text-left space-y-8" id="cek-transaksi">
      
      {/* Title */}
      <div className="border-b border-neutral-900 pb-5">
        <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-cyan-400" />
          Cek Transaksi
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Lacak status pengerjaan Joki Game atau Jasa Tugas Anda secara real-time. Masukkan ID Order Anda.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-xs space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-300">Masukkan ID Order / No. Invoice</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-500" />
              <input
                type="text"
                required
                placeholder="Contoh: FNZ-83921"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-neutral-600 outline-none transition-all uppercase font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold text-sm hover:from-violet-500 hover:to-violet-600 hover:shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Cari Transaksi
            </button>
          </div>
        </div>

        <div className="text-[11px] text-neutral-500 flex gap-1 items-center">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tips: ID Order didapatkan setelah Anda membuat order pada halaman pesan joki.</span>
        </div>
      </form>

      {/* Searched Results Card */}
      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {searchedOrder ? (
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-xl relative overflow-hidden">
                {/* Visual accent background */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 blur-xl rounded-full" />
                
                {/* Card Title Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-850 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">Hasil Pencarian Order</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      ID Order: <span className="font-mono text-cyan-400 font-black">{searchedOrder.id}</span>
                    </h3>
                  </div>
                  <div>
                    {getStatusBadge(searchedOrder.status)}
                  </div>
                </div>

                {/* Main Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-neutral-500 text-xs block">
                        {searchedOrder.serviceType === "tugas" ? "Nama Pemesan:" : "Nama Akun (Nickname):"}
                      </span>
                      <span className="font-bold text-white text-base">{searchedOrder.accountDetails.nickname}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 text-xs block">
                        {searchedOrder.serviceType === "tugas" ? "Rincian Tugas & Judul:" : "Detail Pengerjaan Joki:"}
                      </span>
                      <span className="font-semibold text-cyan-400">{searchedOrder.orderDetails}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 text-xs block">Kategori Layanan:</span>
                      <span className="font-medium text-neutral-200 capitalize">
                        {searchedOrder.serviceType === "tugas" ? "Jasa Tugas & Desain" : `Joki MLBB (${searchedOrder.serviceType.replace('_', ' ')})`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <span className="text-neutral-500 text-xs block">Tanggal Dipesan:</span>
                      <span className="font-medium text-neutral-300 font-mono">{searchedOrder.createdAt}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 text-xs block">Total Biaya:</span>
                      <span className="font-extrabold text-white text-base">Rp {searchedOrder.totalPrice.toLocaleString("id-ID")}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 text-xs block">Metode Pembayaran:</span>
                      <span className="font-medium text-neutral-300 flex items-center gap-1">
                        <span>{searchedOrder.paymentMethod.icon}</span>
                        {searchedOrder.paymentMethod.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress / Live status log */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1.5 mt-4">
                  <span className="text-xs font-bold text-neutral-400 block uppercase tracking-widest font-mono">
                    {searchedOrder.serviceType === "tugas" ? "Status Progress Tugas:" : "Log Progress Joki:"}
                  </span>
                  <p className="text-sm text-neutral-200 font-medium">
                    {searchedOrder.jokiProgress || "Pesanan sedang didistribusikan ke tim pengerjaan. Harap tunggu info selanjutnya."}
                  </p>
                </div>

                {/* Whatsapp Support Action */}
                <div className="pt-2 flex justify-end">
                  <a
                    href={getWhatsAppOrderInquiryLink(searchedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                    Hubungi WhatsApp Admin untuk Order Ini
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center space-y-3">
                <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-white">ID Order Tidak Ditemukan</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Maaf, tidak ada order dengan ID <span className="font-mono text-rose-400 font-bold">"{searchQuery}"</span> yang terdaftar. Harap periksa kembali penulisan ID Order Anda (Sensitif huruf kapital).
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction History Logs List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-900 pb-3">
          <History className="w-4.5 h-4.5 text-cyan-400" />
          Semua Riwayat Transaksi (Termasuk Demo & Lokal)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => {
                setSearchQuery(order.id);
                setSearchedOrder(order);
                setHasSearched(true);
              }}
              className="p-4 rounded-xl bg-neutral-900/30 hover:bg-neutral-900/60 border border-neutral-850 hover:border-neutral-700 cursor-pointer text-left flex justify-between items-start transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-cyan-400">{order.id}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">• {order.createdAt}</span>
                </div>
                <h4 className="text-xs font-bold text-neutral-200">
                  {order.serviceType === "tugas" ? "Pemesan" : "MLBB Nick"}: {order.accountDetails.nickname}
                </h4>
                <p className="text-[11px] text-neutral-400 max-w-xs truncate">{order.orderDetails}</p>
              </div>

              <div className="flex flex-col items-end justify-between h-full space-y-3">
                {order.status === OrderStatus.PENDING && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">Pending</span>
                )}
                {order.status === OrderStatus.PROCESSING && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-purple-500/10 text-purple-400 border border-purple-500/10 animate-pulse">Processing</span>
                )}
                {order.status === OrderStatus.COMPLETED && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">Completed</span>
                )}
                <span className="text-[11px] font-bold font-mono text-neutral-400">Rp {order.totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
