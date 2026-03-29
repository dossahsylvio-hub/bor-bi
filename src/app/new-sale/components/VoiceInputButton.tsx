'use client';

import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface VoiceInputButtonProps {
  onTranscription: (text: string, parsed?: ParsedSale) => void;
}

export interface ParsedSale {
  clientName?: string;
  products: Array<{ name: string; quantity: number }>;
  paymentStatus?: 'PAID' | 'PARTIAL' | 'UNPAID';
  amountPaid?: number;
}

type RecordingState = 'idle' | 'recording' | 'processing';

// Enhanced NLP parser for French/English/Wolof
function parseSaleText(text: string): ParsedSale {
  const lower = text.toLowerCase().trim();
  const result: ParsedSale = { products: [] };

  // Extract client name: "à [Name]", "pour [Name]", "client [Name]", "ci [Name]" (Wolof)
  const clientPatterns = [
    /(?:à|pour|client|pour le client|au client)\s+([A-Za-zàâäéèêëîïôùûüÀÂÄÉÈÊËÎÏÔÙÛÜ][a-zA-ZàâäéèêëîïôùûüÀÂÄÉÈÊËÎÏÔÙÛÜ\s]{1,30}?)(?:\s*[:;,]|\s+\d|\s+(?:pain|riz|huile|eau|lait|sucre|farine|chemise|pantalon|robe|veste|tissu|boubou|sardine|thon|savon|biscuit|café|thé|sel|tomate|oignon|poulet|poisson|mburu|ceeb|dëkk)|$)/i,
    /^([A-Za-zàâäéèêëîïôùûü][a-zA-ZàâäéèêëîïôùûüÀÂÄÉÈÊËÎÏÔÙÛÜ\s]{1,20}?)\s*[:;]/i,
    /(?:ci|xam)\s+([A-Za-z][a-zA-Z\s]{1,20}?)(?:\s*[:;,]|\s+\d)/i,
  ];

  for (const pattern of clientPatterns) {
    let match = lower.match(pattern);
    if (match && match[1]) {
      result.clientName = match[1].trim().replace(/\b\w/g, c => c.toUpperCase());
      break;
    }
  }

  // Extract products with quantities
  const productRegex = /(\d+)\s+(?:sacs?\s+de\s+|bidons?\s+d[e']\s+|boîtes?\s+de\s+|kg\s+de\s+|litres?\s+de\s+|pièces?\s+de\s+|cartons?\s+de\s+)?([a-zàâäéèêëîïôùûü][a-zàâäéèêëîïôùûü\s]{1,30}?)(?=\s+(?:et|,|\d|payé|paye|paid|fey|partiel|crédit|dette|impayé)|$)/gi;

  let match;
  while ((match = productRegex.exec(lower)) !== null) {
    const qty = parseInt(match[1]);
    const rawName = match[2]?.trim();
    if (!isNaN(qty) && rawName && rawName.length > 1 && qty > 0 && qty < 10000) {
      if (!['fcfa', 'f cfa', 'cfa', 'franc'].includes(rawName)) {
        result.products.push({
          name: rawName.replace(/\b\w/g, c => c.toUpperCase()),
          quantity: qty,
        });
      }
    }
  }

  // Also try "product x N" pattern
  const reverseRegex = /([a-zàâäéèêëîïôùûü][a-zàâäéèêëîïôùûü\s]{1,25}?)\s+[xX×]\s*(\d+)/gi;
  while ((match = reverseRegex.exec(lower)) !== null) {
    const qty = parseInt(match[2]);
    const rawName = match[1]?.trim();
    if (!isNaN(qty) && rawName && rawName.length > 1 && qty > 0 && qty < 10000) {
      result.products.push({
        name: rawName.replace(/\b\w/g, c => c.toUpperCase()),
        quantity: qty,
      });
    }
  }

  // Payment status detection (FR + EN + Wolof)
  if (lower.match(/\b(payé|paye|paid|réglé|fey na|fey)\b/)) {
    result.paymentStatus = 'PAID';
  } else if (lower.match(/\b(partiel|partial|acompte|avance|fey na ci kanam)\b/)) {
    result.paymentStatus = 'PARTIAL';
  } else if (lower.match(/\b(crédit|credit|dette|impayé|impaye|feyul|à crédit)\b/)) {
    result.paymentStatus = 'UNPAID';
  }

  // Amount paid: "payé N FCFA", "acompte N", "versé N"
  const amountMatch = lower.match(/(?:payé|paye|acompte|versé|verse)\s+(\d[\d\s]*)\s*(?:fcfa|f|cfa|francs?)?/i);
  if (amountMatch) {
    result.amountPaid = parseInt(amountMatch[1].replace(/\s/g, ''));
  }

  return result;
}

export default function VoiceInputButton({ onTranscription }: VoiceInputButtonProps) {
  const { language, t } = useLanguage();
  const [state, setState] = useState<RecordingState>('idle');
  const [lastTranscript, setLastTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = () => {
    setErrorMsg('');
    const SpeechRecognitionAPI = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setErrorMsg('Web Speech API non supportée. Utilisez Chrome ou Edge pour la dictée vocale.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    // Use language-appropriate speech recognition
    const langMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', wo: 'fr-FR', ar: 'ar-SA', zh: 'zh-CN' };
    recognition.lang = langMap[language] || 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => setState('recording');

    recognition.onresult = (event) => {
      setState('processing');
      let transcript = event.results[0][0].transcript;
      let bestConfidence = event.results[0][0].confidence;

      for (let i = 1; i < event.results[0].length; i++) {
        if (event.results[0][i].confidence > bestConfidence) {
          bestConfidence = event.results[0][i].confidence;
          transcript = event.results[0][i].transcript;
        }
      }

      setLastTranscript(transcript);
      const parsed = parseSaleText(transcript);
      onTranscription(transcript, parsed);
      setState('idle');
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setErrorMsg('Aucune parole détectée. Réessayez en parlant clairement.');
      } else if (event.error === 'not-allowed') {
        setErrorMsg('Permission microphone refusée. Autorisez l\'accès dans les paramètres du navigateur.');
      } else if (event.error !== 'aborted') {
        setErrorMsg(`Erreur microphone: ${event.error}. Vérifiez les permissions du navigateur.`);
      }
      setState('idle');
    };

    recognition.onend = () => {
      if (state === 'recording') setState('idle');
    };

    try {
      recognition.start();
    } catch {
      setErrorMsg('Impossible de démarrer la reconnaissance vocale. Vérifiez les permissions du microphone.');
      setState('idle');
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setState('idle');
  };

  const idleLabel = t('sale.dictate') || 'Dictez votre vente';
  const recordingLabel = t('sale.recording') || 'Enregistrement en cours...';
  const processingLabel = t('sale.processing') || 'Analyse en cours...';
  const exampleLabel = t('sale.voiceExample') || 'Exemple : "Fallou 2 pains 1 huile payé"';
  const lastDictationLabel = t('sale.lastDictation') || 'Dernière dictée :';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <button
          onClick={state === 'idle' ? startRecording : stopRecording}
          disabled={state === 'processing'}
          className={`
            relative w-14 h-14 rounded-full flex items-center justify-center
            transition-all duration-200 active:scale-95 shadow-lg
            ${state === 'idle' ? 'bg-violet hover:bg-violet-600 text-white'
              : state === 'recording'? 'bg-red-500 text-white animate-pulse' :'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          title={state === 'idle' ? 'Dicter une vente (FR/Wolof/EN)' : state === 'recording' ? "Arrêter l'enregistrement" : 'Traitement...'}
        >
          {state === 'processing' ? (
            <Loader2 size={22} className="animate-spin" />
          ) : state === 'recording' ? (
            <MicOff size={22} />
          ) : (
            <Mic size={22} />
          )}
          {state === 'recording' && (
            <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
          )}
        </button>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet flex items-center justify-center">
          <Sparkles size={10} className="text-white" />
        </div>
      </div>

      <div className="text-center">
        {state === 'idle' && <p className="text-[11px] text-gray-500 font-medium">{idleLabel}</p>}
        {state === 'recording' && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-[11px] text-red-500 font-semibold">{recordingLabel}</p>
          </div>
        )}
        {state === 'processing' && <p className="text-[11px] text-violet font-semibold">{processingLabel}</p>}
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-[240px]">
          <p className="text-[11px] text-red-600">{errorMsg}</p>
          <p className="text-[10px] text-red-400 mt-1">Vous pouvez saisir manuellement ci-dessous.</p>
        </div>
      )}

      {state === 'idle' && !errorMsg && (
        <div className="bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 text-center max-w-[240px]">
          <p className="text-[10px] text-violet font-medium leading-relaxed">
            {exampleLabel}<br />
            ou &quot;Vente à Ousmane : 3 sacs de riz, partiel&quot;
          </p>
        </div>
      )}

      {lastTranscript && state === 'idle' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 max-w-[240px]">
          <p className="text-[10px] text-gray-500 font-medium">{lastDictationLabel}</p>
          <p className="text-[11px] text-gray-700 italic">&quot;{lastTranscript}&quot;</p>
        </div>
      )}
    </div>
  );
}