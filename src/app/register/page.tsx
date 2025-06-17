"use client";

import { useState } from "react";

export default function RegisterPage() {
  // Kayıt formu, yüklenme, başarı ve hata state'leri
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form input değişikliklerini yönetir
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Kayıt formu gönderildiğinde API'ye istek atar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Başvurunuz alınmıştır, admin onayı bekleniyor.");
        setForm({ name: "", surname: "", email: "", password: "", address: "", phone: "" });
        setTimeout(() => { window.location.href = "/"; }, 1500);
      } else {
        setError(data.message || "Bir hata oluştu.");
      }
    } catch {
      setError("Bir hata oluştu.");
    }
    setLoading(false);
  };

  // Sayfa arayüzü ve kayıt formu
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
          <h1 className="text-3xl font-bold text-[#a05a2c] mb-1 text-center">Kayıt Ol</h1>
          <p className="text-[#7a3a13] text-center mb-4">Hemen başvur, onaydan sonra sipariş vermeye başla!</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center">
            {/* Ad, soyad, e-posta, şifre, adres ve telefon alanları */}
            <div className="flex flex-col gap-3 w-4/5 mx-auto">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-[#a05a2c]">👤</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Ad"
                  className="input input-bordered input-lg w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none focus:border-[#a05a2c] focus:shadow-lg placeholder:text-[#a05a2c]/60 pl-10 mx-auto"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-[#a05a2c]">👤</span>
                <input
                  name="surname"
                  type="text"
                  placeholder="Soyad"
                  className="input input-bordered input-lg w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none focus:border-[#a05a2c] focus:shadow-lg placeholder:text-[#a05a2c]/60 pl-10 mx-auto"
                  value={form.surname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
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
                minLength={6}
                required
              />
            </div>
            <div className="relative w-4/5 mx-auto">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-[#a05a2c]">🏠</span>
              <input
                name="address"
                type="text"
                placeholder="Adres"
                className="input input-bordered input-lg w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none focus:border-[#a05a2c] focus:shadow-lg placeholder:text-[#a05a2c]/60 pl-10 mx-auto"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative w-4/5 mx-auto">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-[#a05a2c]">📞</span>
              <input
                name="phone"
                type="tel"
                placeholder="Telefon"
                className="input input-bordered input-lg w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none focus:border-[#a05a2c] focus:shadow-lg placeholder:text-[#a05a2c]/60 pl-10 mx-auto"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn bg-[#a05a2c] text-white hover:bg-[#7a3a13] mt-2 text-lg font-bold tracking-wide rounded-none w-4/5 mx-auto"
              disabled={loading}
            >
              {loading ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>
            {success && (
              <div className="alert alert-success mt-2 text-center">
                <span className="font-bold text-lg text-[#7a3a13]">{success}</span>
              </div>
            )}
            {error && <div className="alert alert-error mt-2 text-center">{error}</div>}
          </form>
        </div>
      </div>
    </main>
  );
} 