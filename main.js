const searchDatabase = [];

        function buildSearchDatabase() {
            searchDatabase.length = 0; 
            
            document.querySelectorAll('.work-card').forEach((card, index) => {
                let text = card.innerText || card.textContent || '';
                if (!card.id) card.id = 'work-card-s-' + index;
                let type = card.classList.contains('video-card') ? 'فيديو ومونتاج مونتاج' : 
                           card.classList.contains('audio-card') ? 'صوتي تسجيل زفة شيلة زفات شيلات تعليق أنشودة اناشيد' : 'تصميم جرافيكس هوية';
                
                let title = card.querySelector('.work-overlay')?.innerText || card.querySelector('h4')?.innerText || 'عمل فني';
                
                searchDatabase.push({
                    id: card.id,
                    title: title + ' (' + (card.classList.contains('video-card') ? 'فيديو' : card.classList.contains('audio-card') ? 'صوت' : 'تصميم') + ')',
                    text: text + ' ' + type + ' ' + title + ' أعمال معرض',
                    page: 'works-page',
                    icon: card.classList.contains('video-card') ? 'fas fa-video' : card.classList.contains('audio-card') ? 'fas fa-headphones' : 'fas fa-palette',
                    element: card
                });
            });

            document.querySelectorAll('.service-box').forEach((box, index) => {
                let title = box.querySelector('h4')?.innerText || '';
                if (!box.id) box.id = 'service-box-s-' + index;
                searchDatabase.push({
                    id: box.id,
                    title: title,
                    text: 'خدمة موقع قسم خدمات رئيسية ' + title,
                    page: 'home-page',
                    icon: 'fas fa-concierge-bell',
                    element: box
                });
            });

            document.querySelectorAll('.package-card').forEach((pkg, index) => {
                let title = pkg.querySelector('h3')?.innerText || '';
                let text = pkg.innerText || '';
                if (!pkg.id) pkg.id = 'package-card-s-' + index;
                searchDatabase.push({
                    id: pkg.id,
                    title: title,
                    text: text + ' باقات أسعار طلب حجز سعر كم',
                    page: 'home-page',
                    icon: 'fas fa-box-open',
                    element: pkg
                });
            });

            document.querySelectorAll('.faq-item').forEach((faq, index) => {
                let title = faq.querySelector('.faq-question')?.innerText || '';
                let text = faq.innerText || '';
                if (!faq.id) faq.id = 'faq-item-s-' + index;
                searchDatabase.push({
                    id: faq.id,
                    title: title,
                    text: text + ' سؤال استفسار مساعدة دعم',
                    page: 'faq-page',
                    icon: 'fas fa-question-circle',
                    element: faq
                });
            });

            document.querySelectorAll('.literary-card').forEach((lit, index) => {
                let title = lit.querySelector('h4')?.innerText || '';
                let text = lit.innerText || '';
                if (!lit.id) lit.id = 'literary-card-s-' + index;
                searchDatabase.push({
                    id: lit.id,
                    title: title,
                    text: text + ' أدبي مقال كتابة تأليف لغة شعر نص',
                    page: 'literary-page',
                    icon: 'fas fa-book-open',
                    element: lit
                });
            });
            
            document.querySelectorAll('.graphic-id-card').forEach((card, index) => {
                if (!card.id) card.id = 'graphic-card-s-' + index;
                searchDatabase.push({
                    id: card.id,
                    title: 'تصميم هوية أو شعار',
                    text: 'تصميم جرافيك ابداعي، لوجو، هوية، أختام، بوسترات',
                    page: 'works-page',
                    icon: 'fas fa-palette',
                    element: card
                });
            });
        }

        function openSearchModal() {
            buildSearchDatabase();
            document.getElementById('searchModal').classList.add('active');
            let searchInput = document.getElementById('searchInput');
            searchInput.value = '';
            document.getElementById('searchResults').innerHTML = '<div class="no-results" style="margin-top:20px; font-weight:normal;"><i class="fas fa-search" style="font-size: 30px; display:block; margin-bottom:15px; color: var(--gold);"></i>اكتب أي كلمة للبحث في أثير ساوند...</div>';
            setTimeout(() => searchInput.focus(), 100);
        }

        function closeSearchModal() {
            document.getElementById('searchModal').classList.remove('active');
        }

        function performSearch() {
            let query = document.getElementById('searchInput').value.toLowerCase().trim();
            let resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '';

            if (query.length < 2) {
                resultsContainer.innerHTML = '<div class="no-results" style="margin-top:20px; font-weight:normal;"><i class="fas fa-search" style="font-size: 30px; display:block; margin-bottom:15px; color: var(--gold);"></i>اكتب المزيد لعرض النتائج...</div>';
                return;
            }

            let filtered = searchDatabase.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.text.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                resultsContainer.innerHTML = '<div class="no-results"><i class="fas fa-search-minus" style="font-size: 40px; margin-bottom:15px; color: var(--gold); display:block;"></i> لا توجد نتائج مطابقة لبحثك.</div>';
                return;
            }

            filtered.forEach(item => {
                let div = document.createElement('div');
                div.className = 'search-result-item';
                let pageName = item.page === 'works-page' ? 'معرض الأعمال' : 
                               item.page === 'home-page' ? 'الرئيسية' : 
                               item.page === 'faq-page' ? 'الأسئلة الشائعة' : 'الركن الأدبي';
                div.innerHTML = `
                    <i class="${item.icon}"></i>
                    <div class="search-result-text">
                        <h4>${item.title}</h4>
                        <p>اضغط للذهاب إلى: ${pageName}</p>
                    </div>
                `;
                div.onclick = () => {
                    closeSearchModal();
                    if(typeof cinematicSection === 'function') cinematicSection(item.page);
                    
                    if (item.page === 'works-page') {
                        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        let allBtn = document.querySelector('.filter-btn[onclick*="all"]');
                        if(allBtn) allBtn.classList.add('active');
                        if(typeof filterWorks === 'function') filterWorks('all', allBtn || document.querySelector('.filter-btn'));
                    }

                    setTimeout(() => {
                        let target = document.getElementById(item.id);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            let oldTransition = target.style.transition;
                            let oldBoxShadow = target.style.boxShadow;
                            target.style.transition = '0.5s';
                            target.style.boxShadow = '0 0 40px var(--gold)';
                            setTimeout(() => {
                                target.style.boxShadow = oldBoxShadow;
                            }, 2000);
                            
                            if (target.classList.contains('faq-item') && !target.classList.contains('active')) {
                                if(typeof toggleFAQ === 'function') toggleFAQ(target);
                            }
                        }
                    }, 800);
                };
                resultsContainer.appendChild(div);
            });
        }
    

/* ======================== */


        /* ====== Scroll Reveal ====== */
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, i * 80);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        function initReveal() {
            document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
                revealObserver.observe(el);
            });
        }

        /* ====== شريط المهارات المتحرك ====== */
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                        const target = parseInt(bar.dataset.target);
                        bar.style.width = target + '%';
                    });
                    entry.target.querySelectorAll('.skill-pct').forEach(pct => {
                        const target = parseInt(pct.dataset.val);
                        let count = 0;
                        const step = target / 60;
                        const interval = setInterval(() => {
                            count = Math.min(count + step, target);
                            pct.textContent = Math.ceil(count) + '%';
                            if (count >= target) clearInterval(interval);
                        }, 20);
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        function initSkills() {
            const sec = document.querySelector('.skills-section');
            if (sec) skillsObserver.observe(sec);
        }

        /* ====== Reveal لعناصر الشبكة (stagger) ====== */
        function addRevealToElements() {
            // إضافة reveal للإحصائيات
            document.querySelectorAll('.stat-box').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (i * 0.1) + 's';
            });
            // إضافة reveal لبطاقات الخدمات
            document.querySelectorAll('.service-box').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (i * 0.07) + 's';
            });
            // إضافة reveal للباقات
            document.querySelectorAll('.package-card').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (i * 0.15) + 's';
            });
            // إضافة reveal لبطاقات الأدب
            document.querySelectorAll('.literary-card').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (i * 0.1) + 's';
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            addRevealToElements();
            initReveal();
            initSkills();
        });

        // إعادة تشغيل Reveal عند تغيير الصفحة
        const _origCinematic = window.cinematicSection;
        if (typeof _origCinematic === 'function') {
            window.cinematicSection = function(id) {
                _origCinematic(id);
                setTimeout(() => {
                    initReveal();
                    initSkills();
                    if (id === 'literary-page') initPoemsModule();
                }, 450);
            };
        }
    

/* ======================== */


        /* ============================================================
         *  محرك القصائد — Poems Engine
         *  يعتمد على البيانات من ملف poems-data.js (window.poemsData)
         * ============================================================ */

        let _poemsInitialized = false;
        let _activeOccasion = 'all';
        let _currentPoem = null;

        function buildOccasionFilters() {
            const data = window.poemsData || [];
            const occurrences = ['all', ...new Set(data.map(p => p.occasion))];
            const labels = { all: '✨ الكل' };
            const container = document.getElementById('occasions-filter');
            if (!container) return;
            container.innerHTML = '';
            occurrences.forEach(occ => {
                const btn = document.createElement('button');
                btn.className = 'occ-btn' + (occ === 'all' ? ' active' : '');
                btn.textContent = labels[occ] || occ;
                btn.setAttribute('data-occ', occ);
                btn.onclick = () => {
                    document.querySelectorAll('.occ-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    _activeOccasion = occ;
                    renderPoems();
                };
                container.appendChild(btn);
            });
        }

        function renderPoems() {
            const data = window.poemsData || [];
            const grid = document.getElementById('poems-grid');
            const searchVal = (document.getElementById('poems-search-input') && document.getElementById('poems-search-input').value || '').trim().toLowerCase();
            if (!grid) return;

            const filtered = data.filter(p => {
                const matchOcc = _activeOccasion === 'all' || p.occasion === _activeOccasion;
                const matchSearch = !searchVal ||
                    p.title.toLowerCase().includes(searchVal) ||
                    p.text.toLowerCase().includes(searchVal);
                return matchOcc && matchSearch;
            });

            if (filtered.length === 0) {
                grid.innerHTML = '<div class="no-poems-msg"><i class="fas fa-feather" style="display:block;font-size:36px;margin-bottom:15px;color:rgba(212,175,55,0.3);"></i>لا توجد نتائج مطابقة</div>';
                return;
            }

            grid.innerHTML = filtered.map(function(p) {
                var lines = p.text.trim().split('\n').map(function(l){ return l.trim(); }).filter(function(l) { return l !== '' && !l.startsWith('د.') && l.indexOf('*') === -1 && l.indexOf('=') === -1 && l.indexOf('-') === -1; });
                var preview = lines.slice(0, 2).join('<br>') + ' ...';
                return '<div class="poem-card" onclick="openPoemModal(' + p.id + ')">' +
                    '<span class="poem-occasion-badge">' + p.occasion + '</span>' +
                    '<h4>' + p.title + '</h4>' +
                    '<div class="poem-preview">' + preview + '</div>' +
                    '<button class="poem-read-btn">قراءة القصيدة كاملة <i class="fas fa-angle-left"></i></button>' +
                    '</div>';
            }).join('');
        }

        function openPoemModal(id) {
            var poem = (window.poemsData || []).filter(function(p){ return p.id === id; })[0];
            if (!poem) return;
            _currentPoem = poem;
            document.getElementById('pd-title').textContent = poem.title;
            document.getElementById('pd-badge').textContent = poem.occasion;
            var lines = poem.text.trim().split('\n');
            document.getElementById('pd-text').innerHTML = lines.map(function(l){
                return '<span class="poem-line">' + (l || '&nbsp;') + '</span>';
            }).join('');
            
            cinematicSection('poem-detail-view');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function closePoemModal() {
            _currentPoem = null;
            cinematicSection('literary-page');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function sharePoemWA() {
            if (!_currentPoem) return;
            var msg = '✨ قصيدة: ' + _currentPoem.title + '\n\n' + _currentPoem.text + '\n\n— أثير ساوند للخدمات الأدبية';
            window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
        }

        function orderPoem() {
            if (!_currentPoem) return;
            var msg = 'السلام عليكم، أرغب في طلب قصيدة في نفس أسلوب قصيدة "' + _currentPoem.title + '" ضمن تصنيف (' + _currentPoem.occasion + ').';
            window.open('https://wa.me/967770080131?text=' + encodeURIComponent(msg), '_blank');
        }
        
        function orderBook(title) {
            var msg = 'السلام عليكم، أرغب في شراء كتاب "' + title + '" المعروض بسعر 1$.';
            window.open('https://wa.me/967770080131?text=' + encodeURIComponent(msg), '_blank');
        }

        function switchLitTab(tabName) {
            document.querySelectorAll('.lit-tab-btn').forEach(function(b){ b.classList.remove('active'); });
            document.querySelectorAll('.lit-sub-content').forEach(function(c){ c.classList.remove('active'); });
            var btn = document.getElementById('lit-tab-' + tabName);
            var content = document.getElementById('lit-sub-' + tabName);
            if (btn) btn.classList.add('active');
            if (content) {
                content.classList.add('active');
                if (tabName === 'poems' && !_poemsInitialized) initPoemsModule();
                if (tabName === 'qulwala') {
                    var cap = document.getElementById('capsules-container');
                    if (cap && cap.children.length === 0) buildCapsules();
                }
            }
        }

        function initPoemsModule() {
            _poemsInitialized = true;
            buildOccasionFilters();
            renderPoems();
        }

        function buildCapsules() {
            var container = document.getElementById('capsules-container');
            if (!container || container.children.length > 0) return;
            var capsuleData = window.capsuleData || [];
            capsuleData.forEach(function(item) {
                var div = document.createElement('div');
                div.className = 'capsule-card';
                div.innerHTML = '<div class="capsule-front"><i class="fas fa-times-circle" style="margin-left:6px;"></i>' + item.wrong + '</div>' +
                    '<div class="capsule-back"><i class="fas fa-check-circle" style="margin-left:6px;"></i>' + item.correct + '</div>';
                container.appendChild(div);
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                var modal = document.getElementById('poemModal');
                if (modal && modal.classList.contains('active')) closePoemModal();
            }
        });
    

/* ======================== */


        // --- تهيئة المشغل المطور (SoundCloud Style) ---
        function initCustomAudioPlayers() {
            // مسح أي مشغلات مطورة قديمة لتجنب التكرار
            document.querySelectorAll('.custom-audio-player').forEach(p => p.remove());

            const audioElements = document.querySelectorAll('.audio-content audio, audio.custom-player-initialized, audio[controls]');
            
            audioElements.forEach(audio => {
                audio.classList.add('custom-player-initialized');
                audio.removeAttribute('controls');
                
                // إخفاء تام وعميق للمشغل الافتراضي حتى لا يظهر أبداً بأي شكل من الأشكال
                audio.style.display = 'none';
                audio.style.visibility = 'hidden';
                audio.style.height = '0';
                audio.style.width = '0';
                audio.style.position = 'absolute';
                
                // بناء المشغل المطور
                const playerContainer = document.createElement('div');
                playerContainer.className = 'custom-audio-player';
                
                const playBtn = document.createElement('button');
                playBtn.className = 'play-pause-btn';
                playBtn.innerHTML = '<i class="fas fa-play" style="margin-left: 3px;"></i>';
                
                const centerDiv = document.createElement('div');
                centerDiv.className = 'player-center';
                
                const waveAnim = document.createElement('div');
                waveAnim.className = 'waveform-anim';
                for(let i=0; i<12; i++) {
                    const span = document.createElement('span');
                    waveAnim.appendChild(span);
                }
                
                const progressDiv = document.createElement('div');
                progressDiv.className = 'progress-container';
                const timeSpan = document.createElement('span');
                timeSpan.textContent = '0:00 / 0:00';
                timeSpan.style.direction = 'ltr';
                const seekBar = document.createElement('input');
                seekBar.type = 'range';
                seekBar.className = 'seek-bar';
                seekBar.value = '0';
                seekBar.max = '100';
                
                progressDiv.appendChild(seekBar);
                progressDiv.appendChild(timeSpan);
                centerDiv.appendChild(waveAnim);
                centerDiv.appendChild(progressDiv);
                
                playerContainer.appendChild(playBtn);
                playerContainer.appendChild(centerDiv);
                
                // إدراج المشغل بجوار الـ audio المخفي
                audio.parentNode.insertBefore(playerContainer, audio.nextSibling);
                
                const formatTime = (time) => {
                    if (isNaN(time)) return '0:00';
                    const min = Math.floor(time / 60);
                    const sec = Math.floor(time % 60);
                    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
                };

                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (audio.paused) {
                        audio.play();
                    } else {
                        audio.pause();
                    }
                });

                audio.addEventListener('play', () => {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    waveAnim.classList.add('playing');
                });

                audio.addEventListener('pause', () => {
                    playBtn.innerHTML = '<i class="fas fa-play" style="margin-left: 3px;"></i>';
                    waveAnim.classList.remove('playing');
                });

                audio.addEventListener('loadedmetadata', () => {
                    timeSpan.textContent = `0:00 / ${formatTime(audio.duration)}`;
                });

                audio.addEventListener('timeupdate', () => {
                    const percent = (audio.currentTime / audio.duration) * 100 || 0;
                    seekBar.value = percent;
                    timeSpan.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
                });

                seekBar.addEventListener('input', (e) => {
                    const seekTo = (e.target.value / 100) * audio.duration;
                    audio.currentTime = seekTo;
                });
                
                seekBar.addEventListener('mousedown', (e) => e.stopPropagation());
                seekBar.addEventListener('touchstart', (e) => e.stopPropagation());
            });
        }

        // استدعاء الدالة عند تحميل الصفحة وأيضاً عند أي عملية فلترة أو تغيير صفحات
        document.addEventListener('DOMContentLoaded', () => {
            initCustomAudioPlayers();
        });

        // إيقاف جميع المقاطع والتأكد من عدم التداخل بين الملفات الصوتية والفيديو
        var ytPlayers = [];
        
        // تحميل YouTube API
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        function onYouTubeIframeAPIReady() {
            var iframes = document.querySelectorAll('iframe[src*="youtube"]');
            iframes.forEach(function(iframe, index) {
                iframe.id = iframe.id || 'ytplayer_' + index;
                var player = new YT.Player(iframe.id, {
                    events: {
                        'onStateChange': onPlayerStateChange
                    }
                });
                ytPlayers.push(player);
            });
        }

        function onPlayerStateChange(event) {
            // إذا بدأ تشغيل فيديو
            if (event.data == YT.PlayerState.PLAYING) {
                // إيقاف مقاطع الصوت (audio)
                var audios = document.getElementsByTagName('audio');
                for(var i = 0; i < audios.length; i++){
                    if(!audios[i].paused) audios[i].pause();
                }
                // إيقاف الفيديوهات الأخرى
                ytPlayers.forEach(function(p) {
                    if (p !== event.target && p.pauseVideo) {
                        try { p.pauseVideo(); } catch(e){}
                    }
                });
            }
        }

        // إيقاف عند تشغيل ملف صوتي (Audio)
        document.addEventListener('play', function(e){
            // إيقاف المقاطع الصوتية الأخرى
            var audios = document.getElementsByTagName('audio');
            for(var i = 0; i < audios.length; i++){
                if(audios[i] != e.target && !audios[i].paused){
                    audios[i].pause();
                }
            }
            
            // إيقاف جميع فيديوهات اليوتيوب المفتوحة
            if(e.target.tagName && e.target.tagName.toLowerCase() === 'audio') {
                ytPlayers.forEach(function(p) {
                    if(p.pauseVideo) {
                        try { p.pauseVideo(); } catch(e){}
                    }
                });
            }
        }, true);