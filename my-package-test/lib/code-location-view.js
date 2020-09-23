'use babel';
/*jshint esversion: 6 */

//import all necesary stuff

const {
  CompositeDisposable,
  Point,
  Emitter,
  Cursor,
  TextEditor,
  Disposable
} = require('atom');

// This is the only class I call from the other file
// Here I define some base vars and I call the onchange classes

export default class CodeLocation {
  constructor(statusBar, point, cursor) {
    element = document.createElement('div');
    element.classList.add('inline-block');
    element.classList.add('element');
    enders = "()[]{}";
    separator = " → ";
    stop = false;
    this.onPositionChange = new onPositionChange(statusBar);
    this.onChange = new onChange(statusBar);

    // this.onPositionChange.onchange(this.onPositionChange.onchange(this.onPositionChange.setStatusBar));

  }
}

// This is the onChange class, here I do and onCursorChange and a on panelChange

class onChange {
  constructor(statusBar, point, cursor) {
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
    this.statusBar = statusBar;
    this.onchange(this.statusBar);
    this.onPanelChange(this.statusBar);
  }
  onchange(statusBar) {
    if (editor != undefined) {
      editor.onDidChangeCursorPosition(
        function(event) {
          new onPositionChange(statusBar);
          stop = false;
        }
      );
    } else console.log('undefined');
  }
  onPanelChange(statusBar) {
    atom.workspace.onDidChangeActivePaneItem(
      function() {
        editor = atom.workspace.getActiveTextEditor();
        if (editor != undefined) {
          editor.onDidChangeCursorPosition(
            function(event) {
              new onPositionChange(statusBar);
              stop = false;
            }
          );
        }
      }
    );
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      if (typeof this.disposalAction === "function") {
        this.disposalAction();
      }
      this.disposalAction = null;
    }
  }
}

// This is the class to get the location

class onPositionChange {

  // I define some base vars, that have to be updated: markerPosition, editor...

  constructor(statusBar, point, cursor) {
    dontStop = true;
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
    editor = atom.workspace.getActiveTextEditor();
    this.editor = editor;
    if (editor != undefined) {
      thisPoint = editor.getCursorBufferPosition();
      this.marker = editor.markBufferPosition(thisPoint);
    } else dontStop = false;
    this.statusBar = statusBar;
    lastIndentation = null;
    notEmpty = true;
    displayElement = [];
    displayString = "";
    lastElement = "";

    // If the editor is not a writeable pane it wont start

    if (dontStop) {
      this.setStatusBar();
    }
  }

  setStatusBar(event) {

    // Here I insert the value into the statusBar

    const content = this.getResult();
    element.textContent = content;
    this.statusBar.addLeftTile({
      item: element,
      priority: 1000
    });
  }

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

  // The main function to get the indentation

  getIndentation(point) {
    if (this.getCurrentBufferLine(point) != undefined) {

        if (this.getCurrentBufferLine(point)[0] != "" && this.getCurrentBufferLine(point)[0] == ' ') {
          return this.getIntentLevel(this.getCurrentBufferLine(point), 1);
        } else if (this.getCurrentBufferLine(newPoint)[0] == "") {
          return 'Empty';
        } else {
          return 0;
        }
      }
    }

    // This is only if the cursor is on a line that ends with ),}

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
      return lastElement;
    }

    // This gets the location

    getResult(point) {
      newPoint = this.getBufferRow();
      newCollum = this.getBufferColumn();
      getCurrentBufferLine = this.getCurrentBufferLine(newPoint);
      getIndentation = this.getIndentation(newPoint);

      if (getIndentation != 0 || (getIndentation == 0 && this.getCurrentBufferLine() != "")) {
        newPoint = this.getBufferRow();
        lastIndentation = getIndentation;

        if ((this.getIndentation(newPoint + 1) > getIndentation) &&
          enders.includes(getCurrentBufferLine[getCurrentBufferLine.length - 1]) &&
          newCollum == getCurrentBufferLine.length) {
          displayElement.push(this.getFirstWord());
        }

        while (!stop) {
          getIndentation = this.getIndentation(newPoint);
          getCurrentBufferLine = this.getCurrentBufferLine(newPoint);

          if (getIndentation == 0 && getCurrentBufferLine != "") {
            stop = true;
          }
          if (newPoint == 0 || newPoint < 0) {
            stop = true;
          }
          if ((getIndentation < lastIndentation) && getCurrentBufferLine != "") {
            displayElement.push(this.getFirstWord());
          }
          newPoint--;
        }
      }

      //This is to get all the elements a put them in a string

      displayElement.reverse();

      for (let i = 0; i < displayElement.length; i++) {
        displayString += displayElement[i] + separator;
      }

      // returns the value that goes in the statusBar

      return displayString;

    }

  }
