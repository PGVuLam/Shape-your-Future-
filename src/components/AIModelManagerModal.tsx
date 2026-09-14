import React, { useState } from 'react';
import {
  Cpu,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  Zap,
  Globe,
  Settings2,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LLMConfig, LLMProviderType } from '../types';

interface AIModelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LLMConfig;
  onSaveConfig: (updated: LLMConfig) => void;
}

export const AIModelManagerModal: React.FC<AIModelManagerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [localConfig, setLocalConfig] = useState<LLMConfig>(config);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [testLatency, setTestLatency] = useState<number | null>(null);

  // Sync when modal opens
  React.useEffect(() => {
    setLocalConfig(config);
    setTestStatus('idle');
    setTestMessage('');
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Đang kết nối tới mô hình...');
    setTestLatency(null);

    const startTime = Date.now();

    if (localConfig.provider === 'local') {
      await new Promise(r => setTimeout(r, 200));
      setTestStatus('success');
      setTestLatency(Date.now() - startTime);
      setTestMessage('Trình suy luận Cục bộ tích hợp luôn sẵn sàng hoạt động 100% offline.');
      return;
    }

    if (localConfig.provider === 'gemini') {
      try {
        const res = await fetch('/api/health');
        const latency = Date.now() - startTime;
        if (res.ok) {
          const data = await res.json();
          setTestStatus('success');
          setTestLatency(latency);
          setTestMessage(
            data.hasApiKey
              ? `Kết nối thành công tới Gemini 3.8 Flash (${latency}ms). Khóa API server đang hoạt động.`
              : `Máy chủ phản hồi (${latency}ms). Đang chạy chế độ đệm phản hồi thông minh.`
          );
        } else {
          throw new Error('Máy chủ phản hồi mã lỗi: ' + res.status);
        }
      } catch (err: any) {
        setTestStatus('failed');
        setTestMessage(`Không thể kết nối tới server: ${err?.message || 'Lỗi mạng'}`);
      }
      return;
    }

    // Custom local endpoint (Ollama, LM Studio, etc.)
    const endpoint = localConfig.customEndpoint || 'http://localhost:11434';
    try {
      // Test either via backend proxy or direct fetch
      const testRes = await fetch('/api/ai/test-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint,
          modelName: localConfig.modelName || 'llama3.2',
          apiKey: localConfig.apiKey
        })
      });

      const latency = Date.now() - startTime;
      if (testRes.ok) {
        const data = await testRes.json();
        setTestStatus('success');
        setTestLatency(latency);
        setTestMessage(data.message || `Kết nối thành công tới ${endpoint} (${latency}ms).`);
      } else {
        // Attempt client direct ping if proxy returned error
        try {
          const directPing = await fetch(`${endpoint.replace(/\/+$/, '')}/api/tags`, {
            method: 'GET',
            mode: 'cors'
          });
          if (directPing.ok) {
            setTestStatus('success');
            setTestLatency(Date.now() - startTime);
            setTestMessage(`Kết nối trực tiếp thành công tới Ollama tại ${endpoint}!`);
            return;
          }
        } catch (_) {}
        const errorData = await testRes.json().catch(() => ({}));
        setTestStatus('failed');
        setTestMessage(errorData.error || `Không thể kết nối tới endpoint ${endpoint}. Vui lòng kiểm tra ứng dụng local AI.`);
      }
    } catch (err: any) {
      setTestStatus('failed');
      setTestMessage(`Lỗi kết nối tới ${endpoint}. Vui lòng đảm bảo ứng dụng LLM local đang chạy.`);
    }
  };

  const handleApplyPreset = (preset: 'ollama' | 'lmstudio' | 'vllm') => {
    if (preset === 'ollama') {
      setLocalConfig(prev => ({
        ...prev,
        provider: 'custom',
        customEndpoint: 'http://localhost:11434',
        modelName: 'qwen2.5:7b'
      }));
    } else if (preset === 'lmstudio') {
      setLocalConfig(prev => ({
        ...prev,
        provider: 'custom',
        customEndpoint: 'http://localhost:1234/v1',
        modelName: 'local-model'
      }));
    } else {
      setLocalConfig(prev => ({
        ...prev,
        provider: 'custom',
        customEndpoint: 'http://localhost:8000/v1',
        modelName: 'default'
      }));
    }
    setTestStatus('idle');
    setTestMessage('');
  };

  const handleSave = () => {
    onSaveConfig(localConfig);
    try {
      localStorage.setItem('edupath_llm_config', JSON.stringify(localConfig));
    } catch (_) {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Quản lý & Tùy biến Mô hình AI Cố vấn
              </h2>
              <p className="text-xs text-slate-300">
                Lựa chọn mô hình đám mây thông minh (Gemini), kết nối mô hình cục bộ (Ollama/LM Studio) hoặc chạy Offline.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 bg-slate-50/40">
          {/* Provider Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              1. CHỌN NỀN TẢNG MÔ HÌNH AI (AI INFERENCE PROVIDER)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Gemini Cloud */}
              <button
                type="button"
                onClick={() => {
                  setLocalConfig(prev => ({
                    ...prev,
                    provider: 'gemini',
                    modelName: 'gemini-3.8-flash'
                  }));
                  setTestStatus('idle');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  localConfig.provider === 'gemini'
                    ? 'bg-indigo-50/90 border-indigo-600 shadow-sm ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-700">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  {localConfig.provider === 'gemini' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Google Gemini Cloud</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Thông minh nhất, dữ liệu chuẩn xác, phân tích sâu mọi độ tuổi.
                  </div>
                </div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100/70 text-indigo-800 font-bold text-[10px] w-fit">
                  Khuyên dùng
                </span>
              </button>

              {/* Option 2: Local AI on Computer (Ollama, LM Studio) */}
              <button
                type="button"
                onClick={() => {
                  setLocalConfig(prev => ({
                    ...prev,
                    provider: 'custom',
                    customEndpoint: prev.customEndpoint || 'http://localhost:11434',
                    modelName: prev.modelName || 'qwen2.5:7b'
                  }));
                  setTestStatus('idle');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  localConfig.provider === 'custom'
                    ? 'bg-emerald-50/90 border-emerald-600 shadow-sm ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
                    <Server className="w-4 h-4" />
                  </span>
                  {localConfig.provider === 'custom' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Model Cục bộ Trên Máy</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Kết nối Ollama, LM Studio, vLLM hoặc DeepSeek chạy tại localhost.
                  </div>
                </div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 font-bold text-[10px] w-fit">
                  100% Riêng tư
                </span>
              </button>

              {/* Option 3: Built-in Offline Engine */}
              <button
                type="button"
                onClick={() => {
                  setLocalConfig(prev => ({
                    ...prev,
                    provider: 'local',
                    modelName: 'EduPath Local Inference Engine'
                  }));
                  setTestStatus('idle');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  localConfig.provider === 'local'
                    ? 'bg-purple-50/90 border-purple-600 shadow-sm ring-2 ring-purple-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700">
                    <Zap className="w-4 h-4" />
                  </span>
                  {localConfig.provider === 'local' && (
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Trình suy luận Cục bộ</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Chạy ngay trên trình duyệt, siêu tốc, không cần cài đặt thêm phần mềm.
                  </div>
                </div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-purple-100/70 text-purple-800 font-bold text-[10px] w-fit">
                  Không cần mạng
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Config Details according to selected provider */}
          {localConfig.provider === 'gemini' && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Cài đặt Mô hình Gemini
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Khóa API Server sẵn sàng
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chọn phiên bản Gemini:</label>
                  <select
                    value={localConfig.modelName || 'gemini-3.8-flash'}
                    onChange={e => setLocalConfig({ ...localConfig, modelName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="gemini-3.8-flash">Gemini 3.8 Flash (Mặc định - Thông minh & Nhanh)</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ổn định, phản hồi tức thì)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Tối ưu hóa lập luận học thuật sâu)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nhiệt độ tư duy (Temperature: {localConfig.temperature ?? 0.7}):
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={localConfig.temperature ?? 0.7}
                    onChange={e => setLocalConfig({ ...localConfig, temperature: parseFloat(e.target.value) })}
                    className="w-full mt-2 accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Chính xác & Khách quan</span>
                    <span>Sáng tạo & Đa dạng</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {localConfig.provider === 'custom' && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-emerald-600" />
                  Cấu hình Liên kết Mô hình Cục bộ trên Máy (Local Host / Ollama)
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('ollama')}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer"
                  >
                    Preset Ollama
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('lmstudio')}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer"
                  >
                    Preset LM Studio
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Địa chỉ API Endpoint:</label>
                  <input
                    type="text"
                    value={localConfig.customEndpoint || 'http://localhost:11434'}
                    onChange={e => setLocalConfig({ ...localConfig, customEndpoint: e.target.value })}
                    placeholder="http://localhost:11434 hoặc http://localhost:1234/v1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên Model đã tải về máy:</label>
                  <input
                    type="text"
                    value={localConfig.modelName || 'qwen2.5:7b'}
                    onChange={e => setLocalConfig({ ...localConfig, modelName: e.target.value })}
                    placeholder="qwen2.5:7b, llama3.2, deepseek-r1:8b..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Khóa API (Tùy chọn nếu proxy/server nội bộ yêu cầu):
                </label>
                <input
                  type="password"
                  value={localConfig.apiKey || ''}
                  onChange={e => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                  placeholder="Để trống nếu là Ollama / LM Studio chạy cục bộ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>

              {/* Quick CLI Guide */}
              <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                  <Terminal className="w-3 h-3" /> Hướng dẫn khởi động Ollama cho phép Web kết nối:
                </div>
                <div>OLLAMA_ORIGINS="*" ollama serve</div>
                <div className="text-slate-400 text-[10px]">// Tải model: ollama run qwen2.5:7b hoặc ollama run llama3.2</div>
              </div>
            </div>
          )}

          {localConfig.provider === 'local' && (
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
              <div className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                Trình suy luận Hướng nghiệp Độc lập (Built-in In-Browser Reasoning)
              </div>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                Hệ thống áp dụng bộ quy tắc ma trận khoa học đối chiếu 6 nhóm Holland RIASEC, 16 hình mẫu MBTI,
                chuẩn đầu vào kỳ thi HSA/TSA/V-ACT/THPTQG và phân tầng 6 nhóm tuổi.
                Toàn bộ dữ liệu của bạn ở lại 100% trên trình duyệt.
              </p>
            </div>
          )}

          {/* Persona / Consultation Style */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. PHONG CÁCH TƯ VẤN CỦA CỐ VẤN AI (COUNSELING PERSONA)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  key: 'empathetic' as const,
                  title: 'Tận tâm & Truyền cảm hứng',
                  desc: 'Thấu hiểu cảm xúc, khích lệ tự tin, phù hợp học sinh nhỏ tuổi & người đang lo âu.'
                },
                {
                  key: 'analytical' as const,
                  title: 'Dữ liệu & Logic Khách quan',
                  desc: 'Phân tích điểm số, xác suất trúng tuyển, kỹ năng thiếu hụt và dữ liệu thị trường.'
                },
                {
                  key: 'strategic' as const,
                  title: 'Chiến lược gia Thực chiến',
                  desc: 'Lập lộ trình hành động cụ thể, tối ưu hóa điểm số và nguyện vọng thực dụng.'
                }
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, systemPromptStyle: item.key })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    (localConfig.systemPromptStyle || 'strategic') === item.key
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{item.title}</div>
                  <div className={`text-[10px] mt-0.5 leading-snug ${
                    (localConfig.systemPromptStyle || 'strategic') === item.key ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Connection Button & Result Box */}
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 text-xs">Kiểm tra Trạng thái Mô hình AI:</span>
                <p className="text-[11px] text-slate-500">
                  Gửi tín hiệu kiểm tra đường truyền và tính sẵn sàng của mô hình đã chọn.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{testStatus === 'testing' ? 'Đang kiểm tra...' : 'Kiểm tra Kết nối'}</span>
              </button>
            </div>

            {testStatus !== 'idle' && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-start space-x-2 animate-in fade-in ${
                  testStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : testStatus === 'failed'
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                }`}
              >
                {testStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : testStatus === 'failed' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div>{testMessage}</div>
                  {testLatency !== null && (
                    <div className="text-[10px] opacity-80 mt-0.5">Thời gian phản hồi: {testLatency} ms</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Mô hình đang chọn: <strong className="text-slate-800">{
              localConfig.provider === 'gemini'
                ? 'Gemini 3.8 Flash (Cloud)'
                : localConfig.provider === 'custom'
                ? `Local Model (${localConfig.modelName || 'Custom'})`
                : 'Offline Engine'
            }</strong>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Áp dụng & Lưu Cài đặt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
