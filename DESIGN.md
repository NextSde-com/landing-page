# NextSDE landing page

## Design

- Hero: deep navy field, large all caps heading with a pink final line, and an interactive 3D learning cube.
- Colors: navy `#09071d`, surface `#11102b`, white `#fbfaff`, muted lavender `#b8b5cd`, pink `#f391df`, and action purple `#3744c9`.
- Typography: Geist, shared with the main NextSDE homepage.
- Layout: split hero, company strip, learning path strip, platform feature cards, tagline section, steps, resume feature, FAQ, and closing call to action.
- Behavior: responsive mobile navigation, section reveals, word by word tagline activation, and reduced motion support.

## Links

Product routes (practice, courses, LLD, resume) point to `coming-soon.html` until those pages launch. Shared images and the 3D PC bundle load from `media/`.

## Queue preview

`queue-preview.bundle.js` is a local copy of the queue course bundle. Its camera fit uses a 6.4 unit extent in both directions and locks camera distance after the shared view helper reapplies its settings. Drag rotation stays enabled; pan and zoom are disabled to keep the preview in frame.
