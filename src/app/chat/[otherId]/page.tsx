// src/app/chat/[otherId]/page.tsx
'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Msg = {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export default function ChatPage() {
  const params = useParams();
  const otherId = params?.otherId;
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const intervalRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!otherId) return;

    // create or get conversation
    (async () => {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: otherId }),
      });
      if (!res.ok) {
        alert("Unable to create conversation. Make sure you're logged in.");
        router.push("/login");
        return;
      }
      const convo = await res.json();
      setConversationId(convo._id);
    })();
  }, [otherId, router]);

  // fetch messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const res = await fetch(`/api/chat/conversations/${conversationId}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data);
      // scroll down
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    fetchMessages();
    // poll every 2s
    intervalRef.current = window.setInterval(fetchMessages, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [conversationId]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!conversationId || !text.trim()) return;
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, text }),
    });
    if (res.ok) {
      setText("");
      // fetch immediately
      const msgs = await (await fetch(`/api/chat/conversations/${conversationId}`)).json();
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      alert("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Chat</h2>

        <div className="h-96 overflow-auto border p-3 rounded mb-4">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet — say hi 👋</p>
          ) : (
            messages.map((m) => (
              <div key={m._id} className="mb-3">
                <div className="text-sm text-gray-700">{m.text}</div>
                <div className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 border rounded p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
