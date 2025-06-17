"use client";
import { useEffect, useState } from "react";

// Sepetteki ürünlerin tipini tanımlar
interface CartProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  quantity: number;
}

export default function CartPage() {
  // Sepet, başarı ve hata mesajı için state'ler
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Sayfa yüklendiğinde localStorage'dan sepeti alır
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    }
  }, []);

  // Sepetten ürün kaldırma fonksiyonu
  const handleRemove = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  // Siparişi tamamla ve backend'e gönder
  const handleOrder = async () => {
    setError("");
    setSuccess("");
    try {
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");
      const userAddress = localStorage.getItem("userAddress");
      const userPhone = localStorage.getItem("userPhone");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customer: {
            name: userName,
            email: userEmail,
            address: userAddress,
            phone: userPhone,
          }
        }),
      });
      if (res.ok) {
        setCart([]);
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
        }
        setSuccess("Siparişiniz başarıyla oluşturuldu!");
      } else {
        const data = await res.json();
        setError(data.message || "Sipariş oluşturulamadı.");
      }
    } catch {
      setError("Sunucu hatası.");
    }
  };

  // Sepetteki ürün adedini artırır
  const handleIncrease = (id: number) => {
    const newCart = cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  // Sepetteki ürün adedini azaltır
  const handleDecrease = (id: number) => {
    const newCart = cart
      .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.quantity > 0);
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  // Sepet toplam tutarını hesaplar
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  // Sayfa arayüzü ve sepet ürünleri
  return (
    <main className="min-h-screen bg-[#fbeee0] flex flex-col items-center py-12">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border border-[#a05a2c] flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#a05a2c] mb-4">Sepetim</h1>
        {cart.length === 0 ? (
          <div className="text-center text-[#a05a2c]">Sepetiniz boş.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-[#fbeee0] rounded-2xl p-4 border border-[#a05a2c] shadow">
                {/* Ürün görseli ve bilgileri */}
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-[#a05a2c]">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-[#a05a2c] text-4xl">🛒</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-[#a05a2c]">{item.name}</div>
                  <div className="text-[#7a3a13] text-sm">{item.description}</div>
                  <div className="text-[#a05a2c] font-bold">{item.price.toFixed(2)} ₺</div>
                  <div className="text-[#7a3a13] text-xs">Stok: {item.stock}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDecrease(item.id)} className="btn btn-sm px-4 text-lg bg-[#fbeee0] text-[#a05a2c] border border-[#a05a2c] hover:bg-[#fff7ec] rounded-2xl font-bold shadow">-</button>
                  <span className="font-bold text-lg text-[#a05a2c] w-8 text-center">{item.quantity || 1}</span>
                  <button onClick={() => handleIncrease(item.id)} className="btn btn-sm px-4 text-lg bg-[#a05a2c] text-white hover:bg-[#7a3a13] rounded-2xl font-bold shadow">+</button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="btn btn-sm bg-red-200 text-red-800 hover:bg-red-400 rounded-2xl px-4 font-bold shadow">Kaldır</button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 border-t border-[#a05a2c] pt-4">
              <span className="text-xl font-bold text-[#a05a2c]">Toplam:</span>
              <span className="text-2xl font-extrabold text-[#a05a2c]">{total.toFixed(2)} ₺</span>
            </div>
            {/* Siparişi tamamla butonu ve bildirimler */}
            <button onClick={handleOrder} className="btn bg-[#a05a2c] text-white hover:bg-[#7a3a13] rounded-2xl px-8 font-bold shadow text-lg mt-2">Siparişi Tamamla</button>
            {success && (
              <div className="alert mt-2 text-center bg-green-700 text-white font-bold border-2 border-green-900 shadow-lg">{success}</div>
            )}
            {error && (
              <div className="alert mt-2 text-center bg-red-700 text-white font-bold border-2 border-red-900 shadow-lg">{error}</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 