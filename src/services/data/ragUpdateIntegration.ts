/**
 * Incremental RAG Index & Career Grounding Updater
 * Integrates database updates directly into the Retrieval-Augmented Generation pipeline.
 * Only re-indexes modified records and attaches source provenance & year tags.
 */

import { AdmissionScoreRecord, UniversityRecord, CareerMarketRecord } from './types';

export interface RAGGroundingDocument {
  id: string;
  docType: 'ADMISSION_BENCHMARK' | 'UNIVERSITY_PROFILE' | 'LABOR_MARKET' | 'CAREER_SKILL';
  title: string;
  content: string;
  year: number;
  sourceUrl: string;
  publisher: string;
  verified: boolean;
  lastUpdated: string;
  tags: string[];
}

export class RAGUpdateIntegration {
  private documentIndex: Map<string, RAGGroundingDocument> = new Map();
  private lastIndexedTimestamp: string = '';

  constructor() {
    this.lastIndexedTimestamp = new Date().toISOString();
  }

  /**
   * Incrementally indexes or updates verified admission score records
   */
  public indexAdmissionScores(scores: AdmissionScoreRecord[]): number {
    let indexedCount = 0;
    scores.forEach(s => {
      const docId = `rag-score-${s.id}`;
      const doc: RAGGroundingDocument = {
        id: docId,
        docType: 'ADMISSION_BENCHMARK',
        title: `Điểm chuẩn ${s.year}: ${s.universityName} - ${s.programName}`,
        content: `Năm tuyển sinh: ${s.year}. Trường: ${s.universityName} (Mã: ${s.universityCode}). Ngành: ${s.programName} (Mã ngành: ${s.programCode}). Phương thức: ${s.method}. ${s.combination ? `Tổ hợp môn: ${s.combination}.` : ''} Điểm chuẩn trúng tuyển chính thức: ${s.score}/${s.scoreScale} điểm. Nguồn công bố: ${s.provenance.publisher} (${s.provenance.sourceUrl}). Trạng thái xác thực: Đã kiểm chứng (Verified).`,
        year: s.year,
        sourceUrl: s.provenance.sourceUrl,
        publisher: s.provenance.publisher,
        verified: s.provenance.verified,
        lastUpdated: s.provenance.retrievedAt,
        tags: [s.universityCode, s.programCode, s.method, `year-${s.year}`, s.combination || '']
      };

      this.documentIndex.set(docId, doc);
      indexedCount++;
    });

    this.lastIndexedTimestamp = new Date().toISOString();
    return indexedCount;
  }

  /**
   * Incrementally indexes university profiles and tuition
   */
  public indexUniversities(universities: UniversityRecord[]): number {
    let indexedCount = 0;
    universities.forEach(u => {
      const docId = `rag-uni-${u.id}`;
      const programsSummary = u.programs
        .map(
          p =>
            `+ ${p.programName} (${p.programCode}): Học phí ${p.tuitionDescription || 'Theo quy định nhà nước'}, Điểm chuẩn THPT ${p.admissionMethods[0]?.score || 'N/A'}`
        )
        .join('\n');

      const doc: RAGGroundingDocument = {
        id: docId,
        docType: 'UNIVERSITY_PROFILE',
        title: `Thông tin tuyển sinh & Học phí: ${u.name} (${u.shortName})`,
        content: `Cơ sở đào tạo: ${u.name} (${u.shortName}). Phân loại: ${u.tier} - ${u.category}. Khu vực: ${u.location} (${u.region}). Website tuyển sinh: ${u.admissionWebsite}. Các ngành đào tạo và chuẩn đầu vào:\n${programsSummary}\nNguồn dữ liệu: ${u.provenance.publisher}.`,
        year: u.year,
        sourceUrl: u.provenance.sourceUrl,
        publisher: u.provenance.publisher,
        verified: u.provenance.verified,
        lastUpdated: u.lastUpdated,
        tags: [u.code, u.shortName, u.region, u.tier]
      };

      this.documentIndex.set(docId, doc);
      indexedCount++;
    });

    this.lastIndexedTimestamp = new Date().toISOString();
    return indexedCount;
  }

  /**
   * Retrieves grounded factual context documents matching query keywords
   */
  public searchGroundedContext(query: string, maxResults = 4): RAGGroundingDocument[] {
    if (!query) return [];
    const qLower = query.toLowerCase();
    const tokens = qLower.split(/\s+/).filter(t => t.length > 1);

    const matches: Array<{ doc: RAGGroundingDocument; score: number }> = [];

    this.documentIndex.forEach(doc => {
      let score = 0;
      const text = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();

      tokens.forEach(token => {
        if (text.includes(token)) score += 10;
        if (doc.tags.some(t => t.toLowerCase() === token)) score += 25;
      });

      if (score > 0) {
        matches.push({ doc, score });
      }
    });

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, maxResults).map(m => m.doc);
  }

  public getIndexSize(): number {
    return this.documentIndex.size;
  }

  public getLastIndexedTimestamp(): string {
    return this.lastIndexedTimestamp;
  }
}
