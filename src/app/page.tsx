import React from 'react';
import Link from 'next/link';
import { TreePine } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { logoutAction } from '@/app/actions/authActions';
import LandingContent from '@/components/LandingContent';

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/30">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

      {/* Navbar Glassmorphism */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/60 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-teal-400">
            <TreePine size={28} className="drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
            <span className="text-xl font-bold tracking-tight">DÒNG HỌ LÊ</span>
          </div>
          <div className="flex space-x-4 items-center">
            {session ? (
              <>
                <Link href="/tree" className="px-4 py-2 text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all">
                  Vào Cây Gia Phả
                </Link>
                {session.role === "Admin" && (
                  <Link href="/admin" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Quản trị
                  </Link>
                )}
                <form action={logoutAction}>
                  <button className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                    Đăng xuất
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Đăng nhập
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Interactive Content */}
      <LandingContent />
    </div>
  );
}
