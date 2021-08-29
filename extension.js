// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
let fs = require("fs");
const CSS_LINK_TAG_REGEX = /<.*?rel="stylesheet".*?href=".*?.css".*?>|<.*?href=".*?.css".*?rel="stylesheet".*?>/gm;
const CSS_FILE_NAME_REGEX = /(?<=href=").*?(?=")/gm;
const CURRENT_FOLDER = editor.document.uri.path.substring(1).match(/.*(?<=\/)/gm)[0];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  let disposable = vscode.commands.registerCommand('internal-css.bundle', function () {
    // vscode.window.showInformationMessage('Hello World from Internal CSS!');
    let editor = vscode.window.activeTextEditor;
    try {
      const data = fs.readFileSync(editor.document.uri.path.substring(1), 'utf8');
      let style_link = data.match(CSS_LINK_TAG_REGEX)[0];
      let css_file_name = style_link.match(CSS_FILE_NAME_REGEX)[0];
      let path_to_css = CURRENT_FOLDER + css_file_name;
      let css = fs.readFileSync(path_to_css, 'utf8');
      const splitted_data = data.split("<head>");
      const export_data = splitted_data[0] + "<head>\n" + "<style>\n" + css + "</style>\n" + splitted_data[1];
      const export_file_name = CURRENT_FOLDER + "index1.html";
      fs.writeFile(export_file_name, export_data, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
    } catch (err) {
      console.log(err);
    }

  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
