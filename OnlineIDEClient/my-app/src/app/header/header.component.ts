import {AfterViewInit, Component, NgModule, ViewChild} from '@angular/core';
import {SharedService} from '../data.service';
import {MatDialog} from '@angular/material/dialog';
import {SaveFileDialogComponent} from "../save-file-dialog/save-file-dialog.component";

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

  constructor(private sharedService: SharedService, public dialog: MatDialog) { }


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

  public debuggerMode() {
    this.sharedService.nextDebugger(!this.sharedService.sharedDebuggerMode);
    this.sharedService.sharedProgram.init('initStep', this.sharedService.sharedCode);
    this.sharedService.sharedProgram.runner.initRun();
    // while(not on break point's line){ nextStep() }
  }

  public closeDebuggerMode(){
    this.sharedService.nextDebugger(!this.sharedService.sharedDebuggerMode);
    this.sharedService.sharedProgram.debugger.initDebugger();
  }


  public stepNext() {
    this.sharedService.sharedProgram.debugger.step();
  }

  public loadFile(event) {
    let selectedFile = event.target.files[0];
    // window.alert(selectedFile.type);
    // switch(selectedFile.type){
    //   case 'text/plain':
    //   case 'application/x-javascript':
    //     break;
    //   default:
    //     window.alert('Please choose an appropriate file type');
    //     return;
    // }


    let reader = new FileReader();

    reader.onload = () => {
      this.sharedService.sharedCodeEditor.session.setValue(reader.result as string);
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
    const dialogRef = this.dialog.open(SaveFileDialogComponent, {
      // width: '250px',
      // height: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result === typeof undefined)
        return;
      let element = document.createElement('a');
      element.style.display = 'none';
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(this.sharedService.sharedCodeEditor.session.getValue()));
      element.setAttribute('download', result + '.txt');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }
  public stepBack(){
    this.sharedService.sharedProgram.debugger.stepBack();
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
