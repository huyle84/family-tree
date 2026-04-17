"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCheck, Settings, LogOut, TreePine } from "lucide-react";
import { logoutAction } from "@/app/actions/authActions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Quản lý Tài khoản", href: "/admin/users", icon: Users },
    { name: "Phê duyệt (Workflow)", href: "/admin/approvals", icon: UserCheck },
    { name: "Cài đặt Hệ thống", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-100">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col relative z-10 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center space-x-3 text-teal-400">
            <TreePine size={24} className="drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
            <span className="text-lg font-bold tracking-tight">Ký Ức Gia Tộc</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Bảng điều khiển</p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? "bg-teal-500/10 text-teal-400 font-medium border border-teal-500/20" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-teal-400" : "text-slate-500"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <form action={logoutAction}>
            <button className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold capitalize">
            {navigation.find(n => n.href === pathname)?.name || "Quản trị"}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200">Quản trị viên</p>
              <p className="text-xs text-slate-400">admin@giadinh.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full border-2 border-slate-700"></div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
