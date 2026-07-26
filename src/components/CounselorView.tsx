import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudentProfile } from '../types';
import { GoogleGenAI } from '@google/genai';

interface CounselorViewProps {
  setActiveTab: (tab: 'home' | 'search' | 'predictor' | 'counselor' | 'about') => void;
}

const PROGRAM_OPTIONS = [
  'BS Computer Science',
  'MBBS (Bachelor of Medicine & Surgery)',
  'BDS (Bachelor of Dental Surgery)',
  'DVM (Doctor of Veterinary Medicine)',
  'BS Microbiology',
  'BS Software Engineering',
  'BS Artificial Intelligence',
  'BS Data Science',
  'BBA (Honors)',
  'Doctor of Physical Therapy (DPT)',
  'BS Mechanical Engineering',
  'BS Biotechnology',
];

const CITIES = [
  'Lahore',
  'Islamabad',
  'Karachi',
  'Peshawar',
  'Quetta',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Muzaffarabad',
  'Any City in Pakistan',
];

export const CounselorView: React.FC<CounselorViewProps> = ({ setActiveTab }) => {
  // Student Profile State for Personalized Recommendations
  const [matric, setMatric] = useState<number>(88);
  const [inter, setInter] = useState<number>(85);
  const [entryTest, setEntryTest] = useState<number>(82);
  const [desiredProgram, setDesiredProgram] = useState<string>('BS Computer Science');
  const [preferredCity, setPreferredCity] = useState<string>('Lahore');
  const [preferredProvince, setPreferredProvince] = useState<string>('Punjab');
  const [annualBudget, setAnnualBudget] = useState<number>(500000);
  const [showProfileCard, setShowProfileCard] = useState<boolean>(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Assalam-o-Alaikum! I am your UniGuide AI Admission Counselor. Fill out your academic profile and preferences above, then ask me for personalized university recommendations, aggregate cutoffs, or fee comparisons!',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dynamicQuickPrompts = [
    `Which universities in ${preferredCity} offer ${desiredProgram} under ${Math.round(annualBudget / 100000)} Lacs?`,
    `Calculate my admission aggregate for ${desiredProgram} in ${preferredCity}`,
    `Compare public vs private universities for ${desiredProgram}`,
    `What are my safe and reach options for ${desiredProgram}?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Retrieve the API key injected by Vite
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || '';
      
      if (!apiKey) {
        throw new Error('Gemini API key is not configured.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are UniGuide AI, an expert Pakistani Higher Education & University Admission Counselor.
Provide helpful, polite, and detailed guidance to Pakistani students.
Student Profile Context:
- Target Degree: ${desiredProgram}
- Preferred City: ${preferredCity} (${preferredProvince})
- Marks: Matric ${matric}%, Intermediate ${inter}%, Entry Test ${entryTest}%
- Max Annual Budget: ${annualBudget} PKR`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash',
        contents: promptText,
        config: {
          systemInstruction,
        },
      });

      const aiReplyText = response.text || "I'm ready to answer any questions about Pakistani university admissions, aggregate cutoffs, or test dates.";

      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Counselor fetch error:', err);
      const errorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Assalam-o-Alaikum! I had a temporary glitch fetching recommendations. Please ensure your Gemini API key is configured correctly in Vercel environment variables and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPersonalizedRecommendation = () => {
    const prompt = `Please analyze my academic profile and give me a personalized university recommendation plan:
- Target Degree Program: ${desiredProgram}
- Marks: Matric ${matric}%, Intermediate ${inter}%, Entrance Test ${entryTest}%
- Preferred City: ${preferredCity} (${preferredProvince})
- Max Annual Fee Budget: ${annualBudget} PKR

Please evaluate my aggregate score, recommend safe, target, and reach universities in ${preferredCity} for ${desiredProgram} matching my budget, and advise on test preparation strategies.`;

    handleSend(prompt);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-4 space-y-6 animate-fade-in">
      {/* Top Profile Card Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#2170e4]/30 overflow-hidden">
        <div className="bg-gradient-to-r from-[#00288e] to-[#2170e4] text-white p-4 md:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white shrink-0">
              <span className="material-symbols-outlined text-xl">person_search</span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm md:text-base leading-tight">
                Personalized Recommendation Profile
              </h2>
              <p className="text-xs text-white/80">
                Configure your marks, preferred city, budget & degree program for tailored AI counseling.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProfileCard(!showProfileCard)}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
          >
            <span>{showProfileCard ? 'Hide Details' : 'Edit Profile'}</span>
            <span className="material-symbols-outlined text-sm">
              {showProfileCard ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {showProfileCard && (
          <div className="p-4 md:p-6 bg-[#f8f9ff] border-t border-[#c4c5d5]/30 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Desired Degree Program */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#00288e] block">Desired Degree Program</label>
                <select
                  value={desiredProgram}
                  onChange={(e) => setDesiredProgram(e.target.value)}
                  className="w-full bg-white border border-[#2170e4]/30 font-bold text-[#0b1c30] p-2 rounded-xl focus:outline-none focus:border-[#00288e]"
                >
                  {PROGRAM_OPTIONS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred City */}
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">Preferred City</label>
                <select
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                  className="w-full bg-white border border-[#c4c5d5] font-medium text-[#0b1c30] p-2 rounded-xl focus:outline-none focus:border-[#00288e]"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Annual Budget */}
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">
                  Max Annual Budget (PKR): <strong className="text-[#00288e]">{(annualBudget / 100000).toFixed(1)}L</strong>
                </label>
                <input
                  type="number"
                  step="50000"
                  value={annualBudget}
                  onChange={(e) => setAnnualBudget(Number(e.target.value))}
                  className="w-full bg-white border border-[#c4c5d5] font-medium text-[#0b1c30] p-2 rounded-xl focus:outline-none focus:border-[#00288e]"
                  placeholder="e.g. 500000"
                />
              </div>

              {/* Marks Inputs */}
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">
                  Matric % / Inter % / Entry Test %
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={matric}
                    onChange={(e) => setMatric(Number(e.target.value))}
                    className="w-1/3 bg-white border border-[#c4c5d5] text-center font-bold text-[#0b1c30] p-2 rounded-xl text-xs"
                    placeholder="Matric"
                    title="Matric Percentage"
                  />
                  <input
                    type="number"
                    value={inter}
                    onChange={(e) => setInter(Number(e.target.value))}
                    className="w-1/3 bg-white border border-[#c4c5d5] text-center font-bold text-[#0b1c30] p-2 rounded-xl text-xs"
                    placeholder="Inter"
                    title="Intermediate Percentage"
                  />
                  <input
                    type="number"
                    value={entryTest}
                    onChange={(e) => setEntryTest(Number(e.target.value))}
                    className="w-1/3 bg-white border border-[#c4c5d5] text-center font-bold text-[#0b1c30] p-2 rounded-xl text-xs"
                    placeholder="Test"
                    title="Entry Test Score Percentage"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#c4c5d5]/20">
              <div className="flex items-center gap-2 text-xs text-[#444653]">
                <span className="material-symbols-outlined text-[#00288e] text-sm">verified_user</span>
                <span>Active Profile: <strong className="text-[#0b1c30]">{desiredProgram}</strong> in <strong className="text-[#0b1c30]">{preferredCity}</strong> (Budget: {(annualBudget / 100000).toFixed(1)}L PKR)</span>
              </div>

              <button
                onClick={handleGetPersonalizedRecommendation}
                disabled={loading}
                className="w-full sm:w-auto bg-[#00288e] hover:bg-[#1e40af] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Get Personalized AI Recommendation</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#c4c5d5]/30 overflow-hidden flex flex-col h-[calc(75vh-100px)] min-h-[500px]">
        {/* Chat Header */}
        <div className="p-4 bg-[#f8f9ff] border-b border-[#c4c5d5]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-filled">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm md:text-base text-[#0b1c30]">UniGuide AI Assistant</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Personalized Recommendations Active
                </span>
              </div>
              <p className="text-[11px] text-[#444653]">Pakistani Higher Education & Admission Counselor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('predictor')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#00288e] bg-[#eff4ff] hover:bg-[#d3e4fe] px-3 py-1.5 rounded-lg border border-[#2170e4]/20 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">calculate</span>
              <span>Predictor Tool</span>
            </button>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-[#f8f9ff]/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              {msg.sender === 'ai' ? (
                <div className="w-8 h-8 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <span className="material-symbols-filled text-base">smart_toy</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#2170e4] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-[#d3e4fe]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU63AbcmVShZbBylYNkDNwsJGQSxCuKJwoseaC8u85f-jwHCeEpUjqBh6iAk2QPFh5amZ1MaTBEkw-Q_GR917xy69SiMcKa34LPvWva1K5yGEu8OQR7r0WZyoa7rocT7hug34WT0wIbLyLLLgQxqHABuHHAkUkncN1n2zPjQeDOpDTM4byOnljwVgaz_eALVglUg89g9R0gZdZEBmW35StR5osyz5sASJL6_mE6XB7SOKu6z8_yjc"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Message Content */}
              <div
                className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-xs bubble-animate ${
                  msg.sender === 'user'
                    ? 'bg-[#00288e] text-white rounded-tr-none'
                    : 'bg-white text-[#0b1c30] border border-[#c4c5d5]/30 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-2 text-right ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-[#444653]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs">
                <span className="material-symbols-filled text-base">smart_toy</span>
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-[#c4c5d5]/30 shadow-xs flex items-center gap-2 text-xs text-[#00288e]">
                <span className="w-2 h-2 rounded-full bg-[#00288e] animate-ping"></span>
                <span>Generating personalized recommendations for {desiredProgram} in {preferredCity}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-white border-t border-[#c4c5d5]/20 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-[#444653] shrink-0 pl-1">Suggested:</span>
          {dynamicQuickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={loading}
              className="text-xs bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#00288e] border border-[#2170e4]/20 px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 whitespace-nowrap"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 md:p-4 bg-white border-t border-[#c4c5d5]/30 flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={() => alert('Result card uploaded for AI Counselor review.')}
            className="p-2 text-[#444653] hover:text-[#00288e] hover:bg-[#f8f9ff] rounded-xl transition-colors"
            title="Attach Result Card or Document"
          >
            <span className="material-symbols-outlined text-xl">attach_file</span>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${desiredProgram} in ${preferredCity}, merit cutoffs, or fee structures...`}
            className="flex-1 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#0b1c30] placeholder-[#444653]/60 focus:outline-none focus:border-[#00288e]"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#00288e] hover:bg-[#1e40af] disabled:opacity-50 text-white p-2.5 md:px-5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <span className="hidden md:inline">Send</span>
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};