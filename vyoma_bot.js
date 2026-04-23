/**
 * vyoma_bot_full.js
 * L&T Vyoma Chatbot — Full Self-Contained Injection Script
 * Injects HTML, CSS, and all logic dynamically into any website.
 * Usage: <script src="vyoma_bot_full.js"></script>
 *        or paste into browser console / bookmarklet
 */
(function () {
  'use strict';

  /* ── Duplicate-injection guard ── */
  if (window.__vyomaLoaded) return;
  window.__vyomaLoaded = true;

  /* ── Wait for DOM, then boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ════════════════════════════════════════════════════════════
     EXTERNAL SCRIPT LOADER
  ════════════════════════════════════════════════════════════ */
  function loadScript(src, id, cb) {
    if (document.getElementById(id)) { if (cb) cb(); return; }
    var s = document.createElement('script');
    s.id  = id;
    s.src = src;
    s.onload  = function () { if (cb) cb(); };
    s.onerror = function () { console.warn('[VyomaBot] Failed to load script: ' + src); if (cb) cb(); };
    document.head.appendChild(s);
  }

  /* ════════════════════════════════════════════════════════════
     PAGE-CONTEXT DETECTION
  ════════════════════════════════════════════════════════════ */
  var CTX_RULES = [
    {
      keys: ['colocation', 'colo'],
      id: 'colo',
      msg: 'Looking for colocation services? I can help you find the right rack or suite.',
      welcome: 'Welcome to **L&T Vyoma Colocation** — Tier III certified, 7-layer security, Mumbai & Chennai. 👋\n\nI\'m Vyoma Assistant. Let me help you find the right colocation or cage solution!',
      tag: '🏢 Colocation Services',
      faqIds: ['colo', 'dc', 'sec'],
      explore: { label: '🖥️ Explore Colocation', svc: 'colocation' },
      price:   { label: '💰 Get Infra Pricing' },
      expert:  { label: '📞 Talk to Infra Expert' }
    },
    {
      keys: ['data-center', 'data-centre', 'datacenter', 'datacentre', 'infrastructure', 'infra'],
      id: 'dc',
      msg: 'Need help with data center infrastructure or pricing?',
      welcome: 'Welcome to **L&T Vyoma Data Centers** — Tier III certified facilities in Mumbai & Chennai. 👋\n\nI\'m Vyoma Assistant. Let me help you find the right colocation or infrastructure solution!',
      tag: '🏢 Data Center',
      faqIds: ['dc', 'colo', 'sec'],
      explore: { label: '🏢 Explore Data Centers', svc: 'colocation' },
      price:   { label: '💰 Get Infra Pricing' },
      expert:  { label: '📞 Talk to Infra Expert' }
    },
    {
      keys: ['cloud'],
      id: 'cloud',
      msg: 'Looking for cloud solutions? I can help you choose the right option.',
      welcome: 'Welcome to **L&T Vyoma Cloud** — India\'s sovereign cloud platform. 👋\n\nI\'m Vyoma Assistant. Let me help you explore our Public, Private, or Hybrid Cloud solutions!',
      tag: '☁️ Cloud Services',
      faqIds: ['cloud'],
      explore: { label: '☁️ Explore Cloud Solutions', svc: 'cloud' },
      price:   { label: '💰 Get Cloud Pricing' },
      expert:  { label: '📞 Talk to Cloud Expert' }
    },
    {
      keys: ['ai', 'gpu', 'artificial-intelligence', 'machine-learning', 'ml'],
      id: 'ai',
      msg: 'Interested in AI & GPU solutions? Let me guide you.',
      welcome: 'Welcome to **L&T Vyoma AI & GPU** — purpose-built infrastructure for AI/ML workloads. 👋\n\nI\'m Vyoma Assistant. Explore our SPD1 AI-Ready Data Center and NVIDIA H100 GPUaaS!',
      tag: '🤖 AI & GPU',
      faqIds: ['ai'],
      explore: { label: '🤖 Explore AI Solutions', svc: 'ai' },
      price:   { label: '💰 Get GPU Pricing' },
      expert:  { label: '📞 Talk to AI Expert' }
    },
    {
      keys: ['managed', 'managed-services', 'it-services'],
      id: 'svc',
      msg: 'Looking for managed IT services? I can help you find the right plan.',
      welcome: 'Welcome to **L&T Vyoma Managed Services** — 24×7×365 certified IT and infrastructure management. 👋\n\nI\'m Vyoma Assistant. Let me help you explore our managed network, OS, DB, and storage solutions!',
      tag: '⚙️ Managed Services',
      faqIds: ['svc', 'sec'],
      explore: { label: '⚙️ Explore Managed Services', svc: 'managed' },
      price:   { label: '💰 Get Services Pricing' },
      expert:  { label: '📞 Talk to IT Expert' }
    },
    {
      keys: ['network', 'network-services', 'networking'],
      id: 'network',
      msg: 'Exploring network services? I can guide you through our managed network solutions.',
      welcome: 'Welcome to **L&T Vyoma Network Services** — SLA-backed, carrier-neutral managed networking. 👋\n\nI\'m Vyoma Assistant. Let me guide you through our managed network solutions!',
      tag: '🌐 Network Services',
      faqIds: ['svc', 'sec'],
      explore: { label: '🌐 Explore Network Services', svc: 'managed' },
      price:   { label: '💰 Get Network Pricing' },
      expert:  { label: '📞 Talk to Network Expert' }
    },
    {
      keys: ['security', 'cyber', 'cybersecurity'],
      id: 'sec',
      msg: 'Looking for security solutions? I can help you understand our security offerings.',
      welcome: 'Welcome to **L&T Vyoma Security** — 7-layer physical security and enterprise cybersecurity. 👋\n\nI\'m Vyoma Assistant. Let me walk you through our physical and cyber security capabilities!',
      tag: '🔒 Security',
      faqIds: ['sec', 'dc'],
      explore: { label: '🔒 Explore Security Solutions', svc: 'managed' },
      price:   { label: '💰 Get Security Pricing' },
      expert:  { label: '📞 Talk to Security Expert' }
    },
    {
      keys: ['sustainability', 'green', 'esg'],
      id: 'sus',
      msg: 'Interested in our sustainability initiatives? Let me tell you about our green goals.',
      welcome: 'Welcome to **L&T Vyoma Sustainability** — committed to Carbon Neutrality by 2040 and Water Neutrality by 2035. 👋\n\nI\'m Vyoma Assistant. Let me share our green energy and sustainability roadmap!',
      tag: '🌿 Sustainability',
      faqIds: ['sus'],
      explore: { label: '🌿 Explore Sustainability', svc: 'explore' },
      price:   { label: '💰 Get Pricing' },
      expert:  { label: '📞 Talk to an Expert' }
    },
    {
      keys: ['about', 'about-us', 'company', 'overview'],
      id: 'about',
      msg: 'Want to know more about L&T Vyoma? I can help you explore our story and services.',
      welcome: 'Welcome to **L&T Vyoma** — the Data Center & Cloud Services division of L&T, India\'s most trusted conglomerate. 👋\n\nI\'m Vyoma Assistant. Let me tell you what makes us India\'s preferred enterprise infrastructure partner!',
      tag: '🏢 About L&T Vyoma',
      faqIds: ['about', 'dc', 'cloud', 'ai'],
      explore: { label: '🏢 Explore Our Services', svc: 'explore' },
      price:   { label: '💰 Get Pricing' },
      expert:  { label: '📞 Talk to an Expert' }
    },
    {
      keys: ['contact', 'contact-us', 'support', 'help', 'reach'],
      id: 'contact',
      msg: 'Need to get in touch with us? I can connect you with the right team.',
      welcome: 'Welcome to **L&T Vyoma Contact & Support**. 👋\n\nI\'m Vyoma Assistant. I can connect you with our experts or help you find the information you need right now!',
      tag: '📞 Contact & Support',
      faqIds: ['contact', 'about'],
      explore: { label: '📋 Browse Our Services', svc: 'explore' },
      price:   { label: '💰 Request a Quote' },
      expert:  { label: '📞 Connect with Support' }
    }
  ];

  var DEFAULT_CTX = {
    id: 'home',
    msg: 'Hi! Need help navigating L&T Vyoma services?',
    welcome: 'Welcome to **L&T Vyoma** — India\'s trusted enterprise data center and cloud provider. 👋\n\nI\'m Vyoma Assistant. Let me help you find the perfect solution for your business!',
    tag: null,
    faqIds: null,
    explore: { label: '🏢 Explore Data Center Services', svc: 'explore' },
    price:   { label: '🚀 Get Best Price in 24 Hours' },
    expert:  { label: '📞 Connect with L&T Expert' }
  };

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

  function getContextualFAQs(ctx) {
    if (!ctx.faqIds) return MENU.slice();
    return MENU.filter(function (m) { return ctx.faqIds.indexOf(m.id) !== -1; });
  }

  /* ════════════════════════════════════════════════════════════
     SPA URL CHANGE WATCHER
  ════════════════════════════════════════════════════════════ */
  var _lastCtxId = null;

  function setupSPAWatcher() {
    function onNav() {
      try {
        var newCtx = getCtx();
        if (_lastCtxId !== null && newCtx.id !== _lastCtxId) {
          _lastCtxId = newCtx.id;
          if (chatOn) {
            chatOn = false; _engDone = false;
            ld = { service: '', timeline: '', name: '', phone: '', email: '', demoDate: '', demoTime: '' };
            var msgs = document.getElementById('vyb-msgs');
            if (msgs) msgs.innerHTML = '';
            startFunnel();
          }
        }
        _lastCtxId = newCtx.id;
      } catch (e) {}
    }
    var _push = history.pushState;
    var _replace = history.replaceState;
    history.pushState    = function () { _push.apply(history, arguments); onNav(); };
    history.replaceState = function () { _replace.apply(history, arguments); onNav(); };
    window.addEventListener('popstate',   onNav);
    window.addEventListener('hashchange', onNav);
    _lastCtxId = getCtx().id;
  }

  /* ════════════════════════════════════════════════════════════
     CSS INJECTION
  ════════════════════════════════════════════════════════════ */
  function injectCSS() {
    if (document.getElementById('vyb-css')) return;
    var el = document.createElement('style');
    el.id = 'vyb-css';
    el.textContent =
      /* Reset scoped to bot root */
      '#vyb-root,#vyb-root *{box-sizing:border-box;margin:0;padding:0}' +

      /* FAB button */
      '#vyb-fab{position:fixed;bottom:28px;right:28px;width:58px;height:58px;border-radius:50%;background:#122d5e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2147483647;transition:transform .2s,background .2s;box-shadow:0 4px 18px rgba(18,45,94,.38);font-family:system-ui,-apple-system,sans-serif}' +
      '#vyb-fab:hover{background:#1e4a9a;transform:scale(1.07)}' +
      '#vyb-fab svg{width:26px;height:26px;fill:#fff;display:block}' +
      '#vyb-fab .ci{display:flex;align-items:center}#vyb-fab .cx{display:none;align-items:center}' +
      '#vyb-fab.open .ci{display:none}#vyb-fab.open .cx{display:flex}' +

      /* Badge */
      '#vyb-badge{position:absolute;top:-3px;right:-3px;width:20px;height:20px;background:#e53935;border-radius:50%;border:2.5px solid #fff;font-size:11px;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;font-family:system-ui,-apple-system,sans-serif}' +

      /* Tooltip */
      '#vyb-tip{position:absolute;right:70px;bottom:50%;transform:translateY(50%);background:#122d5e;color:#fff;font-size:12px;padding:7px 13px;border-radius:8px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s;box-shadow:0 2px 10px rgba(18,45,94,.2);font-family:system-ui,-apple-system,sans-serif}' +
      '#vyb-fab:hover #vyb-tip{opacity:1}' +
      '#vyb-tip:after{content:"";position:absolute;left:100%;top:50%;transform:translateY(-50%);border:6px solid transparent;border-left-color:#122d5e}' +

      /* Chat popup */
      '#vyb-popup{position:fixed;bottom:100px;right:28px;width:375px;max-width:calc(100vw - 40px);background:#fff;border-radius:16px;border:1px solid rgba(18,45,94,.13);display:flex;flex-direction:column;z-index:2147483646;overflow:hidden;transform:scale(.88) translateY(24px);transform-origin:bottom right;opacity:0;pointer-events:none;transition:transform .28s cubic-bezier(.34,1.56,.64,1),opacity .2s;box-shadow:0 10px 44px rgba(18,45,94,.18);font-family:system-ui,-apple-system,sans-serif}' +
      '#vyb-popup.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}' +

      /* Header */
      '#vyb-hdr{background:#122d5e;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}' +
      '#vyb-av{width:36px;height:36px;border-radius:50%;background:#1e4a9a;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
      '#vyb-av svg{width:18px;height:18px;fill:#fff}' +
      '.vyb-hname{font-size:14px;font-weight:600;color:#fff;line-height:1.3}' +
      '.vyb-hstat{font-size:11px;color:#90b8e8;display:flex;align-items:center;gap:5px;margin-top:3px}' +
      '.vyb-hdot{width:7px;height:7px;border-radius:50%;background:#4ade80;flex-shrink:0;animation:vyb-pulse 2s infinite}' +
      '#vyb-admin-btn{margin-left:auto;background:rgba(255,255,255,.12);border:none;color:#90b8e8;font-size:10px;padding:4px 8px;border-radius:5px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:background .15s}' +
      '#vyb-admin-btn:hover{background:rgba(255,255,255,.22);color:#fff}' +
      '@keyframes vyb-pulse{0%,100%{opacity:1}50%{opacity:.5}}' +

      /* Context banner */
      '#vyb-ban{background:#e8f0fb;border-bottom:1px solid #c5d9f5;padding:6px 14px;font-size:11px;font-weight:600;color:#1e4a9a;flex-shrink:0}' +
      '#vyb-ban.h{display:none}' +

      /* Analytics panel */
      '#vyb-analytics{background:#0c1f45;padding:14px 16px;flex-shrink:0;display:none;flex-direction:column;gap:10px}' +
      '#vyb-analytics.visible{display:flex}' +
      '.vyb-atitle{font-size:11px;font-weight:700;color:#90b8e8;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:8px}' +
      '.vyb-agrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
      '.vyb-mcard{background:rgba(255,255,255,.06);border-radius:8px;padding:10px 12px}' +
      '.vyb-mval{font-size:22px;font-weight:700;color:#fff;line-height:1}' +
      '.vyb-mval.green{color:#4ade80}.vyb-mval.amber{color:#fbbf24}' +
      '.vyb-mlbl{font-size:10px;color:#6e91c4;margin-top:4px}' +
      '.vyb-afooter{font-size:10px;color:#4a6fa0;text-align:center;padding-top:6px;border-top:1px solid rgba(255,255,255,.08)}' +
      '.vyb-leads-wrap{max-height:120px;overflow-y:auto;border-radius:6px;background:rgba(255,255,255,.04)}' +
      '.vyb-leads-tbl{width:100%;border-collapse:collapse;font-size:10px;color:#90b8e8}' +
      '.vyb-leads-tbl th{padding:5px 8px;text-align:left;background:rgba(255,255,255,.08);color:#6e91c4;font-weight:600;letter-spacing:.5px;position:sticky;top:0}' +
      '.vyb-leads-tbl td{padding:5px 8px;border-top:1px solid rgba(255,255,255,.05);color:#c5d8f0}' +
      '.vyb-leads-tbl tr:hover td{background:rgba(255,255,255,.04)}' +
      '.vyb-no-leads{text-align:center;padding:14px;font-size:11px;color:#4a6fa0}' +

      /* ROI Dashboard */
      '#vyb-roi-dash{position:fixed;bottom:100px;left:24px;background:#0c1f45;border-radius:12px;border:1px solid rgba(255,255,255,.1);padding:14px 16px;min-width:200px;z-index:2147483645;box-shadow:0 6px 24px rgba(0,0,0,.3);transition:transform .3s,opacity .3s;font-family:system-ui,-apple-system,sans-serif}' +
      '#vyb-roi-dash.h{transform:translateY(10px);opacity:0;pointer-events:none}' +
      '.vyb-roi-title{font-size:10px;font-weight:700;color:#6e91c4;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:6px}' +
      '.vyb-roi-live{width:6px;height:6px;border-radius:50%;background:#4ade80;animation:vyb-pulse 1.5s infinite}' +
      '.vyb-roi-rows{display:flex;flex-direction:column;gap:6px}' +
      '.vyb-roi-row{display:flex;justify-content:space-between;align-items:center;gap:16px}' +
      '.vyb-roi-metric{font-size:11px;color:#90b8e8}' +
      '.vyb-roi-val{font-size:13px;font-weight:700;color:#fff;min-width:32px;text-align:right}' +
      '.vyb-roi-val.green{color:#4ade80}.vyb-roi-val.amber{color:#fbbf24}' +
      '.vyb-roi-div{height:1px;background:rgba(255,255,255,.08);margin:6px 0}' +
      '#vyb-roi-toggle{position:fixed;bottom:100px;left:24px;background:#0c1f45;border:1px solid rgba(255,255,255,.15);color:#90b8e8;font-size:11px;padding:7px 12px;border-radius:8px;cursor:pointer;font-family:inherit;z-index:2147483644;transition:background .15s;box-shadow:0 4px 14px rgba(0,0,0,.25)}' +
      '#vyb-roi-toggle:hover{background:#1a3a7a;color:#fff}' +
      '#vyb-roi-toggle.dash-open{display:none}' +

      /* Progress bar */
      '#vyb-prog{background:#1a3a7a;padding:8px 16px;flex-shrink:0;display:flex;align-items:center;gap:10px}' +
      '#vyb-prog.h{display:none}' +
      '#vyb-plbl{font-size:10px;color:#90b8e8;white-space:nowrap;font-weight:600;letter-spacing:.5px}' +
      '.vyb-ptrack{flex:1;height:4px;background:rgba(255,255,255,.2);border-radius:4px;overflow:hidden}' +
      '#vyb-pfill{height:100%;background:#4ade80;border-radius:4px;transition:width .4s ease}' +

      /* Messages */
      '#vyb-msgs{overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;max-height:300px;min-height:150px}' +
      '.m-row{display:flex;gap:8px;align-items:flex-end}' +
      '.m-row.u{flex-direction:row-reverse}' +
      '.m-bub{max-width:80%;padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.58}' +
      '.m-bot{background:#f0f4fa;color:#122d5e;border-bottom-left-radius:3px}' +
      '.m-usr{background:#122d5e;color:#fff;border-bottom-right-radius:3px}' +
      '.m-bub table{width:100%;border-collapse:collapse;margin:10px 0;font-size:12px;background:#fff;border-radius:8px;overflow:hidden;border:1px solid rgba(18,45,94,.1)}' +
      '.m-bub th,.m-bub td{padding:8px 10px;border:1px solid rgba(18,45,94,.1);text-align:left}' +
      '.m-bub th{background:rgba(18,45,94,.05);font-weight:600;color:#122d5e}' +
      '.m-bub tr:nth-child(even){background:rgba(18,45,94,.02)}' +
      '.m-bub ul,.m-bub ol{padding-left:20px;margin:8px 0}' +
      '.m-bub p{margin-bottom:8px}.m-bub p:last-child{margin-bottom:0}' +
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

      /* Options panel */
      '#vyb-opts{padding:10px 12px 13px;border-top:1px solid #eef2f8;display:flex;flex-direction:column;gap:5px;flex-shrink:0}' +
      '#vyb-olbl{font-size:10px;color:#bbb;margin-bottom:2px;letter-spacing:.4px;text-transform:uppercase}' +
      '#vyb-ogrid{display:flex;flex-direction:column;gap:4px;max-height:140px;overflow-y:auto}' +
      '.o-btn{text-align:left;background:transparent;border:1px solid #1e4a9a;border-radius:7px;padding:7px 11px;font-size:12px;color:#122d5e;cursor:pointer;transition:background .15s,color .15s;line-height:1.4;width:100%;font-family:inherit}' +
      '.o-btn:hover{background:#122d5e;color:#fff}.o-btn:active{transform:scale(.98)}' +
      '.o-cta{text-align:center;background:#122d5e;border:none;border-radius:8px;padding:9px 14px;font-size:12px;color:#fff;cursor:pointer;font-weight:600;line-height:1.4;transition:background .15s,transform .1s;width:100%;font-family:inherit}' +
      '.o-cta:hover{background:#1e4a9a;transform:translateY(-1px)}.o-cta:active{transform:scale(.98)}' +
      '.o-grn{text-align:center;background:#0a7a45;border:none;border-radius:8px;padding:9px 14px;font-size:12px;color:#fff;cursor:pointer;font-weight:600;line-height:1.4;transition:background .15s,transform .1s;width:100%;font-family:inherit}' +
      '.o-grn:hover{background:#0d9455;transform:translateY(-1px)}' +
      '.o-sec{text-align:center;background:transparent;border:1px solid #90b8e8;border-radius:8px;padding:7px 14px;font-size:12px;color:#1e4a9a;cursor:pointer;transition:background .15s;line-height:1.4;width:100%;font-family:inherit}' +
      '.o-sec:hover{background:#eef4fb}' +

      /* Nav row */
      '#vyb-navrow{display:flex;gap:5px;margin-top:4px}' +
      '.n-btn{background:transparent;border:1px solid #ddd;border-radius:7px;padding:6px 10px;font-size:11px;color:#888;cursor:pointer;flex:1;transition:background .15s;font-family:inherit}' +
      '.n-btn:hover{background:#f5f7ff;color:#122d5e}.n-btn.h{display:none}' +

      /* FAQ free-text input */
      '#vyb-faq-wrap{display:none;margin-top:6px}' +
      '#vyb-faq-wrap.visible{display:flex;gap:5px}' +
      '#vyb-faq-input{flex:1;padding:7px 10px;border:1px solid #1e4a9a;border-radius:7px;font-size:12px;font-family:inherit;color:#122d5e;outline:none;background:#fafcff;transition:border-color .15s}' +
      '#vyb-faq-input:focus{border-color:#122d5e;background:#fff}' +
      '#vyb-faq-input::placeholder{color:#aab8cc}' +
      '#vyb-faq-send{background:#122d5e;color:#fff;border:none;border-radius:7px;padding:7px 11px;font-size:13px;cursor:pointer;flex-shrink:0;transition:background .15s}' +
      '#vyb-faq-send:hover{background:#1e4a9a}' +

      /* Lead form */
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
      '.ce.v{display:block}' +

      /* Demo calendar */
      '.vyb-demo-wrap{display:flex;flex-direction:column;gap:8px;padding:4px 0 2px}' +
      '.vyb-demo-sec{font-size:10px;font-weight:700;color:#122d5e;letter-spacing:.5px;text-transform:uppercase;margin-bottom:2px}' +
      '.vyb-date-inp{width:100%;padding:8px 11px;border:1px solid #d0ddf0;border-radius:7px;font-size:13px;font-family:inherit;color:#122d5e;outline:none;transition:border-color .15s;background:#fafcff;cursor:pointer}' +
      '.vyb-date-inp:focus{border-color:#1e4a9a;background:#fff}' +
      '.vyb-slots-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:2px}' +
      '.vyb-slot-btn{padding:7px 6px;border:1px solid #1e4a9a;border-radius:7px;font-size:11px;font-weight:600;color:#122d5e;background:transparent;cursor:pointer;font-family:inherit;transition:background .15s,color .15s;text-align:center}' +
      '.vyb-slot-btn:hover{background:#122d5e;color:#fff}' +
      '.vyb-slot-btn.sel{background:#122d5e;color:#fff;border-color:#122d5e}' +
      '.vyb-slot-ph{font-size:11px;color:#aab8cc;padding:8px 0;text-align:center;grid-column:1/-1}' +
      '.vyb-demo-badge{display:flex;align-items:center;gap:6px;background:#e6f9f0;border:1px solid #a3dfc0;border-radius:7px;padding:7px 11px;font-size:11px;color:#0a7a45;font-weight:600}' +
      '.vyb-demo-badge span{flex:1}';

    document.head.appendChild(el);
  }

  /* ════════════════════════════════════════════════════════════
     HTML INJECTION
  ════════════════════════════════════════════════════════════ */
  function injectHTML() {
    if (document.getElementById('vyb-root')) return;
    var d = document.createElement('div');
    d.id = 'vyb-root';
    d.innerHTML =
      /* ROI Toggle */
      '<button id="vyb-roi-toggle">📊 ROI Dashboard</button>' +

      /* ROI Dashboard panel */
      '<div id="vyb-roi-dash" class="h">' +
        '<div class="vyb-roi-title"><span class="vyb-roi-live"></span>Live Analytics — L&T Vyoma Bot</div>' +
        '<div class="vyb-roi-rows">' +
          '<div class="vyb-roi-row"><span class="vyb-roi-metric">Total Visitors</span><span class="vyb-roi-val" id="vyb-rd-visitors">1</span></div>' +
          '<div class="vyb-roi-row"><span class="vyb-roi-metric">Chatbot Opens</span><span class="vyb-roi-val" id="vyb-rd-opens">0</span></div>' +
          '<div class="vyb-roi-row"><span class="vyb-roi-metric">Engaged Users</span><span class="vyb-roi-val amber" id="vyb-rd-engaged">0</span></div>' +
          '<div class="vyb-roi-row"><span class="vyb-roi-metric">Leads Captured</span><span class="vyb-roi-val green" id="vyb-rd-leads">0</span></div>' +
          '<div class="vyb-roi-div"></div>' +
          '<div class="vyb-roi-row"><span class="vyb-roi-metric">Engagement Rate</span><span class="vyb-roi-val amber" id="vyb-rd-engagement">0%</span></div>' +
          '<div class="vyb-roi-row"><span class="vyb-roi-metric">Conversion Rate</span><span class="vyb-roi-val green" id="vyb-rd-conversion">0%</span></div>' +
        '</div>' +
        '<div style="margin-top:10px;text-align:right"><button id="vyb-roi-close" style="background:transparent;border:none;color:#4a6fa0;font-size:10px;cursor:pointer;font-family:inherit">✕ Close</button></div>' +
      '</div>' +

      /* FAB */
      '<button id="vyb-fab">' +
        '<span id="vyb-tip">Hey! How may we help you?</span>' +
        '<div id="vyb-badge">1</div>' +
        '<span class="ci"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg></span>' +
        '<span class="cx"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>' +
      '</button>' +

      /* Chat popup */
      '<div id="vyb-popup">' +
        /* Header */
        '<div id="vyb-hdr">' +
          '<div id="vyb-av"><svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/></svg></div>' +
          '<div><div class="vyb-hname">Vyoma Assistant</div><div class="vyb-hstat"><span class="vyb-hdot"></span> Online — L&T Vyoma Help Center</div></div>' +
          '<button id="vyb-admin-btn">📊 Analytics</button>' +
        '</div>' +

        /* Analytics panel */
        '<div id="vyb-analytics">' +
          '<div class="vyb-atitle">📊 Session Analytics</div>' +
          '<div class="vyb-agrid">' +
            '<div class="vyb-mcard"><div class="vyb-mval" id="vyb-ap-opens">0</div><div class="vyb-mlbl">Chatbot Opens</div></div>' +
            '<div class="vyb-mcard"><div class="vyb-mval amber" id="vyb-ap-engaged">0</div><div class="vyb-mlbl">Engaged Users</div></div>' +
            '<div class="vyb-mcard"><div class="vyb-mval green" id="vyb-ap-leads">0</div><div class="vyb-mlbl">Leads Captured</div></div>' +
            '<div class="vyb-mcard"><div class="vyb-mval green" id="vyb-ap-conversion">0%</div><div class="vyb-mlbl">Conversion Rate</div></div>' +
          '</div>' +
          '<div id="vyb-leads-tbl-wrap"></div>' +
          '<div class="vyb-afooter">Leads sent to Google Sheets · ROI counters in localStorage</div>' +
        '</div>' +

        /* Context banner */
        '<div id="vyb-ban" class="h"></div>' +

        /* Progress bar */
        '<div id="vyb-prog" class="h"><span id="vyb-plbl">Step 1 of 4</span><div class="vyb-ptrack"><div id="vyb-pfill" style="width:25%"></div></div></div>' +

        /* Messages */
        '<div id="vyb-msgs"></div>' +

        /* Options panel */
        '<div id="vyb-opts">' +
          '<div id="vyb-olbl"></div>' +
          '<div id="vyb-ogrid"></div>' +
          '<div id="vyb-navrow">' +
            '<button class="n-btn h" id="vyb-bq">← Back to questions</button>' +
            '<button class="n-btn h" id="vyb-bm">⌂ Main menu</button>' +
          '</div>' +
          '<div id="vyb-faq-wrap">' +
            '<input id="vyb-faq-input" type="text" placeholder="Ask any question about L&T Vyoma…" />' +
            '<button id="vyb-faq-send">➤</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(d);
  }

  /* ════════════════════════════════════════════════════════════
     BIND STATIC EVENTS
  ════════════════════════════════════════════════════════════ */
  function bindEvents() {
    var fab = document.getElementById('vyb-fab');
    if (fab) fab.addEventListener('click', toggleChat);

    var adminBtn = document.getElementById('vyb-admin-btn');
    if (adminBtn) adminBtn.addEventListener('click', toggleAnalyticsPanel);

    var roiToggle = document.getElementById('vyb-roi-toggle');
    if (roiToggle) roiToggle.addEventListener('click', showRoiDashboard);

    var roiClose = document.getElementById('vyb-roi-close');
    if (roiClose) roiClose.addEventListener('click', hideRoiDashboard);

    var faqInput = document.getElementById('vyb-faq-input');
    if (faqInput) faqInput.addEventListener('keydown', handleFaqInput);

    var faqSend = document.getElementById('vyb-faq-send');
    if (faqSend) faqSend.addEventListener('click', function () { handleFaqInput({ key: 'Enter' }); });
  }

  /* ════════════════════════════════════════════════════════════
     ROI TRACKING
  ════════════════════════════════════════════════════════════ */
  var ROI = {
    totalVisitors: 1,
    chatbotOpens: 0,
    engagedUsers: 0,
    leadsCaptured: 0,
    get engagementRate() { return this.chatbotOpens ? ((this.engagedUsers / this.chatbotOpens) * 100).toFixed(1) + '%' : '0%'; },
    get conversionRate()  { return this.chatbotOpens ? ((this.leadsCaptured / this.chatbotOpens) * 100).toFixed(1) + '%' : '0%'; }
  };
  var _engDone = false;

  function tOpen()  { ROI.chatbotOpens++;  saveROI(); refreshAllDashboards(); logROI(); }
  function tEng()   { if (_engDone) return; _engDone = true; ROI.engagedUsers++; saveROI(); refreshAllDashboards(); }
  function tLead()  { ROI.leadsCaptured++; saveROI(); refreshAllDashboards(); logROI(); }

  var LS_LEADS = 'vyoma_leads';
  var LS_ROI   = 'vyoma_roi';

  function saveROI() {
    try { localStorage.setItem(LS_ROI, JSON.stringify({ opens: ROI.chatbotOpens, engaged: ROI.engagedUsers, leads: ROI.leadsCaptured })); } catch(e) {}
  }
  function loadROI() {
    try { var d = JSON.parse(localStorage.getItem(LS_ROI) || '{}'); if (d.opens) ROI.chatbotOpens = d.opens; if (d.engaged) ROI.engagedUsers = d.engaged; if (d.leads) ROI.leadsCaptured = d.leads; } catch(e) {}
  }
  function saveL(l) {
    try { var a = JSON.parse(localStorage.getItem(LS_LEADS) || '[]'); a.push(l); localStorage.setItem(LS_LEADS, JSON.stringify(a)); } catch(e) {}
  }
  function loadLeads() {
    try { return JSON.parse(localStorage.getItem(LS_LEADS) || '[]'); } catch(e) { return []; }
  }
  function logROI() {
    try {
      console.group('📊 L&T Vyoma Chatbot — ROI Analytics');
      console.table({ 'Total Visitors': ROI.totalVisitors, 'Chatbot Opens': ROI.chatbotOpens, 'Engaged Users': ROI.engagedUsers, 'Leads Captured': ROI.leadsCaptured, 'Engagement Rate': ROI.engagementRate, 'Conversion Rate': ROI.conversionRate });
      var leads = loadLeads(); if (leads.length) { console.log('📋 All Captured Leads:'); console.table(leads); }
      console.groupEnd();
    } catch(e) {}
  }

  /* ── Analytics UI ── */
  function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }

  function refreshAllDashboards() {
    setText('vyb-rd-visitors', ROI.totalVisitors);
    setText('vyb-rd-opens',    ROI.chatbotOpens);
    setText('vyb-rd-engaged',  ROI.engagedUsers);
    setText('vyb-rd-leads',    ROI.leadsCaptured);
    setText('vyb-rd-engagement', ROI.engagementRate);
    setText('vyb-rd-conversion', ROI.conversionRate);
    setText('vyb-ap-opens',      ROI.chatbotOpens);
    setText('vyb-ap-engaged',    ROI.engagedUsers);
    setText('vyb-ap-leads',      ROI.leadsCaptured);
    setText('vyb-ap-conversion', ROI.conversionRate);
    refreshLeadsTable();
  }

  function refreshLeadsTable() {
    var wrap = document.getElementById('vyb-leads-tbl-wrap'); if (!wrap) return;
    var leads = loadLeads();
    if (!leads.length) { wrap.innerHTML = '<div class="vyb-no-leads">No leads yet — start a conversation!</div>'; return; }
    var html = '<div class="vyb-leads-wrap"><table class="vyb-leads-tbl"><thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Service</th><th>Time</th></tr></thead><tbody>';
    leads.slice().reverse().forEach(function (l, i) {
      var t = l.timestamp ? new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
      html += '<tr><td>' + (leads.length - i) + '</td><td>' + (l.name||'—') + '</td><td>' + (l.phone||'—') + '</td><td>' + ((l.service||'—').replace('colocation','Colo').replace('managed','Managed').replace('explore','General')) + '</td><td>' + t + '</td></tr>';
    });
    html += '</tbody></table></div>';
    wrap.innerHTML = html;
  }

  function toggleAnalyticsPanel() {
    var p = document.getElementById('vyb-analytics');
    if (!p) return;
    p.classList.toggle('visible');
    if (p.classList.contains('visible')) refreshAllDashboards();
  }

  function showRoiDashboard() {
    var d = document.getElementById('vyb-roi-dash'), t = document.getElementById('vyb-roi-toggle');
    if (d) d.classList.remove('h');
    if (t) t.classList.add('dash-open');
    refreshAllDashboards();
  }

  function hideRoiDashboard() {
    var d = document.getElementById('vyb-roi-dash'), t = document.getElementById('vyb-roi-toggle');
    if (d) d.classList.add('h');
    if (t) t.classList.remove('dash-open');
  }

  /* ════════════════════════════════════════════════════════════
     GOOGLE SHEETS
  ════════════════════════════════════════════════════════════ */
  var GS_URL = 'https://script.google.com/macros/s/AKfycbzG9CZRoEZuXPbToXaQMXTy0mWI89e8LKMC4ZdUjpGuip2ZhS1-r0js4Z9Z6un7aYmB1A/exec';

  function pushSheets(lead) {
    return fetch(GS_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
      .then(function () { return { ok: true }; });
  }

  /* ════════════════════════════════════════════════════════════
     CHAT CONSTANTS & STATE
  ════════════════════════════════════════════════════════════ */
  var BOT = 'bot', USR = 'user';
  var STEPS = [
    { l: 'Step 1 of 4 — Intent',   p: 25  },
    { l: 'Step 2 of 4 — Your Needs', p: 50 },
    { l: 'Step 3 of 4 — Timeline', p: 75  },
    { l: 'Step 4 of 4 — Your Details', p: 100 }
  ];
  var WA  = '919912618285';
  var WAM = 'Hi, I am interested in L&T Vyoma services. Please share more details.';

  var DEMO_TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  var chatOn = false, topId = null, faqM = false;
  var ld = { service: '', timeline: '', name: '', phone: '', email: '', demoDate: '', demoTime: '' };
  var messageHistory = [];

  var MENU = [
    { l: 'About L&T Vyoma',         id: 'about'   },
    { l: 'Data Centers & Locations', id: 'dc'      },
    { l: 'Colocation Services',      id: 'colo'    },
    { l: 'Cloud Services',           id: 'cloud'   },
    { l: 'AI & GPU Offerings',       id: 'ai'      },
    { l: 'Managed & IT Services',    id: 'svc'     },
    { l: 'Security',                 id: 'sec'     },
    { l: 'Sustainability',           id: 'sus'     },
    { l: 'Contact & Support',        id: 'contact' }
  ];

  var FAQ = {
    about: { l: 'About L&T Vyoma', q: [
      { q: 'What is L&T Vyoma?',                    a: 'Larsen & Toubro Vyoma is the Data Center & Cloud Services division of L&T — one of India\'s largest conglomerates with over 80 years of experience and a presence in 50+ countries.' },
      { q: 'What services does L&T Vyoma offer?',   a: 'Data Center Colocation, Public & Private Cloud, Hybrid Cloud, AI-ready Data Centers, GPU as a Service, Managed Services, Network & Security Services, and Migration & Support — all under single-point responsibility.' },
      { q: 'What is L&T Vyoma\'s vision and mission?', a: 'Vision: Drive the digital economy with sustainable data solutions, cutting-edge AI, and scalable cloud power.\n\nMission: Build India\'s first sovereign, secure, fully integrated, and green AI-driven cloud and data center platform.' },
      { q: 'Has L&T built government data centers?', a: 'Yes. L&T has built major Data Centers for both government and private sector organizations in India and actively operates certain government data centers.' }
    ]},
    dc: { l: 'Data Centers', q: [
      { q: 'Where are the data centers located?',           a: 'West Region — Mumbai\nSouth Region — Sriperumbudur, Chennai (near NH-48)\n\nA new 40 MW green AI-ready data center is under development in Navi Mumbai (Jan 2026).' },
      { q: 'What Tier certification do the facilities hold?', a: 'Uptime Institute Tier III certified for concurrent maintainability — ensuring maximum uptime and high availability at all times.' },
      { q: 'What are the key features?',                    a: '• Tier III Uptime certification\n• 7-layer physical security, 24x7x365\n• Carrier-neutral high-speed connectivity\n• Multiple power & network redundancies\n• Energy-efficient, green-certified buildings' },
      { q: 'What is the new Navi Mumbai data center?',      a: 'A 40 MW green, AI-ready data center in Navi Mumbai — designed for next-generation AI and enterprise workloads with sustainable, high-capacity infrastructure.' }
    ]},
    colo: { l: 'Colocation Services', q: [
      { q: 'What colocation options are available?', a: '1. Rack Space — Full 42U racks with 6 KVA power\n2. Dedicated Cage — Biometric access & dedicated cameras\n3. Private Suite — 100s to 1000s sq ft hardened rooms\n4. Built-to-Suite — Fully customized to your specs' },
      { q: 'What physical security is in place?',    a: 'Minimum 7-layer security: boom barriers, road blockers, perimeter wall, biometric access, 24x7x365 trained guards, and comprehensive CCTV.' },
      { q: 'Can I scale up my space later?',         a: 'Yes. You can add more racks at any time without disruption. Both metered and unmetered power options are available as you scale.' },
      { q: 'Who is a Private Suite suitable for?',  a: 'Enterprises, web hosting providers, private cloud providers, and telecom carriers needing a fully isolated, secured space within a shared facility.' }
    ]},
    cloud: { l: 'Cloud Services', q: [
      { q: 'What cloud models does L&T Vyoma support?', a: '• Public Cloud — Shared, scalable infrastructure\n• Private Sovereign Cloud — Dedicated, India-hosted\n• Hybrid Cloud — Unified management across on-prem + private + public\n\nService layers: IaaS, PaaS, and SaaS.' },
      { q: 'What is the Private Sovereign Cloud?',       a: 'A dedicated cloud hosted within India — ensuring data never leaves Indian borders. Critical for banking, healthcare, government, and regulated industries.' },
      { q: 'Does L&T Vyoma support hybrid cloud?',      a: 'Yes. Hybrid Cloud Management integrates on-premises, private, and public cloud under unified management — optimizing cost and performance.' },
      { q: 'What cloud migration support is available?', a: 'End-to-end Migration & Support: assessment, planning, workload migration, integration, and post-migration monitoring.' }
    ]},
    ai: { l: 'AI & GPU Offerings', q: [
      { q: 'What is the SPD1 AI-Ready Data Center?',    a: 'SPD1 in Sriperumbudur, Chennai:\n• Racks: 12.5 kW to 80 kW per rack\n• Cooling: DLC, Liquid Immersion, In-Row & RDHX\n• Capacity: 30 MW expandable to 60 MW\n• IGBC Platinum Green Building certified' },
      { q: 'What is GPU as a Service (GPUaaS)?',        a: 'On-demand pay-as-you-go access to NVIDIA H100 GPUs — no upfront hardware investment. Use cases: AI/ML training, analytics, scientific simulations, and rendering.' },
      { q: 'What is the full AI portfolio?',            a: '• AI-Ready Data Center (SPD1, Chennai)\n• GPU as a Service with NVIDIA H100\n• AI-Based Training infrastructure\n• GPU Accelerated HPCaaS' },
      { q: 'Is GPUaaS suitable for smaller businesses?', a: 'Yes. Pay-as-you-go removes the cost barrier — making enterprise GPU computing accessible to startups and SMBs.' }
    ]},
    svc: { l: 'Managed & IT Services', q: [
      { q: 'What managed services are offered?',         a: '• Managed Network — SLA-backed end-to-end\n• Managed OS — Administration & lifecycle\n• Managed Database — Full DB infrastructure\n• Managed Storage — At our DC or your premises\n\nAll delivered 24x7x365 by certified professionals.' },
      { q: 'What professional services are available?',  a: 'Expert consulting across: data center design, cloud architecture, application integration, workload optimization, and infrastructure planning.' },
      { q: 'What is the 24x7 support model?',           a: 'On-site 24x7x365 SLA-driven support with dedicated helpdesk, smart-hands assistance, escalation paths, and proactive monitoring.' },
      { q: 'What network services are provided?',        a: 'End-to-end network design and SLA-backed management. Carrier-neutral with multiple Telco providers for high-speed, low-latency, redundant connectivity.' }
    ]},
    sec: { l: 'Security', q: [
      { q: 'How is physical security managed?',            a: '7-layer system: boom barriers, road blockers, perimeter wall, biometric access, 24x7x365 trained guards, and comprehensive CCTV. Cage customers have dedicated access controls.' },
      { q: 'What cybersecurity services are provided?',    a: 'Network security monitoring, threat detection and response, firewall management, and compliance-oriented security frameworks.' },
      { q: 'Is customer data compliant and confidential?', a: 'Yes. Private Sovereign Cloud keeps data within India. All facilities follow ISO-certified policies with physical and cyber security layers.' }
    ]},
    sus: { l: 'Sustainability', q: [
      { q: 'What are the sustainability targets?',        a: '• Carbon Neutrality by 2040\n• Water Neutrality by 2035\n\nBacked by renewable energy, water conservation, zero-waste management, and green building certifications.' },
      { q: 'What green energy initiatives are in place?', a: '• In-campus solar power up to 243 kW (SPD1)\n• Roadmap to 50% renewable energy\n• IGBC Platinum Green Building certification\n• L&T ranked among Asia\'s Top 5 Most Sustainable Companies' },
      { q: 'How is water consumption managed?',           a: 'Net Zero Water System: recharging pits, water-efficient plumbing, wastewater treatment and reuse, and closed-loop cycles toward Water Neutrality by 2035.' }
    ]},
    contact: { l: 'Contact & Support', q: [
      { q: 'How can I contact L&T Vyoma?',    a: '• Email: marketing.dccs@larsentoubro.com\n• Website: larsentoubrovyoma.com/contact-us\n• Address: 4th Floor, A.M. Naik Tower, L&T Campus, Gate No. 3, JVLR, Powai, Mumbai – 400072' },
      { q: 'Are there career opportunities?', a: 'Yes! L&T Vyoma is hiring across data center operations, cloud engineering, sales, cybersecurity, and AI/GPU. Visit larsentoubrovyoma.com/careers.' },
      { q: 'Where can I find whitepapers and case studies?', a: 'Visit larsentoubrovyoma.com/whitepapers, /case-study, and /blog for resources on data center best practices, cloud strategy, AI infrastructure, and sustainability.' }
    ]}
  };

  function getRec(svc, tl) {
    var m = {
      colocation: 'Our **Colocation Services** (Rack Space / Private Suite) in Mumbai or Chennai are the ideal fit — Tier III certified, 7-layer security, and scalable power.',
      cloud:      'Our **Private Sovereign Cloud Platform** or **Hybrid Cloud Management** solution ensures data stays in India with full compliance.',
      ai:         'Our **SPD1 AI-Ready Data Center** (30–60 MW, NVIDIA H100 GPUaaS) is purpose-built for AI/ML workloads with advanced liquid cooling.',
      managed:    'Our **Managed Services** stack (Network, OS, DB, Storage) delivered 24x7x365 by certified L&T professionals handles your IT end-to-end.',
      explore:    'We have the right solution for you — from Colocation and Cloud to AI and Managed Services. Let our team guide you to the perfect fit.'
    };
    var u = tl === 'immediate' ? ' Given your immediate timeline, we can fast-track evaluation.' : tl === '3months' ? ' With a 3-month horizon, we have ample time to design the right solution.' : '';
    return (m[svc] || m.explore) + u;
  }

  /* ════════════════════════════════════════════════════════════
     MESSAGE / UI HELPERS
  ════════════════════════════════════════════════════════════ */
  var AVT = '<svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:#fff"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/></svg>';

  function nt() { var n = new Date(); return ('0' + n.getHours()).slice(-2) + ':' + ('0' + n.getMinutes()).slice(-2); }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmtText(t) {
    /* Use marked.js if available, else fallback */
    try {
      if (typeof window.marked !== 'undefined') return window.marked.parse(t);
    } catch(e) {}
    return esc(t).replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function scrl() { try { var m = document.getElementById('vyb-msgs'); if (m) m.scrollTop = m.scrollHeight; } catch(e) {} }

  function push(html) {
    try { var m = document.getElementById('vyb-msgs'); if (!m) return; m.insertAdjacentHTML('beforeend', html); scrl(); } catch(e) {}
  }

  function addMsg(role, text) {
    try {
      var b = role === BOT;
      push(
        '<div class="m-row' + (b ? '' : ' u') + '">' +
          (b ? '<div class="m-av b-av">' + AVT + '</div>' : '<div class="m-av u-av">Me</div>') +
          '<div><div class="m-bub ' + (b ? 'm-bot' : 'm-usr') + '">' + fmtText(text) + '</div>' +
          '<div class="m-ts' + (b ? '' : ' r') + '">' + nt() + '</div></div>' +
        '</div>'
      );
    } catch(e) {}
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

  function rmTyp() { try { var t = document.getElementById('vyb-typ'); if (t) t.remove(); } catch(e) {} }

  function setProg(i) {
    try {
      var bar = document.getElementById('vyb-prog'); if (!bar) return;
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
      var olbl = document.getElementById('vyb-olbl'); if (olbl) olbl.textContent = lbl || '';
      var g = document.getElementById('vyb-ogrid'); if (!g) return;
      g.innerHTML = '';
      opts.forEach(function (o) {
        var b = document.createElement('button');
        b.className = o.v === 'cta' ? 'o-cta' : o.v === 'grn' ? 'o-grn' : o.v === 'sec' ? 'o-sec' : 'o-btn';
        b.textContent = o.l;
        b.addEventListener('click', function () { try { tEng(); o.fn(); } catch(e) {} });
        g.appendChild(b);
      });
      setNav(false, !!back);
    } catch(e) {}
  }

  function showFaqInput(placeholder) {
    var wrap = document.getElementById('vyb-faq-wrap'), inp = document.getElementById('vyb-faq-input');
    if (wrap) wrap.classList.add('visible');
    if (inp && placeholder) inp.placeholder = placeholder;
  }

  function hideFaqInput() {
    var wrap = document.getElementById('vyb-faq-wrap'); if (wrap) wrap.classList.remove('visible');
  }

  function hlField(id) {
    try { var e = document.getElementById(id); if (!e) return; e.style.borderColor = '#e53935'; e.focus(); setTimeout(function () { e.style.borderColor = ''; }, 2000); } catch(e) {}
  }

  /* ════════════════════════════════════════════════════════════
     FAQ FREE-TEXT (API)
  ════════════════════════════════════════════════════════════ */
  function handleFaqInput(e) {
    if (e.key !== 'Enter') return;
    var inputEl = document.getElementById('vyb-faq-input');
    var raw = inputEl ? inputEl.value.trim() : ''; if (!raw) return;
    if (inputEl) inputEl.value = '';
    addMsg(USR, raw); showTyp();
    messageHistory.push({ role: 'user', content: raw });
    fetch('http://localhost:3000/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messageHistory }) })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        rmTyp();
        addMsg(BOT, data.content || 'No response');
        messageHistory.push({ role: 'assistant', content: data.content || '' });
        if (data.downloadableFile) {
          var blob = new Blob([data.downloadableFile.content], { type: 'text/plain' });
          var url = URL.createObjectURL(blob);
          addMsg(BOT, '📄 Download file: <a href="' + url + '" download="' + data.downloadableFile.filename + '">' + data.downloadableFile.filename + '</a>');
        }
        if (data.showCalendar) { addMsg(BOT, '🗓️ Please schedule your demo using the calendar.'); }
      })
      .catch(function () { rmTyp(); addMsg(BOT, '⚠️ Server not responding. Make sure backend is running.'); });
  }

  /* ════════════════════════════════════════════════════════════
     SCHEDULE A DEMO
  ════════════════════════════════════════════════════════════ */
  function openScheduleCalendar() {
    tEng();
    addMsg(USR, '📅 Schedule a Demo'); showTyp();
    wait(800).then(function () {
      rmTyp();
      addMsg(BOT, 'Great! Let\'s find a time that works for you. 📅\n\nPick a date and we\'ll show available slots.');
      hideFaqInput(); setNav(false, false);

      var grid = document.getElementById('vyb-ogrid');
      var olbl = document.getElementById('vyb-olbl');
      if (olbl) olbl.textContent = 'Choose your preferred date & time:';

      var today = new Date().toISOString().split('T')[0];
      if (!grid) return;
      grid.innerHTML =
        '<div class="vyb-demo-wrap">' +
          '<div class="vyb-demo-sec">📆 Select a date</div>' +
          '<input class="vyb-date-inp li" type="date" id="vyb-demo-picker" min="' + today + '" />' +
          '<div class="vyb-demo-sec" id="vyb-slots-lbl" style="display:none;margin-top:4px">🕐 Available time slots</div>' +
          '<div class="vyb-slots-grid" id="vyb-slots-grid"><div class="vyb-slot-ph">← Pick a date to see available slots</div></div>' +
        '</div>';

      var picker = document.getElementById('vyb-demo-picker');
      if (picker) picker.addEventListener('change', function () { renderDemoSlots(this.value); });
    });
  }

  function renderDemoSlots(dateVal) {
    if (!dateVal) return;
    ld.demoDate = dateVal;
    var dateObj   = new Date(dateVal + 'T00:00:00');
    var dateLabel = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    var slotsLbl  = document.getElementById('vyb-slots-lbl');
    if (slotsLbl) slotsLbl.style.display = 'block';
    var slotsGrid = document.getElementById('vyb-slots-grid');
    if (!slotsGrid) return;
    slotsGrid.innerHTML = '';
    DEMO_TIME_SLOTS.forEach(function (slot) {
      var btn = document.createElement('button');
      btn.className   = 'vyb-slot-btn';
      btn.textContent = slot;
      btn.addEventListener('click', function () {
        document.querySelectorAll('.vyb-slot-btn').forEach(function (b) { b.classList.remove('sel'); });
        btn.classList.add('sel');
        ld.demoTime = slot;
        setTimeout(function () { showDemoForm(dateLabel, slot); }, 300);
      });
      slotsGrid.appendChild(btn);
    });
  }

  function showDemoForm(dateLabel, slot) {
    var grid = document.getElementById('vyb-ogrid'), olbl = document.getElementById('vyb-olbl');
    if (olbl) olbl.textContent = 'Your details — almost done!';
    if (!grid) return;
    grid.innerHTML =
      '<div class="lf" id="vyb-demo-form">' +
        '<div class="vyb-demo-badge"><span>📅 ' + dateLabel + ' &nbsp;·&nbsp; 🕐 ' + slot + '</span>' +
          '<button id="vyb-demo-change" style="background:transparent;border:none;color:#0a7a45;font-size:10px;cursor:pointer;font-family:inherit;text-decoration:underline;padding:0">Change</button>' +
        '</div>' +
        '<input class="li" id="vyb-df-name"  type="text"  placeholder="Your name *" />' +
        '<input class="li" id="vyb-df-phone" type="tel"   placeholder="Phone number *" />' +
        '<input class="li" id="vyb-df-email" type="email" placeholder="Email address (optional)" />' +
        '<div class="cw">' +
          '<label class="cr" id="vyb-df-cr"><input type="checkbox" class="ck" id="vyb-df-ck" />' +
            '<span class="cl">I agree to be contacted by L&amp;T Vyoma to confirm this demo. 🔒</span>' +
          '</label>' +
          '<span class="ch">Your details are secure and will not be shared with third parties.</span>' +
          '<div class="ce" id="vyb-df-ce">⚠️ Please provide consent to book the demo.</div>' +
        '</div>' +
        '<button class="ls" id="vyb-df-submit" style="background:#0a7a45">🚀 Confirm Demo</button>' +
      '</div>';

    var ck = document.getElementById('vyb-df-ck');
    if (ck) ck.addEventListener('change', function () {
      var row = document.getElementById('vyb-df-cr'), err = document.getElementById('vyb-df-ce');
      if (row) row.classList.remove('e'); if (err) err.classList.remove('v');
    });
    var change = document.getElementById('vyb-demo-change');
    if (change) change.addEventListener('click', openScheduleCalendar);
    var sub = document.getElementById('vyb-df-submit');
    if (sub) sub.addEventListener('click', submitDemo);
  }

  function submitDemo() {
    var name  = (document.getElementById('vyb-df-name')  || {}).value && document.getElementById('vyb-df-name').value.trim();
    var phone = (document.getElementById('vyb-df-phone') || {}).value && document.getElementById('vyb-df-phone').value.trim();
    var email = (document.getElementById('vyb-df-email') || {}).value && document.getElementById('vyb-df-email').value.trim() || '';

    if (!name)  { hlField('vyb-df-name');  return; }
    if (!phone) { hlField('vyb-df-phone'); return; }

    var ck = document.getElementById('vyb-df-ck');
    if (!ck || !ck.checked) {
      var row = document.getElementById('vyb-df-cr'), err = document.getElementById('vyb-df-ce');
      if (row) row.classList.add('e'); if (err) { err.classList.add('v'); err.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
      return;
    }

    var demoData = {
      name: name, phone: phone, email: email,
      date: ld.demoDate, time: ld.demoTime,
      service: ld.service || 'Not specified',
      type: 'Demo Booking', consent: true,
      timestamp: new Date().toISOString(), sessionId: Date.now(),
      pageUrl: window.location.href
    };

    var btn = document.getElementById('vyb-df-submit');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Booking...'; btn.style.opacity = '.7'; }

    pushSheets(demoData)
      .then(function () {
        saveL(demoData); tLead();

        /* EmailJS — send confirmation email */
        try {
          if (typeof emailjs !== 'undefined') {
            emailjs.send('service_nd3fy3g', 'template_89njglh', {
              name: name, phone: phone, email: email,
              date: demoData.date, time: demoData.time
            }).then(
              function () { console.log('✅ EmailJS: email sent'); },
              function (err) { console.error('❌ EmailJS: email failed', err); }
            );
          }
        } catch(e) {}

        var dateObj = new Date(demoData.date + 'T00:00:00');
        var dateFmt = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        addMsg(USR, 'Demo: ' + name + ' | ' + phone + ' | ' + dateFmt + ' at ' + demoData.time);
        var og = document.getElementById('vyb-ogrid'); if (og) og.innerHTML = '';
        var ol = document.getElementById('vyb-olbl'); if (ol) ol.textContent = '';
        setProg(null); showTyp(); return wait(1200);
      })
      .then(function () {
        var dateObj = new Date(demoData.date + 'T00:00:00');
        var dateFmt = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        rmTyp();
        addOK(
          '✅ <strong>Demo Scheduled Successfully!</strong><br><br>' +
          '📅 <strong>Date:</strong> ' + dateFmt + '<br>' +
          '🕐 <strong>Time:</strong> ' + demoData.time + '<br>' +
          '👤 <strong>Name:</strong> ' + esc(name) + '<br>' +
          '📞 <strong>Phone:</strong> ' + esc(phone) +
          (email ? '<br>📧 <strong>Email:</strong> ' + esc(email) : '') +
          '<br><br>Our team will send a calendar invite and call you to confirm. 🎉'
        );
        return wait(500);
      })
      .then(function () { showTyp(); return wait(900); })
      .then(function () {
        rmTyp(); addMsg(BOT, 'Is there anything else I can help you with?');
        renderOpts([
          { l: '📋 Browse FAQs',              v: 'sec', fn: startFaq },
          { l: '🚀 Get Best Price in 24 Hours', v: 'cta', fn: goLead },
          { l: '🔄 Start Over',               v: 'sec', fn: restart }
        ], '');
        showFaqInput('Ask any question about L&T Vyoma…');
      })
      .catch(function (err) {
        console.error('❌ Demo booking error:', err);
        if (btn) { btn.disabled = false; btn.textContent = '🚀 Confirm Demo'; btn.style.opacity = '1'; }
        var errDiv = document.createElement('div');
        errDiv.style.cssText = 'color:#c0392b;font-size:11px;margin-top:6px;text-align:center;padding:6px 8px;background:#fff0f0;border-radius:6px;border:1px solid #f5c6cb';
        errDiv.textContent = '⚠️ Booking failed. Please check your connection and try again.';
        var og = document.getElementById('vyb-ogrid'); if (og) og.appendChild(errDiv);
      });
  }

  /* ════════════════════════════════════════════════════════════
     LEAD CAPTURE FORM
  ════════════════════════════════════════════════════════════ */
  function showLeadForm() {
    try {
      var olbl = document.getElementById('vyb-olbl'); if (olbl) olbl.textContent = 'Step 4 of 4 — Your details';
      setNav(false, false); hideFaqInput();
      var g = document.getElementById('vyb-ogrid'); if (!g) return;
      g.innerHTML =
        '<div class="lf">' +
          '<input class="li" id="vyb-lf-n" type="text"  placeholder="Your name *">' +
          '<input class="li" id="vyb-lf-p" type="tel"   placeholder="Phone number *">' +
          '<input class="li" id="vyb-lf-e" type="email" placeholder="Email address (optional)">' +
          '<div class="cw">' +
            '<label class="cr" id="vyb-lf-cr"><input type="checkbox" class="ck" id="vyb-lf-ck">' +
              '<span class="cl">I agree to share my details and be contacted by L&amp;T Vyoma team. 🔒</span>' +
            '</label>' +
            '<span class="ch">Your data is सुरक्षित (secure) and will not be shared with third parties.</span>' +
            '<div class="ce" id="vyb-lf-ce">⚠️ Please provide consent to proceed.</div>' +
          '</div>' +
          '<button class="ls" id="vyb-lf-s">🚀 Get Best Price in 24 Hours</button>' +
        '</div>';
      var ck = document.getElementById('vyb-lf-ck');
      if (ck) ck.addEventListener('change', function () {
        try { document.getElementById('vyb-lf-cr').classList.remove('e'); document.getElementById('vyb-lf-ce').classList.remove('v'); } catch(e) {}
      });
      var sb = document.getElementById('vyb-lf-s'); if (sb) sb.addEventListener('click', doSub);
    } catch(e) {}
  }

  function doSub() {
    try {
      var name = (document.getElementById('vyb-lf-n').value || '').trim();
      var ph   = (document.getElementById('vyb-lf-p').value || '').trim();
      var em   = (document.getElementById('vyb-lf-e').value || '').trim();
      if (!name) { hlField('vyb-lf-n'); return; }
      if (!ph)   { hlField('vyb-lf-p'); return; }
      if (!document.getElementById('vyb-lf-ck').checked) {
        document.getElementById('vyb-lf-cr').classList.add('e');
        var ce = document.getElementById('vyb-lf-ce'); ce.classList.add('v'); ce.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return;
      }
      var payload = { name: name, phone: ph, email: em, service: ld.service || 'Not specified', timeline: ld.timeline || 'Not specified', consent: true, timestamp: new Date().toISOString(), sessionId: Date.now(), pageUrl: window.location.href };
      var btn = document.getElementById('vyb-lf-s');
      btn.disabled = true; btn.textContent = '⏳ Sending…'; btn.style.opacity = '.7';
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
          addOK('✅ Thank you, <strong>' + esc(name) + '</strong>! Your details have been received.<br>Our team will contact you at <strong>' + esc(ph) + '</strong> within 24 hours.' + (em ? '<br>A confirmation will be sent to <strong>' + esc(em) + '</strong>.' : ''));
          return wait(500);
        })
        .then(function () { showTyp(); return wait(900); })
        .then(function () {
          rmTyp(); addMsg(BOT, 'Is there anything else I can help you with?');
          renderOpts([
            { l: '📋 Browse FAQs',             v: 'sec', fn: startFaq },
            { l: '📞 Connect with L&T Expert', v: 'cta', fn: showExp  },
            { l: '🔄 Start Over',              v: 'sec', fn: restart   }
          ], '');
          showFaqInput('Ask any question about L&T Vyoma…');
        })
        .catch(function (err) {
          console.warn('[VyomaBot]', err);
          btn.disabled = false; btn.textContent = '🚀 Get Best Price in 24 Hours'; btn.style.opacity = '1';
          var ed = document.createElement('div');
          ed.style.cssText = 'color:#c0392b;font-size:11px;margin-top:6px;text-align:center;padding:6px 8px;background:#fff0f0;border-radius:6px;border:1px solid #f5c6cb';
          ed.textContent = '⚠️ Submission failed. Please check your connection and try again.';
          var og2 = document.getElementById('vyb-ogrid'); if (og2) og2.appendChild(ed);
        });
    } catch(e) {}
  }

  /* ════════════════════════════════════════════════════════════
     CONVERSION TRIGGER
  ════════════════════════════════════════════════════════════ */
  function showConversionTrigger() {
    showTyp();
    wait(900).then(function () {
      rmTyp(); addMsg(BOT, 'Would you like to receive the **best tailored quote** directly on WhatsApp or Email? 📲');
      renderOpts([
        { l: '📱 Get Best Price on WhatsApp', v: 'grn', fn: openWA              },
        { l: '🚀 Get Best Price in 24 Hours', v: 'cta', fn: goLead              },
        { l: '📅 Schedule a Demo',            v: 'grn', fn: openScheduleCalendar },
        { l: '📋 Browse FAQs first',          v: 'sec', fn: startFaq            }
      ], 'Choose your preferred channel:');
    });
  }

  function openWA() {
    try { window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(WAM + (ld.service ? ' — interested in ' + ld.service + '.' : '')), '_blank'); goLead(); } catch(e) {}
  }

  function goLead() {
    setProg(3); showTyp();
    wait(800)
      .then(function () { rmTyp(); addTrust('🔒 Your details are <strong>सुरक्षित (secure)</strong> and will only be used to contact you regarding your request. We respect your privacy and do not spam.'); return wait(300); })
      .then(function () { addMsg(BOT, 'Please share your details below — our team will respond within **24 hours** with a customised quote. 🚀'); showLeadForm(); });
  }

  function showExp() {
    addMsg(USR, 'Connect with L&T Expert'); showTyp();
    wait(800)
      .then(function () { rmTyp(); addTrust('🔒 Your details are <strong>सुरक्षित (secure)</strong> and will only be used to connect you with our expert team. We do not spam.'); return wait(300); })
      .then(function () { addMsg(BOT, 'Our expert team is ready! Please share your details and we\'ll arrange a call at your convenience. 📞'); setProg(3); showLeadForm(); });
  }

  /* ════════════════════════════════════════════════════════════
     FAQ MODE
  ════════════════════════════════════════════════════════════ */
  function startFaq() {
    faqM = true; setProg(null); addMsg(USR, 'Browse FAQs'); showTyp();
    wait(700).then(function () { rmTyp(); addMsg(BOT, 'Sure! Select a topic below. You can return to the main guide anytime. 📚'); showFaqMenu(); });
  }

  function showFaqMenu() {
    var ctx = getCtx();
    var items = getContextualFAQs(ctx);
    renderOpts(items.map(function (m) { return { l: m.l, fn: function () { selTopic(m.id); } }; }), 'FAQ topics — tap to explore:', false);
    setNav(false, true);
    var bm = document.getElementById('vyb-bm');
    if (bm) { bm.textContent = '← Back to Guide'; bm.onclick = restart; bm.classList.remove('h'); }
    showFaqInput('Type your FAQ question and press Enter…');
  }

  function selTopic(id) {
    topId = id;
    var t = FAQ[id];
    if (!t) { addMsg(BOT, 'I\'ll connect you with an L&T Vyoma expert for accurate details.'); return; }
    addMsg(USR, t.l); showTyp();
    wait(700).then(function () { rmTyp(); addMsg(BOT, 'Here are common questions about ' + t.l + ':'); showFaqQs(id); });
  }

  function showFaqQs(id) {
    topId = id; var t = FAQ[id]; if (!t) return;
    renderOpts(t.q.map(function (q) { return { l: q.q, fn: function () { ansQ(q.q, q.a, id); } }; }), 'Select a question:', false);
    setNav(false, true);
    var bm = document.getElementById('vyb-bm');
    if (bm) { bm.textContent = '← FAQ Topics'; bm.onclick = showFaqMenu; bm.classList.remove('h'); }
  }

  function ansQ(q, a, id) {
    addMsg(USR, q); showTyp();
    wait(900).then(function () {
      rmTyp();
      if (!a || !a.trim()) { addMsg(BOT, 'I\'ll connect you with an L&T Vyoma expert for accurate details.'); }
      else { addMsg(BOT, a); }
      var t = FAQ[id];
      var rem = t ? t.q.filter(function (x) { return x.q !== q; }).map(function (x) { return { l: x.q, fn: function () { ansQ(x.q, x.a, id); } }; }) : [];
      rem.push({ l: '🚀 Get Best Price in 24 Hours', v: 'grn', fn: restart });
      renderOpts(rem, 'More questions:', false); setNav(true, true);
      var bq = document.getElementById('vyb-bq'), bm = document.getElementById('vyb-bm');
      if (bq) { bq.onclick = function () { showFaqQs(id); }; bq.classList.remove('h'); }
      if (bm) { bm.textContent = '← FAQ Topics'; bm.onclick = showFaqMenu; bm.classList.remove('h'); }
    });
  }

  /* ════════════════════════════════════════════════════════════
     MAIN FUNNEL
  ════════════════════════════════════════════════════════════ */
  function startFunnel() {
    faqM = false; setProg(0);
    var ctx = getCtx();
    var ban = document.getElementById('vyb-ban');
    if (ban) {
      if (ctx.tag) { ban.textContent = '📍 Viewing: ' + ctx.tag; ban.classList.remove('h'); }
      else          { ban.classList.add('h'); }
    }
    showTyp();
    wait(900)
      .then(function () { rmTyp(); addMsg(BOT, ctx.welcome); return wait(400); })
      .then(function () { showTyp(); return wait(800); })
      .then(function () {
        rmTyp(); addMsg(BOT, 'What are you looking to explore today?');
        var exploreLabel = ctx.explore ? ctx.explore.label : '🏢 Explore Data Center Services';
        var exploreSvc   = ctx.explore ? ctx.explore.svc   : 'explore';
        var priceLabel   = ctx.price   ? ctx.price.label   : '🚀 Get Best Price in 24 Hours';
        var expertLabel  = ctx.expert  ? ctx.expert.label  : '📞 Connect with L&T Expert';
        renderOpts([
          { l: exploreLabel, v: 'cta', fn: function () { selI('explore', exploreSvc); } },
          { l: priceLabel,   v: 'grn', fn: function () { selI('quote');               } },
          { l: '📅 Schedule a Demo', v: 'grn', fn: openScheduleCalendar              },
          { l: expertLabel,  v: 'cta', fn: function () { selI('expert');              } },
          { l: '📋 Browse FAQs',     v: 'sec', fn: startFaq                           }
        ], 'What brings you here today?');
        showFaqInput('Ask any question about L&T Vyoma…');
      });
  }

  function selI(intent, preselectedSvc) {
    if (intent === 'quote') {
      addMsg(USR, 'Get Best Price in 24 Hours'); setProg(3); showTyp();
      wait(800)
        .then(function () { rmTyp(); addTrust('🔒 Your details are <strong>secure</strong> and will only be used to contact you.'); return wait(300); })
        .then(function () { addMsg(BOT, 'Please share your details — our team will respond within **24 hours**. 🚀'); showLeadForm(); });
      return;
    }
    if (intent === 'expert') {
      addMsg(USR, 'Connect with L&T Expert'); setProg(3); showTyp();
      wait(800)
        .then(function () { rmTyp(); addTrust('🔒 Your details will only be used to connect you with our expert team.'); return wait(300); })
        .then(function () { addMsg(BOT, 'Our experts are ready! Share your details and we\'ll get back within a business day. 📞'); showLeadForm(); });
      return;
    }
    if (preselectedSvc && preselectedSvc !== 'explore') {
      addMsg(USR, 'Exploring ' + preselectedSvc + ' services'); setProg(1); showTyp();
      wait(800).then(function () { rmTyp(); selS(preselectedSvc); }); return;
    }
    addMsg(USR, 'Explore Data Center Services'); setProg(1); showTyp();
    wait(800).then(function () {
      rmTyp(); addMsg(BOT, 'Great choice! Which service area interests you most?');
      renderOpts([
        { l: '🖥️ Data Center Colocation',   fn: function () { selS('colocation'); } },
        { l: '☁️ Cloud Services',            fn: function () { selS('cloud');      } },
        { l: '🤖 AI & GPU Computing',        fn: function () { selS('ai');         } },
        { l: '⚙️ Managed & IT Services',     fn: function () { selS('managed');    } },
        { l: '🔍 Not sure — help me decide', v: 'sec', fn: function () { selS('explore'); } }
      ], 'Step 2 — Select your area of interest:');
    });
  }

  function selS(svc) {
    ld.service = svc;
    var lbl = { colocation: 'Data Center Colocation', cloud: 'Cloud Services', ai: 'AI & GPU Computing', managed: 'Managed & IT Services', explore: 'Not sure — help me decide' };
    addMsg(USR, lbl[svc] || svc); setProg(2); showTyp();
    wait(800).then(function () {
      rmTyp(); addMsg(BOT, 'Perfect. What is your expected timeline for getting started?');
      renderOpts([
        { l: '⚡ Immediately (within 1 month)',   fn: function () { selT('immediate'); } },
        { l: '📅 In 3–6 months',                  fn: function () { selT('3months');   } },
        { l: '🗓️ Planning for next year',          fn: function () { selT('nextyear');  } },
        { l: '🔎 Just exploring', v: 'sec',        fn: function () { selT('exploring'); } }
      ], 'Step 3 — Your timeline:');
    });
  }

  function selT(tl) {
    ld.timeline = tl;
    var lbl = { immediate: 'Immediately (within 1 month)', '3months': 'In 3–6 months', nextyear: 'Planning for next year', exploring: 'Just exploring' };
    addMsg(USR, lbl[tl] || tl); setProg(null); showTyp();
    wait(1100)
      .then(function () { rmTyp(); addMsg(BOT, '✨ Based on your inputs, here\'s our recommendation:\n\n' + getRec(ld.service, tl)); return wait(400); })
      .then(function () { showConversionTrigger(); });
  }

  /* ════════════════════════════════════════════════════════════
     RESTART
  ════════════════════════════════════════════════════════════ */
  function restart() {
    ld = { service: '', timeline: '', name: '', phone: '', email: '', demoDate: '', demoTime: '' };
    messageHistory = []; faqM = false; _engDone = false;
    var msgs = document.getElementById('vyb-msgs'); if (msgs) msgs.innerHTML = '';
    startFunnel();
  }

  /* ════════════════════════════════════════════════════════════
     TOGGLE CHAT
  ════════════════════════════════════════════════════════════ */
  function toggleChat() {
    try {
      var fab   = document.getElementById('vyb-fab');
      var pop   = document.getElementById('vyb-popup');
      var badge = document.getElementById('vyb-badge');
      if (!fab || !pop) return;
      var isOpen = pop.classList.contains('open');
      if (isOpen) {
        pop.classList.remove('open'); fab.classList.remove('open');
      } else {
        pop.classList.add('open'); fab.classList.add('open');
        if (badge) badge.remove();
        tOpen();
        if (!chatOn) {
          chatOn = true;
          startFunnel();
        }
        setTimeout(scrl, 300);
      }
    } catch(e) {}
  }

  function openChat() {
    try { if (!document.getElementById('vyb-popup').classList.contains('open')) toggleChat(); } catch(e) {}
  }

  window.vyomaOpenChat   = openChat;
  window.vyomaToggleChat = toggleChat;

  /* ════════════════════════════════════════════════════════════
     AUTO-TRIGGER — 5s of active tab time, once per session
  ════════════════════════════════════════════════════════════ */
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
    } catch(e) {}
  }

  /* ════════════════════════════════════════════════════════════
     BOOT SEQUENCE
  ════════════════════════════════════════════════════════════ */
  function boot() {
    /* Load external dependencies */
    loadScript('https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js', 'vyb-marked-js', null);
    loadScript('https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js', 'vyb-emailjs', function () {
      try { if (typeof emailjs !== 'undefined') emailjs.init('SygILk7p9EWZT0DY2'); } catch(e) {}
    });

    try { injectCSS(); }        catch(e) { console.warn('[VyomaBot] injectCSS error:', e); }
    try { injectHTML(); }       catch(e) { console.warn('[VyomaBot] injectHTML error:', e); }
    try { bindEvents(); }       catch(e) { console.warn('[VyomaBot] bindEvents error:', e); }
    try { setupAutoTrigger(); } catch(e) { console.warn('[VyomaBot] setupAutoTrigger error:', e); }
    try { setupSPAWatcher(); }  catch(e) { console.warn('[VyomaBot] setupSPAWatcher error:', e); }

    /* ROI initialisation */
    try {
      loadROI();
      ROI.totalVisitors = (parseInt(localStorage.getItem('vyoma_visitors') || '0', 10) + 1);
      localStorage.setItem('vyoma_visitors', ROI.totalVisitors);
      refreshAllDashboards();
    } catch(e) {}
  }

})();
