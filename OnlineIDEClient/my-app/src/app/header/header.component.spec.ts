import {SharedService} from "../data.service";
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {HeaderComponent} from "./header.component";
import {FormGroup, FormsModule} from "@angular/forms";
import {ClarityModule} from "@clr/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {By} from "@angular/platform-browser";
import {CodeEditorComponent} from "../code-editor/code-editor.component";

describe('header unit tests', () => {
  let headerComponent: HeaderComponent;
  let headerFixture: ComponentFixture<HeaderComponent>;
  let sharedService: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, CodeEditorComponent],
      providers: [SharedService],
      imports: [
        FormsModule,
        ClarityModule,
        MatDialogModule
      ]
    });

    // load header
    headerFixture = TestBed.createComponent(HeaderComponent);
    headerComponent = headerFixture.componentInstance;
    headerFixture.detectChanges(); // call the ngAfterInit
    sharedService = TestBed.get(SharedService);
  });

  afterEach(()=>{
    headerFixture.debugElement.nativeElement.remove();
    headerFixture.destroy();
  });

  // THESE TESTS TEST THAT THE COMPONENT WAS LOADED AND THAT THE BUTTONS CALL THE RIGHT FUNCTIONS WHEN PRESSED

  it('should load the component successfully',  () => {
    expect(headerFixture.debugElement.query(By.css('header.header')).nativeElement).toBeTruthy(); // shows up on view
    expect(headerFixture.debugElement.query(By.css('nav.subnav')).nativeElement).toBeTruthy(); // shows up on view
    expect(headerComponent).toBeDefined();
  });

  it('should call the run method',  () => {
    let runButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '▶ RUN');
    if(runButton.length != 1)
      fail();

    spyOn(headerComponent, 'runCode').and.callThrough();
    runButton[0].nativeElement.click();
    expect(headerComponent.runCode).toHaveBeenCalled();
  });

  it('should call the beautify method',  () => {
    let beautifyButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '⦃ ⦄ BEAUTIFY');
    if(beautifyButton.length != 1)
      fail();

    spyOn(headerComponent, 'beautifyContent').and.callThrough();
    beautifyButton[0].nativeElement.click();
    expect(headerComponent.beautifyContent).toHaveBeenCalled();
  });

  it('should call the clear method',  () => {
    let clearButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '✖ CLEAR');
    if(clearButton.length != 1)
      fail();

    spyOn(headerComponent, 'clearContent').and.callThrough();
    clearButton[0].nativeElement.click();
    expect(headerComponent.clearContent).toHaveBeenCalled();
  });

  it('should call the undo method',  () => {
    let undoButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '↩ UNDO');
    if(undoButton.length != 1)
      fail();

    spyOn(headerComponent, 'undoContent').and.callThrough();
    undoButton[0].nativeElement.click();
    expect(headerComponent.undoContent).toHaveBeenCalled();
  });

  it('should call the load file method',  () => {
    let input = <HTMLInputElement> headerFixture.debugElement.query(By.css('input[type=file]')).nativeElement;
    let loadFileButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '📤 LOAD FILE');
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

  it('should call the download file method',  () => {
    let downloadFileButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '📥 DOWNLOAD FILE');
    if(downloadFileButton.length != 1)
      fail();

    spyOn(headerComponent, 'downloadFile').and.callFake(()=>{});
    downloadFileButton[0].nativeElement.click();
    expect(headerComponent.downloadFile).toHaveBeenCalled();
  });

  it('should switch to debug view and back and check that all debug buttons can be pressed',  () => {
    let debugButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '🐞 DEBUG');
    if(debugButton.length != 1)
      fail();

    spyOn(headerComponent, 'debuggerMode').and.callThrough();
    debugButton[0].nativeElement.click();
    expect(headerComponent.debuggerMode).toHaveBeenCalled();
    headerFixture.detectChanges();

    let newButtons = headerFixture.debugElement.queryAll(By.css('a.nav-text')).map(
      button => button.nativeElement);
    let newButtonsText = newButtons.map(button => button.innerText);
    expect(newButtonsText).toEqual(['🛑 STOP','⏬ STEP NEXT','⏫ STEP BACK',
      '⏩ NEXT BREAKPOINT','⏪ PREVIOUS BREAKPOINT']);

    spyOn(headerComponent, 'stepNext').and.callThrough();
    spyOn(headerComponent, 'stepBack').and.callThrough();
    spyOn(headerComponent, 'nextBreakPoint').and.callThrough();
    spyOn(headerComponent, 'previousBreakPoint').and.callThrough();

    newButtons[1].click();
    expect(headerComponent.stepNext).toHaveBeenCalled();
    newButtons[2].click();
    expect(headerComponent.stepBack).toHaveBeenCalled();
    newButtons[3].click();
    expect(headerComponent.nextBreakPoint).toHaveBeenCalled();
    newButtons[4].click();
    expect(headerComponent.previousBreakPoint).toHaveBeenCalled();

    newButtons[0].click();
    headerFixture.detectChanges();
    let oldButtons = headerFixture.debugElement.queryAll(By.css('a.nav-text')).map(
      button => button.nativeElement.innerText);
    expect(oldButtons).toEqual(['▶ RUN','⦃ ⦄ BEAUTIFY','✖ CLEAR',
      '↩ UNDO','📤 LOAD FILE','📥 DOWNLOAD FILE','🐞 DEBUG']);
  });
});


describe('header and code editor integration tests', () => {

  let headerComponent: HeaderComponent;
  let headerFixture: ComponentFixture<HeaderComponent>;
  let codeEditorFixture: ComponentFixture<CodeEditorComponent>;
  let sharedService: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, CodeEditorComponent],
      providers: [SharedService],
      imports: [
        FormsModule,
        ClarityModule,
        MatDialogModule
      ]
    });

    // load header
    headerFixture = TestBed.createComponent(HeaderComponent);
    headerComponent = headerFixture.componentInstance;
    headerComponent.ngAfterViewInit();
    headerFixture.detectChanges();

    /* Load the code editor (the header is tightly dependant on the code editor,
     * which is why we decided to test them as a single unit).
     * We load the component locally just in order to fully initialize the shared service for the tests */
    codeEditorFixture = TestBed.createComponent(CodeEditorComponent);
    codeEditorFixture.componentInstance.ngAfterViewInit();
    codeEditorFixture.detectChanges();

    sharedService = TestBed.get(SharedService);
  });

  afterEach(()=>{
    headerFixture.debugElement.nativeElement.remove();
    headerFixture.destroy();
    codeEditorFixture.debugElement.nativeElement.remove();
    codeEditorFixture.destroy();
  });

  it('should beautify content',  () => {
    let beautifyButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '⦃ ⦄ BEAUTIFY');
    if(beautifyButton.length != 1)
      fail();

    let initialCode = sharedService.sharedCodeEditor.session.getValue(); // this code needs beautifying
    beautifyButton[0].nativeElement.click();
    let codeAfterFirstPress = sharedService.sharedCodeEditor.session.getValue();
    beautifyButton[0].nativeElement.click();
    let codeAfterSecondPress = sharedService.sharedCodeEditor.session.getValue();
    expect(initialCode).not.toBe(codeAfterFirstPress);
    expect(codeAfterFirstPress).toBe(codeAfterSecondPress);
  });

  it('should clear content', ()=>{
    let clearButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '✖ CLEAR');
    if(clearButton.length != 1)
      fail();

    clearButton[0].nativeElement.click();
    let codeAfterFirstPress = sharedService.sharedCodeEditor.session.getValue();
    expect(codeAfterFirstPress).toBe('');
  });

  it('should undo content', ()=>{
    let undoButton = headerFixture.debugElement.queryAll(By.css('a.nav-link')).filter(
      button => button.nativeElement.innerText === '↩ UNDO');
    if(undoButton.length != 1)
      fail();

    sharedService.sharedCodeEditor.setValue('');
    sharedService.sharedCodeEditor.insert('This should not be here after click...');
    undoButton[0].nativeElement.click();
    expect(sharedService.sharedCodeEditor.session.getValue()).toBe('');
  });

});
