import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/e2acb2fb-458b-4dc7-b565-f40a9b8b0f40";
const MSG_URL = "https://functions.poehali.dev/1195c629-33ca-4784-a451-bc3637d191d8";

interface User {
  id: number;
  username: string;
  display_name: string;
  avatar_color: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  created_at: string;
  is_read: boolean;
}

interface Dialog {
  contact_id: number;
  last_message: string;
  display_name: string;
  avatar_color: string;
  username: string;
  unread: number;
}

interface ChatProps {
  user: User;
  onLogout: () => void;
}

function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size, backgroundColor: color, minWidth: size }}
      className="rounded-full flex items-center justify-center text-white font-bold"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

const menuItems = [
  { icon: "MessageCircle", label: "Мои сообщения" },
  { icon: "Users", label: "Группы" },
  { icon: "Bookmark", label: "Избранное" },
  { icon: "Phone", label: "Звонки" },
  { icon: "Settings", label: "Настройки" },
  { icon: "HelpCircle", label: "Помощь" },
];

export default function Chat({ user, onLogout }: ChatProps) {
  const [contacts, setContacts] = useState<User[]>([]);
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [activeContact, setActiveContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"dialogs" | "contacts">("dialogs");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadContacts();
    loadDialogs();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeContact) return;
    loadMessages(activeContact.id);
    pollRef.current = setInterval(() => loadMessages(activeContact.id), 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeContact]);

  const loadContacts = async () => {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "users" }),
    });
    const data = await res.json();
    setContacts((data.users || []).filter((u: User) => u.id !== user.id));
  };

  const loadDialogs = async () => {
    const res = await fetch(MSG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dialogs", user_id: user.id }),
    });
    const data = await res.json();
    setDialogs(data.dialogs || []);
  };

  const loadMessages = async (contactId: number) => {
    const res = await fetch(MSG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get", user_a: user.id, user_b: contactId }),
    });
    const data = await res.json();
    setMessages(data.messages || []);
    loadDialogs();
  };

  const sendMessage = async () => {
    if (!text.trim() || !activeContact) return;
    const t = text;
    setText("");
    await fetch(MSG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send", sender_id: user.id, receiver_id: activeContact.id, text: t }),
    });
    loadMessages(activeContact.id);
  };

  const openContact = (contact: User) => {
    setActiveContact(contact);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">

      {/* Боковое меню (drawer) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="relative z-10 flex flex-col w-72 bg-neutral-900 h-full shadow-2xl">
            {/* Шапка профиля */}
            <div className="px-5 pt-10 pb-5 bg-neutral-800">
              <Avatar name={user.display_name} color={user.avatar_color} size={56} />
              <p className="font-bold text-lg mt-3">{user.display_name}</p>
              <p className="text-neutral-400 text-sm mt-0.5">@{user.username}</p>
            </div>

            {/* Пункты меню */}
            <nav className="flex-1 py-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-800 transition-colors text-left"
                >
                  <Icon name={item.icon as "MessageCircle"} size={20} className="text-neutral-400" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Выход */}
            <div className="border-t border-neutral-800 py-2">
              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-800 transition-colors text-left text-red-400"
              >
                <Icon name="LogOut" size={20} />
                <span className="text-sm font-medium">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 border-r border-neutral-800 bg-neutral-900 flex-shrink-0`}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-800">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Icon name="Menu" size={22} />
          </button>
          <p className="font-bold text-base flex-1">GoChat</p>
          <button className="text-neutral-400 hover:text-white transition-colors">
            <Icon name="Search" size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800">
          <button
            onClick={() => setTab("dialogs")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "dialogs" ? "text-white border-b-2 border-white" : "text-neutral-500 hover:text-white"}`}
          >
            Диалоги
          </button>
          <button
            onClick={() => { setTab("contacts"); loadContacts(); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "contacts" ? "text-white border-b-2 border-white" : "text-neutral-500 hover:text-white"}`}
          >
            Контакты
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {tab === "dialogs" && (
            dialogs.length === 0
              ? <p className="text-neutral-500 text-sm text-center mt-8 px-4">Нет диалогов. Начни переписку!</p>
              : dialogs.map((d) => (
                <button
                  key={d.contact_id}
                  onClick={() => openContact({ id: d.contact_id, username: d.username, display_name: d.display_name, avatar_color: d.avatar_color })}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 transition-colors text-left ${activeContact?.id === d.contact_id ? "bg-neutral-800" : ""}`}
                >
                  <Avatar name={d.display_name} color={d.avatar_color} size={42} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm truncate">{d.display_name}</p>
                      {d.unread > 0 && (
                        <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">{d.unread}</span>
                      )}
                    </div>
                    <p className="text-neutral-400 text-xs truncate mt-0.5">{d.last_message}</p>
                  </div>
                </button>
              ))
          )}
          {tab === "contacts" && (
            contacts.length === 0
              ? <p className="text-neutral-500 text-sm text-center mt-8 px-4">Пока нет других пользователей</p>
              : contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openContact(c)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 transition-colors text-left ${activeContact?.id === c.id ? "bg-neutral-800" : ""}`}
                >
                  <Avatar name={c.display_name} color={c.avatar_color} size={42} />
                  <div>
                    <p className="font-medium text-sm">{c.display_name}</p>
                    <p className="text-neutral-400 text-xs">@{c.username}</p>
                  </div>
                </button>
              ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`${!sidebarOpen || activeContact ? "flex" : "hidden"} md:flex flex-1 flex-col`}>
        {activeContact ? (
          <>
            <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-800 bg-neutral-900">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-neutral-400 hover:text-white mr-1">
                <Icon name="ArrowLeft" size={20} />
              </button>
              <Avatar name={activeContact.display_name} color={activeContact.avatar_color} size={36} />
              <div className="flex-1">
                <p className="font-semibold text-sm">{activeContact.display_name}</p>
                <p className="text-neutral-400 text-xs">@{activeContact.username}</p>
              </div>
              <button className="text-neutral-400 hover:text-white transition-colors">
                <Icon name="Phone" size={18} />
              </button>
              <button className="text-neutral-400 hover:text-white transition-colors ml-2">
                <Icon name="Video" size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
              {messages.length === 0 && (
                <div className="text-center text-neutral-500 text-sm mt-16">
                  Напишите первое сообщение!
                </div>
              )}
              {messages.map((m) => {
                const isMine = m.sender_id === user.id;
                return (
                  <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMine ? "bg-white text-black rounded-br-sm" : "bg-neutral-800 text-white rounded-bl-sm"}`}>
                      <p>{m.text}</p>
                      <p className={`text-xs mt-1 ${isMine ? "text-neutral-500" : "text-neutral-400"} text-right`}>{formatTime(m.created_at)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-4 border-t border-neutral-800 bg-neutral-900 flex gap-3 items-end">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Написать сообщение..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className="bg-white text-black w-11 h-11 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:opacity-40 flex-shrink-0"
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium text-white">Выберите диалог</p>
            <p className="text-sm mt-2">или начните новый чат через «Контакты»</p>
          </div>
        )}
      </div>
    </div>
  );
}
