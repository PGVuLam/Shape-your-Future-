/**
 * Deterministic Data Validation Engine
 * Validates schema, required fields, score boundary conditions,
 * subject combinations, and year integrity.
 * DIRECTIVE: If data is invalid, NEVER auto-fix with AI; reject or mark for REVIEW.
 */

import { ProgramRecord, AdmissionScoreRecord, UniversityRecord } from './types';

export interface ValidationIssue {
  recordId: string;
  field: string;
  value: any;
  rule: string;
  severity: 'ERROR' | 'WARNING';
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  totalRecordsChecked: number;
  validRecordsCount: number;
  invalidRecordsCount: number;
  issues: ValidationIssue[];
}

// Recognized Vietnamese Examination Subject Combinations
const VALID_COMBINATIONS = new Set([
  'A00', 'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09',
  'B00', 'B01', 'B02', 'B03', 'B04', 'B08',
  'C00', 'C01', 'C02', 'C03', 'C04', 'C14', 'C19', 'C20',
  'D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10',
  'D14', 'D15', 'D78', 'D84', 'D90', 'D96',
  'H00', 'H01', 'V00', 'V01', 'M00', 'N00', 'T00', 'R00'
]);

export class DataValidator {
  /**
   * Validates an entire list of admission score records
   */
  public static validateAdmissionScores(records: AdmissionScoreRecord[]): ValidationReport {
    const issues: ValidationIssue[] = [];
    const seenIds = new Set<string>();
    let validCount = 0;
    let invalidCount = 0;

    for (const rec of records) {
      let hasError = false;

      // 1. Required fields
      if (!rec.id || !rec.universityCode || !rec.programName) {
        issues.push({
          recordId: rec.id || 'unknown',
          field: 'required_fields',
          value: rec,
          rule: 'MISSING_REQUIRED_FIELDS',
          severity: 'ERROR',
          message: 'Bản ghi thiếu ID, Mã trường hoặc Tên ngành'
        });
        hasError = true;
      }

      // 2. Duplicate ID
      if (seenIds.has(rec.id)) {
        issues.push({
          recordId: rec.id,
          field: 'id',
          value: rec.id,
          rule: 'DUPLICATE_RECORD_ID',
          severity: 'ERROR',
          message: `Trùng lặp ID bản ghi điểm chuẩn: ${rec.id}`
        });
        hasError = true;
      }
      seenIds.add(rec.id);

      // 3. Year validation
      const currentYear = new Date().getFullYear();
      if (!rec.year || rec.year < 2020 || rec.year > currentYear + 1) {
        issues.push({
          recordId: rec.id,
          field: 'year',
          value: rec.year,
          rule: 'INVALID_YEAR',
          severity: 'ERROR',
          message: `Năm tuyển sinh không hợp lệ: ${rec.year}`
        });
        hasError = true;
      }

      // 4. Score range validation based on scale
      if (typeof rec.score !== 'number' || isNaN(rec.score) || rec.score <= 0) {
        issues.push({
          recordId: rec.id,
          field: 'score',
          value: rec.score,
          rule: 'SCORE_NON_NUMERIC',
          severity: 'ERROR',
          message: `Điểm chuẩn không phải số hợp lệ: ${rec.score}`
        });
        hasError = true;
      } else {
        const scale = rec.scoreScale || 30;
        if (scale === 30 && (rec.score < 10.0 || rec.score > 30.0)) {
          issues.push({
            recordId: rec.id,
            field: 'score',
            value: rec.score,
            rule: 'SCORE_OUT_OF_BOUNDS_30',
            severity: 'ERROR',
            message: `Điểm THPT thang 30 phải từ 10.0 đến 30.0 (Hiện tại: ${rec.score})`
          });
          hasError = true;
        } else if (scale === 100 && (rec.score < 20.0 || rec.score > 100.0)) {
          issues.push({
            recordId: rec.id,
            field: 'score',
            value: rec.score,
            rule: 'SCORE_OUT_OF_BOUNDS_TSA',
            severity: 'ERROR',
            message: `Điểm TSA thang 100 phải từ 20.0 đến 100.0 (Hiện tại: ${rec.score})`
          });
          hasError = true;
        } else if (scale === 150 && (rec.score < 40.0 || rec.score > 150.0)) {
          issues.push({
            recordId: rec.id,
            field: 'score',
            value: rec.score,
            rule: 'SCORE_OUT_OF_BOUNDS_HSA',
            severity: 'ERROR',
            message: `Điểm HSA thang 150 phải từ 40.0 đến 150.0 (Hiện tại: ${rec.score})`
          });
          hasError = true;
        } else if (scale === 1200 && (rec.score < 300.0 || rec.score > 1200.0)) {
          issues.push({
            recordId: rec.id,
            field: 'score',
            value: rec.score,
            rule: 'SCORE_OUT_OF_BOUNDS_VACT',
            severity: 'ERROR',
            message: `Điểm V-ACT thang 1200 phải từ 300.0 đến 1200.0 (Hiện tại: ${rec.score})`
          });
          hasError = true;
        }
      }

      // 5. Combination code validation if provided
      if (rec.combination) {
        const cleanCombo = rec.combination.toUpperCase().trim();
        if (!VALID_COMBINATIONS.has(cleanCombo) && !cleanCombo.includes('/')) {
          issues.push({
            recordId: rec.id,
            field: 'combination',
            value: rec.combination,
            rule: 'UNKNOWN_COMBINATION',
            severity: 'WARNING',
            message: `Tổ hợp môn xét tuyển chưa phổ biến: ${rec.combination}`
          });
        }
      }

      // 6. Provenance check
      if (!rec.provenance || !rec.provenance.sourceUrl) {
        issues.push({
          recordId: rec.id,
          field: 'provenance',
          value: rec.provenance,
          rule: 'MISSING_PROVENANCE',
          severity: 'ERROR',
          message: 'Bản ghi thiếu xuất xứ nguồn (Provenance / Source URL)'
        });
        hasError = true;
      }

      if (hasError) {
        invalidCount++;
      } else {
        validCount++;
      }
    }

    return {
      isValid: issues.filter(i => i.severity === 'ERROR').length === 0,
      totalRecordsChecked: records.length,
      validRecordsCount: validCount,
      invalidRecordsCount: invalidCount,
      issues
    };
  }

  /**
   * Validates programs list
   */
  public static validatePrograms(programs: ProgramRecord[]): ValidationReport {
    const issues: ValidationIssue[] = [];
    let validCount = 0;
    let invalidCount = 0;

    for (const prog of programs) {
      let hasError = false;
      if (!prog.programCode || !prog.programName) {
        issues.push({
          recordId: prog.id,
          field: 'programName',
          value: prog.programName,
          rule: 'EMPTY_PROGRAM_NAME',
          severity: 'ERROR',
          message: 'Tên hoặc mã ngành bị bỏ trống'
        });
        hasError = true;
      }

      if (prog.tuitionPerYearVND !== undefined && (prog.tuitionPerYearVND < 0 || prog.tuitionPerYearVND > 300000000)) {
        issues.push({
          recordId: prog.id,
          field: 'tuitionPerYearVND',
          value: prog.tuitionPerYearVND,
          rule: 'UNREALISTIC_TUITION',
          severity: 'WARNING',
          message: `Mức học phí (${prog.tuitionPerYearVND} VNĐ/năm) vượt ngưỡng thông thường`
        });
      }

      if (hasError) invalidCount++;
      else validCount++;
    }

    return {
      isValid: issues.filter(i => i.severity === 'ERROR').length === 0,
      totalRecordsChecked: programs.length,
      validRecordsCount: validCount,
      invalidRecordsCount: invalidCount,
      issues
    };
  }
}
