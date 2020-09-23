'use babel';

/*jshint esversion: 6 */

import CodeLocation from './code-location-view';
import onPositionChange from './code-location-view';

export default {

  myPackageTestView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.myPackageTestView.destroy();
  },

  serialize() {

  },

  toggle() {
    console.log('MyPackageTest was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  consumeStatusBar(statusBar) {
    this.CodeLocation = new CodeLocation(statusBar);
  }
};
