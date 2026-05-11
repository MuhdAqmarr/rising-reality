import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update stroke-width and dot radius for a bolder look
content = content.replace('stroke-width="8"', 'stroke-width="12"')
content = content.replace('r="15"', 'r="20"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Stroke width and dot size increased for Scene 4.")
