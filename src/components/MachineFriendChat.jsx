import React, { useEffect, useMemo, useRef, useState } from 'react';

const SpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

const endpoint =
  import.meta.env.VITE_MACHINEFRIEND_API_URL || '/api/machinefriend';

const initialMessages = [
  {
    role: 'assistant',
    content:
      'Oi, eu sou o Mario. Clique em falar e me conte onde voce travou na instalacao da Machine Pay.',
  },
];

const MicrophoneIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpeakingPulse = () => (
  <div className="flex items-center gap-3 rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800">
    <div className="relative flex h-6 w-6 items-center justify-center">
      <span className="absolute h-6 w-6 animate-ping rounded-full bg-orange-400 opacity-40" />
      <span className="relative h-3 w-3 animate-pulse rounded-full bg-orange-500" />
    </div>
    <span>Mario falando</span>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm"
      aria-label="Mario esta digitando"
    >
      <span className="font-semibold">Mario digitando</span>
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500" />
      </span>
    </div>
  </div>
);

const MachineFriendChat = () => {
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState(initialMessages);
  const [typedText, setTypedText] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isListening = status === 'listening';
  const isSending = status === 'sending';
  const canUseSpeech = Boolean(SpeechRecognition);

  const statusText = useMemo(() => {
    if (isListening) return 'Estou ouvindo... fale naturalmente.';
    if (isSending) return 'Mario esta pensando na melhor resposta.';
    if (!canUseSpeech) return 'Seu navegador nao liberou transcricao por voz.';
    return 'Pronto para ajudar por voz ou texto.';
  }, [canUseSpeech, isListening, isSending]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, isSending]);

  const speakAnswer = (text) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.98;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setStatus((current) => (current === 'listening' ? 'idle' : current));
  };

  const sendMessage = async (content) => {
    const cleanContent = content.trim();
    if (!cleanContent || isSending) return;

    stopSpeaking();
    setError('');
    const nextMessages = [...messages, { role: 'user', content: cleanContent }];
    setMessages(nextMessages);
    setTypedText('');
    setStatus('sending');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });

      const rawData = await response.text();
      let data = {};

      try {
        data = rawData ? JSON.parse(rawData) : {};
      } catch {
        throw new Error(
          `O servidor respondeu texto/HTML em vez de JSON. Verifique se a URL da IA esta correta: ${endpoint}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Nao consegui conectar ao servidor da IA. Verifique se o chat-server esta rodando.'
        );
      }

      const answer = data.answer || 'Nao consegui montar uma resposta agora.';
      setMessages((current) => [...current, { role: 'assistant', content: answer }]);
      speakAnswer(answer);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setStatus('idle');
    }
  };

  const startListening = () => {
    if (!canUseSpeech || isSending) return;

    if (isListening) {
      stopListening();
      return;
    }

    stopSpeaking();
    setError('');

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setStatus('listening');
    recognition.onerror = () => {
      setStatus('idle');
      setError('Nao consegui acessar o microfone. Verifique a permissao do navegador.');
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      setStatus((current) => (current === 'listening' ? 'idle' : current));
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim();

      if (transcript) {
        sendMessage(transcript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(typedText);
  };

  return (
    <section
      id="machinefriend"
      className="scroll-mt-24 mt-12 bg-white/95 border border-white/70 rounded-lg shadow-2xl overflow-hidden"
    >
      <div className="bg-gray-950 text-white px-5 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mario</h2>
          <p className="text-sm text-gray-300">{statusText}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-gray-950 transition hover:bg-gray-200"
            >
              Parar de falar
            </button>
          )}
          <button
            type="button"
            onClick={startListening}
            disabled={!canUseSpeech || isSending}
            aria-label={isListening ? 'Parar de ouvir' : 'Falar com Mario'}
            title={isListening ? 'Parar de ouvir' : 'Falar com Mario'}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {isListening ? (
              <span
                aria-hidden="true"
                className="h-3 w-3 animate-pulse rounded-full bg-white"
              />
            ) : (
              <MicrophoneIcon />
            )}
            {isListening ? 'Parar de ouvir' : 'Falar com Mario'}
          </button>
        </div>
      </div>

      {isSpeaking && (
        <div className="border-b border-orange-100 bg-white px-5 py-3">
          <SpeakingPulse />
        </div>
      )}

      <div className="max-h-96 space-y-4 overflow-y-auto px-5 py-5 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-relaxed shadow-sm ${
                message.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isSending && <TypingIndicator />}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-gray-200 p-4 md:flex-row">
        <label className="sr-only" htmlFor="machinefriend-text">
          Mensagem para o Mario
        </label>
        <input
          id="machinefriend-text"
          value={typedText}
          onChange={(event) => setTypedText(event.target.value)}
          placeholder="Ou digite sua duvida aqui..."
          className="min-h-12 flex-1 rounded-md border border-gray-300 px-4 text-gray-900 outline-none ring-orange-500 transition focus:ring-2"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !typedText.trim()}
          className="rounded-md bg-gray-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Enviar
        </button>
        <button
          type="button"
          onClick={startListening}
          disabled={!canUseSpeech || isSending}
          aria-label={isListening ? 'Parar de ouvir' : 'Falar com Mario'}
          title={isListening ? 'Parar de ouvir' : 'Falar com Mario'}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isListening ? (
            <span
              aria-hidden="true"
              className="h-3 w-3 animate-pulse rounded-full bg-white"
            />
          ) : (
            <MicrophoneIcon />
          )}
        </button>
      </form>

      {error && (
        <p className="border-t border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </section>
  );
};

export default MachineFriendChat;
