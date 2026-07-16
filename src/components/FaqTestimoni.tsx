import React, { useState } from "react";
import { TESTIMONIALS } from "../data";
import { HelpCircle, Star, Quote, ChevronDown, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FaqTestimoni() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah jasa joki Mobile Legends di Fannpedia aman?",
      a: "Sangat Aman! Kami menjaga kerahasiaan data akun Anda 100%. Sandi Anda dienkripsi dan joki dilarang keras untuk menyalahgunakan akun (seperti membeli diamond tanpa izin, menggunakan cheat, atau mengirim pesan aneh). Setelah joki selesai, Anda kami wajibkan untuk mengganti sandi demi keamanan tambahan."
    },
    {
      q: "Berapa lama waktu proses pengerjaan joki?",
      a: "Waktu pengerjaan bergantung pada jumlah bintang yang dipesan. Rata-rata tim joki pro player kami menyelesaikan 3-5 bintang per jam di tier bawah, dan sekitar 1-2 hari untuk menembus tier tinggi (seperti Legend ke Mythic). Kami selalu berupaya menyelesaikannya secepat mungkin!"
    },
    {
      q: "Apakah saya boleh login saat akun sedang dijoki?",
      a: "Dilarang login saat joki sedang berjalan karena dapat menyebabkan tabrakan koneksi (interrupted) yang dapat membuat tim kalah (lose streak) dan membahayakan keamanan akun Anda. Jika terpaksa ingin login, wajib menghubungi admin kami terlebih dahulu untuk memberitahu joki."
    },
    {
      q: "Bagaimana cara membayar pesanan joki?",
      a: "Kami menyediakan berbagai metode pembayaran instan mulai dari QRIS (bisa discan dengan seluruh aplikasi e-wallet dan m-banking), DANA, OVO, GOPAY, ShopeePay, hingga transfer bank BCA dan BRI. Pembayaran diproses secara amanah langsung ke owner (Irfan Wahyu)."
    },
    {
      q: "Bagaimana jika joki mengalami Lose Streak?",
      a: "Kami memberikan garansi 100%. Jika joki kami mengalami kekalahan atau lose streak, kami akan mengganti kekalahan tersebut dengan bintang gratis sebagai kompensasi atau mengembalikan sebagian uang Anda sesuai persetujuan. Kepuasan Anda adalah prioritas kami!"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 text-left space-y-12" id="faq-testimoni">
      
      {/* Title */}
      <div className="border-b border-neutral-900 pb-5 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          FAQ & Testimoni Pelanggan
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Pertanyaan umum mengenai Fannpedia dan ulasan asli dari pelanggan setia kami.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: FAQs (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-850 bg-neutral-900/20 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 flex justify-between items-center text-left hover:bg-neutral-900/40 transition-colors"
                  >
                    <span className="text-sm font-bold text-neutral-200 pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-amber-400" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-xs md:text-sm text-neutral-400 border-t border-neutral-900/50 leading-relaxed bg-neutral-950/20">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Testimonials (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            Ulasan Kepuasan Player
          </h3>

          <div className="space-y-4">
            {TESTIMONIALS.map((testi, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-neutral-850 bg-neutral-900/40 backdrop-blur-xs space-y-3 relative overflow-hidden"
              >
                <Quote className="absolute right-4 bottom-4 w-12 h-12 text-neutral-800/15 pointer-events-none" />

                {/* Stars Rating */}
                <div className="flex text-amber-400">
                  {Array.from({ length: testi.stars }).map((_, sIdx) => (
                    <Star key={sIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs md:text-sm text-neutral-300 italic leading-relaxed">
                  "{testi.review}"
                </p>

                {/* User Avatar & Name */}
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-900">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{testi.name}</h4>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/10 px-1.5 py-0.5 rounded-sm">
                      Layanan: {testi.rank}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
