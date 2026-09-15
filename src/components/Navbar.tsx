import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Compass,
  Network,
  Settings,
  ShieldCheck,
  RotateCcw,
  Cpu,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { UserProfile, AgeGroup, LLMConfig } from '../types';
import { DEMO_PROFILES } from '../data/demoProfiles';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentStep: number;
  highestUnlockedStep: number;
  onSelectStep: (stepId: number) => void;
  activeProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
  onSelectAgeGroup?: (ageGroup: AgeGroup) => void;
  isDebugOpen: boolean;
  setIsDebugOpen: (open: boolean) => void;
  onOpenArchitectureModal: () => void;
  onOpenAIModelModal?: () => void;
  onRestartWorkflow: () => void;
  llmConfig?: LLMConfig;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  highestUnlockedStep,
  onSelectStep,
  activeProfile,
  onSelectProfile,
  isDebugOpen,
  setIsDebugOpen,
  onOpenArchitectureModal,
  onOpenAIModelModal,
  onRestartWorkflow,
  llmConfig,
  onGoHome
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close drawer on Escape key & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row - Minimalist matching user specification */}
        <div className="flex items-center justify-between py-3">
          {/* Logo & Platform Info */}
          <button
            onClick={onGoHome}
            className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-none"
            title="Về Trang chủ"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                  Shape Your Future!
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                  AI Career MVP
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hệ thống hỗ trợ khám phá sở thích & xu hướng nghề nghiệp
              </p>
            </div>
          </button>

          {/* Single Menu & Settings Button */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-navbar-menu"
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200/90 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-2xs"
              title="Menu & Cài đặt hệ thống"
            >
              <Menu className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Menu & Cài đặt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu / Settings Overlay Modal & Drawer rendered into document.body */}
      {isMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
          {/* Full Screen Dim Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Right Sliding Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
            <div className="w-screen max-w-md bg-white h-full shadow-2xl border-l border-slate-200 z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <Settings className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Cài đặt & Tiện ích Hệ thống
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Mô hình AI, Sơ đồ, Ngôn ngữ & Chế độ Giám khảo
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-300/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Đóng menu"
                  aria-label="Đóng menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 space-y-5 flex-1 overflow-y-auto">
                {/* 1. Model AI Cố vấn & Local LLM */}
                <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      <span>MÔ HÌNH AI CỐ VẤN</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {llmConfig?.provider === 'local'
                        ? 'Local AI'
                        : llmConfig?.provider === 'custom'
                        ? 'Custom LLM'
                        : 'Gemini 3.8 Flash'}
                    </span>
                  </div>
                  <p className="text-xs text-purple-950/70 leading-relaxed">
                    Hiện đang sử dụng{' '}
                    <strong className="text-purple-900">
                      {llmConfig?.provider === 'local'
                        ? 'Local LLM Cục bộ'
                        : llmConfig?.provider === 'custom'
                        ? `Local (${llmConfig.modelName || 'Ollama'})`
                        : 'Google Gemini 3.8 Flash'}
                    </strong>
                    . Bạn có thể chuyển sang Local LLM (Ollama, LM Studio) để chạy offline bảo mật.
                  </p>
                  {onOpenAIModelModal && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAIModelModal();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Điều chỉnh Model AI & Kết nối Local LLM</span>
                    </button>
                  )}
                </div>

                {/* 2. Sơ đồ Kiến trúc Hệ thống */}
                <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                      <Network className="w-4 h-4 text-indigo-600" />
                      <span>SƠ ĐỒ KIẾN TRÚC HỆ THỐNG</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      Pipeline 4 Bước
                    </span>
                  </div>
                  <p className="text-xs text-indigo-950/70 leading-relaxed">
                    Xem sơ đồ luồng dữ liệu 4 giai đoạn, mô hình MCDM, cấu trúc tri thức và cơ chế đối sánh khách quan.
                  </p>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenArchitectureModal();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Xem Sơ đồ Kiến trúc Hệ thống</span>
                  </button>
                </div>

                {/* 3. Chế độ Giám khảo KHKT */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>CHẾ ĐỘ GIÁM KHẢO KHKT</span>
                    </div>
                    <button
                      onClick={() => setIsDebugOpen(!isDebugOpen)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isDebugOpen
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {isDebugOpen ? 'Đang Bật' : 'Đang Tắt'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hiển thị bảng kiểm định chi tiết các chỉ số vector MCDM, trọng số độ dốc và bằng chứng khoa học cho ban giám khảo.
                  </p>
                </div>

                {/* 4. Tải Hồ sơ Kiểm thử Nhanh */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    <span>HỒ SƠ MẪU KIỂM THỬ NHANH</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Nạp nhanh dữ liệu hồ sơ mẫu để thử nghiệm quy trình:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        onSelectProfile(DEMO_PROFILES['demo-hs-tech']);
                        setIsMenuOpen(false);
                      }}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="font-bold text-slate-900 block truncate">Minh Tuấn (16t)</span>
                      <span className="text-[10px] text-indigo-600">THPT - STEM Tech</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectProfile(DEMO_PROFILES['demo-college-cs']);
                        setIsMenuOpen(false);
                      }}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="font-bold text-slate-900 block truncate">Khánh Linh (22t)</span>
                      <span className="text-[10px] text-blue-600">Sinh viên - AI/Data</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectProfile(DEMO_PROFILES['demo-kid-explorer']);
                        setIsMenuOpen(false);
                      }}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="font-bold text-slate-900 block truncate">Bảo An (10t)</span>
                      <span className="text-[10px] text-emerald-600">Tiểu học - Khám phá</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectProfile(DEMO_PROFILES['demo-adult-changer']);
                        setIsMenuOpen(false);
                      }}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="font-bold text-slate-900 block truncate">Hoàng Nam (29t)</span>
                      <span className="text-[10px] text-amber-600">Người lớn - Đổi nghề</span>
                    </button>
                  </div>
                </div>

                {/* 6. Đặt lại / Khởi động lại (Xóa sạch toàn bộ) */}
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <button
                    id="btn-navbar-reset-all"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onRestartWorkflow();
                    }}
                    className="w-full py-3 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>Làm lại khảo sát từ đầu (Xóa sạch toàn bộ)</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">
                    Xóa sạch hoàn toàn câu trả lời, điểm số và thông tin người dùng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

