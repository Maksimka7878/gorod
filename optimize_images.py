import os
import re
import urllib.request
import subprocess
import hashlib

# Paths
SOURCE_FILE = 'src/data/books.ts'
IMAGES_DIR = 'public/images'

# Ensure images directory exists
os.makedirs(IMAGES_DIR, exist_ok=True)

# Read source file
with open(SOURCE_FILE, 'r') as f:
    content = f.read()

# Find all Unsplash URLs
# Matches 'https://images.unsplash.com/...' until a quote or whitespace
urls = re.findall(r"'(https://images\.unsplash\.com/[^']*)'", content)
unique_urls = list(set(urls))

print(f"Found {len(unique_urls)} unique images.")

url_map = {}

for i, url in enumerate(unique_urls):
    try:
        # Create a unique filename based on hash of URL to avoid collisions and duplicates
        # But for simplicity/readability let's use a counter based name if possible, 
        # or just hash. Hash is safer for repeated runs.
        file_hash = hashlib.md5(url.encode()).hexdigest()[:8]
        filename = f"img_{file_hash}"
        temp_path = f"{IMAGES_DIR}/{filename}_temp.jpg"
        webp_path = f"{IMAGES_DIR}/{filename}.webp"
        
        # Download with SSL bypass and headers
        print(f"Downloading [{i+1}/{len(unique_urls)}]: {url}")
        
        # SSL Context
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
            }
        )
        
        with urllib.request.urlopen(req, context=ctx) as r, open(temp_path, 'wb') as f:
            f.write(r.read())
        
        with urllib.request.urlopen(req, context=ctx) as r, open(temp_path, 'wb') as f:
            f.write(r.read())
        
        # Try convert to WebP using sips
        try:
            subprocess.run(['sips', '-s', 'format', 'webp', temp_path, '--out', webp_path], 
                           check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
            if os.path.exists(webp_path):
                os.remove(temp_path)
                url_map[url] = f"/images/{filename}.webp"
            else:
                raise Exception("WebP file not created")
                
        except Exception as conversion_error:
            print(f"Conversion failed for {url}: {conversion_error}, keeping original")
            # Determine extension from URL or content or default to .jpg
            ext = ".jpg"
            if ".png" in url: ext = ".png"
            final_path = f"{IMAGES_DIR}/{filename}{ext}"
            os.rename(temp_path, final_path)
            url_map[url] = f"/images/{filename}{ext}"

    except Exception as e:
        print(f"Error processing {url}: {e}")
        # If temp file exists and we failed, try to plain copy/rename it if it wasn't handled
        if os.path.exists(temp_path):
             try:
                final_path = f"{IMAGES_DIR}/{filename}.jpg"
                os.rename(temp_path, final_path)
                url_map[url] = f"/images/{filename}.jpg"
             except:
                pass

    except Exception as e:
        print(f"Error processing {url}: {e}")

# Replace URLs in content
new_content = content
for url, local_path in url_map.items():
    new_content = new_content.replace(url, local_path)

# Write back to file
with open(SOURCE_FILE, 'w') as f:
    f.write(new_content)

print("Done updating src/data/books.ts")
