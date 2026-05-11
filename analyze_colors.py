from PIL import Image

img = Image.open('public/window_frame.png').convert('RGB')
colors = img.getcolors(img.width * img.height)
colors.sort(reverse=True)
print("Grey/White colors:")
for count, color in colors:
    r, g, b = color
    if abs(r-g) < 5 and abs(g-b) < 5 and r > 180:
        print(f"{count}: {color}")
