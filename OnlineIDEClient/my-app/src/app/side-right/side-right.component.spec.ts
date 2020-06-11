import {SharedService} from "../data.service";
import {TestBed, ComponentFixture, async} from "@angular/core/testing";
import {SideRightComponent} from "./side-right.component";
import {FormsModule} from "@angular/forms";
import {ClarityModule} from "@clr/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {By} from "@angular/platform-browser";
import {CodeEditorComponent} from "../code-editor/code-editor.component";
import {HeaderComponent} from "../header/header.component";
import {DebugStep} from "../../CL/DebugStep";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { OutputComponent } from '../output/output.component';
import {BThreadInfo} from "../../CL/BThreadInfo";
import {MatTabsModule} from "@angular/material/tabs";

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

describe('side right component - integration tests', () => {

  let sideRightComponent: SideRightComponent;
  let sideRightFixture: ComponentFixture<SideRightComponent>;
  let codeEditorComponent: CodeEditorComponent;
  let codeEditorFixture: ComponentFixture<CodeEditorComponent>;
  let sharedService: SharedService;
  let headerComponent: HeaderComponent;
  let headerFixture: ComponentFixture<HeaderComponent>;
  let outputComponent: OutputComponent;
  let outputFixture: ComponentFixture<OutputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideRightComponent, HeaderComponent, CodeEditorComponent, OutputComponent],
      providers: [SharedService],
      imports: [
        FormsModule,
        ClarityModule,
        MatDialogModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        BrowserAnimationsModule,
        MatTabsModule
      ]
    });

    // load components
    sideRightFixture = TestBed.createComponent(SideRightComponent);
    sideRightComponent = sideRightFixture.componentInstance;
    sideRightComponent.ngAfterViewInit();
    sideRightFixture.detectChanges();

    headerFixture = TestBed.createComponent(HeaderComponent);
    headerComponent = headerFixture.componentInstance;
    headerFixture.detectChanges();

    outputFixture = TestBed.createComponent(OutputComponent);
    outputComponent = outputFixture.componentInstance;
    outputComponent.ngAfterViewInit();
    outputFixture.detectChanges();

    codeEditorFixture = TestBed.createComponent(CodeEditorComponent);
    codeEditorComponent = codeEditorFixture.componentInstance;
    codeEditorComponent.ngAfterViewInit();
    codeEditorFixture.detectChanges();

    sharedService = TestBed.get(SharedService);
  });

  afterEach(() => {
    sideRightFixture.debugElement.nativeElement.remove();
    sideRightFixture.destroy();
    headerFixture.debugElement.nativeElement.remove();
    headerFixture.destroy();
    outputFixture.debugElement.nativeElement.remove();
    outputFixture.destroy();
    codeEditorFixture.debugElement.nativeElement.remove();
    codeEditorFixture.destroy();
  });

  // it('should add a Bthread to the Bthreads list', () => {
  //   sharedService.sharedCodeEditor.setValue('"welcome", bp.registerBThread("welcome", function() {\n' +
  //     '    bp.sync({\n' +
  //     '        request: bp.Event("hello")});\n' +
  //     '    bp.sync({\n' +
  //     '        request: bp.Event("world")});\n' +
  //     '})');
  //
  //   let debugButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
  //     button.nativeElement.innerText.includes('Debug'));
  //
  //   if (debugButton.length != 1)
  //     fail();
  //
  //   debugButton[0].nativeElement.click();
  //   sideRightFixture.detectChanges();
  //
  //
  //   let BTinfo = new BThreadInfo('welcome', 3 ,undefined, undefined, undefined);
  //   let resp = {
  //     type: undefined, bpss: undefined, globalVars: undefined, globalVals: undefined, bThreads: [BTinfo], reqList: undefined,
  //     selectableEvents: [], waitList: [], blockList: [], selectedEvent: undefined
  //   }
  //   sharedService.sharedProgram.debugger.postStep(resp);
  //
  //   sideRightFixture.detectChanges();
  //
  //   let BTsList = sideRightFixture.debugElement.queryAll(By.css('td')).map(e =>
  //     e.nativeElement.innerText);
  //
  //   expect(BTsList[2]).toBe('welcome');
  // });

  //bad
  // it('should add a global variable to the global variables table', () => {
  //
  //   // sharedService.BtrheadsList = ['welcome'];
  //
  //   let debugButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
  //     button.nativeElement.innerText.includes('Debug'));
  //
  //   if (debugButton.length != 1)
  //     fail();
  //
  //   spyOn(headerComponent, 'debug').and.callThrough();//()=>{
  //     // sharedService.nextDebugger(!sharedService.sharedDebuggerMode);
  //   // });
  //
  //   debugButton[0].nativeElement.click();
  //   expect(headerComponent.debug).toHaveBeenCalled();
  //
  //   sharedService.sharedCodeEditor.setValue('let x = 5;\n' +
  //     '  let y = 3;\n' +
  //     '  bp.registerBThread("welcome", function() {\n' +
  //     '  bp.sync({\n' +
  //     '    request: bp.Event("hello")});\n' +
  //     '})');
  //
  //   sideRightFixture.detectChanges();
  //   headerFixture.detectChanges();
  //   outputFixture.detectChanges();
  //
  //   let BTinfo = {bThreadName :'welcome',firstLinePC: 3, localShift: undefined, localVars: ['x', 'y'], localVals: [3, 5]};
  //   let resp ={type: 'step', bpss: undefined, globalVars: ['x', 'y'], globalVals: [3 ,5], bThreads: [BTinfo],
  //     reqList: undefined, selectableEvents: undefined, waitList: undefined, blockList: undefined, selectedEvent: undefined};
  //
  //   sharedService.sharedProgram.debugger.postStep(resp);
  //
  //   outputFixture.detectChanges();
  //
  //   outputFixture.debugElement.queryAll(By.css('.mat-tab-label'))[2].nativeElement.click();
  //
  //   outputFixture.detectChanges();
  //   sideRightFixture.detectChanges();
  //   headerFixture.detectChanges();
  //   codeEditorFixture.detectChanges();
  //
  //
  //   let globalVars = outputFixture.nativeElement.querySelectorAll('tr');
  //   expect(globalVars).toBe('x');
  // });


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
