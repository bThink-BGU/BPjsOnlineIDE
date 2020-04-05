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
  private program = new Program();

  constructor(private sharedService: SharedService) { }

  ngAfterViewInit(): void {
    this.debugger = this.sharedService.sharedDebuggerMode;
  }

  get staticDebugger() {
    return this.sharedService.sharedDebuggerMode;
  }


  // buttons
  public runCode() {
    this.program.init(this.sharedService.sharedCode);
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

  public theme(n) {
    if (n === 1) {
      this.sharedService.sharedCodeEditor.setTheme('ace/theme/twilight');
    } else if (n === 2) {
      this.sharedService.sharedCodeEditor.setTheme('ace/theme/eclipse');
    } else if (n === 3) {
      this.sharedService.sharedCodeEditor.setTheme('ace/theme/gob');
    }
  }

  public setting() {
    window.open('https://bpjs.readthedocs.io/en/latest/#');
  }

  public debuggerMode() {
    this.sharedService.nextDebugger(!this.sharedService.sharedDebuggerMode);
  }

  public loadFile() {
  }

  public downloadFile() {
  }


}
