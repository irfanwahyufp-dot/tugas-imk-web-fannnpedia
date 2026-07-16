export enum ServiceType {
  PER_STAR = "per_star",
  PAKET = "paket",
  CLASSIC_BRAWL = "classic_brawl",
  GENDONG = "gendong",
  TUGAS = "tugas",
}

export enum LoginType {
  MOONTON = "Moonton",
  FB = "Facebook",
  TIKTOK = "TikTok",
  GOOGLE = "Google Play",
  VK = "VK Account",
}

export interface RankDetail {
  id: string;
  name: string;
  pricePerStar: number;
  minStar: number;
  maxStar: number;
  icon: string; // url or key
  color: string; // Tailwind color class for glow/accents
}

export interface JokiPackage {
  id: string;
  name: string;
  fromRank: string;
  toRank: string;
  price: number;
  description: string;
  badge: string;
}

export interface OtherService {
  id: string;
  name: string;
  pricePerMatch: number;
  type: "classic" | "brawl" | "gendong_legend" | "gendong_mythic" | "gendong_immortal";
  description: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: "E-Wallet" | "Bank Transfer" | "QRIS";
  fee: number;
  icon: string; // simple name or initial
  accountNo?: string;
  accountName?: string;
}

export interface OrderInput {
  emailOrPhone: string;
  passwordOrLoginCode: string;
  loginVia: LoginType;
  nickname: string;
  heroRequests: string;
  notes: string;
  waNumber: string;
  igAccount: string;
}

export enum OrderStatus {
  PENDING = "Pending (Menunggu Pembayaran)",
  PROCESSING = "Processing (Joki Sedang Bermain)",
  COMPLETED = "Completed (Joki Selesai)",
  CANCELLED = "Cancelled (Batal)",
}

export interface JokiOrder {
  id: string;
  serviceType: ServiceType;
  accountDetails: OrderInput;
  orderDetails: string; // e.g. "Epic II (3 Star) -> Legend V (0 Star)"
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  jokiProgress?: string; // e.g. "4/5 matches won" or "Currently Legend III"
}
