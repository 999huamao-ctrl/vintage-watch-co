"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Knowledge base for chatbot responses
const KNOWLEDGE_BASE = {
  products: [
    {
      name: "Daytona Black Steel",
      price: "€1,350",
      specs: "40mm, 4131 Automatic, 904L Steel, 100m Water Resistant",
      features: "Chronograph, Racing Style, Sapphire Crystal"
    },
    {
      name: "Submariner Black",
      price: "€1,165", 
      specs: "41mm, 3235 Automatic, 904L Steel, 300m Water Resistant",
      features: "Dive Watch, Ceramic Bezel, Date Display"
    },
    {
      name: "Submariner Green",
      price: "€1,165",
      specs: "41mm, 3235 Automatic, 904L Steel, 300m Water Resistant", 
      features: "Green Dial, Ceramic Bezel, Date Display"
    },
    {
      name: "GMT-Master II Pepsi",
      price: "€1,440",
      specs: "40mm, 3285 Automatic GMT, 904L Steel, 100m Water Resistant",
      features: "Red-Blue Bezel, Dual Time, Traveler's Choice"
    },
    {
      name: "Datejust 41 Blue",
      price: "€1,260",
      specs: "41mm, 3235 Automatic, 904L Steel, 100m Water Resistant",
      features: "Date Window, Blue Dial, Fluted Bezel, Business Style"
    },
    {
      name: "Explorer",
      price: "€1,360",
      specs: "36mm, 3230 Automatic, 904L Steel, 100m Water Resistant",
      features: "Explorer, 3-6-9 Arabic Numerals, Luminous Display"
    }
  ],
  
  shipping: {
    countries: "Germany, France, Italy, Spain, Portugal, Netherlands, Belgium, Austria, Poland, Czech Republic, Sweden, Denmark, Finland, Ireland, Greece, Hungary, UK",
    time: "9-15 business days",
    cost: "€6-10",
    freeThreshold: "€150"
  },
  
  payment: {
    method: "USDT (TRC20)",
    address: "TGPBhfjSuwjrfGUtdqt6EZUbzhbRCGfC5c",
    network: "TRC20 network only",
    confirmTime: "Confirmed within 24 hours after payment"
  },
  
  warranty: "2-year warranty, 30-day hassle-free returns (original packaging required)",
  
  contact: {
    email: "support@horizonwatches.com"
  }
};

// Smart reply generation function
function generateReply(userMessage: string, t: (key: string) => string): string {
  const msg = userMessage.toLowerCase();
  
  // Price related
  if (msg.includes("price") || msg.includes("cost") || msg.includes("多少钱") || msg.includes("价格") || msg.includes("€") || msg.includes(t('chatbot.quickPrice').toLowerCase())) {
    if (msg.includes("daytona") || msg.includes("迪通拿")) {
      return t('chatbot.responses.priceDaytona');
    }
    if (msg.includes("submariner") || msg.includes("水鬼")) {
      return t('chatbot.responses.priceSubmariner');
    }
    if (msg.includes("gmt") || msg.includes("可乐圈") || msg.includes("蝙蝠侠")) {
      return t('chatbot.responses.priceGMT');
    }
    return t('chatbot.responses.priceGeneral');
  }
  
  // Product specs related
  if (msg.includes("spec") || msg.includes("size") || msg.includes("机芯") || msg.includes("表径") || msg.includes("防水") || msg.includes("movement") || msg.includes("case")) {
    return t('chatbot.responses.specs');
  }
  
  // Shipping related
  if (msg.includes("shipping") || msg.includes("delivery") || msg.includes("多久") || msg.includes("快递") || msg.includes("运费") || msg.includes(t('chatbot.quickShipping').toLowerCase())) {
    return t('chatbot.responses.shipping');
  }
  
  // Payment related
  if (msg.includes("payment") || msg.includes("pay") || msg.includes("怎么付款") || msg.includes("usdt") || msg.includes("crypto") || msg.includes(t('chatbot.quickPayment').toLowerCase())) {
    return t('chatbot.responses.payment');
  }
  
  // Warranty related
  if (msg.includes("return") || msg.includes("warranty") || msg.includes("退换") || msg.includes("质保") || msg.includes("保修")) {
    return t('chatbot.responses.warranty');
  }
  
  // Greeting
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("你好") || msg.includes("在吗") || msg.includes("hey")) {
    return t('chatbot.responses.greeting');
  }
  
  // Recommend
  if (msg.includes("recommend") || msg.includes("suggest") || msg.includes("推荐") || msg.includes("哪款好") || msg.includes("best")) {
    return t('chatbot.responses.recommend');
  }
  
  // Default reply
  return t('chatbot.responses.default');
}

export default function ChatBot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t('chatbot.welcomeMessage'),
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Update welcome message when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([
        {
          role: "assistant",
          content: t('chatbot.welcomeMessage'),
          timestamp: new Date()
        }
      ]);
    }
  }, [t]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const reply = generateReply(userMessage.content, t);
      const assistantMessage: Message = {
        role: "assistant",
        content: reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEscalate = () => {
    const msg: Message = {
      role: "assistant",
      content: t('chatbot.humanEscalation'),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, msg]);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
          aria-label={t('chatbot.openChat')}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{t('chatbot.title')}</h3>
                <p className="text-xs text-gray-200">{t('chatbot.onlineStatus')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "bg-stone-900" : "bg-amber-500"
                }`}>
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-stone-900 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Buttons */}
          <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setInputValue(t('chatbot.quickPrice'))}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-900 whitespace-nowrap transition-colors"
            >
              {t('chatbot.quickPrice')}
            </button>
            <button
              onClick={() => setInputValue(t('chatbot.quickShipping'))}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-900 whitespace-nowrap transition-colors"
            >
              {t('chatbot.quickShipping')}
            </button>
            <button
              onClick={() => setInputValue(t('chatbot.quickPayment'))}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-900 whitespace-nowrap transition-colors"
            >
              {t('chatbot.quickPayment')}
            </button>
            <button
              onClick={handleEscalate}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 rounded-full text-xs text-amber-700 whitespace-nowrap transition-colors"
            >
              {t('chatbot.quickHuman')}
            </button>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-800"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-4 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
