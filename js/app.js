/**
 * Valiant Roofing - Shingle Visualizer App
 * Main application logic
 */

(function() {
    'use strict';

    // ==========================================
    // State Management
    // ==========================================
    const state = {
        currentStep: 'upload',
        originalImage: null,
        originalImageData: null,
        imageWidth: 0,
        imageHeight: 0,
        selectionMask: null,
        selectedShingle: null,
        selectedProductLine: 'duration',
        currentTool: 'fill',
        brushSize: 30,
        fillTolerance: 32,
        isDrawing: false,
        viewMode: 'after',
        splitPosition: 0.5
    };

    // ==========================================
    // DOM Elements
    // ==========================================
    const elements = {
        // Steps
        stepUpload: document.getElementById('step-upload'),
        stepSelect: document.getElementById('step-select'),
        stepShingles: document.getElementById('step-shingles'),

        // Upload
        uploadArea: document.getElementById('uploadArea'),
        imageInput: document.getElementById('imageInput'),

        // Selection
        mainCanvas: document.getElementById('mainCanvas'),
        selectionCanvas: document.getElementById('selectionCanvas'),
        selectionHint: document.getElementById('selectionHint'),
        brushSize: document.getElementById('brushSize'),
        brushSizeValue: document.getElementById('brushSizeValue'),
        fillTolerance: document.getElementById('fillTolerance'),
        fillToleranceValue: document.getElementById('fillToleranceValue'),
        fillOptions: document.getElementById('fillOptions'),
        brushOptions: document.getElementById('brushOptions'),
        clearSelection: document.getElementById('clearSelection'),

        // Shingles
        colorGrid: document.getElementById('colorGrid'),
        previewCanvas: document.getElementById('previewCanvas'),
        splitSlider: document.getElementById('splitSlider'),

        // Modal
        saveModal: document.getElementById('saveModal'),
        savedImage: document.getElementById('savedImage'),
        customerName: document.getElementById('customerName'),
        customerAddress: document.getElementById('customerAddress'),
        customerNotes: document.getElementById('customerNotes'),

        // Navigation
        backToUpload: document.getElementById('backToUpload'),
        proceedToShingles: document.getElementById('proceedToShingles'),
        backToSelect: document.getElementById('backToSelect'),
        saveResult: document.getElementById('saveResult'),
        closeModal: document.getElementById('closeModal'),
        downloadImage: document.getElementById('downloadImage'),
        startOver: document.getElementById('startOver')
    };

    // Get canvas contexts
    const mainCtx = elements.mainCanvas.getContext('2d');
    const selectionCtx = elements.selectionCanvas.getContext('2d');
    const previewCtx = elements.previewCanvas.getContext('2d');

    // ==========================================
    // Step Navigation
    // ==========================================
    function goToStep(stepName) {
        state.currentStep = stepName;

        // Hide all steps
        elements.stepUpload.classList.remove('active');
        elements.stepSelect.classList.remove('active');
        elements.stepShingles.classList.remove('active');

        // Show current step
        switch (stepName) {
            case 'upload':
                elements.stepUpload.classList.add('active');
                break;
            case 'select':
                elements.stepSelect.classList.add('active');
                break;
            case 'shingles':
                elements.stepShingles.classList.add('active');
                renderPreview();
                break;
        }
    }

    // ==========================================
    // Image Upload
    // ==========================================
    function handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                state.originalImage = img;

                // Calculate display size (max 1200px width)
                const maxWidth = Math.min(1200, window.innerWidth - 80);
                const scale = img.width > maxWidth ? maxWidth / img.width : 1;
                state.imageWidth = Math.floor(img.width * scale);
                state.imageHeight = Math.floor(img.height * scale);

                // Setup canvases
                setupCanvases();

                // Draw original image
                mainCtx.drawImage(img, 0, 0, state.imageWidth, state.imageHeight);

                // Store original image data for flood fill
                state.originalImageData = mainCtx.getImageData(0, 0, state.imageWidth, state.imageHeight);

                // Initialize empty selection mask
                state.selectionMask = new Uint8Array(state.imageWidth * state.imageHeight);

                // Go to selection step
                goToStep('select');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function setupCanvases() {
        // Main canvas
        elements.mainCanvas.width = state.imageWidth;
        elements.mainCanvas.height = state.imageHeight;

        // Selection canvas (overlay)
        elements.selectionCanvas.width = state.imageWidth;
        elements.selectionCanvas.height = state.imageHeight;

        // Preview canvas
        elements.previewCanvas.width = state.imageWidth;
        elements.previewCanvas.height = state.imageHeight;
    }

    // ==========================================
    // Selection Tools
    // ==========================================
    function setTool(tool) {
        state.currentTool = tool;

        // Update UI
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });

        // Show/hide appropriate options
        if (elements.fillOptions && elements.brushOptions) {
            elements.fillOptions.style.display = tool === 'fill' ? 'flex' : 'none';
            elements.brushOptions.style.display = (tool === 'draw' || tool === 'erase') ? 'flex' : 'none';
        }

        // Update cursor
        elements.selectionCanvas.classList.toggle('fill-mode', tool === 'fill');
    }

    // ==========================================
    // Flood Fill Algorithm
    // ==========================================
    function floodFill(startX, startY, tolerance) {
        const width = state.imageWidth;
        const height = state.imageHeight;

        // Safety checks
        if (!state.originalImageData || !state.originalImageData.data) {
            console.error('No image data available for flood fill');
            return new Uint8Array(width * height);
        }

        const imageData = state.originalImageData.data;

        startX = Math.floor(startX);
        startY = Math.floor(startY);

        // Bounds check for starting point
        if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
            console.error('Start position out of bounds:', startX, startY);
            return new Uint8Array(width * height);
        }

        // Get the color at the starting point
        const startIdx = (startY * width + startX) * 4;
        const startR = imageData[startIdx];
        const startG = imageData[startIdx + 1];
        const startB = imageData[startIdx + 2];

        // Create visited array
        const visited = new Uint8Array(width * height);
        const selected = new Uint8Array(width * height);

        // Use a more efficient scanline flood fill
        const stack = [[startX, startY]];
        const toleranceThreshold = tolerance * 3;

        while (stack.length > 0) {
            const [x, y] = stack.pop();

            // Bounds check
            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            const pixelIdx = y * width + x;

            // Already visited
            if (visited[pixelIdx]) continue;
            visited[pixelIdx] = 1;

            // Get current pixel color
            const idx = pixelIdx * 4;
            const r = imageData[idx];
            const g = imageData[idx + 1];
            const b = imageData[idx + 2];

            // Check if color is within tolerance
            const diff = Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB);

            if (diff <= toleranceThreshold) {
                selected[pixelIdx] = 1;

                // Add neighbors (4-directional)
                stack.push([x + 1, y]);
                stack.push([x - 1, y]);
                stack.push([x, y + 1]);
                stack.push([x, y - 1]);
            }
        }

        return selected;
    }

    function applyFloodFill(x, y) {
        // Safety check
        if (!state.originalImageData) {
            console.error('Cannot flood fill: no image data');
            alert('Please upload an image first');
            return;
        }

        const selected = floodFill(x, y, state.fillTolerance);

        // Count selected pixels
        let count = 0;

        // Merge with existing selection
        for (let i = 0; i < selected.length; i++) {
            if (selected[i]) {
                state.selectionMask[i] = 1;
                count++;
            }
        }

        console.log('Flood fill selected', count, 'pixels at', Math.floor(x), Math.floor(y));

        // Apply edge smoothing and render
        renderSelectionWithSmoothing();

        // Hide hint
        elements.selectionHint.classList.add('hidden');
    }

    function eraseFloodFill(x, y) {
        const selected = floodFill(x, y, state.fillTolerance);

        // Remove from existing selection
        for (let i = 0; i < selected.length; i++) {
            if (selected[i]) {
                state.selectionMask[i] = 0;
            }
        }

        // Render updated selection
        renderSelectionWithSmoothing();
    }

    // ==========================================
    // Edge Smoothing
    // ==========================================
    function renderSelectionWithSmoothing() {
        const width = state.imageWidth;
        const height = state.imageHeight;

        // Clear selection canvas
        selectionCtx.clearRect(0, 0, width, height);

        // Create image data for the selection overlay
        const selectionImageData = selectionCtx.createImageData(width, height);
        const data = selectionImageData.data;

        // Apply gaussian-like edge smoothing
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;

                if (state.selectionMask[idx]) {
                    // Check neighbors for edge detection and anti-aliasing
                    let edgeCount = 0;
                    const neighbors = [
                        [-1, -1], [0, -1], [1, -1],
                        [-1, 0],          [1, 0],
                        [-1, 1],  [0, 1],  [1, 1]
                    ];

                    for (const [dx, dy] of neighbors) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const nIdx = ny * width + nx;
                            if (!state.selectionMask[nIdx]) {
                                edgeCount++;
                            }
                        } else {
                            edgeCount++;
                        }
                    }

                    // Calculate alpha based on edge proximity
                    let alpha;
                    if (edgeCount === 0) {
                        alpha = 128; // Fully inside
                    } else if (edgeCount <= 2) {
                        alpha = 100; // Near edge
                    } else if (edgeCount <= 4) {
                        alpha = 70; // On edge
                    } else {
                        alpha = 50; // Corner/very edge
                    }

                    const pixelIdx = idx * 4;
                    data[pixelIdx] = 0;      // R (teal)
                    data[pixelIdx + 1] = 165; // G
                    data[pixelIdx + 2] = 168; // B
                    data[pixelIdx + 3] = alpha;
                }
            }
        }

        selectionCtx.putImageData(selectionImageData, 0, 0);
    }

    // ==========================================
    // Brush Tools (legacy support)
    // ==========================================
    function paintSelection(x, y) {
        if (state.currentTool === 'fill') {
            applyFloodFill(x, y);
            return;
        }

        const size = state.brushSize;
        const halfSize = size / 2;
        const width = state.imageWidth;
        const height = state.imageHeight;

        const isErase = state.currentTool === 'erase';

        // Update mask
        const startX = Math.max(0, Math.floor(x - halfSize));
        const endX = Math.min(width, Math.ceil(x + halfSize));
        const startY = Math.max(0, Math.floor(y - halfSize));
        const endY = Math.min(height, Math.ceil(y + halfSize));

        for (let py = startY; py < endY; py++) {
            for (let px = startX; px < endX; px++) {
                const dx = px - x;
                const dy = py - y;
                if (dx * dx + dy * dy <= halfSize * halfSize) {
                    const idx = py * width + px;
                    state.selectionMask[idx] = isErase ? 0 : 1;
                }
            }
        }

        // Render with smoothing
        renderSelectionWithSmoothing();

        // Hide hint
        elements.selectionHint.classList.add('hidden');
    }

    function clearSelection() {
        state.selectionMask = new Uint8Array(state.imageWidth * state.imageHeight);
        selectionCtx.clearRect(0, 0, state.imageWidth, state.imageHeight);
        elements.selectionHint.classList.remove('hidden');
    }

    // ==========================================
    // Shingle Selection
    // ==========================================
    function setProductLine(line) {
        state.selectedProductLine = line;

        // Update UI
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.line === line);
        });

        // Render colors
        renderColorGrid();
    }

    function renderColorGrid() {
        const productLine = SHINGLE_CATALOG[state.selectedProductLine];
        const colors = productLine.colors;

        elements.colorGrid.innerHTML = '';

        colors.forEach((shingle, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.dataset.index = index;

            if (state.selectedShingle &&
                state.selectedShingle.id === shingle.id) {
                swatch.classList.add('active');
            }

            const preview = document.createElement('div');
            preview.className = 'swatch-preview';
            preview.style.backgroundImage = `url(${createSwatchPreview(shingle)})`;

            const name = document.createElement('div');
            name.className = 'swatch-name';
            name.textContent = shingle.name;

            swatch.appendChild(preview);
            swatch.appendChild(name);

            swatch.addEventListener('click', () => selectShingle(shingle));

            elements.colorGrid.appendChild(swatch);
        });

        // Auto-select first if none selected
        if (!state.selectedShingle) {
            selectShingle(colors[0]);
        }
    }

    function selectShingle(shingle) {
        state.selectedShingle = shingle;

        // Update UI
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            const idx = parseInt(swatch.dataset.index);
            const colors = SHINGLE_CATALOG[state.selectedProductLine].colors;
            swatch.classList.toggle('active', colors[idx].id === shingle.id);
        });

        // Update preview
        renderPreview();
    }

    // ==========================================
    // Preview Rendering
    // ==========================================
    function renderPreview() {
        if (!state.originalImage || !state.selectedShingle) return;

        const width = state.imageWidth;
        const height = state.imageHeight;

        // Draw original image
        previewCtx.drawImage(state.originalImage, 0, 0, width, height);

        // Create shingle texture
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = width;
        textureCanvas.height = height;
        const textureCtx = textureCanvas.getContext('2d');
        generateShingleTexture(textureCtx, width, height, state.selectedShingle);

        // Get image data
        const originalData = previewCtx.getImageData(0, 0, width, height);
        const textureData = textureCtx.getImageData(0, 0, width, height);

        // Blend texture into selected areas
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const maskIdx = y * width + x;
                const pixelIdx = maskIdx * 4;

                if (state.selectionMask[maskIdx]) {
                    // Get original pixel brightness for lighting preservation
                    const origR = originalData.data[pixelIdx];
                    const origG = originalData.data[pixelIdx + 1];
                    const origB = originalData.data[pixelIdx + 2];
                    const origBrightness = (origR + origG + origB) / 3 / 255;

                    // Get texture pixel
                    const texR = textureData.data[pixelIdx];
                    const texG = textureData.data[pixelIdx + 1];
                    const texB = textureData.data[pixelIdx + 2];

                    // Apply brightness from original image to texture
                    const brightnessFactor = 0.3 + origBrightness * 0.7;

                    // Check for edge - softer blend at edges
                    let blendAlpha = 0.88;

                    // Simple edge detection for smoother blending
                    let isEdge = false;
                    if (x > 0 && !state.selectionMask[maskIdx - 1]) isEdge = true;
                    if (x < width - 1 && !state.selectionMask[maskIdx + 1]) isEdge = true;
                    if (y > 0 && !state.selectionMask[maskIdx - width]) isEdge = true;
                    if (y < height - 1 && !state.selectionMask[maskIdx + width]) isEdge = true;

                    if (isEdge) {
                        blendAlpha = 0.7; // Softer at edges
                    }

                    originalData.data[pixelIdx] = Math.round(origR * (1 - blendAlpha) + texR * brightnessFactor * blendAlpha);
                    originalData.data[pixelIdx + 1] = Math.round(origG * (1 - blendAlpha) + texG * brightnessFactor * blendAlpha);
                    originalData.data[pixelIdx + 2] = Math.round(origB * (1 - blendAlpha) + texB * brightnessFactor * blendAlpha);
                }
            }
        }

        previewCtx.putImageData(originalData, 0, 0);

        // Handle view mode
        if (state.viewMode === 'before') {
            previewCtx.drawImage(state.originalImage, 0, 0, width, height);
        } else if (state.viewMode === 'split') {
            // Draw original on left side
            const splitX = Math.floor(width * state.splitPosition);
            previewCtx.save();
            previewCtx.beginPath();
            previewCtx.rect(0, 0, splitX, height);
            previewCtx.clip();
            previewCtx.drawImage(state.originalImage, 0, 0, width, height);
            previewCtx.restore();

            // Add "Before" / "After" labels
            previewCtx.font = 'bold 16px Open Sans';
            previewCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            previewCtx.fillRect(10, 10, 60, 25);
            previewCtx.fillRect(width - 70, 10, 60, 25);
            previewCtx.fillStyle = 'white';
            previewCtx.fillText('Before', 15, 28);
            previewCtx.fillText('After', width - 65, 28);
        }
    }

    function setViewMode(mode) {
        state.viewMode = mode;

        // Update UI
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });

        // Show/hide split slider
        elements.splitSlider.style.display = mode === 'split' ? 'block' : 'none';

        renderPreview();
    }

    // ==========================================
    // Save & Export
    // ==========================================
    function saveVisualization() {
        // Create final image with branding
        const finalCanvas = document.createElement('canvas');
        const padding = 60;
        finalCanvas.width = state.imageWidth;
        finalCanvas.height = state.imageHeight + padding;
        const ctx = finalCanvas.getContext('2d');

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        // Draw the preview image
        ctx.drawImage(elements.previewCanvas, 0, 0);

        // Add branding footer
        ctx.fillStyle = '#1F2937';
        ctx.fillRect(0, state.imageHeight, state.imageWidth, padding);

        // Branding text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Open Sans';
        ctx.fillText('Valiant Roofing', 15, state.imageHeight + 25);

        ctx.font = '12px Open Sans';
        ctx.fillStyle = '#E91E8C';
        ctx.fillText('Featuring Owens Corning® Roofing', 15, state.imageHeight + 45);

        // Shingle info
        if (state.selectedShingle) {
            const productLine = SHINGLE_CATALOG[state.selectedProductLine];
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Open Sans';
            ctx.textAlign = 'right';
            ctx.fillText(`${productLine.name}`, state.imageWidth - 15, state.imageHeight + 25);
            ctx.fillText(`Color: ${state.selectedShingle.name}`, state.imageWidth - 15, state.imageHeight + 45);
            ctx.textAlign = 'left';
        }

        // Show modal with saved image
        elements.savedImage.src = finalCanvas.toDataURL('image/jpeg', 0.9);
        elements.saveModal.classList.add('active');
    }

    function downloadImage() {
        const link = document.createElement('a');
        const customerName = elements.customerName.value || 'visualization';
        const fileName = `valiant-roofing-${customerName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;

        link.download = fileName;
        link.href = elements.savedImage.src;
        link.click();
    }

    function startOver() {
        // Reset state
        state.originalImage = null;
        state.originalImageData = null;
        state.selectionMask = null;
        state.selectedShingle = null;

        // Clear canvases
        mainCtx.clearRect(0, 0, elements.mainCanvas.width, elements.mainCanvas.height);
        selectionCtx.clearRect(0, 0, elements.selectionCanvas.width, elements.selectionCanvas.height);
        previewCtx.clearRect(0, 0, elements.previewCanvas.width, elements.previewCanvas.height);

        // Clear form
        elements.customerName.value = '';
        elements.customerAddress.value = '';
        elements.customerNotes.value = '';

        // Close modal and go to upload
        elements.saveModal.classList.remove('active');
        goToStep('upload');
    }

    // ==========================================
    // Event Listeners
    // ==========================================
    function setupEventListeners() {
        // Upload area
        elements.uploadArea.addEventListener('click', () => elements.imageInput.click());

        elements.imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
            }
        });

        // Drag and drop
        elements.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            elements.uploadArea.classList.add('dragover');
        });

        elements.uploadArea.addEventListener('dragleave', () => {
            elements.uploadArea.classList.remove('dragover');
        });

        elements.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            elements.uploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleImageUpload(e.dataTransfer.files[0]);
            }
        });

        // Selection canvas - handle both click (fill) and drag (brush)
        elements.selectionCanvas.addEventListener('mousedown', (e) => {
            const rect = elements.selectionCanvas.getBoundingClientRect();
            const scaleX = elements.selectionCanvas.width / rect.width;
            const scaleY = elements.selectionCanvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            console.log('Mouse click at', x, y, 'tool:', state.currentTool);

            if (state.currentTool === 'fill') {
                applyFloodFill(x, y);
            } else {
                state.isDrawing = true;
                paintSelection(x, y);
            }
        });

        // Also handle click for fill tool (in case mousedown doesn't fire properly)
        elements.selectionCanvas.addEventListener('click', (e) => {
            if (state.currentTool !== 'fill') return;

            const rect = elements.selectionCanvas.getBoundingClientRect();
            const scaleX = elements.selectionCanvas.width / rect.width;
            const scaleY = elements.selectionCanvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            console.log('Click event at', x, y);
            // Don't double-fire if mousedown already handled it
        });

        elements.selectionCanvas.addEventListener('mousemove', (e) => {
            if (!state.isDrawing || state.currentTool === 'fill') return;
            const rect = elements.selectionCanvas.getBoundingClientRect();
            const scaleX = elements.selectionCanvas.width / rect.width;
            const scaleY = elements.selectionCanvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            paintSelection(x, y);
        });

        document.addEventListener('mouseup', () => {
            state.isDrawing = false;
        });

        // Touch support for mobile
        elements.selectionCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = elements.selectionCanvas.getBoundingClientRect();
            const scaleX = elements.selectionCanvas.width / rect.width;
            const scaleY = elements.selectionCanvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            if (state.currentTool === 'fill') {
                applyFloodFill(x, y);
            } else {
                state.isDrawing = true;
                paintSelection(x, y);
            }
        });

        elements.selectionCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!state.isDrawing || state.currentTool === 'fill') return;
            const touch = e.touches[0];
            const rect = elements.selectionCanvas.getBoundingClientRect();
            const scaleX = elements.selectionCanvas.width / rect.width;
            const scaleY = elements.selectionCanvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            paintSelection(x, y);
        });

        elements.selectionCanvas.addEventListener('touchend', () => {
            state.isDrawing = false;
        });

        // Tools
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => setTool(btn.dataset.tool));
        });

        // Tolerance slider
        if (elements.fillTolerance) {
            elements.fillTolerance.addEventListener('input', (e) => {
                state.fillTolerance = parseInt(e.target.value);
                elements.fillToleranceValue.textContent = state.fillTolerance;
            });
        }

        // Brush size slider
        if (elements.brushSize) {
            elements.brushSize.addEventListener('input', (e) => {
                state.brushSize = parseInt(e.target.value);
                elements.brushSizeValue.textContent = state.brushSize;
            });
        }

        elements.clearSelection.addEventListener('click', clearSelection);

        // Navigation
        elements.backToUpload.addEventListener('click', () => goToStep('upload'));
        elements.proceedToShingles.addEventListener('click', () => {
            // Check if any selection made
            const hasSelection = state.selectionMask &&
                state.selectionMask.some(v => v === 1);

            if (!hasSelection) {
                alert('Please select a roof area first by clicking on it.');
                return;
            }

            goToStep('shingles');
        });

        elements.backToSelect.addEventListener('click', () => goToStep('select'));

        // Product lines
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.addEventListener('click', () => setProductLine(btn.dataset.line));
        });

        // View modes
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', () => setViewMode(btn.dataset.view));
        });

        // Split slider
        let isDraggingSplit = false;

        elements.splitSlider.addEventListener('mousedown', () => {
            isDraggingSplit = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingSplit) return;
            const rect = elements.previewCanvas.getBoundingClientRect();
            state.splitPosition = Math.max(0.1, Math.min(0.9,
                (e.clientX - rect.left) / rect.width
            ));
            elements.splitSlider.style.left = `${state.splitPosition * 100}%`;
            renderPreview();
        });

        document.addEventListener('mouseup', () => {
            isDraggingSplit = false;
        });

        // Modal
        elements.saveResult.addEventListener('click', saveVisualization);
        elements.closeModal.addEventListener('click', () => {
            elements.saveModal.classList.remove('active');
        });
        elements.downloadImage.addEventListener('click', downloadImage);
        elements.startOver.addEventListener('click', startOver);

        // Close modal on backdrop click
        elements.saveModal.addEventListener('click', (e) => {
            if (e.target === elements.saveModal) {
                elements.saveModal.classList.remove('active');
            }
        });
    }

    // ==========================================
    // Initialize
    // ==========================================
    function init() {
        setupEventListeners();
        renderColorGrid();

        // Set default tool to fill
        setTool('fill');

        console.log('Valiant Roofing Shingle Visualizer initialized');
    }

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
