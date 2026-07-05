const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '../src/lib/base.html'), 'utf8');
// Must escape backslashes first so \n stays \n instead of a literal newline when the TS file is evaluated!
const escaped = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
const ts = `export const baseTemplate = \`${escaped}\`;\n`;
fs.writeFileSync(path.join(__dirname, '../src/lib/template.ts'), ts);
console.log('Template conversion done');
console.log('Done');
