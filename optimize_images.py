from PIL import Image
import os

IMG_DIR = r"c:\AI DESIGNER\DIGIMAGEM\assets\images"
QUALITY = 82

files = {
    "Dr.-CELSO-VEDOLIN.webp": (520, 693),
    "Dra-EMANUELLE-GOBBO-SIMON.webp": (520, 693),
    "Dr.-HENRIQUE-DA-ROSA-SOBRINHO.webp": (520, 693),
    "Dra-JANIZE-REGIANE-PASLOWSKI.webp": (520, 693),
    "Dr.-VINICIUS-CARDOSO-DOS-SANTOS.webp": (520, 693),
    "Dr.-EDUARDO-TOMASI.webp": (520, 693),
    "D.r-KILIAN-CHRISTMANN.webp": (520, 693),
    "RM.webp": (800, 1066),
    "TC.webp": (800, 1066),
    "ECO.webp": (800, 1066),
    "RX.webp": (800, 1066),
    "MAMOGRAFIA.webp": (800, 1066),
    "D.O.webp": (800, 1066),
    "BIOPSIA.webp": (800, 1066),
}

# Handle special chars in filename
odon = os.path.join(IMG_DIR, "ODONTOL\u00d3GICA.webp")
if os.path.exists(odon):
    files["ODONTOL\u00d3GICA.webp"] = (800, 1066)

for fn, (tw, th) in files.items():
    fp = os.path.join(IMG_DIR, fn)
    if not os.path.exists(fp):
        print(f"SKIP {fn}")
        continue
    try:
        img = Image.open(fp)
        ow, oh = img.size
        ok = os.path.getsize(fp)/1024
        if ow <= tw and oh <= th:
            print(f"OK {fn} {ow}x{oh} {ok:.0f}KB")
            continue
        # Resize maintaining aspect by fitting in bounding box
        img.thumbnail((tw, th), Image.LANCZOS)
        img.save(fp, 'WEBP', quality=QUALITY, method=4)
        nk = os.path.getsize(fp)/1024
        print(f"DONE {fn} {ow}x{oh}->{img.size[0]}x{img.size[1]} {ok:.0f}KB->{nk:.0f}KB")
    except Exception as e:
        print(f"ERR {fn}: {e}")

print("FINISHED")
