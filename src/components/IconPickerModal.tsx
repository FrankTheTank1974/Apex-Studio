import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Check, 
  Copy, 
  Sparkles, 
  Code2, 
  Sliders, 
  Grid, 
  Layers, 
  Palette, 
  MousePointer, 
  Maximize2,
  ExternalLink,
  ShieldCheck,
  // Actions & UI
  Search as SearchIcon, 
  Plus, 
  Minus, 
  Check as CheckIcon, 
  X as XIcon, 
  Trash2, 
  Edit, 
  Copy as CopyIcon, 
  Save, 
  RefreshCw, 
  Sliders as SlidersIcon, 
  Filter, 
  Settings, 
  Lock, 
  Unlock, 
  Share2, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  Bell, 
  Heart, 
  Star, 
  Bookmark, 
  Flag,
  // Navigation & Arrows
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Compass, 
  MapPin, 
  Navigation, 
  Home, 
  Menu, 
  Move,
  // Communication & Social
  Mail, 
  MessageSquare, 
  Send, 
  Phone, 
  Globe, 
  Users, 
  User, 
  UserPlus, 
  AtSign, 
  ThumbsUp, 
  Radio,
  // Media & Audio
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Film, 
  Image as ImageIcon, 
  Camera, 
  Music, 
  Mic, 
  Video, 
  Disc, 
  Tv,
  // Devices & Tech
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Cpu, 
  Terminal, 
  Database, 
  Wifi, 
  Battery, 
  Zap, 
  Cloud, 
  Code, 
  Server, 
  HardDrive,
  // Commerce & Finance
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Tag, 
  ShoppingBag, 
  Gift, 
  Wallet, 
  Percent, 
  TrendingUp, 
  BarChart,
  // Weather & Status
  Sun, 
  Moon, 
  CloudRain, 
  Shield, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  XCircle, 
  Clock,
  // Files & Objects
  FileText, 
  Folder, 
  FolderPlus, 
  Archive, 
  Box, 
  Paperclip, 
  Link as LinkIcon
} from 'lucide-react';
import { ThemeMode } from '../types';

export interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertIcon: (htmlSnippet: string) => void;
  themeMode?: ThemeMode;
}

export type IconLibrary = 'lucide' | 'fontawesome';
export type IconCategory = 'all' | 'actions' | 'navigation' | 'social' | 'media' | 'tech' | 'commerce' | 'status' | 'files';

export interface IconItem {
  id: string;
  name: string;
  category: IconCategory;
  tags: string[];
  faClass: string; // FontAwesome class, e.g. "fa-solid fa-magnifying-glass"
  lucideComponent: React.FC<{ className?: string; size?: number | string; strokeWidth?: number | string; color?: string }>;
  svgPath: string; // Clean inner SVG paths for generating pure standalone SVG strings
}

// Map of comprehensive icons with categories, tags, FA classes, and SVG inner paths
const ICON_DATA: IconItem[] = [
  // Actions & UI
  { id: 'search', name: 'Search', category: 'actions', tags: ['find', 'lookup', 'glass', 'magnifier'], faClass: 'fa-solid fa-magnifying-glass', lucideComponent: SearchIcon, svgPath: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>' },
  { id: 'plus', name: 'Plus / Add', category: 'actions', tags: ['create', 'new', 'add', 'more'], faClass: 'fa-solid fa-plus', lucideComponent: Plus, svgPath: '<path d="M5 12h14"/><path d="M12 5v14"/>' },
  { id: 'minus', name: 'Minus / Remove', category: 'actions', tags: ['delete', 'sub', 'remove'], faClass: 'fa-solid fa-minus', lucideComponent: Minus, svgPath: '<path d="M5 12h14"/>' },
  { id: 'check', name: 'Check', category: 'actions', tags: ['tick', 'confirm', 'success', 'done'], faClass: 'fa-solid fa-check', lucideComponent: CheckIcon, svgPath: '<path d="M20 6 9 17l-5-5"/>' },
  { id: 'close', name: 'Close / Cancel', category: 'actions', tags: ['cross', 'delete', 'remove', 'exit'], faClass: 'fa-solid fa-xmark', lucideComponent: XIcon, svgPath: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>' },
  { id: 'trash', name: 'Trash', category: 'actions', tags: ['delete', 'remove', 'bin', 'garbage'], faClass: 'fa-solid fa-trash', lucideComponent: Trash2, svgPath: '<path d="3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>' },
  { id: 'edit', name: 'Edit / Pencil', category: 'actions', tags: ['modify', 'pen', 'write', 'change'], faClass: 'fa-solid fa-pen-to-square', lucideComponent: Edit, svgPath: '<path d="M12 20h9"/><path d="16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>' },
  { id: 'copy', name: 'Copy / Duplicate', category: 'actions', tags: ['clipboard', 'duplicate', 'clone'], faClass: 'fa-solid fa-copy', lucideComponent: CopyIcon, svgPath: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>' },
  { id: 'save', name: 'Save / Disk', category: 'actions', tags: ['floppy', 'store', 'download'], faClass: 'fa-solid fa-floppy-disk', lucideComponent: Save, svgPath: '<path d="M152H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4H8V2"/><path d="M7 13h10v8H7z"/>' },
  { id: 'refresh', name: 'Refresh / Rotate', category: 'actions', tags: ['reload', 'sync', 'syncing', 'update'], faClass: 'fa-solid fa-rotate', lucideComponent: RefreshCw, svgPath: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>' },
  { id: 'settings', name: 'Settings / Gear', category: 'actions', tags: ['cog', 'config', 'options', 'preferences'], faClass: 'fa-solid fa-gear', lucideComponent: Settings, svgPath: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>' },
  { id: 'lock', name: 'Lock / Security', category: 'actions', tags: ['secure', 'protect', 'private', 'password'], faClass: 'fa-solid fa-lock', lucideComponent: Lock, svgPath: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  { id: 'unlock', name: 'Unlock', category: 'actions', tags: ['open', 'public', 'access', 'password'], faClass: 'fa-solid fa-lock-open', lucideComponent: Unlock, svgPath: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>' },
  { id: 'heart', name: 'Heart / Like', category: 'actions', tags: ['love', 'favorite', 'like', 'wishlist'], faClass: 'fa-solid fa-heart', lucideComponent: Heart, svgPath: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>' },
  { id: 'star', name: 'Star / Rating', category: 'actions', tags: ['rate', 'score', 'favorite', 'badge'], faClass: 'fa-solid fa-star', lucideComponent: Star, svgPath: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { id: 'bell', name: 'Bell / Notification', category: 'actions', tags: ['alert', 'reminder', 'notice', 'ring'], faClass: 'fa-solid fa-bell', lucideComponent: Bell, svgPath: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>' },
  { id: 'share', name: 'Share / Nodes', category: 'actions', tags: ['social', 'send', 'network', 'link'], faClass: 'fa-solid fa-share-nodes', lucideComponent: Share2, svgPath: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="10.51" y2="6.49"/><line x1="15.41" x2="8.59" y1="17.51" y2="13.49"/>' },
  { id: 'download', name: 'Download', category: 'actions', tags: ['export', 'save', 'get', 'file'], faClass: 'fa-solid fa-download', lucideComponent: Download, svgPath: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>' },
  { id: 'upload', name: 'Upload', category: 'actions', tags: ['import', 'send', 'file', 'cloud'], faClass: 'fa-solid fa-upload', lucideComponent: Upload, svgPath: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>' },
  { id: 'eye', name: 'Eye / View', category: 'actions', tags: ['preview', 'show', 'visible', 'watch'], faClass: 'fa-solid fa-eye', lucideComponent: Eye, svgPath: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>' },

  // Navigation & Arrows
  { id: 'home', name: 'Home / House', category: 'navigation', tags: ['main', 'dashboard', 'landing', 'start'], faClass: 'fa-solid fa-house', lucideComponent: Home, svgPath: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { id: 'arrow-right', name: 'Arrow Right', category: 'navigation', tags: ['forward', 'next', 'direction'], faClass: 'fa-solid fa-arrow-right', lucideComponent: ArrowRight, svgPath: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>' },
  { id: 'arrow-left', name: 'Arrow Left', category: 'navigation', tags: ['back', 'previous', 'direction'], faClass: 'fa-solid fa-arrow-left', lucideComponent: ArrowLeft, svgPath: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>' },
  { id: 'arrow-up', name: 'Arrow Up', category: 'navigation', tags: ['top', 'scroll', 'upward'], faClass: 'fa-solid fa-arrow-up', lucideComponent: ArrowUp, svgPath: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>' },
  { id: 'arrow-down', name: 'Arrow Down', category: 'navigation', tags: ['bottom', 'expand', 'downward'], faClass: 'fa-solid fa-arrow-down', lucideComponent: ArrowDown, svgPath: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>' },
  { id: 'chevron-right', name: 'Chevron Right', category: 'navigation', tags: ['caret', 'next', 'menu'], faClass: 'fa-solid fa-chevron-right', lucideComponent: ChevronRight, svgPath: '<path d="m9 18 6-6-6-6"/>' },
  { id: 'chevron-left', name: 'Chevron Left', category: 'navigation', tags: ['caret', 'prev', 'back'], faClass: 'fa-solid fa-chevron-left', lucideComponent: ChevronLeft, svgPath: '<path d="m15 18-6-6 6-6"/>' },
  { id: 'compass', name: 'Compass / Explore', category: 'navigation', tags: ['location', 'discover', 'guide'], faClass: 'fa-solid fa-compass', lucideComponent: Compass, svgPath: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>' },
  { id: 'map-pin', name: 'Map Pin / Location', category: 'navigation', tags: ['place', 'marker', 'geo', 'gps'], faClass: 'fa-solid fa-location-dot', lucideComponent: MapPin, svgPath: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>' },
  { id: 'menu', name: 'Menu / Hamburger', category: 'navigation', tags: ['drawer', 'list', 'nav', 'hamburger'], faClass: 'fa-solid fa-bars', lucideComponent: Menu, svgPath: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>' },

  // Communication & Social
  { id: 'mail', name: 'Mail / Envelope', category: 'social', tags: ['email', 'letter', 'contact', 'inbox'], faClass: 'fa-solid fa-envelope', lucideComponent: Mail, svgPath: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' },
  { id: 'message', name: 'Message / Chat', category: 'social', tags: ['comment', 'bubble', 'conversation', 'talk'], faClass: 'fa-solid fa-comment', lucideComponent: MessageSquare, svgPath: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { id: 'send', name: 'Send / Paperplane', category: 'social', tags: ['paperplane', 'submit', 'post', 'fly'], faClass: 'fa-solid fa-paper-plane', lucideComponent: Send, svgPath: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>' },
  { id: 'phone', name: 'Phone / Call', category: 'social', tags: ['telephone', 'contact', 'call', 'support'], faClass: 'fa-solid fa-phone', lucideComponent: Phone, svgPath: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>' },
  { id: 'globe', name: 'Globe / World', category: 'social', tags: ['web', 'internet', 'site', 'earth'], faClass: 'fa-solid fa-globe', lucideComponent: Globe, svgPath: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>' },
  { id: 'user', name: 'User / Profile', category: 'social', tags: ['person', 'account', 'avatar', 'member'], faClass: 'fa-solid fa-user', lucideComponent: User, svgPath: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { id: 'users', name: 'Users / Group', category: 'social', tags: ['team', 'people', 'members', 'community'], faClass: 'fa-solid fa-users', lucideComponent: Users, svgPath: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { id: 'thumbs-up', name: 'Thumbs Up / Like', category: 'social', tags: ['approve', 'agree', 'good', 'vote'], faClass: 'fa-solid fa-thumbs-up', lucideComponent: ThumbsUp, svgPath: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>' },

  // Media & Audio
  { id: 'play', name: 'Play', category: 'media', tags: ['start', 'video', 'music', 'player'], faClass: 'fa-solid fa-play', lucideComponent: Play, svgPath: '<polygon points="5 3 19 12 5 21 5 3"/>' },
  { id: 'pause', name: 'Pause', category: 'media', tags: ['stop', 'hold', 'break', 'player'], faClass: 'fa-solid fa-pause', lucideComponent: Pause, svgPath: '<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>' },
  { id: 'volume', name: 'Volume High', category: 'media', tags: ['sound', 'audio', 'speaker', 'music'], faClass: 'fa-solid fa-volume-high', lucideComponent: Volume2, svgPath: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>' },
  { id: 'camera', name: 'Camera / Photo', category: 'media', tags: ['picture', 'snap', 'lens', 'image'], faClass: 'fa-solid fa-camera', lucideComponent: Camera, svgPath: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>' },
  { id: 'music', name: 'Music Note', category: 'media', tags: ['song', 'audio', 'sound', 'melody'], faClass: 'fa-solid fa-music', lucideComponent: Music, svgPath: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
  { id: 'film', name: 'Film / Cinema', category: 'media', tags: ['movie', 'video', 'reel', 'production'], faClass: 'fa-solid fa-film', lucideComponent: Film, svgPath: '<rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/>' },

  // Devices & Tech
  { id: 'monitor', name: 'Monitor / Desktop', category: 'tech', tags: ['screen', 'computer', 'display', 'pc'], faClass: 'fa-solid fa-desktop', lucideComponent: Monitor, svgPath: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>' },
  { id: 'smartphone', name: 'Smartphone', category: 'tech', tags: ['mobile', 'phone', 'device', 'ios', 'android'], faClass: 'fa-solid fa-mobile-screen', lucideComponent: Smartphone, svgPath: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>' },
  { id: 'laptop', name: 'Laptop', category: 'tech', tags: ['macbook', 'computer', 'notebook'], faClass: 'fa-solid fa-laptop', lucideComponent: Laptop, svgPath: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.34 20H3.66a1 1 0 0 1-.94-1.45L4 16"/>' },
  { id: 'cpu', name: 'CPU / Processor', category: 'tech', tags: ['chip', 'microchip', 'hardware', 'core'], faClass: 'fa-solid fa-microchip', lucideComponent: Cpu, svgPath: '<rect width="12" height="12" x="6" y="6" rx="2"/><path d="M9 18v3"/><path d="M15 18v3"/><path d="M9 3v3"/><path d="M15 3v3"/><path d="M3 9h3"/><path d="M3 15h3"/><path d="M18 9h3"/><path d="M18 15h3"/>' },
  { id: 'terminal', name: 'Terminal / CLI', category: 'tech', tags: ['code', 'console', 'bash', 'command'], faClass: 'fa-solid fa-terminal', lucideComponent: Terminal, svgPath: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>' },
  { id: 'database', name: 'Database', category: 'tech', tags: ['storage', 'sql', 'server', 'data'], faClass: 'fa-solid fa-database', lucideComponent: Database, svgPath: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },
  { id: 'wifi', name: 'WiFi / Signal', category: 'tech', tags: ['wireless', 'network', 'connection', 'internet'], faClass: 'fa-solid fa-wifi', lucideComponent: Wifi, svgPath: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.85a10 10 0 0 1 14 0"/><path d="M8.5 16.88a5 5 0 0 1 7 0"/>' },
  { id: 'zap', name: 'Zap / Lightning', category: 'tech', tags: ['energy', 'power', 'fast', 'flash', 'bolt'], faClass: 'fa-solid fa-bolt', lucideComponent: Zap, svgPath: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
  { id: 'cloud', name: 'Cloud', category: 'tech', tags: ['server', 'online', 'saas', 'sync'], faClass: 'fa-solid fa-cloud', lucideComponent: Cloud, svgPath: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>' },

  // Commerce & Finance
  { id: 'shopping-cart', name: 'Shopping Cart', category: 'commerce', tags: ['buy', 'checkout', 'store', 'e-commerce'], faClass: 'fa-solid fa-cart-shopping', lucideComponent: ShoppingCart, svgPath: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>' },
  { id: 'credit-card', name: 'Credit Card', category: 'commerce', tags: ['payment', 'pay', 'visa', 'bank'], faClass: 'fa-solid fa-credit-card', lucideComponent: CreditCard, svgPath: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>' },
  { id: 'dollar-sign', name: 'Dollar Sign', category: 'commerce', tags: ['money', 'cash', 'price', 'currency'], faClass: 'fa-solid fa-dollar-sign', lucideComponent: DollarSign, svgPath: '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { id: 'tag', name: 'Tag / Label', category: 'commerce', tags: ['price', 'discount', 'category', 'sale'], faClass: 'fa-solid fa-tag', lucideComponent: Tag, svgPath: '<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5" fill="currentColor"/>' },
  { id: 'gift', name: 'Gift / Present', category: 'commerce', tags: ['reward', 'bonus', 'offer', 'package'], faClass: 'fa-solid fa-gift', lucideComponent: Gift, svgPath: '<polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7" rx="1"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>' },
  { id: 'trending-up', name: 'Trending Up', category: 'commerce', tags: ['growth', 'analytics', 'chart', 'profit'], faClass: 'fa-solid fa-arrow-trend-up', lucideComponent: TrendingUp, svgPath: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' },

  // Weather & Status
  { id: 'sun', name: 'Sun / Light', category: 'status', tags: ['day', 'bright', 'weather', 'summer'], faClass: 'fa-solid fa-sun', lucideComponent: Sun, svgPath: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' },
  { id: 'moon', name: 'Moon / Dark', category: 'status', tags: ['night', 'theme', 'sleep', 'lunar'], faClass: 'fa-solid fa-moon', lucideComponent: Moon, svgPath: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' },
  { id: 'sparkles', name: 'Sparkles / AI', category: 'status', tags: ['magic', 'star', 'shine', 'copilot', 'smart'], faClass: 'fa-solid fa-wand-magic-sparkles', lucideComponent: Sparkles, svgPath: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' },
  { id: 'shield', name: 'Shield / Security', category: 'status', tags: ['protect', 'guard', 'defense', 'safe'], faClass: 'fa-solid fa-shield-halved', lucideComponent: Shield, svgPath: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { id: 'alert', name: 'Alert Warning', category: 'status', tags: ['warning', 'exclamation', 'caution', 'danger'], faClass: 'fa-solid fa-triangle-exclamation', lucideComponent: AlertTriangle, svgPath: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>' },
  { id: 'check-circle', name: 'Check Circle', category: 'status', tags: ['success', 'verified', 'done', 'approved'], faClass: 'fa-solid fa-circle-check', lucideComponent: CheckCircle2, svgPath: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>' },
  { id: 'clock', name: 'Clock / Time', category: 'status', tags: ['timer', 'history', 'schedule', 'wait'], faClass: 'fa-solid fa-clock', lucideComponent: Clock, svgPath: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },

  // Files & Objects
  { id: 'file-text', name: 'File Text', category: 'files', tags: ['document', 'page', 'paper', 'article'], faClass: 'fa-solid fa-file-lines', lucideComponent: FileText, svgPath: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4H8V2"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>' },
  { id: 'folder', name: 'Folder', category: 'files', tags: ['directory', 'files', 'storage', 'collection'], faClass: 'fa-solid fa-folder', lucideComponent: Folder, svgPath: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>' },
  { id: 'archive', name: 'Archive / Box', category: 'files', tags: ['zip', 'tar', 'storage', 'backup'], faClass: 'fa-solid fa-box-archive', lucideComponent: Archive, svgPath: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>' },
  { id: 'link', name: 'Link / URL', category: 'files', tags: ['anchor', 'chain', 'hyperlink', 'connect'], faClass: 'fa-solid fa-link', lucideComponent: LinkIcon, svgPath: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' }
];

const PRESET_COLORS = [
  { name: 'Inherit / Text Color', value: 'currentColor', twClass: 'text-current' },
  { name: 'Indigo Accent', value: '#6366f1', twClass: 'text-indigo-500' },
  { name: 'Purple Gradient', value: '#a855f7', twClass: 'text-purple-500' },
  { name: 'Emerald Green', value: '#10b981', twClass: 'text-emerald-500' },
  { name: 'Rose Red', value: '#f43f5e', twClass: 'text-rose-500' },
  { name: 'Amber Warning', value: '#f59e0b', twClass: 'text-amber-500' },
  { name: 'Cyan Tech', value: '#06b6d4', twClass: 'text-cyan-500' },
  { name: 'Slate Dark', value: '#0f172a', twClass: 'text-slate-900' },
  { name: 'Pure White', value: '#ffffff', twClass: 'text-white' },
];

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  onInsertIcon,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('all');
  const [selectedLibrary, setSelectedLibrary] = useState<IconLibrary>('lucide');
  
  // Customization State
  const [selectedIcon, setSelectedIcon] = useState<IconItem>(ICON_DATA[0]);
  const [iconSize, setIconSize] = useState<number>(24);
  const [iconColor, setIconColor] = useState<string>('currentColor');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [wrapperType, setWrapperType] = useState<'bare' | 'button' | 'badge' | 'avatar' | 'labeled'>('bare');
  const [wrapperLabel, setWrapperLabel] = useState<string>('Action Button');
  
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Filtered icons search
  const filteredIcons = useMemo(() => {
    return ICON_DATA.filter(icon => {
      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        icon.name.toLowerCase().includes(q) || 
        icon.id.includes(q) ||
        icon.tags.some(t => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  // Build HTML string output based on user settings
  const generateIconHtmlSnippet = (): string => {
    let iconCore = '';

    if (selectedLibrary === 'lucide') {
      const colorAttr = iconColor === 'currentColor' ? 'currentColor' : iconColor;
      iconCore = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${colorAttr}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${selectedIcon.id}">${selectedIcon.svgPath}</svg>`;
    } else {
      // FontAwesome
      const styleAttr = iconColor !== 'currentColor' ? `font-size: ${iconSize}px; color: ${iconColor};` : `font-size: ${iconSize}px;`;
      iconCore = `<i class="${selectedIcon.faClass}" style="${styleAttr}"></i>`;
    }

    // Wrap according to container selection
    switch (wrapperType) {
      case 'button':
        return `<button type="button" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer">\n  ${iconCore}\n  <span>${wrapperLabel || 'Action'}</span>\n</button>`;

      case 'badge':
        return `<div class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-xs">\n  ${iconCore}\n</div>`;

      case 'avatar':
        return `<div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">\n  ${iconCore}\n</div>`;

      case 'labeled':
        return `<div class="flex items-center space-x-2 text-slate-800 font-medium text-sm">\n  ${iconCore}\n  <span>${wrapperLabel || 'Item Label'}</span>\n</div>`;

      case 'bare':
      default:
        // Inject CDN stylesheet hint for FontAwesome if needed
        if (selectedLibrary === 'fontawesome') {
          return `<!-- FontAwesome Icon CDN requirement: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"> -->\n${iconCore}`;
        }
        return iconCore;
    }
  };

  const handleInsert = () => {
    const htmlSnippet = generateIconHtmlSnippet();
    onInsertIcon(htmlSnippet);
    onClose();
  };

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedNotification(label);
    setTimeout(() => setCopiedNotification(null), 2000);
  };

  const IconPreviewComponent = selectedIcon.lucideComponent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-5xl h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Bar */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight flex items-center space-x-2">
                <span>Icon Picker & Vector Graphics Studio</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {ICON_DATA.length}+ Icons
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Browse, customize size, color, stroke width, & insert Lucide SVGs or FontAwesome icons into your canvas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Column: Icon Browser & Filters */}
          <div className={`flex-1 flex flex-col min-w-0 border-r ${
            isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'
          }`}>
            {/* Top Filter Controls */}
            <div className="p-4 space-y-3 border-b border-slate-800 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search icons by name, keyword (e.g. search, user, arrow)..."
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none border transition-all ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-300 focus:border-indigo-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Library Selector */}
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  <button
                    onClick={() => setSelectedLibrary('lucide')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      selectedLibrary === 'lucide'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Lucide SVG</span>
                  </button>

                  <button
                    onClick={() => setSelectedLibrary('fontawesome')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      selectedLibrary === 'fontawesome'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>FontAwesome</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {[
                  { id: 'all', label: 'All Icons' },
                  { id: 'actions', label: 'Actions' },
                  { id: 'navigation', label: 'Navigation' },
                  { id: 'social', label: 'Social & User' },
                  { id: 'media', label: 'Media' },
                  { id: 'tech', label: 'Tech & Devices' },
                  { id: 'commerce', label: 'Commerce' },
                  { id: 'status', label: 'Weather & Status' },
                  { id: 'files', label: 'Files' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as IconCategory)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                        : isDark
                          ? 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                          : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Grid Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
                  {filteredIcons.map((icon) => {
                    const Component = icon.lucideComponent;
                    const isSelected = selectedIcon.id === icon.id;

                    return (
                      <button
                        key={icon.id}
                        onClick={() => setSelectedIcon(icon)}
                        onDoubleClick={handleInsert}
                        className={`group relative p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10 text-indigo-300 ring-2 ring-indigo-500/30'
                            : isDark
                              ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs'
                        }`}
                        title={`Select ${icon.name} (Double-click to insert instantly)`}
                      >
                        {/* Icon Graphic */}
                        <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {selectedLibrary === 'lucide' ? (
                            <Component size={24} strokeWidth={strokeWidth} />
                          ) : (
                            <i className={`${icon.faClass} text-xl`} />
                          )}
                        </div>

                        {/* Icon Label */}
                        <span className="text-[11px] font-medium truncate w-full text-center tracking-tight">
                          {icon.name}
                        </span>

                        {/* Selected Tick Indicator */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12 space-y-3">
                  <Search className="w-10 h-10 text-slate-600" />
                  <p className="text-sm font-medium">No matching icons found for "{searchTerm}"</p>
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                    className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-lg text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Grid Footer Bar */}
            <div className={`px-4 py-2 border-t text-xs flex items-center justify-between text-slate-400 font-mono ${
              isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-100/80'
            }`}>
              <span>Showing {filteredIcons.length} of {ICON_DATA.length} icons</span>
              <span>Double-click icon to insert</span>
            </div>
          </div>

          {/* Right Column: Customization & Live Inspector */}
          <div className={`w-full md:w-80 lg:w-96 flex flex-col shrink-0 overflow-y-auto p-5 space-y-5 ${
            isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900 border-l border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm tracking-tight flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Customization Studio</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono uppercase">
                {selectedIcon.name}
              </span>
            </div>

            {/* Live Interactive Preview Canvas */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Live Interactive Canvas Preview
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Light background preview */}
                <div className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center min-h-[110px] shadow-sm relative overflow-hidden group">
                  <span className="absolute top-1.5 left-2 text-[9px] font-mono font-bold text-slate-400 uppercase">Light Theme</span>
                  <div className="transition-all transform group-hover:scale-105">
                    {wrapperType === 'bare' && (
                      selectedLibrary === 'lucide' ? (
                        <IconPreviewComponent size={iconSize} color={iconColor === 'currentColor' ? '#0f172a' : iconColor} strokeWidth={strokeWidth} />
                      ) : (
                        <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px`, color: iconColor === 'currentColor' ? '#0f172a' : iconColor }} />
                      )
                    )}

                    {wrapperType === 'button' && (
                      <button type="button" className="px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-lg flex items-center space-x-2 shadow-md">
                        {selectedLibrary === 'lucide' ? (
                          <IconPreviewComponent size={iconSize} color="currentColor" strokeWidth={strokeWidth} />
                        ) : (
                          <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px` }} />
                        )}
                        <span>{wrapperLabel || 'Action'}</span>
                      </button>
                    )}

                    {wrapperType === 'badge' && (
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shadow-xs">
                        {selectedLibrary === 'lucide' ? (
                          <IconPreviewComponent size={iconSize} color={iconColor === 'currentColor' ? '#4f46e5' : iconColor} strokeWidth={strokeWidth} />
                        ) : (
                          <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px`, color: iconColor === 'currentColor' ? '#4f46e5' : iconColor }} />
                        )}
                      </div>
                    )}

                    {wrapperType === 'avatar' && (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        {selectedLibrary === 'lucide' ? (
                          <IconPreviewComponent size={iconSize} color="white" strokeWidth={strokeWidth} />
                        ) : (
                          <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px` }} />
                        )}
                      </div>
                    )}

                    {wrapperType === 'labeled' && (
                      <div className="flex items-center space-x-2 text-slate-800 font-medium text-xs">
                        {selectedLibrary === 'lucide' ? (
                          <IconPreviewComponent size={iconSize} color={iconColor === 'currentColor' ? '#1e293b' : iconColor} strokeWidth={strokeWidth} />
                        ) : (
                          <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px`, color: iconColor === 'currentColor' ? '#1e293b' : iconColor }} />
                        )}
                        <span>{wrapperLabel || 'Item Label'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dark background preview */}
                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-center min-h-[110px] shadow-sm relative overflow-hidden group">
                  <span className="absolute top-1.5 left-2 text-[9px] font-mono font-bold text-slate-500 uppercase">Dark Theme</span>
                  <div className="transition-all transform group-hover:scale-105">
                    {wrapperType === 'bare' && (
                      selectedLibrary === 'lucide' ? (
                        <IconPreviewComponent size={iconSize} color={iconColor === 'currentColor' ? '#f8fafc' : iconColor} strokeWidth={strokeWidth} />
                      ) : (
                        <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px`, color: iconColor === 'currentColor' ? '#f8fafc' : iconColor }} />
                      )
                    )}

                    {wrapperType === 'button' && (
                      <button type="button" className="px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-lg flex items-center space-x-2 shadow-md">
                        {selectedLibrary === 'lucide' ? (
                          <IconPreviewComponent size={iconSize} color="currentColor" strokeWidth={strokeWidth} />
                        ) : (
                          <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px` }} />
                        )}
                        <span>{wrapperLabel || 'Action'}</span>
                      </button>
                    )}

                    {wrapperType === 'badge' && (
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-xs">
                        {selectedLibrary === 'lucide' ? (
                          <IconPreviewComponent size={iconSize} color={iconColor === 'currentColor' ? '#818cf8' : iconColor} strokeWidth={strokeWidth} />
                        ) : (
                          <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px`, color: iconColor === 'currentColor' ? '#818cf8' : iconColor }} />
                        )}
                      </div>
                    )}

                    {wrapperType === 'avatar' && (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        {selectedLibrary === 'lucide' ? (
                          <IconPreviewComponent size={iconSize} color="white" strokeWidth={strokeWidth} />
                        ) : (
                          <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px` }} />
                        )}
                      </div>
                    )}

                    {wrapperType === 'labeled' && (
                      <div className="flex items-center space-x-2 text-slate-100 font-medium text-xs">
                        {selectedLibrary === 'lucide' ? (
                          <IconPreviewComponent size={iconSize} color={iconColor === 'currentColor' ? '#f1f5f9' : iconColor} strokeWidth={strokeWidth} />
                        ) : (
                          <i className={selectedIcon.faClass} style={{ fontSize: `${iconSize}px`, color: iconColor === 'currentColor' ? '#f1f5f9' : iconColor }} />
                        )}
                        <span>{wrapperLabel || 'Item Label'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Icon Size Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Icon Dimension Size</span>
                <span className="font-mono text-indigo-400">{iconSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="80"
                step="2"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                {[16, 24, 32, 48, 64].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setIconSize(sz)}
                    className={`hover:text-indigo-400 ${iconSize === sz ? 'text-indigo-400 font-bold' : ''}`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>

            {/* Stroke Width Slider (Lucide only) */}
            {selectedLibrary === 'lucide' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Vector Stroke Width</span>
                  <span className="font-mono text-indigo-400">{strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3.5"
                  step="0.5"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  {[1, 1.5, 2, 2.5, 3].map((sw) => (
                    <button
                      key={sw}
                      onClick={() => setStrokeWidth(sw)}
                      className={`hover:text-indigo-400 ${strokeWidth === sw ? 'text-indigo-400 font-bold' : ''}`}
                    >
                      {sw}px
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Palette Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Color Palette Preset</label>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setIconColor(c.value)}
                    className={`h-7 rounded-lg border transition-all flex items-center justify-center relative ${
                      iconColor === c.value ? 'ring-2 ring-indigo-500 border-indigo-400 scale-105' : 'border-slate-800 hover:border-slate-600'
                    }`}
                    style={{ backgroundColor: c.value === 'currentColor' ? 'transparent' : c.value }}
                    title={c.name}
                  >
                    {c.value === 'currentColor' && (
                      <span className="text-[9px] font-mono font-bold text-slate-400">AUTO</span>
                    )}
                    {iconColor === c.value && (
                      <Check className={`w-3.5 h-3.5 ${c.value === '#ffffff' ? 'text-slate-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Container Layout Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">HTML Container Wrapping</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'bare', label: 'Pure SVG / Icon' },
                  { id: 'button', label: 'Action Button' },
                  { id: 'badge', label: 'Soft Tile Badge' },
                  { id: 'avatar', label: 'Circular Avatar' },
                  { id: 'labeled', label: 'Icon + Text Label' }
                ].map((wrap) => (
                  <button
                    key={wrap.id}
                    onClick={() => setWrapperType(wrap.id as any)}
                    className={`p-2 rounded-lg border text-left transition-all font-medium text-[11px] ${
                      wrapperType === wrap.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {wrap.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Label Text Input (if button or labeled wrapper) */}
            {(wrapperType === 'button' || wrapperType === 'labeled') && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Button / Item Text</label>
                <input
                  type="text"
                  value={wrapperLabel}
                  onChange={(e) => setWrapperLabel(e.target.value)}
                  placeholder="e.g. Add to Cart, Search..."
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Copy Snippets & Main Insert Button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleInsert}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Insert Icon into Canvas</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCopyCode(generateIconHtmlSnippet(), 'HTML Snippet')}
                  className="py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Copy HTML</span>
                </button>

                <button
                  onClick={() => handleCopyCode(selectedIcon.svgPath, 'SVG Path')}
                  className="py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
                >
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Copy SVG Path</span>
                </button>
              </div>

              {copiedNotification && (
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-semibold animate-fadeIn">
                  Copied {copiedNotification} to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
