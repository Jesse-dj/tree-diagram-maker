import { Text } from '@codemirror/state'

// Define the function to create an HTML list tree structure
function createFolderTree(text: Text): string {
    // Call the recursive function starting from the first line and level 0
    return `<div class="folder-tree"><ul>${buildTree(text, 0, 0).html}</ul></div>`;
}

// Recursive function to build the tree
function buildTree(text: Text, currentLine: number, currentIndent: number): { html: string, nextLine: number } {
    let html = "";
    const lineCount = text.lines;

    while (currentLine < lineCount) {
        // Retrieve the current line's text
        const line = text.line(currentLine + 1).text;

        // Calculate indentation level (number of leading spaces / 2)
        const indentLevel = line.match(/^\s*/)?.[0].length ?? 0;
        
        if (indentLevel < currentIndent) {
            // If current line's indent is less than the current level, backtrack
            break;
        } else if (indentLevel === currentIndent) {
            // Add line as a list item if it matches current level
            if (line.trim().endsWith(':')){
                html += `<li class="folder"><span class="text">${sanitize(line.trim())}</span></li>`;
            } else if(line.trim().startsWith('-')){
                html += `<li class="file"><span class="text">${sanitize(line.trim())}</span></li>`;
            }

            currentLine++;
        } else {
            // If indentation increased, create a nested list recursively
            const { html: nestedHtml, nextLine } = buildTree(text, currentLine, indentLevel);
            html += `<li><ul>${nestedHtml}</ul></li>`;
            currentLine = nextLine;
        }
    }

    // Return HTML and the line we ended on
    return { html, nextLine: currentLine };
}

function sanitize(line: string): string {
  return line.trim().replace('-','').replace(':','')
}

export { createFolderTree }
