export interface ViewportSize {
  width: number;
  height: number;
}

export interface BlockPayload {
  blockName: string;
  htmlMarkup: string;
  cssStyles: string;
  jsCode?: string;
  targetRecordId?: string;
}

export interface PackagedBlock {
  blockId: string;
  containerId: string;
  fullSnippet: string;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  rule: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface VisualInspectionResult {
  pageId: string;
  desktopScreenshotPath: string;
  desktopBase64: string;
  mobileScreenshotPath: string;
  mobileBase64: string;
  previewUrl: string;
}

export interface PublishResult {
  pageId: string;
  publishedUrl: string;
  publishedAt: string;
}

export interface CreatePageResult {
  pageId: string;
  editUrl: string;
  title: string;
}

export interface BlockInsertionResult {
  recordId: string;
  blockId: string;
  pageId: string;
}
