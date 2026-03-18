import os
import sys

print("Installing required Python packages (Pillow, rembg)...")
os.system(f"{sys.executable} -m pip install rembg pillow -q")

try:
    from PIL import Image
    from rembg import remove
    import io
except ImportError as e:
    print(f"Failed to import packages after installation: {e}")
    sys.exit(1)

print("Packages loaded successfully. Processing images...")

def merge_logo():
    try:
        banner = Image.open('header.png').convert("RGBA")
    except Exception as e:
        print(f"Error loading header.png: {e}")
        return

    try:
        with open('as.jpg', 'rb') as f:
            input_img = f.read()
            print("Removing background from logo using rembg...")
            output_img = remove(input_img)
            
        logo = Image.open(io.BytesIO(output_img)).convert("RGBA")
    except Exception as e:
        print(f"Error processing as.jpg: {e}")
        return

    # Assuming we want the logo to be nicely sized in the center
    # Target height around 150px
    target_height = 150
    aspect_ratio = logo.width / logo.height
    target_width = int(target_height * aspect_ratio)
    
    # Resize the logo
    logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Calculate target position (dead center horizontally and vertically)
    x = (banner.width - logo.width) // 2
    y = (banner.height - logo.height) // 2
    
    # Merge the images
    print("Merging logo onto header...")
    banner.alpha_composite(logo, (x, y))
    
    # Save the result
    banner.save('header_with_logo.png')
    print("Success! Created header_with_logo.png")

merge_logo()
