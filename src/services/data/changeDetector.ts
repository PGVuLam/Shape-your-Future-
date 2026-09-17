/**
 * Change Detection Module
 * Implements "CHECK CHEAP → FETCH ONLY IF CHANGED"
 * Guarantees zero AI calls when remote sources are unchanged.
 */

import { DataSource } from './types';

export interface ChangeDetectionResult {
  hasChanged: boolean;
  reason: 'ETAG_MATCH' | 'NOT_MODIFIED_304' | 'HASH_MATCH' | 'CONTENT_CHANGED' | 'NEW_SOURCE' | 'ETAG_CHANGED' | 'LAST_MODIFIED_CHANGED' | 'LAST_MODIFIED_MATCH';
  newContentHash?: string;
  newEtag?: string;
  newLastModified?: string;
  diffSummary?: string;
  changedSnippet?: string;
}

export class ChangeDetector {
  /**
   * Generates a deterministic hash for string content (DJB2 / FNV-1a hybrid for browser & node)
   */
  public static hashContent(content: string): string {
    if (!content) return 'empty_hash';
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < content.length; i++) {
      const ch = content.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }

  /**
   * Inspects HTTP response headers (ETag, 304, Last-Modified) before downloading or parsing content
   */
  public static checkHeaderChange(
    source: DataSource,
    status: number,
    responseHeaders?: { etag?: string | null; lastModified?: string | null }
  ): ChangeDetectionResult | null {
    // 1. HTTP 304 Not Modified
    if (status === 304) {
      return {
        hasChanged: false,
        reason: 'NOT_MODIFIED_304',
        newEtag: source.etag,
        newLastModified: source.lastModified
      };
    }

    // 2. ETag match
    const remoteEtag = responseHeaders?.etag?.replace(/^W\//, '').replace(/"/g, '');
    if (remoteEtag && source.etag && remoteEtag === source.etag) {
      return {
        hasChanged: false,
        reason: 'ETAG_MATCH',
        newEtag: source.etag
      };
    }

    // 3. Last-Modified match
    const remoteLastModified = responseHeaders?.lastModified;
    if (remoteLastModified && source.lastModified && remoteLastModified === source.lastModified) {
      return {
        hasChanged: false,
        reason: 'LAST_MODIFIED_MATCH',
        newLastModified: source.lastModified
      };
    }

    return null; // Headers inconclusive, content hash check needed
  }

  /**
   * Compares raw content body against previous source hash
   */
  public static checkContentChange(
    source: DataSource,
    rawContent: string,
    previousContent?: string
  ): ChangeDetectionResult {
    const newHash = this.hashContent(rawContent.trim());

    if (!source.lastContentHash) {
      return {
        hasChanged: true,
        reason: 'NEW_SOURCE',
        newContentHash: newHash,
        changedSnippet: rawContent.slice(0, 500)
      };
    }

    if (source.lastContentHash === newHash) {
      return {
        hasChanged: false,
        reason: 'HASH_MATCH',
        newContentHash: newHash
      };
    }

    // Content has changed! Extract diff snippet to minimize downstream AI payload
    const diff = this.extractDiffSnippet(previousContent || '', rawContent);

    return {
      hasChanged: true,
      reason: 'CONTENT_CHANGED',
      newContentHash: newHash,
      diffSummary: diff.summary,
      changedSnippet: diff.changedPortion
    };
  }

  /**
   * Extracts only changed or new paragraphs to save prompt token quota
   */
  private static extractDiffSnippet(
    oldText: string,
    newText: string
  ): { summary: string; changedPortion: string } {
    if (!oldText) {
      return {
        summary: 'Toàn bộ nội dung mới được thêm vào',
        changedPortion: newText.slice(0, 3000)
      };
    }

    const oldLines = new Set(oldText.split('\n').map(l => l.trim()).filter(Boolean));
    const newLines = newText.split('\n').map(l => l.trim()).filter(Boolean);
    const addedLines = newLines.filter(l => !oldLines.has(l));

    if (addedLines.length === 0) {
      return {
        summary: 'Thay đổi cấu trúc hoặc ký tự định dạng',
        changedPortion: newText.slice(0, 2000)
      };
    }

    return {
      summary: `Phát hiện ${addedLines.length} dòng dữ liệu mới hoặc đã cập nhật`,
      changedPortion: addedLines.slice(0, 100).join('\n')
    };
  }
}
