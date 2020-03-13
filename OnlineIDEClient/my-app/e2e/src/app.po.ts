import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTheme(n) {
    if (n === 0) { return element(by.css('[id="clr-tab-link-0"]')); }
    if (n === 1) { return element(by.css('[id="clr-tab-link-1"]')); }
    if (n === 2) { return element(by.css('[id="clr-tab-link-2"]')); }
  }

  getActiveTheme() {
    return element(by.className('btn btn-link nav-link active'));
  }

  getLines() {
    return element(by.className('ace_line'));
  }
}
