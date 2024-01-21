// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import {TEST, APIKEY} from './env';
import { registerCommands } from './OutputPanel';
import { register } from 'module';
import { registerNotes } from './markdown_parser';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const openai = new OpenAI({
		apiKey: APIKEY
	});

	const model = "gpt-4-1106-preview";
	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "open-ai-integration" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand

	// Displays the latest clipboard entry in an popup info box
	let getClipboardText = vscode.commands.registerCommand('open-ai-integration.getClipboardText', () => {
		vscode.env.clipboard.readText().then((text) => {
			vscode.window.showInformationMessage(text);
		});
	});

	context.subscriptions.push(getClipboardText);

	// Opens a new custom panel that displays basic HTML
	let openCustomPanel = vscode.commands.registerCommand('open-ai-integration.openCustomPanel', () => {
		const panel = vscode.window.createWebviewPanel(
            'customWindow', // Identifies the type of the webview. Used internally
            'Custom Window', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {} // Webview options. More on these later.
        );

        // Set the webview's initial html content
        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(openCustomPanel);

	// Returns the basic HTML contents.
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

	registerCommands(context, openai, model);	
	registerNotes(context, openai, model);

}


// This method is called when your extension is deactivated
export function deactivate() {}
