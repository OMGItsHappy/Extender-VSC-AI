// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import {TEST} from './env';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	

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
}	

// This method is called when your extension is deactivated
export function deactivate() {}
