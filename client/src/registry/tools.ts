import {
  FileText,
  Files,
  Scissors,
  Trash2,
  FolderOutput,
  LayoutGrid,
  FileImage,
  Image as ImageIcon,
  FileType,
  FileSpreadsheet,
  Presentation,
  Edit3,
  RotateCw,
  Hash,
  Stamp,
  Lock,
  Unlock,
  PenTool,
  Minimize2,
  Maximize2,
  Crop,
  Layers,
  ArrowRightLeft,
  type LucideIcon
} from 'lucide-react';

export type ToolCategory = 'pdf' | 'image';

export type ToolSubcategory = 
  | 'organize' 
  | 'convert-to-pdf' 
  | 'convert-from-pdf' 
  | 'edit-annotate' 
  | 'security'
  | 'optimize'
  | 'image-edit'
  | 'image-convert';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  subcategory: ToolSubcategory;
  subcategoryLabel: string;
  description: string;
  detailedDescription: string;
  iconName: string;
  icon: LucideIcon;
  route: string;
  acceptedFormats: string[]; // e.g. ['.pdf'], ['.jpg', '.png']
  acceptedMimeTypes: string[];
  outputFormat: string; // e.g. 'pdf', 'zip', 'docx', 'jpg', 'png', etc.
  multipleFiles: boolean;
  processingMethod: 'client' | 'server';
  popular?: boolean;
  badge?: string;
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // ---------------------------------------------------------
  // PDF TOOLS (21)
  // ---------------------------------------------------------
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    subcategory: 'organize',
    subcategoryLabel: 'Organize',
    description: 'Combine multiple PDF documents into a single unified file in seconds.',
    detailedDescription: 'Upload two or more PDF files, drag and drop to reorder their sequence, and merge them into one seamless document.',
    iconName: 'Files',
    icon: Files,
    route: '/merge-pdf',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: true,
    processingMethod: 'client',
    popular: true,
    badge: 'Popular'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf',
    subcategory: 'organize',
    subcategoryLabel: 'Organize',
    description: 'Separate one PDF into individual pages or custom page ranges.',
    detailedDescription: 'Split your document by specifying page ranges (e.g. 1-3, 4-6) or extract all single pages as a ZIP archive.',
    iconName: 'Scissors',
    icon: Scissors,
    route: '/split-pdf',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'zip',
    multipleFiles: false,
    processingMethod: 'client',
    popular: true
  },
  {
    id: 'remove-pdf-pages',
    name: 'Remove PDF Pages',
    category: 'pdf',
    subcategory: 'organize',
    subcategoryLabel: 'Organize',
    description: 'Delete unwanted or blank pages from your PDF file effortlessly.',
    detailedDescription: 'Select pages to delete visually or enter page numbers to strip out unwanted content and produce a clean document.',
    iconName: 'Trash2',
    icon: Trash2,
    route: '/remove-pdf-pages',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    category: 'pdf',
    subcategory: 'organize',
    subcategoryLabel: 'Organize',
    description: 'Extract specific pages or page ranges into a brand new PDF.',
    detailedDescription: 'Pick the exact pages you need (e.g. 1, 3, 5-8) to instantly generate a targeted new PDF document.',
    iconName: 'FolderOutput',
    icon: FolderOutput,
    route: '/extract-pdf-pages',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'organize-pdf-pages',
    name: 'Organize PDF Pages',
    category: 'pdf',
    subcategory: 'organize',
    subcategoryLabel: 'Organize',
    description: 'Reorder, rotate, duplicate, or delete pages in an interactive grid.',
    detailedDescription: 'Visually rearrange your document with intuitive drag-and-drop page tiles, page rotation, and one-click removal.',
    iconName: 'LayoutGrid',
    icon: LayoutGrid,
    route: '/organize-pdf-pages',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'client',
    popular: true
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf',
    subcategory: 'organize',
    subcategoryLabel: 'Organize',
    description: 'Rotate PDF pages 90, 180, or 270 degrees clockwise or counterclockwise.',
    detailedDescription: 'Fix orientation for all pages at once or rotate individual pages to ensure your document reads upright.',
    iconName: 'RotateCw',
    icon: RotateCw,
    route: '/rotate-pdf',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf',
    subcategory: 'convert-to-pdf',
    subcategoryLabel: 'Convert to PDF',
    description: 'Convert JPG photos and graphics into high-quality PDF documents.',
    detailedDescription: 'Transform one or more JPG images into a crisp PDF with customizable page orientation, margins, and fit options.',
    iconName: 'FileImage',
    icon: FileImage,
    route: '/jpg-to-pdf',
    acceptedFormats: ['.jpg', '.jpeg'],
    acceptedMimeTypes: ['image/jpeg'],
    outputFormat: 'pdf',
    multipleFiles: true,
    processingMethod: 'client',
    popular: true
  },
  {
    id: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'pdf',
    subcategory: 'convert-to-pdf',
    subcategoryLabel: 'Convert to PDF',
    description: 'Convert PNG graphics and screenshots with transparency into PDF.',
    detailedDescription: 'Combine PNG images into a clean PDF with proper page fitting and optional page sizing.',
    iconName: 'ImageIcon',
    icon: ImageIcon,
    route: '/png-to-pdf',
    acceptedFormats: ['.png'],
    acceptedMimeTypes: ['image/png'],
    outputFormat: 'pdf',
    multipleFiles: true,
    processingMethod: 'client'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'pdf',
    subcategory: 'convert-to-pdf',
    subcategoryLabel: 'Convert to PDF',
    description: 'Convert Microsoft Word (.docx) documents into standard PDF files.',
    detailedDescription: 'Turn Word documents into clean, portable PDFs maintaining paragraph styles, headings, and data tables.',
    iconName: 'FileType',
    icon: FileType,
    route: '/word-to-pdf',
    acceptedFormats: ['.docx'],
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'server',
    popular: true,
    badge: 'Converter'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    category: 'pdf',
    subcategory: 'convert-to-pdf',
    subcategoryLabel: 'Convert to PDF',
    description: 'Convert Excel (.xlsx) spreadsheets into formatted landscape PDF tables.',
    detailedDescription: 'Render spreadsheet worksheets into beautiful, easily printable PDF tables with column formatting.',
    iconName: 'FileSpreadsheet',
    icon: FileSpreadsheet,
    route: '/excel-to-pdf',
    acceptedFormats: ['.xlsx', '.xls'],
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'server'
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    category: 'pdf',
    subcategory: 'convert-to-pdf',
    subcategoryLabel: 'Convert to PDF',
    description: 'Convert PowerPoint (.pptx) presentation decks into PDF slides.',
    detailedDescription: 'Transform your PowerPoint presentation into a presentation-ready PDF document.',
    iconName: 'Presentation',
    icon: Presentation,
    route: '/powerpoint-to-pdf',
    acceptedFormats: ['.pptx'],
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'server'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    subcategory: 'convert-from-pdf',
    subcategoryLabel: 'Convert from PDF',
    description: 'Extract and convert every PDF page into high-resolution JPG images.',
    detailedDescription: 'Render every page of your PDF into high-clarity JPG images, packaged into a neat ZIP archive or single download.',
    iconName: 'FileImage',
    icon: FileImage,
    route: '/pdf-to-jpg',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'zip',
    multipleFiles: false,
    processingMethod: 'client',
    popular: true
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'pdf',
    subcategory: 'convert-from-pdf',
    subcategoryLabel: 'Convert from PDF',
    description: 'Convert PDF pages into crystal-clear lossless PNG images.',
    detailedDescription: 'Extract full-resolution PNG images from each page with sharp text rendering and high fidelity.',
    iconName: 'ImageIcon',
    icon: ImageIcon,
    route: '/pdf-to-png',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'zip',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'pdf',
    subcategory: 'convert-from-pdf',
    subcategoryLabel: 'Convert from PDF',
    description: 'Convert PDF files into fully editable Microsoft Word (.docx) documents.',
    detailedDescription: 'Extract layout, text streams, and structure from your PDF into an editable Word document.',
    iconName: 'FileType',
    icon: FileType,
    route: '/pdf-to-word',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'docx',
    multipleFiles: false,
    processingMethod: 'server',
    popular: true,
    badge: 'Popular'
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    category: 'pdf',
    subcategory: 'convert-from-pdf',
    subcategoryLabel: 'Convert from PDF',
    description: 'Convert PDF document pages into Microsoft PowerPoint (.pptx) slides.',
    detailedDescription: 'Create presentation slides directly from PDF document pages with structured slide layouts.',
    iconName: 'Presentation',
    icon: Presentation,
    route: '/pdf-to-powerpoint',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pptx',
    multipleFiles: false,
    processingMethod: 'server'
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    category: 'pdf',
    subcategory: 'edit-annotate',
    subcategoryLabel: 'Edit & Annotate',
    description: 'Add text, drawings, highlights, and annotations directly onto PDF pages.',
    detailedDescription: 'Interactive canvas editor: place text notes, draw with freehand pen, add highlight boxes, and burn edits to PDF.',
    iconName: 'Edit3',
    icon: Edit3,
    route: '/edit-pdf',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'client',
    badge: 'Editor'
  },
  {
    id: 'add-page-numbers',
    name: 'Add Page Numbers',
    category: 'pdf',
    subcategory: 'edit-annotate',
    subcategoryLabel: 'Edit & Annotate',
    description: 'Insert customizable page numbers and labels across your document.',
    detailedDescription: 'Position page numbers (bottom-center, bottom-right, header) with custom formats (e.g. "Page {n} of {total}" or "{n}").',
    iconName: 'Hash',
    icon: Hash,
    route: '/add-page-numbers',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'pdf',
    subcategory: 'edit-annotate',
    subcategoryLabel: 'Edit & Annotate',
    description: 'Stamp custom text or image watermarks with adjustable opacity and angle.',
    detailedDescription: 'Protect your documents with diagonal or centered watermarks ("CONFIDENTIAL", "DRAFT", copyright, or company name).',
    iconName: 'Stamp',
    icon: Stamp,
    route: '/watermark-pdf',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF with Password',
    category: 'pdf',
    subcategory: 'security',
    subcategoryLabel: 'Security',
    description: 'Encrypt your PDF with military-grade AES password protection.',
    detailedDescription: 'Lock sensitive documents with custom user passwords so only authorized users can open and view them.',
    iconName: 'Lock',
    icon: Lock,
    route: '/protect-pdf',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'server',
    badge: 'Security'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'pdf',
    subcategory: 'security',
    subcategoryLabel: 'Security',
    description: 'Remove password protection from encrypted PDF documents.',
    detailedDescription: 'Unlock and remove password restrictions from your secured PDF files after entering the valid password.',
    iconName: 'Unlock',
    icon: Unlock,
    route: '/unlock-pdf',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'server'
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    category: 'pdf',
    subcategory: 'edit-annotate',
    subcategoryLabel: 'Edit & Annotate',
    description: 'Draw or type your digital signature and place it on any PDF page.',
    detailedDescription: 'Sign contracts, NDAs, and forms: draw with mouse/touch or type your name, position and resize on target pages.',
    iconName: 'PenTool',
    icon: PenTool,
    route: '/sign-pdf',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'pdf',
    multipleFiles: false,
    processingMethod: 'client',
    popular: true,
    badge: 'Popular'
  },

  // ---------------------------------------------------------
  // IMAGE TOOLS (8)
  // ---------------------------------------------------------
  {
    id: 'compress-image',
    name: 'Compress Image',
    category: 'image',
    subcategory: 'optimize',
    subcategoryLabel: 'Optimize',
    description: 'Reduce image file size with intelligent quality preservation.',
    detailedDescription: 'Compress JPG, PNG, and WebP images with real-time compression slider and instant file size savings calculation.',
    iconName: 'Minimize2',
    icon: Minimize2,
    route: '/compress-image',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputFormat: 'image',
    multipleFiles: false,
    processingMethod: 'client',
    popular: true,
    badge: 'Popular'
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    category: 'image',
    subcategory: 'optimize',
    subcategoryLabel: 'Optimize',
    description: 'Scale image dimensions by pixels or percentages with aspect ratio lock.',
    detailedDescription: 'Set custom width and height or choose quick presets (25%, 50%, 75%, 200%) while preserving sharp details.',
    iconName: 'Maximize2',
    icon: Maximize2,
    route: '/resize-image',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputFormat: 'image',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    category: 'image',
    subcategory: 'image-edit',
    subcategoryLabel: 'Editing',
    description: 'Trim and cut images with preset aspect ratios or custom freeform crop.',
    detailedDescription: 'Interactive visual crop box with popular ratios (1:1 Square, 16:9 Landscape, 4:3 Standard) and freeform framing.',
    iconName: 'Crop',
    icon: Crop,
    route: '/crop-image',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputFormat: 'image',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'rotate-image',
    name: 'Rotate Image',
    category: 'image',
    subcategory: 'image-edit',
    subcategoryLabel: 'Editing',
    description: 'Rotate images by 90-degree steps or flip horizontally and vertically.',
    detailedDescription: 'Quickly adjust orientation, flip upside-down images, or mirror graphics with instant preview.',
    iconName: 'RotateCw',
    icon: RotateCw,
    route: '/rotate-image',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputFormat: 'image',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    category: 'image',
    subcategory: 'image-convert',
    subcategoryLabel: 'Conversion',
    description: 'Convert JPG photos into lossless, clean PNG format graphics.',
    detailedDescription: 'Instant in-browser conversion from JPEG to PNG with zero quality loss and full color depth.',
    iconName: 'ArrowRightLeft',
    icon: ArrowRightLeft,
    route: '/jpg-to-png',
    acceptedFormats: ['.jpg', '.jpeg'],
    acceptedMimeTypes: ['image/jpeg'],
    outputFormat: 'png',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    category: 'image',
    subcategory: 'image-convert',
    subcategoryLabel: 'Conversion',
    description: 'Convert PNG graphics to optimized JPG with white background fill.',
    detailedDescription: 'Convert PNG images with transparency handling, smooth background flattening, and adjustable JPEG quality.',
    iconName: 'ArrowRightLeft',
    icon: ArrowRightLeft,
    route: '/png-to-jpg',
    acceptedFormats: ['.png'],
    acceptedMimeTypes: ['image/png'],
    outputFormat: 'jpg',
    multipleFiles: false,
    processingMethod: 'client'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    category: 'image',
    subcategory: 'image-convert',
    subcategoryLabel: 'Conversion',
    description: 'Convert multiple images (JPG, PNG, WebP) into a single PDF document.',
    detailedDescription: 'Upload multiple mixed image formats, arrange page order, select page orientation (portrait/landscape), and export PDF.',
    iconName: 'Layers',
    icon: Layers,
    route: '/image-to-pdf',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputFormat: 'pdf',
    multipleFiles: true,
    processingMethod: 'client',
    popular: true,
    badge: 'Popular'
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    category: 'image',
    subcategory: 'image-convert',
    subcategoryLabel: 'Conversion',
    description: 'Convert PDF document pages into high-definition images (JPG or PNG).',
    detailedDescription: 'Choose preferred output format (JPG or PNG), select resolution quality, and download all pages in a ZIP archive.',
    iconName: 'FileImage',
    icon: FileImage,
    route: '/pdf-to-image',
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    outputFormat: 'zip',
    multipleFiles: false,
    processingMethod: 'client',
    popular: true
  }
];

// Helper functions derived STRICTLY from TOOLS_REGISTRY (Single Source of Truth)

export const getTotalToolsCount = (): number => TOOLS_REGISTRY.length;

export const getPdfToolsCount = (): number => 
  TOOLS_REGISTRY.filter(t => t.category === 'pdf').length;

export const getImageToolsCount = (): number => 
  TOOLS_REGISTRY.filter(t => t.category === 'image').length;

export const getToolsByCategory = (category: ToolCategory): ToolDefinition[] => 
  TOOLS_REGISTRY.filter(t => t.category === category);

export const getPopularTools = (): ToolDefinition[] => 
  TOOLS_REGISTRY.filter(t => t.popular);

export const getToolById = (id: string): ToolDefinition | undefined => 
  TOOLS_REGISTRY.find(t => t.id === id);

const ROUTE_ALIASES: Record<string, string> = {
  '/compress-pdf': '/compress-image',
  '/pdf-to-excel': '/excel-to-pdf',
};

export const getToolByRoute = (route: string): ToolDefinition | undefined => {
  let cleanRoute = route.startsWith('/') ? route : `/${route}`;
  if (cleanRoute.length > 1 && cleanRoute.endsWith('/')) {
    cleanRoute = cleanRoute.slice(0, -1);
  }
  const targetRoute = ROUTE_ALIASES[cleanRoute] || cleanRoute;
  return TOOLS_REGISTRY.find(t => t.route === targetRoute);
};

export const searchTools = (query: string): ToolDefinition[] => {
  if (!query || !query.trim()) return TOOLS_REGISTRY;
  const q = query.toLowerCase().trim();
  return TOOLS_REGISTRY.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.subcategoryLabel.toLowerCase().includes(q) ||
    t.acceptedFormats.some(f => f.toLowerCase().includes(q)) ||
    t.outputFormat.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q)
  );
};
