import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

// Providers
import { ExternalLinkProvider } from '../../../../providers/external-link/external-link';
import { ShapeshiftProvider } from '../../../../providers/shapeshift/shapeshift';

@Component({
  selector: 'page-shapeshift-details',
  templateUrl: 'shapeshift-details.html',
})
export class ShapeshiftDetailsPage {

  public ssData: any

  constructor(
    private externalLinkProvider: ExternalLinkProvider,
    private navParams: NavParams,
    private shapeshiftProvider: ShapeshiftProvider,
    private viewCtrl: ViewController
  ) {
    this.ssData = this.navParams.data.ssData;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShapeshiftDetailsPage');
  }

  public remove() {
    this.shapeshiftProvider.saveShapeshift(this.ssData, {
      remove: true
    }, function (err) {
      this.cancel();
    });
  }

  public close() {
    this.viewCtrl.dismiss();
  }

  public openTransaction(id: string) {
    var url;
    if (this.ssData.outgoingType.toUpperCase() == 'BTC') {
      url = "https://explorer.dallar.org/tx/" + id;
    } else if (this.ssData.outgoingType.toUpperCase() == 'BCH') {
      url = "https://bch-insight.bitpay.com/tx/" + id;
    } else {
      return;
    }
    this.externalLinkProvider.open(url);
  }

}
