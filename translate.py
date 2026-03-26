import sys
import subprocess
try:
    from deep_translator import GoogleTranslator
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "deep-translator"])
    from deep_translator import GoogleTranslator
import json

with open("arabic_strings.json", "r", encoding="utf-8") as f:
    texts = json.load(f)

translator = GoogleTranslator(source='ar', target='en')
print("Translating", len(texts), "strings...")

ar_to_en = {}

# Batch translation doesn't always handle 500 perfectly if they are large, so we split them
chunk_size = 50
for i in range(0, len(texts), chunk_size):
    chunk = texts[i:i+chunk_size]
    print(f"Translating chunk {i} to {i+len(chunk)}...")
    try:
        translated_chunk = translator.translate_batch(chunk)
        for j, txt in enumerate(chunk):
            ar_to_en[txt] = translated_chunk[j]
    except Exception as e:
        print("Error on chunk", i, e)
        # Fallback to single translations
        for txt in chunk:
            try:
                ar_to_en[txt] = translator.translate(txt)
            except:
                ar_to_en[txt] = txt # fallback to original

with open("translated_dict.json", "w", encoding="utf-8") as f:
    json.dump(ar_to_en, f, ensure_ascii=False, indent=2)

print("Translation complete!")
