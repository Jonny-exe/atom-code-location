'use babel';

import LocationFinderView from './location-finder-view';
import { CompositeDisposable } from 'atom';


export default {

  locationFinderView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {


  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.locationFinderView.destroy();
  },

  serialize() {
    return {
      locationFinderViewState: this.locationFinderView.serialize()
    };
  },

  consumeStatusBar(statusBar) {
    this.locationFinderView = new LocationFinderView(statusBar)
    this.locationFinderView.start()
  }
};
