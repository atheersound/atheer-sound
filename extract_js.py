import re

html_path = r"f:\WebSite\Atheer_Sound\index.html"
js_path = r"f:\WebSite\Atheer_Sound\main.js"

with open(html_path, "r", encoding="utf-8") as file:
    html_content = file.read()

# إيجاد جميع الـ script المضمنة
scripts = re.findall(r'<script(?![^>]*src=)>([\s\S]*?)</script>', html_content)

if scripts:
    print(f"تم العثور على {len(scripts)} قوالب script مضمنة")
    # استخراج السكريبت الأول (الخاص بالثيم) ليبقى في الـ head إذا كان يحوي localStorage
    theme_script = ""
    js_parts = []
    
    for s in scripts:
        if "localStorage.getItem('theme')" in s:
            theme_script = f"\n    <script>{s}</script>\n"
        else:
            js_parts.append(s)
            
    combined_js = "\n\n/* ======================== */\n\n".join(js_parts).strip()
    
    with open(js_path, "w", encoding="utf-8") as js_file:
        js_file.write(combined_js)
        
    print("تم كتابة main.js بنجاح!")
    
    # حذف جميع الـ script المضمنة
    new_html_content = re.sub(r'<script(?![^>]*src=)>[\s\S]*?</script>', '', html_content)
    
    # إعادة سكربت الثيم إلى الـ head
    new_html_content = new_html_content.replace('</head>', f'{theme_script}</head>')
    
    # إضافة main.js قبل </body>
    new_html_content = new_html_content.replace('</body>', '    <script src="main.js"></script>\n</body>')
    
    with open(html_path, "w", encoding="utf-8") as file:
        file.write(new_html_content)
        
    print("تم استبدال الـ scripts في index.html بنجاح!")
else:
    print("لم يتم العثور على أي سكربتات مضمنة.")
