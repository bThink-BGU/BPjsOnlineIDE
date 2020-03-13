import {Component, ViewChild, ElementRef, AfterViewInit, Input} from '@angular/core';

import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/theme-gob';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/webpack-resolver';

import {initSL, runSL, } from '../SL/Program';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) export class AppComponent implements AfterViewInit {

  @ViewChild('codeEditor', {read: ElementRef, static: false}) codeEditorElmRef: ElementRef;
  @Input() content: string;
  private codeEditor: ace.Ace.Editor;
  private editorBeautify;
  private code = '//*****Hello BPjs World*****\n\n' +
    'bp.registerBThread(function(){\n' +
    '  bp.sync({request:bp.Event("hello")});\n' +
    '  bp.sync({request:bp.Event("world")});\n' +
    '})';
  private output: string = 'output';

  ngAfterViewInit() {
    this.codeEditor = ace.edit(this.codeEditorElmRef.nativeElement, this.getEditorOptions());
    ace.require('ace/ext/language_tools');
    this.codeEditor.setTheme('ace/theme/twilight');
    this.codeEditor.getSession().setMode('ace/mode/javascript');
    this.editorBeautify = ace.require('ace/ext/beautify');
    this.codeEditor.setShowFoldWidgets(true);
    this.codeEditor.setValue('//*****Hello BPjs World*****\n\n' +
      'bp.registerBThread(function(){\n' +
      '  bp.sync({request:bp.Event("hello")});\n' +
      '  bp.sync({request:bp.Event("world")});\n' +
      '})');
    this.codeEditor.setOption('autoScrollEditorIntoView', true);
    this.codeEditor.setOption('maxLines', 14);
    this.codeEditor.setOption('minLines', 14);

    this.codeEditor.setFontSize('16px');

    this.OnContentChange((code) => { this.code = code; });
  }

  // for debugging
  private getCode() {
    const code = this.codeEditor.getValue();
    console.log(code);
  }

  getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
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

  public getContent() {
    if (this.codeEditor) {
      return this.codeEditor.getValue();
    }
  }

  public setContent(content: string): void {
    if (this.codeEditor) {
      this.codeEditor.setValue(content);
    }
  }


  public runCode() {
    initSL(this.code).then(() => {
      runSL().then((codeOutput) => {
        this.output = codeOutput.toString();
      }, (errorMessage) => {
        this.output = errorMessage;
      });
      }, (errorMessage) => {
      this.output = errorMessage;
    });
  }

  public beautifyContent() {
    if (this.codeEditor && this.editorBeautify) {
      const session = this.codeEditor.getSession();
      this.editorBeautify.beautify(session);
    }
  }

  public undoContent() {
    if (this.codeEditor) {
      this.codeEditor.undo();
    }
  }
  public clearContent() {
    if (this.codeEditor) {
      this.codeEditor.getSession().setValue('');
    }
  }

  public addSentence(n) {
    if (n === 1) {
      this.codeEditor.getSession().insert(this.codeEditor.getCursorPosition(), '\nbp.registerBThread ("...",function(){\n' +
        '            ...\n' +
        '            })\n');
    } else if (n === 2) {
      this.codeEditor.getSession().insert(this.codeEditor.getCursorPosition(), '\nbp.sync({waitFor:bp.Event("...")});\n');
    } else if (n === 3) {
      this.codeEditor.getSession().insert(this.codeEditor.getCursorPosition(), '\nbp.sync({request:bp.Event("...")});\n');
    } else if (n === 4) {
      this.codeEditor.getSession().insert(this.codeEditor.getCursorPosition(), '\nbp.sync({request:bp.Event("..."),' +
        ' block:bp.Event("...")});\n');
    }
  }

  public theme(n) {
    if (n === 1) {
      this.codeEditor.setTheme('ace/theme/twilight');
    } else if (n === 2) {
      this.codeEditor.setTheme('ace/theme/eclipse');
    } else if (n === 3) {
      this.codeEditor.setTheme('ace/theme/gob');
    }
  }

  /**
   * @event OnContentChange - a proxy event to Ace 'change' event - adding additional data.
   * @param callback - receive the current content and 'change' event's original parameter.
   */
  public OnContentChange(callback: (content: string, delta: ace.Ace.Delta) => void): void {
    this.codeEditor.on('change', (delta) => {
      const content = this.codeEditor.getValue();
      callback(content, delta);
    });
  }
}
