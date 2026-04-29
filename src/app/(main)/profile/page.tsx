import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User as UserIcon } from "lucide-react";
import prisma from "@/lib/db";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.userAccount.findUnique({
    where: { id: session.userId },
    include: { person: true }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-teal-500/50">
          <UserIcon size={48} className="text-teal-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100">{user?.person?.fullName || "Chưa cập nhật tên"}</h1>
        <p className="text-slate-400 mt-2">{user?.email}</p>
        
        <div className="mt-8 inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-4 py-1.5 border border-slate-700/50">
          <span className="text-sm text-slate-300">Quyền hạn:</span>
          <span className="text-sm font-semibold text-teal-400">{user?.role}</span>
        </div>
      </div>
      
      <div className="text-center text-slate-500 text-sm">
        Tính năng chỉnh sửa hồ sơ chi tiết sẽ được cập nhật trong phiên bản tiếp theo.
      </div>
    </div>
  );
}
