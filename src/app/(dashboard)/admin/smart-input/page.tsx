"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Save, Wand2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { parseSmartInputAction, commitSmartInputAction } from "@/app/actions/smartInputActions";
import { SmartInputResult } from "@/lib/schemas";

export default function SmartInputPage() {
  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<SmartInputResult | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleParse = async () => {
    if (!text.trim()) return;
    setIsParsing(true);
    setError("");
    setSuccess("");
    setParsedData(null);

    try {
      const result = await parseSmartInputAction(text);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setParsedData(result.data);
      }
    } catch (err: any) {
      setError("Đã xảy ra lỗi kết nối.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleCommit = async () => {
    if (!parsedData) return;
    setIsSaving(true);
    setError("");
    
    try {
      const result = await commitSmartInputAction(parsedData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Lưu dữ liệu vào hệ thống thành công!");
        setParsedData(null);
        setText("");
      }
    } catch (err: any) {
      setError("Không thể lưu vào CSDL.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Wand2 className="text-teal-400" /> Nhập liệu Thông minh (AI)
        </h1>
        <p className="text-slate-400 mt-2">Dùng ngôn ngữ tự nhiên để khai báo gia phả. Trí tuệ nhân tạo sẽ tự động bóc tách và tạo liên kết.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 flex items-center gap-3">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Khung Nhập Liệu */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-200">Văn bản mô tả</h2>
            <Bot className="text-indigo-400" />
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">Ví dụ mẫu:</p>
            <div className="bg-slate-800/50 p-3 rounded-lg text-sm text-slate-400 italic cursor-pointer hover:bg-slate-800 transition-colors"
                 onClick={() => setText("Cụ Nguyễn Văn A sinh năm 1900, mất 1980. Cụ có người vợ là bà Lê Thị B. Họ sinh ra 2 người con là Nguyễn Văn C và người con gái là Nguyễn Thị D. Nguyễn Văn C sau này lấy bà Trần Thị E.")}>
              "Cụ Nguyễn Văn A sinh năm 1900, mất 1980. Cụ có người vợ là bà Lê Thị B. Họ sinh ra 2 người con là Nguyễn Văn C và người con gái là Nguyễn Thị D. Nguyễn Văn C sau này lấy bà Trần Thị E."
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
            placeholder="Hãy viết mô tả bằng ngôn ngữ tự nhiên vào đây..."
          ></textarea>

          <button
            onClick={handleParse}
            disabled={isParsing || !text.trim()}
            className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            {isParsing ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
            {isParsing ? "Đang phân tích..." : "Phân tích bằng AI"}
          </button>
        </div>

        {/* Khung Xem trước & Lưu */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            Xem trước kết quả (Preview)
          </h2>

          {!parsedData ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
              <Bot size={48} className="mb-4 opacity-50" />
              <p>Kết quả từ AI sẽ hiển thị tại đây</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Danh sách người */}
              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-2 uppercase tracking-wider">Cá nhân ({parsedData.people.length})</h3>
                <div className="grid gap-2">
                  {parsedData.people.map(p => (
                    <div key={p.tempId} className="bg-slate-800/80 p-3 rounded-lg text-sm border border-slate-700 flex justify-between">
                      <span className="font-semibold text-slate-200">{p.fullName}</span>
                      <span className="text-slate-400">
                        {p.gender === 'Male' ? 'Nam' : p.gender === 'Female' ? 'Nữ' : 'Chưa rõ'} 
                        {(p.birthYear || p.deathYear) && ` (${p.birthYear || '?'} - ${p.deathYear || '?'})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hôn nhân & Con cái */}
              <div>
                <h3 className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-wider">Mối quan hệ</h3>
                <div className="space-y-3">
                  {parsedData.unions.map(u => {
                    const husband = parsedData.people.find(p => p.tempId === u.husbandTempId);
                    const wife = parsedData.people.find(p => p.tempId === u.wifeTempId);
                    const childrenLinks = parsedData.children.filter(c => c.unionTempId === u.unionTempId);
                    
                    return (
                      <div key={u.unionTempId} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
                          <span className="font-semibold text-blue-300">{husband?.fullName || "Chưa rõ (Vô danh)"}</span>
                          <span className="text-slate-500 text-xs px-2 border border-slate-600 rounded-full">{u.status}</span>
                          <span className="font-semibold text-pink-300">{wife?.fullName || "Chưa rõ (Vô danh)"}</span>
                        </div>
                        
                        {childrenLinks.length > 0 && (
                          <div className="pl-4 border-l-2 border-slate-600">
                            <p className="text-xs text-slate-400 mb-1">Con cái:</p>
                            <ul className="space-y-1">
                              {childrenLinks.map(c => {
                                const child = parsedData.people.find(p => p.tempId === c.childTempId);
                                return (
                                  <li key={c.childTempId} className="text-sm text-slate-300 flex items-center gap-2">
                                    - {child?.fullName || "N/A"}
                                    {c.isAdopted && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">Con nuôi</span>}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleCommit}
                disabled={isSaving}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(13,148,136,0.3)] mt-6"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Xác nhận & Lưu vào CSDL
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
