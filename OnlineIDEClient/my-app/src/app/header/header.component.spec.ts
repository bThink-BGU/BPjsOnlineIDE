import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderComponent } from './header.component';
import {SharedService} from "../data.service";
import {MatTabsModule} from "@angular/material/tabs";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialogModule} from "@angular/material/dialog";

import {By} from "@angular/platform-browser";

/**********************************************************************************************************************/
// THESE TESTS TEST THAT THE COMPONENT WAS LOADED AND THAT THE BUTTONS CALL THE RIGHT FUNCTIONS WHEN PRESSED
/**********************************************************************************************************************/

describe('header component - unit tests', () => {

  let headerComponent: HeaderComponent;
  let headerFixture: ComponentFixture<HeaderComponent>;
  let sharedService: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [SharedService],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
        MatTabsModule,
        MatDialogModule
      ]
    });

    headerFixture = TestBed.createComponent(HeaderComponent);
    headerComponent = headerFixture.componentInstance;
    headerFixture.detectChanges();
    sharedService = TestBed.get(SharedService);
  });

  afterEach(()=>{
    headerFixture.debugElement.nativeElement.remove();
    headerFixture.destroy();
  });

  it('should compile', () => {
    expect(headerFixture).toBeTruthy();
    expect(headerComponent).toBeDefined();
  });

  it('should call the run method',  () => {
    let runButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Run'));

    if(runButton.length != 1)
      fail();

    spyOn(headerComponent, 'run').and.callFake(()=>{});
    runButton[0].nativeElement.click();
    expect(headerComponent.run).toHaveBeenCalled();
  });

  it('should call the stop run method',  () => {
    let stopRunButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Stop'));

    if(stopRunButton.length != 1)
      fail();

    spyOn(headerComponent, 'stopRun').and.callFake(()=>{});
    stopRunButton[0].nativeElement.click();
    expect(headerComponent.stopRun).toHaveBeenCalled();
  });

  it('should switch to debug view and back and check that all debug buttons can be pressed',  () => {
    let debugButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));

    if(debugButton.length != 1)
      fail();

    spyOn(headerComponent, 'debug').and.callFake(()=>{
      sharedService.nextDebugger(!sharedService.sharedDebuggerMode);
    });

    debugButton[0].nativeElement.click();
    expect(headerComponent.debug).toHaveBeenCalled();
    headerFixture.detectChanges();

    let newButtons = headerFixture.debugElement.queryAll(By.css('div.debug-view a')).map(
      button => button.nativeElement);
    let newButtonsText = newButtons.map(button => button.innerText);

    newButtonsText.forEach((text, index) => {
      if(!text.includes(['Stop','Next Step','Previous Step',
        'Next Breakpoint','Previous Breakpoint','Theme'][index]))
        fail();
    });

    spyOn(headerComponent, 'nextStep').and.callFake(()=>{});
    spyOn(headerComponent, 'previousStep').and.callFake(()=>{});
    spyOn(headerComponent, 'nextBreakPoint').and.callFake(()=>{});
    spyOn(headerComponent, 'previousBreakPoint').and.callFake(()=>{});

    newButtons[1].click();
    expect(headerComponent.nextStep).toHaveBeenCalled();
    newButtons[2].click();
    expect(headerComponent.previousStep).toHaveBeenCalled();
    newButtons[3].click();
    expect(headerComponent.nextBreakPoint).toHaveBeenCalled();
    newButtons[4].click();
    expect(headerComponent.previousBreakPoint).toHaveBeenCalled();

    spyOn(headerComponent, 'stopDebug').and.callFake(()=>{
      sharedService.nextDebugger(!sharedService.sharedDebuggerMode);
    });

    newButtons[0].click();
    headerFixture.detectChanges();
    let oldButtons = headerFixture.debugElement.queryAll(By.css('div.run-view a')).map(
      button => button.nativeElement.innerText);

    oldButtons.forEach((text, index) => {
      if(!text.includes(['Run','Stop','Debug',
        'Beautify','Load File','Download File','Theme'][index]))
        fail();
    });

  });

  it('should call the beautify method',  () => {
    let beautifyButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Beautify'));

    if(beautifyButton.length != 1)
      fail();

    spyOn(headerComponent, 'beautify').and.callFake(()=>{});
    beautifyButton[0].nativeElement.click();
    expect(headerComponent.beautify).toHaveBeenCalled();
  });

  it('should call the load file method',  () => {
    let input = <HTMLInputElement> headerFixture.debugElement.query(By.css('input[type=file]')).nativeElement;
    let loadFileButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Load File'));

    if(loadFileButton.length != 1)
      fail();

    spyOn(input, 'click').and.callThrough();
    spyOn(headerComponent, 'loadFile').and.callThrough();
    spyOn(window as any, 'FileReader').and.returnValue(
      jasmine.createSpyObj('FileReader', ['readAsText', 'onload']));

    loadFileButton[0].nativeElement.click();
    expect(input.click).toHaveBeenCalled();

    input.dispatchEvent(new Event('change'));
    expect(headerComponent.loadFile).toHaveBeenCalled();
  });

  it('should call the download method',  () => {
    let downloadFileButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Download File'));

    if(downloadFileButton.length != 1)
      fail();

    spyOn(headerComponent, 'downloadFile').and.callFake(()=>{});
    downloadFileButton[0].nativeElement.click();
    expect(headerComponent.downloadFile).toHaveBeenCalled();
  });

  it('should open the menu and call the theme method',  () => {
    let themeButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Theme'));

    if(themeButton.length != 1)
      fail();

    themeButton[0].nativeElement.click();

    let menu = headerFixture.debugElement.query(By.css('.mat-menu-panel'));
    let menuItems = headerFixture.debugElement.queryAll(By.css('.mat-menu-panel a'));

    expect(menu).toBeTruthy();

    spyOn(headerComponent, 'theme').and.callFake(()=>{});
    menuItems[1].nativeElement.click(); // index 0 is the divider
    expect(headerComponent.theme).toHaveBeenCalledWith(0);
    menuItems[2].nativeElement.click();
    expect(headerComponent.theme).toHaveBeenCalledWith(1);

    // assume that all the others work too because they have the same structure

  });

});

/**********************************************************************************************************************/
// THESE TESTS TEST THE INTEGRATION BETWEEN THE HEADER AND THE CODE EDITOR AND SIDE COMPONENTS
/**********************************************************************************************************************/

describe('header component - integration tests', () => {

  let headerComponent: HeaderComponent;
  let headerFixture: ComponentFixture<HeaderComponent>;
  let sharedService: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [SharedService],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
        MatTabsModule,
        MatDialogModule
      ]
    });

    headerFixture = TestBed.createComponent(HeaderComponent);
    headerComponent = headerFixture.componentInstance;
    headerFixture.detectChanges();
    sharedService = TestBed.get(SharedService);
  });

  afterEach(()=>{
    headerFixture.debugElement.nativeElement.remove();
    headerFixture.destroy();
  });


});
