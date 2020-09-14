'use babel';

import {
  Point
} from 'atom';

export default class LocationFinderView {

  constructor(statusBar, cursor, editor,  marker) {
    // Create root element

    this.marker = marker;
    this.cursor = cursor;
    this.statusBar = statusBar;
    this.element = document.createElement('div');
    // this.iconElement = document.createElement('span');
    // this.iconElement.classList.add('location-finder');
    var hi = this.getLocation();
    this.element.classList.add('inline-block');
    this.element.textContent = hi;
    // this.element.appendChild(this.iconElement)
    //TODO: make this display something, and then display where you are in your code.
    console.log('Im here');
    this.statusBar.addLeftTile({
      item: this.element,
      priority: 1000
    });
    // Create message element
    // const message = document.createElement('span');
    // message.textContent = 'The LocationFinder package is Alive! It\'s ALIVE!';
    // message.classList.add('message');
    // this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  start() {

  }

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

  getScreenRow() {
    return this.getScreenPosition().row;
  }

  getBufferPosition() {
    return this.marker.getHeadBufferPosition();
  }


  getScreenPosition() {
    return this.cursor.marker.getHeadScreenPosition();
  }

  getCurrentBufferLine() {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      return editor.lineTextForBufferRow(this.getBufferRow());
    }

  }

  getLocation() {
    return this.getIntentLevel(
      this.getCurrentBufferLine(), 1);
  }

}
