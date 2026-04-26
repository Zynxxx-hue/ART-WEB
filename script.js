function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        document.body.classList.remove("is-leaving");
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function toggleExplore(id) {
    const el = document.getElementById(id);
    if (el) {
        if (el.style.display === "none" || el.style.display === "") {
            el.style.display = "block";
            // Smooth scroll to the explore section
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            // Scroll back to modal top before collapsing
            const modalContent = el.closest('.modal-content');
            if (modalContent) {
                modalContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setTimeout(() => {
                el.style.display = "none";
            }, 300);
        }
    }
}

// Function for clicking the painting (Photo Zoom Lightbox)
function zoomImage(imgSrc) {
    const zoomModal = document.getElementById("imageZoomModal");
    const zoomImg = document.getElementById("img01");
    if (zoomModal && zoomImg) {
        document.body.classList.remove("is-leaving");
        zoomModal.style.display = "block";
        zoomImg.src = imgSrc;
        document.body.style.overflow = "hidden";
    }
}

function closeImageZoom() {
    const zoomModal = document.getElementById("imageZoomModal");
    if (zoomModal) {
        zoomModal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function setupPageTransitions() {
    if (document.querySelector('.page-transition-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');
        if (!link) return;

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.button && event.button !== 0) return;

        const href = link.getAttribute('href');
        if (!href) return;

        if (
            link.target === '_blank' ||
            link.hasAttribute('download') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:')
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
        if (document.body.classList.contains('is-leaving')) return;

        if (prefersReducedMotion) return;

        event.preventDefault();
        document.body.classList.add('is-leaving');
        setTimeout(() => {
            window.location.href = destination.href;
        }, 280);
    });

    window.addEventListener('pageshow', () => {
        document.body.classList.remove('is-leaving');
    });
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    setupPageTransitions();

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById("mobile-menu");
    const mainNav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll("#mainNav a");

    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener("click", () => {
            mobileMenu.classList.toggle("is-active");
            mainNav.classList.toggle("active");
            document.body.style.overflow = mainNav.classList.contains("active") ? "hidden" : "auto";
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("is-active");
                mainNav.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        });
    }

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply staggered animation delays to exhibit rows
    const rows = document.querySelectorAll(".exhibit-row");
    rows.forEach((row, index) => {
        row.classList.add("reveal-on-scroll");
        row.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(row);
    });

    // Also animate footer columns
    const footerCols = document.querySelectorAll(".footer-col");
    footerCols.forEach((col, index) => {
        col.classList.add("reveal-on-scroll");
        col.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(col);
    });
});
