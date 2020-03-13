import { AppPage } from './app.po';
import { browser, logging, by, element } from 'protractor';
import {print} from 'util';

describe('hi', () => {
  it('hi', () => {
    expect(1).toEqual(2);
  });
});

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display name of theme 0', () => {
    page.navigateTo();
    expect(page.getTheme(0).getText()).toEqual('Black Theme');
  });

  it('should display name of theme 1', () => {
    page.navigateTo();
    expect(page.getTheme(1).getText()).toEqual('White Theme');
  });

  it('should display name of theme 2', () => {
    page.navigateTo();
    expect(page.getTheme(2).getText()).toEqual('Dark Theme');
  });

  // ------------------CHECK THEMES BUTTONS----------------------------

  it('should change theme to theme 0', () => {
    page.navigateTo();
    page.getTheme(0).click();
    expect(page.getActiveTheme().getText()).toEqual('Black Theme');
  });

  it('should change theme to theme 1', () => {
    page.navigateTo();
    page.getTheme(1).click();
    expect(page.getActiveTheme().getText()).toEqual('White Theme');
  });

  it('should change theme to theme 2', () => {
    page.navigateTo();
    page.getTheme(2).click();
    expect(page.getActiveTheme().getText()).toEqual('Dark Theme');
  });


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
