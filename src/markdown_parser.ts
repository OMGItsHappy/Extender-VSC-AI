import * as fs from 'fs';

//var markdown = "";

//markdown = fs.readFileSync('/Users/oliver/repos/VSC-AI-Extension/open-ai-integration/src/notes_tests/test.md', 'utf8');


/**
 * Extracts note objects from a given markdown text. Each note is defined by a header line starting with
 * the '#' character. The text for each note is considered as the content between this header and 
 * the next header (or the end of the input markdown). Headers themselves are excluded from the note's text. 
 * 
 * @param markdown {String} The markdown text to be processed for notes extraction.
 * 
 * @returns {Array} An array of note objects, each with a 'name' property (header text without the '#')
 * and a 'text' property (the content of the note without the starting header).
 * 
 * @example
 * // Given a markdown string called mdText with the following content:
 * // # Note1
 * // This is the text for note 1.
 * // It can span multiple lines.
 * // # Note2
 * // This is text for note 2.
 * 
 * const notesArray = getNotes(mdText);
 * // The function will return an array of objects:
 * // [
 * //   { name: 'Note1', text: 'This is the text for note 1.\nIt can span multiple lines.\n' },
 * //   { name: 'Note2', text: 'This is text for note 2.\n' }
 * // ]
 */
export function getNotes(markdown: String) {
    const lines = markdown.split('\n');

    var notes = Array();
    
    // Loop over each line to check if there is a new header
    for (let i = 0; i < lines.length; i++) {
        // If we have a header
        if (lines[i].startsWith('#')) {
            var name = lines[i].replace('#', '').trim();
            var text = "";
            var start = i;
            i++;
            
            // Loop over the following lines and if there is not another header
            // Add that line to the text block
            while (i < lines.length && !lines[i].startsWith('#')) {
                text += lines[i] + '\n';
                i++;
            }
    
            i--;
            var end = i;
            
            // Add the notes to the list
            notes.push({
                name: name,
                text: text,
                start: start,
                end: end
            });
        }
    }

    return notes;
}

//console.log(getNotes(markdown));