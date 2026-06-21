import os
import urllib.request

models_dir = os.path.join("public", "models")
os.makedirs(models_dir, exist_ok=True)

base_url = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"

files = [
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1"
]

for file in files:
    url = base_url + file
    dest = os.path.join(models_dir, file)
    print(f"Downloading {file}...")
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"Success: {file}")
    except Exception as e:
        print(f"Failed to download {file}: {e}")

print("Done downloading models.")
