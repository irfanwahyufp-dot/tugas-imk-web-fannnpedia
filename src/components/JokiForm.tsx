import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ServiceType, LoginType, OrderInput, PaymentMethod, JokiOrder, OrderStatus } from "../types";
import { RANKS, JOKI_PACKAGES, OTHER_SERVICES, PAYMENT_METHODS } from "../data";
import { 
  User, Shield, ShoppingCart, HelpCircle, ArrowRight, CheckCircle2, 
  Info, QrCode, CreditCard, MessageSquare, Copy, Sparkles, AlertTriangle 
} from "lucide-react";

// Import custom generated high-quality Mobile Legends thematic images
import imgRankStar from "../assets/images/mlbb_rank_star_1784114588719.jpg";
import imgPaketTier from "../assets/images/mlbb_paket_tier_1784114602008.jpg";
import imgMabarGendong from "../assets/images/mlbb_mabar_gendong_1784114615863.jpg";
import imgClassicBrawl from "../assets/images/mlbb_classic_brawl_1784114632478.jpg";
import imgWinrateHero from "../assets/images/mlbb_winrate_hero_1784114646228.jpg";
import imgMagicChess from "../assets/images/mlbb_magic_chess_1784114658952.jpg";

interface JokiFormProps {
  onOrderSuccess: (newOrder: JokiOrder) => void;
  scrollToTab: (tabId: string) => void;
}

const RANK_ORDER = ["warrior", "elite", "master", "grandmaster", "epic", "legend", "mythic", "mythic_honor", "mythic_glory", "mythic_immortal"];

export default function JokiForm({ onOrderSuccess, scrollToTab }: JokiFormProps) {
  // Service Category Tab
  const [selectedService, setSelectedService] = useState<ServiceType>(ServiceType.PER_STAR);

  // Informational modal before ordering
  const [showInfoModal, setShowInfoModal] = useState(() => {
    try {
      return localStorage.getItem("dontShowInfoModal") !== "true";
    } catch (e) {
      return true;
    }
  });
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleCloseInfoModal = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem("dontShowInfoModal", "true");
      } catch (e) {
        console.error(e);
      }
    }
    setShowInfoModal(false);
  };

  // Account Data (Step 1)
  const [accountData, setAccountData] = useState<OrderInput>({
    emailOrPhone: "",
    passwordOrLoginCode: "",
    loginVia: LoginType.MOONTON,
    nickname: "",
    heroRequests: "",
    notes: "",
    waNumber: "",
    igAccount: ""
  });

  // Joki Per-Star Selectors (Step 2 & 3)
  const [startRank, setStartRank] = useState("epic");
  const [startDivision, setStartDivision] = useState("V");
  const [startStars, setStartStars] = useState(1);
  const [targetRank, setTargetRank] = useState("legend");
  const [targetDivision, setTargetDivision] = useState("V");
  const [targetStars, setTargetStars] = useState(1);
  const [startMythicStars, setStartMythicStars] = useState(0);
  const [targetMythicStars, setTargetMythicStars] = useState(10);

  // Joki Package Selector
  const [selectedPackageId, setSelectedPackageId] = useState(JOKI_PACKAGES[1].id);

  // Classic/Brawl Match Selector
  const [selectedClassicType, setSelectedClassicType] = useState("svc_classic");
  const [classicMatches, setClassicMatches] = useState(5);

  // Gendong (Mabar) Selector
  const [selectedGendongType, setSelectedGendongType] = useState("svc_gendong_legend");
  const [gendongMatches, setGendongMatches] = useState(5);

  // Payment Method Selection (Step 4)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  // Pricing States
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [starCountDetail, setStarCountDetail] = useState("");
  const [isCalculatorError, setIsCalculatorError] = useState(false);

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Divisions based on Tier
  const getDivisionsForRank = (rankId: string) => {
    if (rankId === "warrior" || rankId === "elite") return ["III", "II", "I"];
    if (rankId === "master") return ["IV", "III", "II", "I"];
    if (["grandmaster", "epic", "legend"].includes(rankId)) return ["V", "IV", "III", "II", "I"];
    return []; // Mythic and above have no divisions
  };

  const getStarsCountForRank = (rankId: string) => {
    if (rankId === "warrior") return 3;
    if (rankId === "elite" || rankId === "master") return 4;
    return 5; // GM, Epic, Legend
  };

  // Convert rank, division, stars to absolute star indexes
  const getAbsoluteStars = (rankId: string, division: string, stars: number) => {
    let total = 0;
    const rankIdx = RANK_ORDER.indexOf(rankId);
    
    // Add completed prior ranks
    for (let i = 0; i < rankIdx; i++) {
      const r = RANK_ORDER[i];
      if (r === "warrior") total += 9;
      else if (r === "elite") total += 12;
      else if (r === "master") total += 16;
      else if (r === "grandmaster") total += 25;
      else if (r === "epic") total += 25;
      else if (r === "legend") total += 25;
    }

    if (rankId === "warrior") {
      const divIdx = ["III", "II", "I"].indexOf(division);
      total += divIdx * 3 + stars;
    } else if (rankId === "elite") {
      const divIdx = ["III", "II", "I"].indexOf(division);
      total += divIdx * 4 + stars;
    } else if (rankId === "master") {
      const divIdx = ["IV", "III", "II", "I"].indexOf(division);
      total += divIdx * 4 + stars;
    } else if (["grandmaster", "epic", "legend"].includes(rankId)) {
      const divIdx = ["V", "IV", "III", "II", "I"].indexOf(division);
      total += divIdx * 5 + stars;
    } else if (rankId === "mythic") {
      total += 112 + stars;
    } else if (rankId === "mythic_honor") {
      total += 112 + stars; // stars already represents absolute mythic stars (25-49)
    } else if (rankId === "mythic_glory") {
      total += 112 + stars; // 50-99
    } else if (rankId === "mythic_immortal") {
      total += 112 + stars; // 100+
    }

    return total;
  };

  // Listen for external tab selection events from Hero popular cards
  useEffect(() => {
    const handleSetService = (e: Event) => {
      const customEvent = e as CustomEvent<ServiceType>;
      if (customEvent && customEvent.detail) {
        setSelectedService(customEvent.detail);
      }
    };
    window.addEventListener("set-joki-service-type", handleSetService);
    return () => {
      window.removeEventListener("set-joki-service-type", handleSetService);
    };
  }, []);

  // Calculate prices when inputs change
  useEffect(() => {
    if (selectedService === ServiceType.PER_STAR) {
      const isStartMythic = ["mythic", "mythic_honor", "mythic_glory", "mythic_immortal"].includes(startRank);
      const isTargetMythic = ["mythic", "mythic_honor", "mythic_glory", "mythic_immortal"].includes(targetRank);
      
      const sStars = isStartMythic ? startMythicStars : startStars;
      const tStars = isTargetMythic ? targetMythicStars : targetStars;

      // Validate Rank hierarchy
      const startRankIdx = RANK_ORDER.indexOf(startRank);
      const targetRankIdx = RANK_ORDER.indexOf(targetRank);

      let isValid = true;
      if (startRankIdx > targetRankIdx) {
        isValid = false;
      } else if (startRankIdx === targetRankIdx) {
        if (isStartMythic) {
          if (startMythicStars >= targetMythicStars) isValid = false;
        } else {
          // Compare divisions
          const divOrder = getDivisionsForRank(startRank);
          const sDivIdx = divOrder.indexOf(startDivision);
          const tDivIdx = divOrder.indexOf(targetDivision);
          if (sDivIdx > tDivIdx) {
            isValid = false;
          } else if (sDivIdx === tDivIdx) {
            if (startStars >= targetStars) isValid = false;
          }
        }
      }

      if (!isValid) {
        setIsCalculatorError(true);
        setCalculatedPrice(0);
        setStarCountDetail("Target rank harus lebih tinggi dari rank saat ini!");
        return;
      }

      setIsCalculatorError(false);
      const startAbs = getAbsoluteStars(startRank, startDivision, sStars);
      const targetAbs = getAbsoluteStars(targetRank, targetDivision, tStars);
      const diffStars = targetAbs - startAbs;

      // Price calculation star-by-star
      let price = 0;
      for (let s = startAbs; s < targetAbs; s++) {
        if (s < 9) price += 1500; // Warrior
        else if (s < 21) price += 2000; // Elite
        else if (s < 37) price += 3000; // Master
        else if (s < 62) price += 4000; // Grandmaster
        else if (s < 87) price += 5500; // Epic
        else if (s < 112) price += 7000; // Legend
        else {
          const mStars = s - 112;
          if (mStars < 25) price += 10000; // Mythic
          else if (mStars < 50) price += 13000; // Honor
          else if (mStars < 100) price += 17000; // Glory
          else price += 25000; // Immortal
        }
      }

      setCalculatedPrice(price);
      
      const startText = isStartMythic ? `Mythic ${startMythicStars}⭐` : `${RANKS.find(r => r.id === startRank)?.name} ${startDivision} (${startStars}⭐)`;
      const targetText = isTargetMythic ? `Mythic ${targetMythicStars}⭐` : `${RANKS.find(r => r.id === targetRank)?.name} ${targetDivision} (${targetStars}⭐)`;
      setStarCountDetail(`Total: ${diffStars} Bintang (${startText} ➔ ${targetText})`);

    } else if (selectedService === ServiceType.PAKET) {
      const pkg = JOKI_PACKAGES.find(p => p.id === selectedPackageId);
      if (pkg) {
        setCalculatedPrice(pkg.price);
        setStarCountDetail(`${pkg.name} (${pkg.fromRank} ke ${pkg.toRank})`);
        setIsCalculatorError(false);
      }
    } else if (selectedService === ServiceType.CLASSIC_BRAWL) {
      const svc = OTHER_SERVICES.find(s => s.id === selectedClassicType);
      if (svc) {
        setCalculatedPrice(svc.pricePerMatch * classicMatches);
        setStarCountDetail(`GB ${svc.name} • ${classicMatches} Pertandingan`);
        setIsCalculatorError(false);
      }
    } else if (selectedService === ServiceType.GENDONG) {
      const svc = OTHER_SERVICES.find(s => s.id === selectedGendongType);
      if (svc) {
        setCalculatedPrice(svc.pricePerMatch * gendongMatches);
        setStarCountDetail(`Mabar ${svc.name} • ${gendongMatches} Pertandingan`);
        setIsCalculatorError(false);
      }
    }
  }, [
    selectedService, startRank, startDivision, startStars, targetRank, targetDivision, targetStars,
    startMythicStars, targetMythicStars, selectedPackageId, selectedClassicType, classicMatches,
    selectedGendongType, gendongMatches
  ]);

  // Adjust default divisions & stars when rank changes
  const handleStartRankChange = (rankId: string) => {
    setStartRank(rankId);
    const divisions = getDivisionsForRank(rankId);
    if (divisions.length > 0) {
      setStartDivision(divisions[0]);
      setStartStars(1);
    } else {
      // Mythic
      if (rankId === "mythic") setStartMythicStars(0);
      else if (rankId === "mythic_honor") setStartMythicStars(25);
      else if (rankId === "mythic_glory") setStartMythicStars(50);
      else if (rankId === "mythic_immortal") setStartMythicStars(100);
    }
  };

  const handleTargetRankChange = (rankId: string) => {
    setTargetRank(rankId);
    const divisions = getDivisionsForRank(rankId);
    if (divisions.length > 0) {
      setTargetDivision(divisions[0]);
      setTargetStars(1);
    } else {
      // Mythic
      if (rankId === "mythic") setTargetMythicStars(10);
      else if (rankId === "mythic_honor") setTargetMythicStars(30);
      else if (rankId === "mythic_glory") setTargetMythicStars(60);
      else if (rankId === "mythic_immortal") setTargetMythicStars(110);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!accountData.nickname) {
      alert("Masukkan Nickname Akun MLBB Anda terlebih dahulu!");
      return;
    }
    if (!accountData.emailOrPhone || !accountData.passwordOrLoginCode) {
      // For mabar, credentials can be empty
      if (selectedService !== ServiceType.GENDONG) {
        alert("Masukkan Email/No HP dan Password akun MLBB Anda!");
        return;
      }
    }
    if (!accountData.waNumber) {
      alert("Masukkan nomor WhatsApp aktif Anda!");
      return;
    }

    if (isCalculatorError) {
      alert("Target rank bermasalah. Silakan perbaiki konfigurasi rank Anda!");
      return;
    }

    // Generate unique order ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `FNZ-${randomNum}`;
    setGeneratedOrderId(orderId);
    setShowCheckoutModal(true);
  };

  // Copies payment details to clipboard
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Confirms payment in front-end and adds order
  const handleConfirmOrderAndPay = () => {
    const newOrder: JokiOrder = {
      id: generatedOrderId,
      serviceType: selectedService,
      accountDetails: accountData,
      orderDetails: starCountDetail,
      totalPrice: calculatedPrice,
      paymentMethod: selectedPayment,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onOrderSuccess(newOrder);
    setShowCheckoutModal(false);
    
    // Clear and redirect
    setAccountData({
      emailOrPhone: "",
      passwordOrLoginCode: "",
      loginVia: LoginType.MOONTON,
      nickname: "",
      heroRequests: "",
      notes: "",
      waNumber: "",
      igAccount: ""
    });
    
    alert(`Order ${generatedOrderId} berhasil disimpan lokal! Alihkan halaman untuk cek transaksi.`);
    scrollToTab("cek");
  };

  // Generate Whatsapp redirect link
  const getWhatsAppLink = () => {
    const orderText = `*INVOICE JOKI MLBB - FANNPEDIA*
----------------------------------------
*ID Order:* ${generatedOrderId}
*Status:* MENUNGGU PEMBAYARAN
*Nickname:* ${accountData.nickname}
*Layanan:* ${selectedService.toUpperCase().replace('_', ' ')}
*Detail Order:* ${starCountDetail}
*Via Login:* ${accountData.loginVia}
*No HP / Email:* ${accountData.emailOrPhone}
*Password:* ${accountData.passwordOrLoginCode}
*Request Hero:* ${accountData.heroRequests || "-"}
*Catatan:* ${accountData.notes || "-"}
----------------------------------------
*Metode Pembayaran:* ${selectedPayment.name}
*Total Pembayaran:* Rp ${calculatedPrice.toLocaleString("id-ID")}
----------------------------------------
Silakan kirimkan screenshot bukti transfer pembayaran. Terimakasih!`;

    return `https://wa.me/6282146733143?text=${encodeURIComponent(orderText)}`;
  };

  const renderRankPreview = (rankId: string, titleLabel: string) => {
    const rankInfo = RANKS.find((r) => r.id === rankId);
    if (!rankInfo) return null;
    
    let rankIllustration = imgRankStar;
    if (["mythic", "mythic_honor", "mythic_glory", "mythic_immortal"].includes(rankId)) {
      rankIllustration = imgWinrateHero;
    } else if (["epic", "legend"].includes(rankId)) {
      rankIllustration = imgPaketTier;
    }

    return (
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950/80 h-28 flex items-center justify-between p-4 shadow-lg group">
        {/* Background Image with blur & low opacity */}
        <div className="absolute inset-0">
          <img 
            src={rankIllustration} 
            alt="MLBB Rank Background" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />
        </div>

        {/* Info */}
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 block uppercase">{titleLabel}</span>
          <h5 className="text-sm md:text-base font-black text-white font-display tracking-tight uppercase flex items-center gap-1.5">
            <span className="text-base">{rankInfo.icon}</span>
            {rankInfo.name}
          </h5>
          <p className="text-[10px] text-violet-400 font-bold font-mono">Rp {rankInfo.pricePerStar.toLocaleString("id-ID")} / Bintang</p>
        </div>

        {/* Visual Badge Display */}
        <div className={`relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br ${rankInfo.color} border border-white/10 flex items-center justify-center text-2xl shadow-lg shadow-black/60`}>
          <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{rankInfo.icon}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="order-form-container">
      {/* Title */}
      <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-black font-display text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
            Formulir Pemesanan Joki
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="text-xs font-mono font-bold text-violet-400 hover:text-violet-300 hover:underline cursor-pointer ml-3 bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20 transition-all duration-200"
            >
              📋 Syarat & Ketentuan
            </button>
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Isi formulir, hitung otomatis harga joki, lakukan pembayaran, dan konfirmasi via WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 bg-neutral-900/80 border border-neutral-800 rounded-lg px-3 py-1.5 shadow-md">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Koneksi Terenkripsi SSL & Aman
        </div>
      </div>

      {/* LEFT COLUMN: Input form configurations (8 columns) */}
      <form className="lg:col-span-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* STEP 1: Akun MLBB */}
            <div className="p-5 md:p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 font-extrabold flex items-center justify-center border border-violet-500/20">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Langkah 1: Masukkan Data Akun</h3>
                  <p className="text-xs text-neutral-400">Isi data akun Mobile Legends Anda dengan teliti.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Sistem Login / Via *</label>
                  <select
                    name="loginVia"
                    value={accountData.loginVia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm focus:border-violet-500 text-white outline-none transition-all"
                  >
                    {Object.values(LoginType).map((t) => (
                      <option key={t} value={t} className="bg-neutral-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">User ID & Nick Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4.5 h-4.5 text-neutral-500" />
                    <input
                      type="text"
                      name="nickname"
                      required
                      placeholder="Masukkan User ID & Nick Name (Contoh: 12345678 (2032) FannzzPro)"
                      value={accountData.nickname}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500/25 text-white placeholder-neutral-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {selectedService === ServiceType.GENDONG ? "Nomor HP (Optional)" : "Email/No. Hp/Moonton ID *"}
                  </label>
                  <input
                    type="text"
                    name="emailOrPhone"
                    required={selectedService !== ServiceType.GENDONG}
                    placeholder="Contoh: 0821xxxx atau email@gmail.com"
                    value={accountData.emailOrPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500/25 text-white placeholder-neutral-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {selectedService === ServiceType.GENDONG ? "Keterangan Mabar" : "Password Akun *"}
                  </label>
                  <input
                    type={selectedService === ServiceType.GENDONG ? "text" : "password"}
                    name="passwordOrLoginCode"
                    required={selectedService !== ServiceType.GENDONG}
                    placeholder={selectedService === ServiceType.GENDONG ? "Contoh: Mabar sore bosku" : "••••••••"}
                    value={accountData.passwordOrLoginCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500/25 text-white placeholder-neutral-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Request Hero ( Minimal 3 Hero )</label>
                  <input
                    type="text"
                    name="heroRequests"
                    placeholder="Contoh: Fanny, Gusion, Ling"
                    value={accountData.heroRequests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500/25 text-white placeholder-neutral-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Catatan Untuk Penjoki ( Request Worker Disini )</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="Contoh: Main subuh saja, dilarang balas chat"
                    value={accountData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500/25 text-white placeholder-neutral-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

        {/* STEP 2: Pilih Layanan */}
        <div className="p-5 md:p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-extrabold flex items-center justify-center border border-amber-500/20">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Langkah 2: Pilih Kategori Layanan Joki</h3>
              <p className="text-xs text-neutral-400">Kami menyediakan berbagai tipe joki berkualitas tinggi.</p>
            </div>
          </div>

          {/* Service Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: ServiceType.PER_STAR, label: "Joki Per-Star" },
              { id: ServiceType.PAKET, label: "Joki Paket Rank" },
              { id: ServiceType.CLASSIC_BRAWL, label: "Classic & Brawl" },
              { id: ServiceType.GENDONG, label: "Mabar Gendong" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedService(tab.id)}
                className={`py-3 px-2 text-center rounded-xl font-bold text-xs md:text-sm border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  selectedService === tab.id
                    ? "bg-amber-500/15 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 3: Customize Service Fields */}
        <div className="p-5 md:p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-extrabold flex items-center justify-center border border-amber-500/20">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Langkah 3: Atur Konfigurasi Pesanan</h3>
              <p className="text-xs text-neutral-400">Atur jangkauan bintang, paket, atau jumlah match joki Anda.</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* 1. Joki Per-Star fields */}
            {selectedService === ServiceType.PER_STAR && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* START RANK CONFIGURATION */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    Rank Saat Ini (Mulai)
                  </h4>
                  
                  {renderRankPreview(startRank, "Tier Awal Anda")}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-neutral-400 font-medium">Pilih Tier</label>
                      <select
                        value={startRank}
                        onChange={(e) => handleStartRankChange(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm text-white focus:border-violet-500 outline-none"
                      >
                        {RANKS.map((r) => (
                          <option key={r.id} value={r.id} className="bg-neutral-900 text-white">{r.icon} {r.name}</option>
                        ))}
                      </select>
                    </div>

                    {!["mythic", "mythic_honor", "mythic_glory", "mythic_immortal"].includes(startRank) ? (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-neutral-400 font-medium">Divisi</label>
                          <select
                            value={startDivision}
                            onChange={(e) => setStartDivision(e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm text-white focus:border-violet-500 outline-none"
                          >
                            {getDivisionsForRank(startRank).map((div) => (
                              <option key={div} value={div} className="bg-neutral-900 text-white">Divisi {div}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-neutral-400 font-medium">Jumlah Bintang Saat Ini</label>
                          <select
                            value={startStars}
                            onChange={(e) => setStartStars(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm text-white focus:border-violet-500 outline-none"
                          >
                            {Array.from({ length: getStarsCountForRank(startRank) }, (_, i) => i + 1).map((star) => (
                              <option key={star} value={star} className="bg-neutral-900 text-white">{star} Bintang</option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[11px] text-neutral-400 font-medium">Total Bintang Saat Ini (Angka)</label>
                        <input
                          type="number"
                          min={startRank === "mythic" ? 0 : startRank === "mythic_honor" ? 25 : startRank === "mythic_glory" ? 50 : 100}
                          max={startRank === "mythic" ? 24 : startRank === "mythic_honor" ? 49 : startRank === "mythic_glory" ? 99 : 500}
                          value={startMythicStars}
                          onChange={(e) => setStartMythicStars(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* TARGET RANK CONFIGURATION */}
                <div className="space-y-4 pt-4 border-t border-neutral-800/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                    Target Rank (Selesai)
                  </h4>

                  {renderRankPreview(targetRank, "Tier Target Pencapaian")}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-neutral-400 font-medium">Pilih Tier</label>
                      <select
                        value={targetRank}
                        onChange={(e) => handleTargetRankChange(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm text-white focus:border-violet-500 outline-none"
                      >
                        {RANKS.map((r) => (
                          <option key={r.id} value={r.id} className="bg-neutral-900 text-white">{r.icon} {r.name}</option>
                        ))}
                      </select>
                    </div>

                    {!["mythic", "mythic_honor", "mythic_glory", "mythic_immortal"].includes(targetRank) ? (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-neutral-400 font-medium">Divisi</label>
                          <select
                            value={targetDivision}
                            onChange={(e) => setTargetDivision(e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm text-white focus:border-violet-500 outline-none"
                          >
                            {getDivisionsForRank(targetRank).map((div) => (
                              <option key={div} value={div} className="bg-neutral-900 text-white">Divisi {div}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-neutral-400 font-medium">Jumlah Bintang Target</label>
                          <select
                            value={targetStars}
                            onChange={(e) => setTargetStars(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm text-white focus:border-violet-500 outline-none"
                          >
                            {Array.from({ length: getStarsCountForRank(targetRank) }, (_, i) => i + 1).map((star) => (
                              <option key={star} value={star} className="bg-neutral-900 text-white">{star} Bintang</option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[11px] text-neutral-400 font-medium">Total Bintang Target (Angka)</label>
                        <input
                          type="number"
                          min={targetRank === "mythic" ? 0 : targetRank === "mythic_honor" ? 25 : targetRank === "mythic_glory" ? 50 : 100}
                          max={500}
                          value={targetMythicStars}
                          onChange={(e) => setTargetMythicStars(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Joki Paket fields */}
            {selectedService === ServiceType.PAKET && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {JOKI_PACKAGES.map((pkg) => {
                  let startIcon = "💎";
                  let endIcon = "👹";
                  let imageUrl = imgRankStar;
                  
                  if (pkg.id === "pkg_epic_legend") {
                    startIcon = "👹";
                    endIcon = "🦅";
                    imageUrl = imgClassicBrawl;
                  } else if (pkg.id === "pkg_legend_mythic") {
                    startIcon = "🦅";
                    endIcon = "🐲";
                    imageUrl = imgMabarGendong;
                  } else if (pkg.id === "pkg_mythic_honor") {
                    startIcon = "🐲";
                    endIcon = "🔥";
                    imageUrl = imgWinrateHero;
                  } else if (pkg.id === "pkg_honor_glory") {
                    startIcon = "🔥";
                    endIcon = "✨";
                    imageUrl = imgPaketTier;
                  } else if (pkg.id === "pkg_glory_immortal") {
                    startIcon = "✨";
                    endIcon = "🌌";
                    imageUrl = imgRankStar;
                  }

                  const isSelected = selectedPackageId === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`group rounded-2xl border cursor-pointer flex flex-col overflow-hidden transition-all duration-300 relative ${
                        isSelected
                          ? "bg-violet-950/15 border-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.2)]"
                          : "bg-neutral-950/40 border-neutral-850 hover:border-neutral-700"
                      }`}
                    >
                      {/* Image Banner Container */}
                      <div className="h-28 w-full relative overflow-hidden shrink-0">
                        <img 
                          src={imageUrl} 
                          alt={pkg.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                        />
                        {/* Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                        
                        {/* Top info badge chips */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-600 text-white shadow-md">
                            {pkg.badge}
                          </span>
                          <span className="text-[10px] text-neutral-300 font-mono bg-neutral-950/80 px-2 py-0.5 rounded-md border border-neutral-800">
                            ID: {pkg.id.replace('pkg_', '').toUpperCase()}
                          </span>
                        </div>

                        {/* Rank Badge Icons Transition display on center-bottom of image */}
                        <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1.5 z-10">
                          <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800/80 rounded-lg px-2.5 py-1 text-xs text-white">
                            <span className="text-base">{startIcon}</span>
                            <span className="font-semibold text-[10px] md:text-[11px] font-mono">{pkg.fromRank.split(' ')[0]}</span>
                            <span className="text-neutral-500 text-[10px]">➔</span>
                            <span className="text-base">{endIcon}</span>
                            <span className="font-semibold text-[10px] md:text-[11px] font-mono">{pkg.toRank.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 flex flex-col justify-between flex-1 space-y-3 bg-neutral-900/10">
                        <div>
                          <h4 className="text-sm font-black text-white font-display uppercase tracking-tight">{pkg.name}</h4>
                          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{pkg.description}</p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2.5 border-t border-neutral-800/60 mt-auto">
                          <span className="text-[10px] text-neutral-400 font-mono">Estimasi: Super Cepat</span>
                          <span className={`text-sm font-black font-display tracking-tight ${isSelected ? "text-cyan-400 glow-cyan" : "text-violet-400"}`}>
                            Rp {pkg.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      {/* Selected marker element */}
                      {isSelected && (
                        <span className="absolute top-0 right-0 w-8 h-8 bg-violet-600 rounded-bl-2xl flex items-center justify-center text-white text-xs font-black shadow-md z-20">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* 3. Classic / Brawl match fields */}
            {selectedService === ServiceType.CLASSIC_BRAWL && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {OTHER_SERVICES.filter(s => s.type === "classic" || s.type === "brawl").map((svc) => (
                    <div
                       key={svc.id}
                       onClick={() => setSelectedClassicType(svc.id)}
                       className={`p-4 rounded-xl border cursor-pointer space-y-2 transition-all ${
                         selectedClassicType === svc.id
                           ? "bg-amber-500/10 border-amber-500 text-white"
                           : "bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white hover:bg-neutral-900/60"
                       }`}
                    >
                      <h4 className="text-sm font-bold text-white font-display">{svc.name}</h4>
                      <p className="text-xs text-neutral-350 leading-relaxed">{svc.description}</p>
                      <p className="text-xs text-amber-400 font-mono font-bold pt-1 glow-gold">
                        Rp {svc.pricePerMatch.toLocaleString("id-ID")} / Match
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-neutral-300">Jumlah Pertandingan (Match)</label>
                    <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      {classicMatches} Matches
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={classicMatches}
                      onChange={(e) => setClassicMatches(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setClassicMatches(prev => Math.max(1, prev - 5))}
                        className="px-2.5 py-1 rounded bg-neutral-950/60 hover:bg-neutral-800 text-xs text-neutral-300 font-bold border border-neutral-800"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => setClassicMatches(prev => Math.min(50, prev + 5))}
                        className="px-2.5 py-1 rounded bg-neutral-950/60 hover:bg-neutral-800 text-xs text-neutral-300 font-bold border border-neutral-800"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Gendong (Mabar) fields */}
            {selectedService === ServiceType.GENDONG && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {OTHER_SERVICES.filter(s => s.type.startsWith("gendong")).map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedGendongType(svc.id)}
                      className={`p-4 rounded-xl border cursor-pointer space-y-2 flex flex-col justify-between transition-all ${
                        selectedGendongType === svc.id
                          ? "bg-amber-500/10 border-amber-500 text-white"
                          : "bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white hover:bg-neutral-900/60"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white font-display">{svc.name.replace('Gendong (Mabar) - ', '')}</h4>
                        <p className="text-[11px] text-neutral-350 mt-1 leading-relaxed">{svc.description}</p>
                      </div>
                      <p className="text-xs text-amber-400 font-mono font-bold pt-2 border-t border-neutral-800 mt-2 glow-gold">
                        Rp {svc.pricePerMatch.toLocaleString("id-ID")} / Game
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-neutral-300">Jumlah Pertandingan (Game)</label>
                    <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      {gendongMatches} Games
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={gendongMatches}
                      onChange={(e) => setGendongMatches(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setGendongMatches(prev => Math.max(1, prev - 5))}
                        className="px-2.5 py-1 rounded bg-neutral-950/60 hover:bg-neutral-800 text-xs text-neutral-300 font-bold border border-neutral-800"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => setGendongMatches(prev => Math.min(30, prev + 5))}
                        className="px-2.5 py-1 rounded bg-neutral-950/60 hover:bg-neutral-800 text-xs text-neutral-300 font-bold border border-neutral-800"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STEP 4: Metode Pembayaran */}
        <div className="p-5 md:p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 font-extrabold flex items-center justify-center border border-violet-500/20">
              4
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Langkah 4: Pilih Metode Pembayaran</h3>
              <p className="text-xs text-neutral-400">Mendukung berbagai metode e-wallet dan transfer bank lokal.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">E-Wallet & QRIS</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PAYMENT_METHODS.filter(p => p.type === "QRIS" || p.type === "E-Wallet").map((pay) => (
                <div
                  key={pay.id}
                  onClick={() => setSelectedPayment(pay)}
                  className={`p-3.5 rounded-xl border cursor-pointer text-center relative flex flex-col justify-between items-center transition-all ${
                    selectedPayment.id === pay.id
                      ? "bg-violet-500/15 border-violet-500 shadow-md text-white"
                      : "bg-neutral-950/40 border-neutral-850 text-neutral-400 hover:border-neutral-700 hover:text-white"
                  }`}
                >
                  <span className="text-2xl mb-1">{pay.icon}</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">{pay.code}</h5>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Biaya: Rp {pay.fee}</p>
                  </div>
                  {selectedPayment.id === pay.id && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-600 text-white rounded-full flex items-center justify-center text-[9px] font-extrabold">✓</span>
                  )}
                </div>
              ))}
            </div>

            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pt-2">Transfer Bank</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PAYMENT_METHODS.filter(p => p.type === "Bank Transfer").map((pay) => (
                <div
                  key={pay.id}
                  onClick={() => setSelectedPayment(pay)}
                  className={`p-3.5 rounded-xl border cursor-pointer text-center relative flex flex-col justify-between items-center transition-all ${
                    selectedPayment.id === pay.id
                      ? "bg-violet-500/15 border-violet-500 shadow-md text-white"
                      : "bg-neutral-950/40 border-neutral-850 text-neutral-400 hover:border-neutral-700 hover:text-white"
                  }`}
                >
                  <span className="text-2xl mb-1">{pay.icon}</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">{pay.code}</h5>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Biaya: Rp {pay.fee}</p>
                  </div>
                  {selectedPayment.id === pay.id && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-600 text-white rounded-full flex items-center justify-center text-[9px] font-extrabold">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 5: Kontak Pemesan */}
        <div className="p-5 md:p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 font-extrabold flex items-center justify-center border border-violet-500/20">
              5
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Langkah 5: Masukkan Kontak Aktif Anda</h3>
              <p className="text-xs text-neutral-400">Isi kontak Anda agar joki / admin kami dapat menghubungi jika selesai.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Nomor WhatsApp Aktif *</label>
              <input
                type="text"
                name="waNumber"
                required
                placeholder="Contoh: 08123456789 (Mulai dari 08)"
                value={accountData.waNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm focus:border-violet-500 text-white placeholder-neutral-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Username Instagram (Optional)</label>
              <input
                type="text"
                name="igAccount"
                placeholder="Contoh: @username_kamu"
                value={accountData.igAccount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-neutral-950/40 border border-neutral-800 rounded-xl text-sm focus:border-violet-500 text-white placeholder-neutral-500 outline-none"
              />
            </div>
          </div>
        </div>

      </form>

      {/* RIGHT COLUMN: Order Summary & Checkout Action (4 columns) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="sticky top-[88px] p-5 md:p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md shadow-xl space-y-5 text-neutral-300">
          <h3 className="text-base font-bold text-white font-display border-b border-neutral-800/60 pb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-violet-400 animate-pulse" />
            Ringkasan Pemesanan
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Nickname Akun:</span>
              <span className="text-white font-bold max-w-[150px] truncate">
                {accountData.nickname || <span className="text-neutral-500 italic">Belum diisi</span>}
              </span>
            </div>

            <div className="flex justify-between text-xs text-neutral-400">
              <span>Metode Login:</span>
              <span className="text-white font-bold">{accountData.loginVia}</span>
            </div>

            <div className="flex justify-between text-xs text-neutral-400">
              <span>Kategori Joki:</span>
              <span className="text-white font-bold capitalize">
                {selectedService.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-1 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Konfigurasi Joki:</span>
              <span className={`text-xs font-semibold ${isCalculatorError ? "text-rose-400" : "text-cyan-400"}`}>
                {starCountDetail}
              </span>
            </div>

            <div className="flex justify-between text-xs text-neutral-400">
              <span>Metode Bayar:</span>
              <span className="text-white font-semibold flex items-center gap-1">
                <span>{selectedPayment.icon}</span>
                {selectedPayment.code}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/60 space-y-1">
            <div className="flex justify-between items-end">
              <span className="text-xs text-neutral-400">Total Pembayaran:</span>
              <span className="text-xl font-black text-cyan-400 font-display glow-cyan">
                Rp {calculatedPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 text-right">Sudah termasuk biaya admin & PPN (Rp 0)</p>
          </div>

          {isCalculatorError ? (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-400 text-xs flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Harap konfigurasikan jangkauan target rank dengan benar sebelum memesan.</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCheckoutSubmit}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-extrabold text-sm hover:from-violet-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Lanjutkan Pemesanan
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Proses Otomatis & Terenkripsi Aman
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL (SUMMARY, PAYMENT INFO, AND WA REDIRECT) */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutModal(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden relative shadow-2xl text-left z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-neutral-800 bg-neutral-900/60 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white font-display">Selesaikan Pembayaran Joki Anda</h3>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-neutral-300 hover:text-white hover:bg-neutral-800 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800 cursor-pointer text-xs transition-colors"
                >
                  Tutup
                </button>
              </div>

              {/* Content body */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Info message */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-neutral-300 text-xs flex gap-2 items-start">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Silakan transfer nominal pembayaran ke akun transfer di bawah ini. Selesai transfer, harap screenshot bukti bayar dan klik tombol konfirmasi WA.
                  </span>
                </div>

                {/* Invoice Meta */}
                <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block">ID Order:</span>
                    <span className="font-mono font-bold text-amber-400">{generatedOrderId}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Metode Pembayaran:</span>
                    <span className="font-bold text-white">{selectedPayment.name}</span>
                  </div>
                  <div className="col-span-2 border-t border-neutral-800 pt-2 mt-1">
                    <span className="text-neutral-400 block">Detail Joki:</span>
                    <span className="font-semibold text-neutral-200">{starCountDetail}</span>
                  </div>
                </div>

                {/* Dynamic transfer numbers details */}
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Instruksi Transfer</span>
                    <span className="px-2 py-0.5 bg-neutral-800 border border-neutral-750 text-[10px] text-neutral-300 rounded-md font-semibold">
                      {selectedPayment.type}
                    </span>
                  </div>

                  {selectedPayment.type === "QRIS" ? (
                    <div className="flex flex-col items-center py-2 space-y-3">
                      <div className="p-3 bg-white border border-neutral-200 rounded-xl flex items-center justify-center shadow-md">
                        {/* Simulating QRIS code */}
                        <QrCode className="w-40 h-40 text-neutral-900" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-white">QRIS All Payment - Fannpedia</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Scan menggunakan DANA, OVO, GOPAY, ShopeePay, atau Mobile Banking</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase block">No. Rekening / No HP:</span>
                          <span className="text-sm font-mono font-bold text-amber-400 tracking-wider">
                            {selectedPayment.accountNo}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(selectedPayment.accountNo || "")}
                          className="p-2 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-neutral-400 block">Atas Nama (A/N):</span>
                          <span className="font-bold text-white">{selectedPayment.accountName}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Jumlah Transfer:</span>
                          <span className="font-bold text-amber-400 text-sm">Rp {calculatedPrice.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {isCopied && (
                    <div className="text-center text-[11px] text-emerald-400 font-medium">
                      ✓ No. Rekening berhasil disalin ke clipboard!
                    </div>
                  )}
                </div>

                {/* Confirmation actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs md:text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer text-center"
                  >
                    <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                    Hubungi WA untuk Bukti Bayar
                  </a>
                  <button
                    type="button"
                    onClick={handleConfirmOrderAndPay}
                    className="py-3 px-4 rounded-xl bg-amber-50 text-neutral-950 font-bold text-xs md:text-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    Saya Sudah Bayar (Simpan)
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-neutral-900/60 p-4 text-center border-t border-neutral-800 text-[10px] text-neutral-400">
                Kontak Developer / Owner: 082146733143 (Irfan Wahyu) • Instagram: @ptrfann_
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INFORMASI SEBELUM ORDER MODAL */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseInfoModal}
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden relative shadow-2xl text-left z-10 max-h-[90vh] flex flex-col"
            >
              {/* Top Bar with X button */}
              <div className="px-6 py-4 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/40">
                <div className="text-neutral-500 font-bold text-xs">
                  1/1
                </div>
                <button
                  onClick={handleCloseInfoModal}
                  className="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-400 font-extrabold flex items-center justify-center border border-neutral-800 hover:text-white hover:border-neutral-700 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-center">
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">
                    Informasi Sebelum Order Jasa Joki Rank
                  </h3>
                  <p className="text-xs md:text-sm text-yellow-400 italic font-medium">
                    Mohon luangkan waktu untuk membaca catatan Informasi sebelum melakukan pemesanan.
                  </p>
                </div>

                <div className="text-left space-y-5">
                  {/* Waktu Pengecekan */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-white text-xs md:text-sm uppercase tracking-wider border-b border-neutral-900 pb-1.5">
                      🕒 Waktu Pengecekan Orderan :
                    </h4>
                    <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed pl-1">
                      <p>Orderan yang sudah dibayarkan akan kami cek setiap hari mulai pukul <strong className="text-white">07.00 - 22.00 WIB</strong>.</p>
                      <p>Untuk orderan yang melewati batas waktu pengecekan, akan kami proses pada jam kerja di hari berikutnya.</p>
                    </div>
                  </div>

                  {/* Syarat & Ketentuan */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-white text-xs md:text-sm uppercase tracking-wider border-b border-neutral-900 pb-1.5">
                      ⚡ Berikut Syarat Dan Ketentuan Sebelum Order Jasa Joki :
                    </h4>
                    <div className="space-y-3.5 pl-1">
                      {[
                        { num: "1", title: "Data Akun", text: "Lengkapi data dengan benar, termasuk kapitalisasi huruf." },
                        { num: "2", title: "Pilihan Hero", text: "Minimal tiga pilihan hero, sebagai alternatif jika hero sedang di pick/ban." },
                        { num: "3", title: "Verifikasi Akun", text: "Nonaktifkan Untuk Mempermudah Login." },
                        { num: "4", title: "Tipe Akun", text: "Utamakan Akun yang dijoki adalah akun utama, bukan akun beli atau bekas GB untuk menghindari BAN." },
                        { num: "5", title: "Login Tanpa izin", text: "Berakibat pembatalan joki dan hangusnya pembayaran." },
                        { num: "6", title: "Kesabaran", text: "Tunggu sesuai estimasi dan jangan spam chat admin." },
                        { num: "7", title: "Masalah Login", text: "Admin/Bot akan menghubungi jika ada kendala." },
                        { num: "8", title: "Keterlambatan Proses", text: "Hubungi kami jika belum diproses dalam 1-3 jam." },
                        { num: "9", title: "Setelah Joki Selesai", text: "Tetapi belum menerima laporan dari Admin/BOT, jangan di login terlebih dahulu karena ada benefit bonus." },
                        { num: "10", title: "Tanggung Jawab Pasca-Joki", text: "Tanggung jawab atas akun berakhir setelah joki selesai." },
                        { num: "11", title: "Konfirmasi Selesai", text: "Akan dihubungi oleh Admin/BOT dan Customer Bisa Cek Melalui (Cek Transaksi)" }
                      ].map((item) => (
                        <div key={item.num} className="flex gap-2.5 items-start text-xs text-neutral-300">
                          <span className="text-violet-400 font-black font-mono shrink-0 w-5">
                            {item.num}.
                          </span>
                          <span>
                            <strong className="text-white font-bold">{item.title} : </strong>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center text-xs text-neutral-400 border-t border-neutral-900 leading-relaxed font-semibold">
                  Jika Butuh Bantuan Harap Hubungi Admin Fannnpedia
                  <br />
                  Terimakasih
                </div>
              </div>

              {/* Checkbox Footer */}
              <div className="p-4 border-t border-neutral-900 bg-neutral-900/30 text-center">
                <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs text-neutral-400 hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-violet-650 focus:ring-violet-500 cursor-pointer"
                  />
                  <span>Jangan tampilkan lagi</span>
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
