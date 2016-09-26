import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { MainPage } from './pages/main/main'
import { LightsPage } from './pages/lights/lights';
import { ShuttersPage } from './pages/shutters/shutters';
import { GroupsPage } from './pages/groups/groups';
import { SettingsPage } from './pages/settings/settings';
import { DataProvider } from './providers/data-provider/data-provider';
import { OwnCommand } from './providers/own-command/own-command-mock';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = MainPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Home', component: MainPage },
      { title: 'Lights', component: LightsPage },
      { title: 'Shutters', component: ShuttersPage },
      { title: 'Groups', component: GroupsPage },
      { title: 'Settings', component: SettingsPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp,
  [DataProvider]
);
