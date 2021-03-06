import { Component } from "@angular/core";
import { Logger } from '../../../providers/logger/logger';
import { ModalController, NavController } from 'ionic-angular';

//providers
import { ProfileProvider } from '../../../providers/profile/profile';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { WalletProvider } from '../../../providers/wallet/wallet';
import { PopupProvider } from '../../../providers/popup/popup';

//pages
import { TxpDetailsPage } from '../../txp-details/txp-details';
import { TxDetailsPage } from '../../tx-details/tx-details';

import * as _ from 'lodash';

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

  public fetchingNotifications: boolean;
  public addressbook: any;
  public txps: any;
  public notifications: any;

  constructor(
    private navCtrl: NavController,
    private logger: Logger,
    private profileProvider: ProfileProvider,
    private modalCtrl: ModalController,
    private onGoingProcessProvider: OnGoingProcessProvider,
    private walletProvider: WalletProvider,
    private popupProvider: PopupProvider
  ) {
    this.fetchingNotifications = true;
  }

  ionViewDidEnter() {
    this.profileProvider.getNotifications(50).then((nData: any) => {
      this.fetchingNotifications = false;
      this.notifications = nData.notifications;
      this.profileProvider.getTxps({}).then((txpsData: any) => {
        this.txps = txpsData.txps;
      }).catch((err) => {
        this.logger.error(err);
      });
    }).catch((err) => {
      this.logger.error(err);
    });
  }

  public openNotificationModal(n: any): void {
    let wallet = this.profileProvider.getWallet(n.walletId);

    if (n.txid) {
      this.navCtrl.push(TxDetailsPage, { txid: n.txid, walletId: n.walletId });
    } else {
      let txp = _.find(this.txps, {
        id: n.txpId
      });
      if (txp) {
        let modal = this.modalCtrl.create(TxpDetailsPage, { tx: txp }, { showBackdrop: false, enableBackdropDismiss: false });
        modal.present();
      }
      else {
        this.onGoingProcessProvider.set('loadingTxInfo', true);
        this.walletProvider.getTxp(wallet, n.txpId).then((txp) => {
          let _txp = txp;
          this.onGoingProcessProvider.set('loadingTxInfo', false);
          let modal = this.modalCtrl.create(TxpDetailsPage, { tx: _txp }, { showBackdrop: false, enableBackdropDismiss: false });
          modal.present();
        }).catch((err) => {
          this.logger.warn('No txp found');
          this.popupProvider.ionicAlert('Error', 'Transaction not found'); //TODO gettextcatalog     
        });
      }
    }
  };
}