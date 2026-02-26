import fs from 'node:fs';
import path from 'node:path';

export function remarkPatternTemplate() {
    return (tree, file) => {
        // Only process MDX files in the patterns directory
        const normalizedPath = file.path.replace(/\\/g, '/');
        if (!normalizedPath.includes('/patterns/')) return;

        function transform(node) {
            if (node.children && node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];

                    if (
                        child.type === 'mdxJsxFlowElement' &&
                        child.name === 'PatternTemplate'
                    ) {
                        const baseKeyAttr = child.attributes.find(a => a.name === 'baseKey');
                        const baseKey = baseKeyAttr?.value;

                        if (!baseKey) {
                            console.warn(`[remarkPatternTemplate] Missing baseKey in ${file.path}`);
                            continue;
                        }

                        // Determine locale from file path
                        const locale = normalizedPath.includes('/en/') ? 'en' : 'ru';

                        // Read i18n data
                        try {
                            const i18nPath = path.join(process.cwd(), 'src', 'content', 'i18n', `${locale}.json`);
                            if (!fs.existsSync(i18nPath)) {
                                console.error(`[remarkPatternTemplate] i18n file NOT found: ${i18nPath}`);
                                continue;
                            }

                            const i18nData = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));
                            const getUI = (key) => i18nData[`ui.layout.${key}`] || key;
                            const getVal = (field) => i18nData[`${baseKey}.${field}`] || `${baseKey}.${field}`;

                            const sections = [
                                { id: "definition", field: "definition" },
                                { id: "principle", field: "principle" },
                                { id: "structure", field: "structure" },
                                { id: "usage", field: "usage" },
                                { id: "pros", field: "pros" },
                                { id: "cons", field: "cons" },
                                { id: "related", field: "related" },
                            ];

                            const newNodes = [];

                            for (const section of sections) {
                                newNodes.push({
                                    type: 'mdxJsxFlowElement',
                                    name: 'section',
                                    attributes: [
                                        { type: 'mdxJsxAttribute', name: 'id', value: section.id }
                                    ],
                                    children: [
                                        {
                                            type: 'heading',
                                            depth: 2,
                                            children: [{ type: 'text', value: getUI(section.id) }],
                                            data: {
                                                id: section.id,
                                                hProperties: { id: section.id }
                                            }
                                        },
                                        {
                                            type: 'paragraph',
                                            children: [{ type: 'text', value: getVal(section.field) }]
                                        }
                                    ]
                                });
                            }

                            // Replace the <PatternTemplate /> with generated nodes
                            node.children.splice(i, 1, ...newNodes);
                            // Adjust index to skip processed nodes
                            i += newNodes.length - 1;

                        } catch (e) {
                            console.error(`[remarkPatternTemplate] Error processing ${file.path}:`, e);
                        }
                    } else {
                        // Recursively transform children
                        transform(child);
                    }
                }
            }
        }

        transform(tree);
    };
}
