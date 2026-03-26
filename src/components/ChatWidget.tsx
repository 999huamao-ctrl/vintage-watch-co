"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const knowledgeBase: Record<string, string> = {
  "shipping": "🚚 We offer free shipping on orders over €79 to all EU countries. Delivery time is 9-15 business days.",
  "delivery": "🚚 We offer free shipping on orders over €79 to all EU countries. Delivery time is 9-15 business days.",
  "return": "↩️ We have a 30-day return policy. Items must be unworn with original packaging.",
  "warranty": "🛡️ All watches come with a 2-year warranty covering manufacturing defects.",
  "payment": "💳 We accept PayPal and all major credit cards (Visa, Mastercard, Amex).",
  "price": "💰 Our watches range from €59 to €199. Free shipping on orders over €79!",
  "discount": "🎉 New customers get 10% off with code WELCOME10",
  "contact": "📧 Email us at support@vintagewatchco.com for any inquiries.",
  "track": "📦 You will receive a tracking number via email once your order ships.",
  "size": "⌚ Case sizes range from 36mm to 44mm. Check each product page for specific dimensions.",
  "movement": "⚙️ We offer Automatic, Quartz, and Chronograph movements. Details on each product page.",
};

const commonQuestions = [
  "Shipping & Delivery",
  "Returns & Warranty", 
  "Payment Methods",
  "Track My Order",
  "Contact Support"
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  
  for (const [key, answer] of Object.entries(knowledgeBase)) {
    if (lower.includes(key)) return answer;
  }
  
  // Check for greetings
  if (lower.match(/\b(hello|hi|hey|good morning|good afternoon)\b/)) {
    return "👋 Hello! Welcome to Vintage Watch Co. How can I help you today?";
  }
  
  // Check for thanks
  if (lower.match(/\b(thanks|thank you)\b/)) {
    return "🙏 You're welcome! Let me know if you need anything else.";
  }
  
  // Default response
  return "🤔 I'm not sure about that. You can:\n\n1. Check our FAQ section\n2. Email us at support@vintagewatchco.com\n3. Browse our shop for more details";
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "👋 Hi! Welcome to Vintage Watch Co.\n\nI can help you with:\n• Shipping & Delivery\n• Returns & Warranty\n• Product Questions\n• Order Tracking\n\nWhat would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const answer = findAnswer(userMessage);
      setMessages(prev => [...prev, { role: "assistant", content: answer }]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickQuestion = (question: string) => {
    setMessages(prev => [...prev, { role: "user", content: question }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const answer = findAnswer(question.toLowerCase());
      setMessages(prev => [...prev, { role: "assistant", content: answer }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-stone-800 transition-all hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-stone-900" />
              </div>
              <div>
                <h3 className="font-semibold">Vintage Watch Assistant</h3>
                <p className="text-xs text-gray-800">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "assistant" ? "bg-amber-500" : "bg-stone-300"
                }`}>
                  {msg.role === "assistant" ? (
                    <Bot className="w-5 h-5 text-stone-900" />
                  ) : (
                    <User className="w-5 h-5 text-stone-700" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                  msg.role === "assistant" 
                    ? "bg-white border border-gray-200 rounded-tl-none text-gray-900" 
                    : "bg-stone-900 text-white rounded-tr-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-stone-900" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-2 bg-white border-t">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {commonQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-900 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-stone-900 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
