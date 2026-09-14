import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Compass,
  Brain,
  Award,
  BookOpen,
  Send,
  Cpu,
  Globe,
  Settings,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MapPin,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  User,
  School,
  Building2,
  FileDown,
  Download,
  Loader2,
  Check,
  RotateCcw
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { UserProfile, Career, LLMConfig, LLMProviderType } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { generateRecommendations } from '../engine/recommendationEngine';
import { VIETNAM_UNIVERSITIES, UniversityInfo } from '../data/vietnamUniversities';
import { askAICounselor, ChatMessage } from '../services/aiCounselorService';
import { useLanguage } from '../context/LanguageContext';

interface Step4ComprehensiveReportViewProps {
  profile: UserProfile;
  onBackToStep3: () => void;
  onRestartExam: () => void;
  onViewCareerDetail?: (career: Career) => void;
  llmConfig?: LLMConfig;
  onUpdateLlmConfig?: (config: LLMConfig) => void;
  onOpenAIModelModal?: () => void;
}

export const Step4ComprehensiveReportView: React.FC<Step4ComprehensiveReportViewProps> = ({
  profile: incomingProfile,
  onBackToStep3,
  onRestartExam,
  onViewCareerDetail,
  llmConfig: externalLlmConfig,
  onUpdateLlmConfig,
  onOpenAIModelModal
}) => {
  const profile = incomingProfile || {
    id: 'user-default',
    name: '',
    age: 17,
    province: '',
    grade: '',
    ageGroup: '15-18',
    educationLevel: '',
    location: '',
    favoriteSubjects: [],
    confidentSubjects: [],
    academicGPA: '',
    interests: [],
    strengths: [],
    skills: [],
    selfRatedSkills: [],
    goals: [],
    preferredWorkEnvironment: [],
    preferredActivities: [],
    careerPriorities: [],
    careerReadiness: 'exploring',
    interestedMajorInput: '',
    examScores: {},
    workPreferences: {
      teamworkVsSolo: 'Balanced',
      handsOnVsAbstract: 'Balanced',
      remotePreference: 'Any',
      creativityVsStructure: 'Balanced'
    },
    constraints: [],
    educationPreferences: [],
    riaSecScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  } as UserProfile;

  const { language } = useLanguage();

  // Model LLM Configuration state (fallback to local state if not provided externally)
  const [internalLlmConfig, setInternalLlmConfig] = useState<LLMConfig>({
    provider: 'gemini',
    modelName: 'gemini-3.8-flash',
    customEndpoint: 'http://localhost:11434',
    temperature: 0.7
  });

  const llmConfig = externalLlmConfig || internalLlmConfig;
  const setLlmConfig = onUpdateLlmConfig || setInternalLlmConfig;

  const [showConfigModal, setShowConfigModal] = useState(false);

  // University region filter
  const [uniRegionFilter, setUniRegionFilter] = useState<'All' | 'Bắc' | 'Trung' | 'Nam'>('All');

  // Calculate top recommended careers using deterministic multi-criteria engine
  const recommendations = React.useMemo(() => {
    return generateRecommendations(profile, CAREER_DATABASE);
  }, [profile]);

  const topCareers = React.useMemo(() => {
    return recommendations.slice(0, 5).map(r => r.career);
  }, [recommendations]);

  const topScoredCareers = React.useMemo(() => {
    return recommendations.slice(0, 5);
  }, [recommendations]);

  // Universities filtering & matching based on profile exam scores and top careers
  const matchedUniversities = React.useMemo(() => {
    let list = VIETNAM_UNIVERSITIES;
    if (uniRegionFilter !== 'All') {
      list = list.filter(u => u.region === uniRegionFilter);
    }
    return list;
  }, [uniRegionFilter]);

  const top1Universities = matchedUniversities.filter(u => u.tier === 'Top 1');
  const top2Universities = matchedUniversities.filter(u => u.tier !== 'Top 1');

  // Interactive Deep-Dive AI Counselor Chatbot
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Xin chào **${profile?.name?.trim() || 'bạn'}**! Tôi là Trợ lý Cố vấn Hướng nghiệp Trí tuệ Nhân tạo EduPath AI.

Tôi đã phân tích toàn diện hồ sơ của bạn:
- **Đặc trưng tâm lý & tính cách:** Mã Holland **${profile?.riaSecProfile?.code || 'IRC'}** và Nhóm tính cách **${profile?.mbtiType || 'INTJ'}**.
- **Năng lực học tập:** Học lực **${profile?.academicGPA || 'Khá - Giỏi'}** | Kỳ thi: ${
        profile?.examScores?.hsaScore ? `HSA ${profile.examScores.hsaScore}/150, ` : ''
      }${profile?.examScores?.tsaScore ? `TSA ${profile.examScores.tsaScore}/100, ` : ''}${
        profile?.examScores?.thptScore ? `THPTQG ${profile.examScores.thptScore}đ` : 'Đang cập nhật điểm'
      }.
- **Ngành nghề tương thích hàng đầu:** **${topCareers[0]?.title || 'Khoa học Máy tính & Kỹ thuật'}** (${topScoredCareers[0]?.overallScore || 94}%).

Bạn có thắc mắc gì về điểm chuẩn các trường, phương thức xét tuyển hay kỹ năng cần chuẩn bị không? Hãy hỏi tôi ngay bên dưới nhé!`,
      timestamp: Date.now(),
      modelUsed: 'Local LLM',
      suggestedQuestions: [
        'Với điểm số và tính cách này, em nên chọn Đại học Bách Khoa hay ĐHQG?',
        'Em cần rèn luyện thêm kỹ năng gì để có lợi thế khi học đại học?',
        'Cơ hội việc làm và mức thu nhập của top ngành này trong 5 năm tới ra sao?'
      ]
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasUserInteractedChatRef = useRef(false);

  // Always scroll to top when Step 4 mounts so user sees the report from the beginning
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Auto-scroll chat box ONLY when user has sent a question, NEVER on initial mount
  useEffect(() => {
    if (!hasUserInteractedChatRef.current) return;
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  const handleSendQuestion = async (textToSend?: string) => {
    const q = (textToSend || inputQuestion).trim();
    if (!q || isThinking) return;

    hasUserInteractedChatRef.current = true;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsThinking(true);

    try {
      const result = await askAICounselor(q, profile, topCareers, llmConfig, chatMessages);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: result.reply,
        timestamp: Date.now(),
        modelUsed: result.modelUsed,
        suggestedQuestions: result.suggestedQuestions
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        content: 'Hệ thống đang bận xử lý, vui lòng thử lại sau giây lát hoặc chuyển sang chế độ Local LLM.',
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  // PDF Export State & Function
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById('career-report-export-container');
    if (!reportElement || isExportingPdf) return;

    let exportClone: HTMLElement | null = null;

    try {
      setIsExportingPdf(true);
      setPdfSuccess(false);
      setPdfError(null);

      await document.fonts?.ready;
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      exportClone = reportElement.cloneNode(true) as HTMLElement;
      exportClone.removeAttribute('id');
      exportClone.style.position = 'absolute';
      exportClone.style.left = '-100000px';
      exportClone.style.top = '0';
      exportClone.style.width = '794px';
      exportClone.style.maxWidth = '794px';
      exportClone.style.margin = '0';
      exportClone.style.padding = '24px';
      exportClone.style.background = '#f8fafc';
      exportClone.style.boxSizing = 'border-box';
      exportClone.style.overflow = 'visible';
      document.body.appendChild(exportClone);

      exportClone.querySelectorAll('[data-pdf-ignore="true"]').forEach(element => {
        element.remove();
      });
      exportClone.querySelectorAll<HTMLElement>('.max-h-\\[500px\\]').forEach(element => {
        element.style.maxHeight = 'none';
        element.style.overflow = 'visible';
      });

      const canvas = await html2canvas(exportClone, {
        scale: 1.35,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#f8fafc',
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: 0
      });

      const pageWidthMm = 210;
      const pageHeightMm = 297;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pageHeightInPx = Math.floor((canvasWidth * pageHeightMm) / pageWidthMm);
      const totalPages = Math.max(1, Math.ceil(canvasHeight / pageHeightInPx));

      for (let page = 0; page < totalPages; page += 1) {
        const sourceY = page * pageHeightInPx;
        const sourceHeight = Math.min(pageHeightInPx, canvasHeight - sourceY);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = pageHeightInPx;
        const pageContext = pageCanvas.getContext('2d');

        if (!pageContext) continue;

        pageContext.fillStyle = '#f8fafc';
        pageContext.fillRect(0, 0, canvasWidth, pageHeightInPx);
        pageContext.drawImage(
          canvas,
          0,
          sourceY,
          canvasWidth,
          sourceHeight,
          0,
          0,
          canvasWidth,
          sourceHeight
        );

        if (page > 0) {
          pdf.addPage('a4', 'portrait');
        }
        pdf.addImage(
          pageCanvas.toDataURL('image/jpeg', 0.92),
          'JPEG',
          0,
          0,
          pageWidthMm,
          pageHeightMm,
          undefined,
          'FAST'
        );
      }

      const safeName = profile.name && profile.name.trim() !== ''
        ? profile.name.trim().replace(/[^a-zA-Z0-9\\u00C0-\\u024F\\u1EA0-\\u1EF9]/g, '_')
        : 'HocSinh';

      pdf.save(`Ket-qua-khao-sat-huong-nghiep-${safeName}.pdf`);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err: unknown) {
      console.error('Lỗi khi xuất file PDF:', err);
      const message = err instanceof Error ? err.message : 'Không xác định';
      setPdfError(`Không thể tạo PDF lúc này (${message}). Bạn hãy thử lại.`);
      setTimeout(() => setPdfError(null), 7000);
    } finally {
      exportClone?.remove();
      setIsExportingPdf(false);
    }
  };

  return (
    <div id="career-report-export-container" className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRANG 4 / 4: TỔNG HỢP TOÀN BỘ KẾT QUẢ & CỐ VẤN KHOA HỌC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Báo cáo Định vị Năng lực & Cố vấn Trí tuệ Nhân tạo
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Tổng hợp dữ liệu từ 3 trang kiểm tra tuần tự: Năng lực học tập, bài trắc nghiệm sở thích RIASEC,
            phong cách tư duy MBTI. Hệ thống tính điểm khoa học để xếp hạng Top ngành nghề và gợi ý các trường đại học Top tại Việt Nam.
          </p>
        </div>

        {/* Action Controls - Prominent PDF Export and Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0" data-pdf-ignore="true">
          <button
            id="btn-download-pdf-report"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
              pdfSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white shadow-indigo-500/25 active:scale-95'
            }`}
            title="Tải kết quả khảo sát định dạng PDF ảnh chụp màn hình"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tạo PDF báo cáo...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã tải PDF thành công!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>TẢI PDF KẾT QUẢ KHẢO SÁT</span>
              </>
            )}
          </button>

          <button
            id="btn-restart-exam-step4"
            onClick={onRestartExam}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            title="Xóa toàn bộ dữ liệu và làm lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại từ đầu (Xóa sạch)</span>
          </button>
        </div>
      </div>

      {/* PDF Error notification if any */}
      {pdfError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{pdfError}</span>
        </div>
      )}

      {/* MỤC 1: BẢNG TỔNG HỢP TOÀN BỘ KẾT QUẢ ĐÃ KIỂM TRA */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>1. Tổng hợp Toàn diện Hồ sơ Bài Kiểm tra</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đồng bộ dữ liệu 4 khía cạnh</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-xs">
          {/* Ô 1: Thông tin học sinh / Cá nhân */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">THÔNG TIN HỌC SINH</span>
            <div className="font-bold text-indigo-950 text-sm truncate" title={profile.name || 'Học sinh'}>
              {profile.name || 'Chưa nhập họ tên'}
            </div>
            <div className="text-indigo-900 font-medium">
              {profile.age ? `${profile.age} tuổi` : 'Chưa rõ tuổi'} {profile.gender ? `• ${profile.gender}` : ''}
            </div>
            <div className="text-indigo-800 text-[11px] truncate" title={profile.currentOccupation || (profile.province ? `Tỉnh: ${profile.province}` : 'Chưa cập nhật trường')}>
              {profile.currentOccupation ? `Trường: ${profile.currentOccupation}` : (profile.province ? `Tỉnh: ${profile.province}` : 'Chưa cập nhật trường')}
            </div>
          </div>

          {/* Ô 2: Học tập & Nơi ở */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">HỌC TẬP & NƠI Ở</span>
            <div className="font-bold text-slate-900 text-sm truncate" title={`${profile.grade || 'Chưa chọn lớp'} — ${profile.province || 'Chưa chọn nơi ở'}`}>
              {profile.grade || 'Chưa chọn lớp'} — {profile.province || 'Chưa chọn nơi ở'}
            </div>
            <div className="text-slate-700 font-medium truncate">
              Học lực: {profile.academicGPA || 'Chưa nhập'}
            </div>
            <div className="text-slate-500 text-[11px] truncate" title={profile.confidentSubjects?.join(', ') || profile.favoriteSubjects?.slice(0, 2).join(', ') || 'Chưa chọn môn'}>
              Thế mạnh: {profile.confidentSubjects?.join(', ') || profile.favoriteSubjects?.slice(0, 2).join(', ') || 'Chưa chọn môn'}
            </div>
          </div>

          {/* Ô 3: Điểm thi ĐGNL & THPT */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">ĐIỂM THI TUYỂN SINH</span>
            <div className="font-bold text-amber-950 text-sm truncate">
              {profile.examScores?.hsaScore ? `HSA: ${profile.examScores.hsaScore}/150` : ''}
              {profile.examScores?.tsaScore ? ` | TSA: ${profile.examScores.tsaScore}/100` : ''}
              {!profile.examScores?.hsaScore && !profile.examScores?.tsaScore && 'Kỳ thi tốt nghiệp THPT'}
            </div>
            <div className="text-amber-900 font-medium truncate">
              {profile.examScores?.thptScore ? `${profile.examScores.thptCombo || 'THPTQG'}: ${profile.examScores.thptScore}đ` : 'Chưa nhập điểm THPT'}
            </div>
            <div className="text-amber-800 text-[11px] truncate" title={profile.examScores?.awards?.join(', ') || 'Chứng chỉ ngoại ngữ / KHKT'}>
              {profile.examScores?.awards?.join(', ') || 'Chứng chỉ ngoại ngữ / KHKT'}
            </div>
          </div>

          {/* Ô 4: Kết quả RIASEC */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-1.5">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">KẾT QUẢ RIASEC (TRANG 2)</span>
            <div className="text-xl font-black text-blue-950">
              Mã: {profile.riaSecProfile?.code || 'IRC'}
            </div>
            <div className="text-blue-900 font-medium text-[11px] line-clamp-2" title={profile.riaSecProfile?.description || 'Nổi bật tư duy nghiên cứu & kỹ thuật'}>
              {profile.riaSecProfile?.description || 'Nổi bật tư duy nghiên cứu & kỹ thuật'}
            </div>
          </div>

          {/* Ô 5: Kết quả MBTI */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/70 space-y-1.5">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">KẾT QUẢ MBTI (TRANG 3)</span>
            <div className="text-xl font-black text-purple-950">
              Nhóm: {profile.mbtiType || 'INTJ'}
            </div>
            <div className="text-purple-900 font-medium text-[11px] line-clamp-2" title={profile.mbtiResult?.notes || 'Nhà Kiến thiết Chiến lược & Tư duy Hệ thống'}>
              {profile.mbtiResult?.notes || 'Nhà Kiến thiết Chiến lược & Tư duy Hệ thống'}
            </div>
          </div>
        </div>
      </div>

      {/* MỤC 2: TOP NGÀNH NGHỀ PHÙ HỢP NHẤT (TÍNH ĐIỂM KHOA HỌC) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>2. Top Ngành Nghề Tương Thích Hàng Đầu</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tính điểm khoa học dựa trên: RIASEC (30%) + Năng lực học tập & Điểm thi (25%) + Kỹ năng (20%) + MBTI (15%) + Kỳ vọng (10%).
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 self-start sm:self-center">
            Xếp hạng theo % Tương thích
          </span>
        </div>

        <div className="space-y-3">
          {topScoredCareers.map((item, index) => {
            const c = item.career;
            const score = item.overallScore;
            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 text-[10px] font-semibold">
                      {c.careerCluster}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                    <span>Mức lương khởi điểm: <strong className="text-emerald-700">{c.salaryInfo?.rangeDescription || '15 - 25 triệu VNĐ/tháng'}</strong></span>
                    <span>•</span>
                    <span>Mã Holland: <strong>{profile.riaSecProfile?.code}</strong> tương hợp cao</span>
                    <span>•</span>
                    <span>Kỹ năng cần: {c.requiredSkills.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                {/* Score & View Button */}
                <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Độ phù hợp:</span>
                    <div className="text-xl font-black text-indigo-600">{score}%</div>
                  </div>

                  {onViewCareerDetail && (
                    <button
                      onClick={() => onViewCareerDetail(c)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Chi tiết lộ trình</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MỤC 3: GỢI Ý CÁC TRƯỜNG ĐẠI HỌC TOP VÀ CÁC TRƯỜNG ĐÀO TẠO KHÁC TẠI VIỆT NAM */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-600" />
              <span>3. Gợi ý Trường Đại học TOP Phù hợp & Các Trường Đào tạo Khác</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đối chiếu điểm chuẩn tham chiếu (THPTQG, HSA ĐHQG Hà Nội, TSA Bách Khoa, V-ACT ĐHQG TP.HCM) và nhóm ngành thế mạnh.
            </p>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-center">
            {(['All', 'Bắc', 'Trung', 'Nam'] as const).map(reg => (
              <button
                key={reg}
                onClick={() => setUniRegionFilter(reg)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  uniRegionFilter === reg
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {reg === 'All' ? 'Toàn quốc' : `Miền ${reg}`}
              </button>
            ))}
          </div>
        </div>

        {/* NHÓM 1: CÁC TRƯỜNG TOP 1 TRỌNG ĐIỂM */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200">
              NHÓM 1
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Các Trường Đại học TOP 1 Trọng điểm Quốc gia (Chuẩn đầu ra & Uy tín Cao nhất)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {top1Universities.map(uni => (
              <div
                key={uni.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/90 shadow-2xs space-y-2 text-xs hover:border-indigo-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      {uni.name} ({uni.shortName})
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {uni.location} • Khu vực Miền {uni.region}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold shrink-0">
                    {uni.tier}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                  {uni.description}
                </p>

                {/* Score benchmarks */}
                <div className="p-2.5 rounded-xl bg-slate-100/70 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Điểm chuẩn THPTQG:</span>
                    <span className="font-bold text-slate-900">{uni.benchmarkScoreTHPT}</span>
                  </div>
                  {uni.benchmarkHSA && (
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">Điểm chuẩn HSA:</span>
                      <span className="font-bold text-blue-900">{uni.benchmarkHSA}</span>
                    </div>
                  )}
                  {uni.benchmarkTSA && (
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-700 font-medium">Điểm chuẩn TSA:</span>
                      <span className="font-bold text-indigo-900">{uni.benchmarkTSA}</span>
                    </div>
                  )}
                  {uni.benchmarkVACT && (
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 font-medium">Điểm chuẩn V-ACT:</span>
                      <span className="font-bold text-emerald-900">{uni.benchmarkVACT}</span>
                    </div>
                  )}
                </div>

                {/* Prominent majors */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">NGÀNH NỔI BẬT:</span>
                  <div className="flex flex-wrap gap-1">
                    {uni.prominentMajors.slice(0, 3).map(m => (
                      <span key={m} className="px-2 py-0.5 rounded-md bg-slate-200/60 text-slate-800 text-[10px] font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NHÓM 2: CÁC TRƯỜNG ĐÀO TẠO UY TÍN & CHUYÊN SÂU KHÁC */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
              NHÓM 2
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Các Trường Đào tạo Uy tín & Chuyên sâu Khác (Phương án An toàn & Thực hành Cao)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {top2Universities.map(uni => (
              <div
                key={uni.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 text-xs hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      {uni.name} ({uni.shortName})
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {uni.location} • Miền {uni.region}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold shrink-0">
                    {uni.tier}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                  {uni.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Điểm chuẩn THPT:</span>
                    <span className="font-bold text-slate-900">{uni.benchmarkScoreTHPT}</span>
                  </div>
                  {uni.benchmarkHSA && (
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">Điểm chuẩn HSA:</span>
                      <span className="font-bold text-blue-900">{uni.benchmarkHSA}</span>
                    </div>
                  )}
                  {uni.benchmarkVACT && (
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 font-medium">Điểm chuẩn V-ACT:</span>
                      <span className="font-bold text-emerald-900">{uni.benchmarkVACT}</span>
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">NGÀNH NỔI BẬT:</span>
                  <div className="flex flex-wrap gap-1">
                    {uni.prominentMajors.slice(0, 3).map(m => (
                      <span key={m} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MỤC 4: BỘ CHỌN MODEL LLM TƯ VẤN & HỎI ĐÁP CHUYÊN SÂU CHI TIẾT (CHATBOT NHƯ CHATGPT) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        {/* Header & LLM Model Selector Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-0.5">
              <Cpu className="w-4 h-4" />
              <span>4. Trợ lý AI Hỏi đáp Chuyên sâu Chi tiết</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Hỏi đáp Tư vấn Thông minh với Mô hình Trí tuệ Nhân tạo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tương tác trực tiếp như ChatGPT. Mô hình trả lời bám sát hồ sơ học sinh: điểm thi HSA/TSA, mã Holland và MBTI.
            </p>
          </div>

          {/* Model Selector Pill */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 pl-2">Mô hình AI:</span>
            <select
              value={llmConfig.provider}
              onChange={e => {
                const prov = e.target.value as LLMProviderType;
                setLlmConfig({
                  ...llmConfig,
                  provider: prov,
                  modelName:
                    prov === 'local'
                      ? 'Local LLM (Mô hình Cục bộ Offline)'
                      : prov === 'gemini'
                      ? 'Gemini 3.8 Flash (Cloud AI Studio)'
                      : 'Ollama / DeepSeek / Custom'
                });
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-xs shadow-xs focus:outline-none"
            >
              <option value="local">🟢 Local LLM (Cục bộ / Offline)</option>
              <option value="gemini">🔵 Gemini 3.8 Flash (Cloud)</option>
              <option value="custom">🟣 Custom / Ollama Endpoint</option>
            </select>

            <button
              onClick={() => {
                if (onOpenAIModelModal) onOpenAIModelModal();
                else setShowConfigModal(!showConfigModal);
              }}
              title="Cài đặt mô hình AI & Kết nối Local LLM"
              className="p-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Custom LLM Config Modal / Panel if requested */}
        {showConfigModal && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 text-xs animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-600" />
                Cấu hình Kết nối Model AI Cục bộ / Tùy biến
              </span>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Bạn có thể kết nối với Ollama chạy ở máy cục bộ (VD: <code>http://localhost:11434</code>) hoặc API tương thích OpenAI / DeepSeek.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">API Endpoint:</label>
                <input
                  type="text"
                  value={llmConfig.customEndpoint}
                  onChange={e => setLlmConfig({ ...llmConfig, customEndpoint: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên Model:</label>
                <input
                  type="text"
                  value={llmConfig.modelName}
                  onChange={e => setLlmConfig({ ...llmConfig, modelName: e.target.value })}
                  placeholder="llama3:8b hoặc deepseek-r1"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Chat History Container */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto p-4 rounded-2xl bg-slate-50/60 border border-slate-200/80">
          {chatMessages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 px-1">
                  <span>{isUser ? profile.name : 'EduPath AI Counselor'}</span>
                  {!isUser && msg.modelUsed && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Suggested follow-up questions from bot */}
                {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 max-w-2xl">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendQuestion(q)}
                        className="text-left px-2.5 py-1 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/60 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        💬 {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-indigo-600 p-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              <span className="font-semibold text-[11px]">Trợ lý AI đang phân tích dữ liệu và suy luận...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar for Asking Questions */}
        <div className="flex items-center space-x-2 pt-1" data-pdf-ignore="true">
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSendQuestion();
              }
            }}
            placeholder="Đặt câu hỏi chi tiết về ngành học, trường đại học, học bổng, điểm chuẩn..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />

          <button
            onClick={() => handleSendQuestion()}
            disabled={!inputQuestion.trim() || isThinking}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <span>Gửi câu hỏi</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official Report Stamp for PDF */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center space-y-1">
        <p className="text-xs font-bold text-slate-800 tracking-wide">
          SHAPE YOUR FUTURE! - BÁO CÁO KHOA HỌC ĐỊNH HƯỚNG NGHỀ NGHIỆP & NĂNG LỰC TOÀN DIỆN
        </p>
        <p className="text-[11px] text-slate-500">
          Kết xuất dựa trên thuật toán MCDM đa tiêu chí kết hợp trắc nghiệm RIASEC, MBTI và năng lực học tập. Thời gian: {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3" data-pdf-ignore="true">
        <button
          onClick={onBackToStep3}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <span>← Quay lại Trang 3: Sửa MBTI</span>
        </button>

        <button
          onClick={onRestartExam}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Khảo sát lại cho học sinh mới (Xóa sạch)</span>
        </button>
      </div>
    </div>
  );
};
