import {AfterViewInit, Component} from '@angular/core';
import {SharedService} from '../data.service';
import {MatDialog} from '@angular/material/dialog';
import {SaveFileDialogComponent} from "../save-file-dialog/save-file-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements AfterViewInit  {

  private _debugger: boolean;
  private _themes = [
    'ace/theme/twilight',
    'ace/theme/eclipse',
    'ace/theme/gob',
    'ace/theme/solarized_light',
    'ace/theme/terminal',
    'ace/theme/ambiance'
  ];

  get debugger(): boolean {
    return this._debugger;
  }

  get themes(): string[] {
    return this._themes;
  }

  get sharedService(): SharedService {
    return this._sharedService;
  }

  get dialog(): MatDialog {
    return this._dialog;
  }

  get staticDebugger() {
    return this._sharedService.sharedDebuggerMode;
  }

  constructor(private _sharedService: SharedService, public _dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this._debugger = this._sharedService.sharedDebuggerMode;
  }

  // buttons
  public runCode() {
    this._sharedService.sharedProgram.init('initRun', this._sharedService.sharedCode);
  }

  public beautifyContent() {
    if (this._sharedService.sharedCodeEditor && this._sharedService.sharedEditorBeautify) {
      const session = this._sharedService.sharedCodeEditor.getSession();
      this._sharedService.sharedEditorBeautify.beautify(session);
    }
  }

  public undoContent() {
    if (this._sharedService.sharedCodeEditor) {
      this._sharedService.sharedCodeEditor.undo();
    }
  }

  public clearContent() {
    if (this._sharedService.sharedCodeEditor) {
      this._sharedService.sharedCodeEditor.getSession().setValue('');
    }
  }

  public debuggerMode() {
    this._sharedService.nextDebugger(!this._sharedService.sharedDebuggerMode);
    this._sharedService.sharedProgram.init('initStep', this._sharedService.sharedCode);
    this._sharedService.sharedProgram.runner.setIsError(false);
    this._sharedService.sharedProgram.runner.setStdout('');
  }

  public closeDebuggerMode() {
    this._sharedService.nextDebugger(!this._sharedService.sharedDebuggerMode);
    this._sharedService.sharedProgram.debugger.initDebugger();
    this._sharedService.BtrheadsList=[];
  }

  public loadFile(event) {
    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
      window.alert('Something went wrong.\nPlease try again...');
      return;
    }

    let selectedFile = event.target.files[0];
    let lastDot = selectedFile.name.lastIndexOf('.');
    let extension = selectedFile.name.substring(lastDot + 1);

    if(!['txt', 'js', 'ts'].includes(extension)){
      window.alert('Please choose an appropriate file type');
      return;
    }

    let reader = new FileReader();

    reader.onload = () => {
      this._sharedService.sharedCodeEditor.session.setValue(reader.result as string);
    };
    reader.onerror = (error) => {
      window.alert('Error reading file.\nCheck console...');
      console.error(error);
    };
    reader.onloadend = () => {
      reader = null;
    };

    reader.readAsText(selectedFile);
  }

  public downloadFile() {
    const dialogRef = this._dialog.open(SaveFileDialogComponent, {
      // width: '250px',
      // height: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result === typeof undefined)
        return;
      let element = document.createElement('a');
      element.style.display = 'none';
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(this._sharedService.sharedCodeEditor.session.getValue()));
      element.setAttribute('download', result + '.txt');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }

  public stepNext() {
    this._sharedService.sharedProgram.debugger.step();
    this.sharedService.BtrheadsList = this.sharedService.sharedProgram.debugger.getLastStep().bThreads.map(bt => bt.bThreadName);
  }

  public stepBack(){
    this._sharedService.sharedProgram.debugger.stepBack();
    this.sharedService.BtrheadsList = this.sharedService.sharedProgram.debugger.getLastStep().bThreads.map(bt => bt.bThreadName);
  }

  public nextBreakPoint() {
    window.alert('nextBreakPoint');
  }

  public previousBreakPoint() {
    window.alert('previousBreakPoint');
  }

  public theme(n) {
    this._sharedService.sharedCodeEditor.setTheme(this._themes[n-1]);
  }

  public setting() {
    window.open('https://bpjs.readthedocs.io/en/latest/#');
  }
}
