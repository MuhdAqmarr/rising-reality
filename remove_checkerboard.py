from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        r, g, b, a = item
        # Calculate how "grey/neutral" the pixel is
        color_diff = max(abs(r-g), abs(g-b), abs(r-b))
        
        # If it's a bright neutral color (white or light grey from the checkerboard)
        # We target R > 180 and color difference < 15
        if r > 180 and g > 180 and b > 180 and color_diff < 20:
            newData.append((255, 255, 255, 0)) # Make it fully transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")
    print("Fake transparency checkerboard removed successfully!")

process_image('public/window_frame.png', 'public/window_frame.png')
