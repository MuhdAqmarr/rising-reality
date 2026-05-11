import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the s4-master-svg block
pattern = re.compile(r'(<svg id="s4-master-svg".*?</svg>)', re.DOTALL)
match = pattern.search(content)

if match:
    old_svg = match.group(1)
    new_svg = '''<svg id="s4-master-svg" class="s4-master-svg" viewBox="0 0 1000 6000" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <!-- 
              Corrected Path: Serpentine zigzag across 6000 units.
              Each scene gets 1000 units of vertical space.
            -->
            <path id="s4-line-path"
              d="
                M 500 0
                L 500 500
                Q 500 600 600 600 L 900 600 Q 1000 600 1000 700
                L 1000 1500
                Q 1000 1600 900 1600 L 100 1600 Q 0 1600 0 1700
                L 0 2500
                Q 0 2600 100 2600 L 900 2600 Q 1000 2600 1000 2700
                L 1000 3500
                Q 1000 3600 900 3600 L 100 3600 Q 0 3600 0 3700
                L 0 4500
                Q 0 4600 100 4600 L 900 4600 Q 1000 4600 1000 4700
                L 1000 5500
                Q 1000 5600 900 5600 L 500 5600 Q 500 5700 500 5800
                L 500 6000
              "
              fill="none"
              stroke="#1a1a1a"
              stroke-width="8"
              stroke-linecap="round"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
            />

            <!-- Dots at the center of each panel (approx) -->
            <circle class="s4-dot dot-a" cx="500" cy="500" r="15" fill="#1a1a1a"/>
            <circle class="s4-dot dot-b" cx="1000" cy="1500" r="15" fill="#1a1a1a"/>
            <circle class="s4-dot dot-c" cx="0" cy="2500" r="15" fill="#1a1a1a"/>
            <circle class="s4-dot dot-d" cx="1000" cy="3500" r="15" fill="#1a1a1a"/>
            <circle class="s4-dot dot-e" cx="0" cy="4500" r="15" fill="#1a1a1a"/>
            <circle class="s4-dot dot-f" cx="500" cy="5500" r="15" fill="#1a1a1a"/>
          </svg>'''
    
    new_content = content.replace(old_svg, new_svg)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SVG Path and Dots updated successfully in index.html")
else:
    print("Could not find s4-master-svg block")
