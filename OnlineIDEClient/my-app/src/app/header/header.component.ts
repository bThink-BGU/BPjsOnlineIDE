import {AfterContentChecked, AfterViewInit, Component} from '@angular/core';
import {CodeEditorComponent} from '../codeEditor/codeEditor.component';
import {SideComponent} from '../side/side.component';
import {Program} from '../../BL/Program';
import {SharedService} from '../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit  {

  debugger: boolean;
  themes = [
    'ace/theme/twilight',
    'ace/theme/eclipse',
    'ace/theme/gob',
    'ace/theme/solarized_light',
    'ace/theme/terminal',
    'ace/theme/ambiance'
  ];

  constructor(private sharedService: SharedService) { }

  ngAfterViewInit(): void {
    this.debugger = this.sharedService.sharedDebuggerMode;
  }

  get staticDebugger() {
    return this.sharedService.sharedDebuggerMode;
  }

  // buttons
  public runCode() {
    this.sharedService.sharedProgram.init('initRun', this.sharedService.sharedCode);
  }

  public beautifyContent() {
    if (this.sharedService.sharedCodeEditor && this.sharedService.sharedEditorBeautify) {
      const session = this.sharedService.sharedCodeEditor.getSession();
      this.sharedService.sharedEditorBeautify.beautify(session);
    }
  }

  public undoContent() {
    if (this.sharedService.sharedCodeEditor) {
      this.sharedService.sharedCodeEditor.undo();
    }
  }

  public clearContent() {
    if (this.sharedService.sharedCodeEditor) {
      this.sharedService.sharedCodeEditor.getSession().setValue('');
    }
  }

  public loadFile() {
    window.alert('loadFile');
  }

  public downloadFile() {
    window.alert('downloadFile');
  }

  public debuggerMode() {
    this.sharedService.nextDebugger(!this.sharedService.sharedDebuggerMode);
    this.sharedService.sharedProgram.init('initStep', this.sharedService.sharedCode);
    // while(not on break point's line){ nextStep() }
  }

  public nextStep() {
    this.sharedService.sharedProgram.debugger.step();
  }

  public previousStep(){
    window.alert('previousStep');
  }

  public nextBreakPoint(){
    window.alert('nextBreakPoint');
  }

  public previousBreakPoint(){
    window.alert('previousBreakPoint');
  }

  public theme(n) {
    this.sharedService.sharedCodeEditor.setTheme(this.themes[n-1]);
  }

  public setting() {
    window.open('https://bpjs.readthedocs.io/en/latest/#');
  }
}
