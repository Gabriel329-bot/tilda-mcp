/**
 * MediaOrchestrator resolves high-quality, curated visual assets for landing page sections
 * by industry niche, preventing primitive or inappropriate stock defaults.
 */
export class MediaOrchestrator {
  private static readonly NICHE_IMAGES: Record<string, string> = {
    telecom: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
    it: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
    network: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
    saas: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    agency: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    hardware: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1920&q=80',
  };

  private static readonly DEFAULT_IMAGE =
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80';

  /**
   * Resolves the most appropriate Hero background image for a given niche.
   */
  public resolveHeroImage(niche?: string): string {
    if (!niche) {
      return MediaOrchestrator.DEFAULT_IMAGE;
    }

    const normalized = niche.toLowerCase().trim();
    for (const [key, url] of Object.entries(MediaOrchestrator.NICHE_IMAGES)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return url;
      }
    }

    return MediaOrchestrator.NICHE_IMAGES[normalized] || MediaOrchestrator.DEFAULT_IMAGE;
  }
}
