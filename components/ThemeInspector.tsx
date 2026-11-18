'use client';

import { useState } from 'react';
import { FileCode2, Copy, Check } from 'lucide-react';

export interface ThemeFileEntry {
  path: string;
  folder: string;
  content: string;
  lines: number;
  bytes: number;
}

interface ThemeInspectorProps {
  files: ThemeFileEntry[];
}

type FolderFilter = 'All' | 'Config & Demo' | 'Sections' | 'Snippets & Assets' | 'Templates & Layout';

export default function ThemeInspector({ files }: ThemeInspectorProps) {
  const [filter, setFilter] = useState<FolderFilter>('All');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const filteredFiles = files.filter((file) => {
    if (filter === 'All') return true;
    if (filter === 'Config & Demo') {
      return file.folder === 'config' || file.folder === 'locales' || file.folder === 'demo';
    }
    if (filter === 'Sections') {
      return file.folder === 'sections';
    }
    if (filter === 'Snippets & Assets') {
      return file.folder === 'snippets' || file.folder === 'assets';
    }
    if (filter === 'Templates & Layout') {
      return file.folder === 'templates' || file.folder === 'layout' || file.folder === 'root';
    }
    return true;
  });

  const handleCopy = async (filePath: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPath(filePath);
      window.setTimeout(() => setCopiedPath(null), 1800);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  const tabs: FolderFilter[] = [
    'All',
    'Config & Demo',
    'Sections',
    'Snippets & Assets',
    'Templates & Layout',
  ];

  return (
    <section
      id="theme-files"
      aria-labelledby="theme-files-heading"
      className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-8 py-14 border-t border-[#E2DDD2]"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C59B43] mb-2">
            Ghosoun Shopify Online Store 2.0
          </p>
          <h2
            id="theme-files-heading"
            className="font-serif text-3xl sm:text-4xl font-semibold text-[#0D2F32]"
          >
            Theme Package Files ({files.length})
          </h2>
          <p className="text-sm text-[#526162] mt-2 max-w-2xl">
            Every Liquid section, bilingual locale file (<code className="font-mono text-xs text-[#0D2F32]">en.default.json</code> &amp;{' '}
            <code className="font-mono text-xs text-[#0D2F32]">ar.json</code>), JSON schema, catalog CSV, and
            mobile bottom navigation bar exists directly on disk ready for{' '}
            <code className="font-mono text-xs text-[#0D2F32]">shopify theme dev</code>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter theme files">
          {tabs.map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#0D2F32] text-[#FAF9F5]'
                    : 'bg-[#F2EFE9] text-[#526162] border border-[#E2DDD2] hover:text-[#0D2F32]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {filteredFiles.map((file) => (
          <details
            key={file.path}
            className="group bg-white border border-[#E2DDD2] rounded-md overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-4 px-5 py-3.5 cursor-pointer hover:bg-[#F2EFE9]/60 transition-colors list-none">
              <div className="flex items-center gap-3 min-w-0">
                <FileCode2 className="w-4 h-4 text-[#217C42] shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs sm:text-sm font-semibold text-[#0D2F32] truncate">
                  {file.path}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#526162] tabular-nums shrink-0">
                <span>{file.lines} lines</span>
                <span>&middot;</span>
                <span>{(file.bytes / 1024).toFixed(1)} KB</span>
              </div>
            </summary>
            <div className="border-t border-[#E2DDD2] bg-[#0D2F32] text-[#FAF9F5]">
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/10 text-xs text-[#C8D0CB]">
                <span className="font-mono">{file.path}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(file.path, file.content)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  {copiedPath === file.path ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#7DC35B]" aria-hidden="true" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto max-h-[420px]">
                <code>{file.content}</code>
              </pre>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
