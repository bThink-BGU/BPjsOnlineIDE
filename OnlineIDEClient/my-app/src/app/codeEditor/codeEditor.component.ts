import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as ace from 'ace-builds';
import {Ace} from 'ace-builds';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/webpack-resolver';

@Component({
  selector: 'app-code-editor',
  templateUrl: './codeEditor.component.html',
  styleUrls: ['./codeEditor.component.css']
})

export class CodeEditorComponent implements AfterViewInit {

  static debugger = false;
  static codeEditor: Ace.Editor;
  static code = '//*****Hello BPjs World*****\n\n' +
    'bp.registerBThread(function(){\n' +
    '  bp.sync({request:bp.Event("hello")});\n' +
    '  bp.sync({request:bp.Event("world")});\n' +
    '})';

  static editorBeautify;
  static output = '';
  public input = 'Add External Event';

  get staticOutput() {
    return CodeEditorComponent.output;
  }

  @ViewChild('codeEditor', {static: false}) codeEditorElmRef: ElementRef;

  ngAfterViewInit(): void {
    // Basic editor settings
    CodeEditorComponent.codeEditor = ace.edit(this.codeEditorElmRef.nativeElement, CodeEditorComponent.getEditorOptions());
    CodeEditorComponent.codeEditor.setTheme('ace/theme/twilight');
    CodeEditorComponent.codeEditor.getSession().setMode('ace/mode/javascript');
    CodeEditorComponent.editorBeautify = ace.require('ace/ext/beautify');
    CodeEditorComponent.codeEditor.setValue(CodeEditorComponent.code);
    CodeEditorComponent.codeEditor.focus();
    CodeEditorComponent.codeEditor.selection.clearSelection();

    // Custom editor settings
    CodeEditorComponent.prepareEditor();
  }

  private static getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      autoScrollEditorIntoView: true,
      showFoldWidgets: true,
      minLines: 14,
      maxLines: 14,
      fontSize: 16,
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true
    };
    return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  private static prepareEditor(){
    CodeEditorComponent.bindCodeVariableAndValue();
    CodeEditorComponent.enableBreakpoints();
  }

  private static bindCodeVariableAndValue(){
    CodeEditorComponent.codeEditor.on('change', ()=>{
      CodeEditorComponent.code = CodeEditorComponent.codeEditor.getValue();
    });
  }

  private static enableBreakpoints(){
    CodeEditorComponent.codeEditor.on('guttermousedown', (e)=>{
      let mouseEvent = <MouseEvent> e;

      if (CodeEditorComponent.codeEditor.renderer.getMouseEventTarget().className.indexOf('ace_scroller') == -1)
        return;
      if (!CodeEditorComponent.codeEditor.isFocused())
        return;
      if (mouseEvent.clientX > 25 + CodeEditorComponent.codeEditor.renderer.getMouseEventTarget().getBoundingClientRect().left)
        return;

      let row = CodeEditorComponent.codeEditor.renderer.screenToTextCoordinates(mouseEvent.clientX,
        mouseEvent.clientY).row;
      let breakpoints = CodeEditorComponent.codeEditor.getSession().getBreakpoints();

      if(typeof breakpoints[row] === typeof undefined)
        CodeEditorComponent.codeEditor.getSession().setBreakpoint(row, 'ace_breakpoint');
      else
        CodeEditorComponent.codeEditor.getSession().clearBreakpoint(row);
    });
  }


}
