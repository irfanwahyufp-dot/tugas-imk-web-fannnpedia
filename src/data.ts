import { RankDetail, JokiPackage, OtherService, PaymentMethod, JokiOrder, ServiceType, LoginType, OrderStatus } from "./types";

export const RANKS: RankDetail[] = [
  {
    id: "warrior",
    name: "Warrior",
    pricePerStar: 1500,
    minStar: 1,
    maxStar: 3,
    icon: "⚔️",
    color: "from-amber-700 to-amber-900"
  },
  {
    id: "elite",
    name: "Elite",
    pricePerStar: 2000,
    minStar: 1,
    maxStar: 4,
    icon: "🛡️",
    color: "from-slate-400 to-slate-600"
  },
  {
    id: "master",
    name: "Master",
    pricePerStar: 3000,
    minStar: 1,
    maxStar: 4,
    icon: "👑",
    color: "from-yellow-600 to-yellow-800"
  },
  {
    id: "grandmaster",
    name: "Grandmaster",
    pricePerStar: 4000,
    minStar: 1,
    maxStar: 5,
    icon: "💎",
    color: "from-sky-600 to-indigo-800"
  },
  {
    id: "epic",
    name: "Epic",
    pricePerStar: 5500,
    minStar: 1,
    maxStar: 5,
    icon: "👹",
    color: "from-teal-500 to-emerald-700"
  },
  {
    id: "legend",
    name: "Legend",
    pricePerStar: 7000,
    minStar: 1,
    maxStar: 5,
    icon: "🦅",
    color: "from-orange-500 to-amber-600"
  },
  {
    id: "mythic",
    name: "Mythic",
    pricePerStar: 10000,
    minStar: 1,
    maxStar: 24,
    icon: "🐲",
    color: "from-purple-600 to-indigo-700"
  },
  {
    id: "mythic_honor",
    name: "Mythical Honor",
    pricePerStar: 13000,
    minStar: 25,
    maxStar: 49,
    icon: "🔥",
    color: "from-pink-600 to-rose-700"
  },
  {
    id: "mythic_glory",
    name: "Mythical Glory",
    pricePerStar: 17000,
    minStar: 50,
    maxStar: 99,
    icon: "✨",
    color: "from-amber-400 to-rose-500"
  },
  {
    id: "mythic_immortal",
    name: "Mythical Immortal",
    pricePerStar: 25000,
    minStar: 100,
    maxStar: 500,
    icon: "🌌",
    color: "from-violet-600 via-fuchsia-500 to-rose-600"
  }
];

export const JOKI_PACKAGES: JokiPackage[] = [
  {
    id: "pkg_gm_epic",
    name: "Grandmaster ke Epic",
    fromRank: "Grandmaster V",
    toRank: "Epic V",
    price: 80000,
    description: "Upgrade instan dari awal Grandmaster langsung menembus tier Epic. Sangat hemat!",
    badge: "Populer"
  },
  {
    id: "pkg_epic_legend",
    name: "Epic ke Legend",
    fromRank: "Epic V",
    toRank: "Legend V",
    price: 110000,
    description: "Lepas dari Rank Neraka Epic menuju Legend dengan cepat, aman, dan tanpa lose streak.",
    badge: "Best Seller"
  },
  {
    id: "pkg_legend_mythic",
    name: "Legend ke Mythic",
    fromRank: "Legend V",
    toRank: "Mythic V (Placement)",
    price: 140000,
    description: "Upgrade menuju tier tertinggi MLBB. Dapatkan border prestisius Mythic!",
    badge: "Rekomendasi"
  },
  {
    id: "pkg_mythic_honor",
    name: "Mythic 0 ke Honor 25 Star",
    fromRank: "Mythic 0 Star",
    toRank: "Mythical Honor 25 Star",
    price: 260000,
    description: "Menembus tier Mythical Honor dengan winrate tinggi oleh pro player kami.",
    badge: "Hot Deal"
  },
  {
    id: "pkg_honor_glory",
    name: "Honor 25 ke Glory 50 Star",
    fromRank: "Mythical Honor 25 Star",
    toRank: "Mythical Glory 50 Star",
    price: 350000,
    description: "Jaminan menembus Mythical Glory dengan kecepatan maksimal.",
    badge: "VVIP"
  },
  {
    id: "pkg_glory_immortal",
    name: "Glory 50 ke Immortal 100 Star",
    fromRank: "Mythical Glory 50 Star",
    toRank: "Mythical Immortal 100 Star",
    price: 850000,
    description: "Jasa joki kasta tertinggi MLBB. Selesai cepat, diproses oleh tim Esports Semi-Pro.",
    badge: "Dewa Joki"
  }
];

export const OTHER_SERVICES: OtherService[] = [
  {
    id: "svc_classic",
    name: "Joki Classic (GB Winrate)",
    pricePerMatch: 4000,
    type: "classic",
    description: "Meningkatkan Winrate Hero / Akun di mode Classic. Bebas request hero favorit."
  },
  {
    id: "svc_brawl",
    name: "Joki Brawl Match",
    pricePerMatch: 3500,
    type: "brawl",
    description: "Selesaikan pertandingan Brawl dengan cepat untuk push MMR / jumlah game."
  },
  {
    id: "svc_gendong_legend",
    name: "Gendong (Mabar) - Rank Legend",
    pricePerMatch: 12000,
    type: "gendong_legend",
    description: "Main bareng dengan Pro Player (kami gendong). Di jamin menang di Tier Legend."
  },
  {
    id: "svc_gendong_mythic",
    name: "Gendong (Mabar) - Rank Mythic",
    pricePerMatch: 18000,
    type: "gendong_mythic",
    description: "Mabar bareng pro player di tier Mythic. Menang mudah tanpa stres mikirin tim afk."
  },
  {
    id: "svc_gendong_immortal",
    name: "Gendong (Mabar) - Rank Immortal",
    pricePerMatch: 25000,
    type: "gendong_immortal",
    description: "Mabar kasta tertinggi bersama Pro Player tier 100+ Star. Pembelajaran gameplay tingkat dewa."
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pay_qris",
    name: "QRIS All Payment",
    code: "QRIS",
    type: "QRIS",
    fee: 0,
    icon: "📱",
    accountNo: "Scan Kode QR saat Checkout",
    accountName: "Fannpedia"
  },
  {
    id: "pay_dana",
    name: "DANA E-Wallet",
    code: "DANA",
    type: "E-Wallet",
    fee: 0,
    icon: "🔵",
    accountNo: "082146733143",
    accountName: "Irfan Wahyu F.P"
  },
  {
    id: "pay_gopay",
    name: "GOPAY E-Wallet",
    code: "GOPAY",
    type: "E-Wallet",
    fee: 0,
    icon: "🟢",
    accountNo: "082146733143",
    accountName: "Irfan Wahyu F.P"
  },
  {
    id: "pay_shopeepay",
    name: "ShopeePay",
    code: "SHOPEEPAY",
    type: "E-Wallet",
    fee: 0,
    icon: "🟠",
    accountNo: "082146733143",
    accountName: "Irfan Wahyu F.P"
  },
  {
    id: "pay_ovo",
    name: "OVO E-Wallet",
    code: "OVO",
    type: "E-Wallet",
    fee: 0,
    icon: "🟣",
    accountNo: "082146733143",
    accountName: "Irfan Wahyu F.P"
  },
  {
    id: "pay_bca",
    name: "BCA Bank Transfer",
    code: "BCA",
    type: "Bank Transfer",
    fee: 0,
    icon: "🏦",
    accountNo: "1820647311",
    accountName: "Irfan Wahyu F.P"
  },
  {
    id: "pay_bri",
    name: "BRI Bank Transfer",
    code: "BRI",
    type: "Bank Transfer",
    fee: 0,
    icon: "🏢",
    accountNo: "4673-01-028471-53-9",
    accountName: "Irfan Wahyu F.P"
  }
];

// Seeded mock database orders for demonstration and interactive "Cek Transaksi" features.
export const MOCK_ORDERS: JokiOrder[] = [
  {
    id: "FNZ-83921",
    serviceType: ServiceType.PER_STAR,
    accountDetails: {
      emailOrPhone: "user1@gmail.com",
      passwordOrLoginCode: "******",
      loginVia: LoginType.MOONTON,
      nickname: "LemonJr",
      heroRequests: "Gusion, Fanny, Ling",
      notes: "Main malam saja jam 11 keatas ya joki ganteng",
      waNumber: "08123456789",
      igAccount: "@lemon_jr"
    },
    orderDetails: "Epic II (3 Star) ➔ Legend V (0 Star) • Total 12 Bintang",
    totalPrice: 66000,
    paymentMethod: PAYMENT_METHODS[1], // DANA
    status: OrderStatus.PROCESSING,
    createdAt: "2026-06-24 14:35",
    jokiProgress: "Progres saat ini: Epic I (2 Bintang) • Sisa 3 Bintang lagi! (Winrate 90%)"
  },
  {
    id: "FNZ-49204",
    serviceType: ServiceType.PAKET,
    accountDetails: {
      emailOrPhone: "player_ml@yahoo.com",
      passwordOrLoginCode: "******",
      loginVia: LoginType.FB,
      nickname: "FannzzLover",
      heroRequests: "Claude, Bruno, Harith",
      notes: "Gak usah chat temen, main push aja langsung",
      waNumber: "08229481729",
      igAccount: "@mlbb_lover"
    },
    orderDetails: "Paket Epic ke Legend (Epic V ➔ Legend V)",
    totalPrice: 110000,
    paymentMethod: PAYMENT_METHODS[0], // QRIS
    status: OrderStatus.COMPLETED,
    createdAt: "2026-06-23 10:15",
    jokiProgress: "SELESAI! Akun sudah dikembalikan dengan selamat. Tier sekarang: Legend V (0 Star)."
  },
  {
    id: "FNZ-71239",
    serviceType: ServiceType.CLASSIC_BRAWL,
    accountDetails: {
      emailOrPhone: "08129994821",
      passwordOrLoginCode: "******",
      loginVia: LoginType.GOOGLE,
      nickname: "R7Fans",
      heroRequests: "Yu Zhong, Chou, Dyroth",
      notes: "Push winrate Chou biar kece badai gan",
      waNumber: "08129994821",
      igAccount: "@r7_fans_club"
    },
    orderDetails: "Joki Classic (GB Winrate) • 15 Pertandingan",
    totalPrice: 60000,
    paymentMethod: PAYMENT_METHODS[2], // GOPAY
    status: OrderStatus.PENDING,
    createdAt: "2026-06-25 08:30",
    jokiProgress: "Menunggu bukti transfer diverifikasi oleh admin Fannpedia."
  },
  {
    id: "FNZ-11029",
    serviceType: ServiceType.GENDONG,
    accountDetails: {
      emailOrPhone: "mabar_ml@gmail.com",
      passwordOrLoginCode: "Mabar (Tidak Perlu Login)",
      loginVia: LoginType.MOONTON,
      nickname: "SkyGlory",
      heroRequests: "Angela / Support",
      notes: "Sore mabar jam 4 ya bosku",
      waNumber: "08521193829",
      igAccount: "@skyglory"
    },
    orderDetails: "Mabar Gendong - Rank Mythic • 5 Pertandingan",
    totalPrice: 90000,
    paymentMethod: PAYMENT_METHODS[1], // DANA
    status: OrderStatus.COMPLETED,
    createdAt: "2026-06-22 16:00",
    jokiProgress: "SELESAI! Hasil mabar: 5 Menang, 0 Kalah. Winrate 100%!"
  }
];

export const TESTIMONIALS = [
  {
    name: "Andi Wijaya",
    rank: "Epic ke Mythic",
    review: "Asli cepet banget jokinya! Cuman butuh waktu 1 hari setengah dari Epic langsung mendarat di Mythic. Winrate hero heronya juga gila 94%, nyesel baru tau Fannpedia!",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Rizky Ramadhan",
    rank: "Paket Legend ke Mythic",
    review: "Awalnya ragu karena takut akun di-hack, ternyata amanah 100%! Adminnya ramah, dikasih laporan progress terus pas lagi main. Sangat direkomendasikan buat yang stuck badak!",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Clara S.",
    rank: "Classic Winrate Chou",
    review: "Request hero Chou dimainin bersih banget sama jokinya, Savage berkali kali. MMR naik pesat, winrate langsung ijo royo-royo. Makasih Fannpedia!",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  }
];
