"use client";

import { useTransition, useState } from "react";
import { registerAction } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await registerAction(null, formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans selection:bg-teal-500/30 relative py-12">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <UserPlus className="text-indigo-400" size={24} />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-500 text-center mb-2">Đăng ký tham gia</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Cần sự phê duyệt từ Quản trị viên</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Họ và tên đầy đủ</label>
            <input 
              name="fullName" 
              type="text" 
              required 
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email liên hệ</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="email@giadinh.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Mật khẩu</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex items-center justify-center mt-2 py-3 px-4 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-semibold rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 className="animate-spin text-slate-900" size={20} /> : "Gửi yêu cầu"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Đã có tài khoản? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Đăng nhập ngay</Link>
        </p>
      </motion.div>
    </div>
  );
}
