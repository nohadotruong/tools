from markitdown import MarkItDown

md = MarkItDown()

# Chuyển đổi DOCX
result_docx = md.convert("rule_cham_cong.docx")
with open("rule_cham_cong.md", "w", encoding="utf-8") as f:
    f.write(result_docx.text_content)

# Chuyển đổi PDF
# result_pdf = md.convert("file_cua_ban.pdf")
# with open("output_pdf.md", "w", encoding="utf-8") as f:
#     f.write(result_pdf.text_content)

print("Đã chuyển đổi tất cả file sang Markdown!")