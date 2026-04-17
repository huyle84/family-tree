"use client";

import { useTransition, useState } from "react";
import { loginAction } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.redirect) {
        router.push(result.redirect);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans selection:bg-teal-500/30 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
            <ShieldCheck className="text-teal-400" size={24} />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-500 text-center mb-2">Đăng nhập</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Truy cập khu vực nội bộ dòng họ</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="email@giadinh.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Mật khẩu</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex items-center justify-center py-3 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 className="animate-spin text-slate-900" size={20} /> : "Vào bên trong"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Chưa có tài khoản? <Link href="/register" className="text-teal-400 hover:text-teal-300 font-medium">Gửi yêu cầu đăng ký</Link>
        </p>
      </motion.div>
    </div>
  );
}
