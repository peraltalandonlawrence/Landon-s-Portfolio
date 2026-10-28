/* ==========================================================================
   Peralta Portfolio — shared shell and interactions
   One source of truth for navigation, footer, pager, the two contact panels
   ("Message me" and "Hire Me") and the certificate filter.
   Plain JS, no dependencies.
   ========================================================================== */

(() => {
  "use strict";

  /* ---------- Configuration ---------- */
  const SITE = {
    owner: "Landon Lawrence A. Peralta",
    firstName: "Landon",
    initials: "LP",
    avatar: "LandonIndex.png",
    email: "peraltalandonlawrence@gmail.com",
  };

  /*
   * Contact delivery. Leave empty until a form service is set up.
   * Paste a public form endpoint (e.g. https://formspree.io/f/xxxxxxx).
   * These endpoints are designed to be public — never put a private API key here.
   * While empty, both forms validate input and hand off to the visitor's email
   * app; they never report a message as sent.
   */
  const CONTACT_ENDPOINT = "https://formspree.io/f/xljjnvev";

  const PAGES = [
    { id: "home", href: "index.html", label: "Home" },
    {
      id: "experience",
      href: "experience.html",
      label: "Experience",
      full: "Professional Experience",
    },
    { id: "organizations", href: "organizations.html", label: "Organizations" },
    { id: "projects", href: "projects.html", label: "Projects" },
    {
      id: "skills",
      href: "skills.html",
      label: "Skills",
      full: "Skills & Technologies",
    },
    { id: "certificates", href: "certificates.html", label: "Certificates" },
  ];

  /* Opportunity types for the Hire Me form */
  const OPPORTUNITIES = [
    {
      id: "internship",
      icon: "🎓",
      title: "Internship / OJT",
      desc: "Practicum or on-the-job training",
      placeholder:
        "Role, department, duration or required hours, and setup (on-site, hybrid or remote)…",
    },
    {
      id: "employment",
      icon: "💼",
      title: "Employment",
      desc: "Full-time or part-time position",
      placeholder:
        "Position, key responsibilities, work arrangement and location…",
    },
    {
      id: "freelance",
      icon: "🛠️",
      title: "Freelance / Contract",
      desc: "Project-based or short-term work",
      placeholder:
        "What you need built or managed, scope and expected timeline…",
    },
    {
      id: "speaking",
      icon: "🎤",
      title: "Speaking Engagement",
      desc: "Seminar, workshop, webinar or talk",
      placeholder:
        "Event name, topic, audience, format (in-person or online) and venue…",
    },
    {
      id: "event",
      icon: "🤝",
      title: "Event Collaboration",
      desc: "Hackathon, judging, mentoring or partnership",
      placeholder:
        "Event name, the role you have in mind, date and organizers…",
    },
    {
      id: "other",
      icon: "✨",
      title: "Something Else",
      desc: "Not on the list? Tell me about it",
      placeholder: "Tell me what you have in mind…",
    },
  ];

  const STARTERS = [
    { icon: "👋", label: "Just saying hi", text: "Hi Landon! " },
    {
      icon: "💡",
      label: "Question about a project",
      text: "Hi Landon, I have a question about one of your projects: ",
    },
    {
      icon: "🤝",
      label: "Collaboration idea",
      text: "Hi Landon, I have an idea we could work on together: ",
    },
  ];

  const ICONS = {
    message:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M8.5 11h7M8.5 14.5h4"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3 10 14"/><path d="m21 3-7 18-4-7-7-4 18-7Z"/></svg>',
  };

  const root = document.documentElement;
  root.classList.add("js");

  const currentId = document.body.dataset.page || "home";
  const currentIndex = Math.max(
    0,
    PAGES.findIndex((p) => p.id === currentId),
  );
  const pad = (n) => String(n).padStart(2, "0");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const firstWord = (s) => s.trim().split(/\s+/)[0] || "there";

  /* ---------- Header + navigation ---------- */
  function renderHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const links = PAGES.map((p, i) => {
      const current = p.id === currentId ? ' aria-current="page"' : "";
      const text = p.full
        ? `<span class="site-nav__full">${p.full}</span><span class="site-nav__short" aria-hidden="true">${p.label}</span>`
        : p.label;
      return `<li><a class="site-nav__link" href="${p.href}"${current}><span class="site-nav__index" aria-hidden="true">${pad(i + 1)}</span>${text}</a></li>`;
    }).join("");

    header.innerHTML = `
      <div class="container site-header__inner">
        <a class="brand" href="index.html" aria-label="Peralta — home">
          <span class="brand__mark">Peralta</span>
          <span class="brand__tag" aria-hidden="true">/ portfolio</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <span class="nav-toggle__bars" aria-hidden="true"></span>
          <span class="nav-toggle__text">Menu</span>
        </button>
        <nav class="site-nav" id="site-nav" aria-label="Main">
          <ul class="site-nav__list" role="list">${links}</ul>
        </nav>
      </div>`;

    const toggle = header.querySelector(".nav-toggle");
    const nav = header.querySelector(".site-nav");
    const desktop = window.matchMedia("(min-width: 64em)");

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle__text").textContent = open
        ? "Close"
        : "Menu";
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () =>
      setOpen(toggle.getAttribute("aria-expanded") !== "true"),
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !header.contains(e.target))
        setOpen(false);
    });

    desktop.addEventListener("change", () => setOpen(false));
  }

  /* ---------- Previous / next pager ---------- */
  function renderPager() {
    const pager = document.querySelector("[data-pager]");
    if (!pager) return;
    const prev = PAGES[currentIndex - 1];
    const next = PAGES[currentIndex + 1];
    let html = "";
    if (prev) {
      html += `<a class="pager__link" href="${prev.href}" rel="prev"><span class="pager__dir">← Previous · ${pad(currentIndex)}</span><span class="pager__label">${prev.full || prev.label}</span></a>`;
    }
    if (next) {
      html += `<a class="pager__link pager__link--next" href="${next.href}" rel="next"><span class="pager__dir">Next · ${pad(currentIndex + 2)} →</span><span class="pager__label">${next.full || next.label}</span></a>`;
    }
    pager.innerHTML = html;
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    footer.innerHTML = `
      <div class="container site-footer__inner">
        <p>© ${new Date().getFullYear()} ${SITE.owner}</p>
        <p><a class="text-link" href="mailto:${SITE.email}">${SITE.email}</a></p>
        <p class="site-footer__mono" aria-hidden="true">${pad(currentIndex + 1)} / ${pad(PAGES.length)}</p>
      </div>`;
  }

  /* ---------- Scroll reveals ---------- */
  function initReveals() {
    const targets = document.querySelectorAll("[data-reveal], .meters");
    if (!targets.length) return;

    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Image fallbacks ----------
     data-fallback-src lets an image try a second file name (e.g. .jpg vs .png)
     before showing the neutral placeholder. */
  function initImageFallbacks() {
    document.querySelectorAll("main img").forEach((img) => {
      const fail = () => {
        const alt = img.dataset.fallbackSrc;
        if (alt && img.getAttribute("src") !== alt) {
          img.src = alt;
          return;
        }
        img.classList.add("is-missing");
      };
      img.addEventListener("error", fail);
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src"))
        fail();
    });
  }

  /* ---------- Focus helpers ---------- */
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapTab(container, e) {
    if (e.key !== "Tab") return;
    const items = [...container.querySelectorAll(FOCUSABLE)].filter(
      (el) =>
        el.offsetParent !== null || el.classList.contains("choice__input"),
    );
    // Radios in a group are one tab stop: keep only the checked one (or the first).
    const filtered = items.filter((el) => {
      if (el.type !== "radio") return true;
      const group = items.filter(
        (r) => r.type === "radio" && r.name === el.name,
      );
      const checked = group.find((r) => r.checked);
      return checked ? el === checked : el === group[0];
    });
    if (!filtered.length) return;
    const first = filtered[0];
    const last = filtered[filtered.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 5) return "Hello, night owl";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const avatarHtml = () =>
    `<span class="avatar" aria-hidden="true">${SITE.initials}<img src="${SITE.avatar}" alt="" onerror="this.remove()" /></span>`;

  /* ---------- Shared panel machinery ---------- */
  const scrim = document.createElement("div");
  scrim.className = "contact-scrim";

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "contact-launcher";
  launcher.setAttribute("aria-haspopup", "dialog");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "contact-panel");
  launcher.innerHTML = `${ICONS.message}<span class="contact-launcher__label">Message me</span><span class="sr-only"> — open contact form</span>`;

  let activePanel = null;
  const shellParts = () =>
    [
      document.getElementById("site-header"),
      document.querySelector("main"),
      document.getElementById("site-footer"),
      document.querySelector(".skip-link"),
    ].filter(Boolean);

  /**
   * Build a contact panel.
   * cfg = { id, className, titleId, head(), body, rules, onOpen(), build(), subject(), mailBody(), messages }
   */
  function createPanel(cfg) {
    const panel = document.createElement("div");
    panel.className = `contact-panel ${cfg.className || ""}`.trim();
    panel.id = cfg.id;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", cfg.titleId);
    panel.innerHTML = `
      <div class="contact-panel__head">${cfg.head()}
        <button class="icon-btn" type="button" data-close aria-label="Close">${ICONS.close}</button>
      </div>
      <div class="contact-panel__body">
        <form class="contact-form" novalidate>
          ${cfg.body}
          <div class="hp-field" aria-hidden="true">
            <label for="${cfg.id}-company-hp">Company</label>
            <input id="${cfg.id}-company-hp" name="hp" type="text" tabindex="-1" autocomplete="off" />
          </div>
          <button class="btn btn--primary" type="submit">${cfg.submitLabel}</button>
          <div class="form-status" role="status" aria-live="polite"></div>
        </form>
        <p class="contact-panel__alt">Prefer email? <a class="text-link" href="mailto:${SITE.email}">${SITE.email}</a></p>
      </div>`;
    document.body.append(panel);

    const form = panel.querySelector("form");
    const submit = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".form-status");
    let lastTrigger = null;

    const open = (trigger) => {
      if (activePanel && activePanel !== api) activePanel.close(false);
      lastTrigger = trigger || launcher;
      const head = panel.querySelector(".contact-panel__head");
      head.querySelector("[data-head]").outerHTML = cfg.head().trim(); // fresh greeting each time
      cfg.onOpen && cfg.onOpen(panel);
      panel.classList.add("is-open");
      scrim.classList.add("is-open");
      launcher.classList.add("is-hidden");
      if (cfg.id === "contact-panel")
        launcher.setAttribute("aria-expanded", "true");
      shellParts().forEach((el) => (el.inert = true));
      launcher.inert = true;
      activePanel = api;
      const focusTarget = cfg.firstFocus
        ? cfg.firstFocus(form)
        : form.querySelector("input, textarea");
      // Only move focus if the visitor (or autofill) hasn't already started inside the panel.
      setTimeout(
        () => {
          if (!panel.contains(document.activeElement)) focusTarget.focus();
        },
        prefersReducedMotion.matches ? 0 : 60,
      );
    };

    const close = (restoreFocus = true) => {
      panel.classList.remove("is-open");
      scrim.classList.remove("is-open");
      launcher.classList.remove("is-hidden");
      launcher.setAttribute("aria-expanded", "false");
      shellParts().forEach((el) => (el.inert = false));
      launcher.inert = false;
      activePanel = null;
      if (restoreFocus)
        (lastTrigger && document.contains(lastTrigger)
          ? lastTrigger
          : launcher
        ).focus();
    };

    panel
      .querySelector("[data-close]")
      .addEventListener("click", () => close());
    panel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
      trapTab(panel, e);
    });

    /* Validation */
    const keys = Object.keys(cfg.rules);
    const target = (key) => form.querySelector(`[data-field="${key}"]`);
    const validateField = (key) => {
      const msg = cfg.rules[key](form);
      const err = panel.querySelector(`#${cfg.id}-${key}-err`);
      err.textContent = msg;
      target(key).setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };

    keys.forEach((key) => {
      const el = target(key);
      el.addEventListener("focusout", (e) => {
        if (el.contains(e.relatedTarget)) return;
        const input = el.matches("input, textarea") ? el : null;
        if (input && input.value) validateField(key);
      });
      el.addEventListener("input", () => {
        if (el.getAttribute("aria-invalid") === "true") validateField(key);
      });
      el.addEventListener("change", () => {
        if (el.getAttribute("aria-invalid") === "true") validateField(key);
      });
    });

    const setStatus = (type, html) => {
      status.className = `form-status${type ? ` form-status--${type}` : ""}`;
      status.innerHTML = html;
    };

    const setBusy = (busy) => {
      submit.disabled = busy;
      submit.setAttribute("aria-busy", String(busy));
      submit.innerHTML = busy
        ? '<span class="spinner" aria-hidden="true"></span>Sending…'
        : cfg.submitLabel;
    };

    const mailtoHref = (data) =>
      `mailto:${SITE.email}?subject=${encodeURIComponent(cfg.subject(data))}&body=${encodeURIComponent(cfg.mailBody(data))}`;

    const mailButton = (data) =>
      `<a class="btn btn--ghost" href="${escapeHtml(mailtoHref(data))}">${ICONS.mail}Open in email app</a>`;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setStatus("", "");

      const okAll = keys.map(validateField).every(Boolean);
      if (!okAll) {
        const bad = keys
          .map(target)
          .find((el) => el.getAttribute("aria-invalid") === "true");
        (bad.matches("input, textarea")
          ? bad
          : bad.querySelector("input")
        ).focus();
        return;
      }
      if (form.elements.hp.value) return; // honeypot: stop bots without faking success

      const data = cfg.build(form);
      const name = escapeHtml(firstWord(data.name));

      if (!CONTACT_ENDPOINT) {
        setStatus("info", cfg.messages.notConfigured(name) + mailButton(data));
        return;
      }

      setBusy(true);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ ...data, _subject: cfg.subject(data) }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        keys.forEach((k) => target(k).removeAttribute("aria-invalid"));
        cfg.onReset && cfg.onReset(panel);
        setStatus(
          "success",
          cfg.messages.success(name, escapeHtml(data.email)),
        );
      } catch (err) {
        setStatus("error", cfg.messages.error(name) + mailButton(data));
      } finally {
        clearTimeout(timer);
        setBusy(false);
      }
    });

    const api = { open, close, panel };
    return api;
  }

  /* ---------- "Message me" panel ---------- */
  function initMessagePanel() {
    const ID = "contact-panel";
    const MAX = 2000;
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const starters = STARTERS.map(
      (s, i) =>
        `<button class="starter" type="button" data-starter="${i}"><span aria-hidden="true">${s.icon}</span> ${s.label}</button>`,
    ).join("");

    const api = createPanel({
      id: ID,
      titleId: `${ID}-title`,
      submitLabel: `${ICONS.send}Send message`,
      head: () => `
        <div data-head class="contact-panel__hello">
          ${avatarHtml()}
          <div>
            <span class="eyebrow">Direct line to ${SITE.firstName}</span>
            <h2 class="contact-panel__title" id="${ID}-title">${greeting()}! <span class="wave" aria-hidden="true">👋</span></h2>
          </div>
        </div>`,
      body: `
        <p class="contact-panel__lede">I'm ${SITE.firstName}. Questions, ideas, feedback on a project, or just a quick hello — leave a note and I'll write back to the email you share.</p>
        <div class="field">
          <label for="${ID}-name">What should I call you? <span class="field__req">(required)</span></label>
          <input id="${ID}-name" data-field="name" name="name" type="text" autocomplete="name" required maxlength="100" placeholder="e.g. Juan dela Cruz" aria-describedby="${ID}-name-err" />
          <p class="field__error" id="${ID}-name-err"></p>
        </div>
        <div class="field">
          <label for="${ID}-email">Where can I reach you? <span class="field__req">(required)</span></label>
          <input id="${ID}-email" data-field="email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="160" placeholder="you@example.com" aria-describedby="${ID}-email-err" />
          <p class="field__error" id="${ID}-email-err"></p>
        </div>
        <div class="field">
          <label for="${ID}-message">What's on your mind? <span class="field__req">(required)</span></label>
          <p class="field__hint" id="${ID}-starters-hint">Need a nudge? Pick a starter:</p>
          <div class="starters" role="group" aria-labelledby="${ID}-starters-hint">${starters}</div>
          <textarea id="${ID}-message" data-field="message" name="message" required minlength="10" maxlength="${MAX}" placeholder="Type away…" aria-describedby="${ID}-message-err"></textarea>
          <p class="counter" aria-hidden="true"><span data-count>0</span> / ${MAX}</p>
          <p class="field__error" id="${ID}-message-err"></p>
        </div>`,
      rules: {
        name: (f) =>
          f.elements.name.value.trim()
            ? ""
            : "I'd love to know who I'm talking to — please add your name.",
        email: (f) => {
          const v = f.elements.email.value.trim();
          if (!v) return "Please add your email so I can reply.";
          return EMAIL_RE.test(v)
            ? ""
            : "That email doesn't look quite right — try something like name@example.com.";
        },
        message: (f) => {
          const v = f.elements.message.value.trim();
          if (!v) return "Don't be shy — write a message.";
          return v.length < 10
            ? "Just a little more, please — at least 10 characters."
            : "";
        },
      },
      build: (f) => ({
        kind: "message",
        name: f.elements.name.value.trim(),
        email: f.elements.email.value.trim(),
        message: f.elements.message.value.trim(),
      }),
      subject: (d) => `Portfolio message from ${d.name}`,
      mailBody: (d) => `${d.message}\n\n— ${d.name} (${d.email})`,
      onReset: (panel) =>
        (panel.querySelector("[data-count]").textContent = "0"),
      messages: {
        notConfigured: (n) =>
          `<strong>Not sent yet, ${n}.</strong>Direct sending isn't switched on for this site, so your message hasn't gone anywhere. Tap below to send it from your email app — everything's already filled in.`,
        success: (n, email) =>
          `<strong>Message sent! Thanks, ${n} 🎉</strong>I'll get back to you at ${email}.`,
        error: (n) =>
          `<strong>Sorry ${n}, your message wasn't sent.</strong>Something went wrong on the way. Your text is still here — try again, or send it by email instead.`,
      },
    });

    const form = api.panel.querySelector("form");
    const textarea = form.elements.message;
    const count = api.panel.querySelector("[data-count]");
    const updateCount = () => (count.textContent = textarea.value.length);
    textarea.addEventListener("input", updateCount);

    const starterTexts = STARTERS.map((s) => s.text);
    api.panel.querySelectorAll("[data-starter]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const text = STARTERS[Number(btn.dataset.starter)].text;
        const current = textarea.value;
        // Swap the starter if the visitor hasn't typed beyond it; otherwise leave their words alone.
        if (!current.trim() || starterTexts.includes(current)) {
          textarea.value = text;
          // Let the counter and any "please write a message" error react as if typed.
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        }
        // Don't scroll: the starter buttons should stay put under the pointer.
        textarea.focus({ preventScroll: true });
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length,
        );
      }),
    );

    launcher.addEventListener("click", () => api.open(launcher));
    document.querySelectorAll("[data-open-contact]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        api.open(el);
      }),
    );
    return api;
  }

  /* ---------- "Hire Me" panel ---------- */
  function initHirePanel() {
    const triggers = document.querySelectorAll("[data-open-hire]");
    if (!triggers.length) return null;

    const ID = "hire-panel";
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const choices = OPPORTUNITIES.map(
      (o) => `
        <label class="choice">
          <input class="choice__input" type="radio" name="type" value="${o.id}" />
          <span class="choice__box">
            <span class="choice__icon" aria-hidden="true">${o.icon}</span>
            <span><span class="choice__title">${o.title}</span><span class="choice__desc">${o.desc}</span></span>
          </span>
        </label>`,
    ).join("");

    const api = createPanel({
      id: ID,
      className: "contact-panel--hire",
      titleId: `${ID}-title`,
      submitLabel: `${ICONS.send}Send inquiry`,
      head: () => `
        <div data-head class="contact-panel__hello">
          ${avatarHtml()}
          <div>
            <span class="eyebrow">Opportunities</span>
            <h2 class="contact-panel__title" id="${ID}-title">Let's work together</h2>
          </div>
        </div>`,
      firstFocus: (f) =>
        f.querySelector('input[name="type"]:checked') ||
        f.querySelector('input[name="type"]'),
      body: `
        <p class="contact-panel__lede">Thanks for thinking of me! Tell me a bit about the opportunity and I'll get back to you.</p>
        <fieldset class="choice-group" data-field="type" aria-describedby="${ID}-type-err">
          <legend>What kind of opportunity is this? <span class="field__req">(required)</span></legend>
          <div class="choices">${choices}</div>
          <p class="field__error" id="${ID}-type-err"></p>
        </fieldset>
        <div class="field-row">
          <div class="field">
            <label for="${ID}-name">Your name <span class="field__req">(required)</span></label>
            <input id="${ID}-name" data-field="name" name="name" type="text" autocomplete="name" required maxlength="100" aria-describedby="${ID}-name-err" />
            <p class="field__error" id="${ID}-name-err"></p>
          </div>
          <div class="field">
            <label for="${ID}-email">Your email <span class="field__req">(required)</span></label>
            <input id="${ID}-email" data-field="email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="160" aria-describedby="${ID}-email-err" />
            <p class="field__error" id="${ID}-email-err"></p>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="${ID}-org">Company or organization <span class="field__req">(optional)</span></label>
            <input id="${ID}-org" name="organization" type="text" autocomplete="organization" maxlength="140" />
          </div>
          <div class="field">
            <label for="${ID}-timeline"><span data-timeline-label>Target start date</span> <span class="field__req">(optional)</span></label>
            <input id="${ID}-timeline" name="timeline" type="text" maxlength="100" placeholder="e.g. January 2027" />
          </div>
        </div>
        <div class="field">
          <label for="${ID}-message">Details <span class="field__req">(required)</span></label>
          <textarea id="${ID}-message" data-field="message" name="message" required minlength="10" maxlength="3000" placeholder="Pick an opportunity type above and I'll suggest what to include…" aria-describedby="${ID}-message-err"></textarea>
          <p class="field__error" id="${ID}-message-err"></p>
        </div>`,
      rules: {
        type: (f) =>
          f.elements.type.value ? "" : "Please choose the type of opportunity.",
        name: (f) =>
          f.elements.name.value.trim() ? "" : "Please add your name.",
        email: (f) => {
          const v = f.elements.email.value.trim();
          if (!v) return "Please add your email so I can reply.";
          return EMAIL_RE.test(v)
            ? ""
            : "Enter a valid email, like name@example.com.";
        },
        message: (f) => {
          const v = f.elements.message.value.trim();
          if (!v) return "Please share a few details about the opportunity.";
          return v.length < 10
            ? "A little more detail, please — at least 10 characters."
            : "";
        },
      },
      build: (f) => {
        const type = OPPORTUNITIES.find((o) => o.id === f.elements.type.value);
        return {
          kind: "hire",
          type: type.title,
          name: f.elements.name.value.trim(),
          email: f.elements.email.value.trim(),
          organization: f.elements.organization.value.trim(),
          timeline: f.elements.timeline.value.trim(),
          message: f.elements.message.value.trim(),
        };
      },
      subject: (d) =>
        `[${d.type}] Opportunity from ${d.name}${d.organization ? ` (${d.organization})` : ""}`,
      mailBody: (d) =>
        [
          `Opportunity type: ${d.type}`,
          d.organization ? `Organization: ${d.organization}` : null,
          d.timeline ? `Date / timeline: ${d.timeline}` : null,
          "",
          d.message,
          "",
          `— ${d.name} (${d.email})`,
        ]
          .filter((l) => l !== null)
          .join("\n"),
      onReset: () => syncType(),
      messages: {
        notConfigured: (n) =>
          `<strong>Not sent yet, ${n}.</strong>Direct sending isn't switched on for this site, so your inquiry hasn't gone anywhere. Tap below to send it from your email app — all your details are already filled in.`,
        success: (n, email) =>
          `<strong>Inquiry sent! Thank you, ${n} 🙌</strong>I'll review the details and reply to ${email}.`,
        error: (n) =>
          `<strong>Sorry ${n}, your inquiry wasn't sent.</strong>Something went wrong on the way. Your details are still here — try again, or send them by email instead.`,
      },
    });

    const form = api.panel.querySelector("form");
    const timelineLabel = api.panel.querySelector("[data-timeline-label]");
    const timelineInput = form.elements.timeline;
    const details = form.elements.message;

    function syncType() {
      const type = OPPORTUNITIES.find((o) => o.id === form.elements.type.value);
      const isEvent = type && (type.id === "speaking" || type.id === "event");
      timelineLabel.textContent = isEvent ? "Event date" : "Target start date";
      timelineInput.placeholder = isEvent
        ? "e.g. November 15, 2026"
        : "e.g. January 2027";
      details.placeholder = type
        ? type.placeholder
        : "Pick an opportunity type above and I'll suggest what to include…";
    }
    form.addEventListener("change", (e) => {
      if (e.target.name === "type") syncType();
    });

    triggers.forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        api.open(el);
      }),
    );
    return api;
  }

  function initContact() {
    document.body.append(scrim, launcher);
    const panels = [initMessagePanel(), initHirePanel()].filter(Boolean);
    scrim.addEventListener("click", () => activePanel && activePanel.close());
    return panels;
  }

  /* ---------- Certificate filter ---------- */
  function initCertFilter() {
    const bar = document.querySelector("[data-cert-filter]");
    if (!bar) return;
    const items = [...document.querySelectorAll(".cert[data-category]")];
    const buttons = [...bar.querySelectorAll("[data-filter]")];
    const empty = document.querySelector("[data-cert-empty]");
    const live = document.querySelector("[data-cert-status]");
    const valid = buttons.map((b) => b.dataset.filter);
    const labelOf = (f) =>
      buttons.find((b) => b.dataset.filter === f).dataset.label;
    const matches = (item, f) => f === "all" || item.dataset.category === f;

    buttons.forEach((b) => {
      b.querySelector(".filter__count").textContent = items.filter((i) =>
        matches(i, b.dataset.filter),
      ).length;
    });

    const apply = (f, { announce = false, updateUrl = false } = {}) => {
      if (!valid.includes(f)) f = "all";
      buttons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.filter === f)),
      );
      let shown = 0;
      items.forEach((item) => {
        const show = matches(item, f);
        const wasHidden = item.hidden;
        item.hidden = !show;
        if (show) {
          shown++;
          item.classList.add("is-visible");
          if (wasHidden || announce) {
            item.classList.remove("is-entering");
            void item.offsetWidth; // restart the entrance animation
            item.classList.add("is-entering");
          }
        }
      });
      empty.hidden = shown !== 0;
      if (announce) {
        live.textContent =
          shown === 0
            ? `No certificates in ${labelOf(f)} yet.`
            : `Showing ${shown} certificate${shown === 1 ? "" : "s"}${f === "all" ? "" : ` in ${labelOf(f)}`}.`;
      }
      if (updateUrl) {
        const url = f === "all" ? location.pathname + location.search : `#${f}`;
        history.replaceState(null, "", url);
      }
    };

    buttons.forEach((b) =>
      b.addEventListener("click", () =>
        apply(b.dataset.filter, { announce: true, updateUrl: true }),
      ),
    );
    window.addEventListener("hashchange", () =>
      apply(location.hash.slice(1), { announce: true }),
    );
    apply(location.hash.slice(1) || "all");
  }

  /* ---------- Certificate lightbox ---------- */
  function initLightbox() {
    const triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length || typeof HTMLDialogElement === "undefined") return;

    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-labelledby", "lightbox-title");
    dialog.innerHTML = `
      <div class="lightbox__bar">
        <p class="lightbox__title" id="lightbox-title"></p>
        <button class="icon-btn" type="button" aria-label="Close certificate view">${ICONS.close}</button>
      </div>
      <img alt="" />`;
    document.body.append(dialog);

    const img = dialog.querySelector("img");
    const title = dialog.querySelector(".lightbox__title");
    let opener = null;

    dialog
      .querySelector("button")
      .addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => opener && opener.focus());

    triggers.forEach((btn) =>
      btn.addEventListener("click", () => {
        const source = btn.querySelector("img");
        opener = btn;
        img.src = source.currentSrc || source.src;
        img.alt = source.alt;
        title.textContent = btn.dataset.lightbox;
        dialog.showModal();
      }),
    );
  }

  /* ---------- Boot ---------- */
  renderHeader();
  renderPager();
  renderFooter();
  initImageFallbacks();
  initCertFilter();
  initReveals();
  initContact();
  initLightbox();
})();
