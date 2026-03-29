'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { MessageSquare, Send, Search, ChevronLeft, User, Package, Circle, Plus } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderType: string;
  receiverId: string;
  receiverType: string;
  content: string;
  read: boolean;
  orderId?: string;
  createdAt: string;
}

interface Conversation {
  userId: string;
  userName: string;
  userType: string;
  userLocation?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

// Current user from session (in production, read from cookie/context)
const CURRENT_USER_ID = 'vendor-demo-1';
const CURRENT_USER_TYPE = 'vendor';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    userId: 'wholesaler-demo-1',
    userName: 'Grossiste Diallo & Fils',
    userType: 'wholesaler',
    userLocation: 'Dakar, Sénégal',
    lastMessage: 'Votre commande ORD-001 est confirmée',
    lastMessageAt: '2026-03-28T14:30:00',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'wholesaler-demo-1', senderType: 'wholesaler', receiverId: CURRENT_USER_ID, receiverType: 'vendor', content: 'Bonjour, votre commande ORD-001 est bien reçue.', read: true, createdAt: '2026-03-28T10:00:00' },
      { id: 'm2', senderId: CURRENT_USER_ID, senderType: 'vendor', receiverId: 'wholesaler-demo-1', receiverType: 'wholesaler', content: 'Merci ! Quand sera-t-elle livrée ?', read: true, createdAt: '2026-03-28T10:05:00' },
      { id: 'm3', senderId: 'wholesaler-demo-1', senderType: 'wholesaler', receiverId: CURRENT_USER_ID, receiverType: 'vendor', content: 'Livraison prévue demain matin entre 8h et 12h.', read: true, createdAt: '2026-03-28T10:10:00' },
      { id: 'm4', senderId: 'wholesaler-demo-1', senderType: 'wholesaler', receiverId: CURRENT_USER_ID, receiverType: 'vendor', content: 'Votre commande ORD-001 est confirmée', read: false, createdAt: '2026-03-28T14:30:00' },
    ],
  },
  {
    userId: 'wholesaler-2',
    userName: 'Import-Export Maroc',
    userType: 'wholesaler',
    userLocation: 'Casablanca, Maroc',
    lastMessage: 'Nous avons de nouveaux produits disponibles',
    lastMessageAt: '2026-03-27T09:00:00',
    unreadCount: 0,
    messages: [
      { id: 'm5', senderId: 'wholesaler-2', senderType: 'wholesaler', receiverId: CURRENT_USER_ID, receiverType: 'vendor', content: 'Bonjour, nous avons de nouveaux produits disponibles dans notre catalogue.', read: true, createdAt: '2026-03-27T09:00:00' },
      { id: 'm6', senderId: CURRENT_USER_ID, senderType: 'vendor', receiverId: 'wholesaler-2', receiverType: 'wholesaler', content: 'Merci, je vais consulter votre catalogue.', read: true, createdAt: '2026-03-27T09:30:00' },
    ],
  },
  {
    userId: 'wholesaler-3',
    userName: 'Fournisseur Guinée',
    userType: 'wholesaler',
    userLocation: 'Conakry, Guinée',
    lastMessage: 'Prix spécial pour commande > 500kg',
    lastMessageAt: '2026-03-26T15:00:00',
    unreadCount: 1,
    messages: [
      { id: 'm7', senderId: 'wholesaler-3', senderType: 'wholesaler', receiverId: CURRENT_USER_ID, receiverType: 'vendor', content: 'Prix spécial pour commande > 500kg de riz. Contactez-nous !', read: false, createdAt: '2026-03-26T15:00:00' },
    ],
  },
];

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 86400000) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  const filtered = conversations.filter(c =>
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSelectConv = (conv: Conversation) => {
    setConversations(prev => prev.map(c =>
      c.userId === conv.userId ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c
    ));
    setActiveConv({ ...conv, unreadCount: 0 });
    setMobileView('chat');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      senderType: CURRENT_USER_TYPE,
      receiverId: activeConv.userId,
      receiverType: activeConv.userType,
      content: newMessage.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    const updatedConv = { ...activeConv, messages: [...activeConv.messages, msg], lastMessage: msg.content, lastMessageAt: msg.createdAt };
    setActiveConv(updatedConv);
    setConversations(prev => prev.map(c => c.userId === activeConv.userId ? updatedConv : c));
    setNewMessage('');

    // In production: POST /api/messages { senderId, senderType, receiverId, receiverType, content, orderId? }
  };

  return (
    <AppLayout pageTitle="Messages" pageSubtitle={totalUnread > 0 ? `${totalUnread} message(s) non lu(s)` : 'Messagerie vendeurs ↔ grossistes'}>
      <div className="flex gap-5 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Conversations list */}
        <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden`}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">Conversations</h2>
              <button className="p-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filtered.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => handleSelectConv(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${activeConv?.userId === conv.userId ? 'bg-primary-50' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-[12px] font-bold text-primary-800">
                      {conv.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <Circle size={10} className="absolute bottom-0 right-0 text-success fill-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{conv.userName}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{formatTime(conv.lastMessageAt)}</span>
                  </div>
                  <p className="text-[12px] text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                  {conv.userLocation && (
                    <p className="text-[10px] text-gray-400 truncate">{conv.userLocation}</p>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <MessageSquare size={28} className="text-gray-200 mx-auto mb-2" />
                <p className="text-[13px] text-gray-400">Aucune conversation</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden`}>
          {activeConv ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-bold text-primary-800">
                    {activeConv.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-900">{activeConv.userName}</p>
                  <p className="text-[11px] text-gray-400">{activeConv.userLocation} · {activeConv.userType === 'wholesaler' ? 'Grossiste' : 'Vendeur'}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 bg-green-50 text-success rounded-full flex items-center gap-1">
                  <Circle size={6} className="fill-success" />
                  En ligne
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
                {activeConv.messages.map((msg) => {
                  const isMe = msg.senderId === CURRENT_USER_ID;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                          <User size={12} className="text-primary-700" />
                        </div>
                      )}
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${isMe ? 'bg-primary-800 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                        {msg.orderId && (
                          <div className={`flex items-center gap-1 text-[11px] mb-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                            <Package size={10} />
                            Commande {msg.orderId}
                          </div>
                        )}
                        {msg.content}
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-300' : 'text-gray-400'}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-primary-200 focus:bg-white transition-all"
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-primary-800 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-40 flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-primary-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Messagerie Bor-Bi</h3>
              <p className="text-[13px] text-gray-400 max-w-xs">
                Sélectionnez une conversation pour commencer à discuter avec vos grossistes
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
