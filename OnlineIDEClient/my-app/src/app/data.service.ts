import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Ace} from 'ace-builds';
import * as ace from 'ace-builds';
import {Program} from "../BL/Program";
import {environment} from "../environments/environment";

@Injectable()
export class SharedService {

  // FOR THE CODE EDITOR COMPONENT
  private output = new BehaviorSubject('');
  //sharedOutput = this.output.asObservable();

  sharedExternalEvent = '';
  sharedProgram: Program;
  sharedDebuggerMode = false;
  sharedCodeEditor: Ace.Editor;
  sharedEditorBeautify;

  sharedCode = '//*****Hello BPjs World*****\n\n' +
    'bp.registerBThread("welcome", function() {\n' +
    '    bp.sync({\n' +
    '        request: bp.Event("hello")});\n' +
    '    bp.sync({\n' +
    '        request: bp.Event("world")});\n' +
    '})';

  constructor() {
    this.sharedEditorBeautify = ace.require('ace/ext/beautify');
    this.sharedProgram  = new Program(environment.API_URL);
  }

  BtrheadsList = [];

  sentence = [
    '\nbp.registerBThread ("...",function(){\n' +
    '            ...\n' +
    '            })\n',
    '\nbp.sync("...")\n',
    '\nbp.sync({waitFor:bp.Event("...")});\n',
    '\nbp.sync({request:bp.Event("...")});\n',
    '\nbp.sync({request:bp.Event("..."),' +
    ' block:bp.Event("...")});\n'
  ];
  sentences = [
    'bp.registerBThread',
    'bp.sync',
    'bp.sync - waitFor',
    'bp.sync - request',
    'bp.sync - request + block'
  ];
  shortcuts = {
    'Find': 'Ctrl-F',
    'Remove to  Line Start' : 'Alt-Backspace',
    'Remove to Line End' : 'Alt-Delete',
    'Remove Word Left' : 'Ctrl-Backspace',
    'Remove Word Right' : 'Ctrl-Delete',
    'Copy Lines Up' : 'Alt-Shift-Up',
    'Move Lines Up' : 'Alt-Up',
    'Copy Lines Down' : 'Alt-Shift-Down',
    'Move Lines Down' : 'Alt-Down',
    'Replace' : 'Ctrl-H',
    'Remove Line' : 'Ctrl-D',
    'Find Next' : 'Ctrl-K',
    'Find Previous' : 'Ctrl-Shift-K',
    'Scroll Up' : 'Ctrl-Up',
    'Scroll Down' : 'Ctrl-Down'
  }


  nextOutput(output: string) {
    this.output.next(output);
  }

  nextDebugger(debuggerMode: boolean) {
    this.sharedDebuggerMode = debuggerMode;
  }

}
