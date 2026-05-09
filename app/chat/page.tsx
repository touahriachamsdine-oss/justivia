'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Scale, Trash2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter, useSearchParams } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import { LawWatermark } from '@/components/UI/LawWatermark';
import { FloatingBackground } from '@/components/UI/FloatingBackground';

import { Suspense } from 'react';

function ChatContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial query if provided
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string = input) => {
    const trimmedInput = text.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmedInput };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.' 
          : 'Sorry, an error occurred while processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    router.replace('/chat');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-app overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-legal-alpha)_0%,transparent_70%)] -z-10" />
      <LawWatermark type="scales" className="opacity-[0.02]" />
      <FloatingBackground />
      
      {/* Chat Header */}
      <div className="glass-effect p-4 shadow-premium flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-soft rounded-xl transition-all text-muted"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-legal-red/10 rounded-lg">
              <Scale className="w-5 h-5 text-legal-red" />
            </div>
            <div>
              <h1 className="font-cairo font-black text-primary text-sm uppercase tracking-widest">JUSTIVIA AI</h1>
              <p className="text-[10px] text-legal-red font-bold uppercase tracking-tighter opacity-70">Specialized in Administrative Law</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          className="p-2.5 text-muted hover:text-legal-red hover:bg-legal-red/5 rounded-xl transition-all"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8 py-8">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-6 py-20"
            >
              <div className="w-24 h-24 bg-card shadow-premium rounded-3xl flex items-center justify-center animate-float">
                <Bot className="w-12 h-12 text-legal-red" />
              </div>
              <div className="space-y-2">
                <h2 className="font-cairo text-3xl font-black text-primary uppercase tracking-tight">
                  {language === 'ar' ? 'كيف يمكن لجوستيفيا مساعدتك اليوم؟' : 'How can Justivia assist you today?'}
                </h2>
                <p className="text-secondary max-w-md mx-auto">
                  {language === 'ar' 
                    ? 'خبيرك القانوني المتخصص في القانون الإداري الجزائري. اسأل عن القرارات الإدارية، الوظيف العمومي، أو المنازعات الإدارية.' 
                    : 'Your expert legal assistant specialized in Algerian Administrative Law. Ask about administrative acts, civil service, or litigation.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg mt-8">
                {[
                  { ar: 'ما هي إجراءات الطعن في قرار إداري؟', en: 'How to appeal an administrative decision?' },
                  { ar: 'حقوق الموظف في حالة العزل', en: 'Rights of an employee in case of dismissal' },
                  { ar: 'قواعد إبرام الصفقات العمومية', en: 'Rules for public procurement contracts' },
                  { ar: 'المسؤولية الإدارية عن أخطاء المرفق العام', en: 'Administrative responsibility for public service errors' }
                ].map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(language === 'ar' ? sug.ar : sug.en)}
                    className="p-4 bg-card hover:bg-soft text-sm text-secondary rounded-2xl shadow-premium hover:shadow-glow transition-all text-start font-inter border border-transparent hover:border-legal-red/20"
                  >
                    {language === 'ar' ? sug.ar : sug.en}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-4 w-full",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-premium",
                  msg.role === 'user' ? "bg-legal-red text-white" : "bg-card text-legal-red"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                <div className={cn(
                  "max-w-[85%] rounded-3xl p-6 shadow-premium transition-all leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-card text-primary rounded-tr-none" 
                    : "bg-soft/50 text-primary rounded-tl-none"
                )}>
                  <div className="prose prose-sm dark:prose-invert max-w-none font-inter text-base">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shrink-0 shadow-premium">
                <Loader2 className="w-5 h-5 text-legal-red animate-spin" />
              </div>
              <div className="bg-soft/50 rounded-3xl p-6 rounded-tl-none shadow-premium flex items-center gap-2">
                <div className="w-2 h-2 bg-legal-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-legal-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-legal-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 glass-effect z-10">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="max-w-4xl mx-auto relative flex items-center gap-3"
        >
          <div className="relative flex-grow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'ar' ? 'اطرح سؤالك القانوني هنا...' : 'Ask your legal question here...'}
              className="w-full bg-card shadow-premium rounded-2xl py-5 px-6 rtl:pl-16 ltr:pr-16 text-primary focus:outline-none focus:ring-2 focus:ring-legal-red/20 transition-all duration-500 font-inter placeholder:text-muted/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute rtl:left-2 ltr:right-2 top-1/2 -translate-y-1/2 p-3 bg-legal-red text-on-accent rounded-xl hover:bg-legal-hover transition-all duration-500 shadow-glow disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center mt-3 text-muted font-bold uppercase tracking-widest opacity-40">
          Justivia AI can make mistakes. Consider checking the Official Gazette for definitive legal texts.
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-[calc(100vh-72px)] bg-app items-center justify-center">
        <Loader2 className="w-10 h-10 text-legal-red animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
