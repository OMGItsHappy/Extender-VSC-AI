import * as fs from 'fs';
import * as vscode from 'vscode';
import OpenAI from 'openai';
import { chat, noteToString, notesToString } from './utils';

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
function getNotes(markdown: String) {
    const lines = markdown.split('\n');

    var notes = Array();
    
    // Loop over each line to check if there is a new header
    for (let i = 0; i < lines.length; i++) {
        // If we have a header
        if (lines[i].startsWith('#')) {
            var name = lines[i].trim();
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
                response: ""
            });
        }
    }

    return notes;
}

export function registerNotes(
    context : vscode.ExtensionContext, 
    openai : OpenAI, 
    model : string =  "gpt-3.5-turbo"
    ){

    let notesHelp = vscode.commands.registerCommand('open-ai-integration.notesHelp', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
            statusBarItem.text = "Generateing notes...";
            statusBarItem.show();

            const fileName = editor.document.fileName;
            if (fileName.split('.').pop() !== "md") {
                vscode.window.showErrorMessage("Please select a markdown file");
                return;
            }

            const fullText = editor.document.getText();

            var notesData = getNotes(fullText || "");

            

            for (let i = 0; i < notesData.length; i++) {
                let note = notesData[i];
                
                const message = 
                "Please help me get started. This is the title of the note: " + 
                note.name + 
                "\n\nAnd here is a description: " + 
                note.text +
                "\n\nPlease only respond with your response, do not include the prompt. DO NOT RESPOND WITH ANYTHING I SENT YOU IN YOUR RESPONE. \
                Thank you. I will not add any futher information.\
                Please use markdown syntax in your response! Your response will be displayed in a markdown file. Wrap your response in a block quote.";
            
                statusBarItem.text = "Generating note " + (i + 1) + " of " + notesData.length + "...";

                const response = await chat(openai, model, message);

                notesData[i].response = response;

                editor.edit((textEdit) => {
                    let notesText = notesToString(notesData);
                    textEdit.replace(new vscode.Range(0, 0, notesText.length, 0), notesText);
                });
            }

            // output above the selection

            statusBarItem.text = "done";
            statusBarItem.hide();
        }
    });

    context.subscriptions.push(notesHelp);
}
//console.log(getNotes(markdown));