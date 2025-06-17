"use client";
import { useEffect, useState } from "react";

// Profil sayfası: Kullanıcı kendi bilgilerini görüntüleyip güncelleyebilir.
export default function ProfilePage() {
  // Kullanıcı, form, yüklenme ve mesaj state'leri
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Sayfa yüklendiğinde kullanıcı bilgisini API'den alır ve localStorage'a kaydeder
  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setUserId(id);
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/admin/users`)
      .then((res) => res.json())
      .then((data) => {
        const u = data.users?.find((u: any) => String(u.id) === id);
        if (u) {
          setUser(u);
          setForm({ name: u.name, email: u.email, address: u.address || "", phone: u.phone || "", password: "" });
          if (typeof window !== "undefined") {
            localStorage.setItem("userName", u.name);
            localStorage.setItem("userEmail", u.email);
            localStorage.setItem("userAddress", u.address || "");
            localStorage.setItem("userPhone", u.phone || "");
          }
        }
      })
      .catch(() => setError("Kullanıcı bilgileri alınamadı."))
      .finally(() => setLoading(false));
  }, []);

  // Form input değişikliklerini yönetir
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Profil güncelleme işlemini API'ye gönderir ve localStorage'ı günceller
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
          phone: form.phone,
          password: form.password || undefined,
        }),
      });
      if (res.ok) {
        setSuccess("Bilgileriniz güncellendi.");
        setForm({ ...form, password: "" });
        if (typeof window !== "undefined") {
          localStorage.setItem("userName", form.name);
          localStorage.setItem("userEmail", form.email);
          localStorage.setItem("userAddress", form.address);
          localStorage.setItem("userPhone", form.phone);
        }
      } else {
        setError("Güncelleme başarısız.");
      }
    } catch {
      setError("Sunucu hatası.");
    }
    setLoading(false);
  };

  // Kullanıcı giriş yapmamışsa veya yükleniyorsa uygun mesajı gösterir
  if (!userId) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-[#a05a2c]">Giriş yapmalısınız.</div>;
  }
  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#a05a2c]">Yükleniyor...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-[#a05a2c]">Kullanıcı bulunamadı.</div>;

  // Sayfa arayüzü ve profil formu
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fbeee0] py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-[#a05a2c]">
        <h1 className="text-3xl font-bold text-[#a05a2c] mb-6 text-center">Profilim</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-[#a05a2c]">Ad Soyad
            <input name="name" type="text" className="input input-bordered w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none" value={form.name} onChange={handleChange} required />
          </label>
          <label className="font-semibold text-[#a05a2c]">E-posta
            <input name="email" type="email" className="input input-bordered w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none" value={form.email} onChange={handleChange} required />
          </label>
          <label className="font-semibold text-[#a05a2c]">Adres
            <input name="address" type="text" className="input input-bordered w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none" value={form.address} onChange={handleChange} required />
          </label>
          <label className="font-semibold text-[#a05a2c]">Telefon
            <input name="phone" type="tel" className="input input-bordered w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none" value={form.phone} onChange={handleChange} required />
          </label>
          <label className="font-semibold text-[#a05a2c]">Yeni Şifre (değiştirmek istemiyorsan boş bırak)
            <input name="password" type="password" className="input input-bordered w-full bg-[#fff7ec] text-[#7a3a13] border-2 border-[#a05a2c] rounded-none" value={form.password} onChange={handleChange} minLength={6} />
          </label>
          <div className="flex gap-4 items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow border ${user.role === "admin" ? "bg-red-200 text-red-800 border-red-400" : "bg-green-200 text-green-800 border-green-400"}`}>{user.role === "admin" ? "Admin" : "Müşteri"}</span>
            {user.isApproved ? (
              <span className="px-4 py-2 rounded-full text-base font-bold shadow border bg-green-600 text-white border-green-800 drop-shadow-lg">Onaylı</span>
            ) : (
              <span className="badge bg-[#a05a2c] text-white">Bekliyor</span>
            )}
          </div>
          <button type="submit" className="btn bg-[#a05a2c] text-white hover:bg-[#7a3a13] mt-2 text-lg font-bold tracking-wide rounded-none" disabled={loading}>{loading ? "Kaydediliyor..." : "Kaydet"}</button>
          {success && <div className="alert alert-success mt-2 text-center">{success}</div>}
          {error && <div className="alert alert-error mt-2 text-center">{error}</div>}
        </form>
      </div>
    </main>
  );
} 