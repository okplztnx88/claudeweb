/**
 * Owens Corning Shingle Catalog
 * Colors are approximations - actual shingles will vary
 */

const SHINGLE_CATALOG = {
    duration: {
        name: "TruDefinition® Duration®",
        description: "High-performance laminated shingles with SureNail® Technology",
        colors: [
            {
                id: "onyx-black",
                name: "Onyx Black",
                colors: ["#1a1a1a", "#2d2d2d", "#0f0f0f"],
                pattern: "standard"
            },
            {
                id: "estate-gray",
                name: "Estate Gray",
                colors: ["#5c5c5c", "#4a4a4a", "#6e6e6e"],
                pattern: "standard"
            },
            {
                id: "brownwood",
                name: "Brownwood",
                colors: ["#5c4a3d", "#4a3c32", "#6e5a4a"],
                pattern: "standard"
            },
            {
                id: "desert-tan",
                name: "Desert Tan",
                colors: ["#c4a882", "#b89b73", "#d4b892"],
                pattern: "standard"
            },
            {
                id: "driftwood",
                name: "Driftwood",
                colors: ["#8b7d6b", "#7a6c5a", "#9c8e7c"],
                pattern: "standard"
            },
            {
                id: "harbor-blue",
                name: "Harbor Blue",
                colors: ["#4a5568", "#3d4652", "#5a6578"],
                pattern: "standard"
            },
            {
                id: "sierra-gray",
                name: "Sierra Gray",
                colors: ["#7a7a7a", "#686868", "#8c8c8c"],
                pattern: "standard"
            },
            {
                id: "teak",
                name: "Teak",
                colors: ["#6b5344", "#5a4536", "#7c6454"],
                pattern: "standard"
            },
            {
                id: "chateau-green",
                name: "Chateau Green",
                colors: ["#3d4a3d", "#324032", "#4a5a4a"],
                pattern: "standard"
            },
            {
                id: "amber",
                name: "Amber",
                colors: ["#a67c52", "#956b42", "#b78d62"],
                pattern: "standard"
            },
            {
                id: "storm-cloud",
                name: "Storm Cloud",
                colors: ["#4a4a54", "#3d3d46", "#5a5a64"],
                pattern: "standard"
            },
            {
                id: "quarry-gray",
                name: "Quarry Gray",
                colors: ["#6b6b72", "#5a5a62", "#7c7c82"],
                pattern: "standard"
            }
        ]
    },
    woodcrest: {
        name: "Woodcrest®",
        description: "Artisan-crafted wood shake appearance",
        colors: [
            {
                id: "mesquite",
                name: "Mesquite",
                colors: ["#5c4a3d", "#4a3c32", "#6e5a4a", "#7a6454"],
                pattern: "shake"
            },
            {
                id: "mountain-cedar",
                name: "Mountain Cedar",
                colors: ["#6b5a4a", "#5a4a3a", "#7c6b5a", "#8d7c6a"],
                pattern: "shake"
            },
            {
                id: "timber",
                name: "Timber",
                colors: ["#4a4038", "#3d342c", "#5a5048", "#6b6058"],
                pattern: "shake"
            },
            {
                id: "autumn-maples",
                name: "Autumn Maples",
                colors: ["#8b5a3d", "#7a4a2d", "#9c6b4d", "#ad7c5d"],
                pattern: "shake"
            },
            {
                id: "chestnut",
                name: "Chestnut",
                colors: ["#5a4032", "#4a3028", "#6b5042", "#7c6052"],
                pattern: "shake"
            },
            {
                id: "seasoned-cedar",
                name: "Seasoned Cedar",
                colors: ["#7a6a5a", "#6a5a4a", "#8a7a6a", "#9a8a7a"],
                pattern: "shake"
            },
            {
                id: "stone-river",
                name: "Stone River",
                colors: ["#5c5c5c", "#4a4a4a", "#6e6e6e", "#808080"],
                pattern: "shake"
            },
            {
                id: "twilight-black",
                name: "Twilight Black",
                colors: ["#2a2a2a", "#1a1a1a", "#3a3a3a", "#4a4a4a"],
                pattern: "shake"
            }
        ]
    },
    designer: {
        name: "TruDefinition® Duration® Designer",
        description: "Premium designer colors with bold contrast",
        colors: [
            {
                id: "aged-copper",
                name: "Aged Copper",
                colors: ["#7a5a4a", "#6a4a3a", "#8a6a5a", "#5a3a2a"],
                pattern: "designer"
            },
            {
                id: "black-sable",
                name: "Black Sable",
                colors: ["#2a2a2a", "#1a1a1a", "#3a3a3a", "#4a4a4a"],
                pattern: "designer"
            },
            {
                id: "merlot",
                name: "Merlot",
                colors: ["#5a3a3a", "#4a2a2a", "#6a4a4a", "#7a5a5a"],
                pattern: "designer"
            },
            {
                id: "pacific-wave",
                name: "Pacific Wave",
                colors: ["#4a5a6a", "#3a4a5a", "#5a6a7a", "#6a7a8a"],
                pattern: "designer"
            },
            {
                id: "sand-dune",
                name: "Sand Dune",
                colors: ["#c4a882", "#b49872", "#d4b892", "#a48862"],
                pattern: "designer"
            },
            {
                id: "sedona-canyon",
                name: "Sedona Canyon",
                colors: ["#8a5a3a", "#7a4a2a", "#9a6a4a", "#6a3a2a"],
                pattern: "designer"
            },
            {
                id: "summer-harvest",
                name: "Summer Harvest",
                colors: ["#a68a5a", "#967a4a", "#b69a6a", "#c6aa7a"],
                pattern: "designer"
            },
            {
                id: "frosted-oak",
                name: "Frosted Oak",
                colors: ["#8a8a7a", "#7a7a6a", "#9a9a8a", "#aaaa9a"],
                pattern: "designer"
            }
        ]
    }
};

/**
 * Generate a shingle texture pattern on canvas
 */
function generateShingleTexture(ctx, width, height, shingle, opacity = 1) {
    const colors = shingle.colors;
    const pattern = shingle.pattern;

    // Base fill with primary color
    ctx.fillStyle = colors[0];
    ctx.globalAlpha = opacity;
    ctx.fillRect(0, 0, width, height);

    // Shingle pattern based on type
    const shingleHeight = pattern === 'shake' ? 25 : 18;
    const shingleWidth = pattern === 'shake' ? 60 : 40;
    const stagger = shingleWidth / 2;

    ctx.globalAlpha = opacity;

    for (let y = 0; y < height; y += shingleHeight) {
        const rowOffset = (Math.floor(y / shingleHeight) % 2) * stagger;

        for (let x = -stagger + rowOffset; x < width + shingleWidth; x += shingleWidth) {
            // Random color from palette for each shingle
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Draw shingle rectangle
            ctx.fillStyle = color;
            ctx.fillRect(x, y, shingleWidth - 2, shingleHeight - 1);

            // Add subtle shadow at bottom
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.fillRect(x, y + shingleHeight - 3, shingleWidth - 2, 2);

            // Add slight highlight at top for 3D effect
            if (pattern === 'shake') {
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fillRect(x + 1, y + 1, shingleWidth - 4, 2);
            }

            // Add grain texture for shake pattern
            if (pattern === 'shake') {
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 0.5;
                for (let i = 0; i < 3; i++) {
                    const lineX = x + 5 + Math.random() * (shingleWidth - 15);
                    ctx.beginPath();
                    ctx.moveTo(lineX, y + 2);
                    ctx.lineTo(lineX + Math.random() * 4 - 2, y + shingleHeight - 2);
                    ctx.stroke();
                }
            }
        }
    }

    // Add overall texture noise
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * Create a preview swatch image for the color selector
 */
function createSwatchPreview(shingle, width = 140, height = 80) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    generateShingleTexture(ctx, width, height, shingle);

    return canvas.toDataURL();
}

// Export for use in main app
window.SHINGLE_CATALOG = SHINGLE_CATALOG;
window.generateShingleTexture = generateShingleTexture;
window.createSwatchPreview = createSwatchPreview;
