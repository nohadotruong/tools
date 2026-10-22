import cv2
import mediapipe as mp
import os

input_dir = "input_images"
output_dir = "output_faces"
os.makedirs(output_dir, exist_ok=True)

mp_face = mp.solutions.face_detection
face_detector = mp_face.FaceDetection(model_selection=1, min_detection_confidence=0.6)

for file in os.listdir(input_dir):
    if not file.lower().endswith((".jpg", ".jpeg", ".png")):
        continue

    img_path = os.path.join(input_dir, file)
    img = cv2.imread(img_path)
    h, w, _ = img.shape

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = face_detector.process(rgb)

    if not result.detections:
        print(f"❌ No face: {file}")
        continue

    # lấy khuôn mặt đầu tiên
    bbox = result.detections[0].location_data.relative_bounding_box
    x, y, bw, bh = bbox.xmin, bbox.ymin, bbox.width, bbox.height

    # convert sang pixel
    x1 = int(x * w)
    y1 = int(y * h)
    x2 = int((x + bw) * w)
    y2 = int((y + bh) * h)

    # mở rộng vùng crop (cho đẹp)
    expand_x = int(0.3 * bw * w)
    expand_y = int(0.6 * bh * h)

    x1 = max(0, x1 - expand_x)
    y1 = max(0, y1 - expand_y)
    x2 = min(w, x2 + expand_x)
    y2 = min(h, y2 + expand_y)

    face_crop = img[y1:y2, x1:x2]

    out_path = os.path.join(output_dir, file)
    cv2.imwrite(out_path, face_crop)

    print(f"✔️ Cropped face: {file}")
