import {Component} from '@angular/core';
import {CodeEditorComponent} from '../codeEditor/codeEditor.component';
import {SideComponent} from '../side/side.component';
import {Program} from '../../BL/Program';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  get staticDebbuger() {
    return CodeEditorComponent.debugger;
  }

  static debugger = false;

  private program = new Program();

  public runCode() {
    this.program.init(CodeEditorComponent.code);
  }

  public beautifyContent() {
    if (CodeEditorComponent.codeEditor && CodeEditorComponent.editorBeautify) {
      const session = CodeEditorComponent.codeEditor.getSession();
      CodeEditorComponent.editorBeautify.beautify(session);
    }
  }

  public undoContent() {
    if (CodeEditorComponent.codeEditor) {
      CodeEditorComponent.codeEditor.undo();
    }
  }

  public clearContent() {
    if (CodeEditorComponent.codeEditor) {
      CodeEditorComponent.codeEditor.getSession().setValue('');
    }
  }

  public theme(n) {
    if (n === 1) {
      CodeEditorComponent.codeEditor.setTheme('ace/theme/twilight');
    } else if (n === 2) {
      CodeEditorComponent.codeEditor.setTheme('ace/theme/eclipse');
    } else if (n === 3) {
      CodeEditorComponent.codeEditor.setTheme('ace/theme/gob');
    }
  }

  public setting() {
    window.open('https://bpjs.readthedocs.io/en/latest/#');
  }

  public debuggerMode() {
    CodeEditorComponent.debugger = !CodeEditorComponent.debugger;
    SideComponent.debugger = !SideComponent.debugger;
    HeaderComponent.debugger = !HeaderComponent.debugger;
  }

  public loadFile() {
  }

  public downloadFile() {
  }

}
