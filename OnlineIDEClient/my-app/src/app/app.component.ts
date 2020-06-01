import {Component, AfterViewInit} from '@angular/core';
import {CodeEditorComponent} from './code-editor/code-editor.component';
import {Program} from '../BL/Program';
import {SharedService} from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  constructor(private sharedService: SharedService) { }

  ngAfterViewInit() {
    this.sharedService.sharedProgram.subscribeOutputStream(this.sharedService);
  }

  get staticDebugger() {
    return this.sharedService.sharedDebuggerMode;
  }

}
