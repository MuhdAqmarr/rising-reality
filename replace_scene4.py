import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find scene-4 section start
start_marker = '<section class="scene scene-4">'
end_marker = '</section>'

start = content.find(start_marker)
# Find the matching closing section tag
search_from = start + len(start_marker)
end = content.find(end_marker, search_from) + len(end_marker)

print(f"Found scene-4 from char {start} to {end}")
print(f"Length: {end - start} chars")

new_scene4 = '''<section class="scene scene-4">
        <!-- Fixed cream background — stays put, content travels -->
        <div class="layer s4-bg"></div>

        <!-- s4-scroll-stage: tall element that GSAP scrolls upward via y -->
        <div class="s4-scroll-stage" id="s4-scroll-stage">

          <!-- The master SVG line — tall, covers all 6 scenes -->
          <svg id="s4-master-svg" class="s4-master-svg" viewBox="0 0 1000 6000" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
            <!--
              Path design (matches wireframe):
              Starts center-top, goes down, turns RIGHT with rounded corner,
              travels right, turns DOWN, goes down, turns LEFT with rounded corner,
              travels left, turns DOWN... repeats for each scene.

              Each "segment" height = 1000 units. Total = 6 segments = 6000 units.
              Left wall x = 80, Right wall x = 920, center x = 500
              Corner radius Q offset = 100 units
            -->
            <path id="s4-line-path"
              d="
                M 500 0
                L 500 200
                Q 500 300 600 300
                L 920 300
                Q 1000 300 1000 400
                L 1000 600
                Q 1000 700 920 700
                L 80 700
                Q 0 700 0 800
                L 0 1000
                Q 0 1100 80 1100
                L 920 1100
                Q 1000 1100 1000 1200
                L 1000 1400
                Q 1000 1500 920 1500
                L 80 1500
                Q 0 1500 0 1600
                L 0 1800
                Q 0 1900 80 1900
                L 920 1900
                Q 1000 1900 1000 2000
                L 1000 2200
                Q 1000 2300 920 2300
                L 80 2300
                Q 0 2300 0 2400
                L 0 2600
                Q 0 2700 80 2700
                L 920 2700
                Q 1000 2700 1000 2800
                L 1000 3000
                Q 1000 3100 920 3100
                L 80 3100
                Q 0 3100 0 3200
                L 0 3400
                Q 0 3500 80 3500
                L 500 3500
                Q 500 3600 500 3700
              "
              fill="none"
              stroke="#1a1a1a"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Checkpoint dots — positioned at each scene's arrival point -->
            <!-- 4A: top center -->
            <circle class="s4-dot dot-a" cx="500" cy="200" r="14" fill="#1a1a1a"/>
            <!-- 4B: right side -->
            <circle class="s4-dot dot-b" cx="1000" cy="500" r="14" fill="#1a1a1a"/>
            <!-- 4C: left side -->
            <circle class="s4-dot dot-c" cx="0" cy="900" r="14" fill="#1a1a1a"/>
            <!-- 4D: right side -->
            <circle class="s4-dot dot-d" cx="1000" cy="1300" r="14" fill="#1a1a1a"/>
            <!-- 4E: left side -->
            <circle class="s4-dot dot-e" cx="0" cy="1700" r="14" fill="#1a1a1a"/>
            <!-- 4F: bottom center -->
            <circle class="s4-dot dot-f" cx="500" cy="2100" r="14" fill="#1a1a1a"/>
          </svg>

          <!-- ===== CONTENT BLOCKS — stacked vertically, each 100vh tall ===== -->

          <!-- 4A: Opening -->
          <div class="s4-panel s4a-panel">
            <div class="s4-content s4a-content">
              <h2 class="s4a-t1">Climate change does not happen on its own.</h2>
              <p class="s4a-t2">It is driven by human activities.</p>
              <svg class="s4a-human" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="30" r="18" fill="#1a1a1a"/>
                <path d="M 50 50 L 50 130 M 50 70 L 20 100 M 50 70 L 80 100 M 50 130 L 25 190 M 50 130 L 75 190"
                      stroke="#1a1a1a" stroke-width="10" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
          </div>

          <!-- 4B: Emissions -->
          <div class="s4-panel s4b-panel">
            <div class="s4-content s4b-content">
              <h2 class="s4b-t1">EMISSIONS</h2>
              <p class="s4b-t2">This releases gases into the air that<br>trap heat in the atmosphere.</p>
              <p class="s4b-t3">We burn fossil fuels like coal, oil,<br>and gas to power our homes, cars, and industries.</p>
              <div class="s4b-scene">
                <svg class="s4b-icon s4b-factory" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
                  <rect x="30" y="50" width="60" height="50" fill="#1a1a1a"/>
                  <rect x="10" y="65" width="20" height="35" fill="#1a1a1a"/>
                  <polygon points="30,50 50,40 50,50" fill="#1a1a1a"/>
                  <polygon points="50,50 70,40 70,50" fill="#1a1a1a"/>
                  <polygon points="70,50 90,40 90,50" fill="#1a1a1a"/>
                  <rect x="60" y="20" width="12" height="35" fill="#1a1a1a"/>
                  <rect x="80" y="15" width="12" height="40" fill="#1a1a1a"/>
                </svg>
                <svg class="s4b-icon s4b-house" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="60,15 15,55 105,55" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
                  <rect x="25" y="55" width="70" height="40" fill="none" stroke="#1a1a1a" stroke-width="4"/>
                  <rect x="50" y="68" width="20" height="27" fill="#1a1a1a"/>
                </svg>
                <svg class="s4b-icon s4b-car" viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 10 55 L 25 55 L 35 35 L 105 35 L 115 55 L 130 55 L 130 65 L 10 65 Z" fill="none" stroke="#1a1a1a" stroke-width="3.5"/>
                  <circle cx="35" cy="68" r="9" fill="#1a1a1a"/>
                  <circle cx="105" cy="68" r="9" fill="#1a1a1a"/>
                </svg>
                <div class="s4b-smoke smoke-1"></div>
                <div class="s4b-smoke smoke-2"></div>
                <div class="s4b-smoke smoke-3"></div>
              </div>
            </div>
          </div>

          <!-- 4C: Deforestation -->
          <div class="s4-panel s4c-panel">
            <div class="s4-content s4c-content">
              <h2 class="s4c-t1">DEFORESTATION</h2>
              <p class="s4c-t2">Forests are cleared for development.</p>
              <p class="s4c-t3">Fewer trees mean less carbon is absorbed.</p>
              <div class="s4c-trees">
                <svg class="s4c-tree" viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg"><polygon points="15,5 5,30 25,30" fill="#1a3a1a"/><polygon points="15,18 4,42 26,42" fill="#1a3a1a"/><polygon points="15,30 3,55 27,55" fill="#1a3a1a"/><rect x="13" y="55" width="4" height="5" fill="#2a1a08"/></svg>
                <svg class="s4c-tree" viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg"><polygon points="15,5 5,30 25,30" fill="#1a3a1a"/><polygon points="15,18 4,42 26,42" fill="#1a3a1a"/><polygon points="15,30 3,55 27,55" fill="#1a3a1a"/><rect x="13" y="55" width="4" height="5" fill="#2a1a08"/></svg>
                <svg class="s4c-tree" viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg"><polygon points="15,5 5,30 25,30" fill="#1a3a1a"/><polygon points="15,18 4,42 26,42" fill="#1a3a1a"/><polygon points="15,30 3,55 27,55" fill="#1a3a1a"/><rect x="13" y="55" width="4" height="5" fill="#2a1a08"/></svg>
                <svg class="s4c-tree" viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg"><polygon points="15,5 5,30 25,30" fill="#1a3a1a"/><polygon points="15,18 4,42 26,42" fill="#1a3a1a"/><polygon points="15,30 3,55 27,55" fill="#1a3a1a"/><rect x="13" y="55" width="4" height="5" fill="#2a1a08"/></svg>
                <svg class="s4c-tree" viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg"><polygon points="15,5 5,30 25,30" fill="#1a3a1a"/><polygon points="15,18 4,42 26,42" fill="#1a3a1a"/><polygon points="15,30 3,55 27,55" fill="#1a3a1a"/><rect x="13" y="55" width="4" height="5" fill="#2a1a08"/></svg>
                <svg class="s4c-tree" viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg"><polygon points="15,5 5,30 25,30" fill="#1a3a1a"/><polygon points="15,18 4,42 26,42" fill="#1a3a1a"/><polygon points="15,30 3,55 27,55" fill="#1a3a1a"/><rect x="13" y="55" width="4" height="5" fill="#2a1a08"/></svg>
                <svg class="s4c-tree" viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg"><polygon points="15,5 5,30 25,30" fill="#1a3a1a"/><polygon points="15,18 4,42 26,42" fill="#1a3a1a"/><polygon points="15,30 3,55 27,55" fill="#1a3a1a"/><rect x="13" y="55" width="4" height="5" fill="#2a1a08"/></svg>
                <svg class="s4c-tree" viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg"><polygon points="15,5 5,30 25,30" fill="#1a3a1a"/><polygon points="15,18 4,42 26,42" fill="#1a3a1a"/><polygon points="15,30 3,55 27,55" fill="#1a3a1a"/><rect x="13" y="55" width="4" height="5" fill="#2a1a08"/></svg>
              </div>
            </div>
          </div>

          <!-- 4D: Urban & Industrial Growth -->
          <div class="s4-panel s4d-panel">
            <div class="s4-content s4d-content">
              <h2 class="s4d-t1">URBAN &amp; INDUSTRIAL GROWTH</h2>
              <p class="s4d-t2">Rapid urbanization and industrial activities</p>
              <p class="s4d-t3">increase energy demand and emissions.</p>
              <svg class="s4d-skyline" viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
                <g fill="#1a1a1a">
                  <rect x="0" y="100" width="50" height="80"/>
                  <rect x="55" y="70" width="45" height="110"/>
                  <rect x="105" y="40" width="55" height="140"/>
                  <rect x="165" y="80" width="40" height="100"/>
                  <rect x="210" y="20" width="60" height="160"/>
                  <rect x="275" y="60" width="50" height="120"/>
                  <rect x="330" y="0" width="70" height="180"/>
                  <rect x="405" y="50" width="45" height="130"/>
                  <rect x="455" y="90" width="55" height="90"/>
                  <rect x="515" y="40" width="50" height="140"/>
                  <rect x="570" y="70" width="30" height="110"/>
                  <g fill="#fff5e6">
                    <rect x="115" y="55" width="6" height="6"/>
                    <rect x="128" y="55" width="6" height="6"/>
                    <rect x="115" y="75" width="6" height="6"/>
                    <rect x="128" y="75" width="6" height="6"/>
                    <rect x="220" y="40" width="6" height="6"/>
                    <rect x="233" y="40" width="6" height="6"/>
                    <rect x="220" y="60" width="6" height="6"/>
                    <rect x="233" y="60" width="6" height="6"/>
                    <rect x="340" y="20" width="6" height="6"/>
                    <rect x="353" y="20" width="6" height="6"/>
                    <rect x="340" y="45" width="6" height="6"/>
                    <rect x="353" y="45" width="6" height="6"/>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <!-- 4E: Our Everyday Lifestyle -->
          <div class="s4-panel s4e-panel">
            <div class="s4-content s4e-content">
              <h2 class="s4e-t1">OUR EVERYDAY LIFESTYLE</h2>
              <p class="s4e-t2">also play a role</p>
              <div class="s4e-icons">
                <svg class="s4e-icon" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 35 5 L 15 45 L 30 45 L 22 75 L 45 30 L 30 30 L 38 5 Z" fill="#1a1a1a"/>
                </svg>
                <svg class="s4e-icon" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 8 40 L 18 40 L 25 22 L 60 22 L 67 40 L 75 40 L 75 50 L 8 50 Z" fill="none" stroke="#1a1a1a" stroke-width="3"/>
                  <circle cx="25" cy="52" r="7" fill="#1a1a1a"/>
                  <circle cx="60" cy="52" r="7" fill="#1a1a1a"/>
                </svg>
                <svg class="s4e-icon" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 12 20 L 12 70 Q 12 75 17 75 L 43 75 Q 48 75 48 70 L 48 20 Z" fill="none" stroke="#1a1a1a" stroke-width="3"/>
                  <path d="M 12 20 L 48 20 L 42 8 L 18 8 Z" fill="#1a1a1a"/>
                </svg>
                <svg class="s4e-icon" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="20" width="44" height="55" rx="3" fill="none" stroke="#1a1a1a" stroke-width="3"/>
                  <line x1="5" y1="15" x2="55" y2="15" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
                  <line x1="20" y1="10" x2="40" y2="10" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
                  <line x1="20" y1="32" x2="20" y2="65" stroke="#1a1a1a" stroke-width="2.5"/>
                  <line x1="30" y1="32" x2="30" y2="65" stroke="#1a1a1a" stroke-width="2.5"/>
                  <line x1="40" y1="32" x2="40" y2="65" stroke="#1a1a1a" stroke-width="2.5"/>
                </svg>
              </div>
              <div class="s4e-list">
                <p>The energy we use.</p>
                <p>The way we travel.</p>
                <p>The things we consume.</p>
                <p>The waste we produce.</p>
              </div>
            </div>
          </div>

          <!-- 4F: Closing -->
          <div class="s4-panel s4f-panel">
            <div class="s4-content s4f-content">
              <h3 class="s4f-t1">These actions are all connected</h3>
              <p class="s4f-t2">Together, they contribute to a warming planet.</p>
            </div>
          </div>

        </div><!-- end s4-scroll-stage -->
      </section>'''

result = content[:start] + new_scene4 + content[end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print("Done! Scene 4 replaced successfully.")
print(f"New file length: {len(result)} chars")
