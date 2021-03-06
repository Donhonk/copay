import { Component } from "@angular/core";
import { NavController, Events } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';

//providers
import { AppProvider } from '../../../providers/app/app';
import { PersistenceProvider } from '../../../providers/persistence/persistence';

//pages
import { FeedbackPage } from '../../../pages/feedback/feedback/feedback';
import { SendFeedbackPage } from '../../../pages/feedback/send-feedback/send-feedback';

@Component({
  selector: 'page-feedback-card',
  templateUrl: 'feedback-card.html',
})
export class FeedbackCardPage {

  public appName: string;
  public score: number;
  public button_title: string;

  constructor(
    private appProvider: AppProvider,
    private navCtrl: NavController,
    private logger: Logger,
    private persistenceProvider: PersistenceProvider,
    private events: Events,
  ) {
    this.appName = this.appProvider.info.nameCase;
    this.score = 0;
  }

  public hideCard(): void {
    this.logger.debug('Feedback card dismissed.')
    this.persistenceProvider.getFeedbackInfo().then((info: any) => {
      let feedbackInfo = info;
      feedbackInfo.sent = true;
      this.persistenceProvider.setFeedbackInfo((feedbackInfo))
      this.events.publish('feedback:hide');
    });
  }

  public setScore(score: number): any {
    this.score = score;
    switch (this.score) {
      case 1:
        this.button_title = "I think this app is terrible"; //TODO gettextcatalog
        break;
      case 2:
        this.button_title = "I don't like it"; //TODO gettextcatalog
        break;
      case 3:
        this.button_title = "Meh - it's alright"; //TODO gettextcatalog
        break;
      case 4:
        this.button_title = "I like the app"; //TODO gettextcatalog
        break;
      case 5:
        this.button_title = "This app is fantastic!"; //TODO gettextcatalog
        break;
    }
  }

  public goFeedbackFlow(): void {
    this.hideCard();
    if (this.score == 5) {
      this.navCtrl.push(FeedbackPage, { score: this.score });
    } else {
      this.navCtrl.push(SendFeedbackPage, { score: this.score });
    }
  }

}
