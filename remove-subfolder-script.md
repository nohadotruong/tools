Dưới đây là các kịch bản (script) giúp bạn tự động tìm và xóa tất cả các thư mục `.git` nằm trong các thư mục con của một thư mục gốc (root directory).

Bạn có thể chọn kịch bản phù hợp tùy theo hệ điều hành hoặc công cụ bạn đang dùng:

### Cách 1: Sử dụng PowerShell (Windows - Khuyên dùng)

Mở **PowerShell**, chuyển hướng tới thư mục gốc (root) và chạy lệnh:

```powershell
Get-ChildItem -Path . -Recurse -Force -Directory -Filter ".git" | Remove-Item -Force -Recurse
```

* **Giải thích:**
* `Get-ChildItem -Path . -Recurse -Force -Directory -Filter ".git"`: Tìm kiếm đệ quy toàn bộ thư mục ẩn/hiện có tên `.git` từ thư mục hiện tại (`.`).
* `Remove-Item -Force -Recurse`: Xóa triệt để thư mục đó cùng toàn bộ nội dung bên trong.



---

### Cách 2: Sử dụng Command Prompt (Windows CMD)

Mở **CMD**, di chuyển đến thư mục root và chạy lệnh:

```cmd
for /d /r %i in (.git) do @if exist "%i" rmdir /s /q "%i"
```

* **Giải thích:**
* `for /d /r %i in (.git)`: Duyệt qua tất cả các thư mục con để tìm `.git`.
* `rmdir /s /q "%i"`: Xóa thư mục `.git` tìm được một cách im lặng không cần xác nhận (`/q`) và xóa toàn bộ cây thư mục con (`/s`).



*Note: Nếu viết lệnh này vào tệp `.bat`, bạn cần đổi `%i` thành `%%i`.*

---

### Cách 3: Sử dụng Bash Script (Linux / macOS / Git Bash)

Mở Terminal tại thư mục root và chạy lệnh `find` ngắn gọn:

```bash
find . -name ".git" -type d -prune -exec rm -rf {} +
```

Hoặc tạo một file script `clean_git.sh`:

```bash
#!/bin/bash

# Đường dẫn thư mục root (mặc định là thư mục hiện tại)
ROOT_DIR="${1:-.}"

echo "Đang tìm và xóa các thư mục .git trong: $ROOT_DIR"

# Tìm và xóa các thư mục .git
find "$ROOT_DIR" -name ".git" -type d -prune -exec rm -rf {} +

echo "Hoàn thành!"
```

* **Cách dùng:**
1. Lưu đoạn mã trên thành file `clean_git.sh`.
2. Cấp quyền thực thi: `chmod +x clean_git.sh`
3. Chạy script: `./clean_git.sh /duong/dan/toi/folder/root` (hoặc chạy `./clean_git.sh` nếu đang đứng ở thư mục root).