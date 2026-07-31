export type FileType = 'html' | 'css' | 'js' | 'xml' | 'json' | 'asset';

export interface ProjectFile {
  id: string;
  name: string;
  type: FileType;
  content: string;
  path: string;
  isMain?: boolean;
}

export interface SelectedElementInfo {
  tagName: string;
  id: string;
  classList: string[];
  attributes: Record<string, string>;
  style: Record<string, string>;
  textContent: string;
  xpath?: string;
}

export type ComponentCategory = 'layout' | 'typography' | 'ui' | 'forms' | 'media' | 'drawio' | 'custom';

export interface ComponentTemplate {
  id: string;
  name: string;
  category: ComponentCategory;
  icon: string;
  description: string;
  html: string;
  defaultCss?: string;
  tags?: string[];
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  activeFileId?: string;
  selectedElementId?: string;
  cursor?: { x: number; y: number };
  lastActive: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  text: string;
  timestamp: string;
}

export type DeploymentProvider = 'github' | 'gitlab' | 'bitbucket' | 'codeberg' | 'vercel' | 'netlify' | 'svn' | 'cvs' | 'mercurial';

export interface DeploymentConfig {
  provider: DeploymentProvider;
  repoName: string;
  branch: string;
  token: string;
  isPrivate: boolean;
  commitMessage: string;
  siteId?: string; // For Netlify / Vercel
  customDomain?: string;
  environmentVars?: { key: string; value: string }[];
}

export interface DeploymentLog {
  id: string;
  timestamp: string;
  provider: DeploymentProvider;
  status: 'pending' | 'in_progress' | 'success' | 'failed';
  message: string;
  url?: string;
  details?: string;
}

export interface DrawIoDiagram {
  id: string;
  title: string;
  xml: string;
  svg: string;
  updatedAt: string;
}

export type ViewMode = 'wysiwyg' | 'code' | 'split' | 'preview' | 'drawio';
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
export type ThemeMode = 'dark' | 'light';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  files: ProjectFile[];
  diagrams?: DrawIoDiagram[];
}
