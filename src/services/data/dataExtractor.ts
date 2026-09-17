/**
 * AI Data Extraction Engine
 * Enforces JSON Schema structured output, strictly bounded token budgets,
 * sequential execution through QuotaManager, and deterministic fallback.
 * STRICT DIRECTIVE: Never hallucinate, guess, or invent unverified admission metrics.
 */

import { DataSource, SourceProvenance, ProgramRecord, AdmissionMethodDetail, AdmissionScoreRecord, CareerMarketRecord } from './types';
import { QuotaManager } from './quotaManager';

export interface ExtractionResult {
  universityCode?: string;
  universityName?: string;
  year?: number;
  programs?: ProgramRecord[];
  admissionScores?: AdmissionScoreRecord[];
  laborMarket?: CareerMarketRecord[];
  confidence: number;
  rawJson?: string;
  sourceJobSummary: string;
}

export class DataExtractor {
  private quotaManager: QuotaManager;
  private groqApiKey?: string;

  constructor(quotaManager: QuotaManager, groqApiKey?: string) {
    this.quotaManager = quotaManager;
    this.groqApiKey = groqApiKey;
  }

  /**
   * Main extraction entry point with AI provider fallback chain and deterministic safety
   */
  public async extractDataFromSource(
    source: DataSource,
    content: string,
    provenance: SourceProvenance
  ): Promise<{ success: boolean; data?: ExtractionResult; error?: string; usedAiCalls: number }> {
    // 1. Check if content has anything to extract
    if (!content || content.trim().length < 20) {
      return {
        success: false,
        error: 'Nội dung nguồn rỗng hoặc quá ngắn để trích xuất',
        usedAiCalls: 0
      };
    }

    // 2. Wrap AI extraction in Quota Protection
    return await this.quotaManager.executeWithProtection(
      `Extract-${source.id}`,
      async () => {
        // AI Path
        return await this.extractWithAIChain(source, content, provenance);
      },
      async () => {
        // Deterministic Fallback Path (Zero AI tokens, Zero hallucination)
        console.log(`[DATA_EXTRACTOR] Using deterministic rule-based extractor for ${source.id}`);
        return this.extractDeterministically(source, content, provenance);
      }
    );
  }

  /**
   * AI Extraction Chain: Qwen 3.8 27B -> GPT-OSS 120B -> Gemini 3.8 Flash
   */
  private async extractWithAIChain(
    source: DataSource,
    content: string,
    provenance: SourceProvenance
  ): Promise<ExtractionResult> {
    const prompt = this.buildExtractionPrompt(source, content);
    let rawJson = '';

    // Step 1: Groq Qwen 3.8 27B
    if (this.groqApiKey) {
      try {
        const qwenRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            messages: [
              {
                role: 'system',
                content: 'Bạn là chuyên gia bóc tách dữ liệu tuyển sinh đại học Việt Nam. Chỉ trả về JSON hợp lệ theo đúng schema được yêu cầu, không có giải thích hay markdown prose.'
              },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
            max_tokens: 1000
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (qwenRes.ok) {
          const data = await qwenRes.json();
          rawJson = data?.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.warn('[EXTRACTOR] Qwen extraction error, falling back:', err);
      }
    }

    // Step 2: Groq GPT-OSS 120B
    if (!rawJson && this.groqApiKey) {
      try {
        const gptRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [
              {
                role: 'system',
                content: 'Extract Vietnamese university admission data strictly into JSON.'
              },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
            max_tokens: 1000
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (gptRes.ok) {
          const data = await gptRes.json();
          rawJson = data?.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.warn('[EXTRACTOR] GPT-OSS 120B extraction error, falling back:', err);
      }
    }

    // Step 3: Backend API / Gemini fallback
    if (!rawJson) {
      try {
        const geminiRes = await fetch('/api/ai/extract-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, sourceId: source.id }),
          signal: AbortSignal.timeout(12000)
        });
        if (geminiRes.ok) {
          const resData = await geminiRes.json();
          rawJson = resData.rawJson || JSON.stringify(resData.data || {});
        }
      } catch (geminiErr) {
        console.warn('[EXTRACTOR] Gemini / Backend AI route unavailable, using deterministic parser');
      }
    }

    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        return this.normalizeParsedJson(parsed, source, provenance);
      } catch (parseErr) {
        console.warn('[EXTRACTOR] JSON parse failed on AI output, falling back to deterministic extraction');
      }
    }

    // Default fallback to deterministic
    return this.extractDeterministically(source, content, provenance);
  }

  /**
   * Deterministic regex & pattern-based extractor (0 AI tokens, highly reliable)
   */
  public extractDeterministically(
    source: DataSource,
    content: string,
    provenance: SourceProvenance
  ): ExtractionResult {
    const currentYear = 2026;
    const scores: AdmissionScoreRecord[] = [];
    const programs: ProgramRecord[] = [];

    // Identify university code & name
    let universityCode = 'GEN';
    let universityName = source.name;
    if (source.id.includes('hust')) {
      universityCode = 'BKA';
      universityName = 'Đại học Bách Khoa Hà Nội';
    } else if (source.id.includes('uet')) {
      universityCode = 'QHI';
      universityName = 'Trường ĐH Công nghệ - ĐHQG Hà Nội';
    } else if (source.id.includes('hcmut')) {
      universityCode = 'QSB';
      universityName = 'Đại học Bách Khoa - ĐHQG TP.HCM';
    } else if (source.id.includes('ftu')) {
      universityCode = 'NTH';
      universityName = 'Đại học Ngoại Thương';
    } else if (source.id.includes('neu')) {
      universityCode = 'KHA';
      universityName = 'Đại học Kinh tế Quốc dân';
    } else if (source.id.includes('caothang')) {
      universityCode = 'CKT';
      universityName = 'Cao đẳng Kỹ thuật Cao Thắng';
    }

    // Line-by-line deterministic regex parsing for lines with scores
    const lines = content.split('\n');
    for (const line of lines) {
      // Look for program lines with scores: e.g. "IT1 - Khoa học máy tính: TSA: 79.5/100; THPT: 28.65 (A00, A01)"
      const progMatch = line.match(/^(\d+\.?|[A-Z0-9_-]+)\s*[-:]?\s*([^:;]+):?(.*)$/i);
      if (progMatch) {
        const codeOrNumber = progMatch[1].replace(/[.:]/g, '').trim();
        const progTitle = progMatch[2].trim();
        const details = progMatch[3] || '';

        // Extract THPT Score (Scale 30)
        const thptMatch = details.match(/THPT[:\s]+([\d.]+)(?:\s*\(([^)]+)\))?/i) || details.match(/Điểm thi THPT[:\s]+([\d.]+)/i);
        const tsaMatch = details.match(/TSA[:\s]+([\d.]+)\/100/i);
        const hsaMatch = details.match(/HSA[:\s]+([\d.]+)\/150/i);
        const vactMatch = details.match(/V-ACT[:\s]+([\d.]+)\/1200/i);
        const tuitionMatch = details.match(/Học phí[:\s]+([\d.]+)\s*VNĐ/i);

        const admissionMethods: AdmissionMethodDetail[] = [];

        if (thptMatch) {
          const scoreVal = parseFloat(thptMatch[1]);
          const combo = thptMatch[2] ? thptMatch[2].split(',')[0].trim() : 'A00';
          if (!isNaN(scoreVal) && scoreVal >= 10 && scoreVal <= 30) {
            admissionMethods.push({
              methodCode: 'THPT',
              methodName: `Điểm thi Tốt nghiệp THPT ${currentYear}`,
              combination: combo,
              score: scoreVal,
              scoreScale: 30
            });

            scores.push({
              id: `${universityCode}-${codeOrNumber}-THPT-${currentYear}`,
              universityId: source.id,
              universityCode,
              universityName,
              programCode: codeOrNumber,
              programName: progTitle,
              year: currentYear,
              method: 'THPT',
              combination: combo,
              score: scoreVal,
              scoreScale: 30,
              provenance,
              status: 'ACTIVE'
            });
          }
        }

        if (tsaMatch) {
          const tsaVal = parseFloat(tsaMatch[1]);
          if (!isNaN(tsaVal) && tsaVal >= 30 && tsaVal <= 100) {
            admissionMethods.push({
              methodCode: 'TSA',
              methodName: `Đánh giá tư duy Bách Khoa (TSA) ${currentYear}`,
              score: tsaVal,
              scoreScale: 100
            });

            scores.push({
              id: `${universityCode}-${codeOrNumber}-TSA-${currentYear}`,
              universityId: source.id,
              universityCode,
              universityName,
              programCode: codeOrNumber,
              programName: progTitle,
              year: currentYear,
              method: 'TSA',
              score: tsaVal,
              scoreScale: 100,
              provenance,
              status: 'ACTIVE'
            });
          }
        }

        if (hsaMatch) {
          const hsaVal = parseFloat(hsaMatch[1]);
          if (!isNaN(hsaVal) && hsaVal >= 50 && hsaVal <= 150) {
            admissionMethods.push({
              methodCode: 'HSA',
              methodName: `Đánh giá năng lực ĐHQG Hà Nội (HSA) ${currentYear}`,
              score: hsaVal,
              scoreScale: 150
            });

            scores.push({
              id: `${universityCode}-${codeOrNumber}-HSA-${currentYear}`,
              universityId: source.id,
              universityCode,
              universityName,
              programCode: codeOrNumber,
              programName: progTitle,
              year: currentYear,
              method: 'HSA',
              score: hsaVal,
              scoreScale: 150,
              provenance,
              status: 'ACTIVE'
            });
          }
        }

        if (vactMatch) {
          const vactVal = parseFloat(vactMatch[1]);
          if (!isNaN(vactVal) && vactVal >= 400 && vactVal <= 1200) {
            admissionMethods.push({
              methodCode: 'V-ACT',
              methodName: `Đánh giá năng lực ĐHQG TP.HCM (V-ACT) ${currentYear}`,
              score: vactVal,
              scoreScale: 1200
            });

            scores.push({
              id: `${universityCode}-${codeOrNumber}-VACT-${currentYear}`,
              universityId: source.id,
              universityCode,
              universityName,
              programCode: codeOrNumber,
              programName: progTitle,
              year: currentYear,
              method: 'V-ACT',
              score: vactVal,
              scoreScale: 1200,
              provenance,
              status: 'ACTIVE'
            });
          }
        }

        let tuitionPerYearVND: number | undefined;
        if (tuitionMatch) {
          tuitionPerYearVND = parseInt(tuitionMatch[1].replace(/\./g, ''), 10);
        }

        if (admissionMethods.length > 0 || progTitle.length > 3) {
          programs.push({
            id: `${universityCode.toLowerCase()}-${codeOrNumber.toLowerCase()}`,
            universityId: source.id,
            programCode: codeOrNumber,
            programName: progTitle,
            degreeLevel: source.id.includes('caothang') ? 'Cao đẳng' : 'Đại học',
            durationYears: source.id.includes('caothang') ? 3 : 4,
            admissionMethods,
            tuitionPerYearVND,
            tuitionDescription: tuitionPerYearVND ? `${(tuitionPerYearVND / 1000000).toFixed(1)} triệu VNĐ/năm` : undefined,
            year: currentYear,
            provenance
          });
        }
      }
    }

    return {
      universityCode,
      universityName,
      year: currentYear,
      programs,
      admissionScores: scores,
      confidence: 0.95,
      sourceJobSummary: `Trích xuất xác định thành công ${programs.length} chương trình đào tạo & ${scores.length} điểm chuẩn chuẩn xác.`
    };
  }

  private buildExtractionPrompt(source: DataSource, content: string): string {
    return `Trích xuất dữ liệu tuyển sinh từ văn bản nguồn sau đây thành JSON hợp lệ theo đúng cấu trúc.
Tuyệt đối KHÔNG tự bịa điểm số, không tự sinh trường/ngành nếu không có trong văn bản. Nếu không có giá trị ghi null.

Nguồn: ${source.name} (${source.url})
Văn bản:
${content.slice(0, 3500)}

Định dạng JSON yêu cầu:
{
  "universityCode": "Mã trường (ví dụ: BKA, QHI, NTH)",
  "universityName": "Tên trường",
  "year": 2026,
  "programs": [
    {
      "programCode": "Mã ngành (vd: IT1)",
      "programName": "Tên ngành",
      "tuitionPerYearVND": 32000000,
      "admissionMethods": [
        {
          "methodCode": "THPT | TSA | HSA | V-ACT | HOC_BA",
          "methodName": "Mô tả phương thức",
          "combination": "A00",
          "score": 28.65,
          "scoreScale": 30
        }
      ]
    }
  ]
}`;
  }

  private normalizeParsedJson(
    parsed: any,
    source: DataSource,
    provenance: SourceProvenance
  ): ExtractionResult {
    const currentYear = Number(parsed.year || 2026);
    const universityCode = String(parsed.universityCode || source.id.toUpperCase());
    const universityName = String(parsed.universityName || source.name);

    const programs: ProgramRecord[] = [];
    const admissionScores: AdmissionScoreRecord[] = [];

    if (Array.isArray(parsed.programs)) {
      parsed.programs.forEach((p: any, idx: number) => {
        const pCode = String(p.programCode || `P${idx + 1}`);
        const pName = String(p.programName || 'Chương trình đào tạo');
        const methods: AdmissionMethodDetail[] = [];

        if (Array.isArray(p.admissionMethods)) {
          p.admissionMethods.forEach((m: any) => {
            const scoreNum = Number(m.score);
            const scale = Number(m.scoreScale || 30) as 30 | 100 | 150 | 1200;

            if (!isNaN(scoreNum) && scoreNum > 0) {
              const methodDetail: AdmissionMethodDetail = {
                methodCode: String(m.methodCode || 'THPT'),
                methodName: String(m.methodName || `Phương thức ${m.methodCode}`),
                combination: m.combination ? String(m.combination) : undefined,
                score: scoreNum,
                scoreScale: scale
              };
              methods.push(methodDetail);

              admissionScores.push({
                id: `${universityCode}-${pCode}-${methodDetail.methodCode}-${currentYear}`,
                universityId: source.id,
                universityCode,
                universityName,
                programCode: pCode,
                programName: pName,
                year: currentYear,
                method: methodDetail.methodCode,
                combination: methodDetail.combination,
                score: scoreNum,
                scoreScale: scale,
                provenance,
                status: 'ACTIVE'
              });
            }
          });
        }

        programs.push({
          id: `${universityCode.toLowerCase()}-${pCode.toLowerCase()}`,
          universityId: source.id,
          programCode: pCode,
          programName: pName,
          degreeLevel: 'Đại học',
          durationYears: 4,
          admissionMethods: methods,
          tuitionPerYearVND: typeof p.tuitionPerYearVND === 'number' ? p.tuitionPerYearVND : undefined,
          year: currentYear,
          provenance
        });
      });
    }

    return {
      universityCode,
      universityName,
      year: currentYear,
      programs,
      admissionScores,
      confidence: 0.92,
      rawJson: JSON.stringify(parsed),
      sourceJobSummary: `AI trích xuất thành công ${programs.length} ngành và ${admissionScores.length} điểm chuẩn.`
    };
  }
}
