import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update dot-a position to match the new path start point (hand)
content = content.replace('class="s4-dot dot-a" cx="500" cy="500"', 'class="s4-dot dot-a" cx="535" cy="520"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Dot-a position updated to the human hand.")
