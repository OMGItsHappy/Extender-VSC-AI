import * as vscode from 'vscode';
import OpenAI from 'openai';

export function registerCommands(
    context : vscode.ExtensionContext, 
    openai : OpenAI, 
    model : string =  "gpt-4-1106-preview"
    ){

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

    function clearOutputPanelAndShow(outputPanel : vscode.OutputChannel) {
        outputPanel.clear();
        outputPanel.show();
    }

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

    let openAIExplainInOutputPanel = vscode.commands.registerCommand('open-ai-integration.openAIExplainInOutputPanel', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);

            clearOutputPanelAndShow(customOutputPanel);

            customOutputPanel.appendLine("Please wait while \"I\" think...");

            const response = await chat(openai, model, "Please explain this: " + selectedText);
            
            customOutputPanel.appendLine(response);
        }
    });

    let checkForErrors = vscode.commands.registerCommand('open-ai-integration.checkForErrors', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);
            const fileName = editor.document.fileName;

            const extension = fileName.split('.').pop();

            clearOutputPanelAndShow(customOutputPanel);

            customOutputPanel.appendLine("Please wait while \"I\" think...");

            const response = await chat(
                openai, 
                model, 
                `Please check for errors; 
                Explain any that occur. 
                Please respond in proper language specifc syntax.
                The language is ${extension}: \n\n\`\`\`${selectedText}\`\`\``);
            
            customOutputPanel.appendLine(response);
        }
    });

    let documentThis = vscode.commands.registerCommand('open-ai-integration.documentThis', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);

            clearOutputPanelAndShow(customOutputPanel);

            customOutputPanel.appendLine("Please wait while \"I\" think...");
            
            const response = await openai.chat.completions.create({
                messages:[{role: "user", content: "Please provide thorough documentation on this code as a comment matching the language. If a function make sure to list any inputs and outputs that may be provided: \n\n" + selectedText}],
                model: model
            });

            // output above the selection
            const startPosition = editor.selection.start;
            const printingPosition = startPosition.with({line: startPosition.line, character: 0});

            const outputText = response.choices[0].message.content ?? "There was an error";
            // add a newline above
            editor.edit((textEdit) => {
                textEdit.insert(startPosition, outputText + "\n");
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
    
    
    
    context.subscriptions.push(
        optionSelector, 
        showOutputPanel, 
        clearOutputPanel, 
        hideOutputPanel, 
        openAIExplainInOutputPanel, 
        checkForErrors, 
        documentThis
    );
}