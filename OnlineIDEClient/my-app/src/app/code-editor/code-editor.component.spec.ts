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
    fixture.detectChanges();
    sharedService = TestBed.get(SharedService);
  });

  it('should instantiate with the wanted code', () => {
    expect(fixture.debugElement.query(By.css('div.code-editor')).nativeElement).toBeTruthy(); // shows up on view
    expect(codeEditorComponent).toBeDefined(); // defined in code
    expect(sharedService.sharedCodeEditor.getValue()).toBe('//*****Hello BPjs World*****\n\n' +
      'bp.registerBThread(function(){\n' +
      '  bp.sync({request:bp.Event("hello")});\n' +
      '  bp.sync({request:bp.Event("world")});\n' +
      '})');
  });

  it('should bind the shared code and the editor value', () => {
    sharedService.sharedCodeEditor.setValue('test');
    expect(sharedService.sharedCode).toBe('test');
  });

  // it('should enable breakpoint functionality', () => {
  //   fixture.detectChanges();
  //   let gutterCell = fixture.debugElement.query(
  //     By.css('div.code-editor .ace_gutter')).nativeElement;
  //   window.alert(gutterCell)
  // });




});
