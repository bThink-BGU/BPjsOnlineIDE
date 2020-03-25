import {Component} from '@angular/core';
import {CodeEditorComponent} from '../codeEditor/codeEditor.component';


@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent {
  get staticDebbuger() {
    return CodeEditorComponent.debbuger;
  }

  static debbuger = false;

  //Ask amir what to do - unused

  public addSentence(n) {
    if (n === 1) {
      CodeEditorComponent.codeEditor.getSession().insert(CodeEditorComponent.codeEditor.getCursorPosition(),
        '\nbp.registerBThread ("...",function(){\n' +
        '            ...\n' +
        '            })\n');
    } else if (n === 2) {
      CodeEditorComponent.codeEditor.getSession().insert(CodeEditorComponent.codeEditor.getCursorPosition(),
        '\nbp.sync({waitFor:bp.Event("...")});\n');
    } else if (n === 3) {
      CodeEditorComponent.codeEditor.getSession().insert(CodeEditorComponent.codeEditor.getCursorPosition(),
        '\nbp.sync({request:bp.Event("...")});\n');
    } else if (n === 4) {
      CodeEditorComponent.codeEditor.getSession().insert(CodeEditorComponent.codeEditor.getCursorPosition(),
        '\nbp.sync({request:bp.Event("..."),' +
        ' block:bp.Event("...")});\n');
    }
  }
}
