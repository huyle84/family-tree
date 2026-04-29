import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, GitCommit, Network } from "lucide-react";

export default async function TreePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch dữ liệu cây
  const people = await prisma.person.findMany({ orderBy: { birthDate: 'asc' } });
  const unions = await prisma.union.findMany({ 
    include: { 
      persons: { include: { person: true } },
      children: { include: { person: true } }
    } 
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Network className="text-teal-400" /> Cây Gia Phả
        </h1>
        <p className="text-slate-400 mt-2">Sơ đồ phân cấp các thế hệ trong dòng họ. Nhóm theo từng cuộc hôn nhân.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unions.map(u => {
          const husband = u.persons.find(up => up.role === "Husband")?.person;
          const wife = u.persons.find(up => up.role === "Wife")?.person;

          return (
            <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-indigo-500"></div>
              
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <Users size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-blue-300">{husband ? husband.fullName : "Chưa rõ"}</p>
                  <p className="text-xs text-slate-500 mb-1">{u.status}</p>
                  <p className="font-bold text-pink-300">{wife ? wife.fullName : "Chưa rõ"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Thế hệ Con cái ({u.children.length})</h3>
                {u.children.length > 0 ? (
                  <ul className="space-y-2">
                    {u.children.map(c => (
                      <li key={c.personId} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
                        <GitCommit size={14} className="text-teal-500" />
                        {c.person.fullName}
                        {c.isAdopted && <span className="ml-auto text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">Con nuôi</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">Chưa có thông tin con cái.</p>
                )}
              </div>
            </div>
          );
        })}

        {unions.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
            Chưa có dữ liệu phả hệ nào được ghi nhận.
          </div>
        )}
      </div>
    </div>
  );
}
