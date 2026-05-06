(function(){
    function safeRun(fn){ try{ fn(); }catch(e){} }
/* --- Toggle Scroll to Top Button --- */
    function initScrollToTop() {
        const canvas = document.querySelector('.youtube-canvas');
        const backToTopBtn = document.getElementById('backToTop');
        if (canvas && backToTopBtn) {
            canvas.addEventListener('scroll', () => {
                if (canvas.scrollTop > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });
        }
    }

    /* --- Animated Counters Function --- */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target');
                    let count = 0;
                    const updateCount = () => {
                        const inc = target / 50; 
                        if (count < target) {
                            count += inc;
                            entry.target.innerText = "+" + Math.ceil(count);
                            setTimeout(updateCount, 30);
                        } else {
                            entry.target.innerText = "+" + target;
                        }
                    };
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    /* --- Re-define functions lost during file corruption --- */
    if(typeof window.renderPoems !== 'function') {
        window.renderPoems = function() {
            var container = document.getElementById('poemsContainer');
            if(!container || typeof poemsData === 'undefined' || !poemsData) return;
            var html = '';
            poemsData.forEach(function(poem) {
                html += '<div class="poem-card searchable-item">' +
                        '<div class="poem-badge">' + poem.occasion + '</div>' + 
                        '<h3 class="poem-title">' + poem.title + '</h3>' + 
                        '<div class="poem-excerpt">' + poem.text + '</div>' + 
                        '<div class="poem-full-text">' + poem.text + '</div>' + 
                        '<button class="read-more-btn" onclick="togglePoem(this)">قراءة المزيد <i class="fas fa-chevron-down" style="font-size:10px; margin-right:4px;"></i></button>' + 
                        '</div>';
            });
            container.innerHTML = html;
        };
        
        window.togglePoem = function(btn) {
            var card = btn.closest('.poem-card');
            if(card) {
                card.classList.toggle('expanded');
                var expanded = card.classList.contains('expanded');
                btn.innerHTML = expanded ? 'عرض أقل <i class="fas fa-chevron-up" style="font-size:10px; margin-inline-end:4px;"></i>' : 'قراءة المزيد <i class="fas fa-chevron-down" style="font-size:10px; margin-inline-end:4px;"></i>';
            }
        };
    }

    /* --- Re-define critical UI functions if broken --- */
        const __atheerTabRouteMap = {
        'home-section': '',
        'services-section': 'services',
        'poems-section': 'poems',
        'offers-section': 'offers',
        'contact-section': 'contact',
        'search-section': 'search',
        'audio-works': 'audio',
        'schools-works': 'schools',
        'zaffat-works': 'zaffat',
        'shilat-works': 'shilat',
        'events-works': 'events',
        'music-works': 'music',
        'corporate-identities-works': 'identities',
        'nomusic-works': 'nomusic',
        'video-works': 'video',
        'podcast-works': 'podcast',
        'editing-works': 'editing',
        'poetry-recitation-works': 'recitation',
        'poems-composing-works': 'composing',
        'about-us': 'about',
        'terms-section': 'terms',
        'privacy-section': 'privacy',
        'faq-section': 'faq'
    };

    const __atheerRouteTabMap = Object.keys(__atheerTabRouteMap).reduce(function(acc, key) {
        const slug = __atheerTabRouteMap[key];
        if (slug) acc[slug] = key;
        return acc;
    }, {});

    function __navTabMatchesSection(btn, sectionId) {
        if (!btn || !sectionId) return false;

        const groupedSections = (btn.getAttribute('data-section-group') || '')
            .split(',')
            .map(function(value) { return value.trim(); })
            .filter(Boolean);

        if (groupedSections.indexOf(sectionId) !== -1) {
            return true;
        }

        const onclick = btn.getAttribute('onclick') || '';
        return onclick.indexOf("'" + sectionId + "'") !== -1 || onclick.indexOf('"' + sectionId + '"') !== -1;
    }

    function __findNavTabBySection(sectionId) {
        const tabs = Array.from(document.querySelectorAll('.main-navigation .nav-tab'));
        return tabs.find(function(btn) {
            return __navTabMatchesSection(btn, sectionId);
        }) || null;
    }

    function __getRouteBasePath() {
        const pathname = window.location.pathname || '/';
        const segments = pathname.split('/').filter(Boolean);
        if (!segments.length) return '';

        const last = (segments[segments.length - 1] || '').toLowerCase();
        const isRouteSegment = !!__atheerRouteTabMap[last];
        const isIndexFile = last === 'index.html';
        const baseSegments = (isRouteSegment || isIndexFile) ? segments.slice(0, -1) : segments;

        return baseSegments.length ? '/' + baseSegments.join('/') : '';
    }

    function __getPathForTab(sectionId) {
        const slug = __atheerTabRouteMap[sectionId] || '';
        const basePath = __getRouteBasePath();
        if (!slug) return basePath || '/';
        return (basePath || '') + '/' + slug;
    }

    function __readTabFromLocation() {
        const pathname = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
        const segments = pathname.split('/').filter(Boolean);
        let last = segments.length ? (segments[segments.length - 1] || '').toLowerCase() : '';
        if (last === 'index.html') last = '';

        if (last && __atheerRouteTabMap[last]) {
            return __atheerRouteTabMap[last];
        }

        const hashSlug = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
        if (hashSlug && __atheerRouteTabMap[hashSlug]) {
            return __atheerRouteTabMap[hashSlug];
        }

        let queryTab = '';
        try {
            queryTab = new URLSearchParams(window.location.search || '').get('tab') || '';
        } catch (e) {
            queryTab = '';
        }
        queryTab = queryTab.toLowerCase();

        if (queryTab && __atheerRouteTabMap[queryTab]) {
            return __atheerRouteTabMap[queryTab];
        }

        return 'home-section';
    }

    function __syncUrlWithTab(sectionId, replaceState) {
        if (!window.history || typeof window.history.pushState !== 'function') return;

        const nextPath = __getPathForTab(sectionId);
        const currentPath = window.location.pathname || '/';
        if (nextPath === currentPath) return;

        const method = replaceState ? 'replaceState' : 'pushState';
        try {
            window.history[method]({ sectionId: sectionId }, '', nextPath);
        } catch (e) {}
    }

    window.applyTabRouteFromLocation = function(replaceUrl) {
        let sectionId = __readTabFromLocation();
        if (!document.getElementById(sectionId)) sectionId = 'home-section';

        const tabBtn = __findNavTabBySection(sectionId);
        window.__atheerApplyingRoute = true;
        if (typeof window.switchTab === 'function') {
            window.switchTab(sectionId, tabBtn);
        }
        window.__atheerApplyingRoute = false;

        __syncUrlWithTab(sectionId, replaceUrl !== false);
    };

    if (!window.__atheerTabRouteEventsBound) {
        window.__atheerTabRouteEventsBound = true;
        window.addEventListener('popstate', function() {
            if (typeof window.applyTabRouteFromLocation === 'function') {
                window.applyTabRouteFromLocation(false);
            }
        });
    }
    if(typeof window.switchTab !== 'function') {
        window.switchTab = function(tabId, element) {
            document.querySelectorAll('.content-section').forEach(function(s){ s.classList.remove('active-section'); });
            document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
            if (typeof window.closeWorksGalleryMenu === 'function') {
                window.closeWorksGalleryMenu();
            }

            var target = document.getElementById(tabId);
            if(target) target.classList.add('active-section');

            var navBtn = element || __findNavTabBySection(tabId);
            if(navBtn) navBtn.classList.add('active');

            if (!window.__atheerApplyingRoute) {
                __syncUrlWithTab(tabId, false);
            }

            /* scroll to top */
            var canvas = document.querySelector('.youtube-canvas');
            if(canvas) canvas.scrollTo({top:0, behavior:'smooth'});

            /* re-trigger reveal */
            setTimeout(function(){
                document.querySelectorAll('.reveal:not(.active)').forEach(function(el){ el.classList.add('active'); });
                document.querySelectorAll('.reveal-left:not(.visible)').forEach(function(el){ el.classList.add('visible'); });
            }, 400);
        };
    }

    if (typeof window.closeWorksGalleryMenu !== 'function') {
        window.closeWorksGalleryMenu = function() {
            var navEl = document.querySelector('.main-navigation');
            var toggleBtn = document.getElementById('gallery-tab');
            var dropdownEl = document.getElementById('worksGalleryDropdown');

            if (navEl) navEl.classList.remove('gallery-menu-open');
            if (toggleBtn) {
                toggleBtn.classList.remove('is-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
            if (dropdownEl) {
                dropdownEl.setAttribute('aria-hidden', 'true');
            }
        };
    }

    if (typeof window.toggleWorksGalleryMenu !== 'function') {
        window.toggleWorksGalleryMenu = function(buttonEl) {
            if (typeof window.initWorksGalleryDropdown === 'function') {
                window.initWorksGalleryDropdown();
            }

            var navEl = document.querySelector('.main-navigation');
            var toggleBtn = buttonEl || document.getElementById('gallery-tab');
            var dropdownEl = document.getElementById('worksGalleryDropdown');
            if (!navEl || !toggleBtn || !dropdownEl) return false;

            var willOpen = !navEl.classList.contains('gallery-menu-open');
            window.closeWorksGalleryMenu();

            if (willOpen) {
                navEl.classList.add('gallery-menu-open');
                toggleBtn.classList.add('is-open');
                toggleBtn.setAttribute('aria-expanded', 'true');
                dropdownEl.setAttribute('aria-hidden', 'false');
            }

            return false;
        };
    }

    if (typeof window.openGallerySection !== 'function') {
        window.openGallerySection = function(sectionId) {
            if (!sectionId) return false;

            var galleryTab = document.getElementById('gallery-tab');
            if (typeof window.switchTab === 'function') {
                window.switchTab(sectionId, galleryTab);
            }

            return false;
        };
    }

    if(typeof window.openMostRequestedAudio !== 'function') {
        window.openMostRequestedAudio = function(sectionId, targetId) {
            if (!targetId) return false;

            if (typeof window.switchTab === 'function' && sectionId) {
                window.switchTab(sectionId, null);
            }

            setTimeout(function() {
                var target = document.getElementById(targetId);
                if (!target) return;

                target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

                var visualCard = target.querySelector('.testibg') || target;
                document.querySelectorAll('.testibg.targeted-audio-card').forEach(function(card) {
                    card.classList.remove('targeted-audio-card');
                });

                visualCard.classList.add('targeted-audio-card');

                if (window.__atheerTargetCardTimer) {
                    clearTimeout(window.__atheerTargetCardTimer);
                }

                window.__atheerTargetCardTimer = setTimeout(function() {
                    visualCard.classList.remove('targeted-audio-card');
                }, 6500);

                var audioEl = target.querySelector('audio');
                if (audioEl) {
                    audioEl.setAttribute('tabindex', '-1');
                    try { audioEl.focus({ preventScroll: true }); } catch (e) {}
                }
            }, 220);

            return false;
        };
    }
    if(typeof window.toggleFaq !== 'function' && typeof window.toggleFAQ !== 'function') {
        window.toggleFaq = function(btn) {
            var item = btn.parentElement;
            document.querySelectorAll('.faq-item').forEach(function(i){ if(i !== item) i.classList.remove('active'); });
            item.classList.toggle('active');
        };
    }
    window.updateThemeButtonIcon = function() {
        var iconUse = document.querySelector('#theme-btn [data-theme-icon] use');
        if (!iconUse) return;
        var isDark = document.body.classList.contains('dark-mode');
        var iconId = isDark ? '#icon-sun' : '#icon-moon';
        iconUse.setAttribute('href', iconId);
        iconUse.setAttribute('xlink:href', iconId);
    };

    if(typeof window.toggleDarkMode !== 'function') {
        window.toggleDarkMode = function() {
            document.body.classList.toggle('dark-mode');
            var isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('atheer_theme', isDark ? 'dark' : 'light');
            window.updateThemeButtonIcon();
        };
    }

    if (typeof window.submitContactForm !== 'function') {
        window.submitContactForm = function(event) {
            if (event && typeof event.preventDefault === 'function') {
                event.preventDefault();
            }

            var form = document.getElementById('atheerContactForm');
            var feedback = document.getElementById('contactFormFeedback');
            if (!form) return false;
            if (form.dataset.sending === '1') return false;

            var submitBtn = form.querySelector('.contact-submit-btn');
            var defaultBtnHtml = submitBtn ? submitBtn.innerHTML : '';

            if (feedback) {
                feedback.textContent = '';
                feedback.classList.remove('is-success', 'is-error');
            }

            if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
                if (feedback) {
                    feedback.textContent = 'يرجى اختيار الخدمة المطلوبة وكتابة تفاصيل الطلب قبل المتابعة.';
                    feedback.classList.add('is-error');
                }
                return false;
            }

            var firstName = ((document.getElementById('contactFirstName') || {}).value || '').trim();
            var lastName = ((document.getElementById('contactLastName') || {}).value || '').trim();
            var email = ((document.getElementById('contactEmail') || {}).value || '').trim();
            var phone = ((document.getElementById('contactPhone') || {}).value || '').trim();
            var serviceEl = document.getElementById('contactService');
            var channelEl = document.getElementById('contactChannel');
            var entity = ((document.getElementById('contactEntity') || {}).value || '').trim();
            var message = ((document.getElementById('contactMessage') || {}).value || '').trim();

            var service = serviceEl && serviceEl.options && serviceEl.selectedIndex >= 0
                ? (serviceEl.options[serviceEl.selectedIndex].text || '').trim()
                : '';
            var channel = channelEl ? (channelEl.value || '').trim() : 'ye';
            var channelLabel = channelEl && channelEl.options && channelEl.selectedIndex >= 0
                ? (channelEl.options[channelEl.selectedIndex].text || '').trim()
                : 'واتساب اليمن';
            var fullName = (firstName + ' ' + lastName).replace(/\s+/g, ' ').trim();
            var formattedMessageParts = [
                'السلام عليكم،',
                'لدي طلب عبر نموذج موقع أثير ساوند.',
                'الخدمة المطلوبة: ' + service,
                'وجهة الإرسال: ' + channelLabel
            ];
            if (fullName) formattedMessageParts.push('الاسم: ' + fullName);
            if (email) formattedMessageParts.push('البريد الإلكتروني: ' + email);
            if (phone) formattedMessageParts.push('رقم الهاتف: ' + phone);
            if (entity) formattedMessageParts.push('اسم المناسبة أو الجهة: ' + entity);
            if (message) {
                formattedMessageParts.push('تفاصيل الطلب:');
                formattedMessageParts.push(message);
            }
            if (!fullName && !email && !phone && !entity && !message) {
                formattedMessageParts.push('أرغب بالتواصل والاستفسار عن هذه الخدمة.');
            }
            var formattedMessage = formattedMessageParts.join('\n');

            var targetPhone = channel === 'sa' ? '966560049754' : '967770080131';
            var whatsappUrl = 'https://wa.me/' + targetPhone + '?text=' + encodeURIComponent(formattedMessage);
            var popup = window.open(whatsappUrl, '_blank', 'noopener');

            form.dataset.sending = '1';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>جارٍ تجهيز الإرسال...';
            }

            if (feedback) {
                feedback.textContent = 'يجري فتح ' + channelLabel + ' الآن بالرسالة الجاهزة...';
                feedback.classList.add('is-success');
            }

            setTimeout(function() {
                delete form.dataset.sending;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = defaultBtnHtml;
                }
                if (feedback) {
                    feedback.textContent = !popup
                        ? 'تعذر فتح الواتساب تلقائيًا. استخدم أزرار الواتساب المباشرة أسفل النموذج.'
                        : 'تم تجهيز الرسالة على ' + channelLabel + '.';
                    feedback.classList.remove('is-error');
                    feedback.classList.add(popup ? 'is-success' : 'is-error');
                }
                try { form.reset(); } catch (e) {}
            }, 350);

            return false;
        };
    }

    /* --- دالة تحويل العناوين إلى ثابتة مع زر الرجوع --- */
    function initStickyHeaders() {
        const workSections = ['audio-works', 'schools-works', 'zaffat-works', 'shilat-works', 'events-works', 'music-works', 'voiceover-works', 'corporate-identities-works', 'poems-composing-works', 'nomusic-works', 'video-works', 'podcast-works', 'poetry-recitation-works', 'editing-works'];
        const sectionIcons = {
            'audio-works': 'fas fa-music',
            'schools-works': 'fas fa-school',
            'zaffat-works': 'fas fa-heart',
            'shilat-works': 'fas fa-music',
            'events-works': 'fas fa-gift',
            'music-works': 'fas fa-headphones',
            'voiceover-works': 'fas fa-microphone-alt',
            'corporate-identities-works': 'fas fa-building',
            'poems-composing-works': 'fas fa-guitar',
            'nomusic-works': 'fas fa-users',
            'video-works': 'fas fa-film',
            'podcast-works': 'fas fa-podcast',
            'poetry-recitation-works': 'fas fa-scroll',
            'editing-works': 'fas fa-sliders-h'
        };
        
        workSections.forEach(id => {
            const section = document.getElementById(id);
            if(section) {
                const titleEl = section.querySelector('.section-title');
                if(titleEl && titleEl.tagName.toLowerCase() === 'h2') {
                    const titleHTML = titleEl.innerHTML;
                    
                    const stickyHeader = document.createElement('div');
                    stickyHeader.className = 'sticky-section-header';
                    
                    const backBtn = document.createElement('button');
                    backBtn.className = 'sticky-back-btn';
                    backBtn.innerHTML = '<svg class="ui-icon" aria-hidden="true" focusable="false"><use href="#icon-arrow-right"></use></svg>';
                    backBtn.title = 'العودة للرئيسية';
                    backBtn.onclick = function() {
                        switchTab('home-section', document.getElementById('home-tab'));
                        setTimeout(() => {
                            const worksCards = document.querySelector('.quick-services');
                            if(worksCards) worksCards.scrollIntoView({behavior: 'smooth', block: 'center'});
                        }, 50);
                    };
                    
                    const newTitle = document.createElement('h2');
                    const iconClass = sectionIcons[id] || 'fas fa-folder-open';
                    newTitle.innerHTML = '<span class="section-heading-icon" aria-hidden="true"><i class="' + iconClass + '"></i></span><span class="section-heading-text">' + titleHTML + '</span>';
                    
                    stickyHeader.appendChild(backBtn);
                    stickyHeader.appendChild(newTitle);
                    
                    titleEl.parentNode.replaceChild(stickyHeader, titleEl);
                }
            }
        });
    }


function updateCompactAudioMarquee() {
    document.querySelectorAll('.compact-audio-card .audio-item__title').forEach(function(titleEl) {
        var viewport = titleEl.querySelector('.audio-item__title-viewport');
        var marquee = titleEl.querySelector('.audio-item__title-marquee');
        if (!viewport || !marquee) return;

        titleEl.classList.remove('is-marquee');
        titleEl.style.removeProperty('--marquee-distance');
        titleEl.style.removeProperty('--marquee-duration');
        marquee.style.transform = 'translateX(0)';

        var overflowDistance = Math.ceil(marquee.scrollWidth - viewport.clientWidth);
        if (overflowDistance > 12) {
            titleEl.classList.add('is-marquee');
            titleEl.style.setProperty('--marquee-distance', overflowDistance + 'px');
            titleEl.style.setProperty('--marquee-duration', Math.max(6, overflowDistance / 22) + 's');
        }
    });
}

function initCompactAudioCards() {
    document.querySelectorAll('.audio-item').forEach(function(card) {
        var audioEl = card.querySelector('audio');
        var inner = card.querySelector('.testibg');
        if (!audioEl || !inner) return;

        card.classList.add('compact-audio-card');
        audioEl.classList.add('audio-item__player');

        if (card.parentElement) {
            card.parentElement.classList.add('compact-audio-list');
        }

        var visualIcon = null;
        Array.prototype.some.call(inner.children, function(child) {
            if (child.tagName === 'I') {
                visualIcon = child;
                return true;
            }
            return false;
        });
        if (!visualIcon) {
            visualIcon = document.createElement('i');
            inner.insertBefore(visualIcon, inner.firstChild);
        }
        visualIcon.className = 'fas fa-music audio-file-icon';
        visualIcon.setAttribute('aria-hidden', 'true');

        var titleEl = inner.querySelector('h3');
        if (!titleEl) {
            var paragraphs = inner.querySelectorAll('p');
            for (var i = 0; i < paragraphs.length; i += 1) {
                var paragraphText = (paragraphs[i].textContent || '').replace(/\s+/g, ' ').trim();
                if (paragraphText) {
                    titleEl = paragraphs[i];
                    break;
                }
            }
        }

        if (!titleEl) {
            titleEl = document.createElement('p');
            titleEl.textContent = 'ملف صوتي';
            inner.insertBefore(titleEl, audioEl);
        }

        titleEl.classList.add('audio-item__title');

        if (!titleEl.dataset.compactAudioReady) {
            var titleText = (titleEl.textContent || '').replace(/\s+/g, ' ').trim() || 'ملف صوتي';
            titleEl.dataset.compactAudioReady = '1';
            titleEl.setAttribute('title', titleText);
            titleEl.textContent = '';

            var viewport = document.createElement('span');
            viewport.className = 'audio-item__title-viewport';

            var marquee = document.createElement('span');
            marquee.className = 'audio-item__title-marquee';

            var label = document.createElement('span');
            label.className = 'audio-item__title-text';
            label.textContent = titleText;

            marquee.appendChild(label);
            viewport.appendChild(marquee);
            titleEl.appendChild(viewport);
        }

        var sequenceBtn = inner.querySelector('.audio-item__sequence-btn');
        if (!sequenceBtn) {
            sequenceBtn = document.createElement('button');
            sequenceBtn.type = 'button';
            sequenceBtn.className = 'audio-item__sequence-btn';
            sequenceBtn.title = 'استماع متسلسل من هذا الملف';
            sequenceBtn.setAttribute('aria-label', 'استماع متسلسل');
            sequenceBtn.setAttribute('aria-pressed', 'false');
            sequenceBtn.innerHTML = '<svg class="ui-icon" aria-hidden="true" focusable="false"><use href="#icon-sequence"></use></svg>';
            inner.appendChild(sequenceBtn);
        }

        if (!sequenceBtn.dataset.sequenceBound) {
            sequenceBtn.dataset.sequenceBound = '1';
            sequenceBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.startSequentialAudioFrom === 'function') {
                    var currentAudio = window.__atheerCurrentAudio;
                    var startAudio = currentAudio instanceof HTMLAudioElement && !currentAudio.paused && currentAudio.closest('.audio-item') === card ? currentAudio : audioEl;
                    window.startSequentialAudioFrom(startAudio);
                }
            });
        }

        Array.prototype.forEach.call(inner.children, function(child) {
            if (child === audioEl || child === titleEl || child === sequenceBtn || child === visualIcon) return;
            if (child.tagName === 'I' || child.tagName === 'P' || child.tagName === 'H3' || child.tagName === 'H4' || child.tagName === 'SMALL') {
                child.classList.add('audio-item__secondary');
            }
        });
    });

    updateCompactAudioMarquee();

    if (!window.__atheerCompactAudioResizeBound) {
        window.__atheerCompactAudioResizeBound = true;
        window.addEventListener('resize', function() {
            clearTimeout(window.__atheerCompactAudioResizeTimer);
            window.__atheerCompactAudioResizeTimer = setTimeout(updateCompactAudioMarquee, 120);
        });
    }
}

function initCustomAudioPlayers() {
    if (window.__atheerAudioProtectionBound) return;
    window.__atheerAudioProtectionBound = true;

    var idmBlockerSelector = [
        '#IDMVideoDownloadPanel',
        '#IDMDownloadPanel',
        '[id*="IDM"]',
        '[class*="IDM"]',
        '[id*="idm"]',
        '[class*="idm"]'
    ].join(',');

    function applyNoDownloadAttributes(el) {
        if (!el || !el.setAttribute) return;
        el.setAttribute('data-idm', 'false');
        el.setAttribute('data-idm-ignore', 'true');
        el.setAttribute('data-no-download', 'true');
        el.setAttribute('data-download-disabled', 'true');
    }

    function hardenAudioElement(audioEl) {
        if (!(audioEl instanceof HTMLAudioElement)) return;
        audioEl.controls = false;
        audioEl.removeAttribute('controls');
        audioEl.classList.add('atheer-native-audio');
        audioEl.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
        audioEl.setAttribute('disablepictureinpicture', '');
        audioEl.setAttribute('disableremoteplayback', '');
        audioEl.setAttribute('oncontextmenu', 'return false;');
        audioEl.setAttribute('preload', 'none');
        audioEl.setAttribute('playsinline', '');
        applyNoDownloadAttributes(audioEl);

        if (audioEl.controlsList && audioEl.controlsList.add) {
            try {
                audioEl.controlsList.add('nodownload');
                audioEl.controlsList.add('noplaybackrate');
                audioEl.controlsList.add('noremoteplayback');
            } catch (e) {}
        }

        audioEl.querySelectorAll('source').forEach(function(sourceEl) {
            applyNoDownloadAttributes(sourceEl);
        });
    }

    function formatAudioTime(seconds) {
        seconds = Number(seconds);
        if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
        var total = Math.floor(seconds);
        var minutes = Math.floor(total / 60);
        var secs = total % 60;
        return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    }

    function updateCustomAudioPlayer(audioEl) {
        var player = audioEl && audioEl.__atheerCustomPlayer;
        if (!player) return;

        var button = player.querySelector('.audio-custom-player__button');
        var icon = button && button.querySelector('i');
        var seek = player.querySelector('.audio-custom-player__seek');
        var time = player.querySelector('.audio-custom-player__time');
        var duration = Number(audioEl.duration);
        var current = Number(audioEl.currentTime);
        var hasDuration = Number.isFinite(duration) && duration > 0;
        var safeCurrent = Number.isFinite(current) && current > 0 ? current : Number(audioEl.dataset.resumeTime || 0) || 0;

        if (icon) {
            icon.className = audioEl.paused ? 'fas fa-play' : 'fas fa-pause';
        }
        if (button) {
            button.setAttribute('aria-label', audioEl.paused ? 'تشغيل الملف الصوتي' : 'إيقاف مؤقت');
            button.setAttribute('title', audioEl.paused ? 'تشغيل' : 'إيقاف مؤقت');
        }
        if (seek && !seek.dataset.userSeeking) {
            seek.value = hasDuration ? String(Math.min(1000, Math.max(0, Math.round((safeCurrent / duration) * 1000)))) : '0';
            seek.disabled = !hasDuration;
        }
        if (time) {
            time.textContent = formatAudioTime(safeCurrent) + ' / ' + (hasDuration ? formatAudioTime(duration) : '00:00');
        }
    }

    function ensureCustomAudioPlayer(audioEl) {
        if (!(audioEl instanceof HTMLAudioElement)) return;
        if (audioEl.__atheerCustomPlayer) {
            updateCustomAudioPlayer(audioEl);
            return;
        }

        var player = document.createElement('div');
        player.className = 'audio-custom-player';
        player.setAttribute('role', 'group');
        player.setAttribute('aria-label', 'مشغل صوت للاستماع فقط');
        player.innerHTML =
            '<button type="button" class="audio-custom-player__button" aria-label="تشغيل الملف الصوتي" title="تشغيل"><i class="fas fa-play" aria-hidden="true"></i></button>' +
            '<input class="audio-custom-player__seek" type="range" min="0" max="1000" value="0" step="1" aria-label="تقدم الملف الصوتي" />' +
            '<span class="audio-custom-player__time">00:00 / 00:00</span>';

        audioEl.insertAdjacentElement('afterend', player);
        audioEl.__atheerCustomPlayer = player;

        var button = player.querySelector('.audio-custom-player__button');
        var seek = player.querySelector('.audio-custom-player__seek');

        player.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        player.addEventListener('dragstart', function(e) { e.preventDefault(); });

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (audioEl.paused) {
                prepareProtectedAudio(audioEl);
                audioEl.play().catch(function() {
                    updateCustomAudioPlayer(audioEl);
                });
            } else {
                audioEl.pause();
            }
            updateCustomAudioPlayer(audioEl);
        });

        ['pointerdown', 'mousedown', 'touchstart', 'focus'].forEach(function(eventName) {
            seek.addEventListener(eventName, function() {
                prepareProtectedAudio(audioEl);
            }, true);
        });

        seek.addEventListener('input', function() {
            var duration = Number(audioEl.duration);
            if (!Number.isFinite(duration) || duration <= 0) return;
            seek.dataset.userSeeking = '1';
            var targetTime = (Number(seek.value) / 1000) * duration;
            if (Number.isFinite(targetTime)) {
                try { audioEl.currentTime = targetTime; } catch (e) {}
                audioEl.dataset.resumeTime = String(targetTime);
            }
            updateCustomAudioPlayer(audioEl);
        });

        seek.addEventListener('change', function() {
            delete seek.dataset.userSeeking;
            updateCustomAudioPlayer(audioEl);
        });

        ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'playing', 'pause', 'ended', 'emptied'].forEach(function(eventName) {
            audioEl.addEventListener(eventName, function() {
                updateCustomAudioPlayer(audioEl);
            });
        });

        updateCustomAudioPlayer(audioEl);
    }

    function rememberAudioResumePosition(audioEl) {
        if (!(audioEl instanceof HTMLAudioElement) || audioEl.ended) return;
        var currentTime = Number(audioEl.currentTime);
        if (Number.isFinite(currentTime) && currentTime > 0) {
            audioEl.dataset.resumeTime = String(currentTime);
        }
    }

    function restoreAudioResumePosition(audioEl) {
        if (!(audioEl instanceof HTMLAudioElement)) return;
        var resumeTime = Number(audioEl.dataset.resumeTime || '');
        if (!Number.isFinite(resumeTime) || resumeTime <= 0) return;

        var restore = function() {
            try {
                audioEl.currentTime = resumeTime;
            } catch (e) {}
        };

        if (audioEl.readyState >= 1) {
            restore();
        } else {
            audioEl.addEventListener('loadedmetadata', restore, { once: true });
        }
    }

    function hideIdmDownloadWidgets(root) {
        var scope = root && root.querySelectorAll ? root : document;
        var nodes = [];

        try {
            if (scope.matches && scope.matches(idmBlockerSelector)) {
                nodes.push(scope);
            }
            scope.querySelectorAll(idmBlockerSelector).forEach(function(node) {
                nodes.push(node);
            });
        } catch (e) {
            return;
        }

        nodes.forEach(function(node) {
            if (!node || node === document.documentElement || node === document.body) return;
            node.setAttribute('aria-hidden', 'true');
            node.style.setProperty('display', 'none', 'important');
            node.style.setProperty('visibility', 'hidden', 'important');
            node.style.setProperty('opacity', '0', 'important');
            node.style.setProperty('pointer-events', 'none', 'important');
        });
    }

    function startIdmBlockerPulse() {
        hideIdmDownloadWidgets(document);
        if (window.__atheerIdmBlockerPulseTimer) {
            clearInterval(window.__atheerIdmBlockerPulseTimer);
        }

        var ticks = 0;
        window.__atheerIdmBlockerPulseTimer = setInterval(function() {
            hideIdmDownloadWidgets(document);
            ticks += 1;
            if (ticks >= 14) {
                clearInterval(window.__atheerIdmBlockerPulseTimer);
                window.__atheerIdmBlockerPulseTimer = null;
            }
        }, 350);
    }

    function initIdmDownloadBlocker() {
        applyNoDownloadAttributes(document.documentElement);
        if (document.body) {
            applyNoDownloadAttributes(document.body);
        }

        hideIdmDownloadWidgets(document);

        if (window.__atheerIdmDownloadBlockerBound) return;
        window.__atheerIdmDownloadBlockerBound = true;

        if ('MutationObserver' in window && document.documentElement) {
            window.__atheerIdmDownloadObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node && node.nodeType === 1) {
                            hideIdmDownloadWidgets(node);
                        }
                    });
                });
            });
            window.__atheerIdmDownloadObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    function prepareProtectedAudio(audioEl) {
        if (!(audioEl instanceof HTMLAudioElement)) return false;
        hardenAudioElement(audioEl);
        startIdmBlockerPulse();

        var changed = false;
        var directSrc = (audioEl.getAttribute('data-protected-src') || audioEl.dataset.protectedSrc || '').trim();
        if (directSrc && audioEl.getAttribute('src') !== directSrc) {
            audioEl.setAttribute('src', directSrc);
            changed = true;
        }

        audioEl.querySelectorAll('source').forEach(function(sourceEl) {
            var protectedSrc = (sourceEl.getAttribute('data-protected-src') || sourceEl.dataset.protectedSrc || '').trim();
            if (protectedSrc && sourceEl.getAttribute('src') !== protectedSrc) {
                sourceEl.setAttribute('src', protectedSrc);
                changed = true;
            }
        });

        if (changed) {
            try { audioEl.load(); } catch (e) {}
            restoreAudioResumePosition(audioEl);
        }

        return true;
    }

    function stripProtectedAudioSource(audioEl, keepPosition) {
        if (!(audioEl instanceof HTMLAudioElement)) return;
        if (keepPosition === false) {
            delete audioEl.dataset.resumeTime;
        } else {
            rememberAudioResumePosition(audioEl);
        }

        var changed = false;
        if (audioEl.getAttribute('src')) {
            audioEl.removeAttribute('src');
            changed = true;
        }
        audioEl.querySelectorAll('source').forEach(function(sourceEl) {
            if (sourceEl.getAttribute('data-protected-src') && sourceEl.getAttribute('src')) {
                sourceEl.removeAttribute('src');
                changed = true;
            }
        });
        if (changed) {
            try { audioEl.load(); } catch (e) {}
        }
    }

    initIdmDownloadBlocker();

    window.prepareProtectedAudio = prepareProtectedAudio;
    window.stripProtectedAudioSource = stripProtectedAudioSource;

    document.querySelectorAll('audio').forEach(function(audioEl) {
        var existingSrc = (audioEl.getAttribute('src') || '').trim();
        if (existingSrc) {
            audioEl.setAttribute('data-protected-src', existingSrc);
            audioEl.removeAttribute('src');
        }

        audioEl.querySelectorAll('source').forEach(function(sourceEl) {
            var sourceSrc = (sourceEl.getAttribute('src') || '').trim();
            if (sourceSrc) {
                sourceEl.setAttribute('data-protected-src', sourceSrc);
                sourceEl.removeAttribute('src');
            }
        });

        hardenAudioElement(audioEl);
        audioEl.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
        audioEl.setAttribute('disablepictureinpicture', '');
        audioEl.setAttribute('disableremoteplayback', '');
        audioEl.setAttribute('data-idm', 'false');
        audioEl.setAttribute('data-idm-ignore', 'true');
        audioEl.setAttribute('data-no-download', 'true');
        audioEl.setAttribute('oncontextmenu', 'return false;');
        audioEl.setAttribute('preload', 'none');
        ensureCustomAudioPlayer(audioEl);

        audioEl.addEventListener('pointerdown', function() { prepareProtectedAudio(audioEl); }, true);
        audioEl.addEventListener('mousedown', function() { prepareProtectedAudio(audioEl); }, true);
        audioEl.addEventListener('click', function() { prepareProtectedAudio(audioEl); }, true);
        audioEl.addEventListener('touchstart', function() { prepareProtectedAudio(audioEl); }, true);
        audioEl.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
                prepareProtectedAudio(audioEl);
            }
        }, true);
        audioEl.addEventListener('play', function() {
            if (audioEl.__atheerStripTimer) {
                clearTimeout(audioEl.__atheerStripTimer);
                audioEl.__atheerStripTimer = null;
            }
            window.__atheerCurrentAudio = audioEl;
            prepareProtectedAudio(audioEl);
        }, true);
        audioEl.addEventListener('pause', function() {
            if (audioEl.ended) return;
            rememberAudioResumePosition(audioEl);
            startIdmBlockerPulse();
            if (audioEl.__atheerStripTimer) {
                clearTimeout(audioEl.__atheerStripTimer);
            }
            audioEl.__atheerStripTimer = setTimeout(function() {
                if (audioEl.paused && !audioEl.ended) {
                    stripProtectedAudioSource(audioEl, true);
                }
            }, 650);
        }, true);
        audioEl.addEventListener('ended', function() {
            if (audioEl.__atheerStripTimer) {
                clearTimeout(audioEl.__atheerStripTimer);
                audioEl.__atheerStripTimer = null;
            }
            setTimeout(function() { stripProtectedAudioSource(audioEl, false); }, 250);
        }, true);
        audioEl.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        audioEl.addEventListener('dragstart', function(e) { e.preventDefault(); });
    });

    if (!window.__atheerAudioProtectionShortcutsBound) {
        window.__atheerAudioProtectionShortcutsBound = true;

        document.addEventListener('keydown', function(e) {
            var key = (e.key || '').toLowerCase();
            if (
                e.key === 'F12' ||
                (e.ctrlKey && (key === 's' || key === 'u' || key === 'p')) ||
                (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'))
            ) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        document.addEventListener('contextmenu', function(e) {
            if (e.target && e.target.closest && e.target.closest('audio, .audio-item, .testibg')) {
                e.preventDefault();
            }
        });

        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState !== 'hidden') return;
            document.querySelectorAll('audio').forEach(function(audioEl) {
                if (!audioEl.paused) {
                    try { audioEl.pause(); } catch (e) {}
                }
                stripProtectedAudioSource(audioEl, true);
            });
        });

        window.addEventListener('pagehide', function() {
            document.querySelectorAll('audio').forEach(function(audioEl) {
                stripProtectedAudioSource(audioEl, false);
            });
        });
    }
}


function initSequentialAudioPlayback() {
    if (window.__atheerSequentialAudioBound) return;
    window.__atheerSequentialAudioBound = true;

    var state = {
        active: false,
        audios: [],
        index: -1,
        current: null
    };

    function getPlaylist(startAudio) {
        var section = startAudio.closest && startAudio.closest('.content-section');
        var root = section || document;
        var audios = Array.prototype.filter.call(root.querySelectorAll('audio'), function(audioEl) {
            return !!(
                audioEl.querySelector('source[src], source[data-protected-src]') ||
                audioEl.getAttribute('data-protected-src') ||
                audioEl.currentSrc ||
                audioEl.src
            );
        });
        var index = audios.indexOf(startAudio);
        if (index < 0) {
            audios = Array.prototype.slice.call(document.querySelectorAll('audio'));
            index = audios.indexOf(startAudio);
        }
        return { audios: audios, index: Math.max(0, index) };
    }

    function updateSequenceButtons() {
        document.querySelectorAll('.audio-item__sequence-btn').forEach(function(btn) {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-pressed', 'false');
        });
        if (!state.active || !state.current) return;
        var card = state.current.closest && state.current.closest('.audio-item');
        var activeBtn = card && card.querySelector('.audio-item__sequence-btn');
        if (activeBtn) {
            activeBtn.classList.add('is-active');
            activeBtn.setAttribute('aria-pressed', 'true');
        }
    }

    function stopSequence(shouldPause) {
        var current = state.current;
        state.active = false;
        state.audios = [];
        state.index = -1;
        state.current = null;
        updateSequenceButtons();
        if (shouldPause && current && !current.paused) {
            current.pause();
        }
    }

    function playAt(index) {
        if (!state.active) return;
        if (index >= state.audios.length) {
            stopSequence(false);
            return;
        }

        var nextAudio = state.audios[index];
        if (!nextAudio) {
            stopSequence(false);
            return;
        }

        state.index = index;
        state.current = nextAudio;
        updateSequenceButtons();
        if (typeof window.prepareProtectedAudio === 'function') {
            window.prepareProtectedAudio(nextAudio);
        }
        try { nextAudio.currentTime = 0; } catch (e) {}
        var playResult = nextAudio.play();
        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch(function() { stopSequence(false); });
        }
    }

    window.startSequentialAudioFrom = function(startAudio) {
        if (!(startAudio instanceof HTMLAudioElement)) return;
        if (state.active && state.current === startAudio) {
            stopSequence(true);
            return;
        }

        var playlist = getPlaylist(startAudio);
        if (!playlist.audios.length) return;

        state.active = true;
        state.audios = playlist.audios;
        state.index = playlist.index;
        state.current = null;
        playAt(state.index);
    };

    document.addEventListener('ended', function(e) {
        var endedAudio = e.target;
        if (!(endedAudio instanceof HTMLAudioElement)) return;
        if (!state.active || endedAudio !== state.current) return;
        playAt(state.index + 1);
    }, true);

    document.addEventListener('pause', function(e) {
        var pausedAudio = e.target;
        if (!(pausedAudio instanceof HTMLAudioElement)) return;
        if (!state.active || pausedAudio !== state.current || pausedAudio.ended) return;
        stopSequence(false);
    }, true);

    document.addEventListener('play', function(e) {
        var playedAudio = e.target;
        if (!(playedAudio instanceof HTMLAudioElement)) return;
        if (state.active && state.current && playedAudio !== state.current) {
            stopSequence(false);
        }
    }, true);
}

function initFooterVisitCounter() {
    const counterEl = document.getElementById('visitCounterNumber');
    if (!counterEl || window.__atheerVisitCounterInitialized) return;

    window.__atheerVisitCounterInitialized = true;

    const fallbackKey = 'atheer_visit_counter_fallback';
    const renderCount = function(value) {
        const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
        counterEl.textContent = safeValue.toLocaleString('ar-EG');
    };

    fetch('https://api.counterapi.dev/v1/atheersound_website/total_visits/up', { cache: 'no-store' })
        .then(function(response) {
            if (!response.ok) throw new Error('counter status ' + response.status);
            return response.json();
        })
        .then(function(data) {
            const total = Number(data && data.count);
            if (!Number.isFinite(total)) throw new Error('invalid counter response');

            renderCount(total);
            try { localStorage.setItem(fallbackKey, String(total)); } catch (e) {}
        })
        .catch(function(error) {
            console.error('خطأ في الاتصال بعداد الزيارات:', error);

            let fallbackCount = 0;
            try {
                fallbackCount = parseInt(localStorage.getItem(fallbackKey) || '0', 10) || 0;
                fallbackCount += 1;
                localStorage.setItem(fallbackKey, String(fallbackCount));
            } catch (e) {
                fallbackCount += 1;
            }

            renderCount(fallbackCount);
        });
}

   function initGlobalAudioExclusivity() {
        if (window.__atheerAudioExclusiveBound) return;
        window.__atheerAudioExclusiveBound = true;

        // عند تشغيل أي ملف صوتي
        document.addEventListener('play', function(e) {
            var current = e.target;
            if (!(current instanceof HTMLAudioElement)) return;

            // 1. إيقاف باقي الملفات
            document.querySelectorAll('audio').forEach(function(a) {
                if (a !== current) {
                    if (!a.paused) a.pause();
                    if (typeof window.stripProtectedAudioSource === 'function') {
                        window.stripProtectedAudioSource(a);
                    }
                }
            });

            // 2. إزالة تأثير التشغيل من كل الكروت
            document.querySelectorAll('.testibg.playing-active').forEach(function(card) {
                card.classList.remove('playing-active');
            });

            // 3. إضافة تأثير التشغيل للكارت الحالي
            var parentCard = current.closest('.testibg');
            if (parentCard) {
                parentCard.classList.remove('targeted-audio-card');
                parentCard.classList.add('playing-active');
            }

        }, true);

        // عند إيقاف الملف الصوتي أو انتهائه
        document.addEventListener('pause', function(e) {
            var current = e.target;
            if (!(current instanceof HTMLAudioElement)) return;
            
            var parentCard = current.closest('.testibg');
            if (parentCard) {
                parentCard.classList.remove('playing-active');
            }
        }, true);

        document.addEventListener('ended', function(e) {
            var current = e.target;
            if (!(current instanceof HTMLAudioElement)) return;
            
            var parentCard = current.closest('.testibg');
            if (parentCard) {
                parentCard.classList.remove('playing-active');
            }
        }, true);
    }


    function initGlobalSearch() {
        const inputEl = document.getElementById('globalSearchInput');
        const resultCountEl = document.getElementById('resultCount');
        const resultsContainerEl = document.getElementById('searchResultsContainer');
        const resultsGridEl = document.getElementById('searchResultsGrid');
        const noResultsEl = document.getElementById('noResultsMsg');
        if (!inputEl || !resultCountEl || !resultsContainerEl || !resultsGridEl || !noResultsEl) return;

        const searchState = window.__atheerSearchState || { index: [] };
        window.__atheerSearchState = searchState;

        function normalizeArabic(text) {
            return (text || '')
                .toString()
                .toLowerCase()
                .replace(/[\u064b-\u0652\u0670\u0640]/g, '')
                .replace(/[إأآٱ]/g, 'ا')
                .replace(/ى/g, 'ي')
                .replace(/ؤ/g, 'و')
                .replace(/ئ/g, 'ي')
                .replace(/ة/g, 'ه')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function collapseText(text) {
            return (text || '').replace(/\s+/g, ' ').trim();
        }

        function escapeHtml(text) {
            return String(text || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function getSectionTitle(sectionEl) {
            if (!sectionEl) return 'نتيجة بحث';
            const headingEl = sectionEl.querySelector('.sticky-section-header h2, .section-title, h2, h3');
            const title = collapseText(headingEl ? (headingEl.innerText || headingEl.textContent) : '');
            return title || 'نتيجة بحث';
        }

        function getNavButtonForSection(sectionId) {
            const tabs = Array.from(document.querySelectorAll('.main-navigation .nav-tab'));
            return tabs.find(function(btn) {
                return __navTabMatchesSection(btn, sectionId);
            }) || null;
        }

        function initWorksGalleryDropdown() {
            const gridEl = document.getElementById('worksGalleryGrid');
            const toggleBtn = document.getElementById('gallery-tab');
            if (!gridEl || !toggleBtn || gridEl.dataset.ready === '1') return;

            function gallerySvg(paths) {
                return '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">' + paths + '</svg>';
            }

            const sectionIcons = {
                'zaffat-works': {
                    color: 'var(--primary-blue)',
                    svg: gallerySvg('<path d="M20.8 5.8c-1.5-1.7-4-1.8-5.6-.2L12 8.7 8.8 5.6c-1.6-1.6-4.1-1.5-5.6.2-1.5 1.8-1.3 4.5.4 6.1L12 20l8.4-8.1c1.7-1.6 1.9-4.3.4-6.1z"/>')
                },
                'shilat-works': {
                    color: 'var(--primary-red)',
                    svg: gallerySvg('<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>')
                },
                'events-works': {
                    color: 'var(--primary-yellow)',
                    svg: gallerySvg('<path d="M20 12v8H4v-8"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5c0 1.5 2 2.5 2 2.5z"/><path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5c0 1.5-2 2.5-2 2.5z"/>')
                },
                'schools-works': {
                    color: 'var(--primary-blue)',
                    svg: gallerySvg('<path d="M3 10l9-5 9 5-9 5-9-5z"/><path d="M7 12v5c3 2 7 2 10 0v-5"/><path d="M21 10v6"/>')
                },
                'voiceover-works': {
                    color: 'var(--primary-red)',
                    svg: gallerySvg('<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/><path d="M8 22h8"/>')
                },
                'poetry-recitation-works': {
                    color: 'var(--primary-yellow)',
                    svg: gallerySvg('<path d="M6 3h10a2 2 0 0 1 2 2v15H8a2 2 0 0 1-2-2V3z"/><path d="M8 7h7"/><path d="M8 11h7"/><path d="M8 15h5"/>')
                },
                'poems-composing-works': {
                    color: 'var(--primary-blue)',
                    svg: gallerySvg('<path d="M14 4l6 6-9 9H5v-6l9-9z"/><path d="M13 5l6 6"/><path d="M5 19l4-1"/>')
                },
                'music-works': {
                    color: 'var(--primary-red)',
                    svg: gallerySvg('<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v4a3 3 0 0 0 3 3h1v-7H7a3 3 0 0 0-3 3"/><path d="M20 13v4a3 3 0 0 1-3 3h-1v-7h1a3 3 0 0 1 3 3"/>')
                },
                'nomusic-works': {
                    color: 'var(--primary-yellow)',
                    svg: gallerySvg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>')
                },
                'video-works': {
                    color: 'var(--primary-blue)',
                    svg: gallerySvg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14"/><path d="M16 5v14"/><path d="M3 10h18"/><path d="M3 14h18"/>')
                },
                'podcast-works': {
                    color: 'var(--primary-yellow)',
                    svg: gallerySvg('<circle cx="12" cy="11" r="3"/><path d="M17 11a5 5 0 1 0-10 0"/><path d="M19.5 11a7.5 7.5 0 1 0-15 0"/><path d="M10 16h4l1 5H9l1-5z"/>')
                },
                'editing-works': {
                    color: 'var(--primary-red)',
                    svg: gallerySvg('<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>')
                }
            };

            const sourceCards = Array.from(document.querySelectorAll('#home-section .quick-services .qs-item'));
            if (!sourceCards.length) return;

            gridEl.innerHTML = '';

            const groupedSections = [];

            sourceCards.forEach(function(card) {
                const onclick = card.getAttribute('onclick') || '';
                const match = onclick.match(/switchTab\((['"])([^'"]+)\1/);
                const sectionId = match ? match[2] : '';
                const labelEl = card.querySelector('.qs-label');
                const iconEl = card.querySelector('.qs-icon');
                const label = labelEl ? (labelEl.textContent || '').trim() : '';

                if (!sectionId || !label) return;

                groupedSections.push(sectionId);

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'works-gallery-link';
                btn.setAttribute('data-target', sectionId);

                const iconWrap = document.createElement('span');
                iconWrap.className = 'works-gallery-icon';
                const iconData = sectionIcons[sectionId];
                if (iconData) {
                    iconWrap.style.color = iconData.color;
                    iconWrap.innerHTML = iconData.svg;
                } else {
                    iconWrap.innerHTML = iconEl ? iconEl.innerHTML : gallerySvg('<path d="M3 6h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>');
                }

                const textWrap = document.createElement('span');
                textWrap.className = 'works-gallery-text';
                textWrap.textContent = label;

                btn.appendChild(iconWrap);
                btn.appendChild(textWrap);
                btn.addEventListener('click', function() {
                    window.openGallerySection(sectionId);
                });

                gridEl.appendChild(btn);
            });

            if (groupedSections.length) {
                toggleBtn.setAttribute('data-section-group', groupedSections.join(','));
            }

            if (!window.__worksGalleryEventsBound) {
                window.__worksGalleryEventsBound = true;

                document.addEventListener('click', function(event) {
                    if (event.target.closest('#gallery-tab') || event.target.closest('#worksGalleryDropdown')) {
                        return;
                    }
                    window.closeWorksGalleryMenu();
                });

                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape') {
                        window.closeWorksGalleryMenu();
                    }
                });
            }

            gridEl.dataset.ready = '1';
        }

        window.initWorksGalleryDropdown = initWorksGalleryDropdown;

        function extractSnippet(fullText, queryRaw) {
            const text = collapseText(fullText);
            if (!text) return '';

            const query = collapseText(queryRaw);
            if (!query) return text.slice(0, 180);

            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();
            const index = lowerText.indexOf(lowerQuery);
            if (index === -1) return text.slice(0, 180);

            const start = Math.max(0, index - 55);
            const end = Math.min(text.length, index + lowerQuery.length + 95);
            const prefix = start > 0 ? '... ' : '';
            const suffix = end < text.length ? ' ...' : '';
            return prefix + text.slice(start, end) + suffix;
        }

        function buildSearchIndex() {
            const index = [];
            const sections = Array.from(document.querySelectorAll('.content-section'))
                .filter(function(sec) { return sec.id && sec.id !== 'search-section'; });

            sections.forEach(function(sectionEl) {
                const sectionId = sectionEl.id;
                const sectionTitle = getSectionTitle(sectionEl);
                const localSeen = new Set();

                const selectors = [
                    '.work-card',
                    '.audio-item .testibg',
                    '.faq-item',
                    '.offer-card',
                    '.offers-announcement-card',
                    '.sub-service-card',
                    '.poem-card',
                    '.testimonial-card',
                    '.stat-card',
                    '.timeline-item',
                    '.verse-container',
                    'li',
                    'p'
                ].join(', ');

                const blocks = Array.from(sectionEl.querySelectorAll(selectors));
                if (!blocks.length) blocks.push(sectionEl);

                blocks.forEach(function(block) {
                    if (!block) return;
                    const text = collapseText(block.innerText || block.textContent || '');
                    if (text.length < 8) return;

                    const uniqueKey = sectionId + '|' + text.slice(0, 160);
                    if (localSeen.has(uniqueKey)) return;
                    localSeen.add(uniqueKey);

                    const heading = block.querySelector('h3, h4, .faq-question, .offer-chip, .poem-title, .section-title');
                    const itemTitle = collapseText(heading ? (heading.innerText || heading.textContent) : '') || sectionTitle;

                    index.push({
                        sectionId: sectionId,
                        sectionTitle: sectionTitle,
                        itemTitle: itemTitle,
                        text: text,
                        normalizedText: normalizeArabic(text)
                    });
                });
            });

            const headerEl = document.querySelector('.main-header');
            if (headerEl) {
                const headerText = collapseText(headerEl.innerText || headerEl.textContent || '');
                if (headerText) {
                    index.push({
                        sectionId: 'home-section',
                        sectionTitle: 'الرئيسية',
                        itemTitle: 'بيانات التواصل',
                        text: headerText,
                        normalizedText: normalizeArabic(headerText)
                    });
                }
            }

            const footerEl = document.querySelector('.modern-footer');
            if (footerEl) {
                const footerText = collapseText(footerEl.innerText || footerEl.textContent || '');
                if (footerText) {
                    index.push({
                        sectionId: 'home-section',
                        sectionTitle: 'الرئيسية',
                        itemTitle: 'الفوتر',
                        text: footerText,
                        normalizedText: normalizeArabic(footerText)
                    });
                }
            }

            return index;
        }

        function renderResults(matches, queryRaw) {
            if (!queryRaw.trim()) {
                resultCountEl.textContent = '';
                resultsContainerEl.style.display = 'none';
                noResultsEl.style.display = 'none';
                resultsGridEl.innerHTML = '';
                return;
            }

            if (!matches.length) {
                resultCountEl.textContent = 'نتائج البحث: 0';
                resultsContainerEl.style.display = 'none';
                noResultsEl.style.display = 'block';
                resultsGridEl.innerHTML = '';
                return;
            }

            const maxResults = 80;
            const shown = matches.slice(0, maxResults);

            resultsGridEl.innerHTML = shown.map(function(item) {
                const sectionId = escapeHtml(item.sectionId);
                const title = escapeHtml(item.itemTitle || item.sectionTitle || 'نتيجة بحث');
                const sectionTitle = escapeHtml(item.sectionTitle || 'القسم');
                const snippet = escapeHtml(extractSnippet(item.text, queryRaw));

                return '<button type="button" class="work-card search-result-card" data-target="' + sectionId + '">' +
                       '<div class="search-result-title">' + title + '</div>' +
                       '<div class="search-result-meta">' + sectionTitle + '</div>' +
                       '<p class="search-result-snippet">' + snippet + '</p>' +
                       '</button>';
            }).join('');

            resultCountEl.textContent = 'نتائج البحث: ' + matches.length + (matches.length > maxResults ? ' (عرض أول ' + maxResults + ')' : '');
            noResultsEl.style.display = 'none';
            resultsContainerEl.style.display = 'block';

            resultsGridEl.querySelectorAll('.search-result-card').forEach(function(card) {
                card.addEventListener('click', function() {
                    const targetId = card.getAttribute('data-target');
                    if (!targetId) return;

                    const tabButton = getNavButtonForSection(targetId);
                    if (typeof switchTab === 'function') {
                        switchTab(targetId, tabButton);
                    }

                    const targetSection = document.getElementById(targetId);
                    const canvas = document.querySelector('.youtube-canvas');
                    if (targetSection && canvas) {
                        setTimeout(function() {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 120);
                    }
                });
            });
        }

        function doSearch() {
            const rawQuery = collapseText(inputEl.value || '');
            const normalizedQuery = normalizeArabic(rawQuery);
            const terms = normalizedQuery.split(' ').filter(Boolean);

            if (!terms.length) {
                renderResults([], '');
                return;
            }

            const matches = searchState.index.filter(function(item) {
                return terms.every(function(term) {
                    return item.normalizedText.indexOf(term) !== -1;
                });
            });

            renderResults(matches, rawQuery);
        }

        searchState.index = buildSearchIndex();
        window.performLiveSearch = doSearch;

        if (!inputEl.dataset.searchBound) {
            inputEl.addEventListener('input', doSearch);
            inputEl.dataset.searchBound = '1';
        }
    }

    function initFloatingAudioWidget() {
        if (window.__atheerFloatingAudioWidgetBound) return;
        window.__atheerFloatingAudioWidgetBound = true;

        const widgetEl = document.getElementById('floatingAudioWidget');
        const expandBtn = document.getElementById('floatingAudioExpand');
        const toggleBtn = document.getElementById('floatingAudioToggle');
        const closeBtn = document.getElementById('floatingAudioClose');
        const controlsContainer = document.getElementById('floatingAudioControls');
        
        if (!widgetEl || !expandBtn || !toggleBtn || !closeBtn) return;
        const toggleIconUse = toggleBtn.querySelector('[data-floating-audio-toggle-icon] use');
        let currentAudio = null;

        function setToggleIcon(iconId) {
            if (!toggleIconUse) return;
            toggleIconUse.setAttribute('href', iconId);
            toggleIconUse.setAttribute('xlink:href', iconId);
        }

        function updateToggleState() {
            if (!currentAudio) return;
            if (currentAudio.paused) {
                setToggleIcon('#icon-play');
                widgetEl.classList.add('paused');
            } else {
                setToggleIcon('#icon-pause');
                widgetEl.classList.remove('paused');
            }
        }
        function showWidgetFor(audioEl) {
            currentAudio = audioEl;
            widgetEl.classList.add('show');
            widgetEl.classList.remove('expanded'); 
            updateToggleState();
        }

        function stopAndHide() {
            if (currentAudio) {
                currentAudio.pause();
                try { currentAudio.currentTime = 0; } catch (e) {}
                if (typeof window.stripProtectedAudioSource === 'function') {
                    window.stripProtectedAudioSource(currentAudio, false);
                }
            }
            widgetEl.classList.remove('show');
            widgetEl.classList.remove('expanded');
            currentAudio = null;
        }

        expandBtn.addEventListener('click', function() {
            widgetEl.classList.toggle('expanded');
        });

        toggleBtn.addEventListener('click', function() {
            if (!currentAudio) return;
            if (currentAudio.paused) {
                if (typeof window.prepareProtectedAudio === 'function') {
                    window.prepareProtectedAudio(currentAudio);
                }
                currentAudio.play().catch(function(){});
            } else {
                currentAudio.pause();
            }
            updateToggleState();
        });

        closeBtn.addEventListener('click', function() {
            stopAndHide();
        });

        document.addEventListener('play', function(e) {
            const el = e.target;
            if (!(el instanceof HTMLAudioElement)) return;
            showWidgetFor(el);
        }, true);

        document.addEventListener('pause', function(e) {
            const el = e.target;
            if (!(el instanceof HTMLAudioElement)) return;
            if (currentAudio && el === currentAudio) updateToggleState();
        }, true);

        document.addEventListener('ended', function(e) {
            const el = e.target;
            if (!(el instanceof HTMLAudioElement)) return;
            if (currentAudio && el === currentAudio) stopAndHide();
        }, true);
    }    

    function initFontAwesomeIconFallbacks() {
        const icons = {
            'music': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
            'building': '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M8 15h.01M16 15h.01"/>',
            'medal': '<circle cx="12" cy="14" r="5"/><path d="M9 2l3 6 3-6M8 2h8"/><path d="M12 11v6M9 14h6"/>',
            'bolt': '<path d="M13 2L4 14h7l-1 8 10-13h-7l1-7z"/>',
            'tags': '<path d="M20 13l-7 7-9-9V4h7l9 9z"/><path d="M7.5 7.5h.01"/><path d="M14 4l7 7"/>',
            'ring': '<circle cx="12" cy="15" r="6"/><path d="M9 5h6l-3 4-3-4z"/>',
            'gift': '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/><path d="M7.5 8A2.5 2.5 0 1 1 12 6a2.5 2.5 0 1 1 4.5 2"/>',
            'school': '<path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6M7 11h.01M12 11h.01M17 11h.01"/>',
            'microphone': '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/>',
            'scroll': '<path d="M8 21h9a3 3 0 0 0 3-3V5a2 2 0 0 0-2-2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3z"/><path d="M8 21a3 3 0 0 1 0-6h9M8 7h7M8 11h6"/>',
            'guitar': '<path d="M15 6l3-3 3 3-3 3"/><path d="M16 8l-7 7"/><path d="M9 13a5 5 0 1 0 2 2"/><circle cx="7" cy="17" r="1.5"/>',
            'headphones': '<path d="M4 14v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2zM20 14v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2z"/><path d="M4 14a8 8 0 0 1 16 0"/>',
            'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.1a4 4 0 0 1 0 7.8"/>',
            'film': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M17 9h4M3 15h4M17 15h4"/>',
            'podcast': '<circle cx="12" cy="11" r="3"/><path d="M17 11a5 5 0 1 0-10 0M19.5 11a7.5 7.5 0 1 0-15 0M10 16h4l1 5H9l1-5z"/>',
            'sliders-h': '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
            'briefcase': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2M3 12h18"/>',
            'bullhorn': '<path d="M4 13h4l9 4V7l-9 4H4v2z"/><path d="M8 13l2 6"/>',
            'bullseye': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
            'calendar': '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
            'chart-bar': '<path d="M4 20h16"/><rect x="6" y="11" width="3" height="6"/><rect x="11" y="7" width="3" height="10"/><rect x="16" y="4" width="3" height="13"/>',
            'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
            'chevron-down': '<path d="M6 9l6 6 6-6"/>',
            'chevron-up': '<path d="M18 15l-6-6-6 6"/>',
            'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
            'copyright': '<circle cx="12" cy="12" r="9"/><path d="M15 9.5A4 4 0 1 0 15 14.5"/>',
            'cut': '<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5L19 19M8.5 15.5L19 5"/>',
            'exchange-alt': '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
            'exclamation-triangle': '<path d="M12 3l10 18H2L12 3z"/><path d="M12 9v5M12 18h.01"/>',
            'eye': '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
            'file': '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
            'fire': '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-1 3-3 4-5 6 0-3-1-5-3-7 0 6-4 7-4 11a7 7 0 0 0 9 6z"/>',
            'folder-open': '<path d="M3 7h7l2 2h9v3"/><path d="M3 11h18l-2 8H5l-2-8z"/>',
            'gavel': '<path d="M14 5l5 5M12 7l5 5M5 19l7-7M3 21h8"/><path d="M10 4l10 10"/>',
            'heart': '<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
            'icons': '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
            'info-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
            'laptop-code': '<path d="M4 5h16v11H4zM2 20h20"/><path d="M9 9l-2 2 2 2M15 9l2 2-2 2"/>',
            'lightbulb': '<path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4z"/>',
            'location-dot': '<path d="M12 22s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
            'palette': '<path d="M12 3a9 9 0 0 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h1a7 7 0 0 0 0-10h-2z"/><circle cx="7.5" cy="10" r=".7"/><circle cx="10" cy="7" r=".7"/><circle cx="14" cy="7" r=".7"/>',
            'pen-nib': '<path d="M12 2l7 7-4 11-3-3-3 3-4-4 3-3-3-3 7-8z"/><circle cx="12" cy="12" r="1.5"/>',
            'play': '<path d="M8 5v14l11-7-11-7z"/>',
            'pause': '<path d="M8 5h3v14H8zM15 5h3v14h-3z"/>',
            'question-circle': '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4.8 1.7c-1.1.8-2.3 1.4-2.3 3.3M12 18h.01"/>',
            'quote-left': '<path d="M9 7H5v6h4v4H3v-6a6 6 0 0 1 6-6v2zM21 7h-4v6h4v4h-6v-6a6 6 0 0 1 6-6v2z"/>',
            'rocket': '<path d="M5 15c-1 1-2 4-2 6 2 0 5-1 6-2"/><path d="M9 15L5 11C8 5 13 2 21 3c1 8-2 13-8 16l-4-4z"/><circle cx="15" cy="9" r="2"/>',
            'route': '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h5a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8"/>',
            'shield': '<path d="M12 2l8 4v6c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/>',
            'spinner': '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
            'star': '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3z"/>',
            'user-circle': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="9" r="3"/><path d="M6.5 19a6 6 0 0 1 11 0"/>',
            'video': '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>'
        };

        const aliases = {
            'microphone-alt': 'microphone',
            'calendar-alt': 'calendar',
            'file-alt': 'file',
            'file-contract': 'file',
            'hand-holding-usd': 'tags',
            'school': 'school',
            'shield-alt': 'shield',
            'shield-heart': 'shield',
            'spell-check': 'check-circle',
            'user-shield': 'shield'
        };

        function iconNameFor(iconEl) {
            const skip = {
                'fa': true,
                'fas': true,
                'far': true,
                'fab': true,
                'fal': true,
                'fa-solid': true,
                'fa-regular': true,
                'fa-brands': true,
                'fa-spin': true
            };

            for (const className of iconEl.classList) {
                if (className.indexOf('fa-') !== 0 || skip[className]) continue;
                const name = className.replace(/^fa-/, '');
                if (icons[name] || icons[aliases[name]]) return aliases[name] || name;
            }
            return '';
        }

        function fontAwesomeRendered(iconEl) {
            try {
                const before = window.getComputedStyle(iconEl, '::before').content;
                return before && before !== 'none' && before !== 'normal' && before !== '""' && before !== "''";
            } catch (e) {
                return false;
            }
        }

        function makeSvg(paths) {
            return '<svg class="icon-fallback-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + paths + '</svg>';
        }

        function applyFallbacks(root) {
            const scope = root && root.querySelectorAll ? root : document;
            const iconEls = [];
            if (scope.matches && scope.matches('i[class*="fa-"]')) iconEls.push(scope);
            scope.querySelectorAll('i[class*="fa-"]').forEach(function(iconEl) {
                iconEls.push(iconEl);
            });

            iconEls.forEach(function(iconEl) {
                if (iconEl.dataset.faFallbackReady === '1') return;

                const name = iconNameFor(iconEl);
                const paths = icons[name];
                if (!paths) return;

                iconEl.dataset.faFallbackReady = '1';
                iconEl.classList.add('fa-svg-fallback-active');
                iconEl.innerHTML = makeSvg(paths);
            });
        }

        applyFallbacks(document);

        if (window.__atheerFontAwesomeFallbackBound) return;
        window.__atheerFontAwesomeFallbackBound = true;

        if ('MutationObserver' in window && document.documentElement) {
            new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node && node.nodeType === 1) applyFallbacks(node);
                    });
                });
            }).observe(document.documentElement, { childList: true, subtree: true });
        }

        setTimeout(function() { applyFallbacks(document); }, 500);
        setTimeout(function() { applyFallbacks(document); }, 1600);
    }

    /* --- Init all page features --- */
    function initAll(){
        safeRun(function(){
            if(typeof applyTabRouteFromLocation==='function' && !window.__atheerInitialRouteApplied){
                window.__atheerInitialRouteApplied = true;
                applyTabRouteFromLocation(true);
            }
        });
        safeRun(function(){ if(typeof initObserver==='function') initObserver(); });
        safeRun(function(){ if(typeof updateThemeButtonIcon==='function') updateThemeButtonIcon(); });
        safeRun(function(){ animateCounters(); }); 
        safeRun(function(){ initScrollToTop(); });        
        safeRun(function(){ if(typeof initCompactAudioCards==='function') initCompactAudioCards(); });
        safeRun(function(){ if(typeof initSequentialAudioPlayback==='function') initSequentialAudioPlayback(); });
        safeRun(function(){ if(typeof initCustomAudioPlayers==='function') initCustomAudioPlayers(); });
        safeRun(function(){ if(typeof initGlobalAudioExclusivity==='function') initGlobalAudioExclusivity(); });
        safeRun(function(){ if(typeof initFloatingAudioWidget==='function') initFloatingAudioWidget(); });
        safeRun(function(){ if(typeof createFloatingNotes==='function') createFloatingNotes(); });
        safeRun(function(){ if(typeof initMagneticIcons==='function') initMagneticIcons(); });
        safeRun(function(){ if(typeof renderPoems==='function') renderPoems(); });
        safeRun(function(){ if(typeof initGlobalSearch==='function') initGlobalSearch(); });
        safeRun(function(){ if(typeof initWorksGalleryDropdown==='function') initWorksGalleryDropdown(); });
        safeRun(function(){ if(typeof initFontAwesomeIconFallbacks==='function') initFontAwesomeIconFallbacks(); });
        safeRun(function(){ if(typeof initReveal==='function') initReveal(); });
        safeRun(function(){ if(typeof initStickyHeaders==='function') initStickyHeaders(); }); // تفعيل الهيدر الثابت
        safeRun(function(){ if(typeof initFooterVisitCounter==='function') initFooterVisitCounter(); });
        
        /* Fallback: force reveal all hidden elements if observer didn't work */
        setTimeout(function(){
            document.querySelectorAll('.reveal:not(.active)').forEach(function(el){ el.classList.add('active'); });
            document.querySelectorAll('.reveal-left:not(.visible)').forEach(function(el){ el.classList.add('visible'); });
        }, 2000);
    }

    if(document.readyState==='loading'){
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
    window.addEventListener('load', initAll);
})();
