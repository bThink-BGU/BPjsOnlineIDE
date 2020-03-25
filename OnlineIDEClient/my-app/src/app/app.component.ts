import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

import * as ace from 'ace-builds';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/theme-twilight';
// import 'ace-builds/src-noconflict/theme-eclipse';
// import 'ace-builds/src-noconflict/theme-gob';
import 'ace-builds/src-noconflict/ext-language_tools';
// import 'ace-builds/src-noconflict/ext-beautify';
// import 'ace-builds/webpack-resolver';

import {CodeEditorComponent} from './codeEditor/codeEditor.component';
import {subscribeOutputStream} from "../BL/Program";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  private staticDebbuger = CodeEditorComponent.debbuger;

  @ViewChild('codeEditor', {read: ElementRef, static: false}) codeEditorElmRef: ElementRef;
  // @Input() content: string; // why need this?


  ngAfterViewInit() {

    ace.require('ace/ext/language_tools');
    subscribeOutputStream(CodeEditorComponent);
  }

}
