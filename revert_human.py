import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the human silhouette from SVG
content = re.sub(r'<!-- Human silhouette positioned at .*? -->.*?<g id="s4a-human-group".*?</g>', '', content, flags=re.DOTALL)

# 2. Restore human silhouette to HTML (inside s4a-content)
human_html = '''
              <svg class="s4a-human" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="30" r="18" fill="#1a1a1a"/>
                <path d="M 50 50 L 50 130 M 50 70 L 20 100 M 50 70 L 80 100 M 50 130 L 25 190 M 50 130 L 75 190"
                      stroke="#1a1a1a" stroke-width="10" stroke-linecap="round" fill="none"/>
              </svg>
'''

# Insert it back into s4a-content (after s4a-t2)
content = content.replace('<p class="s4a-t2">It is driven by human activities.</p>', 
                          '<p class="s4a-t2">It is driven by human activities.</p>' + human_html)

# 3. Fix the path starting point to match the hand (approx 519, 600 if human is at 60% top)
# We'll use M 520 620 to be safe.
content = re.sub(r'd="\n\s+M \d+ \d+', 'd="\n                M 520 620', content)

# 4. Fix dot-a
content = re.sub(r'class="s4-dot dot-a" cx="\d+" cy="\d+"', 'class="s4-dot dot-a" cx="520" cy="620"', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Reverted human silhouette to HTML and recalculated hand position.")
