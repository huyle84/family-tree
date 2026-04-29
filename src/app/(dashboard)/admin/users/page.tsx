import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { UserCheck, Users, ShieldAlert, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { approveUserAction, rejectUserAction, deleteUserAction, setRoleAction } from "@/app/actions/adminActions";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Editor" && session.role !== "Moderator")) {
    redirect("/login");
  }

  const isAdmin = session.role === "Admin";

  const users = await prisma.userAccount.findMany({
    orderBy: { email: 'asc' }
  });

  const pendingUsers = users.filter(u => u.status === "Pending");
  const activeUsers = users.filter(u => u.status === "Active");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="text-indigo-400" /> Quản lý Tài khoản
        </h1>
        <p className="text-slate-400 mt-1">Phê duyệt đăng ký mới và quản lý phân quyền thành viên.</p>
      </div>

      {/* Danh sách chờ duyệt */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex items-center gap-2">
          <UserCheck className="text-yellow-400" size={20} />
          <h2 className="font-semibold text-slate-200">Yêu cầu đăng ký mới ({pendingUsers.length})</h2>
        </div>
        <div className="p-0">
          {pendingUsers.length === 0 ? (
            <p className="text-slate-500 p-6 text-center text-sm">Không có yêu cầu đăng ký nào đang chờ duyệt.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Quyền hạn</th>
                  {isAdmin && <th className="px-6 py-3 font-medium text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pendingUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-200">{user.email}</td>
                    <td className="px-6 py-4 text-slate-400">{user.role}</td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right space-x-2">
                        <form action={async () => { "use server"; await approveUserAction(user.id); }} className="inline">
                          <button className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg font-medium transition-colors">Duyệt</button>
                        </form>
                        <form action={async () => { "use server"; await rejectUserAction(user.id); }} className="inline">
                          <button className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors">Từ chối</button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Danh sách đang hoạt động */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex items-center gap-2">
          <ShieldAlert className="text-teal-400" size={20} />
          <h2 className="font-semibold text-slate-200">Tài khoản Đang hoạt động ({activeUsers.length})</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
                <th className="px-6 py-3 font-medium">Quyền hạn</th>
                {isAdmin && <th className="px-6 py-3 font-medium text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {activeUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-xs">Active</span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-500/20 text-purple-300' :
                      user.role === 'Editor' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right space-x-2">
                      {user.role === "Member" && (
                        <form action={async () => { "use server"; await setRoleAction(user.id, "Editor"); }} className="inline">
                          <button title="Nâng cấp thành Editor" className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <ArrowUpCircle size={18} />
                          </button>
                        </form>
                      )}
                      {user.role === "Editor" && (
                        <form action={async () => { "use server"; await setRoleAction(user.id, "Member"); }} className="inline">
                          <button title="Giáng cấp thành Member" className="p-2 text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                            <ArrowDownCircle size={18} />
                          </button>
                        </form>
                      )}
                      {user.role !== "Admin" && (
                        <form action={async () => { "use server"; await deleteUserAction(user.id); }} className="inline">
                           <button title="Xóa tài khoản" className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                             <Trash2 size={18} />
                           </button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
