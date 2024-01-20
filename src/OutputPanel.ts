import * as vscode from 'vscode';
import OpenAI from 'openai';

export function registerCommands(
    context : vscode.ExtensionContext, 
    openai : OpenAI, 
    model : string =  "gpt-3.5-turbo"
    ){

    let customOutputPanel = vscode.window.createOutputChannel('Custom Output');

    let showOutputPanel = vscode.commands.registerCommand('open-ai-integration.showOutputPanel', () => {
        customOutputPanel.show();
    });

    let hideOutputPanel = vscode.commands.registerCommand('open-ai-integration.hideOutputPanel', () => {
        customOutputPanel.hide();
    });

    let appendOutputPanel = vscode.commands.registerCommand('open-ai-integration.appendOutputPanel', () => {
        customOutputPanel.show();
        customOutputPanel.appendLine('Hello World!');
    });

    context.subscriptions.push(showOutputPanel, hideOutputPanel, appendOutputPanel);

    let openAIExplainInOutputPanel = vscode.commands.registerCommand('open-ai-integration.openAIExplainInOutputPanel', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);

            customOutputPanel.show();
            customOutputPanel.clear();
            
            const response = await openai.chat.completions.create({
                messages:[{role: "user", content: "Please explain this: " + selectedText}],
                model: model
            });

            if (response.choices[0].message) {
                let answer = response.choices[0].message.content?.toString() || 'No message';
                
                customOutputPanel.appendLine(answer);
            }
            else {
                customOutputPanel.appendLine('No message');
            }
        }
    });

    context.subscriptions.push(openAIExplainInOutputPanel);
}