import {SharedService} from "../data.service";
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {CodeEditorComponent} from "./code-editor.component";
import {FormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";

describe('code editor tests', () => {
  let codeEditorComponent: CodeEditorComponent;
  let sharedService: SharedService;
  let fixture: ComponentFixture<CodeEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeEditorComponent],
      providers: [SharedService],
      imports: [FormsModule]
    });

    fixture = TestBed.createComponent(CodeEditorComponent);
    codeEditorComponent = fixture.componentInstance;
    sharedService = TestBed.get(SharedService);
    codeEditorComponent.ngAfterViewInit();
    fixture.detectChanges();
  });

  afterEach(()=>{
    fixture.debugElement.nativeElement.remove();
    fixture.destroy();
  });

  //7.1
  it('should instantiate the component and code editor with the wanted code', () => {
    expect(fixture.debugElement.query(By.css('#editor')).nativeElement).toBeTruthy(); // shows up on view
    expect(codeEditorComponent).toBeDefined(); // defined in code
    expect(sharedService.sharedCodeEditor.getValue()).toBe('//*****Hello BPjs World*****\n\n' +
      'bp.registerBThread("welcome", function() {\n' +
      '    bp.sync({\n' +
      '        request: bp.Event("hello")});\n' +
      '    bp.sync({\n' +
      '        request: bp.Event("world")});\n' +
      '})');
  });

  //7.2
  it('should bind the shared code and the editor value', () => {
    sharedService.sharedCodeEditor.setValue('test');
    expect(sharedService.sharedCode).toBe('test');
  });

});
