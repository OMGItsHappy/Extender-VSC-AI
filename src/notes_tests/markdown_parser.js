"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotes = void 0;
var fs = require("fs");
var markdown = "";
markdown = fs.readFileSync('/Users/oliver/repos/VSC-AI-Extension/open-ai-integration/src/notes_tests/test.md', 'utf8');
var lines = markdown.split('\n');
var notes = Array();
for (var i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#')) {
        var name = lines[i].replace('#', '').trim();
        var text = "";
        i++;
        while (i < lines.length && !lines[i].startsWith('#')) {
            text += lines[i] + '\n';
            i++;
        }
        i--;
        notes.push({
            name: name,
            text: text
        });
    }
}
function getNotes(markdown) {
    var lines = markdown.split('\n');
    var notes = Array();
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#')) {
            var name = lines[i].replace('#', '').trim();
            var text = "";
            i++;
            while (i < lines.length && !lines[i].startsWith('#')) {
                text += lines[i] + '\n';
                i++;
            }
            i--;
            notes.push({
                name: name,
                text: text
            });
        }
    }
    return notes;
}
exports.getNotes = getNotes;
console.log(getNotes(markdown));
