import 'es6-shim';
import {Component, provide} from '@angular/core';
import {ionicBootstrap, Platform, App, MenuController} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Page1} from './pages/page1/page1';
import {Page3} from './pages/page3/page3';
import {LoginPage} from './pages/loginPage/loginPage';
import {ProfilePage} from './pages/profilePage/profilePage';
import {ContactsPage} from './pages/contactsPage/contactsPage';
import {PendingInvitesPage} from './pages/pendingInvitesPage/pendingInvitesPage';
import {SettingsPage} from './pages/settingsPage/settingsPage';
import {DiscoverUsersPage} from './pages/discoverUsersPage/discoverUsersPage';

import {ContactsService} from './services/contacts.service';
import {StorageService} from './services/storage.service';
import {PreferencesService} from './services/preferences.service';
import {UserInfoService} from './services/userInfo.service';

import {Http} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {AuthService} from './services/auth.service';
import {Secret} from './secrets/secret';


@Component({
  templateUrl: 'build/app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  //this gets injected into constructor below, it's the order that matters
  static get parameters() {
    return [[App], [Platform], [MenuController], [PreferencesService], [AuthService], [UserInfoService]];
  }

  constructor(app, platform, menu, preferencesService, auth, userInfoService) {
    this.app = app;
    this.platform = platform;
    this.menu = menu;
    this.preferencesService = preferencesService;
    this.userInfoService = userInfoService;
    this.auth = auth;
    this.initializeApp();

    // set our app's pages (they appear in menu)
    this.primaryPages = [
        { title: 'My Profile', component: ProfilePage, icon: 'person' },
        { title: 'My Contacts', component: ContactsPage, icon: 'contacts' },
        { title: 'Pending Invites', component: PendingInvitesPage, icon: 'person-add' },
        { title: 'Discover Users', component: DiscoverUsersPage, icon: 'people' }
    ];

    this.settingsPages = [
        { title: 'Settings', component: SettingsPage, icon: 'settings' }
    ];

    this.rootPage = LoginPage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.userInfoService.initialize();
      this.preferencesService.initializePreferences();
      this.auth.startupTokenRefresh();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    //let nav = this.app.getComponent('nav');
    this.nav.setRoot(page.component);
  }

  sendFeedback(){
    window.open(
      'mailto:' + Secret.FEEDBACK_EMAIL +
      '?subject=' + Secret.FEEDBACK_SUBJECT, '_system');
  }
}

//https://github.com/driftyco/ionic/blob/2.0/CHANGELOG.md#steps-to-upgrade-to-beta-8
ionicBootstrap(MyApp,
  [
    ContactsService,
    StorageService,
    PreferencesService,
    UserInfoService,
    provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({noJwtError: true}), http);
      },
      deps: [Http]
    }),
    AuthService
  ],
  {

  }
); // http://ionicframework.com/docs/v2/api/config/Config/);
