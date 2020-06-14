import {TestBed, async, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {SharedService} from "./data.service";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {LayoutModule} from "@angular/cdk/layout";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserModule, By} from "@angular/platform-browser";
import {ClarityModule} from "@clr/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {AngularSplitModule} from "angular-split";
import {SideComponent} from "./side/side.component";
import {SideRightComponent} from "./side-right/side-right.component";
import {CodeEditorComponent} from "./code-editor/code-editor.component";
import {SaveFileDialogComponent} from "./save-file-dialog/save-file-dialog.component";
import {OutputComponent} from "./output/output.component";
import {Subject} from "rxjs";
import {DebugStep} from "../CL/DebugStep";
import {WebSocketService} from "../CL/Connection";


class FakeWebSocketService {

  private readonly _webSocket : Subject<{}>;

  constructor(url: string) {
    this._webSocket = new Subject<{}>();
  }

  public sendDataMess(type: string, message: string) {
    setTimeout(()=>{
      switch(type){
        case 'initRun':
          this._webSocket.next({type: type, message: 'SHOULDN\'T APPEAR ON SCREEN'});
          break;
        case 'run':
        case 'stop':
          this._webSocket.next({type: 'run', message: 'An event response from the server'});
          break;
      }
    },1000);
  }

  public sendDataStep(type: string, debugStep: DebugStep) {
    setTimeout(()=>{
      this._webSocket.next({type: 'step',
        bpss:'',
        globalVars:['var1', 'var2'],
        localVars:['var3', 'var4'],
        bThreads:[], // empty on purpose, no need to check that functionality here
        reqList:['event1'],
        selectableEvents:['event3','event5'],
        waitList:['event2', 'event4'],
        blockList:['event6'],
        selectedEvent:'An event selected by the server'});
    },1000);
  }

  public getObservable() {
    return this._webSocket.asObservable();
  }

  get webSocket() {
    return this._webSocket;
  }

}


describe('AppComponent', () => {

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

    sharedService.sharedProgram.bpService.connection = new FakeWebSocketService('not important...');
    sharedService.sharedProgram.subscribeOutputStream(); // subscribe again so the fake server is used
  });

  afterEach(() => {
    appFixture.debugElement.nativeElement.remove();
    appFixture.destroy();
  });

  it('should run code and update all necessary variables through all the layers', fakeAsync(() => {
    let runButton = appFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Run'));

    if(runButton.length != 1)
      fail();

    spyOn(sharedService.sharedProgram.bpService, 'initCL').and.callThrough();
    spyOn(sharedService.sharedProgram.bpService, 'runCL').and.callThrough();
    runButton[0].nativeElement.click();
    tick(3000);

    expect(sharedService.sharedProgram.code).toBe(sharedService.sharedCodeEditor.getValue());
    expect(sharedService.sharedProgram.bpService.initCL).toHaveBeenCalledWith('initRun',
      sharedService.sharedCodeEditor.getValue());
    expect(sharedService.sharedProgram.bpService.runCL).toHaveBeenCalled();
    expect(sharedService.sharedProgram.runner.stdout).toBe('>\tAn event response from the server\n');
    expect(sharedService.sharedProgram.runner.isError).toBe(false);
    expect(sharedService.sharedProgram.runner.stop).toBe(false);
  }));

  it('should stop the run and update all layers', fakeAsync(() => {
    let stopRunButton = appFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Stop'));

    if(stopRunButton.length != 1)
      fail();

    spyOn(sharedService.sharedProgram.bpService, 'stopRunCL').and.callThrough();
    stopRunButton[0].nativeElement.click();
    tick(3000);

    expect(sharedService.sharedProgram.bpService.stopRunCL).toHaveBeenCalled();
    expect(sharedService.sharedProgram.runner.stdout).toBe('>\tThe Program Was Halted');
    expect(sharedService.sharedProgram.runner.isError).toBe(false);
    expect(sharedService.sharedProgram.runner.stop).toBe(true);
  }));

  it('should make a step and check all the bindings and variables', fakeAsync(() => {
    spyOn(sharedService.sharedProgram, 'init').and.callThrough();
    spyOn(sharedService.sharedProgram.debugger, 'step').and.callThrough();
    spyOn(sharedService.sharedProgram.debugger, 'postStep').and.callThrough();

    let debugButton = appFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));
    if(debugButton.length != 1)
      fail();
    debugButton[0].nativeElement.click(); //switch to debug view and call init and step

    tick(3000);

    expect(sharedService.sharedProgram.init).toHaveBeenCalledWith('initStep',
      sharedService.sharedCodeEditor.getValue());
    expect(sharedService.sharedProgram.debugger.step).toHaveBeenCalled();
    expect(sharedService.sharedProgram.debugger.postStep).toHaveBeenCalled();
    expect(sharedService.sharedProgram.debugger.stdout).toBe('\nAn event selected by the server');
  }));









});
