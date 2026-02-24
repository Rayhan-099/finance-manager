import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

function fixDir(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
        const fullPath = join(dir, file);
        if (statSync(fullPath).isDirectory()) {
            fixDir(fullPath);
        } else if (file.endsWith('.jsx')) {
            let content = readFileSync(fullPath, 'utf8');

            // Replace bg-[rgba]
            content = content.replace(/bg-\[rgba\([^\]]+\)\]/g, 'bg-white/5');
            // Replace border-[rgba]
            content = content.replace(/border-\[rgba\([^\]]+\)\]/g, 'border-white/10');
            // Replace shadow
            content = content.replace(/shadow-\[[^\]]+\]/g, 'shadow-lg');

            writeFileSync(fullPath, content);
        }
    }
}

fixDir('src');
console.log('Fixed all .jsx files');
