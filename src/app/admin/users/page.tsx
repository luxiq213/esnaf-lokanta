"use client";

import { useEffect, useState } from "react";
import { UserCircleIcon, CheckCircleIcon, XCircleIcon, UserGroupIcon } from "@heroicons/react/24/solid";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  address?: string;
  phone?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const refreshUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => setError("Kullanıcılar yüklenemedi."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshUsers();
    if (typeof window !== "undefined") {
      setCurrentUserId(localStorage.getItem("userId"));
    }
  }, []);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
    refreshUsers();
    setActionLoading(null);
  };

  const handleDelete = async (id: number) => {
    setActionLoading(id);
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    refreshUsers();
    setActionLoading(null);
  };

  const handleRoleChange = async (id: number, currentRole: string) => {
    setActionLoading(id);
    const newRole = currentRole === "admin" ? "customer" : "admin";
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    refreshUsers();
    setActionLoading(null);
  };

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.address?.toLowerCase().includes(q) ?? false) ||
      (user.phone?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <main className="min-h-screen bg-[#fbeee0] flex flex-col items-center py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-0 md:p-8 border border-[#a05a2c] flex flex-col gap-6">
        <div className="flex flex-col gap-2 mb-2 border-b border-[#a05a2c] pb-4 px-4 pt-6">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-[#a05a2c]"/>
            <h1 className="text-3xl font-bold text-[#a05a2c]">Kullanıcı Yönetimi</h1>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Kullanıcı ara (isim, e-posta, adres, telefon)"
            className="input input-bordered w-full max-w-md bg-[#fbeee0] text-[#7a3a13] border-2 border-[#a05a2c] rounded-2xl focus:border-[#a05a2c] focus:shadow-lg mt-2"
          />
        </div>
        {loading ? (
          <div className="text-center text-[#a05a2c] py-12">Yükleniyor...</div>
        ) : error ? (
          <div className="alert alert-error text-center">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#a05a2c] opacity-60">
            <UserCircleIcon className="w-16 h-16 mb-2"/>
            <span>Kayıtlı kullanıcı yok.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-8">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex flex-col md:flex-row items-center gap-4 bg-[#fbeee0] rounded-2xl p-4 border border-[#a05a2c] shadow">
                <div className="flex flex-col items-center gap-2 min-w-[90px]">
                  <div className="w-14 h-14 rounded-full bg-[#a05a2c] text-white flex items-center justify-center text-2xl font-bold shadow">{user.name?.[0] || "?"}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow border ${user.role === "admin" ? "bg-red-200 text-red-800 border-red-400" : "bg-green-200 text-green-800 border-green-400"}`}>{user.role === "admin" ? "Admin" : "Müşteri"}</span>
                  {user.isApproved ? (
                    <span className="flex items-center gap-1 text-green-700 font-semibold text-xs"><CheckCircleIcon className="w-4 h-4"/>Onaylı</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#a05a2c] font-semibold text-xs"><XCircleIcon className="w-4 h-4"/>Bekliyor</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-1 w-full">
                  <div className="font-bold text-lg text-[#a05a2c]">{user.name}</div>
                  <div className="text-[#7a3a13] text-sm">{user.email}</div>
                  <div className="text-[#7a3a13] text-sm">{user.address || <span className="italic text-[#a05a2c]/60">Adres yok</span>}</div>
                  <div className="text-[#7a3a13] text-sm">{user.phone || <span className="italic text-[#a05a2c]/60">Telefon yok</span>}</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {!user.isApproved && (
                      <button onClick={() => handleApprove(user.id)} disabled={actionLoading === user.id} className="btn btn-sm bg-[#a05a2c] text-white hover:bg-[#7a3a13] rounded-2xl px-4 font-bold shadow">{actionLoading === user.id ? "..." : "Onayla"}</button>
                    )}
                    {/* Rol değiştir butonu: kendi satırında gösterme */}
                    {(!currentUserId || String(user.id) !== currentUserId) && (
                      <button onClick={() => handleRoleChange(user.id, user.role)} disabled={actionLoading === user.id} className="btn btn-sm bg-[#fbeee0] text-[#a05a2c] border border-[#a05a2c] hover:bg-[#fff7ec] rounded-2xl px-4 font-bold shadow">{user.role === "admin" ? "Müşteri Yap" : "Admin Yap"}</button>
                    )}
                    <button onClick={() => handleDelete(user.id)} disabled={actionLoading === user.id} className="btn btn-sm bg-red-200 text-red-800 hover:bg-red-400 rounded-2xl px-4 font-bold shadow">Sil</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 