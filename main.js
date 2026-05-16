/* ============================================================
   BRAD SHERMAN — Shared JavaScript
   initScrollNav()     — all gallery pages
   initImgModal()      — painting, drawing, photography
   initDivModal()      — woodworking (background-image divs)
   initScrollFadeIn()  — drawing only
   ============================================================ */

// ── Service worker (PWA / offline support) ────────────────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

// ── Scroll Nav ────────────────────────────────────────────────
function initScrollNav() {
    const nav           = document.getElementById('mainNav');
    const headerPanel   = document.getElementById('headerPanel');
    const topCover      = document.getElementById('topCover');
    const heroTitle     = document.getElementById('heroTitle');
    const heroTitleWrap = document.getElementById('heroTitleWrap');
    const navName       = document.getElementById('navName');
    const navLinks      = document.getElementById('navLinks');
    const navLeft       = document.querySelector('.nav-left');

    const vh          = window.innerHeight;
    const isMobile    = window.innerWidth <= 768;
    const FADE_END    = vh * (isMobile ? 0.18 : 0.25);
    const TITLE_START = vh * (isMobile ? 0.12 : 0.18);
    const TITLE_END   = vh * (isMobile ? 0.32 : 0.42);
    const NAV_SOLID   = vh * (isMobile ? 0.38 : 0.50);
    const COLOR_END   = vh * (isMobile ? 0.12 : 0.18);

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        // — Black panel fade —
        headerPanel.style.opacity =
            y <= 0       ? '1' :
            y < FADE_END ? String(1 - y / FADE_END) : '0';

        // — Title gradient color sweep —
        heroTitle.style.transition = 'none';
        heroTitle.style.backgroundPosition =
            y <= 0        ? '100% 0' :
            y < COLOR_END ? `${100 - (y / COLOR_END) * 70}% 0` : '30% 0';

        // — Title fade + lift —
        if (y <= TITLE_START) {
            heroTitleWrap.style.opacity   = '1';
            heroTitleWrap.style.transform = 'translateY(0)';
        } else if (y < TITLE_END) {
            const p = (y - TITLE_START) / (TITLE_END - TITLE_START);
            heroTitleWrap.style.opacity   = String(1 - p);
            heroTitleWrap.style.transform = `translateY(${-p * 12}px)`;
        } else {
            heroTitleWrap.style.opacity   = '0';
            heroTitleWrap.style.transform = 'translateY(-12px)';
        }

        // — Nav name + links fade —
        if (y <= NAV_SOLID) {
            if (y <= 0) {
                navName.style.opacity  = '1';
                navLinks.style.opacity = '1';
            } else if (y < FADE_END) {
                const p = y / FADE_END;
                navName.style.opacity  = String(1 - p);
                navLinks.style.opacity = String(1 - p);
            } else {
                navName.style.opacity  = '0';
                navLinks.style.opacity = '0';
            }
        }

        // — Top cover color —
        topCover.style.background = y > NAV_SOLID ? '#ffffff' : '#000000';

        // — Nav transitions to solid white —
        if (y > NAV_SOLID) {
            nav.classList.add('is-solid');
            nav.style.background         = '#ffffff';
            nav.style.borderBottom       = '0.5px solid #ebebeb';
            nav.style.alignItems         = 'center';
            nav.style.paddingTop         = isMobile ? '1rem' : '2rem';
            nav.style.paddingBottom      = isMobile ? '0.8rem' : '1rem';
            nav.style.minHeight          = isMobile ? '60px' : 'auto';
            navLeft.style.height         = 'auto';
            navLeft.style.justifyContent = 'flex-start';
            navLeft.style.gap            = '0';
            navName.style.opacity        = '1';
            navLinks.style.opacity       = '1';
            heroTitleWrap.style.display  = 'none';
            nav.querySelectorAll('a:not(.dropdown-content a)').forEach(a => a.style.color = '#000');
        } else {
            nav.classList.remove('is-solid');
            nav.style.background         = 'transparent';
            nav.style.borderBottom       = 'none';
            nav.style.paddingBottom      = isMobile ? '1rem' : '2rem';
            nav.style.minHeight          = 'auto';
            nav.style.alignItems         = 'flex-start';
            navLeft.style.height         = isMobile ? 'calc(18vh - 2rem)' : 'calc(25vh - 4rem)';
            navLeft.style.justifyContent = 'space-between';
            navLeft.style.gap            = '';
            heroTitleWrap.style.display  = '';
            nav.querySelectorAll('a:not(.dropdown-content a)').forEach(a => a.style.color = '#fff');
        }
    }, { passive: true });
}

// ── Modal: <img>-based galleries (painting, drawing, photography) ─
function initImgModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    const modalImage = modal.querySelector('.modal-image');
    const closeBtn   = modal.querySelector('.close-modal');
    const prevBtn    = modal.querySelector('.prev-btn');
    const nextBtn    = modal.querySelector('.next-btn');
    const allImgs    = [...document.querySelectorAll('.work-img')];
    let currentIdx   = 0;

    function openModal(idx) {
        currentIdx = idx;
        modalImage.src = allImgs[idx].src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    function showNext() {
        currentIdx = (currentIdx + 1) % allImgs.length;
        modalImage.src = allImgs[currentIdx].src;
    }
    function showPrev() {
        currentIdx = (currentIdx - 1 + allImgs.length) % allImgs.length;
        modalImage.src = allImgs[currentIdx].src;
    }

    allImgs.forEach((img, i) => img.addEventListener('click', () => openModal(i)));
    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (modal.style.display !== 'flex') return;
        if (e.key === 'Escape')     closeModal();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft')  showPrev();
    });
}

// ── Modal: background-image div galleries (woodworking) ───────────
function initDivModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    const modalImage = modal.querySelector('.modal-image');
    const closeBtn   = modal.querySelector('.close-modal');
    const prevBtn    = modal.querySelector('.prev-btn');
    const nextBtn    = modal.querySelector('.next-btn');
    const workDivs   = [...document.querySelectorAll('.work-image, .works-image')];
    const images     = [];
    let currentIdx   = 0;

    workDivs.forEach(div => {
        const bg = div.style.backgroundImage;
        if (!bg || bg === 'none') return;
        const url = bg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        images.push(url);
        div.addEventListener('click', () => {
            currentIdx = images.indexOf(url);
            modalImage.src = images[currentIdx];
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() { modal.style.display = 'none'; document.body.style.overflow = ''; }
    function showNext()   { currentIdx = (currentIdx + 1) % images.length; modalImage.src = images[currentIdx]; }
    function showPrev()   { currentIdx = (currentIdx - 1 + images.length) % images.length; modalImage.src = images[currentIdx]; }

    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (modal.style.display !== 'flex') return;
        if (e.key === 'Escape')     closeModal();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft')  showPrev();
    });
}

// ── Intersection Observer fade-in (drawing page) ──────────────────
function initScrollFadeIn() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -120px 0px' });

    document.querySelectorAll('.work-section').forEach(s => observer.observe(s));
}
