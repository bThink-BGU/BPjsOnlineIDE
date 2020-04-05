import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as ace from 'ace-builds';
import {Ace, Range} from 'ace-builds';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/webpack-resolver';
import {SharedService} from '../data.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './codeEditor.component.html',
  styleUrls: ['./codeEditor.component.css']
})

export class CodeEditorComponent implements AfterViewInit {

  constructor(private sharedService: SharedService) { }

  input = 'Add External Event';
  output: string;
  debugger: boolean;
  codeEditor: Ace.Editor;
  editorBeautify;
  code: string;

  private breakpoints: {};

  get Output() {
    return this.sharedService.sharedOutput;
  }

  @ViewChild('codeEditor', {static: false}) codeEditorElmRef: ElementRef;

  ngAfterViewInit(): void {
    this.debugger = this.sharedService.sharedDebuggerMode;
    this.code = this.sharedService.sharedCode;
    this.sharedService.sharedOutput.subscribe(output => this.output = output);
    this.editorBeautify = this.sharedService.sharedEditorBeautify;
    this.sharedService.sharedCodeEditor = ace.edit(this.codeEditorElmRef.nativeElement, this.getEditorOptions());
    this.codeEditor = this.sharedService.sharedCodeEditor;
    this.breakpoints = {};

    // Basic editor settings
    this.sharedService.sharedCodeEditor.setTheme('ace/theme/twilight');
    this.sharedService.sharedCodeEditor.getSession().setMode('ace/mode/javascript');
    this.sharedService.sharedCodeEditor.setValue(this.code);
    this.sharedService.sharedCodeEditor.focus();
    this.sharedService.sharedCodeEditor.selection.clearSelection();

    // Custom editor settings
    this.prepareEditor();
  }

  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
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

  private prepareEditor() {
    this.bindCodeVariableAndValue();
    this.enableBreakpoints();
    this.enableMoveBreakpointsOnChange();
  }

  private bindCodeVariableAndValue() {
    this.sharedService.sharedCodeEditor.on('change', () => {
      this.sharedService.sharedCode = this.sharedService.sharedCodeEditor.getValue();
    });
  }

  private enableBreakpoints() {
    // not "on(...)" to prevent ace from calling the original default handler
    this.codeEditor.setDefaultHandler('guttermousedown', (e) => {
      let mouseEvent = <MouseEvent>e;
      if (!this.codeEditor.isFocused())
        return;

      // foldWidgets area according to getRegion() function in ace.js
      // assuming showFoldWidgets is on
      // 13 is the padding
      if (mouseEvent.clientX > this.codeEditor.renderer
        .getMouseEventTarget().getBoundingClientRect().left - 13)
        return;

      let row = this.codeEditor.renderer.screenToTextCoordinates(mouseEvent.clientX,
        mouseEvent.clientY).row;

      if(!(row in this.breakpoints)) {
        if(this.codeEditor.session.getLine(row) != '') //add support for only bp breakpoints here
          this.addBreakpoint(row);
      }
      else {
        this.removeBreakpoint(row);
      }
    });
  }

  private addBreakpoint(row: number) {
    if(typeof this.codeEditor.session.getBreakpoints()[row] != typeof undefined) // if a breakpoint exists
      return;
    this.codeEditor.session.setBreakpoint(row, 'ace_breakpoint');
    let markerID = this.codeEditor.session.addMarker(
      new Range(row, 0, row, Infinity),
      'breakpoint-marker',
      'fullLine',
      false);
    this.breakpoints[row] = {'markerID': markerID};
  }

  private removeBreakpoint(row: number) {
    if(typeof this.codeEditor.session.getBreakpoints()[row] == typeof undefined) // if a breakpoint doesn't exist
      return;
    this.codeEditor.session.clearBreakpoint(row);
    this.codeEditor.session.removeMarker(this.breakpoints[row]['markerID']);
    delete this.breakpoints[row];
  }

  private sortKeys() {
    let sorted = [];
    for (let key in this.breakpoints) {
      sorted[sorted.length] = parseInt(key);
    }
    sorted.sort();
    return sorted;
  }

  private enableMoveBreakpointsOnChange() {
    this.codeEditor.on('change', (e) => {
      if (Object.keys(this.breakpoints).length > 0 && e.lines.length > 1) {
        let sortedRows = e.action === 'insert' ? this.sortKeys().reverse() : this.sortKeys();
        for (let breakpointRow of sortedRows) { // go over reverse sorted rows to avoid breakpoint overlap
          if (e.action === 'insert') {
            if (breakpointRow == e.start.row) {
              if (this.codeEditor.session.getLine(breakpointRow) === '') {
                this.removeBreakpoint(breakpointRow);
                this.addBreakpoint(breakpointRow + e.lines.length - 1);
              }
            } else if (breakpointRow > e.start.row) {
              this.removeBreakpoint(breakpointRow);
              this.addBreakpoint(breakpointRow + (e.end.row - e.start.row));
            }
          } else {  // e.action === 'remove'

            if(breakpointRow > e.start.row && breakpointRow < e.end.row){
              this.removeBreakpoint(breakpointRow);
            }
            if(breakpointRow > e.end.row){
              this.removeBreakpoint(breakpointRow);
              this.addBreakpoint(breakpointRow - (e.end.row - e.start.row));
            }
            if(breakpointRow == e.end.row){
              if(e.lines[e.lines.length-1] === ''){
                this.removeBreakpoint(breakpointRow);
                this.addBreakpoint(breakpointRow - (e.end.row - e.start.row));
              }
              else{
                this.removeBreakpoint(breakpointRow);
              }
            }
          }
        }
      }
    });
  }
}

