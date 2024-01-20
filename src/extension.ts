// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import {TEST, APIKEY} from './env';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const openai = new OpenAI({
		apiKey: APIKEY
	});
	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "open-ai-integration" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('open-ai-integration.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const message = TEST || 'Default message';
		vscode.window.showInformationMessage(message);
	});

	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('open-ai-integration.showSelection', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selectedText = editor.document.getText(editor.selection);
			vscode.window.showInformationMessage(selectedText);
		}
	});

	context.subscriptions.push(disposable2);

	let getClipboardText = vscode.commands.registerCommand('open-ai-integration.getClipboardText', () => {
		vscode.env.clipboard.readText().then((text) => {
			vscode.window.showInformationMessage(text);
		});
	});

	context.subscriptions.push(getClipboardText);

	let openAIHelloWorld = vscode.commands.registerCommand('open-ai-integration.openAIHelloWorld', async () => {
		const response = await openai.chat.completions.create({
			messages: [{ role: 'user', content: 'Say this is a test, Hello World!' }],
    		model: 'gpt-3.5-turbo',
		});

		if (response.choices[0].message) {
			vscode.window.showInformationMessage(response.choices[0].message.content?.toString() || 'No message');
		}
	});

	context.subscriptions.push(openAIHelloWorld);

	let openAIExplain = vscode.commands.registerCommand('open-ai-integration.openAIExplain', async () => {
		vscode.env.clipboard.readText().then(async (text) => {
			const response = await openai.chat.completions.create({
				messages:[{role: "user", content: "please explain this: " + text}],
				model: 'gpt-3.5-turbo'
			});

			if (response.choices[0].message) {
				vscode.window.showInformationMessage(response.choices[0].message.content?.toString() || 'No message');
			}
		});
	});

	context.subscriptions.push(openAIExplain);

	let openCustomPanel = vscode.commands.registerCommand('open-ai-integration.openCustomPanel', () => {
		const panel = vscode.window.createWebviewPanel(
            'customWindow', // Identifies the type of the webview. Used internally
            'Custom Window', // Title of the panel displayed to the user
            vscode.ViewColumn.Nine, // Editor column to show the new webview panel in.
            {} // Webview options. More on these later.
        );

        // Set the webview's initial html content
        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(openCustomPanel);

	function getWebviewContent() {
		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Custom Window</title>
			</head>
			<body>
				<h1>Hello from the Custom Window!</h1>
			</body>
			</html>`;
	}

	let customOutputPanel = vscode.window.createOutputChannel('Custom Output');

	let showOutputPanel = vscode.commands.registerCommand('open-ai-integration.showOutputPanel', () => {
		customOutputPanel.show();
	});

	let hideOutputPanel = vscode.commands.registerCommand('open-ai-integration.hideOutputPanel', () => {
		customOutputPanel.hide();
	});

	let appendOutputPanel = vscode.commands.registerCommand('open-ai-integration.appendOutputPanel', () => {
		customOutputPanel.appendLine('Hello World!');
	});

	context.subscriptions.push(showOutputPanel, hideOutputPanel, appendOutputPanel);
}


// This method is called when your extension is deactivated
export function deactivate() {}
