// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
let fs = require("fs");
const CSS_LINK_TAG_REGEX = /<.*?rel="stylesheet".*?href=".*?.css".*?>|<.*?href=".*?.css".*?rel="stylesheet".*?>/gm;
const CSS_FILE_NAME_REGEX = /(?<=href=").*?(?=")/gm;
const CURRENT_FOLDER_REGEX = /.*(?<=\/)/gm;

const findCSSPath = (HTML_DATA) => {
  const STYLE_LINK = HTML_DATA.match(CSS_LINK_TAG_REGEX)[0];
  const CSS_FILE_NAME = STYLE_LINK.match(CSS_FILE_NAME_REGEX)[0];
  const PATH_TO_CSS = CURRENT_FOLDER + CSS_FILE_NAME;
  return PATH_TO_CSS;
}

const mergeHTMLCSS = (HTML_DATA, CSS_CODE) => {
  const SPLITTED_HTML_DATA = HTML_DATA.split("<head>");
  const EXPORT_HTML_CODE = SPLITTED_HTML_DATA[0] + "<head>\n" + "<style>\n" + CSS_CODE + "</style>\n" + SPLITTED_HTML_DATA[1];
  return EXPORT_HTML_CODE;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  let disposable = vscode.commands.registerCommand('internal-css.bundle', function () {
    // vscode.window.showInformationMessage('Hello World from Internal CSS!');
    let editor = vscode.window.activeTextEditor;
    const CURRENT_FILE_PATH = editor.document.uri.path.substring(1);
    const CURRENT_FOLDER = CURRENT_FILE_PATH.match(CURRENT_FOLDER_REGEX)[0];
    const EXPORT_FILE_NAME = CURRENT_FOLDER + "index1.html";
    try {
      const HTML_DATA = fs.readFileSync(CURRENT_FILE_PATH, 'utf8');
      let PATH_TO_CSS = findCSSPath(HTML_DATA);
      let CSS_CODE = fs.readFileSync(PATH_TO_CSS, 'utf8');
      const EXPORT_HTML_CODE = mergeHTMLCSS(HTML_DATA, CSS_CODE);
      fs.writeFile(EXPORT_FILE_NAME, EXPORT_HTML_CODE, function (err) {
        if (err) {
          return console.log(err);
        }
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
