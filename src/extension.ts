// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import {TEST, APIKEY} from './env';
import { registerPanels} from './OutputPanel';
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

	registerPanels(context, openai, model);	
	registerNotes(context, openai, "gpt-4");

}


// This method is called when your extension is deactivated
export function deactivate() {}
