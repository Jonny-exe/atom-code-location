'use babel';
const {
  CompositeDisposable,
  Point,
  Emitter,
  Cursor,
  TextEditor
} = require('atom');

module.exports = class Entry {

  static deserialize(state) {
    return new Entry({
      editor: itemForURI(state.URI),
      point: Point.fromObject(state.point),
      URI: state.URI
    })
  }
};

export default class MyPackageTestView {
  constructor(statusBar, point, cursor) {
    console.log("this is the point: " + point);
    this.onPositionChange = new onPositionChange(statusBar);
  }
}

class onPositionChange {

  constructor(statusBar, point, cursor) {
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
    editor = atom.workspace.getActiveTextEditor();
    this.editor = editor;
    this.point = editor.getCursorBufferPosition();
    console.log("this is the point: " + this.point);
    this.marker = editor.markBufferPosition(this.point);
    this.statusBar = statusBar;
    lastIndentation = null;
    this.setStatusBar();
    this.onchange(this.point);
  }

  setStatusBar() {
    //Create all the elements to display the number in the status bar
    this.element = document.createElement('div');
    const content = this.getIndentation();

    this.element.classList.add('inline-block');
    this.element.textContent = content;
    console.log('Im here');
    this.statusBar.addLeftTile({
      item: this.element,
      priority: 1000
    });
  }

  // onchange() {
  //   console.log("Editor changed");
  //   editor.onDidChangeCursorPosition(this.setStatusBar);
  // }

  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  start() {}

  //Everything to get the indentatino of the line I'm on

  indentationForBufferRow(bufferRow) {
    return this.indentLevelForLine(this.lineTextForBufferRow(bufferRow));
  }

  indentLevelForLine(line) {
    const tabLength = this.getTabLength();
    let indentLength = 0;
    for (let i = 0, {
        length
      } = line; i < length; i++) {
      const char = line[i];
      if (char === '\t') {
        indentLength += tabLength - (indentLength % tabLength);
      } else if (char === ' ') {
        indentLength++;
      } else {
        break;
      }
    }
    return indentLength / tabLength;
  }

  getIntentLevel(text, tabLength) {
    const intentMatch = text.match(/^\t*( +)/);
    const spaces = intentMatch[1];
    const spacesLevel = spaces.length / tabLength;

    return (intentMatch[0].length - spaces.length) + spacesLevel;
  }

  lineTextForBufferRow(bufferRow) {
    return this.buffer.lineForRow(bufferRow);
  }

  getTabLength() {
    return this.displayLayer.tabLength;
  }

  getBufferRow() {
    return this.getBufferPosition().row;
  }

  getBufferPosition(point) {
    console.log(this.getBufferPosition);
    console.log("It still works here.");
    return this.marker.getHeadBufferPosition();
  }

  getCurrentBufferLine() {
    return editor.lineTextForBufferRow(this.getBufferRow());
  }

  getIndentation(point) {
    console.log("Get indentation has been called");
    return this.getIntentLevel(this.getCurrentBufferLine(point), 1);
  }
  getResult() {
    if (this.getIndentation() != 0 || (this.getIndentation() == 0 && this.getCurrentBufferLine() != "")) {
      if (this.getIndentation() < lastIndentation || lastIndentation == null) {
        lastIndentation = this.getIndentation();
      }
    }
  }

  getNewValue() {
    this.onPositionChange = new newOnchange(this.statusBar);
  }
  //
  // onDidChangeCursorPosition(callback) {
  //   return this.emitter.on('did-change-cursor-position', this.getNewValue);
  // }

  // onDidChangePosition(callback) {
  //   this.emitter = new Emitter();
  //   console.log("New emitter");
  //   return this.emitter.on('did-change-position', callback);
  // }

  onchange(point) {
    console.log('onchange');
    editor.onDidChangeCursorPosition(this.setStatusBar);
  }
}
