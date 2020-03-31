import {Component, AfterViewInit} from '@angular/core';
import {CodeEditorComponent} from './codeEditor/codeEditor.component';
import {Program} from '../BL/Program';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  private staticDebbuger = CodeEditorComponent.debugger;
  private program = new Program();


  ngAfterViewInit() {
    this.program.subscribeOutputStream(CodeEditorComponent);
  }

}
