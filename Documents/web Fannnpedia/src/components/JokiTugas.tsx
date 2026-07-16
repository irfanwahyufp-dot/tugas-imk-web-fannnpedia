import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, FileText, Presentation, Palette, FileSpreadsheet, 
  CheckCircle2, Calendar, ShieldAlert, Sparkles, Clock, 
  ArrowRight, GraduationCap, Percent, BadgeAlert, Users, Heart
} from "lucide-react";
import { ServiceType, PaymentMethod, JokiOrder, OrderStatus, LoginType } from "../types";
import { PAYMENT_METHODS } from "../data";

interface JokiTugasProps {
  onOrderSuccess: (newOrder: JokiOrder) => void;
  scrollToTab: (tab: string) => void;
}

interface TaskServiceType {
  id: string;
  name: string;
  basePrice: number;
  unitLabel: string;
  description: string;
  icon: React.ComponentType<any>;
  bulletPoints: string[];
}

const TASK_SERVICES: TaskServiceType[] = [
  {
    id: "laporan",
    name: "Laporan & Makalah",
    basePrice: 20000,
    unitLabel: "Halaman",
    description: "Pembuatan laporan magang/PKL, makalah, resume buku, essay, skripsi, & formatting Ms. Word sesuai EYD & standar akademik.",
    icon: FileText,
    bulletPoints: [
      "Bebas plagiarisme (Turnitin Safe)",
      "Format penulisan rapi & profesional",
      "Termasuk Daftar Pustaka & Sitasi (APA/IEEE)",
      "Gratis revisi minor 3 kali"
    ]
  },
  {
    id: "ppt",
    name: "PowerPoint (PPT) Aesthetic",
    basePrice: 15000,
    unitLabel: "Slide",
    description: "Desain slide presentasi yang memukau, interaktif, dan modern dengan layout visual yang memanjakan mata audiens.",
    icon: Presentation,
    bulletPoints: [
      "Desain kustom sesuai tema (Bukan template pasaran)",
      "Transisi & animasi profesional interaktif",
      "Infografis, diagram & aset visual berkualitas tinggi",
      "Bisa request file Canva / PowerPoint (.pptx)"
    ]
  },
  {
    id: "poster",
    name: "Poster & Desain Kreatif",
    basePrice: 50000,
    unitLabel: "Desain",
    description: "Pembuatan poster ilmiah, poster event, pamflet, flyer, infografis ringkas, CV kreatif ATS, atau layout feeds Instagram.",
    icon: Palette,
    bulletPoints: [
      "Desain visual kekinian & resolusi tinggi",
      "Kombinasi warna & tipografi yang terencana",
      "File master beresolusi tinggi (PDF, PNG, JPG)",
      "Siap cetak / posting sosial media"
    ]
  },
  {
    id: "excel",
    name: "Olah Data & Ms. Excel",
    basePrice: 85000,
    unitLabel: "Projek",
    description: "Olah data statistik SPSS, input data, pembuatan dashboard Excel, formula rumus kompleks (VLOOKUP, Pivot, dll).",
    icon: FileSpreadsheet,
    bulletPoints: [
      "Analisis data statistik akurat",
      "Pembuatan grafik & chart interaktif",
      "Struktur file Excel yang bersih & terdokumentasi",
      "Interpretasi hasil analisis data (SPSS)"
    ]
  }
];

export default function JokiTugas({ onOrderSuccess, scrollToTab }: JokiTugasProps) {
  // Calculator states
  const [selectedServiceId, setSelectedServiceId] = useState<string>("laporan");
  const [quantity, setQuantity] = useState<number>(5);
  const [urgency, setUrgency] = useState<string>("standard"); // standard, express, flash
  const [complexity, setComplexity] = useState<string>("sedang"); // gampang, sedang, sulit

  // Order Form states
  const [clientName, setClientName] = useState<string>("");
  const [waNumber, setWaNumber] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [deadlineDate, setDeadlineDate] = useState<string>("");
  const [taskInstructions, setTaskInstructions] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  // Order Success modal
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [latestOrderId, setLatestOrderId] = useState<string>("");
  const [latestOrderPrice, setLatestOrderPrice] = useState<number>(0);

  const activeService = TASK_SERVICES.find(s => s.id === selectedServiceId) || TASK_SERVICES[0];

  // Adjust default quantities based on service
  useEffect(() => {
    if (selectedServiceId === "poster") {
      setQuantity(1);
    } else if (selectedServiceId === "excel") {
      setQuantity(1);
    } else if (selectedServiceId === "ppt") {
      setQuantity(8);
    } else {
      setQuantity(5);
    }
  }, [selectedServiceId]);

  // Calculate pricing
  const calculatePriceBreakdown = () => {
    const baseUnit = activeService.basePrice;
    const baseTotal = baseUnit * quantity;

    // Urgency modifier
    let urgencyMultiplier = 1.0;
    let urgencyLabel = "Biasa (3-5 Hari)";
    if (urgency === "express") {
      urgencyMultiplier = 1.25;
      urgencyLabel = "Express (1-2 Hari)";
    } else if (urgency === "flash") {
      urgencyMultiplier = 1.50;
      urgencyLabel = "Flash Kilat (< 24 Jam)";
    }

    // Complexity modifier
    let complexityMultiplier = 1.0;
    let complexityLabel = "Standar / Sedang";
    if (complexity === "gampang") {
      complexityMultiplier = 0.85;
      complexityLabel = "Sederhana / Gampang";
    } else if (complexity === "sulit") {
      complexityMultiplier = 1.30;
      complexityLabel = "Kompleks / Sulit";
    }

    const estimatedTotal = Math.round(baseTotal * urgencyMultiplier * complexityMultiplier);
    
    return {
      baseTotal,
      urgencyLabel,
      urgencyCost: Math.round(baseTotal * (urgencyMultiplier - 1.0)),
      complexityLabel,
      complexityCost: Math.round(baseTotal * (complexityMultiplier - 1.0)),
      estimatedTotal,
      activeService
    };
  };

  const { estimatedTotal, urgencyLabel, complexityLabel } = calculatePriceBreakdown();

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !waNumber.trim() || !taskTitle.trim() || !deadlineDate) {
      alert("Harap isi semua kolom wajib (Nama, No. WA, Judul Tugas, dan Deadline)!");
      return;
    }

    const orderId = `FNZ-TGS-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Construct order detail string
    const detailsString = `Jasa Tugas ${activeService.name} • ${quantity} ${activeService.unitLabel} • Deadline: ${deadlineDate} • Tingkat: ${complexityLabel} (${urgencyLabel})`;

    const newOrder: JokiOrder = {
      id: orderId,
      serviceType: ServiceType.TUGAS,
      accountDetails: {
        emailOrPhone: "Client Jasa Tugas",
        passwordOrLoginCode: "Sesuai Request File",
        loginVia: LoginType.MOONTON, // Placeholder to satisfy TS constraints
        nickname: clientName,
        heroRequests: taskTitle,
        notes: taskInstructions || "Sesuai detail chat",
        waNumber: waNumber,
        igAccount: "-"
      },
      orderDetails: detailsString,
      totalPrice: estimatedTotal,
      paymentMethod: selectedPayment,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      jokiProgress: "Pesanan Diterima! Silakan hubungi admin di WhatsApp untuk mengirim berkas materi & detail petunjuk pengerjaan."
    };

    onOrderSuccess(newOrder);
    setLatestOrderId(orderId);
    setLatestOrderPrice(estimatedTotal);
    setShowSuccessModal(true);
  };

  const getWhatsAppUrl = () => {
    // Generate neat WhatsApp template message
    const waText = 
`*FORMULIR ORDER JASA TUGAS FANNPEDIA*
----------------------------------------
*ID Transaksi :* ${latestOrderId}
*Nama Client  :* ${clientName}
*No. WhatsApp :* ${waNumber}
----------------------------------------
*Jenis Jasa   :* Joki Tugas - ${activeService.name}
*Judul / Tema :* ${taskTitle}
*Jumlah       :* ${quantity} ${activeService.unitLabel}
*Deadline     :* ${deadlineDate}
*Urgency      :* ${urgencyLabel}
*Kompleksitas :* ${complexityLabel}
----------------------------------------
*Metode Bayar :* ${selectedPayment.name}
*Total Biaya  :* Rp ${latestOrderPrice.toLocaleString("id-ID")}
----------------------------------------
*Deskripsi / Catatan Tambahan:*
_${taskInstructions || "Tidak ada catatan tambahan. Dokumen & file rujukan akan dikirim via chat ini."}_

Mohon segera diproses ya Admin Fannpedia! Terima kasih.`;

    const cleanWaNum = "6282146733143"; // Fannpedia Official WhatsApp
    return `https://wa.me/${cleanWaNum}?text=${encodeURIComponent(waText)}`;
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    // Reset form states
    setClientName("");
    setTaskTitle("");
    setDeadlineDate("");
    setTaskInstructions("");
    // Redirect to "cek" transactions tab
    scrollToTab("cek");
  };

  return (
    <div className="relative px-4 md:px-8 py-10 max-w-7xl mx-auto space-y-12" id="order-form-container">
      
      {/* SECTION BANNER HEADLINE */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-black uppercase tracking-wider"
        >
          <GraduationCap className="w-4 h-4" />
          Fannpedia Academic &amp; Design Service
        </motion.div>
        
        <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white uppercase leading-none">
          Jasa Joki <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 drop-shadow-[0_2px_15px_rgba(139,92,246,0.2)]">Tugas &amp; Desain</span> Keren!
        </h1>
        
        <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
          Tugas menumpuk tapi gak ada waktu? Butuh PPT visual aesthetic, laporan makalah rapi bebas plagiasi, poster event bergaya modern, atau olah formula Excel kilat? 
          Kami siap bantu dengan kualitas terbaik &amp; harga bersahabat!
        </p>
      </div>

      {/* SERVICE CARD DISPLAY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TASK_SERVICES.map((s) => {
          const Icon = s.icon;
          const isSelected = selectedServiceId === s.id;
          return (
            <motion.div
              key={s.id}
              onClick={() => setSelectedServiceId(s.id)}
              className={`cursor-pointer rounded-2xl p-5 border text-left flex flex-col justify-between space-y-4 transition-all duration-300 relative overflow-hidden ${
                isSelected 
                  ? "bg-gradient-to-b from-violet-500/10 via-[#0a0815] to-[#0d0b1d] border-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.15)]"
                  : "bg-neutral-950/60 border-neutral-900 hover:border-neutral-800"
              }`}
              whileHover={{ y: -3 }}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-violet-500/20 to-transparent pointer-events-none rounded-bl-full" />
              )}
              
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                  isSelected ? "bg-violet-600 border-violet-400 text-white" : "bg-neutral-900 border-neutral-800 text-neutral-400"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-white tracking-tight">{s.name}</h3>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    Mulai Rp {s.basePrice.toLocaleString("id-ID")} / {s.unitLabel}
                  </span>
                </div>
                
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {s.description}
                </p>
              </div>

              {/* Bullet advantages list */}
              <ul className="space-y-1.5 pt-3 border-t border-neutral-900/60">
                {s.bulletPoints.map((pt, i) => (
                  <li key={i} className="text-[10px] text-neutral-300 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="line-clamp-1">{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN CALCULATOR & FORM INPUTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE PRICE CALCULATOR */}
        <div className="lg:col-span-7 bg-[#080710]/95 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
          
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
            <div className="w-2.5 h-5 bg-violet-600 rounded-full" />
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">
              Estimator Biaya Jasa Tugas
            </h2>
          </div>

          <div className="space-y-5 text-left">
            
            {/* Selected Service Detail Info */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  {React.createElement(activeService.icon, { className: "w-5 h-5" })}
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Layanan yang Dipilih:</span>
                  <span className="text-sm font-extrabold text-white">{activeService.name}</span>
                </div>
              </div>
              <span className="text-xs font-black uppercase bg-violet-600 text-white px-2.5 py-1 rounded">
                Rp {activeService.basePrice.toLocaleString("id-ID")} / {activeService.unitLabel}
              </span>
            </div>

            {/* Quantity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-neutral-300">
                  Jumlah {activeService.unitLabel}:
                </label>
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-md font-mono font-bold text-sm">
                  {quantity} {activeService.unitLabel}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-850 flex items-center justify-center font-black text-lg transition-colors"
                >
                  -
                </button>
                
                <input
                  type="range"
                  min="1"
                  max={activeService.id === "laporan" ? "50" : activeService.id === "ppt" ? "30" : "10"}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="flex-1 accent-violet-500 cursor-pointer h-1.5 bg-neutral-900 rounded-lg"
                />
                
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-850 flex items-center justify-center font-black text-lg transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] text-neutral-500 leading-tight">
                *Geser slider atau gunakan tombol +/- untuk menentukan total {activeService.unitLabel.toLowerCase()} tugas Anda.
              </p>
            </div>

            {/* Urgency / Deadline speed selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold text-neutral-300 block">
                Kecepatan Pengerjaan (Urgency):
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "standard", label: "Biasa (3-5 Hari)", badge: "Normal", desc: "Harga Standard" },
                  { id: "express", label: "Express (1-2 Hari)", badge: "+25%", desc: "Selesai Cepat" },
                  { id: "flash", label: "Flash (< 24 Jam)", badge: "+50%", desc: "Sangat Kilat" }
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-[82px] transition-all duration-200 ${
                      urgency === u.id
                        ? "bg-violet-500/10 border-violet-500 shadow-md"
                        : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        urgency === u.id ? "bg-violet-600 text-white" : "bg-neutral-900 text-neutral-400"
                      }`}>
                        {u.badge}
                      </span>
                      <Clock className={`w-3.5 h-3.5 ${urgency === u.id ? "text-cyan-400 animate-pulse" : "text-neutral-500"}`} />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-white block leading-tight">{u.label}</span>
                      <span className="text-[9px] text-neutral-400 block mt-0.5">{u.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity Level Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold text-neutral-300 block">
                Tingkat Kesulitan / Kategori Materi:
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "gampang", label: "Gampang / Sederhana", badge: "Hemat", desc: "Materi Umum" },
                  { id: "sedang", label: "Sedang (Default)", badge: "Standard", desc: "Sedikit Analisis" },
                  { id: "sulit", label: "Kompleks / Sulit", badge: "+30%", desc: "Analisis Khusus" }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setComplexity(c.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-[82px] transition-all duration-200 ${
                      complexity === c.id
                        ? "bg-violet-500/10 border-violet-500 shadow-md"
                        : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        complexity === c.id ? "bg-violet-600 text-white" : "bg-neutral-900 text-neutral-400"
                      }`}>
                        {c.badge}
                      </span>
                      <Sparkles className={`w-3.5 h-3.5 ${complexity === c.id ? "text-cyan-400" : "text-neutral-500"}`} />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-white block leading-tight">{c.label}</span>
                      <span className="text-[9px] text-neutral-400 block mt-0.5">{c.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ESTIMATED BOX */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#120e24] to-[#0a0815] border-2 border-violet-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/[0.03] rounded-full blur-2xl" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-neutral-400 font-bold block uppercase tracking-wider">
                    Estimasi Total Harga Jasa:
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl md:text-3xl font-black font-display text-cyan-400">
                      Rp {estimatedTotal.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold">
                      (Nett Estimasi)
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-left md:text-right text-[10px] text-neutral-400">
                  <p>✓ Bebas Plagiarisme &amp; Copy-Paste</p>
                  <p>✓ Garansi Tepat Waktu Sesuai Deadline</p>
                  <p>✓ Support Revisi Hingga Puas</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED ORDER FORM */}
        <div className="lg:col-span-5 bg-[#080710]/95 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
          
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
            <div className="w-2.5 h-5 bg-violet-600 rounded-full" />
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">
              Formulir Pemesanan Tugas
            </h2>
          </div>

          <form onSubmit={handleOrderSubmit} className="space-y-4">
            
            {/* Client Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                Nama Lengkap / Panggilan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama Anda..."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 text-white placeholder-neutral-600 text-sm outline-none transition-all"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                No. WhatsApp Aktif <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 text-white placeholder-neutral-600 text-sm outline-none transition-all"
              />
              <span className="text-[10px] text-neutral-500 block leading-none">
                *Wajib diisi dengan benar untuk koordinasi pengerjaan berkas.
              </span>
            </div>

            {/* Task Title / Topic */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                Judul / Tema / Topik Tugas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Laporan PKL IT Support / PPT Sejarah Dinasti"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 text-white placeholder-neutral-600 text-sm outline-none transition-all"
              />
            </div>

            {/* Deadline Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                Tanggal &amp; Waktu Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 text-white placeholder-neutral-600 text-sm outline-none transition-all cursor-pointer"
              />
            </div>

            {/* Detailed Instructions / Requirements */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                Detail Petunjuk / Catatan Tugas
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan petunjuk pengerjaan, format penulisan (Word/Canva), batasan materi, dsb. (Bahan & file rujukan lainnya bisa dikirim via WA admin)."
                value={taskInstructions}
                onChange={(e) => setTaskInstructions(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 text-white placeholder-neutral-600 text-sm outline-none transition-all resize-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPayment(p)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${
                      selectedPayment.id === p.id
                        ? "bg-violet-600 border-violet-400 text-white"
                        : "bg-neutral-950 border-neutral-900 text-neutral-300 hover:border-neutral-800"
                    }`}
                  >
                    <span className="text-base shrink-0">{p.icon}</span>
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* BUTTON SUBMIT */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white font-black text-sm uppercase tracking-wider hover:from-violet-500 hover:to-violet-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2 border-b-4 border-violet-800"
            >
              <Sparkles className="w-4 h-4 fill-white stroke-none" />
              Pesan Jasa Tugas Sekarang
            </button>

          </form>

        </div>

      </div>

      {/* WHY CHOOSE US FOR ASSIGNMENT SECT */}
      <div className="p-8 rounded-3xl bg-neutral-950/40 border border-neutral-900/60 relative overflow-hidden text-center max-w-5xl mx-auto space-y-6">
        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
          Kenapa Harus Order Tugas di Fannpedia?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 p-4 rounded-xl bg-neutral-950/60 border border-neutral-900/50">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto text-lg font-black">
              ✓
            </div>
            <h4 className="font-extrabold text-white text-sm">Privasi &amp; Data Rahasia</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Semua dokumen, nama institusi, dan data pribadi Anda aman &amp; dijamin kerahasiaannya 100%. Selesai tugas, semua bahan dihapus.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-neutral-950/60 border border-neutral-900/50">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto text-lg font-black">
              ✓
            </div>
            <h4 className="font-extrabold text-white text-sm">Turnitin Safe &amp; No Plagiarism</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Karya orisinal buatan tim ahli, ditulis secara profesional, bukan sekadar copy-paste ataupun AI-slop kasar. Dilengkapi sitasi ilmiah.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-neutral-950/60 border border-neutral-900/50">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto text-lg font-black">
              ✓
            </div>
            <h4 className="font-extrabold text-white text-sm">Garansi Sesuai Rubrik &amp; Revisi</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Kami mengerjakan tugas sesuai petunjuk instruksi / rubrik penilaian guru/dosen Anda. Diberikan jaminan revisi jika ada kekurangan.
            </p>
          </div>
        </div>
      </div>

      {/* POPUP MODAL ON SUCCESSFUL ORDER */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSuccess}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#090812] border-2 border-violet-500 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(139,92,246,0.3)] z-10 p-6 text-center space-y-6"
            >
              <div className="w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-cyan-400 tracking-tight uppercase leading-none">
                  PESANAN TUGAS DICATAT!
                </h3>
                <p className="text-xs text-neutral-300 leading-normal max-w-sm mx-auto">
                  Silakan lanjutkan dengan mengirimkan rincian, file materi pendukung, dan bukti transfer ke WhatsApp admin kami untuk proses pengerjaan.
                </p>
              </div>

              {/* Summary Invoice Card */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 text-left space-y-2 font-mono text-xs text-neutral-300">
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-500">Invoice ID:</span>
                  <span className="font-bold text-white">{latestOrderId}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-neutral-500">Jenis Jasa:</span>
                  <span className="font-bold text-white text-right">{activeService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Jumlah:</span>
                  <span className="font-bold text-white">{quantity} {activeService.unitLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tema/Judul:</span>
                  <span className="font-bold text-white truncate max-w-[180px]">{taskTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tenggat:</span>
                  <span className="font-bold text-cyan-400">{deadlineDate.replace("T", " ")}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-900 pt-2 text-sm">
                  <span className="text-neutral-400 font-extrabold">Total Biaya:</span>
                  <span className="font-black text-cyan-400">Rp {latestOrderPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Support Guidelines Alert */}
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-left flex items-start gap-2.5 text-[10px] text-cyan-400/90 leading-normal">
                <BadgeAlert className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <span>
                  Admin Fannpedia akan menugaskan Tim Penulis/Desainer khusus setelah berkas dikonfirmasi dan bukti pembayaran diverifikasi.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 border-b-4 border-emerald-700 shadow-md text-center cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.98 14.113.957 11.48.957c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.45 3.393 1.302 4.88L1.888 20.25l4.759-1.096zM17.487 14.4c-.299-.149-1.778-.875-2.046-.974-.269-.099-.465-.149-.661.149-.197.299-.761.974-.933 1.171-.173.197-.347.223-.646.074-.299-.149-1.261-.464-2.398-1.48-1.127-1.006-1.187-1.39-1.385-1.714-.197-.324-.02-.499.129-.648.135-.134.299-.347.448-.521.149-.173.197-.299.299-.496.099-.197.05-.372-.025-.521-.075-.149-.661-1.595-.907-2.185-.238-.572-.48-.493-.661-.502-.17-.008-.364-.01-.56-.01-.196 0-.515.074-.784.372-.269.299-1.027 1.009-1.027 2.459 0 1.45 1.055 2.85 1.202 3.05.149.197 2.077 3.172 5.032 4.453.703.305 1.253.487 1.681.624.707.225 1.35.193 1.86.117.568-.084 1.778-.726 2.028-1.43.25-.702.25-1.305.174-1.43-.075-.125-.269-.199-.569-.348z" />
                  </svg>
                  Kirim Rincian ke WA Admin
                </a>
                <button
                  onClick={handleCloseSuccess}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-neutral-800"
                >
                  Tutup &amp; Cek Transaksi Saya
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
