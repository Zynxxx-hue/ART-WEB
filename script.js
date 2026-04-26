function syncModalBodyState() {
    const hasOpenModal = Boolean(document.querySelector(".modal.is-open"));
    const mainNav = document.getElementById("mainNav");
    const isMenuOpen = Boolean(mainNav && mainNav.classList.contains("active"));

    document.body.classList.toggle("modal-open", hasOpenModal);
    document.body.style.overflow = hasOpenModal || isMenuOpen ? "hidden" : "auto";
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    document.body.classList.remove("is-leaving");

    document.querySelectorAll(".modal").forEach((otherModal) => {
        if (otherModal !== modal) {
            otherModal.classList.remove("is-open");
            otherModal.style.display = "none";
        }
    });

    modal.querySelectorAll(".explore-section").forEach((section) => {
        section.style.display = "none";
    });

    const modalContent = modal.querySelector(".modal-content");
    const resetModalToTop = () => {
        modal.scrollTop = 0;
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    };

    modal.style.display = "flex";
    requestAnimationFrame(() => {
        modal.classList.add("is-open");
        resetModalToTop();
        setTimeout(resetModalToTop, 80);
        setTimeout(resetModalToTop, 240);
        syncModalBodyState();
    });
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove("is-open");

    setTimeout(() => {
        if (!modal.classList.contains("is-open")) {
            modal.style.display = "none";
        }
        syncModalBodyState();
    }, 220);
}

function toggleExplore(id) {
    const el = document.getElementById(id);
    if (el) {
        if (el.style.display === "none" || el.style.display === "") {
            el.style.display = "block";
          
            setTimeout(() => {
                el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 100);
        } else {
           
            const modalContent = el.closest(".modal-content");
            if (modalContent) {
                modalContent.scrollTo({ top: 0, behavior: "smooth" });
            }
            setTimeout(() => {
                el.style.display = "none";
            }, 300);
        }
    }
}

function setupPageTransitions() {
    if (document.querySelector(".page-transition-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "page-transition-overlay";
    document.body.appendChild(overlay);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");
        if (!link) return;
        if (document.body.classList.contains("modal-open")) return;

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.button && event.button !== 0) return;

        const href = link.getAttribute("href");
        if (!href) return;

        if (
            link.target === "_blank" ||
            link.hasAttribute("download") ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("javascript:")
        ) {
            return;
        }

        let destination;
        try {
            destination = new URL(link.href, window.location.href);
        } catch {
            return;
        }

        if (destination.origin !== window.location.origin) return;
        if (destination.href === window.location.href) return;
        if (document.body.classList.contains("is-leaving")) return;
        if (prefersReducedMotion) return;

        event.preventDefault();
        document.body.classList.add("is-leaving");
        setTimeout(() => {
            window.location.href = destination.href;
        }, 280);
    });

    window.addEventListener("pageshow", () => {
        document.body.classList.remove("is-leaving");
    });
}

window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal") && event.target.classList.contains("is-open")) {
        closeModal(event.target.id);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const activeModal = document.querySelector(".modal.is-open");
    if (activeModal) {
        closeModal(activeModal.id);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setupPageTransitions();

    document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("is-open");
        modal.style.display = "none";
    });

    const header = document.querySelector("header");
    if (header) {
        const syncHeaderOnScroll = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 12);
        };
        syncHeaderOnScroll();
        window.addEventListener("scroll", syncHeaderOnScroll, { passive: true });
    }

   
    const mobileMenu = document.getElementById("mobile-menu");
    const mainNav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll("#mainNav a");

    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener("click", () => {
            mobileMenu.classList.toggle("is-active");
            mainNav.classList.toggle("active");
            syncModalBodyState();
        });

        
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("is-active");
                mainNav.classList.remove("active");
                syncModalBodyState();
            });
        });
    }

    const revealGroups = [
        { selector: ".hero-content", step: 0.06 },
        { selector: ".page-banner-content", step: 0.08 },
        { selector: ".exhibit-row", step: 0.1 },
        { selector: ".exhibit-image-col", step: 0.06 },
        { selector: ".exhibit-text-col", step: 0.08 },
        { selector: ".masterpiece-divider", step: 0.08 },
        { selector: ".about-grid, .about-text, .about-image", step: 0.08 },
        { selector: ".footer-col", step: 0.1 }
    ];

    const revealTargets = [];
    revealGroups.forEach((group) => {
        const elements = document.querySelectorAll(group.selector);
        elements.forEach((el, index) => {
            if (el.dataset.revealBound === "true") return;
            el.dataset.revealBound = "true";
            el.classList.add("reveal-on-scroll");
            el.style.transitionDelay = `${Math.min(index * group.step, 0.45)}s`;
            revealTargets.push(el);
        });
    });

    const revealElement = (el) => {
        el.classList.add("is-visible");
    };

    if ("IntersectionObserver" in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -8% 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealTargets.forEach((el) => observer.observe(el));
    } else {
        revealTargets.forEach(revealElement);
    }
});
