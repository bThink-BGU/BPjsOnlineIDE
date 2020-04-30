import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Ace} from 'ace-builds';
import * as ace from 'ace-builds';
import {Program} from "../BL/Program";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private output = new BehaviorSubject('');
  sharedOutput = this.output.asObservable();

  sharedExternalEvent = '';
  sharedProgram;
  sharedDebuggerMode = false;
  sharedCodeEditor: Ace.Editor;
  sharedEditorBeautify = ace.require('ace/ext/beautify');

  sharedCode = '//*****Hello BPjs World*****\n\n' +
    'bp.registerBThread(function(){\n' +
    '  bp.sync({request:bp.Event("hello")});\n' +
    '  bp.sync({request:bp.Event("world")});\n' +
    '})';

  trace = [
    {name:'Superman'},
    {name:'Batman'},
    {name:'BatGirl'},
    {name:'Robin'},
    {name:'Flash'},
    {name:'Superman'},
    {name:'BatGirl'},
    {name:'Robin'},
    {name:'Flash'},
    {name:'Superman'},
    {name:'BatGirl'},
    {name:'Robin'},
    {name:'Flash'},
    {name:'Superman'}
  ];
  request = [
    {name:'-Superman'},
    {name:'-Batman'},
    {name:'-BatGirl'},
    {name:'-Robin'},
    {name:'-Flash'},
    {name:'-Superman'},
    {name:'-BatGirl'},
    {name:'-Robin'},
    {name:'-Flash'},
    {name:'-Superman'},
    {name:'-BatGirl'},
    {name:'-Robin'},
    {name:'-Flash'},
    {name:'-Superman'}
  ];
  block = [
    {name:'Superman'},
    {name:'Batman'},
    {name:'BatGirl'},
    {name:'Robin'}
  ];
  wait = [
    {name:'hello'},
    {name:'Worls'},
    {name:'Stop'},
    {name:'longLongLongEvent'},
    {name:'s'},
    {name:'hello'},
    {name:'Worls'},
    {name:'Stop'},
    {name:'longLongLongEvent'},
    {name:'s'},{name:'hello'},
    {name:'Worls'},
    {name:'Stop'},
    {name:'longLongLongLongLongLongEvent'},
    {name:'s'}
  ];
  variables = [
    {id: 1, name:'x'},
    {id: 2, name:'Batman'},
    {id: 5, name:'amir'},
    {id: 3, name:'Robin'},
    {id: 4, name:'y'},
    {id: 1, name:'Superman'},
    {id: '2x+5', name:'Batman'},
    {id: 500, name:'helloWorld'},
    {id: '2a', name:'Robin'},
    {id: 4000, name:'Flash'},
    {id: 0.9, name:'guy'},
    {id: 200, name:'Batman'},
    {id: 5, name:'ofek'},
    {id: 3, name:'Robin'},
  ];

  sentence = [
    '\nbp.registerBThread ("...",function(){\n' +
    '            ...\n' +
    '            })\n',
    '\nbp.sync({waitFor:bp.Event("...")});\n',
    '\nbp.sync({request:bp.Event("...")});\n',
    '\nbp.sync({request:bp.Event("..."),' +
    ' block:bp.Event("...")});\n'
  ];
  sentences = [
    'bp.registerBThread',
    'bp.sync - waitFor',
    'bp.sync - request',
    'bp.sync - request + block'
  ];

  constructor() {
    this.sharedProgram  = new Program('ws://localhost:8080/OnlineIDEServer/api');
  }

  nextOutput(output: string) {
    this.output.next(output)
  }

  nextDebugger(debuggerMode: boolean) {
    this.sharedDebuggerMode = debuggerMode;
  }

}
