'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

// Pre-built responses in 4 languages
const RESPONSES: Record<string, Record<string, string>> = {
  fr: {
    vente: 'Pour enregistrer une vente : allez dans "Nouvelle Vente", sélectionnez un client, ajoutez les produits au panier, puis choisissez le mode de paiement (Payé, Partiel, Impayé).',
    stock: 'Pour gérer votre stock : allez dans "Stock", cliquez sur "Ajouter un produit" pour choisir dans le catalogue ou créer un produit personnalisé.',
    commande: 'Pour passer une commande grossiste : allez dans "Commandes Grossistes", cliquez sur "Nouvelle commande", sélectionnez un grossiste et choisissez les produits.',
    client: 'Pour ajouter un client : allez dans "Clients", cliquez sur "Ajouter un client". Le consentement du client est obligatoire.',
    paiement: 'Bor-Bi gère les paiements complets, partiels et impayés. Pour un paiement partiel, entrez le montant payé lors de la vente. Le reste est enregistré comme créance.',
    grossiste: 'Un grossiste est un fournisseur qui vend en grande quantité. Vous pouvez passer des commandes depuis la page "Commandes Grossistes".',
    inscription: 'Pour vous inscrire : cliquez sur "Inscription", choisissez votre rôle (Vendeur ou Grossiste), remplissez vos informations et créez votre compte.',
    commission: 'Bor-Bi prélève une commission de 0,5% sur chaque vente et commande pour maintenir la plateforme.',
    message: 'Pour envoyer un message à un grossiste : allez dans "Messages", sélectionnez une conversation ou démarrez-en une nouvelle.',
    connexion: 'Pour vous connecter, utilisez votre email et mot de passe. Comptes démo : vendeur@bor-bi.com / vendor123 ou grossiste@bor-bi.com / wholesaler123.',
    dashboard: 'Le tableau de bord affiche vos ventes du jour, créances totales, alertes de stock bas et commandes en attente.',
    default: 'Je suis là pour vous aider avec Bor-Bi. Posez-moi une question sur les ventes, le stock, les clients ou les commandes grossistes.',
  },
  en: {
    sale: 'To record a sale: go to "New Sale", select a client, add products to the cart, then choose the payment method (Paid, Partial, Unpaid).',
    stock: 'To manage your stock: go to "Stock", click "Add product" to choose from the catalogue or create a custom product.',
    order: 'To place a wholesale order: go to "Wholesale Orders", click "New order", select a wholesaler and choose products.',
    client: 'To add a client: go to "Clients", click "Add client". Client consent is mandatory.',
    payment: 'Bor-Bi handles full, partial and unpaid payments. For partial payment, enter the amount paid during the sale. The rest is recorded as a receivable.',
    wholesaler: 'A wholesaler is a supplier who sells in bulk. You can place orders from the "Wholesale Orders" page.',
    register: 'To register: click "Register", choose your role (Vendor or Wholesaler), fill in your information and create your account.',
    commission: 'Bor-Bi charges a 0.5% commission on each sale and order to maintain the platform.',
    message: 'To send a message to a wholesaler: go to "Messages", select a conversation or start a new one.',
    login: 'To log in, use your email and password. Demo accounts: vendeur@bor-bi.com / vendor123 or grossiste@bor-bi.com / wholesaler123.',
    dashboard: 'The dashboard shows your daily sales, total receivables, low stock alerts and pending orders.',
    default: 'I am here to help you with Bor-Bi. Ask me about sales, stock, clients or wholesale orders.',
  },
  wo: {
    jaay: 'Ci jaay bu bees bi: dem ci "Jaay Bu Bees", tann jëgëm bi, yokk produits yi ci panier bi, ci kanam tann yoon fey bi.',
    stok: 'Ci stok bi: dem ci "Stok", cliquer "Yokk produit" ngir tann ci catalogue bi walla créer produit bu bees.',
    commande: 'Ci commande grossiste bi: dem ci "Commandes Grossistes", cliquer "Commande bu bees", tann grossiste bi.',
    jëgëm: 'Ci yokk jëgëm: dem ci "Jëgëm", cliquer "Yokk jëgëm". Consentement jëgëm bi waajib la.',
    fey: 'Bor-Bi dafa gérer fey bu dëkk, fey ci kanam, ak feyul. Ci fey ci kanam, dugal xaalis bu fey bi.',
    grossiste: 'Grossiste bi dafa jaay ci yépp. Commandes yi dem ci "Commandes Grossistes".',
    default: 'Maa ngi fi ngir jëfël ci Bor-Bi. Laaj ma ci jaay, stok, jëgëm walla commandes grossiste.',
  },
  ar: {
    بيع: 'لتسجيل بيع: اذهب إلى "بيع جديد"، اختر عميلاً، أضف المنتجات إلى السلة، ثم اختر طريقة الدفع (مدفوع، جزئي، غير مدفوع).',
    مخزون: 'لإدارة مخزونك: اذهب إلى "المخزون"، انقر "إضافة منتج" للاختيار من الكتالوج أو إنشاء منتج مخصص.',
    طلب: 'لتقديم طلب جملة: اذهب إلى "طلبات الجملة"، انقر "طلب جديد"، اختر تاجر الجملة والمنتجات.',
    عميل: 'لإضافة عميل: اذهب إلى "العملاء"، انقر "إضافة عميل". موافقة العميل إلزامية.',
    دفع: 'يدير Bor-Bi المدفوعات الكاملة والجزئية وغير المدفوعة. للدفع الجزئي، أدخل المبلغ المدفوع أثناء البيع.',
    تسجيل: 'للتسجيل: انقر "إنشاء حساب"، اختر دورك (بائع أو تاجر جملة)، أدخل معلوماتك وأنشئ حسابك.',
    عمولة: 'يفرض Bor-Bi عمولة 0.5% على كل بيع وطلب للحفاظ على المنصة.',
    default: 'أنا هنا لمساعدتك في Bor-Bi. اسألني عن المبيعات أو المخزون أو العملاء أو طلبات الجملة.',
  },
};

const SUGGESTIONS: Record<string, string[]> = {
  fr: ['Comment enregistrer une vente ?', 'Comment ajouter un produit au stock ?', 'Comment passer une commande grossiste ?', "Qu'est-ce qu'un grossiste ?"],
  en: ['How to record a sale?', 'How to add a product to stock?', 'How to place a wholesale order?', 'What is a wholesaler?'],
  wo: ['Naka jaay bu bees ?', 'Naka yokk produit ci stok ?', 'Naka commande grossiste ?', 'Ana grossiste bi ?'],
  ar: ['كيف أسجل بيعاً؟', 'كيف أضيف منتجاً للمخزون؟', 'كيف أطلب من الجملة؟', 'ما هو تاجر الجملة؟'],
};

function getResponse(question: string, lang: string): string {
  const lower = question.toLowerCase();
  const langResponses = RESPONSES[lang] || RESPONSES.fr;

  // Direct keyword match in current language
  for (const [key, response] of Object.entries(langResponses)) {
    if (key !== 'default' && lower.includes(key)) {
      return response;
    }
  }

  // Cross-language keyword matching for common terms
  const keywordMap: Array<{ keywords: string[]; lang: string; key: string }> = [
    { keywords: ['sale', 'vente', 'jaay', 'بيع', 'sell'], lang: 'fr', key: 'vente' },
    { keywords: ['stock', 'stok', 'مخزون', 'inventory'], lang: 'fr', key: 'stock' },
    { keywords: ['order', 'commande', 'طلب'], lang: 'fr', key: 'commande' },
    { keywords: ['client', 'jëgëm', 'عميل', 'customer'], lang: 'fr', key: 'client' },
    { keywords: ['payment', 'paiement', 'fey', 'دفع', 'pay'], lang: 'fr', key: 'paiement' },
    { keywords: ['wholesaler', 'grossiste', 'جملة'], lang: 'fr', key: 'grossiste' },
    { keywords: ['register', 'inscription', 'تسجيل', 'signup'], lang: 'fr', key: 'inscription' },
    { keywords: ['commission', 'عمولة'], lang: 'fr', key: 'commission' },
    { keywords: ['message', 'رسالة', 'xam-xam'], lang: 'fr', key: 'message' },
    { keywords: ['login', 'connexion', 'دخول', 'dugg'], lang: 'fr', key: 'connexion' },
    { keywords: ['dashboard', 'tableau', 'لوحة'], lang: 'fr', key: 'dashboard' },
  ];

  for (const { keywords, lang: targetLang, key } of keywordMap) {
    if (keywords.some(kw => lower.includes(kw))) {
      const targetResponses = RESPONSES[targetLang] || RESPONSES.fr;
      if (targetResponses[key]) return targetResponses[key];
    }
  }

  return langResponses.default || RESPONSES.fr.default;
}

export default function AiChatbot() {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Reset welcome message when language changes
  useEffect(() => {
    const welcomeText = t('chatbot.welcome') || RESPONSES[language]?.default || RESPONSES.fr.default;
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcomeText,
      createdAt: new Date().toISOString(),
    }]);
  }, [language, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const question = text || input.trim();
    if (!question) return;

    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const answer = getResponse(question, language);
      const assistantMsg: ChatMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: answer,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setLoading(false);
    }, 400);
  };

  const startVoice = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert(t('chatbot.micNotSupported') || 'Web Speech API non supportée. Utilisez Chrome ou Edge.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    const langMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', wo: 'fr-FR', ar: 'ar-SA', zh: 'zh-CN' };
    recognition.lang = langMap[language] || 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const suggestions = SUGGESTIONS[language] || SUGGESTIONS.fr;
  const isRTL = language === 'ar';

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 active:scale-95 ${open ? 'bg-gray-700' : 'bg-violet hover:bg-purple-600'}`}
        title="Assistant Bor-Bi"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: '520px' }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-violet px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-[13px]">{t('chatbot.title') || 'Assistant Bor-Bi'}</p>
              <p className="text-purple-200 text-[10px]">{t('chatbot.subtitle') || 'fr · en · wo · ar'}</p>
            </div>
            <span className="ml-auto text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">IA</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '300px' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-violet text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-[10px] text-gray-400 mb-2 font-medium">{t('chatbot.suggestions') || 'Questions fréquentes :'}</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-[11px] px-2.5 py-1 bg-violet-50 text-violet rounded-full hover:bg-violet-100 transition-colors border border-violet-100 text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 flex-shrink-0 border-t border-gray-100 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={isListening ? stopVoice : startVoice}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title={isListening ? 'Arrêter' : (t('chatbot.listening') || 'Dicter')}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={t('chatbot.placeholder') || 'Posez votre question...'}
                className="flex-1 text-[13px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 bg-violet text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-40 flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
