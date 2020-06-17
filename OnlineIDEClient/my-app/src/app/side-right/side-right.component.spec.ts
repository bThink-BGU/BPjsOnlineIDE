import {SharedService} from "../data.service";
import {TestBed, ComponentFixture, async, fakeAsync, tick} from "@angular/core/testing";
import {SideRightComponent} from "./side-right.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClarityModule} from "@clr/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserModule, By} from "@angular/platform-browser";
import {CodeEditorComponent} from "../code-editor/code-editor.component";
import {HeaderComponent} from "../header/header.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
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
import {DebugElement} from "@angular/core";

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
  //14.1
  it('should load the component successfully',  () => {
    expect(sideRightFixture).toBeTruthy();
    expect(sideRightComponent).toBeDefined();
  });

});


/**********************************************************************************************************************/
// THESE TESTS TEST THE INTEGRATION BETWEEN THE SIDE RIGHT AND THE OUTPUT AND HEADER COMPONENTS
/**********************************************************************************************************************/

describe('side right component - integration tests', () => {

  let appComponent: AppComponent;
  let outputDebugElement: DebugElement;
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
        NoopAnimationsModule,
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
    outputDebugElement = appFixture.debugElement.query(By.directive(OutputComponent));
    appFixture.detectChanges();
    sharedService = TestBed.get(SharedService);

  });

  afterEach(() => {
    appFixture.debugElement.nativeElement.remove();
    appFixture.destroy();
  });

//14.2
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

});
