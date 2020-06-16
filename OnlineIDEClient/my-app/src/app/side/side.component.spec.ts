import {SharedService} from "../data.service";
import {TestBed, ComponentFixture, async} from "@angular/core/testing";
import {SideComponent} from "./Side.component";
import {FormsModule} from "@angular/forms";
import {ClarityModule} from "@clr/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {By} from "@angular/platform-browser";
import {CodeEditorComponent} from "../code-editor/code-editor.component";
import {HeaderComponent} from "../header/header.component";
import {DebugStep} from "../../CL/DebugStep";
import {eventNames} from "cluster";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

/**********************************************************************************************************************/
// THESE TESTS TEST THAT THE COMPONENT WAS LOADED AND THAT THE BUTTONS CALL THE RIGHT FUNCTIONS WHEN PRESSED
/**********************************************************************************************************************/

describe('side component - unit tests', () => {

  let sideComponent: SideComponent;
  let sideFixture: ComponentFixture<SideComponent>;
  let sharedService: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideComponent, CodeEditorComponent],
      providers: [SharedService],
      imports: [
        FormsModule,
        ClarityModule,
        MatDialogModule
      ]
    });

    // load side
    sideFixture = TestBed.createComponent(SideComponent);
    sideComponent = sideFixture.componentInstance;
    sideComponent.ngAfterViewInit();
    sideFixture.detectChanges();
    sharedService = TestBed.get(SharedService);
  });

  afterEach(()=>{
    sideFixture.debugElement.nativeElement.remove();
    sideFixture.destroy();
  });
  //5.1
  it('should load the component successfully',  () => {
    expect(sideFixture.debugElement.query(By.css('section.sidenav-content')).nativeElement).toBeTruthy(); // shows up on view
    expect(sideComponent).toBeDefined();
  });
  // 5.2
  it('ADD button should call to addExternalEvent() function', async(() => {
    spyOn(sideComponent, 'addExternalEvent');
    let buttons = sideFixture.debugElement.queryAll(By.css('.addExEvButton'));
    let AddButton;
    for(let button of buttons){
      if(button.nativeElement.innerText === 'ADD')
        AddButton = button;
    }
    if(!AddButton)
      fail();

    AddButton.nativeElement.click();
    sideFixture.whenStable().then(() => {
      expect(sideComponent.addExternalEvent).toHaveBeenCalled();
    });
  }));

  //5.3
  it('bp.registerBThread button should call to addSentence(n) function', async(() => {
    spyOn(sideComponent, 'addSentence');
    let buttons = sideFixture.nativeElement.querySelectorAll('td');
    let SentenceButton;

    for(let button of buttons){
      if(button.innerText === 'bp.registerBThread')
        SentenceButton = button;
    }

    if(!SentenceButton)
      fail();

    SentenceButton.click();
    sideFixture.whenStable().then(() => {
      expect(sideComponent.addSentence).toHaveBeenCalled();
    });
  }));
  //5.4
  it('bp.sync - waitFor button should call to addSentence(n) function', async(() => {
    spyOn(sideComponent, 'addSentence');
    let buttons = sideFixture.nativeElement.querySelectorAll('td');
    let SentenceButton;

    for(let button of buttons){
      if(button.innerText === 'bp.sync - waitFor')
        SentenceButton = button;
    }

    if(!SentenceButton)
      fail();

    SentenceButton.click();
    sideFixture.whenStable().then(() => {
      expect(sideComponent.addSentence).toHaveBeenCalled();
    });
  }));
  //5.5
  it('bp.sync - request button should call to addSentence(n) function', async(() => {
    spyOn(sideComponent, 'addSentence');
    let buttons = sideFixture.nativeElement.querySelectorAll('td');
    let SentenceButton;

    for(let button of buttons){
      if(button.innerText === 'bp.sync - request')
        SentenceButton = button;
    }

    if(!SentenceButton)
      fail();

    SentenceButton.click();
    sideFixture.whenStable().then(() => {
      expect(sideComponent.addSentence).toHaveBeenCalled();
    });
  }));
  //5.6
  it('bp.sync - request + block button should call to addSentence(n) function', async(() => {
    spyOn(sideComponent, 'addSentence');
    let buttons = sideFixture.nativeElement.querySelectorAll('td');
    let SentenceButton;

    for(let button of buttons){
      if(button.innerText === 'bp.sync - request + block')
        SentenceButton = button;
    }

    if(!SentenceButton)
      fail();

    SentenceButton.click();
    sideFixture.whenStable().then(() => {
      expect(sideComponent.addSentence).toHaveBeenCalled();
    });
  }));
  //5.7
  it('bp.sync button should call to addSentence(n) function', async(() => {
    spyOn(sideComponent, 'addSentence');
    let buttons = sideFixture.nativeElement.querySelectorAll('td');
    let SentenceButton;

    for(let button of buttons){
      if(button.innerText === 'bp.sync')
        SentenceButton = button;
    }

    if(!SentenceButton)
      fail();

    SentenceButton.click();
    sideFixture.whenStable().then(() => {
      expect(sideComponent.addSentence).toHaveBeenCalled();
    });
  }));
});


/**********************************************************************************************************************/
// THESE TESTS TEST THE INTEGRATION BETWEEN THE SIDE AND THE CODE EDITOR AND HEADER COMPONENTS
/**********************************************************************************************************************/

describe('side component - integration tests', () => {

  let sideComponent: SideComponent;
  let sideFixture: ComponentFixture<SideComponent>;
  let codeEditorComponent: CodeEditorComponent;
  let codeEditorFixture: ComponentFixture<CodeEditorComponent>;
  let sharedService: SharedService;
  let headerComponent: HeaderComponent;
  let headerFixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideComponent, HeaderComponent, CodeEditorComponent],
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
        BrowserAnimationsModule
      ]
    });

    // load side
    sideFixture = TestBed.createComponent(SideComponent);
    sideComponent = sideFixture.componentInstance;
    sideComponent.ngAfterViewInit();
    sideFixture.detectChanges();

    headerFixture = TestBed.createComponent(HeaderComponent);
    headerComponent = headerFixture.componentInstance;
    headerFixture.detectChanges(); // call the ngAfterInit

    codeEditorFixture = TestBed.createComponent(CodeEditorComponent);
    codeEditorComponent = codeEditorFixture.componentInstance;
    codeEditorFixture.componentInstance.ngAfterViewInit();
    codeEditorFixture.detectChanges();

    sharedService = TestBed.get(SharedService);
  });

  afterEach(() => {
    sideFixture.debugElement.nativeElement.remove();
    sideFixture.destroy();
    headerFixture.debugElement.nativeElement.remove();
    headerFixture.destroy();
    codeEditorFixture.debugElement.nativeElement.remove();
    codeEditorFixture.destroy();
  });

  //5.8
  it('should add a sentence to the codeEditor', () => {
    let buttons = sideFixture.nativeElement.querySelectorAll('td');
    let Sentence1Button;
    let Sentence2Button;
    let Sentence3Button;
    let Sentence4Button;
    let Sentence5Button;

    for (let button of buttons) {
      if (button.innerText === 'bp.registerBThread')
        Sentence1Button = button;
      else if (button.innerText === 'bp.sync - waitFor')
        Sentence2Button = button;
      else if (button.innerText === 'bp.sync - request')
        Sentence3Button = button;
      else if (button.innerText === 'bp.sync - request + block')
        Sentence4Button = button;
      else if (button.innerText === 'bp.sync')
        Sentence5Button = button;
    }

    if (Sentence1Button === undefined || Sentence2Button === undefined
      || Sentence3Button === undefined || Sentence4Button === undefined || Sentence5Button === undefined)
      fail();

    sharedService.sharedCodeEditor.setValue('');
    Sentence1Button.click();
    expect(sharedService.sharedCodeEditor.session.getValue()).toBe( 'bp.registerBThread ("...",function(){\n' +
      '            ...\n' +
      '            })\n');

    sharedService.sharedCodeEditor.setValue('');
    Sentence2Button.click();
    expect(sharedService.sharedCodeEditor.session.getValue()).toBe('bp.sync({waitFor:bp.Event("...")});');

    sharedService.sharedCodeEditor.setValue('');
    Sentence3Button.click();
    expect(sharedService.sharedCodeEditor.session.getValue()).toBe('bp.sync({request:bp.Event("...")});');

    sharedService.sharedCodeEditor.setValue('');
    Sentence4Button.click();
    expect(sharedService.sharedCodeEditor.session.getValue()).toBe('bp.sync({request:bp.Event("..."),' +
      'block:bp.Event("...")});');

    sharedService.sharedCodeEditor.setValue('');
    Sentence5Button.click();
    expect(sharedService.sharedCodeEditor.session.getValue()).toBe('bp.sync("...")');
  });

  //5.9
  it('should add an event to the Request and Not Block list', () => {
    sharedService.sharedCodeEditor.setValue('bp.registerBThread("welcome", function() {\n' +
      '    bp.sync({\n' +
      '        request: bp.Event("hello")});\n' +
      '    bp.sync({\n' +
      '        request: bp.Event("world")});\n' +
      '})');

    let debugButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));

    if (debugButton.length != 1)
      fail();

    debugButton[0].nativeElement.click();
    headerFixture.detectChanges();

    let resp = {
      type: undefined, bpss: undefined, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: ['[BEvent name:hello]'], selectableEvents: ['[BEvent name:hello]'], waitList: [],
      blockList: [], selectedEvent: undefined
    }
    sharedService.sharedProgram.debugger.postStep(resp);

    sideFixture.detectChanges();

    let eventsList = sideFixture.debugElement.queryAll(By.css('div tr td.ng-star-inserted')).map(e =>
      e.nativeElement.innerText);
    expect(eventsList[0]).toBe('☑ [BEvent name:hello]');
  });

  //5.10
  it('should add an event to the Request and Block list', () => {
    sharedService.sharedCodeEditor.setValue('bp.registerBThread("control-temp", function() {\n' +
      '  bp.sync({\n' +
      '    waitFor: bp.Event("COLD"), block: bp.Event("HOT")});\n' +
      '  bp.sync({\n' +
      '    waitFor: bp.Event("HOT"), block: bp.Event("COLD")});\n' +
      '});\n' +
      '\n' +
      'bp.registerBThread("add-hot", function() {\n' +
      '  bp.sync({\n' +
      '    request: bp.Event("HOT")});\n' +
      '});');

    let debugButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));

    if(debugButton.length != 1)
      fail();

    debugButton[0].nativeElement.click();
    headerFixture.detectChanges();
    sideFixture.detectChanges();

    let resp = {
      type: undefined, bpss: undefined, globalVars: undefined, globalVals: undefined, bThreads: [], reqList: ['[BEvent name:HOT]'],
      selectableEvents: [], waitList: [], blockList: [], selectedEvent: undefined
    }
    sharedService.sharedProgram.debugger.postStep(resp);

    sideFixture.detectChanges();

    let eventsList = sideFixture.debugElement.queryAll(By.css('div tr td.ng-star-inserted')).map(e =>
      e.nativeElement.innerText);

    expect(eventsList[0]).toBe('☒ [BEvent name:HOT]');
  });


  //5.11
  it('should add an events to the Trace list', () => {
    sharedService.sharedCodeEditor.setValue('bp.registerBThread(function(){\n' +
      '  bp.sync({request:bp.Event("hello")});\n' +
      '  bp.sync({request:bp.Event("world")});\n' +
      '})');

    let debugButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));

    if(debugButton.length != 1)
      fail();

    debugButton[0].nativeElement.click();
    headerFixture.detectChanges();
    sideFixture.detectChanges();

    let stepNextButton = headerFixture.debugElement.queryAll(By.css('div.debug-view a')).filter(button =>
      button.nativeElement.innerText.includes('Next Step'));
    spyOn(headerComponent, 'nextStep');

    stepNextButton[0].nativeElement.click();
    expect(headerComponent.nextStep).toHaveBeenCalled();

    let resp1 = {
      type: undefined, bpss: undefined, globalVars: undefined, globalVals: undefined, bThreads: [], reqList: [],
      selectableEvents: undefined, waitList:undefined, blockList: undefined, selectedEvent: '[BEvent name:hello]'
    };
    let resp2 = {
      type: undefined, bpss: undefined, globalVars: undefined, globalVals: undefined, bThreads: [], reqList: [],
      selectableEvents: undefined, waitList:undefined, blockList: undefined, selectedEvent: '[BEvent name:world]'
    };

    sharedService.sharedProgram.debugger.postStep(resp1);
    sharedService.sharedProgram.debugger.postStep(resp2);

    sideFixture.detectChanges();

    let eventsList = sideFixture.nativeElement.querySelectorAll('td');
    expect(eventsList[0].innerText).toBe('1: [BEvent name:hello]');
    expect(eventsList[1].innerText).toBe('2: [BEvent name:world]');
  });
});
