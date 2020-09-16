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
    element = document.createElement('div');
    element.classList.add('inline-block');
    element.classList.add('element');
    enders = [")", '}', ']'];
    stop = false;
    this.onPositionChange = new onPositionChange(statusBar);
    this.onChange = new onChange(statusBar);
    // this.onPositionChange.onchange(this.onPositionChange.onchange(this.onPositionChange.setStatusBar));

  }
}

class onChange {
  constructor(statusBar, point, cursor) {

    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
    this.statusBar = statusBar;
    this.onchange(this.statusBar);
  }
  onchange(statusBar) {
    editor.onDidChangeCursorPosition(
      function(event) {
        new onPositionChange(statusBar);
      }
    );
  }
}

class onPositionChange {

  constructor(statusBar, point, cursor) {
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
    editor = atom.workspace.getActiveTextEditor();
    this.editor = editor;
    thisPoint = editor.getCursorBufferPosition();
    this.marker = editor.markBufferPosition(thisPoint);
    this.statusBar = statusBar;
    lastIndentation = null;
    this.setStatusBar();
    this.getResult();
    lastIndentation = this.getIndentation();
    // this.onchange();
  }

  setStatusBar(event) {
    //Create all the elements to display the number in the status bar



    const content = this.getIndentation();

    element.textContent = content;
    this.statusBar.addLeftTile({
      item: element,
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
    if (text != "") {

      const intentMatch = text.match(/^\t*( +)/);
      const spaces = intentMatch[1];
      const spacesLevel = spaces.length / tabLength;

      return (intentMatch[0].length - spaces.length) + spacesLevel;
    } else return 0;
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
    return this.marker.getHeadBufferPosition();
  }

  getCurrentBufferLine() {
    return editor.lineTextForBufferRow(this.getBufferRow());
  }

  getCurrentBufferLineTwo(row) {
    return editor.lineTextForBufferRow(this.getBufferRow());
  }

  getIndentation(point) {
    // console.log('this is the get inddentation point: ' + point);
    if (this.getCurrentBufferLine(point)[0] != "") {
      console.log('this is the point in the indentation: ' + point);
      return this.getIntentLevel(this.getCurrentBufferLine(point), 1);
    } else return 'Empty';
  }

  getIndentationTwo(point) {
    if (this.getCurrentBufferLine(newPoint) != "" && this.getCurrentBufferLine(newPoint)[0] == " ") {
      console.log(newPoint);
      return this.getIntentLevel(this.getCurrentBufferLine(newPoint), 1);
    } else return 0;
  }

  getResult(point) {
    if (this.getIndentation() != 0 || (this.getIndentation() == 0 && this.getCurrentBufferLine() != "")) {
      newPoint = this.getBufferRow();
      while (stop == false) {
        console.log('in the while loop');
        newPoint = newPoint - 1;
        console.log("this is the newPoint var: " + newPoint);
        console.log("this is the indentation; " + this.getIndentation(newPoint));
        if (this.getIndentation() == 0 && this.getCurrentBufferLine() != "") {
          console.log('stop');
          stop = true;
        }
        if (newPoint == 0 || newPoint < 0) {
          console.log('stop');
          stop = true;
        }

        if (((this.getIndentation() < lastIndentation) && this.getCurrentBufferLine(newPoint) != "") || lastIndentation == null) {
          lastIndentation = this.getIndentation(newPoint);
          console.log("this is the lastIndentation; " + lastIndentation);
          this.getCurrentBufferLine(newPoint);
          console.log('hi' + newPoint);
        } else {

        }
      }
    }
  }

  testFunction(ev) {}

  getNewValue() {
    this.onPositionChange = new newOnchange(this.statusBar);
  }
  //
  onDidChangeCursorPosition(callback) {
    return this.emitter.on('did-change-cursor-position', this.getNewValue);
  }

  onchange(mycallback) {
    editor.onDidChangeCursorPosition(
      function(event) {
        mycallback(event)
      });
  }
}
