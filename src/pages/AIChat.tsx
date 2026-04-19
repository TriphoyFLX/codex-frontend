import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ─── Icons ─────────────────────────────────────────────────── */
const Plus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 8a2 2 0 0 1 2 2"/><path d="M12 8a2 2 0 0 0-2 2"/><path d="M12 8V2"/><path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2"/><path d="M12 14v4"/><path d="M8 18h8"/>
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#FAFAFA; --ink2:#FFFFFF; --line:rgba(0,0,0,0.08); --muted:rgba(0,0,0,0.45); --text:rgba(0,0,0,0.82); }
  .ac * { box-sizing: border-box; }
  .ac { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

  @keyframes reveal { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .rv{opacity:0;animation:reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;}
  .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.25s}.d5{animation-delay:.33s}

  .sh{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);}
  .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:0.03em;}
  .mono-sm{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.06em;}
  .hr{height:1px;background:var(--line);}
  .badge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;border:1px solid var(--line);color:var(--muted);padding:3px 8px;display:inline-block;}

  .btn-acid{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:var(--acid);color:#FFFFFF;border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;border-radius:12px;}
  .btn-acid:hover{opacity:.88;}
  .btn-ghost{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:11px 20px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap;border-radius:12px;}
  .btn-ghost:hover{border-color:rgba(0,0,0,0.25);color:var(--text);}

  .chat-item{border:1px solid var(--line);background:var(--ink2);padding:12px;border-radius:12px;cursor:pointer;transition:border-color .2s,background .2s;}
  .chat-item:hover{border-color:rgba(93,69,253,0.3);background:rgba(93,69,253,0.02);}
  .chat-item.active{border-color:var(--acid);background:rgba(93,69,253,0.05);}

  .msg-bubble{max-width:70%;padding:12px 16px;border-radius:12px;line-height:1.5;font-size:13px;}
  .msg-user{background:var(--acid);color:#FFFFFF;border-bottom-right-radius:4px;}
  .msg-ai{background:var(--ink2);color:var(--text);border-bottom-left-radius:4px;border:1px solid var(--line);}

  .inp{width:100%;background:rgba(0,0,0,0.03);border:1px solid var(--line);color:var(--text);font-family:'Manrope',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color .15s;border-radius:12px;}
  .inp:focus{border-color:rgba(93,69,253,0.5);}
  .inp::placeholder{color:var(--muted);}
`;

export default function AIChat() {
  const { token } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (token) loadChats(); }, [token]);

  const loadChats = async () => {
    try {
      const data = await fetch(`${API}/api/ai/chats`, { headers: { Authorization: `Bearer ${token}` } });
      setChats(await data.json());
    } catch (e) { console.error(e); }
  };

  const createChat = async () => {
    try {
      const data = await fetch(`${API}/api/ai/chats`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const json = await data.json();
      setActiveChat(json);
      loadChats();
    } catch (e) { console.error(e); }
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeChat || !token) return;
    setIsLoading(true);
    try {
      // Save user message
      await fetch(`${API}/api/ai/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: message, role: 'USER' }),
      });

      // Get AI response
      const chatHistory = activeChat.messages?.map((msg: any) => ({
        role: msg.role === 'USER' ? 'user' : 'assistant',
        content: msg.content
      })) || [];
      
      const aiResponse = await fetch(`${API}/api/ai/chat-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, chatHistory })
      });
      const aiData = await aiResponse.json();

      // Save AI response
      await fetch(`${API}/api/ai/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: aiData.content, role: 'ASSISTANT' }),
      });

      setMessage('');
      loadChats();
      const updated = chats.find((c) => c.id === activeChat.id);
      if (updated) setActiveChat(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ac pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="sh mb-2">Платформа / AI Ассистент</div>
              <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>AI Чат</h1>
            </div>
            <button className="btn-acid flex items-center gap-2" onClick={createChat}>
              <Plus /> Новый чат
            </button>
          </div>
        </div>

        {/* ── Chat Layout ─────────────────────────────── */}
        <div className="rv d2" style={{ display: 'flex', height: 'calc(100vh - 180px)', gap: 20, padding: '24px 32px' }}>
          
          {/* Sidebar */}
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="sh">История чатов</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chats.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(chat)}
                >
                  <div className="flex items-center gap-3">
                    <BotIcon />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 13, color: 'var(--text)' }}>
                        Чат {new Date(chat.created_at).toLocaleDateString('ru-RU')}
                      </span>
                      <span className="mono-sm" style={{ display: 'block', marginTop: 2 }}>
                        {chat.messages?.length || 0} сообщений
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {chats.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <span className="mono-sm">Нет чатов</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div style={{ flex: 1, border: '1px solid var(--line)', borderRadius: 16, background: 'var(--ink2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeChat ? (
              <>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activeChat.messages?.map((msg: any) => (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'USER' ? 'flex-end' : 'flex-start' }}>
                      <div className="msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {msg.role === 'USER' ? <UserIcon /> : <BotIcon />}
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  ))}
                  {(!activeChat.messages || activeChat.messages.length === 0) && (
                    <div style={{ padding: 40, textAlign: 'center' }}>
                      <span className="mono-sm">Начните диалог с AI</span>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div style={{ padding: 16, borderTop: '1px solid var(--line)', display: 'flex', gap: 12 }}>
                  <input 
                    className="inp" 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && !isLoading && sendMessage()}
                    placeholder="Введите сообщение..."
                    disabled={isLoading}
                  />
                  <button className="btn-acid" onClick={sendMessage} style={{ padding: '12px 16px' }} disabled={isLoading}>
                    {isLoading ? '...' : <SendIcon />}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                <span className="mono-sm">Выберите или создайте чат для начала</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </>
  );
}
