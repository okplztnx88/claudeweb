# Valiant Roofing - Shingle Visualizer

A web-based tool that lets homeowners see what different roof shingles would look like on their home before making a purchase decision.

## Features

- **Photo Upload**: Take or upload a photo of any home
- **Roof Selection**: Paint over the roof area you want to visualize (supports touch for mobile)
- **Owens Corning Shingles**: Real product lines with accurate color approximations:
  - TruDefinition® Duration® (12 colors)
  - Woodcrest® (8 colors)
  - TruDefinition® Duration® Designer (8 colors)
- **Live Preview**: See instant updates as you select different shingles
- **Before/After Comparison**: Toggle views or use the split-screen slider
- **Save & Share**: Download branded visualizations to share with customers

## Quick Start

1. Open `index.html` in a web browser
2. Upload a photo of a home
3. Paint over the roof area
4. Browse and select shingle colors
5. Save and download the visualization

## Setup

No build process required! Simply:

```bash
# Clone the repository
git clone <repo-url>

# Open in browser
open index.html
# or use a local server
python -m http.server 8000
```

## Adding the Logo

Place your Valiant Roofing logo at:
```
images/valiant-logo.png
```

The app will display a fallback if the logo is not found.

## File Structure

```
├── index.html          # Main application
├── css/
│   └── styles.css      # All styling (Valiant branding)
├── js/
│   ├── shingles.js     # Owens Corning shingle catalog
│   └── app.js          # Application logic
└── images/
    └── valiant-logo.png  # Company logo (add your own)
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome for Android)

## Customization

### Adding New Shingle Colors

Edit `js/shingles.js` and add to the appropriate product line:

```javascript
{
    id: "color-id",
    name: "Display Name",
    colors: ["#hex1", "#hex2", "#hex3"],  // Color palette for texture
    pattern: "standard"  // or "shake" or "designer"
}
```

### Changing Brand Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
    --valiant-teal: #00A5A8;
    --valiant-magenta: #C41E82;
}
```

## Disclaimer

Colors shown are approximations. Actual shingle colors may vary based on lighting, screen calibration, and manufacturing variations. Always request physical samples for accurate color matching.

## License

Proprietary - Valiant Roofing
