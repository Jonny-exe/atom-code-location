'use babel';
/*jshint esversion: 6 */

import MyPackageTestView from './my-package-test-view';
import onPositionChange from './my-package-test-view';



export default {

  myPackageTestView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // this.myPackageTestView = new MyPackageTestView(state.myPackageTestViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.myPackageTestView.getElement(),
    //   visible: false
    // });
    //
    // // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    // this.subscriptions = new CompositeDisposable();
    //
    // // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'my-package-test:toggle': () => this.toggle()
    // }));
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
    this.MyPackageTestView = new MyPackageTestView(statusBar);
  }


};
