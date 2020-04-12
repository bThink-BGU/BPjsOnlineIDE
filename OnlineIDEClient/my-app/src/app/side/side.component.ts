import {AfterViewInit, Component} from '@angular/core';
import {CodeEditorComponent} from '../codeEditor/codeEditor.component';
import {SharedService} from '../data.service';


@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})

export class SideComponent implements AfterViewInit {

  debugger: boolean;

  constructor(private sharedService: SharedService) { }

  ngAfterViewInit(): void {
    this.debugger = this.sharedService.sharedDebuggerMode;
  }

  get staticDebugger() {
    return this.sharedService.sharedDebuggerMode;
  }

  get trace (){
    return this.sharedService.trace;
  }
  get request (){
    return this.sharedService.request;
  }
  get block (){
    return this.sharedService.block;
  }
  get wait (){
    return this.sharedService.wait;
  }
  get variables (){
    return this.sharedService.variables;
  }
  get sentences (){
    return this.sharedService.sentences;
  }

  // buttons
  public addSentence(n) {
    if (n === 1) {
      this.sharedService.sharedCodeEditor.getSession().insert(this.sharedService.sharedCodeEditor.getCursorPosition(),
        '\nbp.registerBThread ("...",function(){\n' +
        '            ...\n' +
        '            })\n');
    } else if (n === 2) {
      this.sharedService.sharedCodeEditor.getSession().insert(this.sharedService.sharedCodeEditor.getCursorPosition(),
        '\nbp.sync({waitFor:bp.Event("...")});\n');
    } else if (n === 3) {
      this.sharedService.sharedCodeEditor.getSession().insert(this.sharedService.sharedCodeEditor.getCursorPosition(),
        '\nbp.sync({request:bp.Event("...")});\n');
    } else if (n === 4) {
      this.sharedService.sharedCodeEditor.getSession().insert(this.sharedService.sharedCodeEditor.getCursorPosition(),
        '\nbp.sync({request:bp.Event("..."),' +
        ' block:bp.Event("...")});\n');
    }
  }
}
