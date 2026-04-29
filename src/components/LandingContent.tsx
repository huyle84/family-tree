"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UploadCloud, ShieldCheck } from 'lucide-react';

export default function LandingContent() {
  const [activeTab, setActiveTab] = useState<'tree' | 'upload'>('tree');

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-4 py-1.5 mb-6 border border-slate-700/50">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span className="text-sm text-slate-300">Bảo mật Zero-Knowledge Proof (AES-256)</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-teal-100 to-teal-500 bg-clip-text text-transparent">
          Lưu giữ dòng hồi tưởng qua nhiều thế hệ
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-8">
          Nền tảng cây gia phả số tiên tiến với công nghệ mã hoá E2E. Đảm bảo sự riêng tư tuyệt đối cho dữ liệu và câu chuyện của gia đình bạn, trường tồn với thời gian.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab('tree')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'tree'
              ? 'bg-slate-100 text-slate-900 shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <Users size={18} />
            <span>Sơ đồ Gia phả</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'upload'
              ? 'bg-slate-100 text-slate-900 shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <UploadCloud size={18} />
            <span>Kho lưu trữ an toàn</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full min-h-[500px] border border-slate-800 bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {activeTab === 'tree' ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Users size={32} className="text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Cây Gia Phả Tương Tác</h3>
            <p className="text-slate-400 max-w-md text-center">
              Mô đun D3.js hoặc react-family-tree sẽ được nhúng tại đây. Cho phép zoom, kéo thả và click vào từng nút để xem hồ sơ.
            </p>

            <div className="mt-12 flex space-x-8 relative group cursor-pointer">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -z-10 transform -translate-y-1/2"></div>
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center hover:border-teal-400 transition-colors shadow-lg w-32">
                <div className="w-12 h-12 bg-slate-700 rounded-full mx-auto mb-2 overflow-hidden border-2 border-slate-500"></div>
                <p className="text-sm font-semibold truncate">Ông Cố A</p>
                <p className="text-xs text-slate-400">1920 - 1980</p>
              </div>
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center hover:border-teal-400 transition-colors shadow-lg w-32">
                <div className="w-12 h-12 bg-slate-700 rounded-full mx-auto mb-2 overflow-hidden border-2 border-slate-500"></div>
                <p className="text-sm font-semibold truncate">Bà Cố B</p>
                <p className="text-xs text-slate-400">1925 - 1990</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Mã Hoá File Phía Cuối (Client-Side)</h3>
            <p className="text-slate-400 max-w-md text-center mb-6">
              Mọi hình ảnh hay tài liệu bạn tải lên sẽ được mã hoá ngay trên trình duyệt bằng chuẩn AES-GCM 256-bit trước khi chuyển tới Cloud.
            </p>

            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 w-full max-w-lg text-center hover:border-teal-500 transition-colors cursor-pointer bg-slate-800/20">
              <UploadCloud size={48} className="mx-auto text-slate-500 mb-4" />
              <p className="text-sm text-slate-300 font-medium">Kéo thả file vào đây hoặc click để duyệt</p>
              <p className="text-xs text-slate-500 mt-2">Được bảo vệ bởi Web Crypto API</p>
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
