"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "");
    setUserRole(localStorage.getItem("userRole") || "");
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="w-full flex flex-row items-center py-8 bg-[#fff7ec] shadow-sm justify-center px-8">
      <nav className="flex items-center w-full relative justify-between">
        {/* Sol: Logo ve kullanıcı adı/rolü */}
        <div className="flex items-center gap-2 min-w-max">
          <div className="bg-[#fff7ec] rounded-full flex items-center justify-center">
            <img src="/logo.png" alt="Cömert Lokantası Logo" className="w-14 h-14" />
          </div>
          {userName && (
            <div className="flex items-center gap-1 pl-1">
              <span className="font-bold text-[#a05a2c] bg-[#fbeee0] px-3 py-1 rounded-full shadow">{userName}</span>
              {userRole && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold shadow border ${userRole === "admin" ? "bg-red-200 text-red-800 border-red-400" : "bg-green-200 text-green-800 border-green-400"}`}>
                  {userRole === "admin" ? "Admin" : "Müşteri"}
                </span>
              )}
            </div>
          )}
        </div>
        {/* Orta: Menü yazıları + Sepetim */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <Link href="/" className="text-2xl font-bold text-[#a05a2c] tracking-wide">Anasayfa</Link>
          <Link href="/products" className="bg-[#f5e3d3] text-[#7a3a13] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e2cdb3] transition">Ürünler</Link>
          <Link href="/profile" className="bg-[#f5e3d3] text-[#7a3a13] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e2cdb3] transition">Profil</Link>
          <Link href="/messages" className="bg-[#f5e3d3] text-[#7a3a13] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e2cdb3] transition">Mesajlaşma</Link>
          {userName && (
            <Link href="/cart" className="bg-[#f5e3d3] text-[#7a3a13] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e2cdb3] transition">Sepetim</Link>
          )}
        </div>
        {/* Sağ: Admin onay, giriş/çıkış butonları */}
        <div className="flex items-center gap-2 min-w-max">
          {userName && userRole === "admin" && (
            <>
              <Link href="/admin/users" className="bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-200 border border-red-400 transition">Kullanıcı Yönetimi</Link>
              <Link href="/admin/products" className="bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-200 border border-red-400 transition">Ürün Yönetimi</Link>
            </>
          )}
          {userName ? (
            <button
              onClick={() => {
                localStorage.removeItem("userName");
                localStorage.removeItem("userId");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userAddress");
                localStorage.removeItem("userPhone");
                localStorage.removeItem("cart");
                window.location.href = "/";
              }}
              className="bg-red-200 text-red-800 font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-400 transition"
            >
              Çıkış Yap
            </button>
          ) : (
            <>
              <Link href="/login" className="bg-[#f5e3d3] text-[#7a3a13] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e2cdb3] transition">Giriş Yap</Link>
              <Link href="/register" className="bg-[#f5e3d3] text-[#7a3a13] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e2cdb3] transition">Kayıt Ol</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
} 