import os
import sys
from PIL import Image

def process():
    try:
        banner = Image.open('header.png').convert("RGBA")
        logo_orig = Image.open('as.jpg').convert("RGBA")
    except Exception as e:
        print(f"Error loading images: {e}")
        return

    # Make background transparent
    pixels = logo_orig.load()
    bg_color = pixels[0, 0]
    
    tolerance = 25
    width, height = logo_orig.size
    
    logo = Image.new("RGBA", logo_orig.size)
    logo_data = logo.load()
    
    for y in range(height):
        for x in range(width):
            p = pixels[x, y]
            dist = sum(abs(p[i] - bg_color[i]) for i in range(3))
            if dist < tolerance:
                logo_data[x, y] = (p[0], p[1], p[2], 0)
            elif dist < tolerance + 30:
                alpha = int(255 * (dist - tolerance) / 30)
                logo_data[x, y] = (p[0], p[1], p[2], alpha)
            else:
                logo_data[x, y] = p
                
    # Resize the logo to fit nicely next to the mic
    target_height = 250
    aspect_ratio = logo.width / logo.height
    target_width = int(target_height * aspect_ratio)
    
    logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Calculate target position (Left side, vertically centered)
    # The user requested "Left side next to the mic".
    padding_left = int(banner.width * 0.12) # ~12% from the left edge
    x = padding_left
    y = (banner.height - logo.height) // 2
    
    print("Merging images on the left side...")
    # Paste using alpha composite
    banner.alpha_composite(logo, (x, y))
    
    banner.save('header_with_logo.png')
    print("Success! Created header_with_logo.png with logo on the left.")

process()
