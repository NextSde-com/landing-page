# NextSDE standalone landing page

This folder is a static copy of the existing NextSDE home page. It can be placed at the root of its own GitHub repository and later deployed as a static site. It does not need the Practice server or the Courses repository to render its images and animations.

## Before publishing

1. Product links currently open the local `coming-soon.html` page through `site-config.js`. Update that function when Practice, Courses, LLD, and Resume have live destinations.
2. Review the page's `noindex` meta tag in `index.html`. Remove it when you want search engines to index the landing page.
3. Set an absolute social preview image URL after the final landing domain is known.

Upload the contents of this folder as the repository root. For Cloudflare deployment, select the intended account in the CLI at deploy time. This folder contains no Cloudflare account ID, token, or deployment configuration tied to an account.

The page uses local image and 3D animation assets. Google Fonts and Phosphor icons still load from their public CDNs; system fonts and text remain available if those CDNs cannot be reached.
