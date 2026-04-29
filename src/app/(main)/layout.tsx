"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Network, Search, LogOut, TreePine, User as UserIcon } from "lucide-react";
import { logoutAction } from "@/app/actions/authActions";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Cây Gia phả", href: "/tree", icon: Network },
    { name: "Danh bạ", href: "/directory", icon: Search },
    { name: "Hồ sơ của tôi", href: "/profile", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 text-teal-400">
            <TreePine size={28} className="drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
            <span className="text-xl font-bold tracking-tight hidden sm:block">Ký Ức Gia Tộc</span>
          </Link>
          
          <div className="flex space-x-1 sm:space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all ${
                    isActive 
                      ? "bg-teal-500/10 text-teal-400 font-medium" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden md:block text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4 pl-4 border-l border-slate-700">
            <form action={logoutAction}>
              <button title="Đăng xuất" className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10">
        {children}
      </main>
    </div>
  );
}
