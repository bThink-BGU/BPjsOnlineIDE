import {SharedService} from "../data.service";
import {TestBed, ComponentFixture, async, fakeAsync, tick} from "@angular/core/testing";
import {SideRightComponent} from "./side-right.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClarityModule} from "@clr/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserModule, By} from "@angular/platform-browser";
import {CodeEditorComponent} from "../code-editor/code-editor.component";
import {HeaderComponent} from "../header/header.component";
import {DebugStep} from "../../CL/DebugStep";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import { OutputComponent } from '../output/output.component';
import {BThreadInfo} from "../../CL/BThreadInfo";
import {MatTabsModule} from "@angular/material/tabs";
import {LayoutModule} from "@angular/cdk/layout";
import {MatButtonModule} from "@angular/material/button";
import {AppComponent} from "../app.component";
import {SideComponent} from "../side/side.component";
import {SaveFileDialogComponent} from "../save-file-dialog/save-file-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {AngularSplitModule} from "angular-split";

/**********************************************************************************************************************/
// THESE TESTS TEST THAT THE COMPONENT WAS LOADED AND THAT THE BUTTONS CALL THE RIGHT FUNCTIONS WHEN PRESSED
/**********************************************************************************************************************/

describe('sideRight component - unit tests', () => {

  let sideRightComponent: SideRightComponent;
  let sideRightFixture: ComponentFixture<SideRightComponent>;
  let sharedService: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideRightComponent, CodeEditorComponent],
      providers: [SharedService],
      imports: [
        FormsModule,
        ClarityModule,
        MatDialogModule
      ]
    });

    // load side right
    sideRightFixture = TestBed.createComponent(SideRightComponent);
    sideRightComponent = sideRightFixture.componentInstance;
    sideRightComponent.ngAfterViewInit();
    sideRightFixture.detectChanges();
    sharedService = TestBed.get(SharedService);
  });

  afterEach(()=>{
    sideRightFixture.debugElement.nativeElement.remove();
    sideRightFixture.destroy();
  });
  it('should load the component successfully',  () => {
    expect(sideRightFixture).toBeTruthy();
    expect(sideRightComponent).toBeDefined();
  });

});


/**********************************************************************************************************************/
// THESE TESTS TEST THE INTEGRATION BETWEEN THE SIDE AND THE CODE EDITOR AND HEADER COMPONENTS
/**********************************************************************************************************************/

fdescribe('side right component - integration tests', () => {

  let appComponent: AppComponent;
  let appFixture: ComponentFixture<AppComponent>;
  let sharedService: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SideComponent,
        SideRightComponent,
        HeaderComponent,
        CodeEditorComponent,
        SaveFileDialogComponent,
        OutputComponent
      ],
      providers: [SharedService],
      imports: [
        BrowserModule,
        ClarityModule,
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule,
        LayoutModule,
        MatTabsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        AngularSplitModule,
      ]
    });

    appFixture = TestBed.createComponent(AppComponent);
    appComponent = appFixture.componentInstance;
    appFixture.detectChanges();

    sharedService = TestBed.get(SharedService);

  });

  afterEach(() => {
    appFixture.debugElement.nativeElement.remove();
    appFixture.destroy();
  });


  it('should add a Bthread to the Bthreads list', () => {
    sharedService.sharedCodeEditor.setValue('"welcome", bp.registerBThread("welcome", function() {\n' +
      '    bp.sync({\n' +
      '        request: bp.Event("hello")});\n' +
      '    bp.sync({\n' +
      '        request: bp.Event("world")});\n' +
      '})');

    let debugButton = appFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));

    if (debugButton.length != 1)
      fail();

    debugButton[0].nativeElement.click();
    appFixture.detectChanges();


    let BTinfo = new BThreadInfo('welcome', 3 ,undefined, undefined, undefined);
    let resp = {
      type: undefined, bpss: undefined, globalVars: undefined, globalVals: undefined, bThreads: [BTinfo], reqList: undefined,
      selectableEvents: [], waitList: [], blockList: [], selectedEvent: undefined
    }
    sharedService.sharedProgram.debugger.postStep(resp);

    appFixture.detectChanges();

    let BTsList = appFixture.debugElement.queryAll(By.css('#bThread-names')).map(e =>
      e.nativeElement.innerText);

    expect(BTsList[0]).toBe('welcome');
  });

  it('should add a global variable to the global variables table', () => {
    let debugButton = appFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));

    if (debugButton.length != 1)
      fail();

    debugButton[0].nativeElement.click();
    appFixture.detectChanges();

    let BTinfo = {bThreadName :'welcome',firstLinePC: 3, localShift: undefined, localVars: ['x', 'y'], localVals: [3, 5]};
    let resp ={type: 'step', bpss: undefined, globalVars: ['x', 'y'], globalVals: [3 ,5], bThreads: [BTinfo],
      reqList: undefined, selectableEvents: undefined, waitList: undefined, blockList: undefined, selectedEvent: undefined};

    sharedService.sharedProgram.debugger.postStep(resp); // as if a response was returned
    appFixture.detectChanges();


    appFixture.debugElement.queryAll(By.css('#tab-group .mat-tab-label'))[2].nativeElement.click();
    appFixture.detectChanges();

    let globalVars = appFixture.debugElement.query(By.css('#tab-group'));
    window.alert(globalVars);

    // expect(globalVars[0].nativeElement.innerText).toBe('x');
    // expect(globalVars[1].nativeElement.innerText).toBe('y');
  });

  //bad
  // it('should add a local variable to the local variables table', () => {
  //   // sharedService.BtrheadsList = ['welcome'];
  //
  //   let debugButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
  //     button.nativeElement.innerText.includes('Debug'));
  //
  //   if (debugButton.length != 1)
  //     fail();
  //
  //   spyOn(headerComponent, 'debug').and.callThrough();//()=>{
  //   // sharedService.nextDebugger(!sharedService.sharedDebuggerMode);
  //   // });
  //
  //   debugButton[0].nativeElement.click();
  //   expect(headerComponent.debug).toHaveBeenCalled();
  //
  //   sharedService.sharedCodeEditor.setValue('bp.registerBThread("welcome", function() {\n' +
  //     '  let x = 3;\n' +
  //     '  let y = 5;\n' +
  //     '  bp.sync({\n' +
  //     '    request: bp.Event("hello")});\n' +
  //     '})');
  //
  //   sideRightFixture.detectChanges();
  //   headerFixture.detectChanges();
  //   outputFixture.detectChanges();
  //
  //   let BTinfo = {bThreadName :'welcome',firstLinePC: 3, localShift: undefined, localVars: ['x', 'y'], localVals: [3, 5]};
  //
  //   let resp ={type: 'step', bpss: undefined, globalVars: ['x', 'y'], globalVals: [3 ,5], bThreads: [BTinfo],
  //     reqList: undefined, selectableEvents: undefined, waitList: undefined, blockList: undefined, selectedEvent: undefined};
  //
  //   sharedService.sharedProgram.debugger.postStep(resp);
  //
  //   let nextStepButton = headerFixture.debugElement.queryAll(By.css('div.debug-view a')).filter(
  //     button => button.nativeElement.innerText.includes('Next Step'));
  //
  //   let previousButton= headerFixture.debugElement.queryAll(By.css('div.debug-view a')).filter(
  //     button => button.nativeElement.innerText.includes('Previous Step'));
  //
  //   spyOn(headerComponent, 'nextStep').and.callFake(()=>{});
  //   spyOn(headerComponent, 'previousStep').and.callFake(()=>{});
  //
  //   nextStepButton[0].nativeElement.click();
  //   expect(headerComponent.nextStep).toHaveBeenCalled();
  //   previousButton[0].nativeElement.click();
  //   expect(headerComponent.previousStep).toHaveBeenCalled();
  //
  //   outputFixture.detectChanges();
  //
  // outputFixture.debugElement.queryAll(By.css('.mat-tab-label'))[1].nativeElement.click();
  //
  //   outputFixture.detectChanges();
  //
  //   let globalVars = outputFixture.nativeElement.querySelectorAll('td');
  //   expect(globalVars[0]).toBe('x');
  // });
});
