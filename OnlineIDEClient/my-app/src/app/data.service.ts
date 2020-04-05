import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as ace from "ace-builds";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private output = new BehaviorSubject('');
  sharedOutput = this.output.asObservable();
  sharedDebuggerMode = false;
  sharedCodeEditor;
  sharedEditorBeautify = ace.require('ace/ext/beautify');
  sharedCode = '//*****Hello BPjs World*****\n\n' +
    'bp.registerBThread(function(){\n' +
    '  bp.sync({request:bp.Event("hello")});\n' +
    '  bp.sync({request:bp.Event("world")});\n' +
    '})';

  constructor() { }

  nextOutput(output: string) {
    this.output.next(output)
  }

  nextDebugger(debuggerMode: boolean) {
    this.sharedDebuggerMode = debuggerMode;
  }

}
