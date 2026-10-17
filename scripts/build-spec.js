// Gera docs/especificacao-tecnica-mvp.js a partir do .md, para o index.html
// funcionar também quando aberto direto do disco (file://), onde fetch é bloqueado.
// Uso: node scripts/build-spec.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const md = fs.readFileSync(path.join(root, 'docs/especificacao-tecnica-mvp.md'), 'utf8');
const out = '// Gerado por scripts/build-spec.js — não edite à mão.\nwindow.SPEC_MD = ' + JSON.stringify(md) + ';\n';
fs.writeFileSync(path.join(root, 'docs/especificacao-tecnica-mvp.js'), out);
console.log('docs/especificacao-tecnica-mvp.js atualizado');
