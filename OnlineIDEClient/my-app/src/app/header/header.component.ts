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
  //private program = new Program();

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

    this.sharedService.sharedProgram.init('initStep', this.sharedService.sharedCode);

    // while(not on break point's line){ nextStep() }

  }

  public loadFile(event) {
    let selectedFile = event.target.files[0];

    switch(selectedFile.type){
      case 'text/plain':
      case 'application/x-javascript':
        break;
      default:
        window.alert('Please choose an appropriate file type');
        return;
    }


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
      if(typeof result === typeof undefined)
        return;
      let element = document.createElement('a');
      element.style.display = 'none';
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(this.sharedService.sharedCodeEditor.session.getValue()));
      element.setAttribute('download', result+'.txt');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }

  public step() {
    this.sharedService.sharedProgram.debugger.step();
  }

  public addExternalEvent() {
    window.alert(this.sharedService.sharedExternalEvent);
    this.sharedService.sharedProgram.addExternalEvent(this.sharedService.sharedExternalEvent);
  }

  public check() {
    this.sharedService.wait = [];
    this.sharedService.block = [];
    this.sharedService.request = [];
    this.sharedService.variables = [];
    this.sharedService.trace = [];
  }
}
