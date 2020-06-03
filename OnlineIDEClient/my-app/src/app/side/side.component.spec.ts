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

/**********************************************************************************************************************/
// THESE TESTS TEST THAT THE COMPONENT WAS LOADED AND THAT THE BUTTONS CALL THE RIGHT FUNCTIONS WHEN PRESSED
/**********************************************************************************************************************/

fdescribe('side component - unit tests', () => {

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
  //5.2
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

// describe('side component - integration tests', () => {
//
//   let sideComponent: SideComponent;
//   let sideFixture: ComponentFixture<SideComponent>;
//   let codeEditorComponent: CodeEditorComponent;
//   let codeEditorFixture: ComponentFixture<CodeEditorComponent>;
//   let sharedService: SharedService;
//   let headerComponent: HeaderComponent;
//   let headerFixture: ComponentFixture<HeaderComponent>;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [SideComponent, HeaderComponent, CodeEditorComponent],
//       providers: [SharedService],
//       imports: [
//         FormsModule,
//         ClarityModule,
//         MatDialogModule
//       ]
//     });
//
//     // load side
//     sideFixture = TestBed.createComponent(SideComponent);
//     sideComponent = sideFixture.componentInstance;
//     sideComponent.ngAfterViewInit();
//     sideFixture.detectChanges();
//
//     headerFixture = TestBed.createComponent(HeaderComponent);
//     headerComponent = headerFixture.componentInstance;
//     headerComponent.ngAfterViewInit();
//     headerFixture.detectChanges(); // call the ngAfterInit
//
//     codeEditorFixture = TestBed.createComponent(CodeEditorComponent);
//     codeEditorComponent = codeEditorFixture.componentInstance;
//     codeEditorFixture.componentInstance.ngAfterViewInit();
//     codeEditorFixture.detectChanges();
//
//     sharedService = TestBed.get(SharedService);
//   });
//
//   afterEach(() => {
//     sideFixture.debugElement.nativeElement.remove();
//     sideFixture.destroy();
//     headerFixture.debugElement.nativeElement.remove();
//     headerFixture.destroy();
//     codeEditorFixture.debugElement.nativeElement.remove();
//     codeEditorFixture.destroy();
//   });
//
//   //5.7
//   it('should add a sentence to the codeEditor', () => {
//     let buttons = sideFixture.nativeElement.querySelectorAll('td');
//     let Sentence1Button;
//     let Sentence2Button;
//     let Sentence3Button;
//     let Sentence4Button;
//
//     for (let button of buttons) {
//       if (button.innerText === 'bp.registerBThread')
//         Sentence1Button = button;
//       else if (button.innerText === 'bp.sync - waitFor')
//         Sentence2Button = button;
//       else if (button.innerText === 'bp.sync - request')
//         Sentence3Button = button;
//       else if (button.innerText === 'bp.sync - request + block')
//         Sentence4Button = button;
//     }
//
//     if (Sentence1Button === undefined || Sentence2Button === undefined
//       || Sentence3Button === undefined || Sentence4Button === undefined)
//       fail();
//
//     sharedService.sharedCodeEditor.setValue('');
//     Sentence1Button.click();
//     expect(sharedService.sharedCodeEditor.session.getValue()).toBe('\nbp.registerBThread ("...",function(){\n' +
//       '            ...\n' +
//       '            })\n');
//
//     sharedService.sharedCodeEditor.setValue('');
//     Sentence2Button.click();
//     expect(sharedService.sharedCodeEditor.session.getValue()).toBe('\nbp.sync({waitFor:bp.Event("...")});\n');
//
//     sharedService.sharedCodeEditor.setValue('');
//     Sentence3Button.click();
//     expect(sharedService.sharedCodeEditor.session.getValue()).toBe('\nbp.sync({request:bp.Event("...")});\n');
//
//     sharedService.sharedCodeEditor.setValue('');
//     Sentence4Button.click();
//     expect(sharedService.sharedCodeEditor.session.getValue()).toBe('\nbp.sync({request:bp.Event("..."),' +
//       ' block:bp.Event("...")});\n');
//   });
//   //5.8
//   it('should add an event to the Request list', () => {
//     let debugButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
//       button => button.nativeElement.innerText === '🐞 DEBUG');
//
//     if (debugButton.length != 1)
//       fail();
//
//     sharedService.sharedCodeEditor.setValue('bp.registerBThread(function(){\n' +
//       '  bp.sync({request:bp.Event("test")});\n' +
//       '})');
//
//     debugButton[0].nativeElement.click();
//     headerFixture.detectChanges();
//
//     let stepNextButton = headerFixture.debugElement.queryAll(By.css('a.nav-text')).filter(
//       button => button.nativeElement.innerText === '⏬ STEP NEXT');
//     spyOn(headerComponent, 'stepNext');
//
//     stepNextButton[0].nativeElement.click();
//     expect(headerComponent.stepNext).toHaveBeenCalled();
//
//     let resp = {
//       type: undefined, bpss: undefined, vars: undefined, vals: undefined, reqList: ['[BEvent name:test]'],
//       selectableEvents: undefined, waitList: undefined, blockList: undefined, selectedEvent: undefined
//     }
//     sharedService.sharedProgram.debugger.postStep(resp);
//
//     sideFixture.detectChanges();
//
//     let eventsList = sideFixture.nativeElement.querySelectorAll('td');
//     expect(eventsList[0].innerText).toBe('[BEvent name:test]');
//   });
//   //5.9
//   it('should add an event to the Wait list', () => {
//     let debugButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
//       button => button.nativeElement.innerText === '🐞 DEBUG');
//
//     if (debugButton.length != 1)
//       fail();
//
//     debugButton[0].nativeElement.click();
//     headerFixture.detectChanges();
//     sideFixture.detectChanges();
//
//     sharedService.sharedCodeEditor.setValue('bp.registerBThread(function(){\n' +
//       '  bp.sync({waitFor:bp.Event("test")});\n' +
//       '})');
//
//     let stepNextButton = headerFixture.debugElement.queryAll(By.css('a.nav-text')).filter(
//       button => button.nativeElement.innerText === '⏬ STEP NEXT');
//     spyOn(headerComponent, 'stepNext');
//
//     stepNextButton[0].nativeElement.click();
//     expect(headerComponent.stepNext).toHaveBeenCalled();
//
//     let resp = {
//       type: undefined, bpss: undefined, vars: undefined, vals: undefined, reqList: undefined,
//       selectableEvents: undefined, waitList: ['[BEvent name:test]'], blockList: undefined, selectedEvent: undefined
//     }
//     sharedService.sharedProgram.debugger.postStep(resp);
//
//     let buttons = sideFixture.debugElement.queryAll(By.css('button'));
//     if (!buttons)
//       fail();
//
//     let waitButton;
//     for (let button of buttons)
//       if (button.nativeElement.innerText === 'Wait')
//         waitButton = button;
//     waitButton.nativeElement.click();
//
//     sideFixture.detectChanges();
//
//     let eventsList = sideFixture.nativeElement.querySelectorAll('td');
//     expect(eventsList[0].innerText).toBe('[BEvent name:test]');
//   });
//   //5.10
//   it('should add an event to the Block list', () => {
//     let debugButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
//       button => button.nativeElement.innerText === '🐞 DEBUG');
//
//     if (debugButton.length != 1)
//       fail();
//
//     debugButton[0].nativeElement.click();
//     headerFixture.detectChanges();
//     sideFixture.detectChanges();
//
//     sharedService.sharedCodeEditor.setValue('bp.registerBThread(function(){\n' +
//       'bp.sync({request:bp.Event("test1"), block:bp.Event("test")});\n' +
//       '})');
//
//
//     let stepNextButton = headerFixture.debugElement.queryAll(By.css('a.nav-text')).filter(
//       button => button.nativeElement.innerText === '⏬ STEP NEXT');
//     spyOn(headerComponent, 'stepNext');
//
//     stepNextButton[0].nativeElement.click();
//     expect(headerComponent.stepNext).toHaveBeenCalled();
//
//     let resp = {
//       type: undefined, bpss: undefined, vars: undefined, vals: undefined, reqList: undefined,
//       selectableEvents: undefined, waitList: undefined, blockList: ['[BEvent name:test]'], selectedEvent: undefined
//     }
//     sharedService.sharedProgram.debugger.postStep(resp);
//
//     let buttons = sideFixture.debugElement.queryAll(By.css('button'));
//     if (!buttons)
//       fail();
//
//     let waitButton;
//     for (let button of buttons)
//       if (button.nativeElement.innerText === 'Block')
//         waitButton = button;
//     waitButton.nativeElement.click();
//
//     sideFixture.detectChanges();
//
//     let eventsList = sideFixture.nativeElement.querySelectorAll('td');
//     expect(eventsList[0].innerText).toBe('[BEvent name:test]');
//   });
//   //5.11
//   it('should add an events to the Trace list', () => {
//     let debugButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
//       button => button.nativeElement.innerText === '🐞 DEBUG');
//
//     if(debugButton.length != 1)
//       fail();
//
//     debugButton[0].nativeElement.click();
//     headerFixture.detectChanges();
//     sideFixture.detectChanges();
//
//     let stepNextButton = headerFixture.debugElement.queryAll(By.css('a.nav-text')).filter(
//       button => button.nativeElement.innerText === '⏬ STEP NEXT');
//     spyOn(headerComponent, 'stepNext');
//
//     stepNextButton[0].nativeElement.click();
//     expect(headerComponent.stepNext).toHaveBeenCalled();
//
//     sharedService.sharedCodeEditor.setValue('bp.registerBThread(function(){\n' +
//       '  bp.sync({request:bp.Event("hello")});\n' +
//       '  bp.sync({request:bp.Event("world")});\n' +
//       '})');
//
//     let resp1 = {type: undefined, bpss: undefined, vars: undefined, vals: undefined, reqList: undefined,
//       selectableEvents: undefined, waitList:undefined, blockList: undefined, selectedEvent: '[BEvent name:hello]'};
//     let resp2 = {type: undefined, bpss: undefined, vars: undefined, vals: undefined, reqList: undefined,
//       selectableEvents: undefined, waitList:undefined, blockList: undefined, selectedEvent: '[BEvent name:world]'};
//     sharedService.sharedProgram.debugger.postStep(resp1);
//     sharedService.sharedProgram.debugger.postStep(resp2);
//
//     sideFixture.detectChanges();
//
//     let eventsList = sideFixture.nativeElement.querySelectorAll('td');
//     expect(eventsList[0].innerText).toBe('1: [BEvent name:hello]');
//     expect(eventsList[1].innerText).toBe('2: [BEvent name:world]');
//   });
// });

