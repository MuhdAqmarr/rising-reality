import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update path to start from the human hand (approx 535, 520)
# And remove the first segment that goes from top center
old_d = r'M 500 0\s+L 500 500'
new_d = 'M 535 520'

content = re.sub(old_d, new_d, content)

# Also ensure s4a-t1 starts visible (remove fromTo in JS later, but let's set style here too)
# Actually I'll handle visibility in JS.

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Path updated to start from the human hand.")
