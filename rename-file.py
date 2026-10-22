from pathlib import Path


def rename_images(directory: Path):
    files = [f for f in directory.iterdir() if f.is_file()]
    files.sort()  # sắp xếp để có thứ tự ổn định

    changed = 0
    for idx, f in enumerate(files, start=1):
        # if idx > 35:
        #     break

        new_name = f"20260426_gpt_sticker_{idx:02d}.jpg"
        new_path = f.with_name(new_name)

        if new_path == f:
            continue  # đã đúng định dạng
        if new_path.exists():
            print(f"SKIP: Tồn tại sẵn {new_path.name}, bỏ qua {f.name}")
            continue

        f.rename(new_path)
        changed += 1
        print(f"RENAMED: {f.name} -> {new_path.name}")

    print(f"Done. Đã đổi tên {changed} file.")


if __name__ == "__main__":
    dir_path = Path(
        r"D:\MEDIA\20260426_Sticker"
    ).resolve()
    rename_images(dir_path)
