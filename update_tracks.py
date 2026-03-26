import re
import sys
import os

file_path = 'f:/WebSite/\u200F\u200FAtheer_Sounds/\u200F\u200Findex.html'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
except FileNotFoundError:
    print('File not found:', file_path)
    # Check current directory
    local_path = '\u200F\u200Findex.html'
    if os.path.exists(local_path):
        file_path = local_path
        with open(file_path, 'r', encoding='utf-8') as f:
            html = f.read()
    else:
        sys.exit(1)

tracks = [
    ('وهبت', 'audio-nomusic'),
    ('ودي', 'audio-nomusic'),
    ('الدبيلي', 'audio-shila'),
    ('لله يا وطن', 'audio-shila'),
    ('يا صاحبي مالك', 'audio-shila'),
    ('يا نجوم الليل', 'audio-shila'),
    ('مهما قسى', 'audio-shila'),
    ('الكرشمي', 'audio-shila'),
    ('لا تفكر يا العريس', 'audio-zaffa'),
    ('اقبلي روان', 'audio-zaffa'),
    ('ألا قم شلني', 'audio-zaffa'),
    ('من أين أبدأ', 'audio-music')
]

pattern = re.compile(r'(<div class=\"work-card audio-card(.*?)\">.*?<h4>(.*?)</h4>)', re.DOTALL)

matched_names = set()

def repl(m):
    full_match = m.group(1)
    classes = m.group(2)
    title = m.group(3)
    
    new_classes = set(classes.split())
    
    sub_cats = ['audio-schools', 'audio-music', 'audio-nomusic', 'audio-shila', 'audio-zaffa', 'audio-event', 'audio-voiceover']
    
    changed = False
    clean_title = title.replace('.', '').strip()
    
    for search_term, target_class in tracks:
        if search_term in clean_title:
            for sc in sub_cats:
                if sc in new_classes:
                    new_classes.remove(sc)
            new_classes.add(target_class)
            changed = True
            matched_names.add(search_term)
            print('Updated:', clean_title, '->', target_class)
            break
            
    if changed:
        old_class_str = classes
        new_class_str = ' ' + ' '.join(sorted(new_classes))
        return full_match.replace('class=\"work-card audio-card' + old_class_str + '\"', 'class=\"work-card audio-card' + new_class_str + '\"')
        
    return full_match

new_html = pattern.sub(repl, html)

for term, _ in tracks:
    if term not in matched_names:
        print('Warning: Could not find track containing:', term)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_html)
print('Done!')
