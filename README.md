# Houxuan Guo — Personal Homepage

Source for my academic homepage at **[aboutme.hoesen.cc](https://aboutme.hoesen.cc)**: research, publications, and CV. I'm a Ph.D. candidate in Computer Engineering at Northwestern University.

The site is built with [Jekyll](https://jekyllrb.com) and hosted on [GitHub Pages](https://pages.github.com).

## Credits

This repository was originally forked from [academicpages](https://github.com/academicpages/academicpages.github.io), a GitHub Pages template for academic websites by [Stuart Geiger](https://github.com/staeiou), which was itself forked from the [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/) © 2016 Michael Rose, released under the MIT License.

The template has since been replaced with a small custom theme that keeps a similar look: no jQuery, icon fonts, or other third-party scripts, and about 15 KB of CSS and JavaScript in total.

## License

The code is released under the [MIT License](LICENSE); feel free to reuse it for your own site. The content (text, publications, CV, and photos) is © Houxuan Guo, all rights reserved. See [LICENSE](LICENSE) for details.

## Editing

| To change | Edit |
|---|---|
| Home page bio and research interests | `_pages/about.md` |
| Publications (shown on the home, Publications, and CV pages) | `_data/publications.yml` |
| Research projects | `_pages/research.md` |
| CV | `_pages/cv.md` |
| Sidebar info and profile links (Google Scholar, GitHub, LinkedIn, ORCID) | `author:` in `_config.yml` |
| Navigation links | `_data/navigation.yml` |
| Light and dark colors | `_sass/_theme.scss` |

## Layout

```
_config.yml            Site settings
_data/                 Navigation and publication data
_pages/                Page content
_layouts/default.html  Page shell
_includes/             Masthead, sidebar, footer, publication list, icons
_sass/, assets/css/    Styles
assets/js/site.js      Theme toggle, BibTeX copy, easter egg
images/                Headshot, site icons, link preview card
```

## Running locally

```bash
bundle install
bundle exec jekyll serve
# then open http://localhost:4000
```

Hint: try clicking the avatar, or press and hold it.
