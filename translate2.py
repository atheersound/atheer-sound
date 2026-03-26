import json
import urllib.request
import urllib.parse
import time

with open("arabic_strings.json", "r", encoding="utf-8") as f:
    texts = json.load(f)

print(f"Translating {len(texts)} items...")

ar_to_en = {}
for i, txt in enumerate(texts):
    if i % 50 == 0: print(f"Translated {i}...")
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=" + urllib.parse.quote(txt)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            ar_to_en[txt] = "".join([x[0] for x in res[0]])
    except Exception as e:
        ar_to_en[txt] = txt
    time.sleep(0.1)

with open("translated_dict.json", "w", encoding="utf-8") as f:
    json.dump(ar_to_en, f, ensure_ascii=False, indent=2)

print("Done")
