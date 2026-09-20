/**
 * End-to-End Web Analytics Orchestrator (Yandex.Metrika + Google Analytics 4)
 * Generates official tag snippets and the universal goal tracking dispatcher `trackEvent`.
 */

export interface AnalyticsOptions {
  ym_id?: string;
  ga_id?: string;
}

export class AnalyticsOrchestrator {
  /**
   * Generates the complete HTML snippet including Yandex.Metrika counter,
   * Google Analytics 4 gtag.js, and the universal `trackEvent` dispatcher.
   */
  static generateAnalyticsSnippet(options?: AnalyticsOptions): string {
    const ymId = options?.ym_id ? options.ym_id.trim() : '';
    const gaId = options?.ga_id ? options.ga_id.trim() : '';

    if (!ymId && !gaId) {
      return this.generateDispatcherSnippet('');
    }

    const snippets: string[] = [];

    // 1. Google Analytics 4 (gtag.js)
    if (gaId) {
      snippets.push(`<!-- Google Analytics 4 (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(gaId)}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${escapeHtml(gaId)}');
</script>`);
    }

    // 2. Yandex.Metrika counter
    if (ymId) {
      snippets.push(`<!-- Yandex.Metrika counter -->
<script type="text/javascript">
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  ym(${escapeHtml(ymId)}, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
  });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${escapeHtml(ymId)}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->`);
    }

    // 3. Universal Event Dispatcher
    snippets.push(this.generateDispatcherSnippet(ymId));

    return snippets.join('\n\n');
  }

  /**
   * Generates the micro-dispatcher `trackEvent(name, params)` that fans out
   * events to Yandex.Metrika reachGoal, GA4 gtag event, and dataLayer.
   */
  static generateDispatcherSnippet(ymId = ''): string {
    return `<!-- Universal Analytics Dispatcher -->
<script>
window.YM_ID = '${escapeHtml(ymId)}';
function trackEvent(name, params) {
  params = params || {};
  try {
    if (window.ym && window.YM_ID) {
      var numId = Number(window.YM_ID);
      if (!isNaN(numId) && numId > 0) {
        window.ym(numId, 'reachGoal', name, params);
      }
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params));
  } catch (err) {
    console.warn('[Analytics] trackEvent error:', err);
  }
}
</script>`;
  }
}

function escapeHtml(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
