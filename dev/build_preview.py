"""สร้าง preview.html สำหรับทดลองระบบในเบราว์เซอร์ (ไม่ต้อง deploy)
ใช้:  python3 dev/build_preview.py   แล้วเปิดไฟล์ preview.html
"""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
html = (root / 'Index.html').read_text(encoding='utf-8')
shim = (root / 'dev' / 'gas-shim.js').read_text(encoding='utf-8')
code = (root / 'Code.gs').read_text(encoding='utf-8')
seed = (root / 'Seed.gs').read_text(encoding='utf-8')

inject = (
    '<script>\n' + shim + '\n</script>\n'
    '<script>\n' + code + '\n' + seed + '\n__previewInit();\n</script>\n'
)
out = html.replace('<!--PREVIEW_SHIM-->', inject)
(root / 'preview.html').write_text(out, encoding='utf-8')
print('created', root / 'preview.html')
