# AI Architecture
 Hệ thống AI của Shape Your Future sử dụng thiết kế phân lớp để đảm bảo an toàn và tính khả dụng cao.

## Luồng dữ liệu (Data Flow)
1. **Frontend**: Gửi yêu cầu từ người dùng (Hồ sơ học sinh, câu hỏi, ngôn ngữ).
2. **Backend Proxy (`server.ts`)**: Validate request, áp dụng Rate Limiting. Ngăn chặn SSRF nếu người dùng sử dụng Local AI Endpoint.
3. **LLM Adapter (`src/services/llmService.ts`)**: Gửi yêu cầu lên Gemini hoặc Local AI.
4. **Validation & Fallback**: Nếu LLM phản hồi lỗi, timeout, hoặc trả về cấu trúc sai, hệ thống tự động nhảy sang Deterministic Engine (sử dụng logic Hard-coded dựa trên RIASEC/MBTI).
 
## Bảo mật
- Tất cả API Key (Gemini) được lưu server-side, không xuất hiện trên frontend.
- Rate limiting 20 requests/phút áp dụng cho IP.
