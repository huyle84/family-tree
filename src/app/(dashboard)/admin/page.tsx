import { Users, UserX, FileCheck, ShieldAlert } from "lucide-react";

export default function AdminPage() {
  const stats = [
    { title: "Tổng thành viên", value: "842", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Chờ phê duyệt", value: "12", icon: ShieldAlert, color: "text-amber-400", bg: "bg-amber-400/10" },
    { title: "Đóng góp mới", value: "8", icon: FileCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { title: "Tài khoản bị khoá", value: "3", icon: UserX, color: "text-red-400", bg: "bg-red-400/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-lg min-h-[400px] flex flex-col items-center justify-center">
          <p className="text-slate-500 mb-4 animate-pulse">Biểu đồ tăng trưởng dòng họ</p>
          <div className="w-full h-48 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 flex items-center justify-center">
            <span className="text-xs text-slate-500">Tích hợp Recharts vào đây</span>
          </div>
        </div>
        
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex space-x-3 items-start p-3 hover:bg-slate-800/50 rounded-xl transition-colors">
                <div className="w-2 h-2 mt-2 bg-teal-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-slate-300">Ông <strong>Nguyễn Văn Bình</strong> vừa cập nhật ngày giỗ của Cụ Tổ.</p>
                  <p className="text-xs text-slate-500 mt-1">12 phút trước</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
