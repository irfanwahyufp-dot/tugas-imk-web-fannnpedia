import React, { useEffect, useState } from "react";

interface MeteorConfig {
  id: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
}

export default function MeteorBackground() {
  const [meteors, setMeteors] = useState<MeteorConfig[]>([]);

  useEffect(() => {
    // Generate organic scattered coordinates and timings for the shooting stars
    const generatedMeteors: MeteorConfig[] = Array.from({ length: 28 }).map((_, i) => {
      // Spread them across the top and sides of the screen to start organic paths
      const top = Math.random() * 70 + "%";
      const left = Math.random() * 110 - 10 + "%"; // some start off-screen left/right
      const delay = (Math.random() * 12).toFixed(2) + "s";
      const duration = (Math.random() * 4 + 4).toFixed(2) + "s"; // 4s to 8s speeds

      return {
        id: i,
        top,
        left,
        delay,
        duration,
      };
    });

    setMeteors(generatedMeteors);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic Cosmic Gradient Layer */}
      <div className="absolute inset-0 bg-radial-[circle_at_15%_25%] from-[#1e1b4b]/30 via-[#0e0a1b]/98 to-[#040306] opacity-95" />
      
      {/* Ambient glowing nebulas (cyber cyan, majestic violet, royal purple) */}
      <div className="absolute top-[12%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#06b6d4]/[0.08] blur-[150px] mix-blend-screen" />
      <div className="absolute top-[35%] right-[5%] w-[600px] h-[600px] rounded-full bg-[#8b5cf6]/[0.12] blur-[160px] mix-blend-screen" />
      <div className="absolute bottom-[15%] left-[20%] w-[450px] h-[450px] rounded-full bg-[#ec4899]/[0.04] blur-[130px] mix-blend-screen" />
      <div className="absolute top-[70%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#7c3aed]/[0.06] blur-[120px] mix-blend-screen" />

      {/* Meteors */}
      {meteors.map((m) => (
        <div
          key={m.id}
          className="absolute pointer-events-none opacity-0"
          style={{
            top: m.top,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
            animationName: "meteor-slide",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {/* Elegant tail pointing up-right (rotated by 45 degrees relative to bottom-left) */}
          <div 
            className="absolute bottom-0 left-0 w-[1.5px] h-[95px] bg-gradient-to-t from-white via-cyan-400/40 to-transparent origin-bottom" 
            style={{ transform: "rotate(45deg)" }}
          />
          {/* Glowing head with custom drop-shadow and cyan flare */}
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-white rounded-full -translate-x-[4px] translate-y-[4px] shadow-[0_0_10px_#ffffff,0_0_20px_#06b6d4,0_0_35px_#06b6d4]" />
        </div>
      ))}
    </div>
  );
}
