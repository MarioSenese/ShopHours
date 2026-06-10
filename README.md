# ShopHours

> A standalone web app to configure a shop's opening hours — day by day, time slot by time slot — with live status, validation and export.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![license](https://img.shields.io/badge/license-Apache%202.0-blue?style=for-the-badge)

**Live demo:** [mariosenese.github.io/ShopHours](https://mariosenese.github.io/ShopHours/)

---

## What it is

ShopHours is a self-contained web application for setting up a business's opening hours. You open it, configure the week, and export the result in ready-to-use formats. No build step and no dependencies — just a single HTML file that runs in the browser.

## Features

- **Weekly hours** with an open/closed toggle for every day
- **Multiple time slots per day** (up to three: morning / afternoon / evening), added and removed dynamically
- **Presets** to fill the whole week in one click (standard shop, restaurant, pharmacy, gym, office)
- **Copy a day** onto other days (all days / weekdays / weekend / a single day)
- **Real-time validation** — flags inverted times and overlapping slots
- **Live status** — shows whether the business is open right now and the next change
- **Exceptions & holidays** — special dates with custom labels
- **Export** to JSON (storage/API), Schema.org (SEO / Google rich results) and plain text (email / print)
- **Accessibility** — native `type="time"` inputs, ARIA labels, WCAG AA contrast, keyboard-friendly dialogs

## Usage

Being a single self-contained file, you can simply **open it in your browser** to use it.

To run it from a local server (recommended for development):

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the address shown in the terminal.

## Export formats

- **JSON** — the raw configuration, ready to store or send to an API
- **Schema.org** — `OpeningHoursSpecification` markup, so search engines can read your hours
- **Plain text** — one readable line per day, for emails or print

## License

[Apache License 2.0](LICENSE) © 2022-2026 Mario Senese.

Free to use and modify, including commercially, **provided the copyright notice and
authorship are kept** and any changes to the files are stated. The "ShopHours" name
is not licensed as a trademark.
