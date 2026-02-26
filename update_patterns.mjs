import fs from 'fs';
import path from 'path';

const mapping = {
    'creational': ['abstract-factory', 'builder', 'factory-method', 'prototype', 'singleton'],
    'structural': ['adapter', 'bridge', 'composite', 'decorator', 'facade', 'flyweight', 'proxy'],
    'behavioral': ['chain-of-responsibility', 'command', 'iterator', 'mediator', 'memento', 'observer', 'state', 'strategy', 'template-method', 'visitor'],
    'architectural': ['active-record', 'cqrs', 'event-sourcing', 'repository', 'unit-of-work']
};

const slugToType = {};
for (const [ptype, slugs] of Object.entries(mapping)) {
    for (const slug of slugs) {
        slugToType[slug] = ptype;
    }
}

const baseDirs = [
    'src/content/docs/ru/patterns',
    'src/content/docs/en/patterns'
];

function updateFile(filepath, ptype) {
    let content = fs.readFileSync(filepath, 'utf-8');

    if (content.includes('pattern_type:')) {
        return;
    }

    // Add pattern_type to frontmatter
    const newContent = content.replace(/^(---\n)([\s\S]*?)(\n---)/, `$1$2\npattern_type: ${ptype}$3`);

    fs.writeFileSync(filepath, newContent, 'utf-8');
    console.log(`Updated ${filepath}`);
}

for (const dir of baseDirs) {
    const fullDir = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(fullDir)) {
        console.log(`Directory not found: ${fullDir}`);
        continue;
    }
    const files = fs.readdirSync(fullDir);
    for (const filename of files) {
        if (filename.endsWith('.mdx')) {
            const slug = filename.replace('.mdx', '');
            if (slugToType[slug]) {
                updateFile(path.join(fullDir, filename), slugToType[slug]);
            } else {
                console.log(`No mapping for ${slug}`);
            }
        }
    }
}
