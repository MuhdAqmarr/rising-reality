# Asset Inventory

All runtime assets now live in `public/assets/`.

## Active Assets

| Asset | Used For |
| --- | --- |
| `bicycle.png` | Scene 5 transport option |
| `big_cloud_storm.png` | Scene 3 flood cloud |
| `bottle.png` | Scene 5 consumption panel |
| `building1.png` | Scene 4 city/deforestation panels |
| `building2.png` | Scene 4 city/deforestation panels |
| `building3.PNG` | Scene 4 city/deforestation panels |
| `bus.png` | Scene 5 transport option |
| `car.png` | Scene 4 emissions panel |
| `cloud_storm.png` | Scene 3 storm cloud |
| `factory.png` | Scene 4 emissions panel |
| `globe_space.mp4` | Scene 3 space/globe background |
| `handshake.png` | Scene 5 collective action panel |
| `healthy_forest.jpeg` | Scene 6 before/after slider |
| `house.png` | Scene 4 emissions panel |
| `hurricane.gif` | Scene 3 hurricanes panel |
| `iceberg_bg.png` | Scene 1 and Scene 3 melting ice |
| `kemarau.jpg` | Scene 6 before/after slider |
| `kemarau.png` | Scene 3 drought background |
| `ocean.png` | Scene 3 ocean transition |
| `Pokok1.png` | Scene 3 drought trees |
| `Pokok2.png` | Scene 3 drought trees |
| `Pokok3.png` | Scene 3 drought trees |
| `Pokok_Berdaun_1.png` | Scene 3/4 healthy trees |
| `Pokok_Berdaun_2.png` | Scene 3/4 healthy trees |
| `Pokok_Berdaun_3.png` | Scene 3/4 healthy trees |
| `Pokok_Berdaun_4.png` | Scene 3/4 healthy trees |
| `recycle.png` | Scene 5 consumption panel |
| `recycle_bag.png` | Scene 5 consumption panel |
| `sun.png` | Scene 3 heatwave panel |
| `termometer_burned.png` | Scene 3 rising temperature panel |
| `walk.png` | Scene 5 transport option |
| `window_frame.png` | Scene 1 cinematic window |
| `world.svg` | Scene 3 world map |

## Removed During Cleanup

These were removed because they were not referenced by the current runtime:

- Python helper scripts used for old asset experiments.
- Vite starter files: `src/counter.js`, `src/assets/hero.png`,
  `src/assets/javascript.svg`, `src/assets/vite.svg`.
- Unused public files: `hurricane.png`, `icons.svg`, `world_map_outline.png`.
- Local project skill files that are not part of the student learning app.

## Optimization Notes

Some active image files are large. They are kept because the current design uses
them, but future optimization work should compress large PNG/JPEG files and test
whether WebP/AVIF versions keep enough visual quality.

