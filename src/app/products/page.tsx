"use client";
import { useEffect, useState } from "react";

// Ürün tipini tanımlar
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function ProductsPage() {
  // Ürünler, yüklenme durumu ve sepete ekleme bildirimi için state'ler
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addSuccess, setAddSuccess] = useState("");
  const [loginWarn, setLoginWarn] = useState("");

  // Sayfa yüklendiğinde ürünleri API'den çeker
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  // Bir ürünü sepete ekler ve kısa süreli bildirim gösterir
  const handleAddToCart = (product: Product) => {
    let cart = [];
    if (typeof window !== "undefined") {
      const userName = localStorage.getItem("userName");
      if (!userName) {
        setLoginWarn("Lütfen giriş yapınız.");
        setTimeout(() => setLoginWarn(""), 2000);
        return;
      }
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item: any) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setAddSuccess("Ürün sepete eklendi!");
      setTimeout(() => setAddSuccess(""), 2000);
    }
  };

  // Sayfa arayüzü ve ürün kartları
  return (
    <main className="min-h-screen bg-[#fbeee0] flex flex-col items-center py-12">
      {/* Sepete ekleme bildirimi */}
      {addSuccess && (
        <div className="alert alert-success fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold shadow-lg px-6 py-3 rounded-2xl">
          {addSuccess}
        </div>
      )}
      {loginWarn && (
        <div className="alert alert-error fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-bold shadow-lg px-6 py-3 rounded-2xl">
          {loginWarn}
        </div>
      )}
      {/* Ürünler listesi */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-[#a05a2c]">Yükleniyor...</div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-[#a05a2c]">Ürün bulunamadı.</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl shadow-xl border border-[#a05a2c] flex flex-col items-center p-6 gap-3">
              {/* Ürün görseli ve bilgileri */}
              <div className="w-40 h-40 bg-[#fbeee0] rounded-2xl flex items-center justify-center overflow-hidden border border-[#a05a2c]">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-[#a05a2c] text-6xl">🛒</span>
                )}
              </div>
              <div className="font-bold text-lg text-[#a05a2c]">{product.name}</div>
              <div className="text-[#7a3a13] text-sm text-center">{product.description}</div>
              <div className="text-[#a05a2c] font-bold text-xl">{product.price.toFixed(2)} ₺</div>
              <div className="text-[#7a3a13] text-xs">Stok: {product.stock}</div>
              {/* Sepete ekle butonu */}
              <button onClick={() => handleAddToCart(product)} className="btn bg-[#a05a2c] text-white hover:bg-[#7a3a13] rounded-2xl px-6 font-bold shadow mt-2">Sepete Ekle</button>
            </div>
          ))
        )}
      </div>
    </main>
  );
} 