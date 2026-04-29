import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createPersonAction, createUnionAction, createChildAction } from "@/app/actions/adminActions";
import { UserPlus, HeartHandshake, Baby } from "lucide-react";

export default async function ManualInputPage() {
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Moderator")) {
    redirect("/login");
  }

  // Fetch dữ liệu để điền vào các select box
  const people = await prisma.person.findMany({ orderBy: { fullName: 'asc' } });
  const unions = await prisma.union.findMany({ include: { persons: { include: { person: true } } } });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          Nhập liệu Thủ công
        </h1>
        <p className="text-slate-400 mt-1">Sử dụng các biểu mẫu dưới đây để thêm dữ liệu mà không cần thông qua AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form thêm Cá nhân */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2 mb-6 text-teal-400">
            <UserPlus />
            <h2 className="text-lg font-semibold">1. Thêm Cá nhân mới</h2>
          </div>
          <form action={async (formData) => { "use server"; await createPersonAction(formData); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Họ và Tên <span className="text-red-400">*</span></label>
              <input name="fullName" required className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tên húy/tự/biệt hiệu</label>
                <input name="aliases" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Giới tính</label>
                <select name="gender" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200">
                  <option value="Unknown">Chưa rõ</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Vị trí</label>
                <input type="number" name="familyOrder" placeholder="Con thứ..." className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Năm sinh</label>
                <input type="number" name="birthYear" placeholder="YYYY" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Năm mất</label>
                <input type="number" name="deathYear" placeholder="YYYY" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200" />
              </div>
            </div>

            <details className="group bg-slate-950/50 border border-slate-800 rounded-lg [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
                <span>Nhập thêm thông tin chi tiết (Tùy chọn)</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-4 pb-4 space-y-4 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Quê quán</label>
                    <input name="origin" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Nơi sinh</label>
                    <input name="birthPlace" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Nơi mất</label>
                    <input name="deathPlace" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Nơi an táng/phần mộ</label>
                    <input name="restingPlace" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Học vấn</label>
                    <input name="education" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Nghề nghiệp / Chức vụ</label>
                    <input name="career" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Công đức / Thành tựu</label>
                  <textarea name="merits" rows={2} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"></textarea>
                </div>
              </div>
            </details>

            <button className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors">Tạo Cá nhân</button>
          </form>
        </div>

        {/* Form thêm Hôn nhân */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2 mb-6 text-pink-400">
            <HeartHandshake />
            <h2 className="text-lg font-semibold">2. Tạo Hôn nhân</h2>
          </div>
          <form action={async (formData) => { "use server"; await createUnionAction(formData); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Người Chồng</label>
              <select name="husbandId" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200">
                <option value="">-- Bỏ trống (Không rõ) --</option>
                {people.map(p => <option key={p.id} value={p.id}>{p.fullName} {p.gender === 'Male' ? '(Nam)' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Người Vợ</label>
              <select name="wifeId" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200">
                <option value="">-- Bỏ trống (Không rõ) --</option>
                {people.map(p => <option key={p.id} value={p.id}>{p.fullName} {p.gender === 'Female' ? '(Nữ)' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Trạng thái</label>
              <select name="status" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200">
                <option value="Married">Đã kết hôn</option>
                <option value="Divorced">Đã ly hôn</option>
                <option value="Unmarried_Partners">Sống chung (Chưa kết hôn)</option>
                <option value="Unknown">Chưa rõ</option>
              </select>
            </div>
            <button className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition-colors">Tạo Hôn nhân</button>
          </form>
        </div>

        {/* Form thêm Con cái */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <Baby />
            <h2 className="text-lg font-semibold">3. Thêm Con cái</h2>
          </div>
          <form action={async (formData) => { "use server"; await createChildAction(formData); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Hôn nhân của Bố Mẹ <span className="text-red-400">*</span></label>
              <select name="unionId" required className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200">
                <option value="">-- Chọn một Hôn nhân --</option>
                {unions.map(u => {
                  const husband = u.persons.find(up => up.role === 'Husband')?.person.fullName || 'Vô danh';
                  const wife = u.persons.find(up => up.role === 'Wife')?.person.fullName || 'Vô danh';
                  return <option key={u.id} value={u.id}>{husband} & {wife}</option>
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Người Con <span className="text-red-400">*</span></label>
              <select name="childId" required className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200">
                <option value="">-- Chọn một Người --</option>
                {people.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </div>
            <div className="flex items-center mt-4">
              <input type="checkbox" name="isAdopted" id="isAdopted" className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
              <label htmlFor="isAdopted" className="ml-2 text-sm text-slate-300">Đánh dấu là Con nuôi</label>
            </div>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors mt-6">Liên kết Con</button>
          </form>
        </div>
      </div>
    </div>
  );
}
