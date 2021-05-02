import * as vscode from 'vscode';
import { Config } from './utils/config';
import { ThingsProvider } from './treeproviders/thingsprovider';
import { Attributes } from 'aws-sdk/clients/iot';

function listThings(config: Config) {
	let thingsprovider = new ThingsProvider(config);
	return vscode.commands.registerCommand("awsiot.listthings", () => {
		vscode.window.registerTreeDataProvider('vscode:things', thingsprovider);
	});
}

function registerProfile(config: Config) {
	return vscode.commands.registerCommand('awsiot.registerProfile', async () => {
		var creds = config.getAWSProfile();
		var profile: string | undefined;
		var region: string | undefined;
		profile = await vscode.window.showInputBox({
			prompt: "PROFILE_PROMPT",
			placeHolder: creds.profile || "default"
		});
		region = await vscode.window.showInputBox({
			prompt: "REGION_PROMPT",
			placeHolder: creds.region || "us-east-1"
		});
		if (profile !== undefined && profile.trim() !== "") {
			creds.profile = profile;
		}
		if (region !== undefined && region.trim() !== "") {
			creds.region = region;
		}
		config.setAWSProfile(creds);
	});
}

function openThingPanel() {
	return vscode.commands.registerCommand('awsiot.getThing', async (thingId: string, attributes?: Attributes) => {
		const panel = vscode.window.createWebviewPanel('awsThingDetails', thingId, vscode.ViewColumn.One, {});
		panel.webview.html = `<h1>ToImplement</h1>\n<pre>${JSON.stringify(attributes)}</pre>`;
	});
}

function registerCommands(context: vscode.ExtensionContext, config: Config) {
	const commands = Array<vscode.Disposable>();
	commands.push(registerProfile(config));
	commands.push(listThings(config));
	commands.push(openThingPanel());
	context.subscriptions.push(...commands);
}

export function activate(context: vscode.ExtensionContext) {
	var config = new Config();
	if(config.isCredentialsEmpty()){
		vscode.window.showInformationMessage("No profile registered");
	}
	registerCommands(context, config);
}

/*
	//TODO: Add a find button for things
	//TODO: Add a button for create things
	//TODO: Add a button for delete things
	//TODO: Run this command on startup
	//TODO: Create webview to subscribe messages
	//TODO: SHow subscribed topics
	//TODO: Show messages
	//TODO: Add button subscribe
*/