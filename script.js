/**
 * Simplex Tech - Studio Engine & Interactive Prototypes
 * Direct WhatsApp: +91 8074215457
 */

document.addEventListener('DOMContentLoaded', () => {
  initSubtleCanvas();
  initTypewriter();
  initProjectEstimator();
  initInteractivePrototypes();
  initFaqAccordion();
  initWhatsAppWidget();
  initScrollReveal();
  initMobileNav();
  initStatsCounter();
});

/* ==========================================================================
   1. Clean Structural Grid Points Canvas
   ========================================================================== */
function initSubtleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let points = [];
  const spacing = 50;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createPoints();
  }

  function createPoints() {
    points = [];
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        points.push({
          x: c * spacing,
          y: r * spacing,
          originX: c * spacing,
          originY: r * spacing
        });
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: -1000, y: -1000, radius: 110 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#d4d4d8';

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (1 - dist / mouse.radius) * 7;
        p.x -= Math.cos(angle) * force;
        p.y -= Math.sin(angle) * force;
      } else {
        p.x += (p.originX - p.x) * 0.08;
        p.y += (p.originY - p.y) * 0.08;
      }

      ctx.fillRect(p.x, p.y, 1.5, 1.5);
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. Clean Typewriter
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('rotating-text');
  if (!target) return;

  const words = [
    'Custom CRMs & Business Portals',
    'Real-Time Analytics Dashboards',
    'High-Converting Landing Pages',
    'Mobile & Web MVP Apps',
    'Automated Business Workflows',
    'Storefronts & Catalog Systems'
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseDuration = 2200;

  function type() {
    const currentWord = words[wordIdx];

    if (isDeleting) {
      charIdx--;
      target.textContent = currentWord.substring(0, charIdx);
    } else {
      charIdx++;
      target.textContent = currentWord.substring(0, charIdx);
    }

    let speed = isDeleting ? 28 : 60;

    if (!isDeleting && charIdx === currentWord.length) {
      speed = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 280;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   3. Scope & Budget Estimator (Max 8k ceiling under the hood)
   ========================================================================== */
function initProjectEstimator() {
  const serviceOptions = document.querySelectorAll('.estimator-service-option');
  const featureCheckboxes = document.querySelectorAll('.estimator-feature-checkbox');
  const timelineRadios = document.querySelectorAll('.estimator-timeline-radio');
  const priceDisplay = document.getElementById('estimator-price-range');
  const durationDisplay = document.getElementById('estimator-duration');
  const ctaButton = document.getElementById('estimator-whatsapp-cta');

  if (!serviceOptions.length || !ctaButton) return;

  let state = {
    service: 'Custom CRM / Business Portal',
    serviceBaseCost: 3999,
    features: ['User Roles & Permissions', 'Real-Time Reports'],
    featureTotal: 1000,
    timeline: 'Standard (5-7 Days)',
    timelineMultiplier: 1.0
  };

  function updateCalculation() {
    const selectedService = document.querySelector('.estimator-service-option.active');
    if (selectedService) {
      state.service = selectedService.dataset.name;
      state.serviceBaseCost = parseInt(selectedService.dataset.basePrice, 10);
    }

    let featuresTotal = 0;
    let selectedFeatureNames = [];
    featureCheckboxes.forEach((cb) => {
      if (cb.checked) {
        featuresTotal += parseInt(cb.dataset.price, 10);
        selectedFeatureNames.push(cb.dataset.name);
      }
    });
    state.features = selectedFeatureNames;
    state.featureTotal = featuresTotal;

    const activeTimeline = document.querySelector('.estimator-timeline-radio:checked');
    if (activeTimeline) {
      state.timeline = activeTimeline.dataset.name;
      state.timelineMultiplier = parseFloat(activeTimeline.dataset.multiplier);
      durationDisplay.textContent = activeTimeline.dataset.eta;
    }

    let rawTotal = (state.serviceBaseCost + state.featureTotal) * state.timelineMultiplier;
    let calculated = Math.round(rawTotal);
    if (calculated > 8000) calculated = 8000;
    if (calculated < 1499) calculated = 1499;

    let lowRange = Math.max(1499, Math.round(calculated * 0.92));
    let highRange = Math.min(8000, Math.round(calculated * 1.12));

    if (highRange > 8000) highRange = 8000;
    if (lowRange > 7400) lowRange = 7200;

    priceDisplay.textContent = `₹${lowRange.toLocaleString('en-IN')} - ₹${highRange.toLocaleString('en-IN')}`;

    const message = `Hello Simplex Tech! 👋%0A%0AI used your website scope calculator:%0A• Service: ${encodeURIComponent(state.service)}%0A• Features: ${encodeURIComponent(state.features.join(', ') || 'Standard Core')}%0A• Timeline: ${encodeURIComponent(state.timeline)}%0A• Estimated Budget: ₹${lowRange.toLocaleString('en-IN')} - ₹${highRange.toLocaleString('en-IN')}%0A%0ACan we discuss getting this built?`;
    ctaButton.href = `https://wa.me/918074215457?text=${message}`;
  }

  serviceOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      updateCalculation();
    });
  });

  featureCheckboxes.forEach((cb) => {
    cb.addEventListener('change', updateCalculation);
  });

  timelineRadios.forEach((radio) => {
    radio.addEventListener('change', updateCalculation);
  });

  updateCalculation();
}

/* ==========================================================================
   4. High-End Interactive Prototype Suite
   ========================================================================== */
function initInteractivePrototypes() {
  // Tab Switcher
  const tabs = document.querySelectorAll('.demo-tab-btn');
  const demoPanels = document.querySelectorAll('.demo-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      demoPanels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // CRM: Clickable Deal Cards to open Drawer / Inspector
  const kanbanCards = document.querySelectorAll('.kanban-card');
  const crmDrawer = document.getElementById('crm-deal-drawer');
  const closeDrawerBtn = document.getElementById('close-crm-drawer');
  const drawerClientName = document.getElementById('drawer-client-name');
  const drawerDealAmount = document.getElementById('drawer-deal-amount');
  const drawerDealStage = document.getElementById('drawer-deal-stage');
  const drawerDealScope = document.getElementById('drawer-deal-scope');

  if (kanbanCards.length && crmDrawer) {
    kanbanCards.forEach((card) => {
      card.addEventListener('click', () => {
        const name = card.dataset.client || 'Client Account';
        const amount = card.dataset.amount || '₹2,50,000';
        const stage = card.dataset.stage || 'Negotiation';
        const scope = card.dataset.scope || 'Custom Web Portal & Integration';

        if (drawerClientName) drawerClientName.textContent = name;
        if (drawerDealAmount) drawerDealAmount.textContent = amount;
        if (drawerDealStage) drawerDealStage.textContent = stage;
        if (drawerDealScope) drawerDealScope.textContent = scope;

        crmDrawer.classList.remove('hidden');
      });
    });

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', () => {
        crmDrawer.classList.add('hidden');
      });
    }
  }

  // Dashboard: Interactive Timeframe Toggles & Live Chart Points
  const timeframeBtns = document.querySelectorAll('.dashboard-tf-btn');
  const grossRevEl = document.getElementById('dash-gross-rev');
  const ordersEl = document.getElementById('dash-orders-count');
  const chartPath = document.getElementById('dash-chart-path');
  const chartFill = document.getElementById('dash-chart-fill');
  const chartTooltip = document.getElementById('chart-interactive-tooltip');

  const chartData = {
    '7D': {
      rev: '₹1,24,500',
      orders: '38',
      path: 'M0,110 Q120,40 240,80 T480,30 T720,20',
      fill: 'M0,110 Q120,40 240,80 T480,30 T720,20 L720,160 L0,160 Z'
    },
    '30D': {
      rev: '₹4,82,000',
      orders: '142',
      path: 'M0,120 Q120,60 240,90 T480,45 T720,15',
      fill: 'M0,120 Q120,60 240,90 T480,45 T720,15 L720,160 L0,160 Z'
    },
    '90D': {
      rev: '₹14,90,000',
      orders: '428',
      path: 'M0,135 Q120,85 240,110 T480,60 T720,10',
      fill: 'M0,135 Q120,85 240,110 T480,60 T720,10 L720,160 L0,160 Z'
    }
  };

  if (timeframeBtns.length && chartPath) {
    timeframeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        timeframeBtns.forEach((b) => {
          b.classList.remove('bg-zinc-950', 'text-white');
          b.classList.add('bg-zinc-100', 'text-zinc-600');
        });
        btn.classList.add('bg-zinc-950', 'text-white');
        btn.classList.remove('bg-zinc-100', 'text-zinc-600');

        const tf = btn.dataset.tf || '30D';
        const d = chartData[tf];
        if (d) {
          if (grossRevEl) grossRevEl.textContent = d.rev;
          if (ordersEl) ordersEl.textContent = d.orders;
          chartPath.setAttribute('d', d.path);
          if (chartFill) chartFill.setAttribute('d', d.fill);
        }
      });
    });
  }

  // Chart Node Hover Tooltips
  const chartPoints = document.querySelectorAll('.chart-node-point');
  if (chartPoints.length && chartTooltip) {
    chartPoints.forEach((pt) => {
      pt.addEventListener('mouseenter', (e) => {
        const val = pt.dataset.val || '₹42,000';
        const day = pt.dataset.day || 'Day 12';
        chartTooltip.innerHTML = `<strong>${day}:</strong> ${val}`;
        chartTooltip.classList.remove('hidden');
        chartTooltip.style.left = `${pt.cx.baseVal.value - 40}px`;
        chartTooltip.style.top = `${pt.cy.baseVal.value - 38}px`;
      });

      pt.addEventListener('mouseleave', () => {
        chartTooltip.classList.add('hidden');
      });
    });
  }

  // Landing Page: Device Switcher (Desktop vs Mobile Frame)
  const deviceBtns = document.querySelectorAll('.device-switch-btn');
  const viewportFrame = document.getElementById('landing-viewport-frame');

  if (deviceBtns.length && viewportFrame) {
    deviceBtns.forEach((b) => {
      b.addEventListener('click', () => {
        deviceBtns.forEach((db) => {
          db.classList.remove('bg-zinc-950', 'text-white');
          db.classList.add('bg-zinc-100', 'text-zinc-600');
        });
        b.classList.add('bg-zinc-950', 'text-white');
        b.classList.remove('bg-zinc-100', 'text-zinc-600');

        if (b.dataset.device === 'mobile') {
          viewportFrame.style.maxWidth = '360px';
          viewportFrame.classList.add('border-x', 'border-zinc-300', 'shadow-lg');
        } else {
          viewportFrame.style.maxWidth = '100%';
          viewportFrame.classList.remove('border-x', 'border-zinc-300', 'shadow-lg');
        }
      });
    });
  }

  // Interactive Live Lead Form in Landing Mockup
  const leadSubmitBtn = document.getElementById('mock-lead-submit');
  const leadNameInput = document.getElementById('mock-lead-name');
  const leadAlertBox = document.getElementById('mock-lead-success-alert');

  if (leadSubmitBtn && leadNameInput && leadAlertBox) {
    leadSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = leadNameInput.value.trim() || 'Priya Sharma';
      leadAlertBox.innerHTML = `✓ Instant WhatsApp Lead Created for <strong>${val}</strong>! Form validated in 0.2s.`;
      leadAlertBox.classList.remove('hidden');
      setTimeout(() => {
        leadAlertBox.classList.add('hidden');
      }, 4500);
    });
  }

  // AI Assistant Prototype Prompt Chips
  const aiChips = document.querySelectorAll('.ai-prompt-chip');
  const aiChatLog = document.getElementById('ai-chat-messages');

  if (aiChips.length && aiChatLog) {
    aiChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const promptText = chip.textContent.trim();
        const responseData = chip.dataset.response || 'Here is your custom business report.';

        // Append user bubble
        const userBubble = document.createElement('div');
        userBubble.className = 'flex justify-end';
        userBubble.innerHTML = `
          <div class="bg-zinc-950 text-white text-xs p-3 rounded-xl rounded-tr-none max-w-sm">
            ${promptText}
          </div>
        `;
        aiChatLog.appendChild(userBubble);

        // Append loading indicator
        const aiBubble = document.createElement('div');
        aiBubble.className = 'flex justify-start';
        aiBubble.innerHTML = `
          <div class="bg-zinc-100 text-zinc-900 border border-zinc-200 text-xs p-3.5 rounded-xl rounded-tl-none max-w-md space-y-1">
            <span class="inline-block text-[10px] font-mono text-zinc-500 uppercase font-semibold">Simplex AI Copilot</span>
            <p class="leading-relaxed">${responseData}</p>
          </div>
        `;

        setTimeout(() => {
          aiChatLog.appendChild(aiBubble);
          aiChatLog.scrollTop = aiChatLog.scrollHeight;
        }, 350);
      });
    });
  }
}

/* ==========================================================================
   5. Clean FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      faqItems.forEach((other) => {
        const otherContent = other.querySelector('.faq-content');
        const otherIcon = other.querySelector('.faq-icon');
        if (otherContent) otherContent.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   6. Floating WhatsApp Widget (+91 8074215457)
   ========================================================================== */
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('whatsapp-toggle-btn');
  const popupBox = document.getElementById('whatsapp-popup');
  const closeBtn = document.getElementById('whatsapp-popup-close');

  if (!toggleBtn || !popupBox) return;

  function togglePopup() {
    popupBox.classList.toggle('hidden');
  }

  toggleBtn.addEventListener('click', togglePopup);
  if (closeBtn) closeBtn.addEventListener('click', togglePopup);
}

/* ==========================================================================
   7. Scroll Reveal
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   8. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileNav) return;

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   9. Animated Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.dataset.target, 10);
        let start = 0;
        const duration = 1200;
        const stepTime = 25;
        const steps = duration / stepTime;
        const increment = targetValue / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= targetValue) {
            el.textContent = targetValue + (el.dataset.suffix || '');
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start) + (el.dataset.suffix || '');
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => observer.observe(c));
}
