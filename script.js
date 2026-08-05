/* ================================================================
   TRUE BLUE ROOF RESTORATIONS & REPAIRS — Interactive Logic
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sticky Header ── */
  const header = document.getElementById('header');
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init



  /* ── 3. Smooth Scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── 4. Before/After Slider ── */
  const slider = document.getElementById('ba-slider');
  if (slider) {
    const handle = document.getElementById('ba-handle');
    const afterWrap = document.getElementById('ba-after-wrap');
    let isDragging = false;

    const updateSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));

      afterWrap.style.width = `${pct}%`;
      handle.style.left = `${pct}%`;

      // The after image needs to show its full width relative to clip
      const afterImg = afterWrap.querySelector('.ba-slider__img');
      afterImg.style.width = `${(100 / pct) * 100}%`;
    };

    const onPointerDown = (e) => {
      isDragging = true;
      slider.setPointerCapture(e.pointerId);
      updateSlider(e.clientX);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    slider.addEventListener('pointerdown', onPointerDown);
    slider.addEventListener('pointermove', onPointerMove);
    slider.addEventListener('pointerup', onPointerUp);
    slider.addEventListener('pointercancel', onPointerUp);

    // Prevent image drag
    slider.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });

    // Initialise at 50%
    updateSlider(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width / 2);
  }

  /* ── 5. FAQ Accordion ── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    const inner = item.querySelector('.faq-item__answer-inner');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all first
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-item__answer').style.maxHeight = '0';
      });

      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = inner.scrollHeight + 24 + 'px';
      }
    });
  });

  /* ── 6. Quote Form ── */
  // Change LEAD_INBOX to info@trueblueroofrandr.com.au once that mailbox exists.
  // First submission to a new address triggers a one-off confirmation email that
  // must be clicked before anything is delivered.
  const LEAD_INBOX = 'duckthetiler@gmail.com';

  const form = document.getElementById('quote-form');
  const modal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close-btn');

  if (form) {
    const submitBtn = document.getElementById('form-submit-btn');
    const btnLabel = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = Object.fromEntries(new FormData(form).entries());
      payload._subject = `Website quote request — ${payload.Name || 'no name'}, ${payload.Suburb || 'no suburb'}`;
      payload._replyto = payload.Email || '';
      payload._template = 'table';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const res = await fetch(`https://formsubmit.co/ajax/${LEAD_INBOX}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
        form.reset();
      } catch (err) {
        // Never claim a request was sent when it wasn't — give them the phone instead.
        alert(
          "Sorry — that didn't send. Something's gone wrong at our end.\n\n" +
          'Please call us instead:\n' +
          'Lochlan  0451 174 122\n' +
          'Rhys  0435 239 766'
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = btnLabel;
        }
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    });
  }

  // Close modal on overlay click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 7. Scroll Reveal (Intersection Observer) ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ── 8. Animate Stats (count up) ── */
  const statValues = document.querySelectorAll('.hero__stat-value');

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = text.replace(match[1], '');
    const duration = 2000;
    const start = performance.now();

    el.textContent = '0' + suffix;

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statValues.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statValues.forEach(el => statsObserver.observe(el));
  }



});
