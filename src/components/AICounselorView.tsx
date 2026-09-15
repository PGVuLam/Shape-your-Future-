import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Info
} from 'lucide-react';
import { UserProfile, Career, RecommendationScore } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { askAICounselor, LLMResponse } from '../services/llmService';
import { retrieveContextForCareer } from '../services/ragService';
import { useLanguage } from '../context/LanguageContext';

interface AICounselorViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  initialCareer?: Career;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  provider?: string;
  timestamp: Date;
}

export const AICounselorView: React.FC<AICounselorViewProps> = ({
  profile,
  recommendations,
  initialCareer
}) => {
  const { language, t, getCareerTitle, getCareerCluster } = useLanguage();
  const defaultCareer =
    initialCareer ||
    CAREER_DATABASE.find(c => c.id === recommendations[0]?.careerId) ||
    CAREER_DATABASE[0];

  const [selectedCareerId, setSelectedCareerId] = useState<string>(defaultCareer.id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showGroundingContext, setShowGroundingContext] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedCareer =
    CAREER_DATABASE.find(c => c.id === selectedCareerId) || defaultCareer;
  const currentRec = recommendations.find(r => r.careerId === selectedCareer.id);
  const locTitle = getCareerTitle(selectedCareer.id, selectedCareer.title);
  const locCluster = getCareerCluster(selectedCareer.id, selectedCareer.careerCluster);

  // Initialize welcoming message
  useEffect(() => {
    if (true) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: `Xin chào ${profile.name}! Tôi là **Cố vấn Khám phá Hướng nghiệp EduPath AI**.

Chúng ta đang cùng tìm hiểu về nghề **${locTitle}** (${locCluster}). Tôi đã nạp đầy đủ thông tin hồ sơ của bạn gồm mã Holland (**${profile.riaSecProfile?.code || 'IRC'}**), các môn học yêu thích và kỹ năng thế mạnh hiện có.

Bạn hãy thoải mái đặt câu hỏi bất kỳ — chẳng hạn như lý do nghề này phù hợp, nên bắt đầu học kỹ năng nào trước, hay cách thử nghiệm thực tế trước khi đưa ra quyết định!`,
          provider: 'EduPath Grounded Guide',
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: `Hello ${profile.name}! I am your **EduPath Career Exploration Counselor**. 

We are currently exploring **${selectedCareer.title}** (${selectedCareer.careerCluster}). I have your verified RIASEC profile (**${profile.riaSecProfile?.code || 'IRC'}**), your favorite subjects, and your current skill strengths grounded in my knowledge base.

Feel free to ask me anything — such as why this was recommended, what to learn first, or how to test your interest before committing!`,
          provider: 'EduPath Grounded Guide',
          timestamp: new Date()
        }
      ]);
    }
  }, [selectedCareerId, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || inputQuestion;
    if (!question.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response: LLMResponse = await askAICounselor(
        profile,
        selectedCareer,
        question,
        messages.map(m => ({ role: m.sender, content: m.text })),
        currentRec,
        language
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.content,
        provider: response.provider,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: true
          ? `Gặp sự cố kết nối dịch vụ đám mây. Theo dữ liệu định hướng, với nghề ${locTitle}, bước khởi đầu tốt nhất là bạn nên thử làm dự án "${selectedCareer.experiments[0]?.title || 'dự án nhỏ'}".`
          : `I encountered an unexpected issue contacting the cloud service. As a grounded recommendation, for ${selectedCareer.title}, your best starting point is to try the "${selectedCareer.experiments[0]?.title || 'introductory project'}".`,
        provider: 'Deterministic Fallback Engine',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = true ? [
    `Tại sao ${locTitle} lại được gợi ý cho tôi?`,
    `Tôi nên bắt đầu học kỹ năng gì đầu tiên cho nghề này?`,
    `Nếu tôi lo lắng về môn Toán thì có thể theo đuổi được không?`,
    `Làm thế nào để tôi thử nghiệm trước khi quyết định theo nghề?`,
    `So sánh lộ trình Đại học và học nghề/tự làm dự án?`
  ] : [
    `Why was ${selectedCareer.title} recommended to me?`,
    `What should I learn first for ${selectedCareer.title}?`,
    `I'm worried about the math requirements. Can I still succeed?`,
    `How can I test if I enjoy this before committing?`,
    `What are the educational trade-offs (University vs Vocational)?`
  ];

  const groundedContext = retrieveContextForCareer(profile, selectedCareer, currentRec);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <MessageSquareText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t.counselorTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.counselorDesc}
            </p>
          </div>

          {/* Career focus picker */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-600">{t.targetCareer}</span>
            <select
              value={selectedCareerId}
              onChange={e => setSelectedCareerId(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 shadow-sm focus:outline-none"
            >
              {CAREER_DATABASE.map(c => (
                <option key={c.id} value={c.id}>
                  {getCareerTitle(c.id, c.title)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grounding Context Toggle */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold">{t.groundedInProfile}</span>
          </div>
          <button
            onClick={() => setShowGroundingContext(!showGroundingContext)}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showGroundingContext ? ('Ẩn hồ sơ dữ liệu RAG') : ('Xem hồ sơ dữ liệu RAG')}</span>
          </button>
        </div>

        {/* Grounding Context Drawer */}
        {showGroundingContext && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-700">
            <div className="font-bold text-slate-900">{'Ngữ cảnh được RAG đưa vào Prompt:'}</div>
            <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="font-semibold text-slate-800">{'Hồ sơ người dùng:'}</span> {groundedContext.profileContext.age} {'tuổi'}, {groundedContext.profileContext.educationLevel}, {'Môn:'} {groundedContext.profileContext.favoriteSubjects.join(', ')}
              </div>
              <div>
                <span className="font-semibold text-slate-800">{'Mã Holland:'}</span> {groundedContext.profileContext.riasecCode} ({groundedContext.riasecFitSummary})
              </div>
              <div>
                <span className="font-semibold text-slate-800">{'Kỹ năng phù hợp:'}</span> {groundedContext.userMatchedSkills.join(', ') || 'N/A'}
              </div>
              <div>
                <span className="font-semibold text-slate-800">{'Kỹ năng cần bổ trợ:'}</span> {groundedContext.userMissingSkills.join(', ') || 'None'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                {msg.provider && (
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/50 flex items-center justify-between">
                    <span>{msg.provider}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-none p-4 text-xs text-slate-500 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                <span>{'Cố vấn EduPath AI đang phân tích dữ liệu...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 overflow-x-auto flex items-center space-x-2 no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>{t.quickQuestions}</span>
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            placeholder={t.askPlaceholder}
            disabled={isLoading}
            className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
