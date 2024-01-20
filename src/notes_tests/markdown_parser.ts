import * as fs from 'fs';

var markdown = "";

markdown = fs.readFileSync('/Users/oliver/repos/VSC-AI-Extension/open-ai-integration/notes_tests/test.md', 'utf8');

const lines = markdown.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#')) {
        
    }
}