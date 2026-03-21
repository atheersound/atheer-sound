import re
import os

html_path = r"f:\WebSite\Atheer_Sound\index.html"
css_path = r"f:\WebSite\Atheer_Sound\style.css"

with open(html_path, "r", encoding="utf-8") as file:
    html_content = file.read()

# استخراج جميع الأكواد بین <style> و </style>
styles = re.findall(r'<style>(.*?)</style>', html_content, re.DOTALL)

if styles:
    print(f"تم العثور على {len(styles)} قوالب ستايل")
    # دمج التنسيقات
    combined_css = "\n\n/* ======================== */\n\n".join(styles).strip()
    
    with open(css_path, "w", encoding="utf-8") as css_file:
        css_file.write(combined_css)
        
    print("تم كتابة style.css بنجاح!")
    
    # حذف جميع الـ <style> من الـ HTML
    new_html_content = re.sub(r'<style>.*?</style>', '', html_content, flags=re.DOTALL)
    
    # إضافة <link rel="stylesheet" href="style.css"> قبل وسم </head>
    new_html_content = new_html_content.replace('</head>', '    <link rel="stylesheet" href="style.css">\n</head>')
    
    # إزالة أي مسافات فارغة متتالية لترتيب الـ head (اختياري، نتخطاه لعدم إفساد الضعط)
    
    with open(html_path, "w", encoding="utf-8") as file:
        file.write(new_html_content)
        
    print("تم استبدال الستايل بوصلة style.css في index.html بنجاح!")
else:
    print("لم يتم العثور على أي ستايلات.")
