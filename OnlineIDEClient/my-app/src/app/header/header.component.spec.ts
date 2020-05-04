import {SharedService} from "../data.service";
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {HeaderComponent} from "./header.component";
import {FormsModule} from "@angular/forms";
import {ClarityModule} from "@clr/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {By} from "@angular/platform-browser";
import {CodeEditorComponent} from "../code-editor/code-editor.component";

describe('header component tests', () => {

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

    /* Load the code editor (the header is tightly dependant on the code editor,
     * which is why we decided to test them as a single unit).
     * We load the component locally just in order to fully initialize the shared service for the tests */
    let tempCodeEditorFixture = TestBed.createComponent(CodeEditorComponent);
    tempCodeEditorFixture.detectChanges(); // call the ngAfterInit so the editor and the shared service are fully initialized

    sharedService = TestBed.get(SharedService);
  });

  afterEach(()=>{
    headerFixture.debugElement.nativeElement.remove();
    headerFixture.destroy();
  });

  it('should load the component successfully',  () => {
    expect(headerFixture.debugElement.query(By.css('header.header')).nativeElement).toBeTruthy(); // shows up on view
    expect(headerFixture.debugElement.query(By.css('nav.subnav')).nativeElement).toBeTruthy(); // shows up on view
    expect(headerComponent).toBeDefined();
  });

  it('should beautify content',  () => {
    let buttons = headerFixture.debugElement.queryAll(By.css('a.nav-link'));
    let beautifyButton;
    for(let button of buttons){
      if(button.nativeElement.innerText === '⦃ ⦄ BEAUTIFY')
        beautifyButton = button;
    }
    if(!beautifyButton)
      fail();

    let initialCode = sharedService.sharedCodeEditor.session.getValue(); // this code needs beautifying
    beautifyButton.nativeElement.click();
    let codeAfterFirstPress = sharedService.sharedCodeEditor.session.getValue();
    beautifyButton.nativeElement.click();
    let codeAfterSecondPress = sharedService.sharedCodeEditor.session.getValue();
    expect(initialCode).not.toBe(codeAfterFirstPress);
    expect(codeAfterFirstPress).toBe(codeAfterSecondPress);
  });

});
