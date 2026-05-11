from PIL import Image, ImageSequence

INPUT = 'public/hurricane.gif'
OUTPUT = 'public/hurricane.gif'
WHITE_THRESHOLD = 230  # Pixels with R, G, B all above this become transparent

def clean_frame(frame):
    f = frame.convert('RGBA')
    pixels = f.load()
    w, h = f.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
                pixels[x, y] = (0, 0, 0, 0)
    return f

def main():
    src = Image.open(INPUT)
    frames = [clean_frame(f) for f in ImageSequence.Iterator(src)]
    duration = src.info.get('duration', 80)
    loop = src.info.get('loop', 0)

    frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=duration,
        loop=loop,
        disposal=2,
        transparency=0,
        optimize=False,
    )
    print(f"Cleaned {len(frames)} frames -> {OUTPUT}")

if __name__ == '__main__':
    main()
