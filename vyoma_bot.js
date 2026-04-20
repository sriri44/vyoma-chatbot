(function () {
  'use strict';

  /* ── duplicate-injection guard ── */
  if (window.__vyomaBotLoaded) return;
  window.__vyomaBotLoaded = true;

  /* ── wait for DOM, then boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE-CONTEXT DETECTION  — uses full href for accuracy
  ═══════════════════════════════════════════════════════════ */

  var CTX_RULES = [
    {
      keys: ['colocation', 'colo'],
      id: 'colo',
      msg: 'Looking for colocation services? I can help you find the right rack or suite.',
      welcome: 'Welcome to **L&T Vyoma Colocation** — Tier III certified, 7-layer security, Mumbai & Chennai. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me help you find the right colocation or cage solution!',
      tag: '\uD83C\uDFE2 Colocation Services',
      faqIds: ['colo', 'dc', 'sec'],
      explore: { label: '\uD83D\uDDA5\uFE0F Explore Colocation', svc: 'colocation' },
      price:   { label: '\uD83D\uDCB0 Get Infra Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to Infra Expert' }
    },
    {
      keys: ['data-center', 'data-centre', 'datacenter', 'datacentre', 'infrastructure', 'infra'],
      id: 'dc',
      msg: 'Need help with data center infrastructure or pricing?',
      welcome: 'Welcome to **L&T Vyoma Data Centers** — Tier III certified facilities in Mumbai & Chennai. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me help you find the right colocation or infrastructure solution!',
      tag: '\uD83C\uDFE2 Data Center',
      faqIds: ['dc', 'colo', 'sec'],
      explore: { label: '\uD83C\uDFE2 Explore Data Centers', svc: 'colocation' },
      price:   { label: '\uD83D\uDCB0 Get Infra Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to Infra Expert' }
    },
    {
      keys: ['cloud'],
      id: 'cloud',
      msg: 'Looking for cloud solutions? I can help you choose the right option.',
      welcome: 'Welcome to **L&T Vyoma Cloud** — India\'s sovereign cloud platform. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me help you explore our Public, Private, or Hybrid Cloud solutions!',
      tag: '\u2601\uFE0F Cloud Services',
      faqIds: ['cloud'],
      explore: { label: '\u2601\uFE0F Explore Cloud Solutions', svc: 'cloud' },
      price:   { label: '\uD83D\uDCB0 Get Cloud Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to Cloud Expert' }
    },
    {
      keys: ['ai', 'gpu', 'artificial-intelligence', 'machine-learning', 'ml'],
      id: 'ai',
      msg: 'Interested in AI & GPU solutions? Let me guide you.',
      welcome: 'Welcome to **L&T Vyoma AI & GPU** — purpose-built infrastructure for AI/ML workloads. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Explore our SPD1 AI-Ready Data Center and NVIDIA H100 GPUaaS!',
      tag: '\uD83E\uDD16 AI & GPU',
      faqIds: ['ai'],
      explore: { label: '\uD83E\uDD16 Explore AI Solutions', svc: 'ai' },
      price:   { label: '\uD83D\uDCB0 Get GPU Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to AI Expert' }
    },
    {
      keys: ['managed', 'managed-services', 'it-services'],
      id: 'svc',
      msg: 'Looking for managed IT services? I can help you find the right plan.',
      welcome: 'Welcome to **L&T Vyoma Managed Services** — 24\u00d77\u00d7365 certified IT and infrastructure management. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me help you explore our managed network, OS, DB, and storage solutions!',
      tag: '\u2699\uFE0F Managed Services',
      faqIds: ['svc', 'sec'],
      explore: { label: '\u2699\uFE0F Explore Managed Services', svc: 'managed' },
      price:   { label: '\uD83D\uDCB0 Get Services Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to IT Expert' }
    },
    {
      keys: ['network', 'network-services', 'networking'],
      id: 'network',
      msg: 'Exploring network services? I can guide you through our managed network solutions.',
      welcome: 'Welcome to **L&T Vyoma Network Services** — SLA-backed, carrier-neutral managed networking. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me guide you through our managed network solutions!',
      tag: '\uD83C\uDF10 Network Services',
      faqIds: ['svc', 'sec'],
      explore: { label: '\uD83C\uDF10 Explore Network Services', svc: 'managed' },
      price:   { label: '\uD83D\uDCB0 Get Network Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to Network Expert' }
    },
    {
      keys: ['security', 'cyber', 'cybersecurity'],
      id: 'sec',
      msg: 'Looking for security solutions? I can help you understand our security offerings.',
      welcome: 'Welcome to **L&T Vyoma Security** — 7-layer physical security and enterprise cybersecurity. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me walk you through our physical and cyber security capabilities!',
      tag: '\uD83D\uDD12 Security',
      faqIds: ['sec', 'dc'],
      explore: { label: '\uD83D\uDD12 Explore Security Solutions', svc: 'managed' },
      price:   { label: '\uD83D\uDCB0 Get Security Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to Security Expert' }
    },
    {
      keys: ['sustainability', 'green', 'esg'],
      id: 'sus',
      msg: 'Interested in our sustainability initiatives? Let me tell you about our green goals.',
      welcome: 'Welcome to **L&T Vyoma Sustainability** — committed to Carbon Neutrality by 2040 and Water Neutrality by 2035. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me share our green energy and sustainability roadmap!',
      tag: '\uD83C\uDF3F Sustainability',
      faqIds: ['sus'],
      explore: { label: '\uD83C\uDF3F Explore Sustainability', svc: 'explore' },
      price:   { label: '\uD83D\uDCB0 Get Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to an Expert' }
    },
    {
      keys: ['about', 'about-us', 'company', 'overview'],
      id: 'about',
      msg: 'Want to know more about L&T Vyoma? I can help you explore our story and services.',
      welcome: 'Welcome to **L&T Vyoma** — the Data Center & Cloud Services division of L&T, India\'s most trusted conglomerate. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me tell you what makes us India\'s preferred enterprise infrastructure partner!',
      tag: '\uD83C\uDFE2 About L&T Vyoma',
      faqIds: ['about', 'dc', 'cloud', 'ai'],
      explore: { label: '\uD83C\uDFE2 Explore Our Services', svc: 'explore' },
      price:   { label: '\uD83D\uDCB0 Get Pricing' },
      expert:  { label: '\uD83D\uDCDE Talk to an Expert' }
    },
    {
      keys: ['contact', 'contact-us', 'support', 'help', 'reach'],
      id: 'contact',
      msg: 'Need to get in touch with us? I can connect you with the right team.',
      welcome: 'Welcome to **L&T Vyoma Contact & Support**. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. I can connect you with our experts or help you find the information you need right now!',
      tag: '\uD83D\uDCDE Contact & Support',
      faqIds: ['contact', 'about'],
      explore: { label: '\uD83D\uDCCB Browse Our Services', svc: 'explore' },
      price:   { label: '\uD83D\uDCB0 Request a Quote' },
      expert:  { label: '\uD83D\uDCDE Connect with Support' }
    }
  ];

  var DEFAULT_CTX = {
    id: 'home',
    msg: 'Hi! Need help navigating L&T Vyoma services?',
    welcome: 'Welcome to **L&T Vyoma** — India\'s trusted enterprise data center and cloud provider. \uD83D\uDC4B\n\nI\'m Vyoma Assistant. Let me help you find the perfect solution for your business!',
    tag: null,
    faqIds: null, /* null = show ALL categories */
    explore: { label: '\uD83C\uDFE2 Explore Services', svc: 'explore' },
    price:   { label: '\uD83D\uDCB0 Get Pricing' },
    expert:  { label: '\uD83D\uDCDE Connect with Expert' }
  };

  /* ── Resolve context from current URL ── */
  function getCtx() {
    var url = window.location.href.toLowerCase();
    for (var i = 0; i < CTX_RULES.length; i++) {
      var rule = CTX_RULES[i];
      for (var k = 0; k < rule.keys.length; k++) {
        if (url.indexOf(rule.keys[k]) !== -1) return rule;
      }
    }
    return DEFAULT_CTX;
  }

  /* ── Return only the MENU items relevant to the current context ── */
  function getContextualFAQs(ctx) {
    if (!ctx.faqIds) {
      /* home / default: show all */
      return MENU.slice();
    }
    return MENU.filter(function (m) {
      return ctx.faqIds.indexOf(m.id) !== -1;
    });
  }

  /* ═══════════════════════════════════════════════════════════
     BOOT
  ═══════════════════════════════════════════════════════════ */
  function boot() {
    try { injectCSS(); }        catch(e) { console.warn('[VyomaBot] injectCSS error:', e); }
    try { injectHTML(); }       catch(e) { console.warn('[VyomaBot] injectHTML error:', e); }
    try { bindEvents(); }       catch(e) { console.warn('[VyomaBot] bindEvents error:', e); }
    try { setupAutoTrigger(); } catch(e) { console.warn('[VyomaBot] setupAutoTrigger error:', e); }
    try { setupSPAWatcher(); }  catch(e) { console.warn('[VyomaBot] setupSPAWatcher error:', e); }
  }

  /* ═══════════════════════════════════════════════════════════
     SPA URL CHANGE WATCHER
     Detects pushState / replaceState / hashchange navigation
     and resets context if the page section changes.
  ═══════════════════════════════════════════════════════════ */
  var _lastCtxId = null;

  function setupSPAWatcher() {
    function onNav() {
      try {
        var newCtx = getCtx();
        if (_lastCtxId !== null && newCtx.id !== _lastCtxId) {
          /* Page section changed — reset if chat is already open */
          _lastCtxId = newCtx.id;
          if (chatOn) {
            chatOn = false;
            _engDone = false;
            ld = { service: '', timeline: '', name: '', phone: '', email: '' };
            var msgs = document.getElementById('vyb-msgs');
            if (msgs) msgs.innerHTML = '';
            startFunnel();
          }
        }
        _lastCtxId = newCtx.id;
      } catch(e) {}
    }

    /* Patch history API */
    var _push = history.pushState;
    var _replace = history.replaceState;
    history.pushState = function () { _push.apply(history, arguments); onNav(); };
    history.replaceState = function () { _replace.apply(history, arguments); onNav(); };
    window.addEventListener('popstate', onNav);
    window.addEventListener('hashchange', onNav);

    /* Seed initial context id */
    _lastCtxId = getCtx().id;
  }

  /* ═══════════════════════════════════════════════════════════
     STYLES  (unchanged — all prefixed vyb-)
  ═══════════════════════════════════════════════════════════ */
  function injectCSS() {
    if (document.getElementById('vyb-css')) return;
    var el = document.createElement('style');
    el.id = 'vyb-css';
    el.textContent =
      '#vyb-root,#vyb-root *{box-sizing:border-box;margin:0;padding:0}' +
      '#vyb-fab{position:fixed;bottom:28px;right:28px;width:58px;height:58px;border-radius:50%;background:#122d5e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2147483647;transition:transform .2s,background .2s;box-shadow:0 4px 18px rgba(18,45,94,.38);font-family:system-ui,-apple-system,sans-serif}' +
      '#vyb-fab:hover{background:#1e4a9a;transform:scale(1.07)}' +
      '#vyb-fab svg{width:26px;height:26px;fill:#fff;display:block}' +
      '#vyb-fab .ci{display:flex;align-items:center}#vyb-fab .cx{display:none;align-items:center}' +
      '#vyb-fab.open .ci{display:none}#vyb-fab.open .cx{display:flex}' +
      '#vyb-badge{position:absolute;top:-3px;right:-3px;width:20px;height:20px;background:#e53935;border-radius:50%;border:2.5px solid #fff;font-size:11px;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;font-family:system-ui,-apple-system,sans-serif}' +
      '#vyb-tip{position:absolute;right:70px;bottom:50%;transform:translateY(50%);background:#122d5e;color:#fff;font-size:12px;padding:7px 13px;border-radius:8px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s;box-shadow:0 2px 10px rgba(18,45,94,.2);font-family:system-ui,-apple-system,sans-serif}' +
      '#vyb-fab:hover #vyb-tip{opacity:1}' +
      '#vyb-tip:after{content:"";position:absolute;left:100%;top:50%;transform:translateY(-50%);border:6px solid transparent;border-left-color:#122d5e}' +
      '#vyb-popup{position:fixed;bottom:100px;right:28px;width:375px;max-width:calc(100vw - 40px);background:#fff;border-radius:16px;border:1px solid rgba(18,45,94,.13);display:flex;flex-direction:column;z-index:2147483646;overflow:hidden;transform:scale(.88) translateY(24px);transform-origin:bottom right;opacity:0;pointer-events:none;transition:transform .28s cubic-bezier(.34,1.56,.64,1),opacity .2s;box-shadow:0 10px 44px rgba(18,45,94,.18);font-family:system-ui,-apple-system,sans-serif}' +
      '#vyb-popup.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}' +
      '#vyb-hdr{background:#122d5e;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}' +
      '#vyb-av{width:36px;height:36px;border-radius:50%;background:#1e4a9a;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
      '#vyb-av svg{width:18px;height:18px;fill:#fff}' +
      '.h-name{font-size:14px;font-weight:600;color:#fff;line-height:1.3}' +
      '.h-stat{font-size:11px;color:#90b8e8;display:flex;align-items:center;gap:5px;margin-top:3px}' +
      '.h-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;flex-shrink:0;animation:vyb-pulse 2s infinite}' +
      '@keyframes vyb-pulse{0%,100%{opacity:1}50%{opacity:.5}}' +
      '#vyb-ban{background:#e8f0fb;border-bottom:1px solid #c5d9f5;padding:6px 14px;font-size:11px;font-weight:600;color:#1e4a9a;flex-shrink:0}' +
      '#vyb-ban.h{display:none}' +
      '#vyb-prog{background:#1a3a7a;padding:8px 16px;flex-shrink:0;display:flex;align-items:center;gap:10px}' +
      '#vyb-prog.h{display:none}' +
      '#vyb-plbl{font-size:10px;color:#90b8e8;white-space:nowrap;font-weight:600;letter-spacing:.5px}' +
      '.p-track{flex:1;height:4px;background:rgba(255,255,255,.2);border-radius:4px;overflow:hidden}' +
      '#vyb-pfill{height:100%;background:#4ade80;border-radius:4px;transition:width .4s ease}' +
      '#vyb-msgs{overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;max-height:300px;min-height:150px}' +
      '.m-row{display:flex;gap:8px;align-items:flex-end}' +
      '.m-row.u{flex-direction:row-reverse}' +
      '.m-bub{max-width:80%;padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.58}' +
      '.m-bot{background:#f0f4fa;color:#122d5e;border-bottom-left-radius:3px}' +
      '.m-usr{background:#122d5e;color:#fff;border-bottom-right-radius:3px}' +
      '.m-av{width:27px;height:27px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600}' +
      '.b-av{background:#1e4a9a}.b-av svg{width:13px;height:13px;fill:#fff}' +
      '.u-av{background:#dde8f5;color:#122d5e}' +
      '.m-ts{font-size:10px;color:#bbb;margin-top:2px}.m-ts.r{text-align:right}' +
      '.m-trust{background:#fff8e1;color:#7a5800;border:1px solid #f5d86b;max-width:88%;padding:9px 13px;border-radius:14px;font-size:12px;line-height:1.6;border-bottom-left-radius:3px}' +
      '.m-ok{background:#e6f9f0;color:#0a7a45;border:1px solid #a3dfc0;max-width:88%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.6;font-weight:500}' +
      '.m-typ{display:flex;gap:4px;align-items:center;padding:8px 12px}' +
      '.m-typ span{width:6px;height:6px;border-radius:50%;background:#90b8e8;animation:vyb-blink 1.2s infinite}' +
      '.m-typ span:nth-child(2){animation-delay:.2s}.m-typ span:nth-child(3){animation-delay:.4s}' +
      '@keyframes vyb-blink{0%,80%,100%{opacity:.25}40%{opacity:1}}' +
      '#vyb-opts{padding:10px 12px 13px;border-top:1px solid #eef2f8;display:flex;flex-direction:column;gap:5px;flex-shrink:0}' +
      '#vyb-olbl{font-size:10px;color:#bbb;margin-bottom:2px;letter-spacing:.4px;text-transform:uppercase}' +
      '#vyb-ogrid{display:flex;flex-direction:column;gap:4px;max-height:140px;overflow-y:auto}' +
      '.o-btn{text-align:left;background:transparent;border:1px solid #1e4a9a;border-radius:7px;padding:7px 11px;font-size:12px;color:#122d5e;cursor:pointer;transition:background .15s,color .15s;line-height:1.4;width:100%;font-family:inherit}' +
      '.o-btn:hover{background:#122d5e;color:#fff}' +
      '.o-cta{text-align:center;background:#122d5e;border:none;border-radius:8px;padding:9px 14px;font-size:12px;color:#fff;cursor:pointer;font-weight:600;line-height:1.4;transition:background .15s,transform .1s;width:100%;font-family:inherit}' +
      '.o-cta:hover{background:#1e4a9a;transform:translateY(-1px)}' +
      '.o-grn{text-align:center;background:#0a7a45;border:none;border-radius:8px;padding:9px 14px;font-size:12px;color:#fff;cursor:pointer;font-weight:600;line-height:1.4;transition:background .15s,transform .1s;width:100%;font-family:inherit}' +
      '.o-grn:hover{background:#0d9455;transform:translateY(-1px)}' +
      '.o-sec{text-align:center;background:transparent;border:1px solid #90b8e8;border-radius:8px;padding:7px 14px;font-size:12px;color:#1e4a9a;cursor:pointer;transition:background .15s;line-height:1.4;width:100%;font-family:inherit}' +
      '.o-sec:hover{background:#eef4fb}' +
      '#vyb-navrow{display:flex;gap:5px;margin-top:4px}' +
      '.n-btn{background:transparent;border:1px solid #ddd;border-radius:7px;padding:6px 10px;font-size:11px;color:#888;cursor:pointer;flex:1;transition:background .15s;font-family:inherit}' +
      '.n-btn:hover{background:#f5f7ff;color:#122d5e}.n-btn.h{display:none}' +
      '.lf{display:flex;flex-direction:column;gap:7px;padding:4px 0 2px}' +
      '.li{width:100%;padding:8px 11px;border:1px solid #d0ddf0;border-radius:7px;font-size:13px;color:#122d5e;outline:none;transition:border-color .15s;background:#fafcff;font-family:inherit}' +
      '.li:focus{border-color:#1e4a9a;background:#fff}' +
      '.li::placeholder{color:#aab8cc}' +
      '.ls{background:#122d5e;color:#fff;border:none;border-radius:8px;padding:9px;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;margin-top:2px;width:100%;font-family:inherit}' +
      '.ls:hover{background:#1e4a9a}' +
      '.cw{display:flex;flex-direction:column;gap:4px;margin-top:2px}' +
      '.cr{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border:1px solid #d0ddf0;border-radius:7px;background:#fafcff;transition:border-color .2s,background .2s;cursor:pointer}' +
      '.cr:hover{background:#f0f5ff;border-color:#90b8e8}' +
      '.cr.e{border-color:#e53935;background:#fff5f5;box-shadow:0 0 0 2px rgba(229,57,53,.13)}' +
      '.ck{width:15px;height:15px;flex-shrink:0;margin-top:1px;accent-color:#122d5e;cursor:pointer}' +
      '.cl{font-size:12px;color:#122d5e;line-height:1.45;cursor:pointer;user-select:none}' +
      '.ch{font-size:10px;color:#aab8cc;line-height:1.4;padding-left:23px}' +
      '.ce{font-size:11px;color:#c0392b;background:#fff0f0;border:1px solid #f5c6cb;border-radius:6px;padding:5px 9px;display:none}' +
      '.ce.v{display:block}';

    document.head.appendChild(el);
  }

  /* ═══════════════════════════════════════════════════════════
     HTML SCAFFOLD  (unchanged)
  ═══════════════════════════════════════════════════════════ */
  function injectHTML() {
    if (document.getElementById('vyb-root')) return;
    var d = document.createElement('div');
    d.id = 'vyb-root';
    d.innerHTML =
      '<button id="vyb-fab">' +
        '<span id="vyb-tip">Hey! How may we help you?</span>' +
        '<div id="vyb-badge">1</div>' +
        '<span class="ci"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg></span>' +
        '<span class="cx"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>' +
      '</button>' +
      '<div id="vyb-popup">' +
        '<div id="vyb-hdr">' +
          '<div id="vyb-av"><svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/></svg></div>' +
          '<div><div class="h-name">Vyoma Assistant</div><div class="h-stat"><span class="h-dot"></span> Online \u2014 L&T Vyoma</div></div>' +
        '</div>' +
        '<div id="vyb-ban" class="h"></div>' +
        '<div id="vyb-prog" class="h"><span id="vyb-plbl">Step 1 of 4</span><div class="p-track"><div id="vyb-pfill" style="width:25%"></div></div></div>' +
        '<div id="vyb-msgs"></div>' +
        '<div id="vyb-opts">' +
          '<div id="vyb-olbl"></div>' +
          '<div id="vyb-ogrid"></div>' +
          '<div id="vyb-navrow"><button class="n-btn h" id="vyb-bq">\u2190 Back</button><button class="n-btn h" id="vyb-bm">\u2302 Menu</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(d);
  }

  /* ═══════════════════════════════════════════════════════════
     STATIC EVENTS
  ═══════════════════════════════════════════════════════════ */
  function bindEvents() {
    var fab = document.getElementById('vyb-fab');
    if (fab) fab.addEventListener('click', toggleChat);
  }

  /* ═══════════════════════════════════════════════════════════
     ANALYTICS — stubs only (disabled)
  ═══════════════════════════════════════════════════════════ */
  var LL = 'vyoma_leads';
  var _engDone = false;
  function tOpen()  { /* disabled */ }
  function tEng()   { if (_engDone) return; _engDone = true; }
  function tLead()  { /* disabled */ }
  function saveL(l) { try { var a = JSON.parse(localStorage.getItem(LL) || '[]'); a.push(l); localStorage.setItem(LL, JSON.stringify(a)); } catch(e) {} }

  /* ═══════════════════════════════════════════════════════════
     GOOGLE SHEETS
  ═══════════════════════════════════════════════════════════ */
  var GS = 'https://script.google.com/macros/s/AKfycbzG9CZRoEZuXPbToXaQMXTy0mWI89e8LKMC4ZdUjpGuip2ZhS1-r0js4Z9Z6un7aYmB1A/exec';
  function pushSheets(lead) {
    return fetch(GS, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
      .then(function () { return { ok: true }; });
  }

  /* ═══════════════════════════════════════════════════════════
     CHAT CONSTANTS
  ═══════════════════════════════════════════════════════════ */
  var BOT = 'bot', USR = 'user';
  var STEPS = [
    { l: 'Step 1 of 4 \u2014 Intent',   p: 25  },
    { l: 'Step 2 of 4 \u2014 Service',  p: 50  },
    { l: 'Step 3 of 4 \u2014 Timeline', p: 75  },
    { l: 'Step 4 of 4 \u2014 Details',  p: 100 }
  ];
  var WA  = '919912618285';
  var WAM = 'Hi, I am interested in L&T Vyoma services. Please share more details.';
  var chatOn = false, topId = null, faqM = false;
  var ld = { service: '', timeline: '', name: '', phone: '', email: '' };

  /* Full MENU — all categories. getContextualFAQs() filters this per page. */
  var MENU = [
    { l: 'About L&T Vyoma',          id: 'about'   },
    { l: 'Data Centers & Locations',  id: 'dc'      },
    { l: 'Colocation Services',        id: 'colo'   },
    { l: 'Cloud Services',             id: 'cloud'  },
    { l: 'AI & GPU Offerings',         id: 'ai'     },
    { l: 'Managed & IT Services',      id: 'svc'    },
    { l: 'Security',                   id: 'sec'    },
    { l: 'Sustainability',             id: 'sus'    },
    { l: 'Contact & Support',          id: 'contact'}
  ];

  /* ── FAQ data (strict: answers only from this object) ── */
  var FAQ = {
    about: { l: 'About L&T Vyoma', q: [
      { q: 'What is L&T Vyoma?',                   a: 'Larsen & Toubro Vyoma is the Data Center & Cloud Services division of L&T \u2014 one of India\'s largest conglomerates with over 80 years of experience across 50+ countries.' },
      { q: 'What services does L&T Vyoma offer?',  a: 'Data Center Colocation, Public & Private Cloud, Hybrid Cloud, AI-ready Data Centers, GPU as a Service, Managed Services, Network & Security \u2014 all under single-point responsibility.' },
      { q: 'What is L&T Vyoma\'s mission?',        a: 'Build India\'s first sovereign, secure, fully integrated, and green AI-driven cloud and data center platform.' },
      { q: 'Has L&T built government data centers?', a: 'Yes. L&T has built major data centers for both government and private sector organizations in India.' }
    ]},
    dc: { l: 'Data Centers', q: [
      { q: 'Where are the data centers located?',          a: 'West \u2014 Mumbai\nSouth \u2014 Sriperumbudur, Chennai (near NH-48)\n\nNew 40 MW green AI-ready data center under development in Navi Mumbai.' },
      { q: 'What Tier certification do the facilities hold?', a: 'Uptime Institute Tier III certified \u2014 ensuring maximum uptime and high availability.' },
      { q: 'What are the key features?',                   a: '\u2022 Tier III Uptime certification\n\u2022 7-layer physical security, 24\u00d77\u00d7365\n\u2022 Carrier-neutral high-speed connectivity\n\u2022 Multiple power & network redundancies\n\u2022 Energy-efficient, green-certified buildings' },
      { q: 'What is the new Navi Mumbai data center?',     a: '40 MW green, AI-ready data center in Navi Mumbai \u2014 designed for next-generation AI and enterprise workloads.' }
    ]},
    colo: { l: 'Colocation Services', q: [
      { q: 'What colocation options are available?', a: '1. Rack Space \u2014 Full 42U racks with 6 KVA power\n2. Dedicated Cage \u2014 Biometric access\n3. Private Suite \u2014 100s to 1000s sq ft\n4. Built-to-Suite \u2014 Fully customized' },
      { q: 'What physical security is in place?',    a: '7-layer security: boom barriers, road blockers, perimeter wall, biometric access, 24\u00d77\u00d7365 trained guards, and CCTV.' },
      { q: 'Can I scale up my space later?',         a: 'Yes. Add more racks at any time without disruption. Metered and unmetered power options available.' },
      { q: 'Who is a Private Suite suitable for?',  a: 'Enterprises, hosting providers, private cloud providers, and telecom carriers needing a fully isolated, secured space.' }
    ]},
    cloud: { l: 'Cloud Services', q: [
      { q: 'What cloud models does L&T Vyoma support?', a: '\u2022 Public Cloud\n\u2022 Private Sovereign Cloud \u2014 Dedicated, India-hosted\n\u2022 Hybrid Cloud\n\nLayers: IaaS, PaaS, SaaS.' },
      { q: 'What is the Private Sovereign Cloud?',       a: 'Dedicated cloud within India \u2014 data never leaves Indian borders. Critical for banking, healthcare, and government.' },
      { q: 'Does L&T Vyoma support hybrid cloud?',      a: 'Yes. Hybrid Cloud Management integrates on-premises, private, and public cloud under unified management.' },
      { q: 'What cloud migration support is available?', a: 'End-to-end: assessment, planning, workload migration, integration, and post-migration monitoring.' }
    ]},
    ai: { l: 'AI & GPU Offerings', q: [
      { q: 'What is the SPD1 AI-Ready Data Center?',    a: 'SPD1 in Sriperumbudur, Chennai:\n\u2022 12.5 kW to 80 kW per rack\n\u2022 Cooling: DLC, Liquid Immersion, In-Row & RDHX\n\u2022 30 MW expandable to 60 MW\n\u2022 IGBC Platinum Green Building certified' },
      { q: 'What is GPU as a Service (GPUaaS)?',        a: 'On-demand NVIDIA H100 GPUs \u2014 no upfront investment. AI/ML training, analytics, HPC, rendering.' },
      { q: 'What is the full AI portfolio?',            a: '\u2022 SPD1 AI-Ready Data Center\n\u2022 GPU as a Service \u2014 NVIDIA H100\n\u2022 AI-Based Training\n\u2022 GPU Accelerated HPCaaS' },
      { q: 'Is GPUaaS suitable for smaller businesses?', a: 'Yes. Pay-as-you-go makes enterprise GPU accessible to startups and SMBs.' }
    ]},
    svc: { l: 'Managed & IT Services', q: [
      { q: 'What managed services are offered?',         a: '\u2022 Managed Network\n\u2022 Managed OS\n\u2022 Managed Database\n\u2022 Managed Storage\n\nAll 24\u00d77\u00d7365 by certified professionals.' },
      { q: 'What professional services are available?',  a: 'Data center design, cloud architecture, application integration, workload optimization.' },
      { q: 'What is the 24\u00d77 support model?',      a: 'On-site 24\u00d77\u00d7365 SLA-driven support with dedicated helpdesk, smart-hands, and proactive monitoring.' },
      { q: 'What network services are provided?',        a: 'End-to-end SLA-backed management. Carrier-neutral with multiple Telco providers.' }
    ]},
    sec: { l: 'Security', q: [
      { q: 'How is physical security managed?',            a: '7-layer system: boom barriers, road blockers, perimeter wall, biometric access, 24\u00d77\u00d7365 guards, CCTV.' },
      { q: 'What cybersecurity services are provided?',    a: 'Network security monitoring, threat detection, firewall management, compliance frameworks.' },
      { q: 'Is customer data compliant and confidential?', a: 'Yes. Private Sovereign Cloud keeps data in India. All facilities follow ISO-certified policies.' }
    ]},
    sus: { l: 'Sustainability', q: [
      { q: 'What are the sustainability targets?',        a: '\u2022 Carbon Neutrality by 2040\n\u2022 Water Neutrality by 2035\n\nBacked by renewable energy, water conservation, and green building certifications.' },
      { q: 'What green energy initiatives are in place?', a: '\u2022 Solar power up to 243 kW (SPD1)\n\u2022 Roadmap to 50% renewable energy\n\u2022 IGBC Platinum Green Building\n\u2022 L&T: Asia Top 5 Most Sustainable Companies' },
      { q: 'How is water consumption managed?',           a: 'Net Zero Water System: recharging pits, efficient plumbing, wastewater treatment and reuse.' }
    ]},
    contact: { l: 'Contact & Support', q: [
      { q: 'How can I contact L&T Vyoma?',    a: 'Email: marketing.dccs@larsentoubro.com\nWeb: larsentoubrovyoma.com/contact-us\nAddress: A.M. Naik Tower, L&T Campus, Powai, Mumbai\u2014400072' },
      { q: 'Are there career opportunities?', a: 'Yes! Hiring across data center ops, cloud engineering, sales, cybersecurity, AI/GPU.' },
      { q: 'Where can I find whitepapers?',   a: 'Visit larsentoubrovyoma.com/whitepapers, /case-study, and /blog.' }
    ]}
  };

  /* ── Recommendation copy (unchanged) ── */
  function getRec(svc, tl) {
    var m = {
      colocation: 'Our **Colocation Services** in Mumbai or Chennai \u2014 Tier III certified, 7-layer security, scalable power.',
      cloud:      'Our **Private Sovereign Cloud** or **Hybrid Cloud** \u2014 data stays in India with full compliance.',
      ai:         'Our **SPD1 AI-Ready Data Center** (30\u201360 MW, NVIDIA H100 GPUaaS) with advanced liquid cooling.',
      managed:    'Our **Managed Services** (Network, OS, DB, Storage) \u2014 24\u00d77\u00d7365 by certified L&T professionals.',
      explore:    'We have the right solution for you. Let our team guide you to the perfect fit.'
    };
    var u = tl === 'immediate' ? ' We can fast-track evaluation for your immediate timeline.' : tl === '3months' ? ' With a 3-month horizon, we can design the ideal solution.' : '';
    return (m[svc] || m.explore) + u;
  }

  /* ═══════════════════════════════════════════════════════════
     MESSAGE HELPERS  (unchanged)
  ═══════════════════════════════════════════════════════════ */
  var AVT = '<svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:#fff"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/></svg>';

  function nt()   { var n = new Date(); return ('0' + n.getHours()).slice(-2) + ':' + ('0' + n.getMinutes()).slice(-2); }
  function esc(t) { return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function fmt(t) { return esc(t).replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>'); }
  function wait(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }
  function scrl()   { try { var m = document.getElementById('vyb-msgs'); if (m) m.scrollTop = m.scrollHeight; } catch(e) {} }

  function push(html) {
    try {
      var m = document.getElementById('vyb-msgs');
      if (!m) return;
      m.insertAdjacentHTML('beforeend', html);
      scrl();
    } catch(e) { console.warn('[VyomaBot] push error:', e); }
  }

  function addMessage(role, text) { addMsg(role, text); }
  window.vyomaAddMessage = addMessage;

  function addMsg(role, text) {
    try {
      var b = role === BOT;
      push(
        '<div class="m-row' + (b ? '' : ' u') + '">' +
          (b ? '<div class="m-av b-av">' + AVT + '</div>' : '<div class="m-av u-av">Me</div>') +
          '<div><div class="m-bub ' + (b ? 'm-bot' : 'm-usr') + '">' + fmt(text) + '</div>' +
          '<div class="m-ts' + (b ? '' : ' r') + '">' + nt() + '</div></div>' +
        '</div>'
      );
    } catch(e) { console.warn('[VyomaBot] addMsg error:', e); }
  }

  function addTrust(html) {
    try { push('<div class="m-row"><div class="m-av b-av">' + AVT + '</div><div><div class="m-trust">' + html + '</div><div class="m-ts">' + nt() + '</div></div></div>'); } catch(e) {}
  }

  function addOK(html) {
    try { push('<div class="m-row"><div class="m-av b-av">' + AVT + '</div><div><div class="m-ok">' + html + '</div><div class="m-ts">' + nt() + '</div></div></div>'); } catch(e) {}
  }

  function showTyp() {
    try { push('<div class="m-row" id="vyb-typ"><div class="m-av b-av">' + AVT + '</div><div class="m-typ"><span></span><span></span><span></span></div></div>'); } catch(e) {}
  }

  function rmTyp() {
    try { var t = document.getElementById('vyb-typ'); if (t) t.remove(); } catch(e) {}
  }

  /* ═══════════════════════════════════════════════════════════
     UI HELPERS  (unchanged)
  ═══════════════════════════════════════════════════════════ */
  function setProg(i) {
    try {
      var bar = document.getElementById('vyb-prog');
      if (!bar) return;
      if (i === null) { bar.classList.add('h'); return; }
      if (!STEPS[i]) return;
      bar.classList.remove('h');
      document.getElementById('vyb-plbl').textContent = STEPS[i].l;
      document.getElementById('vyb-pfill').style.width = STEPS[i].p + '%';
    } catch(e) {}
  }

  function setNav(q, m) {
    try {
      var bq = document.getElementById('vyb-bq'), bm = document.getElementById('vyb-bm');
      if (bq) q ? bq.classList.remove('h') : bq.classList.add('h');
      if (bm) m ? bm.classList.remove('h') : bm.classList.add('h');
    } catch(e) {}
  }

  function renderOpts(opts, lbl, back) {
    try {
      var olbl = document.getElementById('vyb-olbl');
      if (olbl) olbl.textContent = lbl || '';
      var g = document.getElementById('vyb-ogrid');
      if (!g) return;
      g.innerHTML = '';
      opts.forEach(function (o) {
        var b = document.createElement('button');
        b.className = o.v === 'cta' ? 'o-cta' : o.v === 'grn' ? 'o-grn' : o.v === 'sec' ? 'o-sec' : 'o-btn';
        b.textContent = o.l;
        b.addEventListener('click', function () { try { tEng(); o.fn(); } catch(e) { console.warn('[VyomaBot] opt click error:', e); } });
        g.appendChild(b);
      });
      setNav(false, !!back);
    } catch(e) { console.warn('[VyomaBot] renderOpts error:', e); }
  }

  /* ═══════════════════════════════════════════════════════════
     LEAD FORM  (unchanged)
  ═══════════════════════════════════════════════════════════ */
  function showLeadForm() {
    try {
      var olbl = document.getElementById('vyb-olbl');
      if (olbl) olbl.textContent = 'Step 4 of 4 \u2014 Your details';
      setNav(false, false);
      var g = document.getElementById('vyb-ogrid');
      if (!g) return;
      g.innerHTML =
        '<div class="lf">' +
          '<input class="li" id="lf-n" type="text"  placeholder="Your name *">' +
          '<input class="li" id="lf-p" type="tel"   placeholder="Phone number *">' +
          '<input class="li" id="lf-e" type="email" placeholder="Email address (optional)">' +
          '<div class="cw">' +
            '<label class="cr" id="lf-cr"><input type="checkbox" class="ck" id="lf-ck"><span class="cl">I agree to share my details and be contacted by L&amp;T Vyoma. \uD83D\uDD12</span></label>' +
            '<span class="ch">Your data is \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 (secure) and will not be shared with third parties.</span>' +
            '<div class="ce" id="lf-ce">\u26A0\uFE0F Please provide consent to proceed.</div>' +
          '</div>' +
          '<button class="ls" id="lf-s">\uD83D\uDE80 Get Best Price in 24 Hours</button>' +
        '</div>';
      var ck = document.getElementById('lf-ck');
      if (ck) ck.addEventListener('change', function () {
        try { document.getElementById('lf-cr').classList.remove('e'); document.getElementById('lf-ce').classList.remove('v'); } catch(e) {}
      });
      var sb = document.getElementById('lf-s');
      if (sb) sb.addEventListener('click', doSub);
    } catch(e) { console.warn('[VyomaBot] showLeadForm error:', e); }
  }

  function hl(id) {
    try { var e = document.getElementById(id); if (!e) return; e.style.borderColor = '#e53935'; e.focus(); setTimeout(function () { e.style.borderColor = ''; }, 2000); } catch(e) {}
  }

  function doSub() {
    try {
      var name = (document.getElementById('lf-n').value || '').trim();
      var ph   = (document.getElementById('lf-p').value || '').trim();
      var em   = (document.getElementById('lf-e').value || '').trim();
      if (!name) { hl('lf-n'); return; }
      if (!ph)   { hl('lf-p'); return; }
      if (!document.getElementById('lf-ck').checked) {
        document.getElementById('lf-cr').classList.add('e');
        var ce = document.getElementById('lf-ce'); ce.classList.add('v'); ce.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return;
      }
      var payload = { name: name, phone: ph, email: em, service: ld.service || 'Not specified', timeline: ld.timeline || 'Not specified', consent: true, timestamp: new Date().toISOString(), sessionId: Date.now(), pageUrl: window.location.href };
      var btn = document.getElementById('lf-s');
      btn.disabled = true; btn.textContent = '\u23F3 Sending\u2026'; btn.style.opacity = '.7';
      pushSheets(payload)
        .then(function () {
          saveL(payload); tLead();
          addMsg(USR, name + ' | ' + ph + (em ? ' | ' + em : ''));
          var og = document.getElementById('vyb-ogrid'); if (og) og.innerHTML = '';
          var ol = document.getElementById('vyb-olbl'); if (ol) ol.textContent = '';
          setProg(null); showTyp(); return wait(1200);
        })
        .then(function () {
          rmTyp();
          addOK('\u2705 Thank you, <strong>' + esc(name) + '</strong>! Details received.<br>Our team will contact you at <strong>' + esc(ph) + '</strong> within 24 hours.' + (em ? '<br>Confirmation to <strong>' + esc(em) + '</strong>.' : ''));
          return wait(500);
        })
        .then(function () { showTyp(); return wait(900); })
        .then(function () {
          rmTyp(); addMsg(BOT, 'Is there anything else I can help you with?');
          renderOpts([
            { l: '\uD83D\uDCCB Browse FAQs',            v: 'sec', fn: startFaq },
            { l: '\uD83D\uDCDE Connect with L&T Expert', v: 'cta', fn: showExp },
            { l: '\uD83D\uDD04 Start Over',              v: 'sec', fn: restart }
          ], '');
        })
        .catch(function (err) {
          console.warn('[VyomaBot]', err);
          btn.disabled = false; btn.textContent = '\uD83D\uDE80 Get Best Price in 24 Hours'; btn.style.opacity = '1';
          var ed = document.createElement('div');
          ed.style.cssText = 'color:#c0392b;font-size:11px;margin-top:6px;text-align:center;padding:6px 8px;background:#fff0f0;border-radius:6px;border:1px solid #f5c6cb';
          ed.textContent = '\u26A0\uFE0F Submission failed. Please try again.';
          var og2 = document.getElementById('vyb-ogrid'); if (og2) og2.appendChild(ed);
        });
    } catch(e) { console.warn('[VyomaBot] doSub error:', e); }
  }

  /* ═══════════════════════════════════════════════════════════
     FUNNEL  — context-aware buttons and welcome message
  ═══════════════════════════════════════════════════════════ */
  function startFunnel() {
    try {
      faqM = false; setProg(0);
      var ctx = getCtx();
      var ban = document.getElementById('vyb-ban');
      if (ban) {
        if (ctx.tag) { ban.textContent = '\uD83D\uDCCD Viewing: ' + ctx.tag; ban.classList.remove('h'); }
        else          { ban.classList.add('h'); }
      }
      showTyp();
      wait(900)
        .then(function () { rmTyp(); addMsg(BOT, ctx.welcome); return wait(400); })
        .then(function () { showTyp(); return wait(800); })
        .then(function () {
          rmTyp();
          addMsg(BOT, ctx.msg);
          /* ── Context-aware primary buttons ── */
          var exploreLabel = ctx.explore ? ctx.explore.label : '\uD83C\uDFE2 Explore Services';
          var exploreSvc   = ctx.explore ? ctx.explore.svc   : 'explore';
          var priceLabel   = ctx.price   ? ctx.price.label   : '\uD83D\uDE80 Get Best Price in 24 Hours';
          var expertLabel  = ctx.expert  ? ctx.expert.label  : '\uD83D\uDCDE Connect with L&T Expert';
          renderOpts([
            { l: exploreLabel, v: 'cta', fn: function () { selI('explore', exploreSvc); } },
            { l: priceLabel,   v: 'grn', fn: function () { selI('quote');               } },
            { l: expertLabel,  v: 'cta', fn: function () { selI('expert');              } },
            { l: '\uD83D\uDCCB Browse FAQs', v: 'sec', fn: startFaq }
          ], 'What brings you here today?');
        });
    } catch(e) { console.warn('[VyomaBot] startFunnel error:', e); }
  }

  /* ── Intent selection ── */
  function selI(intent, preselectedSvc) {
    try {
      if (intent === 'quote') {
        addMsg(USR, 'Get Best Price in 24 Hours'); setProg(3); showTyp();
        wait(800)
          .then(function () { rmTyp(); addTrust('\uD83D\uDD12 Your details are <strong>secure</strong> and will only be used to contact you.'); return wait(300); })
          .then(function () { addMsg(BOT, 'Please share your details \u2014 our team will respond within **24 hours**. \uD83D\uDE80'); showLeadForm(); });
        return;
      }
      if (intent === 'expert') {
        addMsg(USR, 'Connect with L&T Expert'); setProg(3); showTyp();
        wait(800)
          .then(function () { rmTyp(); addTrust('\uD83D\uDD12 Your details will only be used to connect you with our expert team.'); return wait(300); })
          .then(function () { addMsg(BOT, 'Our experts are ready! Share your details and we\'ll get back within a business day. \uD83D\uDCDE'); showLeadForm(); });
        return;
      }
      /* explore — if page context already implies a service, skip the picker */
      if (preselectedSvc && preselectedSvc !== 'explore') {
        addMsg(USR, 'Exploring ' + preselectedSvc + ' services'); setProg(1); showTyp();
        wait(800).then(function () { rmTyp(); selS(preselectedSvc); });
        return;
      }
      addMsg(USR, 'Explore Services'); setProg(1); showTyp();
      wait(800).then(function () {
        rmTyp(); addMsg(BOT, 'Great choice! Which service area interests you most?');
        renderOpts([
          { l: '\uD83D\uDDA5\uFE0F Data Center Colocation', fn: function () { selS('colocation'); } },
          { l: '\u2601\uFE0F Cloud Services',                fn: function () { selS('cloud');      } },
          { l: '\uD83E\uDD16 AI & GPU Computing',            fn: function () { selS('ai');         } },
          { l: '\u2699\uFE0F Managed & IT Services',         fn: function () { selS('managed');    } },
          { l: '\uD83D\uDD0D Not sure \u2014 help me decide', v: 'sec', fn: function () { selS('explore'); } }
        ], 'Step 2 \u2014 Select your area of interest:');
      });
    } catch(e) { console.warn('[VyomaBot] selI error:', e); }
  }

  function selS(svc) {
    try {
      ld.service = svc;
      var lbl = { colocation: 'Data Center Colocation', cloud: 'Cloud Services', ai: 'AI & GPU Computing', managed: 'Managed & IT Services', explore: 'Not sure \u2014 help me decide' };
      addMsg(USR, lbl[svc] || svc); setProg(2); showTyp();
      wait(800).then(function () {
        rmTyp(); addMsg(BOT, 'Perfect. What is your expected timeline?');
        renderOpts([
          { l: '\u26A1 Immediately (within 1 month)',       fn: function () { selT('immediate'); } },
          { l: '\uD83D\uDCC5 In 3\u20136 months',           fn: function () { selT('3months');   } },
          { l: '\uD83D\uDDD3\uFE0F Planning for next year', fn: function () { selT('nextyear');  } },
          { l: '\uD83D\uDD0E Just exploring', v: 'sec',     fn: function () { selT('exploring'); } }
        ], 'Step 3 \u2014 Your timeline:');
      });
    } catch(e) { console.warn('[VyomaBot] selS error:', e); }
  }

  function selT(tl) {
    try {
      ld.timeline = tl;
      var lbl = { immediate: 'Immediately (within 1 month)', '3months': 'In 3\u20136 months', nextyear: 'Planning for next year', exploring: 'Just exploring' };
      addMsg(USR, lbl[tl] || tl); setProg(null); showTyp();
      wait(1100)
        .then(function () { rmTyp(); addMsg(BOT, '\u2728 Based on your inputs, here\'s our recommendation:\n\n' + getRec(ld.service, tl)); return wait(400); })
        .then(function () { showTyp(); return wait(900); })
        .then(function () {
          rmTyp(); addMsg(BOT, 'Would you like to receive the **best tailored quote** directly? \uD83D\uDCF2');
          renderOpts([
            { l: '\uD83D\uDCF1 Get Best Price on WhatsApp', v: 'grn', fn: openWA   },
            { l: '\uD83D\uDE80 Get Best Price in 24 Hours',  v: 'cta', fn: goLead   },
            { l: '\uD83D\uDCCB Browse FAQs first',           v: 'sec', fn: startFaq }
          ], 'Choose your preferred channel:');
        });
    } catch(e) { console.warn('[VyomaBot] selT error:', e); }
  }

  function openWA() {
    try { window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(WAM + (ld.service ? ' \u2014 interested in ' + ld.service + '.' : '')), '_blank'); goLead(); } catch(e) {}
  }

  function goLead() {
    try {
      setProg(3); showTyp();
      wait(800)
        .then(function () { rmTyp(); addTrust('\uD83D\uDD12 Your details are <strong>secure</strong> and will only be used to contact you.'); return wait(300); })
        .then(function () { addMsg(BOT, 'Please share your details \u2014 our team will respond within **24 hours**. \uD83D\uDE80'); showLeadForm(); });
    } catch(e) {}
  }

  function showExp() {
    try {
      addMsg(USR, 'Connect with L&T Expert'); showTyp();
      wait(800)
        .then(function () { rmTyp(); addTrust('\uD83D\uDD12 Your details will only be used to connect you with our expert team.'); return wait(300); })
        .then(function () { addMsg(BOT, 'Our expert team is ready! Share your details and we\'ll arrange a call at your convenience. \uD83D\uDCDE'); setProg(3); showLeadForm(); });
    } catch(e) {}
  }

  /* ═══════════════════════════════════════════════════════════
     FAQ — context-filtered menu
  ═══════════════════════════════════════════════════════════ */
  function startFaq() {
    try {
      faqM = true; setProg(null); addMsg(USR, 'Browse FAQs'); showTyp();
      wait(700).then(function () { rmTyp(); addMsg(BOT, 'Sure! Select a topic below. \uD83D\uDCDA'); showFaqMenu(); });
    } catch(e) {}
  }

  function showFaqMenu() {
    try {
      var ctx = getCtx();
      var items = getContextualFAQs(ctx);
      renderOpts(
        items.map(function (m) { return { l: m.l, fn: function () { selTopic(m.id); } }; }),
        'FAQ topics \u2014 tap to explore:', false
      );
      setNav(false, true);
      var bm = document.getElementById('vyb-bm');
      if (bm) { bm.textContent = '\u2190 Back to Guide'; bm.onclick = restart; bm.classList.remove('h'); }
    } catch(e) {}
  }

  function selTopic(id) {
    try {
      topId = id;
      var t = FAQ[id];
      if (!t) {
        addMsg(BOT, 'I\'ll connect you with an L&T Vyoma expert for accurate details.');
        return;
      }
      addMsg(USR, t.l); showTyp();
      wait(700).then(function () { rmTyp(); addMsg(BOT, 'Here are common questions about ' + t.l + ':'); showFaqQs(id); });
    } catch(e) {}
  }

  function showFaqQs(id) {
    try {
      topId = id;
      var t = FAQ[id];
      if (!t) return;
      renderOpts(t.q.map(function (q) { return { l: q.q, fn: function () { ansQ(q.q, q.a, id); } }; }), 'Select a question:', false);
      setNav(false, true);
      var bm = document.getElementById('vyb-bm');
      if (bm) { bm.textContent = '\u2190 FAQ Topics'; bm.onclick = showFaqMenu; bm.classList.remove('h'); }
    } catch(e) {}
  }

  function ansQ(q, a, id) {
    try {
      addMsg(USR, q); showTyp();
      wait(900).then(function () {
        rmTyp();
        /* Strict rule: answer must come from FAQ data only */
        if (!a || !a.trim()) {
          addMsg(BOT, 'I\'ll connect you with an L&T Vyoma expert for accurate details.');
        } else {
          addMsg(BOT, a);
        }
        var t = FAQ[id];
        var rem = t ? t.q.filter(function (x) { return x.q !== q; }).map(function (x) { return { l: x.q, fn: function () { ansQ(x.q, x.a, id); } }; }) : [];
        rem.push({ l: '\uD83D\uDE80 Get Best Price in 24 Hours', v: 'grn', fn: restart });
        renderOpts(rem, 'More questions:', false); setNav(true, true);
        var bq = document.getElementById('vyb-bq'), bm = document.getElementById('vyb-bm');
        if (bq) { bq.onclick = function () { showFaqQs(id); }; bq.classList.remove('h'); }
        if (bm) { bm.textContent = '\u2190 FAQ Topics'; bm.onclick = showFaqMenu; bm.classList.remove('h'); }
      });
    } catch(e) {}
  }

  function restart() {
    try {
      ld = { service: '', timeline: '', name: '', phone: '', email: '' };
      faqM = false; _engDone = false;
      var msgs = document.getElementById('vyb-msgs'); if (msgs) msgs.innerHTML = '';
      startFunnel();
    } catch(e) {}
  }

  /* ═══════════════════════════════════════════════════════════
     TOGGLE CHAT
  ═══════════════════════════════════════════════════════════ */
  function toggleChat() {
    try {
      var fab   = document.getElementById('vyb-fab');
      var pop   = document.getElementById('vyb-popup');
      var badge = document.getElementById('vyb-badge');
      if (!fab || !pop) return;
      var isOpen = pop.classList.contains('open');
      if (isOpen) {
        pop.classList.remove('open');
        fab.classList.remove('open');
      } else {
        pop.classList.add('open');
        fab.classList.add('open');
        if (badge) badge.remove();
        tOpen();
        if (!chatOn) {
          chatOn = true;
          setTimeout(function () {
            try { addMessage('bot', 'Hi \uD83D\uDC4B I\'m Vyoma Assistant. How can I help you today?'); } catch(e) {}
          }, 500);
          startFunnel();
        }
        setTimeout(scrl, 300);
      }
    } catch(e) { console.warn('[VyomaBot] toggleChat error:', e); }
  }

  function openChat() {
    try { if (!document.getElementById('vyb-popup').classList.contains('open')) toggleChat(); } catch(e) {}
  }

  window.vyomaOpenChat   = openChat;
  window.vyomaToggleChat = toggleChat;

  /* ═══════════════════════════════════════════════════════════
     AUTO-TRIGGER  — 5 s of active tab time, once per session
  ═══════════════════════════════════════════════════════════ */
  function setupAutoTrigger() {
    try {
      var KEY = 'vyoma_triggered';
      if (sessionStorage.getItem(KEY)) return;
      var timer = null;
      function arm() {
        if (timer !== null) return;
        timer = setTimeout(function () {
          try { if (!sessionStorage.getItem(KEY)) { sessionStorage.setItem(KEY, '1'); openChat(); } } catch(e) {}
        }, 5000);
      }
      function disarm() { if (timer !== null) { clearTimeout(timer); timer = null; } }
      if (document.visibilityState === 'visible') arm();
      document.addEventListener('visibilitychange', function () {
        document.visibilityState === 'visible' ? arm() : disarm();
      });
    } catch(e) { console.warn('[VyomaBot] setupAutoTrigger error:', e); }
  }

})();
