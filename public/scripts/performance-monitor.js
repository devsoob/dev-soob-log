// 성능 모니터링 스크립트
(function() {
  'use strict';

  // Core Web Vitals 모니터링
  function sendToAnalytics(metric) {
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }

  // LCP (Largest Contentful Paint)
  function reportLCP() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      sendToAnalytics({ name: 'LCP', value: lastEntry.startTime, id: lastEntry.id });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // FID (First Input Delay)
  function reportFID() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        sendToAnalytics({ name: 'FID', value: entry.processingStart - entry.startTime, id: entry.id });
      });
    }).observe({ entryTypes: ['first-input'] });
  }

  // CLS (Cumulative Layout Shift)
  function reportCLS() {
    let clsValue = 0;
    let clsEntries = [];

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });

    // CLS 최종 값 전송
    window.addEventListener('beforeunload', () => {
      if (clsValue > 0) {
        sendToAnalytics({ name: 'CLS', value: clsValue, id: 'cls-final' });
      }
    });
  }

  // TTFB (Time to First Byte)
  function reportTTFB() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const ttfb = entry.responseStart - entry.requestStart;
          sendToAnalytics({ name: 'TTFB', value: ttfb, id: entry.id });
        }
      });
    }).observe({ entryTypes: ['navigation'] });
  }

  // 초기화
  if ('PerformanceObserver' in window) {
    reportLCP();
    reportFID();
    reportCLS();
    reportTTFB();
  }

  // 추가 성능 메트릭
  window.addEventListener('load', () => {
    // DOMContentLoaded 시간
    const domContentLoaded = performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd;
    if (domContentLoaded) {
      sendToAnalytics({ name: 'DOMContentLoaded', value: domContentLoaded, id: 'dom-ready' });
    }

    // Load 완료 시간
    const loadComplete = performance.getEntriesByType('navigation')[0]?.loadEventEnd;
    if (loadComplete) {
      sendToAnalytics({ name: 'LoadComplete', value: loadComplete, id: 'load-complete' });
    }
  });
})(); 