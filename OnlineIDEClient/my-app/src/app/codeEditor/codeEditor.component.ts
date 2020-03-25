import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as ace from 'ace-builds';
import {Ace} from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';
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

  get staticOutput() {
    return CodeEditorComponent.output;
  }

  get staticDebbuger() {
    return CodeEditorComponent.debbuger;
  }

  static debbuger = false;
  static codeEditor: Ace.Editor;
  static code = '//*****Hello BPjs World*****\n\n' +
    'bp.registerBThread(function(){\n' +
    '  bp.sync({request:bp.Event("hello")});\n' +
    '  bp.sync({request:bp.Event("world")});\n' +
    '})';

  static editorBeautify;
  static output = '';
  public input = 'Add External Event';

  // @ts-ignore
  @ViewChild('codeEditor') codeEditorElmRef: ElementRef;

  ngAfterViewInit(): void {
    CodeEditorComponent.codeEditor = ace.edit(this.codeEditorElmRef.nativeElement, this.getEditorOptions());
    ace.require('ace/ext/language_tools');
    CodeEditorComponent.codeEditor.setTheme('ace/theme/twilight');
    CodeEditorComponent.codeEditor.getSession().setMode('ace/mode/javascript');
    CodeEditorComponent.editorBeautify = ace.require('ace/ext/beautify');
    CodeEditorComponent.codeEditor.setShowFoldWidgets(true);
    CodeEditorComponent.codeEditor.setValue('//*****Hello BPjs World*****\n\n' +
      'bp.registerBThread(function(){\n' +
      '  bp.sync({request:bp.Event("hello")});\n' +
      '  bp.sync({request:bp.Event("world")});\n' +
      '})');
    CodeEditorComponent.codeEditor.setOption('autoScrollEditorIntoView', true);
    CodeEditorComponent.codeEditor.setOption('maxLines', 14);
    CodeEditorComponent.codeEditor.setOption('minLines', 14);
    CodeEditorComponent.codeEditor.setFontSize('16px');

    this.OnContentChange((code) => {
      CodeEditorComponent.code = code;
    });
  }

  public getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 14,
      maxLines: Infinity,
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true
    };
    return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  public OnContentChange(callback: (content: string, delta: ace.Ace.Delta) => void): void {
    CodeEditorComponent.codeEditor.on('change', (delta) => {
      const content = CodeEditorComponent.codeEditor.getValue();
      callback(content, delta);
    });
  }
}
