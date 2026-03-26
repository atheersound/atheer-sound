/**
 * Atheer Sound — Language Switcher (Arabic ↔ English)
 * Strategy: data-i18n attributes + JS dictionary
 * Arabic is the default; switching to English swaps every tagged element
 * and flips document direction to LTR. No page reload.
 */

// ─── Translations dictionary ─────────────────────────────────────────────────
const translations = {

  // ── Navigation ────────────────────────────────────────────────────────────
  'nav-home':        { ar: 'الرئيسية',         en: 'Home' },
  'nav-works':       { ar: 'معرض الأعمال',      en: 'Portfolio' },
  'nav-services':    { ar: 'خدماتنا',           en: 'Services' },
  'nav-literary':    { ar: 'الركن الأدبي',      en: 'Literary Corner' },
  'nav-community':   { ar: 'مجتمع أثير',        en: 'Atheer Community' },
  'nav-about':       { ar: 'من نحن',            en: 'About Us' },
  'nav-contact':     { ar: 'اطلب خدمتك',        en: 'Request Service' },

  // ── Side menu ─────────────────────────────────────────────────────────────
  'side-menu-title': { ar: 'روابط سريعة',       en: 'Quick Links' },
  'side-home-text':  { ar: 'الرئيسية',          en: 'Home' },
  'side-works-text': { ar: 'معرض الأعمال',      en: 'Portfolio' },
  'side-services-text':{ ar: 'خدماتنا',         en: 'Services' },
  'side-literary-text':{ ar: 'الركن الأدبي',    en: 'Literary Corner' },
  'side-partners-text':{ ar: 'شركاء النجاح',    en: 'Partners' },
  'side-faq-text':   { ar: 'الأسئلة الشائعة',   en: 'FAQ' },
  'side-privacy-text':{ ar: 'سياسة الخصوصية',  en: 'Privacy Policy' },
  'side-search-text':{ ar: 'بحث شامل',          en: 'Search' },

  // ── Announcement bar ──────────────────────────────────────────────────────
  'announce-badge-1':{ ar: 'تحديث',             en: 'Update' },
  'announce-text-1': { ar: 'أهلاً بكم في الموقع الرسمي لأثير ساوند.. منصتكم الأولى للإنتاج الفني والأكاديمي.',
                       en: 'Welcome to Atheer Sound — your premier platform for artistic and academic production.' },
  'announce-badge-2':{ ar: 'جديدنا',            en: 'New' },
  'announce-link-2': { ar: 'تعرف على باقاتنا الحصرية بأسعار تنافسية!',
                       en: 'Discover our exclusive packages at competitive prices!' },
  'announce-badge-3':{ ar: 'خدمات',             en: 'Services' },
  'announce-link-3': { ar: 'استمع الآن لأحدث أعمالنا الفنية في معرض الأعمال',
                       en: 'Listen now to our latest works in the portfolio' },
  'announce-badge-4':{ ar: 'أدب',               en: 'Literature' },
  'announce-text-4': { ar: 'قريبا مسابقة أثير الأدبية لكل الشعراء المبدعين.',
                       en: 'Coming soon: Atheer Literary Competition for all creative poets.' },

  // ── Competition banner ────────────────────────────────────────────────────
  'comp-exclusive-tag':{ ar: 'حصرياً',          en: 'Exclusively' },
  'comp-main-title': { ar: 'مسابقة أثير ساوند الأدبية',
                       en: 'Atheer Sound Literary Competition' },
  'comp-main-sub':   { ar: 'شارك موهبتك الأدبية وانضم إلى مجتمع أثير',
                       en: 'Share your literary talent and join the Atheer community' },
  'comp-cta-pulse':  { ar: 'اكتشف الآن',        en: 'Discover Now' },

  // ── Visitor counter ───────────────────────────────────────────────────────
  'vc-label':        { ar: 'زوار الموقع',        en: 'Site Visitors' },

  // ── Hero section ──────────────────────────────────────────────────────────
  'hero-title':      { ar: 'أثير ساوند للإنتاج الفني',
                       en: 'Atheer Sound – Artistic Production' },
  'hero-cta':        { ar: 'استمع لأعمالنا',   en: 'Listen to Our Works' },

  // ── Academic seals ────────────────────────────────────────────────────────
  'seal-1-title':    { ar: 'بصمة الإتقان اللغوي',  en: 'Academic Language Excellence' },
  'seal-1-body':     { ar: 'إشراف مباشر من نخبة الأكاديميين لضمان دقة النحو، وسلامة الصرف، وجمال البيان.',
                       en: 'Direct supervision by elite academics to ensure grammatical accuracy, morphological precision, and eloquent expression.' },
  'seal-2-title':    { ar: 'بصمة الإتقان الفني',   en: 'Artistic Production Excellence' },
  'seal-2-body':     { ar: 'إشراف هندسي يضمن أعلى معايير الجودة في الإنتاج الصوتي، والمكساج، والمونتاج.',
                       en: 'Engineering oversight ensuring the highest quality standards in audio production, mixing, and editing.' },

  // ── Literary quote ────────────────────────────────────────────────────────
  'literary-quote':  { ar: '"أثيرٌ يسكبُ الألحانَ سحراً.. ليُروي مسمعَ الدنيا جمالا"',
                       en: '"Atheer pours melodies like magic… narrating beauty to the ears of the world"' },

  // ── Services section ──────────────────────────────────────────────────────
  'section-services-title':{ ar: 'خدماتنا الفنية والإعلامية', en: 'Our Artistic & Media Services' },
  'svc-audio':       { ar: 'الإنتاج الصوتي والموسيقي',     en: 'Audio & Musical Production' },
  'svc-events':      { ar: 'المناسبات والإهداءات',          en: 'Events & Dedications' },
  'svc-video':       { ar: 'المونتاج وتصميم الفيديو',       en: 'Video Editing & Design' },
  'svc-design':      { ar: 'التصميم والهوية البصرية',       en: 'Design & Visual Identity' },
  'svc-voiceover':   { ar: 'التعليق الصوتي المتقدم',        en: 'Advanced Voice-Over' },
  'svc-literary':    { ar: 'الخدمات الأدبية واللغوية',      en: 'Literary & Linguistic Services' },
  'svc-academic':    { ar: 'الخدمات الأكاديمية والنشر',     en: 'Academic & Publishing Services' },
  'svc-web':         { ar: 'تطوير الويب والتطبيقات',        en: 'Web & App Development' },

  // ── Packages ──────────────────────────────────────────────────────────────
  'section-packages-title':{ ar: 'باقاتنا الملكية', en: 'Our Royal Packages' },
  'pkg-bronze-title':{ ar: 'الباقة البرونزية',    en: 'Bronze Package' },
  'pkg-bronze-f1':   { ar: 'إنتاج عمل فني أساسي بجودة عالية', en: 'Basic artistic production with high quality' },
  'pkg-bronze-f2':   { ar: 'تعديلات مجانية مرنة لضمان الرضا', en: 'Free flexible revisions for full satisfaction' },
  'pkg-bronze-f3':   { ar: 'تسليم سريع خلال 5 أيام عمل',      en: 'Fast delivery within 5 business days' },
  'pkg-bronze-btn':  { ar: 'اطلب الآن',           en: 'Order Now' },
  'pkg-silver-badge':{ ar: 'الأكثر طلباً',        en: 'Most Popular' },
  'pkg-silver-title':{ ar: 'الباقة الفضية',       en: 'Silver Package' },
  'pkg-silver-f1':   { ar: 'إنتاج فني متكامل (كلمات وألحان)', en: 'Complete production (lyrics & music)' },
  'pkg-silver-f2':   { ar: 'هندسة صوتية ومكساج احترافي',      en: 'Professional audio engineering & mixing' },
  'pkg-silver-f3':   { ar: 'تسليم سريع ومضمون خلال 3 أيام',   en: 'Guaranteed delivery within 3 days' },
  'pkg-silver-btn':  { ar: 'اطلب الآن',           en: 'Order Now' },
  'pkg-gold-title':  { ar: 'الباقة الذهبية (VIP)',  en: 'Gold Package (VIP)' },
  'pkg-gold-f1':     { ar: 'إنتاج حصري (قصيدة، لحن، وأداء)', en: 'Exclusive production (poem, melody & performance)' },
  'pkg-gold-f2':     { ar: 'مونتاج فيديو سينمائي بدقة 4K',   en: 'Cinematic 4K video editing' },
  'pkg-gold-f3':     { ar: 'أولوية قصوى في التنفيذ والمتابعة', en: 'Top priority execution & follow-up' },
  'pkg-gold-btn':    { ar: 'اطلب الآن',           en: 'Order Now' },

  // ── Stats section ─────────────────────────────────────────────────────────
  'section-stats-title':{ ar: 'لغة الأرقام والإنجازات', en: 'Numbers & Achievements' },
  'stat-works-label':{ ar: 'عمل فني منتج',           en: 'Artistic works produced' },
  'stat-schools-label':{ ar: 'مدرسة ومؤسسة تعليمية', en: 'Schools & educational institutions' },
  'stat-events-label':{ ar: 'أوبريت وزفة حصرية',     en: 'Exclusive operettas & wedding songs' },
  'stat-years-label':{ ar: 'سنوات من التميز',         en: 'Years of excellence' },
  'chart-bar':       { ar: 'عمودي',                  en: 'Bar' },
  'chart-line':      { ar: 'خطي',                    en: 'Line' },
  'chart-doughnut':  { ar: 'دائري',                  en: 'Doughnut' },
  'chart-insight-default':{ ar: 'اضغط على أي عمود لمعرفة القيمة التفصيلية',
                             en: 'Click any bar to see detailed value' },

  // ── Partners section ──────────────────────────────────────────────────────
  'section-partners-title':{ ar: 'آراء شركاء النجاح', en: 'Partner Testimonials' },

  // ── Works page ────────────────────────────────────────────────────────────
  'section-works-title':{ ar: 'معرض الإبداع الفني', en: 'Creative Arts Portfolio' },
  'filter-all':      { ar: 'الكل',                  en: 'All' },
  'filter-audio':    { ar: 'الإنتاج الصوتي',        en: 'Audio Production' },
  'filter-video':    { ar: 'المونتاج المرئي',        en: 'Video Editing' },
  'filter-graphic':  { ar: 'الجرافيكس',             en: 'Graphics' },
  'filter-litacad':  { ar: 'الأدبية والأكاديمية',   en: 'Literary & Academic' },
  'filter-webapp':   { ar: 'ويب وتطبيقات',           en: 'Web & Apps' },
  'filter-other':    { ar: 'أخرى',                  en: 'Other' },
  'subfil-schools':  { ar: 'مدارس',                 en: 'Schools' },
  'subfil-music':    { ar: 'بموسيقا',               en: 'With Music' },
  'subfil-nomusic':  { ar: 'بدون موسيقا',           en: 'Without Music' },
  'subfil-shila':    { ar: 'شيلات بالأسماء',        en: 'Named Sheilas' },
  'subfil-zaffa':    { ar: 'زفات بالأسماء',         en: 'Named Zaffas' },
  'subfil-event':    { ar: 'مناسبات بالأسماء',      en: 'Named Events' },
  'subfil-voiceover':{ ar: 'تعليق صوتي',            en: 'Voice-Over' },

  // ── Services page ─────────────────────────────────────────────────────────
  'page-services-title':{ ar: 'جميع خدماتنا',       en: 'All Our Services' },

  // ── Literary page ─────────────────────────────────────────────────────────
  'lit-tab-poems':   { ar: 'قصائد أثير',            en: 'Atheer Poems' },
  'lit-tab-capsules':{ ar: 'كبسولات لغوية',         en: 'Linguistic Capsules' },
  'lit-tab-clinic':  { ar: 'عيادة أثير اللغوية',   en: 'Atheer Linguistic Clinic' },
  'lit-tab-library': { ar: 'مكتبة أثير',            en: 'Atheer Library' },

  // ── About page ────────────────────────────────────────────────────────────
  'section-about-title':{ ar: 'من نحن',             en: 'About Us' },

  // ── FAQ page ──────────────────────────────────────────────────────────────
  'section-faq-title':{ ar: 'الأسئلة الشائعة',     en: 'Frequently Asked Questions' },
  'faq-q1':          { ar: 'مدة تسليم الأعمال؟',   en: 'Delivery time?' },
  'faq-a1':          { ar: 'يتم تسليم معظم الأعمال خلال 2 إلى 5 أيام عمل، مع توفر خيار التسليم العاجل للمستعجلين.',
                       en: 'Most works are delivered within 2–5 business days, with an express option available for urgent orders.' },
  'faq-q2':          { ar: 'هل يمكن التعديل؟',     en: 'Are revisions possible?' },
  'faq-a2':          { ar: 'نوفر خدمة التعديلات الطفيفة مجاناً لضمان رضاكم التام عن العمل النهائي قبل الاعتماد.',
                       en: 'We offer free minor revisions to ensure your complete satisfaction before final approval.' },
  'faq-q3':          { ar: 'هل العمل حصري؟',       en: 'Is the work exclusive?' },
  'faq-a3':          { ar: 'نعم بالتأكيد، نوفر خيار الإنتاج الحصري بكلمات وألحان خاصة لا تتكرر وتُصنع خصيصاً لك.',
                       en: 'Absolutely. We offer exclusive production with unique lyrics and melodies created just for you.' },
  'faq-q4':          { ar: 'لديكم أصوات أطفال؟',  en: 'Do you have children\'s voices?' },
  'faq-a4':          { ar: 'نعم، نوفر تشكيلة من أصوات الأطفال المتميزة التي تناسب الأناشيد والفعاليات المدرسية بقوة.',
                       en: 'Yes, we provide a selection of premium children\'s voices suited for anthems and school events.' },
  'faq-q5':          { ar: 'زفات بالأسماء؟',       en: 'Personalized wedding songs?' },
  'faq-a5':          { ar: 'بكل تأكيد، ننفذ زفات التخرج والأعراس بكلمات مخصصة تذكر الأسماء والصفات بشكل أدبي راقٍ.',
                       en: 'Absolutely. We create graduation and wedding songs with custom lyrics featuring names and attributes in an elegant literary style.' },
  'faq-q6':          { ar: 'توفرون التدقيق اللغوي؟', en: 'Do you offer proofreading?' },
  'faq-a6':          { ar: 'نعم، فنحن نتميز بوجود متخصصين أكاديميين في التدقيق اللغوي والنحوي لضمان خلو أي عمل من الأخطاء.',
                       en: 'Yes. We have specialized academics in linguistic and grammatical proofreading to ensure error-free work.' },
  'faq-q7':          { ar: 'ما هي طرق الدفع؟',    en: 'What are the payment methods?' },
  'faq-a7':          { ar: 'في اليمن عبر (الكريمي، النجم، الحزمي)، وفي السعودية وباقي الدول عبر (التحويل البنكي المباشر) أو التطبيق المناسب، كما يمكن الدفع عبر المحافظ الإلكترونية.',
                       en: 'In Yemen: Al-Kuraimi, Al-Najm, Al-Hazmi. In Saudi Arabia & other countries: direct bank transfer or suitable apps. Electronic wallets are also accepted.' },
  'faq-q8':          { ar: 'كيف أستلم ملفاتي؟',   en: 'How do I receive my files?' },
  'faq-a8':          { ar: 'يتم تسليم الملفات بجودتها الأصلية العالية (WAV أو MP4) عبر روابط مؤمنة مثل Dropbox أو تليجرام.',
                       en: 'Files are delivered in their original high quality (WAV or MP4) via secure links like Dropbox or Telegram.' },

  // ── Contact page ──────────────────────────────────────────────────────────
  'section-contact-title':{ ar: 'تواصل معنا',       en: 'Contact Us' },
  'wa-name-placeholder':  { ar: 'اسمك / اسم مؤسستك', en: 'Your name / institution' },
  'wa-message-placeholder':{ ar: 'اكتب طلبك هنا..', en: 'Write your request here..' },
  'contact-send-btn':     { ar: 'إرسال عبر واتساب', en: 'Send via WhatsApp' },

  // ── Side books ────────────────────────────────────────────────────────────
  'side-books-title':{ ar: 'إصدارات أثير',          en: 'Atheer Publications' },

  // ── Community page ────────────────────────────────────────────────────────
  'section-community-title':{ ar: 'مجتمع أثير الأدبي', en: 'Atheer Literary Community' },

  // ── Privacy page ──────────────────────────────────────────────────────────
  'section-privacy-title':{ ar: 'سياسة الخصوصية',  en: 'Privacy Policy' },

  // ── Service detail view ───────────────────────────────────────────────────
  'view-related-btn':{ ar: 'عرض الأعمال ذات الصلة', en: 'View Related Works' },
  'order-service-btn':{ ar: 'اطلب الخدمة عبر واتساب', en: 'Order via WhatsApp' },

  // ── Promo section ─────────────────────────────────────────────────────────
  'promo-badge':     { ar: 'الأكثر مبيعاً في أثير الأدبي', en: 'Best Seller in Atheer Literary' },
  'promo-title':     { ar: 'تشكيلة غنية من الإصدارات والكتب الملهمة',
                       en: 'A Rich Collection of Inspiring Publications & Books' },
  'promo-book1-title':{ ar: 'خمسون لغزاً شعرياً',    en: 'Fifty Poetic Riddles' },
  'promo-book1-desc':{ ar: 'متعة الشعر وذكاء الألغاز لتنشيط الذهن وتذوق جمال وحلاوة اللغة العربية.',
                       en: 'The joy of poetry and the wit of riddles to activate the mind and appreciate the beauty of the Arabic language.' },
  'promo-book2-title':{ ar: 'نعم أستطيع!',            en: 'Yes I Can!' },
  'promo-book2-desc':{ ar: 'كتاب ملهم لكل من يتحدى العوائق ليحقق النجاح المذهل بالإرادة، يضم 20 قصة نجاح عظيمة.',
                       en: 'An inspiring book for everyone who challenges obstacles to achieve amazing success through willpower, featuring 20 great success stories.' },
  'promo-btn-get':   { ar: 'احصل على نسخك الآن',    en: 'Get Your Copy Now' },
  'promo-btn-browse':{ ar: 'تصفح المكتبة',           en: 'Browse the Library' },

  // ── Inspire modal ─────────────────────────────────────────────────────────
  'inspire-modal-title':{ ar: 'فكرة مُلهمة لك',     en: 'An Inspiring Idea for You' },
  'inspire-order-btn':  { ar: 'تنفيذ هذه الفكرة',   en: 'Execute This Idea' },

  // ── Image/video modal close ───────────────────────────────────────────────
  'modal-close-btn':    { ar: 'إغلاق',               en: 'Close' },

};

// ─── Helper: get current language ────────────────────────────────────────────
function getCurrentLang() {
  return localStorage.getItem('atheer_lang') || 'ar';
}

// ─── Main apply function ──────────────────────────────────────────────────────
function applyLanguage(lang) {
  const isAr = lang === 'ar';

  // 1. Document direction & lang attribute
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);

  // 2. Body class for any extra CSS hooks
  document.body.classList.toggle('en-layout', !isAr);

  // 3. Translate every element that carries [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      const text = translations[key][lang];
      // Use innerHTML for elements that may contain HTML (like icons inline)
      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = text;
      } else {
        // Preserve child nodes (e.g. <i> icons) if the element has a data-i18n-text-only attr
        if (el.getAttribute('data-i18n-text-only') === 'true') {
          // Only replace the last (or only) text node
          const textNodes = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE);
          if (textNodes.length) {
            textNodes[textNodes.length - 1].textContent = (isAr ? ' ' : ' ') + text;
          } else {
            el.textContent = text;
          }
        } else {
          el.textContent = text;
        }
      }
    }
  });

  // 4. Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) el.placeholder = translations[key][lang];
  });

  // 5. Update dropdown to reflect current language
  const dropdown = document.getElementById('lang-dropdown');
  if (dropdown) dropdown.value = lang;

  // 6. Fix chart direction if chart exists
  if (typeof statsChartInstance !== 'undefined' && statsChartInstance) {
    const scalesX = statsChartInstance.options.scales?.x;
    if (scalesX) {
      scalesX.reverse = isAr;
      statsChartInstance.update();
    }
  }

  // 7. Save preference
  localStorage.setItem('atheer_lang', lang);
}

// ─── Public function called by the dropdown ───────────────────────────────────
function changeLanguage(langCode) {
  applyLanguage(langCode);
}

// ─── On page load: restore saved preference ───────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('atheer_lang') || 'ar';
  applyLanguage(saved);
});