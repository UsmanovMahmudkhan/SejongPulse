"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/pulse", icon: "amp_stories", label: "Feed" },
    { href: "/advisor", icon: "auto_awesome", label: "Advisor" },
    { href: "/messages/channels", icon: "hub", label: "Channels" },
    { href: "/discovery", icon: "grid_view", label: "Discovery" },
    { href: "/profile", icon: "person", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/60 backdrop-blur-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem] border-t border-outline-variant/20">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-3 transition-all duration-300 hover:scale-110 
              ${isActive 
                ? "liquid-gradient text-white rounded-2xl px-5 py-3 shadow-[0_12px_24px_rgba(150,0,24,0.15)] outline outline-1 outline-white/20" 
                : "text-slate-400 hover:text-primary"}`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.05em] mt-1 text-center font-headline">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
