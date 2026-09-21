import type { ToolDefinition, ToolCategory } from '../registry/tools';

export interface HowToStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolSeoMetadata {
  title: string;
  description: string;
  keywords: string;
  howTo: HowToStep[];
  features: string[];
  faqs: FaqItem[];
}

export const HOME_SEO_DATA = {
  title: 'LosersPdf — Free, Fast & Private Online PDF and Image Tools',
  description:
    'Complete suite of 29 free PDF and image utilities. Merge, split, edit, compress, convert, and protect documents with zero database and in-memory privacy.',
  keywords:
    'pdf tools, image tools, free pdf editor, merge pdf, split pdf, convert pdf, compress image, private pdf utility, loserspdf',
  canonical: '/',
};

export const CATEGORY_SEO_DATA: Record<
  ToolCategory,
  { title: string; description: string; keywords: string; canonical: string }
> = {
  pdf: {
    title: 'Free PDF Tools & Utilities Online — Merge, Split, Convert & Edit | LosersPdf',
    description:
      'Explore 21 production-grade online PDF utilities. Merge, split, organize, convert, sign, and password-protect your PDFs in memory with complete privacy.',
    keywords:
      'pdf tools, merge pdf, split pdf, word to pdf, excel to pdf, sign pdf, watermark pdf, protect pdf, free pdf utilities',
    canonical: '/pdf-tools',
  },
  image: {
    title: 'Free Online Image Tools & Utilities — Compress, Resize, Crop & Convert | LosersPdf',
    description:
      'Fast, in-browser image tools. Compress JPG/PNG/WebP, resize, crop, rotate, and convert formats with instant client-side execution and zero data retention.',
    keywords:
      'image tools, compress image, resize image, crop photo, rotate image, jpg to png, png to jpg, image to pdf',
    canonical: '/image-tools',
  },
};

export const TOOL_SEO_DATA: Record<string, ToolSeoMetadata> = {
  'merge-pdf': {
    title: 'Merge PDF Online Free — Fast & Private PDF Combiner | LosersPdf',
    description:
      'Combine multiple PDF files into one document in seconds. 100% free, private in-browser execution with drag-and-drop reordering. No file size limits or registration.',
    keywords:
      'merge pdf, combine pdf files, join pdf online, free pdf merger, pdf combiner, merge documents',
    howTo: [
      { title: 'Upload Your PDFs', description: 'Select or drag & drop two or more PDF documents into the upload zone.' },
      { title: 'Arrange Document Sequence', description: 'Reorder files into your desired page order.' },
      { title: 'Merge & Download', description: 'Click Process and instantly download your merged PDF document.' },
    ],
    features: [
      'Client-side execution: Files never leave your browser memory.',
      'Drag-and-drop sequencing for precise document ordering.',
      'No file size restrictions or hidden conversion limits.',
      'Preserves original document formatting, bookmarks, and vectors.',
    ],
    faqs: [
      {
        question: 'Is it safe to merge confidential documents here?',
        answer:
          'Yes. Merging executes locally inside your web browser via WebAssembly and JavaScript. Your files are never uploaded to any remote storage or database.',
      },
      {
        question: 'Can I reorder the files before combining?',
        answer: 'Yes, you can easily rearrange the order of uploaded documents before executing the merge.',
      },
      {
        question: 'How many PDF files can I merge at once?',
        answer: 'You can merge as many PDF files as your device memory can accommodate, with zero arbitrary paywalls.',
      },
    ],
  },
  'split-pdf': {
    title: 'Split PDF Online Free — Separate PDF Pages & Ranges | LosersPdf',
    description:
      'Split PDF documents into individual single pages or custom page ranges online. Download your separated files in a clean ZIP archive with complete privacy.',
    keywords:
      'split pdf, separate pdf pages, extract pages from pdf, cut pdf online, split pdf ranges free',
    howTo: [
      { title: 'Upload PDF Document', description: 'Choose the PDF file you wish to split into parts.' },
      { title: 'Choose Split Mode', description: 'Select "Split All Pages" or specify custom page ranges (e.g. 1-3, 4-6).' },
      { title: 'Download ZIP Archive', description: 'Click Process to generate and download a ZIP file containing your split pages.' },
    ],
    features: [
      'Split all pages into individual files or specify custom continuous ranges.',
      'Instant client-side compilation into a downloadable ZIP archive.',
      'Zero server storage: your sensitive pages remain on your device.',
      'Preserves hyperlinked text and high-resolution graphics.',
    ],
    faqs: [
      {
        question: 'Can I specify non-consecutive page ranges?',
        answer: 'Yes, you can specify custom ranges like "1-3, 5, 7-9" to extract exactly the pages you need.',
      },
      {
        question: 'How are the split pages delivered?',
        answer: 'Your separated PDF files are packaged into an uncompressed or lightweight ZIP archive for quick one-click download.',
      },
    ],
  },
  'remove-pdf-pages': {
    title: 'Remove PDF Pages Online Free — Delete Pages from PDF | LosersPdf',
    description:
      'Delete unwanted pages from any PDF document with an interactive visual thumbnail inspector. Fast, private, and free.',
    keywords:
      'remove pdf pages, delete pages from pdf, cut pdf pages online, discard pages pdf',
    howTo: [
      { title: 'Upload PDF', description: 'Select your PDF document to render interactive page previews.' },
      { title: 'Select Pages to Remove', description: 'Click the thumbnail of any page you want to delete.' },
      { title: 'Generate Clean Document', description: 'Download your trimmed PDF with unwanted pages permanently excluded.' },
    ],
    features: [
      'Visual thumbnail grid to inspect pages before deletion.',
      'Instant client-side processing without uploading document data.',
      'Preserves original page orientation and resolution.',
    ],
    faqs: [
      {
        question: 'Can I preview pages before deleting them?',
        answer: 'Yes, full page thumbnails are rendered in high fidelity so you can visually verify every page before removing it.',
      },
    ],
  },
  'extract-pdf-pages': {
    title: 'Extract PDF Pages Online Free — Save Selected Pages | LosersPdf',
    description:
      'Select and extract specific pages from your PDF file into a brand new document. Interactive visual grid, in-browser execution.',
    keywords:
      'extract pdf pages, pull pages from pdf, save specific pages pdf, export pdf selection',
    howTo: [
      { title: 'Upload PDF', description: 'Load your document to view all page thumbnails.' },
      { title: 'Checkmark Desired Pages', description: 'Click each page you want to keep in the new document.' },
      { title: 'Export Extracted PDF', description: 'Download the newly assembled PDF containing only your selected pages.' },
    ],
    features: [
      'Visual thumbnail selection for rapid page auditing.',
      '100% ephemeral in-memory processing.',
      'Output retains vector text sharpness and embedded media.',
    ],
    faqs: [
      {
        question: 'Does extracting pages modify my original file on disk?',
        answer: 'No. The original file remains completely untouched on your computer. A new PDF containing only the chosen pages is generated.',
      },
    ],
  },
  'organize-pdf-pages': {
    title: 'Organize PDF Pages Online Free — Reorder & Rotate Pages | LosersPdf',
    description:
      'Reorder, rotate, and sort PDF pages interactively. Drag-and-drop visual thumbnail grid with instant client-side rendering.',
    keywords:
      'organize pdf pages, reorder pdf, rotate pdf pages, sort pdf pages, arrange pdf',
    howTo: [
      { title: 'Upload PDF', description: 'Load your document to display interactive page cards.' },
      { title: 'Reorder & Rotate', description: 'Use arrows to shift pages left/right or rotate individual pages 90 degrees.' },
      { title: 'Save Organized PDF', description: 'Click Process to compile your newly organized document.' },
    ],
    features: [
      'Interactive visual canvas with page rotation controls.',
      'Move pages seamlessly in any sequence.',
      'Zero server upload: process runs directly in browser memory.',
    ],
    faqs: [
      {
        question: 'Can I rotate individual pages while organizing?',
        answer: 'Yes, each page tile features a rotate button to fix landscape or upside-down pages individually.',
      },
    ],
  },
  'rotate-pdf': {
    title: 'Rotate PDF Online Free — Turn PDF Pages 90°, 180° | LosersPdf',
    description:
      'Permanently rotate all pages or specific pages of your PDF 90° CW/CCW or 180°. Fast, free, and private.',
    keywords:
      'rotate pdf, turn pdf pages, rotate pdf online free, fix upside down pdf, orientation pdf',
    howTo: [
      { title: 'Select PDF', description: 'Upload the document you want to rotate.' },
      { title: 'Choose Rotation Angle', description: 'Select 90° Clockwise, 180°, or 270° Rotation.' },
      { title: 'Save Rotated PDF', description: 'Download the permanently re-oriented PDF.' },
    ],
    features: [
      'Rotate all pages uniformly with a single click.',
      'Fix scanned documents with wrong orientations permanently.',
      'Client-side computation ensures total document privacy.',
    ],
    faqs: [
      {
        question: 'Will rotating the PDF make it readable on all devices?',
        answer: 'Yes, the page rotation metadata is permanently written to the PDF structure, ensuring it renders correctly in Adobe Acrobat, browsers, and mobile readers.',
      },
    ],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Online Free — Convert Images to PDF Document | LosersPdf',
    description:
      'Convert JPG and JPEG photos into standardized PDF documents. Customize page margins and orientation with zero quality degradation.',
    keywords:
      'jpg to pdf, convert jpeg to pdf, image to pdf converter free, photos to pdf document',
    howTo: [
      { title: 'Upload JPG Photos', description: 'Select one or more JPG/JPEG images from your computer or phone.' },
      { title: 'Set Page Preferences', description: 'Choose orientation (portrait/landscape) and margin spacing.' },
      { title: 'Generate PDF', description: 'Click Process to download your combined PDF document.' },
    ],
    features: [
      'Supports high-resolution camera photos and smartphone scans.',
      'Automatic page fitting and margin alignment.',
      'Batch conversion of multiple images into a single file.',
    ],
    faqs: [
      {
        question: 'Can I combine multiple JPGs into one PDF?',
        answer: 'Yes, upload multiple JPGs and they will be sequentially compiled into a clean multi-page document.',
      },
    ],
  },
  'png-to-pdf': {
    title: 'PNG to PDF Online Free — Convert PNG Images to PDF | LosersPdf',
    description:
      'Convert PNG graphics and screenshots to high-resolution PDF documents. Preserves image transparency and sharp vector lines.',
    keywords:
      'png to pdf, convert png to pdf, turn png into pdf online, screenshot to pdf',
    howTo: [
      { title: 'Upload PNG Files', description: 'Choose the PNG images you want to convert.' },
      { title: 'Configure Layout', description: 'Preview page order and dimensions.' },
      { title: 'Download PDF', description: 'Instantly download your standardized PDF file.' },
    ],
    features: [
      'Preserves crisp text and diagrams from digital screenshots.',
      '100% private in-browser execution with zero data storage.',
      'Compatible with all modern PDF viewers and print workflows.',
    ],
    faqs: [
      {
        question: 'Does this compress or blur my PNG images?',
        answer: 'No. The conversion preserves the native pixel dimensions and color depth of your original PNG.',
      },
    ],
  },
  'word-to-pdf': {
    title: 'Word to PDF Online Free — Convert DOCX to PDF Document | LosersPdf',
    description:
      'Convert Microsoft Word (.docx) documents into standard PDFs. Preserves headings, fonts, formatting, and tables with ephemeral processing.',
    keywords:
      'word to pdf, docx to pdf, convert word document to pdf online free, doc to pdf converter',
    howTo: [
      { title: 'Upload Word Document', description: 'Select your .docx file.' },
      { title: 'Serverless In-Memory Conversion', description: 'Our ephemeral processing engine formats your document into standard PDF.' },
      { title: 'Download PDF', description: 'Retrieve your formatted PDF document immediately.' },
    ],
    features: [
      'Accurate conversion of headings, tables, bullet lists, and paragraphs.',
      'Zero database storage: temporary buffers are cleared immediately after processing.',
      'Standardized PDF output readable across all operating systems.',
    ],
    faqs: [
      {
        question: 'Are my Word documents stored on your servers?',
        answer: 'No. Conversions execute in isolated ephemeral RAM buffers and are completely wiped as soon as the download completes.',
      },
    ],
  },
  'excel-to-pdf': {
    title: 'Excel to PDF Online Free — Convert XLSX Spreadsheets to PDF | LosersPdf',
    description:
      'Convert Excel (.xlsx / .xls) workbooks and spreadsheets into clean, formatted multi-page PDF tables. High precision formatting.',
    keywords:
      'excel to pdf, xlsx to pdf, convert spreadsheet to pdf online, sheets to pdf',
    howTo: [
      { title: 'Upload Excel Sheet', description: 'Choose your .xlsx or .xls file.' },
      { title: 'Automatic Table Formatting', description: 'Columns and rows are aligned into printable landscape or portrait PDF pages.' },
      { title: 'Download PDF', description: 'Download your printable PDF spreadsheet report.' },
    ],
    features: [
      'Preserves grid lines, headers, and numeric cell formatting.',
      'Ephemeral server processing with instant buffer memory cleanup.',
      'Ready for printing or professional distribution.',
    ],
    faqs: [
      {
        question: 'Does it support multi-sheet Excel files?',
        answer: 'Yes, tables across workbook sheets are cleanly parsed and converted into readable PDF pages.',
      },
    ],
  },
  'powerpoint-to-pdf': {
    title: 'PowerPoint to PDF Online Free — Convert PPTX Slides to PDF | LosersPdf',
    description:
      'Convert PowerPoint (.pptx) presentation decks into clean, portable PDF slides. Preserves layout, slide titles, and formatting.',
    keywords:
      'powerpoint to pdf, pptx to pdf, convert presentation to pdf, slides to pdf',
    howTo: [
      { title: 'Upload Presentation', description: 'Select your PowerPoint .pptx deck.' },
      { title: 'Convert Slides', description: 'Each slide is compiled into a high-fidelity PDF page.' },
      { title: 'Download PDF Deck', description: 'Save the resulting PDF for easy sharing and presentation.' },
    ],
    features: [
      'Preserves slide dimensions, headings, bullet hierarchy, and shapes.',
      'No PowerPoint software license required.',
      'Strict zero-retention privacy policy.',
    ],
    faqs: [
      {
        question: 'Can the recipient view the PDF without PowerPoint installed?',
        answer: 'Yes, PDF documents can be opened in any web browser, mobile device, or PDF reader without needing Microsoft Office.',
      },
    ],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Online Free — Convert PDF Pages to Images | LosersPdf',
    description:
      'Extract every page of your PDF file into high-resolution JPG images. Download all converted pages in a convenient ZIP file.',
    keywords:
      'pdf to jpg, convert pdf to image, pdf to jpeg converter online, save pdf as jpg',
    howTo: [
      { title: 'Upload PDF', description: 'Select the document you want to extract images from.' },
      { title: 'In-Browser Rendering', description: 'Our canvas engine renders every page at crisp pixel resolution.' },
      { title: 'Download ZIP', description: 'Download a ZIP archive containing every page as a high-quality JPG.' },
    ],
    features: [
      'High DPI image rendering ensures sharp text legibility.',
      'Downloads as an organized ZIP archive of numbered images.',
      '100% private in-browser client-side rendering.',
    ],
    faqs: [
      {
        question: 'Can I extract single images or all pages?',
        answer: 'All pages are automatically rendered and packaged into a ZIP archive for easy access.',
      },
    ],
  },
  'pdf-to-png': {
    title: 'PDF to PNG Online Free — Lossless PDF Page Image Extraction | LosersPdf',
    description:
      'Convert PDF document pages into crisp, lossless PNG images. Perfect for graphic designers, digital publishing, and presentations.',
    keywords:
      'pdf to png, extract png from pdf, high resolution pdf to png, pdf image extraction',
    howTo: [
      { title: 'Upload PDF', description: 'Choose your document for PNG extraction.' },
      { title: 'Render Lossless Pages', description: 'High-definition rasterization captures every vector and font detail.' },
      { title: 'Download PNG ZIP', description: 'Download all pages as lossless PNG graphics.' },
    ],
    features: [
      'Lossless PNG compression prevents JPEG artifacting.',
      'Ideal for technical drawings, diagrams, and blueprints.',
      'Private in-browser compute: no server upload required.',
    ],
    faqs: [
      {
        question: 'Why choose PNG over JPG for PDF conversion?',
        answer: 'PNG uses lossless compression, which preserves razor-sharp text, line art, and transparent overlays without compression noise.',
      },
    ],
  },
  'pdf-to-word': {
    title: 'PDF to Word Online Free — Convert PDF to DOCX Document | LosersPdf',
    description:
      'Convert PDF pages and text streams into editable Microsoft Word (.docx) files. Fast, private, and accurate document conversion.',
    keywords:
      'pdf to word, convert pdf to docx, editable word from pdf, pdf to doc online free',
    howTo: [
      { title: 'Upload PDF', description: 'Select your PDF document.' },
      { title: 'Extract Text & Layout', description: 'Our engine extracts text blocks and formats them into Word paragraphs.' },
      { title: 'Download .DOCX', description: 'Open and edit the converted document directly in Microsoft Word or Google Docs.' },
    ],
    features: [
      'Generates genuine .docx format files editable in MS Word, LibreOffice, and Google Docs.',
      'Ephemeral conversion buffer wiped immediately after execution.',
      'No registration, subscriptions, or watermarks.',
    ],
    faqs: [
      {
        question: 'Can I edit the converted file in Google Docs?',
        answer: 'Yes, the generated .docx file is fully standard and can be opened or edited in Google Docs, Word 365, and Apple Pages.',
      },
    ],
  },
  'pdf-to-powerpoint': {
    title: 'PDF to PowerPoint Online Free — Convert PDF to PPTX Slides | LosersPdf',
    description:
      'Convert PDF documents into editable Microsoft PowerPoint (.pptx) slides. Each page becomes a distinct slide with title and content.',
    keywords:
      'pdf to powerpoint, convert pdf to pptx, turn pdf into slides, pdf presentation converter',
    howTo: [
      { title: 'Upload PDF', description: 'Select the PDF document containing slides.' },
      { title: 'Generate Presentation', description: 'Each PDF page is converted into a structured PowerPoint slide.' },
      { title: 'Download .PPTX', description: 'Download and present your new PowerPoint presentation.' },
    ],
    features: [
      'Preserves 16:9 widescreen or 4:3 slide format.',
      'Exports authentic .pptx presentations.',
      'Private, zero-log processing guarantee.',
    ],
    faqs: [
      {
        question: 'Are slide images preserved?',
        answer: 'Yes, page visuals and extracted textual elements are structured into individual presentation slides.',
      },
    ],
  },
  'edit-pdf': {
    title: 'Edit PDF Online Free — Add Text, Highlights & Shapes | LosersPdf',
    description:
      'Free in-browser PDF editor to add custom text annotations, highlighter boxes, rectangles, and notes without software installation.',
    keywords:
      'edit pdf online, annotate pdf, add text to pdf, highlight pdf, free pdf editor',
    howTo: [
      { title: 'Upload Document', description: 'Open your PDF inside the interactive canvas editor.' },
      { title: 'Choose Annotation Tool', description: 'Select Add Text, Highlighter, or Rectangle Box.' },
      { title: 'Stamp & Download', description: 'Click anywhere on the document page to place annotations and download the updated PDF.' },
    ],
    features: [
      'Interactive canvas preview with multi-page navigation.',
      'Customizable text font size, colors, and positioning.',
      '100% private in-browser canvas execution: no files sent to any server.',
    ],
    faqs: [
      {
        question: 'Do I need to install any software or plugins?',
        answer: 'No. The entire editor runs natively inside your web browser using HTML5 Canvas and JavaScript.',
      },
    ],
  },
  'add-page-numbers': {
    title: 'Add Page Numbers to PDF Online Free — Number PDF Pages | LosersPdf',
    description:
      'Stamp customizable page numbers onto your PDF documents. Select custom format ("Page X of Y"), placement positions, and typography.',
    keywords:
      'add page numbers to pdf, number pdf pages online, stamp page numbers pdf, paginate pdf',
    howTo: [
      { title: 'Upload PDF', description: 'Select the PDF document you want to paginate.' },
      { title: 'Configure Numbering', description: 'Choose position (bottom right, bottom center, etc.) and format.' },
      { title: 'Stamp Numbers', description: 'Click Process to stamp permanent page numbers throughout the document.' },
    ],
    features: [
      'Customizable format: "1, 2, 3" or "Page X of Y".',
      'Configurable typography and alignment positions.',
      'Instant client-side stamping with zero privacy compromises.',
    ],
    faqs: [
      {
        question: 'Can I choose where page numbers appear?',
        answer: 'Yes, you can place numbers at the bottom right, bottom center, bottom left, or top margins.',
      },
    ],
  },
  'watermark-pdf': {
    title: 'Watermark PDF Online Free — Add Text Watermarks to PDF | LosersPdf',
    description:
      'Stamp custom text watermarks onto all pages of your PDF. Customize text, angle, opacity, color, and font size.',
    keywords:
      'watermark pdf, add watermark to pdf, stamp confidential on pdf, draft watermark online',
    howTo: [
      { title: 'Upload Document', description: 'Choose your PDF file.' },
      { title: 'Customize Watermark', description: 'Enter text (e.g. CONFIDENTIAL, DRAFT), angle, font size, and opacity.' },
      { title: 'Download Watermarked PDF', description: 'Download your protected, branded document.' },
    ],
    features: [
      'Customizable text string, opacity, angle (e.g. 45° diagonal), and color.',
      'Stamps across all document pages automatically.',
      'Processes in-memory on client side with complete confidentiality.',
    ],
    faqs: [
      {
        question: 'Will the watermark obscure the text beneath it?',
        answer: 'No, you can adjust the opacity slider so text beneath the watermark remains completely readable.',
      },
    ],
  },
  'protect-pdf': {
    title: 'Protect PDF with Password Online Free — Encrypt PDF | LosersPdf',
    description:
      'Encrypt your PDF documents with AES password protection. Restrict unauthorized opening, viewing, and printing.',
    keywords:
      'protect pdf, encrypt pdf with password, lock pdf online free, secure pdf document',
    howTo: [
      { title: 'Upload PDF', description: 'Select the file you want to password protect.' },
      { title: 'Enter Secure Password', description: 'Type the password required to open the document.' },
      { title: 'Download Encrypted PDF', description: 'Save the locked document.' },
    ],
    features: [
      'Military-grade standard AES password encryption.',
      'Requires password entry in Adobe Acrobat and all standard PDF readers.',
      'Ephemeral server processing: password and document are discarded instantly.',
    ],
    faqs: [
      {
        question: 'Do you store or remember my password?',
        answer: 'Never. Processing is strictly stateless and ephemeral; passwords and files are immediately erased from memory.',
      },
    ],
  },
  'unlock-pdf': {
    title: 'Unlock PDF Online Free — Remove Password from PDF | LosersPdf',
    description:
      'Decrypt and remove password security restrictions from protected PDF files. Fast, private, and in-memory processing.',
    keywords:
      'unlock pdf, remove password from pdf, decrypt pdf online, remove security pdf',
    howTo: [
      { title: 'Upload Locked PDF', description: 'Choose your password-protected PDF.' },
      { title: 'Enter Current Password', description: 'Provide the document password to authorize decryption.' },
      { title: 'Download Unlocked PDF', description: 'Download a clean, unlocked PDF that opens freely.' },
    ],
    features: [
      'Permanently removes password requirements from authorized documents.',
      'Instant conversion with no watermark or file size penalties.',
      'Zero database storage.',
    ],
    faqs: [
      {
        question: 'Do I need to know the password to unlock the document?',
        answer: 'Yes, entering the valid password ensures authorized decryption and permanently strips the password requirement for future access.',
      },
    ],
  },
  'sign-pdf': {
    title: 'Sign PDF Online Free — Draw or Type Digital Signatures | LosersPdf',
    description:
      'Sign PDF documents electronically online. Draw your signature or type with cursive calligraphy, place on target pages, and download.',
    keywords:
      'sign pdf online, electronic signature pdf, digital sign pdf free, e-sign documents',
    howTo: [
      { title: 'Upload Document', description: 'Load the contract, NDA, or form to be signed.' },
      { title: 'Create Signature', description: 'Draw with mouse/touch or type your name in elegant cursive script.' },
      { title: 'Position & Download', description: 'Stamp the signature on your chosen page and download.' },
    ],
    features: [
      'Interactive touch and mouse drawing canvas with black and blue ink colors.',
      'Cursive calligraphy typewriter option for instant signatures.',
      '100% private: signature and document never leave your device.',
    ],
    faqs: [
      {
        question: 'Is my digital signature saved anywhere?',
        answer: 'No. The signature is rendered directly into the PDF in your browser memory and is never saved to any database.',
      },
    ],
  },
  'compress-image': {
    title: 'Compress Image Online Free — Reduce JPG, PNG, WebP Size | LosersPdf',
    description:
      'Intelligently compress JPG, PNG, and WebP images with a real-time quality slider and savings percentage calculator. 100% in-browser.',
    keywords:
      'compress image, reduce image size, image compressor online free, optimize jpg png, shrink photos',
    howTo: [
      { title: 'Select Images', description: 'Upload one or more JPG, PNG, or WebP files.' },
      { title: 'Adjust Quality Slider', description: 'Fine-tune the compression level (e.g. 75% default for optimal web balance).' },
      { title: 'Download Optimized Images', description: 'Save your compressed files with up to 80% file size reduction.' },
    ],
    features: [
      'Interactive quality slider with real-time file size savings indicator.',
      'Supports JPG, PNG, and WebP formats.',
      'In-browser compression: lightning-fast and 100% private.',
    ],
    faqs: [
      {
        question: 'How much file size can I save?',
        answer: 'Most photos can be reduced by 60% to 85% in size without noticeable loss of visual quality on screens.',
      },
    ],
  },
  'resize-image': {
    title: 'Resize Image Online Free — Scale Image Dimensions | LosersPdf',
    description:
      'Resize image dimensions by exact pixels or percentage presets with aspect ratio lock. Fast in-browser canvas scaling.',
    keywords:
      'resize image, scale image online, change image dimensions pixels, photo resizer free',
    howTo: [
      { title: 'Upload Image', description: 'Choose your photo or graphic.' },
      { title: 'Set Width & Height', description: 'Input target dimensions or use percentage shortcuts (25%, 50%, 75%).' },
      { title: 'Download Resized Image', description: 'Retrieve your resized file instantly.' },
    ],
    features: [
      'Aspect ratio lock preserves image proportions automatically.',
      'High-quality bicubic canvas interpolation.',
      'Client-side execution with zero upload time.',
    ],
    faqs: [
      {
        question: 'Will resizing stretch or distort my image?',
        answer: 'Not if you keep the "Lock Aspect Ratio" toggle checked; changing width automatically adjusts height proportionately.',
      },
    ],
  },
  'crop-image': {
    title: 'Crop Image Online Free — Crop Photos & Graphics | LosersPdf',
    description:
      'Interactive visual crop box with aspect ratio presets (1:1 square, 16:9 widescreen, 4:3, freeform). Trim unwanted image margins.',
    keywords:
      'crop image online, photo cropper, trim image free, cut photo margins',
    howTo: [
      { title: 'Upload Photo', description: 'Load the image you want to crop.' },
      { title: 'Adjust Crop Box', description: 'Drag crop handles or select an aspect ratio preset.' },
      { title: 'Export Cropped Image', description: 'Download your clean, cropped image.' },
    ],
    features: [
      'Interactive visual crop overlay with rule-of-thirds grid lines.',
      'One-click aspect ratio presets: 1:1, 16:9, 4:3, and freeform.',
      '100% private in-browser processing.',
    ],
    faqs: [
      {
        question: 'Can I crop images for social media profile pictures?',
        answer: 'Yes! The 1:1 aspect ratio preset is specifically designed for avatar and profile picture cropping.',
      },
    ],
  },
  'rotate-image': {
    title: 'Rotate & Flip Image Online Free — 90° CW/CCW & Mirror | LosersPdf',
    description:
      'Rotate photos 90° clockwise or counter-clockwise, and flip horizontally or vertically with instant live preview.',
    keywords:
      'rotate image, flip image horizontal, mirror photo online, turn picture 90 degrees',
    howTo: [
      { title: 'Upload Image', description: 'Select the image file to re-orient.' },
      { title: 'Rotate or Flip', description: 'Click 90° CW, 90° CCW, Flip Horizontal, or Flip Vertical.' },
      { title: 'Download Image', description: 'Download your permanently oriented photo.' },
    ],
    features: [
      'Instant live preview of rotation and mirroring transformations.',
      'Lossless pixel rearrangement.',
      'Fast client-side canvas rendering.',
    ],
    faqs: [
      {
        question: 'Can I flip an image like a mirror?',
        answer: 'Yes, click "Flip Horizontal" to create an exact mirror-image reflection of your photo.',
      },
    ],
  },
  'jpg-to-png': {
    title: 'JPG to PNG Online Free — Convert JPEG to Lossless PNG | LosersPdf',
    description:
      'Convert JPG and JPEG images into lossless PNG format directly in your browser. Fast, private, with zero upload lag.',
    keywords:
      'jpg to png, convert jpeg to png, turn jpg into png free, image format converter',
    howTo: [
      { title: 'Upload JPG', description: 'Choose your JPEG image file.' },
      { title: 'In-Browser Conversion', description: 'Image is decoded and re-encoded into PNG format in memory.' },
      { title: 'Download PNG', description: 'Save your clean PNG file.' },
    ],
    features: [
      'Lossless PNG encoding.',
      'Zero server roundtrip: converts instantly on your device.',
      'No email required, no watermarks.',
    ],
    faqs: [
      {
        question: 'Why convert JPG to PNG?',
        answer: 'Converting to PNG prevents further generational loss when editing or re-saving images in graphic design applications.',
      },
    ],
  },
  'png-to-jpg': {
    title: 'PNG to JPG Online Free — Convert PNG to JPEG with Custom BG | LosersPdf',
    description:
      'Convert PNG images to JPG with automatic background transparency flattening and customizable background color.',
    keywords:
      'png to jpg, convert transparent png to jpg, png to jpeg converter, flatten png transparency',
    howTo: [
      { title: 'Upload PNG', description: 'Select your PNG file with or without transparency.' },
      { title: 'Choose Background Color', description: 'Select background fill color (white by default) to flatten transparent pixels.' },
      { title: 'Download JPG', description: 'Download your optimized JPG photo.' },
    ],
    features: [
      'Customizable background fill color for transparent areas.',
      'Reduces file size substantially for web distribution.',
      'Private in-browser canvas execution.',
    ],
    faqs: [
      {
        question: 'What happens to transparent backgrounds when converting to JPG?',
        answer: 'Because the JPG format does not support transparency, transparent areas are cleanly filled with your selected background color (white by default).',
      },
    ],
  },
  'image-to-pdf': {
    title: 'Image to PDF Online Free — Combine Photos into PDF | LosersPdf',
    description:
      'Combine multiple mixed image files (JPG, PNG, WebP) into a single unified PDF document. Reorder pages and select orientation.',
    keywords:
      'image to pdf, photos to pdf, combine images into pdf document, convert pictures to pdf',
    howTo: [
      { title: 'Select Images', description: 'Upload multiple JPG, PNG, or WebP graphics.' },
      { title: 'Set Page Layout', description: 'Adjust page orientation and sequence.' },
      { title: 'Download PDF', description: 'Download your combined multi-page document.' },
    ],
    features: [
      'Accepts mixed file types (JPG, PNG, and WebP together).',
      'Drag-and-drop page sequencing.',
      'Completely client-side in-memory compilation.',
    ],
    faqs: [
      {
        question: 'Can I combine images with different dimensions?',
        answer: 'Yes, each image is proportionately scaled to fit onto standard PDF pages without distortion.',
      },
    ],
  },
  'pdf-to-image': {
    title: 'PDF to Image Online Free — Universal PDF to JPG/PNG Converter | LosersPdf',
    description:
      'Universal PDF to Image converter. Convert PDF documents to high-resolution JPG or PNG images with DPI quality controls.',
    keywords:
      'pdf to image, convert pdf pages to photos, export pdf to jpg png, document to image converter',
    howTo: [
      { title: 'Upload PDF', description: 'Choose your document.' },
      { title: 'Select Format & Resolution', description: 'Pick JPG or PNG and select resolution quality.' },
      { title: 'Download ZIP Archive', description: 'Download all rendered pages packaged in a ZIP archive.' },
    ],
    features: [
      'Universal output selector: exports as JPG or PNG.',
      'High-definition DPI rendering for maximum text clarity.',
      'Packaged into a single organized ZIP download.',
    ],
    faqs: [
      {
        question: 'Does this work on multi-page PDF documents?',
        answer: 'Yes! Every page is rendered and named sequentially (e.g. page-1.png, page-2.png) inside a downloadable ZIP archive.',
      },
    ],
  },
};

/**
 * Updates document title, meta tags, Open Graph, Twitter Cards, canonical URL,
 * and injects Schema.org JSON-LD structured data into document.head.
 */
export function updateSeoMetadata(config: {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogType?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}) {
  if (typeof document === 'undefined') return;

  // 1. Update Title
  document.title = config.title;

  // 2. Helper to set or create meta tag
  const setMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
    let el = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attribute, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Set standard SEO meta
  setMeta('description', config.description);
  if (config.keywords) {
    setMeta('keywords', config.keywords);
  }
  setMeta('robots', 'index, follow');

  // 4. Open Graph
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://loserspdf.vercel.app';
  const fullUrl = config.canonical.startsWith('http') ? config.canonical : `${origin}${config.canonical}`;

  setMeta('og:title', config.title, 'property');
  setMeta('og:description', config.description, 'property');
  setMeta('og:url', fullUrl, 'property');
  setMeta('og:type', config.ogType || 'website', 'property');
  setMeta('og:site_name', 'LosersPdf', 'property');

  // 5. Twitter Card
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', config.title);
  setMeta('twitter:description', config.description);

  // 6. Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullUrl);

  // 7. JSON-LD Structured Data
  let scriptEl = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'seo-json-ld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  if (config.jsonLd) {
    scriptEl.textContent = JSON.stringify(config.jsonLd);
  } else {
    scriptEl.textContent = '';
  }
}

/**
 * Generate Schema.org structured data for an individual tool.
 */
export function generateToolJsonLd(tool: ToolDefinition, seo: ToolSeoMetadata, origin: string) {
  const toolUrl = `${origin}${tool.route}`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${tool.name} — LosersPdf`,
    url: toolUrl,
    description: seo.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: seo.features,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: origin,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category === 'pdf' ? 'PDF Tools' : 'Image Tools',
        item: `${origin}/${tool.category === 'pdf' ? 'pdf-tools' : 'image-tools'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.name} online`,
    description: `Step-by-step instructions to use ${tool.name} on LosersPdf.`,
    step: seo.howTo.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };

  return [webAppSchema, breadcrumbSchema, faqSchema, howToSchema];
}

/**
 * Generate Schema.org structured data for the Home Page.
 */
export function generateHomeJsonLd(origin: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'LosersPdf',
      url: origin,
      description: HOME_SEO_DATA.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LosersPdf',
      url: origin,
      logo: `${origin}/favicon.svg`,
      description: 'Zero-database ephemeral PDF and image utility platform.',
    },
  ];
}

/**
 * Generate Schema.org structured data for a Category Page.
 */
export function generateCategoryJsonLd(category: ToolCategory, origin: string) {
  const categoryData = CATEGORY_SEO_DATA[category];
  const categoryUrl = `${origin}${categoryData.canonical}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: categoryData.title,
      url: categoryUrl,
      description: categoryData.description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category === 'pdf' ? 'PDF Tools' : 'Image Tools',
          item: categoryUrl,
        },
      ],
    },
  ];
}
