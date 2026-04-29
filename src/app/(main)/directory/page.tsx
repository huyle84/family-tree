import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Search, UserCircle } from "lucide-react";

export default async function DirectoryPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const people = await prisma.person.findMany({ orderBy: { fullName: 'asc' } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Search className="text-teal-400" /> Danh bạ Gia tộc
        </h1>
        <p className="text-slate-400 mt-2">Tra cứu nhanh thông tin của tất cả thành viên trong gia đình.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Họ và Tên</th>
                <th className="px-6 py-4 font-medium">Giới tính</th>
                <th className="px-6 py-4 font-medium">Năm sinh</th>
                <th className="px-6 py-4 font-medium">Năm mất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {people.map(person => (
                <tr key={person.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-200 flex items-center gap-3">
                    <UserCircle className="text-slate-500" size={18} />
                    <span className="font-medium">{person.fullName}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {person.gender === 'Male' ? 'Nam' : person.gender === 'Female' ? 'Nữ' : 'Chưa rõ'}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {person.birthDate ? new Date(person.birthDate).getFullYear() : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {person.deathDate ? new Date(person.deathDate).getFullYear() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {people.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              Chưa có dữ liệu danh bạ.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
