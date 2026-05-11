import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the human silhouette from HTML content
content = re.sub(r'<svg class="s4a-human".*?</svg>', '', content, flags=re.DOTALL)

# 2. Add the human silhouette into the master SVG at fixed coordinates (500, 500)
# And update the path to start EXACTLY from its hand (530, 500)
human_svg_group = '''
            <!-- Human silhouette positioned at (500, 500) -->
            <g id="s4a-human-group" opacity="0" transform="translate(450, 400)">
              <circle cx="50" cy="30" r="18" fill="#1a1a1a"/>
              <path d="M 50 50 L 50 130 M 50 70 L 20 100 M 50 70 L 80 100 M 50 130 L 25 190 M 50 130 L 75 190"
                    stroke="#1a1a1a" stroke-width="10" stroke-linecap="round" fill="none"/>
            </g>
'''

# Insert it before the path
content = content.replace('<path id="s4-line-path"', human_svg_group + '            <path id="s4-line-path"')

# 3. Update the path start point to (530, 500) -- the right hand
# Human is at translate(450, 400). Right hand is at human(80, 100).
# So Master(450+80, 400+100) = Master(530, 500).
content = re.sub(r'd="\s+M \d+ \d+', 'd="\n                M 530 500', content)

# 4. Update dot-a position to (530, 500)
content = re.sub(r'class="s4-dot dot-a" cx="\d+" cy="\d+"', 'class="s4-dot dot-a" cx="530" cy="500"', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Human silhouette moved into SVG and path connected to hand.")
