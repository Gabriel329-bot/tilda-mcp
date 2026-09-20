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

export interface MarqueePayload {
  items?: string[];
}

export interface TimelineStep {
  step?: string;
  step_num?: string;
  title: string;
  descr: string;
}

export interface TimelinePayload {
  title?: string;
  descr?: string;
  steps: TimelineStep[];
}

export interface CalculatorPayload {
  title?: string;
  descr?: string;
}

export interface CroOverlaysOptions {
  stickyTitle?: string;
  stickySubtitle?: string;
  stickyBtn?: string;
  socialProofMsg?: string;
}

// Re-export common theme & style types
export type { ThemeTokens } from '../templates/theme-tokens.js';
export type { StylePresetName, ColorTheme } from '../styles/presets.js';
export type { T123BlockPackage, HeroBlockPackage } from '../generators/block-packager.js';
export type { SeoData } from '../generators/seo-orchestrator.js';
