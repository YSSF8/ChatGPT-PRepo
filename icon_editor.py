from PIL import Image
import os

def create_smaller_variants():
    original_path = os.path.join('icons', 'original.png')
    
    variants = [
        ("original_small.png", 3),
        ("original_smaller.png", 9)
    ]
    
    try:
        with Image.open(original_path) as im:
            for filename, factor in variants:
                output_path = os.path.join('icons', filename)
                new_size = (max(im.width // factor, 1), max(im.height // factor, 1))
                resized = im.resize(new_size, Image.Resampling.LANCZOS)
                resized.save(output_path)
                print(f"Saved variant ({factor}x smaller) to: {output_path} with size {new_size}")
    except FileNotFoundError:
        print(f"File {original_path} not found.")

if __name__ == "__main__":
    create_smaller_variants()