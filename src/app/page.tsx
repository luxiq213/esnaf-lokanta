"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [dailyMenu, setDailyMenu] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("userName") || "");
      setUserRole(localStorage.getItem("userRole") || "");
    }
    // Günün menüsünü çek
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const menu = data.products.find((p: any) => p.isDailyMenu);
          setDailyMenu(menu || null);
        }
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#f9f6f2] flex flex-col items-center">
      {/* Hero Image - Tam Genişlik ve Overlay Metin */}
      <section className="relative w-full h-[420px] flex items-center justify-center bg-[#fbeee0] overflow-hidden">
        <img 
          src="/hero.jpg" 
          alt="Lokanta Hero" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-black/30">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg mb-2">Her Damağa Hitap Eden Bol Çeşit, Lezzetin Tam Kalbinde!</h2>
          <p className="text-lg md:text-xl text-white text-center drop-shadow mb-4">Geleneksel tatlar, samimi hizmet</p>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="w-full max-w-4xl mt-10 px-4 py-8 rounded-2xl bg-gradient-to-b from-[#fbeee0] to-[#fff7ec] shadow-md mx-auto">
        <h2 className="text-3xl font-extrabold text-[#a05a2c] mb-10 text-center tracking-tight">Nasıl Çalışır?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-[#fbeee0] rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="font-bold text-xl text-[#a05a2c] mb-2">Kayıt Ol</h3>
            <p className="text-center text-[#7a3a13] text-sm">Kısa formu doldur, başvurunu gönder.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-[#fbeee0] rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="font-bold text-xl text-[#a05a2c] mb-2">Onay Bekle</h3>
            <p className="text-center text-[#7a3a13] text-sm">Admin onayından sonra hesabın aktifleşsin.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-[#fbeee0] rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow">
              <span className="text-3xl">🍲</span>
            </div>
            <h3 className="font-bold text-xl text-[#a05a2c] mb-2">Sipariş Ver</h3>
            <p className="text-center text-[#7a3a13] text-sm">Menüden seç, siparişini kolayca oluştur.</p>
          </div>
        </div>
      </section>

      {/* Günün Menüsü */}
      {dailyMenu && (
        <section className="w-full max-w-3xl mt-10 px-4 py-8 rounded-2xl bg-gradient-to-r from-[#fff7ec] to-[#fbeee0] shadow-xl mx-auto flex flex-col md:flex-row justify-center items-center border-2 border-[#a05a2c] gap-2">
          {/* Sol: Ürün görseli */}
          {dailyMenu.imageUrl && (
            <img src={dailyMenu.imageUrl} alt={dailyMenu.name} className="w-48 h-48 object-cover rounded-xl border-2 border-[#a05a2c] shadow-lg md:mr-2 md:ml-4" />
          )}
          {/* Sağ: Bilgi ve buton */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-[#a05a2c] mb-1">Bugün Ne Yiyelim?</div>
            <div className="text-base md:text-lg font-semibold text-[#7a3a13] mb-2">Şefin Seçimi: Günün En Taze Lezzeti</div>
            <div className="text-xl font-semibold text-[#a05a2c]">{dailyMenu.name}</div>
            <div className="text-[#7a3a13] font-medium mb-2 bg-[#fff7ec] px-3 py-1 rounded-lg border border-[#a05a2c]">Açıklama: {dailyMenu.description}</div>
            <div className="text-[#a05a2c] font-bold mb-2 bg-[#fbeee0] px-3 py-1 rounded-lg border border-[#a05a2c]">Stok: {dailyMenu.stock}</div>
            <button
              onClick={() => {
                router.push("/products");
                setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 50);
              }}
              className="mt-2 inline-block bg-[#a05a2c] hover:bg-[#7a3a13] text-white font-bold px-6 py-2 rounded-xl shadow transition"
            >
              Tüm Ürünleri Gör
            </button>
          </div>
        </section>
      )}

      {/* Hizmetlerimiz */}
      <section className="w-full max-w-4xl mt-16 px-4 py-8 rounded-2xl bg-gradient-to-b from-[#fff7ec] to-[#fbeee0] shadow-md mx-auto">
        <h2 className="text-3xl font-extrabold text-[#a05a2c] mb-10 text-center tracking-tight">Hizmetlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-[#fbeee0] rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="font-bold text-xl text-[#a05a2c] mb-2">Günlük Tabldot Yemek</h3>
            <p className="text-center text-[#7a3a13] text-sm">Her gün taze ve doyurucu menüler.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-[#fbeee0] rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow">
              <span className="text-3xl">🥗</span>
            </div>
            <h3 className="font-bold text-xl text-[#a05a2c] mb-2">Catering</h3>
            <p className="text-center text-[#7a3a13] text-sm">Toplu yemek ve özel günler için profesyonel hizmet.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-[#fbeee0] rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="font-bold text-xl text-[#a05a2c] mb-2">Organizasyon</h3>
            <p className="text-center text-[#7a3a13] text-sm">Düğün, nişan, toplantı gibi etkinliklerde yanınızdayız.</p>
          </div>
        </div>
      </section>

      {/* Footer - Modern İletişim ve Konum Bölümü */}
      <footer className="w-full bg-[#6d4c2b] mt-16 py-12 flex flex-col items-center border-t border-[#a05a2c]">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-[#a05a2c] rounded-xl shadow-lg p-8 gap-8">
          {/* Sol: İletişim Bilgileri */}
          <div className="flex-1 flex flex-col gap-4 text-white">
            <div className="uppercase tracking-widest text-sm text-[#fbeee0]">Hizmetlerimiz hakkında bilgi almak için</div>
            <div className="text-3xl md:text-4xl font-extrabold mb-2">HEMEN İLETİŞİME GEÇİN</div>
            <button className="bg-[#fff7ec] text-[#a05a2c] font-bold px-8 py-2 rounded-lg w-max mb-4 hover:bg-[#fbeee0] transition">İLETİŞİM</button>
            <div className="flex items-center gap-2 text-lg">
              {/* Konum ikonu */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-2.954-3.196-7.5-7.815-7.5-11.25A7.5 7.5 0 0112 3.75a7.5 7.5 0 017.5 6.75c0 3.435-4.546 8.054-7.5 11.25z" /><circle cx="12" cy="10.5" r="2.25" fill="currentColor" /></svg>
              <span>KÖRFEZ MAH. VALİ EŞREF CAD. NO:1 İÇ KAPI NO:1 İZMİT - KOCAELİ / TÜRKİYE</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              {/* Mail ikonu */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 6.993V6.75" /></svg>
              <span>info@comertlokantasi.com</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              {/* Telefon ikonu */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.086c.414 0 .81.168 1.103.466l2.263 2.3a1.5 1.5 0 01.21 1.876l-1.12 1.867a.563.563 0 00.13.71l3.457 3.457a.563.563 0 00.71.13l1.867-1.12a1.5 1.5 0 011.876.21l2.3 2.263c.298.293.466.689.466 1.103v2.086a2.25 2.25 0 01-2.25 2.25h-.75C6.012 21.75 2.25 17.988 2.25 13.5v-.75z" /></svg>
              <span>0 (312) 123 45 67</span>
            </div>
          </div>
          {/* Sağ: Google Maps - tıklanabilir */}
          <div className="flex-1 flex justify-center">
            <a href="https://www.google.com/maps/place/C%C3%B6mert+Lokantas%C4%B1/@40.760025,29.7890542,17z/data=!3m1!4b1!4m6!3m5!1s0x14cb477d58c367cb:0x87df2b32be951d13!8m2!3d40.760025!4d29.7890542!16s%2Fg%2F11c0w3j5m_?hl=tr&entry=ttu&g_ep=EgoyMDI1MDUxNS4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="block rounded-xl shadow-lg hover:scale-105 transition">
              <iframe
                title="Lokanta Konumu"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2992.019964479836!2d29.78647937663219!3d40.76002507138709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb477d58c367cb%3A0x87df2b32be951d13!2sC%C3%B6mert%20Lokantas%C4%B1!5e0!3m2!1str!2str!4v1716220730000!5m2!1str!2str"
                width="320"
                height="180"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </a>
          </div>
        </div>
        <div className="text-[#fbeee0] text-sm mt-8">&copy; {new Date().getFullYear()} Cömert Lokantası. Tüm hakları saklıdır.</div>
      </footer>
    </main>
  );
}
