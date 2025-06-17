"use client";
import { useEffect, useState, useRef } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isDailyMenu?: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", imageUrl: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.description || !form.price || !form.stock) {
      setError("Tüm alanlar zorunlu.");
      return;
    }
    const method = editId ? "PATCH" : "POST";
    const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    if (res.ok) {
      setSuccess(editId ? "Ürün güncellendi." : "Ürün eklendi.");
      setForm({ name: "", description: "", price: "", stock: "", imageUrl: "" });
      setEditId(null);
      fetchProducts();
    } else {
      setError("İşlem başarısız.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ürünü silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSuccess("Ürün silindi.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      setError("Silme başarısız.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    // Sadece resim dosyalarına izin ver
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Sadece jpg, png veya webp dosyası yükleyebilirsiniz.");
      return;
    }
    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Dosya boyutu en fazla 2MB olmalı.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/products/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.url) {
      setForm((f) => ({ ...f, imageUrl: data.url }));
      setImagePreview(data.url);
      setError("");
    } else {
      setError(data.message || "Yükleme hatası.");
    }
  };

  const handleSetDailyMenu = async (id: number) => {
    setError("");
    setSuccess("");
    const res = await fetch(`/api/admin/products/set-daily-menu`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setSuccess("Günün menüsü güncellendi.");
      fetchProducts();
    } else {
      setError("Günün menüsü ayarlanamadı.");
    }
  };

  return (
    <main className="min-h-screen bg-[#fbeee0] flex flex-col items-center py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 border border-[#a05a2c] flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#a05a2c] mb-4">Ürün Yönetimi</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-[#fbeee0] rounded-2xl p-6 border border-[#a05a2c]">
          <div className="flex flex-col md:flex-row gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ürün Adı" className="input input-bordered w-full bg-white text-[#7a3a13] placeholder:text-[#a05a2c]/60 border-2 border-[#a05a2c] rounded-2xl" />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Fiyat" type="number" min="0" step="0.01" className="input input-bordered w-full bg-white text-[#7a3a13] placeholder:text-[#a05a2c]/60 border-2 border-[#a05a2c] rounded-2xl" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stok" type="number" min="0" className="input input-bordered w-full bg-white text-[#7a3a13] placeholder:text-[#a05a2c]/60 border-2 border-[#a05a2c] rounded-2xl" />
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Görsel URL (opsiyonel)" className="input input-bordered w-full bg-white text-[#7a3a13] placeholder:text-[#a05a2c]/60 border-2 border-[#a05a2c] rounded-2xl" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label htmlFor="product-image-upload" className="btn bg-[#a05a2c] text-white hover:bg-[#7a3a13] rounded-2xl px-6 font-bold shadow cursor-pointer">
              Görsel Yükle
              <input
                id="product-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {selectedFileName && <span className="text-[#a05a2c] text-sm ml-2">{selectedFileName}</span>}
            {imagePreview && <img src={imagePreview} alt="Önizleme" className="w-20 h-20 object-cover rounded-xl border border-[#a05a2c]" />}
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Açıklama" className="textarea textarea-bordered w-full bg-white text-[#7a3a13] placeholder:text-[#a05a2c]/60 border-2 border-[#a05a2c] rounded-2xl" />
          <div className="flex gap-2">
            <button type="submit" className="btn bg-[#a05a2c] text-white hover:bg-[#7a3a13] rounded-2xl px-6 font-bold shadow">{editId ? "Güncelle" : "Ekle"}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: "", description: "", price: "", stock: "", imageUrl: "" }); setImagePreview(""); }} className="btn btn-outline">Vazgeç</button>}
          </div>
          {error && <div className="alert alert-error mt-2 text-center">{error}</div>}
          {success && <div className="alert alert-success mt-2 text-center">{success}</div>}
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-[#a05a2c]">Yükleniyor...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-[#a05a2c]">Ürün yok.</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-[#fff7ec] rounded-2xl p-4 border border-[#a05a2c] shadow flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-[#fbeee0] rounded-xl flex items-center justify-center overflow-hidden border border-[#a05a2c]">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-[#a05a2c] text-4xl">🛒</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-[#a05a2c] flex items-center gap-2">
                      {product.name}
                      {product.isDailyMenu && (
                        <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">Günün Menüsü</span>
                      )}
                    </div>
                    <div className="text-[#7a3a13] text-sm">{product.description}</div>
                    <div className="text-[#a05a2c] font-bold">{product.price.toFixed(2)} ₺</div>
                    <div className="text-[#7a3a13] text-xs">Stok: {product.stock}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(product)} className="btn btn-sm bg-[#a05a2c] text-white hover:bg-[#7a3a13] rounded-2xl px-4 font-bold shadow">Düzenle</button>
                  <button onClick={() => handleDelete(product.id)} className="btn btn-sm bg-red-200 text-red-800 hover:bg-red-400 rounded-2xl px-4 font-bold shadow">Sil</button>
                  <button onClick={() => handleSetDailyMenu(product.id)} className={`btn btn-sm rounded-2xl px-4 font-bold shadow ${product.isDailyMenu ? 'bg-green-400 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-400'}`}>Günün Menüsü Yap</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 