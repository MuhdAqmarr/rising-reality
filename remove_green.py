from PIL import Image

def process_image(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        # Ensure we are using getdata() safely or suppress the deprecation warning
        # Since we're just extracting pixels, getdata is fine for now, or we can use get_flattened_data if available
        datas = img.getdata()
        
        newData = []
        for item in datas:
            r, g, b, a = item
            
            # Chroma key green detection
            # Green channel should be significantly higher than Red and Blue
            # The user's green screen is a very strong, pure green.
            if g > 120 and g > r * 1.5 and g > b * 1.5:
                newData.append((255, 255, 255, 0)) # Make it fully transparent
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Green screen removed successfully!")
    except Exception as e:
        print(f"Error: {e}")

process_image('public/window_frame.png', 'public/window_frame.png')
