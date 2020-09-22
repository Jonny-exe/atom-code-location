'use babel';
const {
  CompositeDisposable,
  Point,
  Emitter,
  Cursor,
  TextEditor,
  Disposable
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
    enders = "()[]{}"
    console.log(enders);
    separator = " → "
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
    this.onPanelChange(this.statusBar);
  }
  onchange(statusBar) {
    editor.onDidChangeCursorPosition(
      function(event) {
        new onPositionChange(statusBar);
        stop = false;
      }
    );
  }
  onPanelChange(statusBar) {
    atom.workspace.onDidChangeActivePaneItem(
      function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.onDidChangeCursorPosition(
          function(event) {
            new onPositionChange(statusBar);
            stop = false;
          }
        );
      }
    );
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = true
      if (typeof this.disposalAction === "function") {
        this.disposalAction()
      }
      this.disposalAction = null
    }
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
    displayElement = [];
    displayString = "";
    notEmpty = true;
    lastElement = "";
    this.setStatusBar();
    // this.getResult();
    // this.onchange();
  }

  setStatusBar(event) {
    //Create all the elements to display the number in the status bar
    const content = this.getResult();
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

  getBufferColumn() {
    return this.getBufferPosition().column;
  }

  getBufferPosition(point) {
    return this.marker.getHeadBufferPosition();
  }

  getCurrentBufferLine(point) {
    return editor.lineTextForBufferRow(point);
  }

  getIndentation(point) {
    // console.log('this is the get inddentation point: ' + point);
    if (this.getCurrentBufferLine(point)[0] != "" && this.getCurrentBufferLine(point)[0] == ' ') {

      return this.getIntentLevel(this.getCurrentBufferLine(point), 1);
    } else if (this.getCurrentBufferLine(newPoint)[0] == "") {
      return 'Empty';
    } else {
      return 0;
    }
  }

  getFirstWord() {
    lastIndentation = getIndentation;
    splitLine = getCurrentBufferLine.split(" ");
    num = 0;
    while (notEmpty) {
      lastElement = splitLine[num];
      if (lastElement != "") {
        notEmpty = false;
      }
      num++;
    }
    notEmpty = true;
    return lastElement
  }


  getResult(point) {
    newPoint = this.getBufferRow();
    newCollum = this.getBufferColumn();
    getCurrentBufferLine = this.getCurrentBufferLine(newPoint);
    getIndentation = this.getIndentation(newPoint, getCurrentBufferLine);
    if (getIndentation != 0 || (getIndentation == 0 && this.getCurrentBufferLine() != "")) {
      newPoint = this.getBufferRow();
      lastIndentation = getIndentation;
      console.log(newCollum + " line: " + getCurrentBufferLine.length)
      if ((this.getIndentation(newPoint + 1) > getIndentation) &&
        enders.includes(getCurrentBufferLine[getCurrentBufferLine.length - 1]) &&
        newCollum == getCurrentBufferLine.length) {
        displayElement.push(this.getFirstWord());
      }
      while (stop == false) {
        getIndentation = this.getIndentation(newPoint);
        getCurrentBufferLine = this.getCurrentBufferLine(newPoint);
        if (getIndentation == 0 && getCurrentBufferLine != "") {
          console.log('stop 1');
          stop = true;
        }
        if (newPoint == 0 || newPoint < 0) {
          console.log('stop 2');
          stop = true;
        }
        if ((getIndentation < lastIndentation) && getCurrentBufferLine != "") {
          displayElement.push(this.getFirstWord());
        }
        newPoint--;
      }
    }
    displayElement.reverse();
    for (let i = 0; i < displayElement.length; i++) {
      displayString += displayElement[i] + separator;
    }
    // displayString = JSON.stringify(displayElement);
    return displayString;
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