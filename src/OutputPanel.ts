import * as vscode from 'vscode';
import OpenAI from 'openai';
import { getNotes } from './markdown_parser';

/**
 * Registers a set of Visual Studio Code commands for integration with OpenAI.
 * 
 * @param {vscode.ExtensionContext} context - The context in which the extension is executed.
 * This is provided by the Visual Studio Code extension runtime.
 * @param {OpenAI} openai - An instance of the OpenAI class that allows interaction with the OpenAI API.
 * @param {string} model - The AI model to be used for OpenAI queries. 
 * Defaults to "gpt-3.5-turbo" if not specified.
 */
export function registerCommands(
    context : vscode.ExtensionContext, 
    openai : OpenAI, 
    model : string =  "gpt-3.5-turbo"
    ){


    // Functions to work with this custom ouptut channel
    let customOutputPanel = vscode.window.createOutputChannel('Custom Output');

    let showOutputPanel = vscode.commands.registerCommand('open-ai-integration.showOutputPanel', () => {
        customOutputPanel.show();
    });

    let hideOutputPanel = vscode.commands.registerCommand('open-ai-integration.hideOutputPanel', () => {
        customOutputPanel.hide();
    });

    let clearOutputPanel = vscode.commands.registerCommand('open-ai-integration.clearOutputPanel', () => {
        customOutputPanel.clear();
    });

    // Resets the custom output panel
    function clearOutputPanelAndShow(outputPanel : vscode.OutputChannel) {
        outputPanel.clear();
        outputPanel.show();
    }

    /**
     * This function asynchronously requests a chat completion from the OpenAI API using a specified model and user input text. 
     * It returns the AI's response as a string.
     * 
     * @param {OpenAI} openai - An instance of the OpenAI class, initialized with necessary API keys and configurations.
     * @param {string} modelToUse - (Optional) The ID of the model to use for generating the response. Defaults to a variable 'model'.
     * @param {string} text - The input text from the user that will be sent to the model as a prompt.
     * 
     * @returns {Promise<string>} A Promise that resolves to the string of the AI's response. If the AI returns no message or no response,
     * the function will return a default response message indicating the absence of content.
     * 
     * Example usage:
     * 
     * (async () => {
     *     const openai = new OpenAI(apiKey); // Create a new OpenAI instance with the required API key.
     *     const userText = "Hello, how are you?";
     *     const response = await chat(openai, "gpt-3.5-turbo", userText); // Call the chat function with user text.
     *     console.log(response); // Log the AI's response.
     * })();
     * 
     * Function implementation:
     * 
     * 1. It initiates an asynchronous operation using the "await" keyword.
     * 2. It sends a POST request to the OpenAI API's chat completions endpoint with a message object containing the input text and a model to use.
     * 3. The function waits for the API's response, which contains the AI-generated text.
     * 4. Once received, it checks if there is a message within the first choice object of the response.
     * 5. If a message exists, it extracts the content of the message, converts it to a string, and returns it.
     * 6. If there is no message content or if OpenAI's response does not contain a message, it returns a default message.
     * 
     * Note: Since this function uses async/await, it returns a Promise, and any caller of this function should await its result
     * or use Promises (e.g., then/catch) syntax to handle the asynchronous response.
     */
    async function chat(openai: OpenAI, modelToUse:string = model, text: string)
    {   
        const response = await openai.chat.completions.create({
            messages:[{role: "user", content: text}],
            model: modelToUse
        });

        if (response.choices[0].message) {
            let answer = response.choices[0].message.content?.toString() || 'No message';
            
            return answer;
        }
        else {
            return "No Response";
        }
    }

    // Have the OpenAI model explain what the highlighted code does and outputs it to the custom panel
    let openAIExplainInOutputPanel = vscode.commands.registerCommand('open-ai-integration.openAIExplainInOutputPanel', async () => {
        const editor = vscode.window.activeTextEditor;
        // If we are in the text editor
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);

            clearOutputPanelAndShow(customOutputPanel);

            customOutputPanel.appendLine("Please wait while \"I\" think...");
            
            // Send our selection to the chat model
            const response = await chat(openai, model, "Please explain this: " + selectedText);
            
            // Output the response
            customOutputPanel.appendLine(response);
        }
    });


    // Has the OpenAI model check selected code for erros and if there is any, have it explain them.
    let checkForErrors = vscode.commands.registerCommand('open-ai-integration.checkForErrors', async () => {
        const editor = vscode.window.activeTextEditor;
        // If we are in the text editor
        if (editor) {
            // Get the selected text and what file extension it is.
            const selectedText = editor.document.getText(editor.selection);
            const fileName = editor.document.fileName;

            const extension = fileName.split('.').pop();

            clearOutputPanelAndShow(customOutputPanel);

            customOutputPanel.appendLine("Please wait while \"I\" think...");

            // Have the chat bot review the code
            const response = await chat(
                openai, 
                model, 
                `Please check for errors; 
                Explain any that occur. 
                Please respond in proper language specifc syntax.
                The language is ${extension}: \n\n\`\`\`${selectedText}\`\`\``);
            
            // Output the response
            customOutputPanel.appendLine(response);
        }
    });

    // Have the OpenAI model create documentation for the highlighted code and paste above in place
    let documentThis = vscode.commands.registerCommand('open-ai-integration.documentThis', async () => {
        const editor = vscode.window.activeTextEditor;
        // If we are in the text editor
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);

            clearOutputPanelAndShow(customOutputPanel);

            customOutputPanel.appendLine("Please wait while \"I\" think...");
            
            // Ask the model to document the code
            const response = await openai.chat.completions.create({
                messages:[{role: "user", content: "Please provide thorough documentation on this code as a comment in the same file. Make sure that you do not write any extra markdown. Do not duplicate the code. Focus only on providing the documentation. If a function make sure to list any inputs and outputs that may be provided: \n\n" + selectedText}],
                model: model
            });

            // Output above the selection
            const startPosition = editor.selection.start;
            const printingPosition = startPosition.with({line: startPosition.line, character: 0});

            const outputText = response.choices[0].message.content ?? "There was an error";

            // Remove the first and last line of the response
            const lines = outputText.split("\n");
            lines.shift();
            lines.pop();
            const formattedOutput = lines.join("\n");
            
            // Add a newline above code
            editor.edit((textEdit) => {
                textEdit.insert(startPosition, formattedOutput + "\n");
            });
        }
    });

    let optionSelector = vscode.commands.registerCommand('open-ai-integration.optionSelector', async () => {
        const options = ["Explain This", "Check For Errors", "Document This"];

        const selectedOption = await vscode.window.showQuickPick(options, {placeHolder: "Select an option"});
        if (selectedOption) {
            switch (selectedOption) {
                case "Explain This":
                    vscode.commands.executeCommand('open-ai-integration.openAIExplainInOutputPanel');
                    break;
                case "Check For Errors":
                    vscode.commands.executeCommand('open-ai-integration.checkForErrors');
                    break;
                case "Document This":
                    vscode.commands.executeCommand('open-ai-integration.documentThis');
                    break;
            }
        }
    });

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

            function noteToString(note: {name: string, text: string, response: string}) {
                let name = note.name + "\n";
                let text = note.text.trim() + (note.text.trim() === "" ? "\n" : "\n\n");
                let response = note.response.trim() + (note.response.trim() === "" ? "" : "\n\n");
                return name + text + response;
            }
            
            function notesToString(notes: Array<{name: string, text: string, response: string}>) {
                var output = "";
                for (let i = 0; i < notes.length; i++) {
                    output += noteToString(notes[i]);
                }
                return output;
            }

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
    
    
    // Add all of the custom commands
    context.subscriptions.push(
        optionSelector, 
        showOutputPanel, 
        clearOutputPanel, 
        hideOutputPanel, 
        openAIExplainInOutputPanel, 
        checkForErrors, 
        documentThis,
        notesHelp
    );
}