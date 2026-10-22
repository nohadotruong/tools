from serpapi import GoogleSearch
import requests, os, io
from PIL import Image

API_KEY = "5688a96eded6794b65f735febd803d326eb5150f1792689a9ce63085a9101fed"

# Danh sách 20 người cụ thể
queries = [
    "Chris Evans portrait",
    "Jeremy Renner portrait",
    "Elizabeth Olsen portrait",
    "Tom Hiddleston portrait",
    "Anthony Hopkins portrait",
    "Samuel L. Jackson portrait",
    "Matt Damon portrait",
    "Ben Affleck portrait",
    "George Clooney portrait",
    "Harrison Ford portrait",
    "Sylvester Stallone portrait",
    "Arnold Schwarzenegger portrait",
    "Jackie Chan portrait",
    "Jet Li portrait",
    "Chow Yun-Fat portrait",
    "Michelle Yeoh portrait",
    "Donnie Yen portrait",
    "Andy Lau portrait",
    "Tony Leung portrait",
    "Zhang Ziyi portrait",
]


root_dir = "dataset"
os.makedirs(root_dir, exist_ok=True)

for person_id, query in enumerate(queries, start=81):
    person_dir = os.path.join(root_dir, str(person_id))
    os.makedirs(person_dir, exist_ok=True)

    search = GoogleSearch(
        {
            "q": query,
            "tbm": "isch",  # image search
            "num": 50,  # lấy dư để lọc
            "api_key": API_KEY,
        }
    )
    results = search.get_dict()

    count = 0
    for img in results.get("images_results", []):
        img_url = img.get("original")
        if not img_url:
            continue
        try:
            r = requests.get(img_url, timeout=10)
            if "image" not in r.headers.get("Content-Type", ""):
                continue

            # Mở bằng Pillow và convert sang PNG
            image = Image.open(io.BytesIO(r.content)).convert("RGB")
            filename = f"{count+1:04d}.png"  # 0001.png, 0002.png...
            image.save(os.path.join(person_dir, filename), "PNG")

            count += 1
            if count == 35:  # dừng đúng 35 ảnh
                break
        except Exception as e:
            print("❌ Lỗi tải/convert ảnh:", e)

    print(f"✅ Người {person_id}: {query} → đã lưu {count} ảnh")
