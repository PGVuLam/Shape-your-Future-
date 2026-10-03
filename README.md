# Shape Your Future 26.1.0

Shape Your Future (SYF) là hệ thống tư vấn hướng nghiệp toàn diện tích hợp Trí tuệ Nhân tạo (AI) và các bài đánh giá chuẩn khoa học (RIASEC, MBTI). SYF 26.1.0 là phiên bản Stabilize & Hardened, tập trung vào tính ổn định, bảo mật, và toàn vẹn dữ liệu.

## Features
- **Hệ thống đánh giá**: Holland Code (RIASEC), MBTI, Skill Gap Analysis.
- **Recommendation Engine (Deterministic)**: Đề xuất nghề nghiệp dựa trên dữ liệu thực tế và hồ sơ người dùng.
- **AI Counselor**: Tích hợp Cloud AI (Gemini) và Local AI (Ollama, LM Studio) an toàn thông qua cơ chế RAG và prompt engineering.
- **Bảo mật**: Rate limiting, IP tracking, phiên bản hóa API key, bảo vệ Server-Side Request Forgery (SSRF) cho Local AI endpoints.
- **Data Pipeline**: Tích hợp dữ liệu chuẩn hóa, phát hiện xung đột, kiểm tra giới hạn tuổi tác.
- **Quản trị**: Quản trị dữ liệu (Admin Authentication, RBAC, session cookie bảo mật).

## Architecture
Dự án được xây dựng với kiến trúc Full-Stack (Vite + React + Express) và hệ thống Engine Recommendation lai (Hybrid Rule-based + LLM).

- `src/components/`: Giao diện người dùng
- `src/engine/`: Deterministic Engines (Recommendation, Roadmap, Skill Gap)
- `src/services/`: Integration layer (LLM, Data Pipeline, AI Counselor)
- `server.ts` / `server/`: Backend layer xử lý API, Auth, Database Store

### AI Architecture & Fallback
AI Architecture ưu tiên sự ổn định:
1. **Primary AI**: Gemini 3.8 Flash
2. **Local/Custom AI**: Tích hợp an toàn qua Proxy Backend (đã có rate-limiter & SSRF protection)
3. **Deterministic Fallback**: Nếu AI fail, hệ thống sẽ sử dụng Rule Engine nội bộ để đưa ra lời khuyên mà không làm crash app.

### Authentication & Security
- Admin được bảo vệ bởi HTTPOnly, Secure Cookie Session.
- API endpoints đều có In-Memory Rate Limiting (chặn abuse token và bruteforce attack).
- LLM Output được xử lý Graceful Error Handling, tránh các response sai định dạng JSON.

## Installation & Development

```bash
# Cài đặt
npm install

# Môi trường
cp .env.example .env

# Chạy Development
npm run dev

# Build Production
npm run build
npm start
```
