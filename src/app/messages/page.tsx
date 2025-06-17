"use client";
import { useEffect, useState } from "react";
import { UserCircleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

export default function MessagesPage() {
  // Kullanıcılar, seçili kullanıcı, mesajlar ve form state'leri
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [myId, setMyId] = useState<string | null>(null);

  // Giriş yapan kullanıcının id'sini localStorage'dan alır
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMyId(localStorage.getItem("userId"));
    }
  }, []);

  // Kullanıcı listesini API'den çeker
  useEffect(() => {
    if (!myId) return;
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users?.filter((u: any) => String(u.id) !== myId) || []));
  }, [myId]);

  // Seçili kullanıcı değiştiğinde mesajları çeker
  useEffect(() => {
    if (!selectedUser || !myId) return;
    setLoading(true);
    fetch(`/api/messages?userId=${myId}`)
      .then((res) => res.json())
      .then((data) => {
        // Sadece seçili kullanıcı ile olan mesajları filtrele
        setMessages((data.messages || []).filter((m: any) =>
          (String(m.senderId) === myId && String(m.receiverId) === String(selectedUser.id)) ||
          (String(m.receiverId) === myId && String(m.senderId) === String(selectedUser.id))
        ));
      })
      .finally(() => setLoading(false));
  }, [selectedUser, myId, success]);

  // Mesaj gönderme işlemini API'ye gönderir
  const handleSend = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!content.trim()) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedUser.id, content }),
      });
      if (res.ok) {
        setContent("");
        setSuccess("Mesaj gönderildi.");
        setTimeout(() => setSuccess(""), 1000);
      } else {
        setError("Mesaj gönderilemedi.");
      }
    } catch {
      setError("Sunucu hatası.");
    }
  };

  if (!myId) return <div className="min-h-screen flex items-center justify-center text-2xl text-[#a05a2c]">Giriş yapmalısınız.</div>;

  // Sayfa arayüzü ve mesajlaşma kutusu
  return (
    <main className="min-h-screen flex flex-col items-center bg-[#fbeee0] py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 border border-[#a05a2c] flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#a05a2c] mb-4">Mesajlaşma</h1>
        {/* Kullanıcı listesi ve mesaj kutusu */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Kullanıcılar listesi */}
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#a05a2c] mb-4 flex items-center gap-2"><ChatBubbleLeftRightIcon className="w-6 h-6 text-[#a05a2c]"/>Kullanıcılar</h2>
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#a05a2c] opacity-60">
                <UserCircleIcon className="w-16 h-16 mb-2"/>
                <span>Kullanıcı bulunamadı.</span>
              </div>
            ) : (
              users.map((u) => (
                <button key={u.id} onClick={() => setSelectedUser(u)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition font-semibold text-left shadow-sm border border-transparent hover:border-[#a05a2c] ${selectedUser?.id === u.id ? "bg-[#a05a2c] text-white" : "bg-white text-[#a05a2c]"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${selectedUser?.id === u.id ? "bg-white text-[#a05a2c]" : "bg-[#fbeee0] text-[#a05a2c]"}`}>{u.name?.[0] || "?"}</div>
                  <span className="truncate">{u.name}</span>
                </button>
              ))
            )}
          </div>
          {/* Mesaj kutusu */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 mb-2 border-b border-[#a05a2c] pb-2">
                  <div className="w-10 h-10 rounded-full bg-[#a05a2c] text-white flex items-center justify-center text-lg font-bold">{selectedUser.name?.[0] || "?"}</div>
                  <h2 className="text-xl font-bold text-[#a05a2c]">{selectedUser.name} ile Mesajlaşma</h2>
                </div>
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto bg-[#fff7ec] p-2 md:p-4 rounded-xl border border-[#a05a2c]">
                  {loading ? <div>Yükleniyor...</div> :
                    messages.length === 0 ? <div className="text-[#a05a2c] flex flex-col items-center opacity-60"><ChatBubbleLeftRightIcon className="w-10 h-10 mb-2"/><span>Henüz mesaj yok.</span></div> :
                    messages.map((m, i) => (
                      <div key={i} className={`flex ${String(m.senderId) === myId ? "justify-end" : "justify-start"}`}>
                        <div className={`px-4 py-2 rounded-2xl shadow text-sm max-w-[70%] break-words ${String(m.senderId) === myId ? "bg-[#a05a2c] text-white rounded-br-none" : "bg-white text-[#a05a2c] border border-[#a05a2c] rounded-bl-none"}`}>
                          {m.content}
                          <div className="text-xs mt-1 text-right opacity-60">{new Date(m.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                </div>
                <form onSubmit={handleSend} className="flex gap-2 mt-2">
                  <input value={content} onChange={e => setContent(e.target.value)} className="input input-bordered w-full bg-white text-[#7a3a13] border-2 border-[#a05a2c] rounded-2xl focus:border-[#a05a2c] focus:shadow-lg" placeholder="Mesaj yaz..." />
                  <button type="submit" className="btn bg-[#a05a2c] text-white hover:bg-[#7a3a13] rounded-2xl px-6 text-lg font-bold shadow">Gönder</button>
                </form>
                {error && <div className="alert alert-error mt-2 text-center">{error}</div>}
                {success && (
                  <div className="alert alert-success mt-2 text-center">
                    <span className="font-bold text-lg text-[#7a3a13]">{success}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#a05a2c] opacity-60">
                <ChatBubbleLeftRightIcon className="w-16 h-16 mb-2"/>
                <span>Mesajlaşmak için bir kullanıcı seçin.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 