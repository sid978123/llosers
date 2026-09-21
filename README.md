# LosersPdf — Production-Quality PDF & Image Utility Platform

A modern, fast, minimalistic, and privacy-first PDF and image utility platform built for production workloads.

---

## 🌟 Key Architecture & Non-Negotiables

1. **Every Listed Tool Actually Works**: No mock conversions, fake spinners, or renamed extensions. Every tool generates genuine, valid output files.
2. **Single Source of Truth (`TOOLS_REGISTRY`)**: All navigation bars, category menus, the All Tools modal, homepage catalogs, search index, and tool counts (`29` total) derive from one central registry (`client/src/registry/tools.ts`).
3. **All Tools Main Discovery Menu**: Accessible via the prominent "All Tools" header button, keyboard shortcut (`Cmd+K` / `Ctrl+K`), or category views with live instant search and filtering.
4. **Zero Database (`No Database`)**: Operates entirely without a database.
5. **100% Ephemeral & Private**: Files processed on client-side never leave your device. Server-assisted conversions execute in temporary memory buffers and are strictly wiped immediately after processing via background tasks.

---

## 🛠️ Complete Scope of 29 Tools

### 📄 PDF Tools (21)
1. **Merge PDF**: Combine multiple PDF documents in custom order.
2. **Split PDF**: Separate PDFs into individual pages or custom page ranges into ZIP.
3. **Remove PDF Pages**: Select and delete unwanted pages with visual thumbnail inspector.
4. **Extract PDF Pages**: Select specific pages into a brand new PDF.
5. **Organize PDF Pages**: Interactive grid to reorder, rotate 90°, and delete pages.
6. **JPG to PDF**: Convert JPG photos into formatted PDFs with custom margins and orientation.
7. **PNG to PDF**: Convert PNG graphics into PDFs with transparency support.
8. **PDF to JPG**: Extract every page into high-resolution JPG images packaged in a ZIP archive.
9. **PDF to PNG**: Extract crisp, lossless PNG images from every page.
10. **PDF to Word**: Convert PDF pages and text streams into editable Microsoft Word (`.docx`).
11. **Word to PDF**: Convert Microsoft Word (`.docx`) into standard PDF preserving headings and tables.
12. **Excel to PDF**: Convert Excel (`.xlsx`/`.xls`) spreadsheets into multi-page landscape PDF tables.
13. **PDF to PowerPoint**: Convert PDF pages into Microsoft PowerPoint (`.pptx`) slides.
14. **PowerPoint to PDF**: Convert PowerPoint (`.pptx`) presentation decks into PDF slides.
15. **Edit PDF**: Interactive canvas editor to place text annotations, highlight boxes, and draw shapes.
16. **Rotate PDF**: Rotate all pages or selected pages 90°, 180°, or 270°.
17. **Add Page Numbers**: Stamp customizable page numbers ("Page X of Y", positions, font sizes).
18. **Watermark PDF**: Stamp custom text watermarks with customizable opacity, angle, color, and size.
19. **Protect PDF with Password**: Encrypt PDF with military-grade AES-256 password protection.
20. **Unlock PDF**: Decrypt and remove password restrictions from protected documents.
21. **Sign PDF**: Interactive digital signature pad to draw or type signatures and place on target pages.

### 🖼️ Image Tools (8)
22. **Compress Image**: Intelligently compress JPG, PNG, WebP with quality slider and real-time savings percentage.
23. **Resize Image**: Scale dimensions by pixels or percentage presets with aspect ratio lock.
24. **Crop Image**: Interactive visual crop box with aspect ratio presets (1:1, 16:9, 4:3, freeform).
25. **Rotate Image**: Rotate 90° CW/CCW and flip horizontally/vertically.
26. **JPG to PNG**: Convert JPG to lossless PNG format.
27. **PNG to JPG**: Convert PNG to JPG with transparency flattening and background color fill.
28. **Image to PDF**: Combine multiple mixed images (JPG, PNG, WebP) into a single PDF.
29. **PDF to Image**: Universal PDF to Image converter supporting JPG and PNG with DPI quality settings.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node.js v24.7)
- Python 3.10+

### 1. Start the Ephemeral Backend
```bash
python -m uvicorn server.main:app --host 127.0.0.1 --port 8000
```
Backend health check: `http://127.0.0.1:8000/api/health`

### 2. Start the Frontend
```bash
cd client
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Run Automated Integration Tests
```bash
python tests/test_conversions.py
```
Verifies all server-assisted document conversions with real test files.
