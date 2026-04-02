import { MessageSquare, Mic, Send, Paperclip, Sparkles, X, Maximize2, Minimize2, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { generateStream, generateSpeech, models } from "@/lib/gemini";
import { useLanguage } from "../../contexts/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export default function CommandCenter() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: t('commandCenter.greeting'),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePlayAudio = async (messageId: string, text: string) => {
    if (isPlaying === messageId) {
      audioRef.current?.pause();
      setIsPlaying(null);
      return;
    }

    try {
      const audioData = await generateSpeech(text);
      const audioBlob = await (await fetch(`data:audio/mp3;base64,${audioData}`)).blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(null);
      audio.play();
      setIsPlaying(messageId);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const [isThinkingMode, setIsThinkingMode] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      // Stream response from Gemini
      // Use Thinking Mode if enabled
      const model = isThinkingMode ? models.pro : models.flash;
      // Note: In a real implementation, we would pass thinking config here
      
      const stream = await generateStream(input, model);
      
      let fullResponse = "";
      const assistantMessageId = (Date.now() + 1).toString();
      
      // Add initial empty assistant message
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date()
      }]);

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fullResponse }
              : msg
          ));
        }
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Peço desculpas, mas encontrei um erro ao processar sua solicitação.",
        timestamp: new Date()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('commandCenter.title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('commandCenter.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-[#261933] px-4 py-2 rounded-xl border border-border-muted dark:border-[#362348]">
          <span className="text-sm font-bold text-slate-900 dark:text-white">Modo Pensamento</span>
          <button 
            onClick={() => setIsThinkingMode(!isThinkingMode)}
            className={cn(
              "w-10 h-6 rounded-full relative transition-colors",
              isThinkingMode ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
            )}
          >
            <span className={cn(
              "absolute top-1 size-4 bg-white rounded-full transition-all",
              isThinkingMode ? "left-5" : "left-1"
            )} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-[#261933] border border-border-muted dark:border-[#362348] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-4 max-w-3xl",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "size-10 rounded-full flex items-center justify-center shrink-0",
                msg.role === "assistant" 
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(140,43,238,0.3)]" 
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white"
              )}>
                {msg.role === "assistant" ? <Sparkles className="size-5" /> : <span className="font-bold text-xs">AR</span>}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed relative group",
                msg.role === "assistant" 
                  ? "bg-slate-100 dark:bg-[#362348] text-slate-900 dark:text-slate-200 rounded-tl-none border border-border-muted dark:border-white/5" 
                  : "bg-primary text-white rounded-tr-none shadow-lg"
              )}>
                {msg.content}
                {msg.role === "assistant" && (
                  <button 
                    onClick={() => handlePlayAudio(msg.id, msg.content)}
                    className={cn(
                      "absolute -bottom-6 left-0 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100",
                      isPlaying === msg.id ? "text-primary opacity-100" : ""
                    )}
                  >
                    <Volume2 className={cn("size-4", isPlaying === msg.id ? "animate-pulse" : "")} />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex gap-4 max-w-3xl">
              <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(140,43,238,0.3)]">
                <Sparkles className="size-5 animate-pulse" />
              </div>
              <div className="bg-slate-100 dark:bg-[#362348] text-slate-900 dark:text-slate-200 p-4 rounded-2xl rounded-tl-none border border-border-muted dark:border-white/5 flex items-center gap-2">
                <span className="size-2 bg-primary rounded-full animate-bounce"></span>
                <span className="size-2 bg-primary rounded-full animate-bounce delay-100"></span>
                <span className="size-2 bg-primary rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur border-t border-border-muted dark:border-[#362348]">
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white dark:bg-[#1c1126] border border-border-muted dark:border-[#362348] rounded-2xl p-2 flex items-end gap-2 shadow-lg focus-within:ring-1 focus-within:ring-primary transition-all">
              <button className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                <Paperclip className="size-5" />
              </button>
              
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={t('commandCenter.inputPlaceholder')}
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-500 p-3 max-h-32 resize-none custom-scrollbar"
                rows={1}
              />
              
              <div className="flex gap-2 pb-1">
                <button className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <Mic className="size-5" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isThinking}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  <Send className="size-5" />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-500 dark:text-slate-600 mt-2 font-mono">
              {t('commandCenter.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
