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
        imageWidth: 0,
        imageHeight: 0,
        selectionMask: null,
        selectedShingle: null,
        selectedProductLine: 'duration',
        currentTool: 'draw',
        brushSize: 30,
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
        clearSelection: document.getElementById('clearSelection'),
        autoDetect: document.getElementById('autoDetect'),

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

                // Initialize empty selection mask
                state.selectionMask = selectionCtx.createImageData(state.imageWidth, state.imageHeight);

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
    }

    function paintSelection(x, y) {
        const size = state.brushSize;
        const halfSize = size / 2;

        if (state.currentTool === 'draw') {
            // Draw selection (semi-transparent teal)
            selectionCtx.fillStyle = 'rgba(0, 165, 168, 0.5)';
            selectionCtx.beginPath();
            selectionCtx.arc(x, y, halfSize, 0, Math.PI * 2);
            selectionCtx.fill();

            // Update mask
            updateMask(x, y, size, true);
        } else if (state.currentTool === 'erase') {
            // Erase selection
            selectionCtx.globalCompositeOperation = 'destination-out';
            selectionCtx.beginPath();
            selectionCtx.arc(x, y, halfSize, 0, Math.PI * 2);
            selectionCtx.fill();
            selectionCtx.globalCompositeOperation = 'source-over';

            // Update mask
            updateMask(x, y, size, false);
        }

        // Hide hint after first paint
        elements.selectionHint.classList.add('hidden');
    }

    function updateMask(cx, cy, size, add) {
        const radius = size / 2;
        const startX = Math.max(0, Math.floor(cx - radius));
        const endX = Math.min(state.imageWidth, Math.ceil(cx + radius));
        const startY = Math.max(0, Math.floor(cy - radius));
        const endY = Math.min(state.imageHeight, Math.ceil(cy + radius));

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const dx = x - cx;
                const dy = y - cy;
                if (dx * dx + dy * dy <= radius * radius) {
                    const idx = (y * state.imageWidth + x) * 4;
                    state.selectionMask.data[idx + 3] = add ? 255 : 0;
                }
            }
        }
    }

    function clearSelection() {
        selectionCtx.clearRect(0, 0, state.imageWidth, state.imageHeight);
        state.selectionMask = selectionCtx.createImageData(state.imageWidth, state.imageHeight);
        elements.selectionHint.classList.remove('hidden');
    }

    function autoDetectRoof() {
        // Simple edge-based roof detection (basic implementation)
        // For production, you'd want to use a proper ML model

        alert('Auto-detect is a preview feature. For best results, please manually paint over the roof area.\n\nTip: Use a large brush size for faster selection!');

        // Basic sky detection - find top portion that's lighter
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = state.imageWidth;
        tempCanvas.height = state.imageHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(state.originalImage, 0, 0, state.imageWidth, state.imageHeight);

        const imageData = tempCtx.getImageData(0, 0, state.imageWidth, state.imageHeight);
        const data = imageData.data;

        // Simple heuristic: assume roof is in upper-middle portion
        // and has different color from sky (which is usually lighter/bluer)

        const roofStartY = Math.floor(state.imageHeight * 0.1);
        const roofEndY = Math.floor(state.imageHeight * 0.5);

        selectionCtx.fillStyle = 'rgba(0, 165, 168, 0.5)';

        for (let y = roofStartY; y < roofEndY; y++) {
            for (let x = 0; x < state.imageWidth; x++) {
                const idx = (y * state.imageWidth + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Check if pixel is darker (likely roof, not sky)
                const brightness = (r + g + b) / 3;
                const isSky = brightness > 180 && b > r && b > g;

                if (!isSky && brightness < 200) {
                    selectionCtx.fillRect(x, y, 1, 1);
                    state.selectionMask.data[idx + 3] = 255;
                }
            }
        }

        elements.selectionHint.classList.add('hidden');
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

        // Get the selection mask from selection canvas
        const selectionData = selectionCtx.getImageData(0, 0, width, height);

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
        for (let i = 0; i < originalData.data.length; i += 4) {
            const alpha = selectionData.data[i + 3] / 255; // Selection opacity

            if (alpha > 0) {
                // Get original pixel brightness for lighting preservation
                const origR = originalData.data[i];
                const origG = originalData.data[i + 1];
                const origB = originalData.data[i + 2];
                const origBrightness = (origR + origG + origB) / 3 / 255;

                // Get texture pixel
                const texR = textureData.data[i];
                const texG = textureData.data[i + 1];
                const texB = textureData.data[i + 2];

                // Apply brightness from original image to texture
                const brightnessFactor = 0.3 + origBrightness * 0.7;

                // Blend with alpha
                const blendAlpha = alpha * 0.85; // Slightly transparent for realism
                originalData.data[i] = Math.round(origR * (1 - blendAlpha) + texR * brightnessFactor * blendAlpha);
                originalData.data[i + 1] = Math.round(origG * (1 - blendAlpha) + texG * brightnessFactor * blendAlpha);
                originalData.data[i + 2] = Math.round(origB * (1 - blendAlpha) + texB * brightnessFactor * blendAlpha);
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

        // Selection canvas drawing
        elements.selectionCanvas.addEventListener('mousedown', (e) => {
            state.isDrawing = true;
            const rect = elements.selectionCanvas.getBoundingClientRect();
            const scaleX = elements.selectionCanvas.width / rect.width;
            const scaleY = elements.selectionCanvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            paintSelection(x, y);
        });

        elements.selectionCanvas.addEventListener('mousemove', (e) => {
            if (!state.isDrawing) return;
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
            state.isDrawing = true;
            const touch = e.touches[0];
            const rect = elements.selectionCanvas.getBoundingClientRect();
            const scaleX = elements.selectionCanvas.width / rect.width;
            const scaleY = elements.selectionCanvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            paintSelection(x, y);
        });

        elements.selectionCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!state.isDrawing) return;
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

        elements.brushSize.addEventListener('input', (e) => {
            state.brushSize = parseInt(e.target.value);
            elements.brushSizeValue.textContent = state.brushSize;
        });

        elements.clearSelection.addEventListener('click', clearSelection);
        elements.autoDetect.addEventListener('click', autoDetectRoof);

        // Navigation
        elements.backToUpload.addEventListener('click', () => goToStep('upload'));
        elements.proceedToShingles.addEventListener('click', () => {
            // Check if any selection made
            const hasSelection = state.selectionMask &&
                Array.from(state.selectionMask.data).some((v, i) => i % 4 === 3 && v > 0);

            if (!hasSelection) {
                // Check canvas for any paint
                const selectionData = selectionCtx.getImageData(0, 0, state.imageWidth, state.imageHeight);
                const hasCanvasSelection = Array.from(selectionData.data).some((v, i) => i % 4 === 3 && v > 0);

                if (!hasCanvasSelection) {
                    alert('Please select a roof area first by painting over it.');
                    return;
                }

                // Update mask from canvas
                state.selectionMask = selectionData;
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
        console.log('Valiant Roofing Shingle Visualizer initialized');
    }

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
