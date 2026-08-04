import React, { useState, useEffect } from 'react';
import {
  FileCode,
  X,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  FileCheck,
  Code2,
  RefreshCw,
  Copy,
  Check,
  Plus
} from 'lucide-react';
import { ProjectFile } from '../types';
import { generateXsdFromXml, XsdValidationResult } from '../utils/xsdValidator';

interface XsdValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  xmlContent: string;
  xmlFileName: string;
  xsdSchemaText: string;
  onSaveSchema: (newSchemaText: string, enableLiveValidation: boolean) => void;
  isLiveValidationEnabled: boolean;
  projectFiles: ProjectFile[];
  validationResult: XsdValidationResult | null;
  onValidateNow: () => void;
  onSaveAsProjectFile?: (filename: string, content: string) => void;
  isDark?: boolean;
}

export const XsdValidationModal: React.FC<XsdValidationModalProps> = ({
  isOpen,
  onClose,
  xmlContent,
  xmlFileName,
  xsdSchemaText,
  onSaveSchema,
  isLiveValidationEnabled,
  projectFiles,
  validationResult,
  onValidateNow,
  onSaveAsProjectFile,
  isDark = true
}) => {
  const [activeSchemaText, setActiveSchemaText] = useState<string>(xsdSchemaText);
  const [liveValidation, setLiveValidation] = useState<boolean>(isLiveValidationEnabled);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const [copied, setCopied] = useState<boolean>(false);
  const [fileExportName, setFileExportName] = useState<string>('schema.xsd');

  useEffect(() => {
    setActiveSchemaText(xsdSchemaText);
  }, [xsdSchemaText]);

  useEffect(() => {
    setLiveValidation(isLiveValidationEnabled);
  }, [isLiveValidationEnabled]);

  if (!isOpen) return null;

  const xmlFiles = projectFiles.filter(f => f.type === 'xml' || f.name.endsWith('.xsd'));

  const handleApplyTemplate = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (templateKey === 'inferred') {
      const generated = generateXsdFromXml(xmlContent);
      setActiveSchemaText(generated);
    } else if (templateKey === 'catalog') {
      setActiveSchemaText(`<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="catalog">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="product" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="name" type="xs:string"/>
              <xs:element name="price" type="xs:decimal"/>
              <xs:element name="category" type="xs:string"/>
              <xs:element name="inStock" type="xs:boolean"/>
            </xs:sequence>
            <xs:attribute name="id" type="xs:string" use="required"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`);
    } else if (templateKey === 'users') {
      setActiveSchemaText(`<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="users">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="user" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="username" type="xs:string"/>
              <xs:element name="email" type="xs:string"/>
              <xs:element name="age" type="xs:integer"/>
              <xs:element name="role">
                <xs:simpleType>
                  <xs:restriction base="xs:string">
                    <xs:enumeration value="admin"/>
                    <xs:enumeration value="editor"/>
                    <xs:enumeration value="viewer"/>
                  </xs:restriction>
                </xs:simpleType>
              </xs:element>
            </xs:sequence>
            <xs:attribute name="id" type="xs:string" use="required"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setActiveSchemaText(text);
        setSelectedTemplate('uploaded');
      }
    };
    reader.readAsText(file);
  };

  const handleSelectProjectFile = (fileId: string) => {
    const found = projectFiles.find(f => f.id === fileId);
    if (found) {
      setActiveSchemaText(found.content);
      setSelectedTemplate(`file-${found.id}`);
    }
  };

  const handleSaveAndApply = () => {
    onSaveSchema(activeSchemaText, liveValidation);
    onValidateNow();
    onClose();
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(activeSchemaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSchemaToProject = () => {
    if (onSaveAsProjectFile) {
      const finalName = fileExportName.endsWith('.xsd') || fileExportName.endsWith('.xml') 
        ? fileExportName 
        : `${fileExportName}.xsd`;
      onSaveAsProjectFile(finalName, activeSchemaText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col border overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-amber-500/30 text-slate-100' : 'bg-white border-amber-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-amber-50/50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center space-x-2">
                <span>XSD Schema Validation</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  {xmlFileName}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Validate current XML document structure, data types, and attribute rules against a W3C XML Schema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* Validation Status Card */}
          {validationResult && (
            <div className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
              validationResult.valid
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/10 border-red-500/40 text-red-300'
            }`}>
              {validationResult.valid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs space-y-1">
                <div className="font-bold text-sm">
                  {validationResult.valid
                    ? '✓ XSD Validation Passed — 0 Errors Detected'
                    : `✕ ${validationResult.errors.length} XSD Validation Error(s) Found`}
                </div>
                {validationResult.schemaRootElements.length > 0 && (
                  <p className="opacity-80">
                    Declared XSD Root Elements:{' '}
                    <span className="font-mono">{validationResult.schemaRootElements.map(r => `<${r}>`).join(', ')}</span>
                  </p>
                )}
                {!validationResult.valid && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto pr-1">
                    {validationResult.errors.map((err) => (
                      <div key={err.id} className="font-mono text-[11px] bg-red-950/40 p-1.5 rounded border border-red-500/20">
                        <span className="font-bold text-red-400">Line {err.line}:</span> {err.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Controls Bar: Source & Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick XSD Templates & Auto-Infer</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('inferred')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Infer from XML</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('catalog')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                >
                  Product Catalog
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('users')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                >
                  User Accounts
                </button>
              </div>
            </div>

            {/* Select Existing File / Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Load from File / Upload .XSD</span>
              </label>
              <div className="flex items-center space-x-2">
                {xmlFiles.length > 0 && (
                  <select
                    onChange={(e) => handleSelectProjectFile(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-200 outline-none focus:border-amber-500"
                  >
                    <option value="">-- Choose Project File --</option>
                    {xmlFiles.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                )}

                <label className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer flex items-center space-x-1 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .xsd</span>
                  <input
                    type="file"
                    accept=".xsd,.xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Textarea Code Editor for XSD Schema */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-400" />
                <span>XSD Schema Definition (W3C Markup)</span>
              </label>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="px-2 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy XSD'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={activeSchemaText}
              onChange={(e) => setActiveSchemaText(e.target.value)}
              placeholder="Paste or write your W3C XML Schema (<xs:schema ...>) here..."
              spellCheck={false}
              className={`w-full h-64 p-3 font-mono text-xs leading-5 rounded-xl border outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-amber-200/90 caret-amber-400'
                  : 'bg-slate-50 border-slate-300 text-slate-800 caret-indigo-600'
              }`}
            />
          </div>

          {/* Export to Project Files Bar */}
          {onSaveAsProjectFile && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-medium">Save Schema as Project File:</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={fileExportName}
                  onChange={(e) => setFileExportName(e.target.value)}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-amber-300 w-36 outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSaveSchemaToProject}
                  className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save to Project</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
        }`}>
          <label className="flex items-center space-x-2 text-xs font-medium text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={liveValidation}
              onChange={(e) => setLiveValidation(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
            />
            <span>Enable Real-Time XSD Validation while editing XML</span>
          </label>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply & Validate XML</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
