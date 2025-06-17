"use client";

import { useState } from "react";

export default function LoginPage() {
  // Giriş formu, yüklenme ve hata state'leri
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form input değişikliklerini yönetir
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Giriş formu gönderildiğinde API'ye istek atar ve kullanıcı bilgilerini localStorage'a kaydeder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user) {
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userRole", data.user.role);
          if (data.user.email) localStorage.setItem("userEmail", data.user.email);
          if (data.user.address) localStorage.setItem("userAddress", data.user.address);
          if (data.user.phone) localStorage.setItem("userPhone", data.user.phone);
        }
        setTimeout(() => { window.location.href = "/"; }, 100);
      } else {
        setError(data.message || "Giriş başarısız.");
      }
    } catch {
      setError("Bir hata oluştu.");
    }
    setLoading(false);
  };

  // Sayfa arayüzü ve giriş formu
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fbeee0] py-12">
      <div className="w-full max-w-md">
        <div className="card bg-white rounded-3xl shadow-2xl p-8 border border-[#a05a2c] flex flex-col items-center">
          <div className="avatar mb-4">
            <div className="w-20 rounded-full bg-[#fbeee0] flex items-center justify-center border-2 border-[#a05a2c]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#a05a2c" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25a7.25 7.25 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#a05a2c] mb-1 text-center">Giriş Yap</h1>
          <p className="text-[#7a3a13] text-center mb-4">Onaylı hesabınızla giriş yapın.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center">
            <div className="relative w-4/5 mx-auto">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-[#a05a2c]">📧</span>
              <input
                name="email"
                type="email"
                placeholder="E-posta"
                className="input input-bordered input-lg w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none focus:border-[#a05a2c] focus:shadow-lg placeholder:text-[#a05a2c]/60 pl-10 mx-auto"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative w-4/5 mx-auto">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-[#a05a2c]">🔒</span>
              <input
                name="password"
                type="password"
                placeholder="Şifre"
                className="input input-bordered input-lg w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none focus:border-[#a05a2c] focus:shadow-lg placeholder:text-[#a05a2c]/60 pl-10 mx-auto"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn bg-[#a05a2c] text-white hover:bg-[#7a3a13] mt-2 text-lg font-bold tracking-wide rounded-none w-4/5 mx-auto"
              disabled={loading}
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
            {error && (
              error === "Hesabınız henüz admin tarafından onaylanmadı." ? (
                <div className="alert mt-2 text-center bg-[#a05a2c] text-white font-bold border-2 border-[#7a3a13] shadow-lg">
                  {error}
                </div>
              ) : (
                <div className="alert alert-error mt-2 text-center">{error}</div>
              )
            )}
          </form>
        </div>
      </div>
    </main>
  );
} 