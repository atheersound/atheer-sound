import re
import json

filepath = r'f:\WebSite\‏‏Atheer_Sounds\‏‏index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Regex to get Arabic text blocks
arabic_phrases = re.findall(r'[\u0600-\u06FF][\u0600-\u06FF\s0-9\-\.\!؟\،\:\"\'\(\)]*[\u0600-\u06FF]', html)

unique_phrases = set()
for p in arabic_phrases:
    cleaned = re.sub(r'\s+', ' ', p).strip()
    if len(cleaned) > 2 and not cleaned.isnumeric():
        unique_phrases.add(cleaned)

with open('arabic_strings.json', 'w', encoding='utf-8') as f:
    json.dump(list(unique_phrases), f, ensure_ascii=False, indent=2)

print('Extracted', len(unique_phrases), 'phrases')
