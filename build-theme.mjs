#!/usr/bin/env node
/**
 * Ghosoun Shopify OS 2.0 Theme Unpacker & Validator
 * Usage:
 *   node build-theme.mjs [markdown-bundle-path] [output-dir]
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const inputPath = args[0] || 'theme-bundle.md';
const outputDir = path.resolve(args[1] || './ghosoun-theme');

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Markdown input file "${inputPath}" not found.`);
  console.error('Usage: node build-theme.mjs <markdown-file> [output-directory]');
  process.exit(1);
}

const markdown = fs.readFileSync(inputPath, 'utf8');
const fileBlockRegex = /###\s+FILE:\s+([^\r\n]+)\r?\n+```[^\r\n]*\r?\n([\s\S]*?)```/g;

let match;
let count = 0;

while ((match = fileBlockRegex.exec(markdown)) !== null) {
  const relPath = match[1].trim();
  const content = match[2];

  const targetPath = path.join(outputDir, relPath);
  const targetFolder = path.dirname(targetPath);

  fs.mkdirSync(targetFolder, { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
  count++;
  console.log(`[WRITE] ${relPath}`);
}

console.log(`\nSuccessfully unpacked ${count} files into: ${outputDir}`);
