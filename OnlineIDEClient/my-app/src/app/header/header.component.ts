import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {SharedService} from "../data.service";
import {MatDialog} from "@angular/material/dialog";
import {SaveFileDialogComponent} from "../save-file-dialog/save-file-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  /********************************************************************************************************************/
  // SETTERS, GETTERS AND META DATA STUFF
  /********************************************************************************************************************/

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  get staticDebugger() {
    return this._sharedService.sharedDebuggerMode;
  }

  private _themes = [
    'ace/theme/github',
    'ace/theme/sqlserver',
    'ace/theme/eclipse',
    'ace/theme/twilight',
    'ace/theme/vibrant_ink',
    'ace/theme/ambiance',
    'ace/theme/merbivore',
    'ace/theme/cobalt',
  ];

  constructor(private _sharedService: SharedService,
              private breakpointObserver: BreakpointObserver,
              private _dialog: MatDialog) {
  }

  /********************************************************************************************************************/
  // RUN MODE BUTTONS
  /********************************************************************************************************************/

  public run() {
    this._sharedService.sharedProgram.init('initRun', this._sharedService.sharedCode);
  }

  public stopRun() {
    window.alert('here')
  }

  public debug() {
    this._sharedService.nextDebugger(!this._sharedService.sharedDebuggerMode);
    this._sharedService.sharedProgram.init('initStep', this._sharedService.sharedCode);
    this._sharedService.sharedProgram.runner.setIsError(false);
    this._sharedService.sharedProgram.runner.setStdout('');
  }

  public beautify() {
    if (this._sharedService.sharedCodeEditor && this._sharedService.sharedEditorBeautify) {
      const session = this._sharedService.sharedCodeEditor.getSession();
      this._sharedService.sharedEditorBeautify.beautify(session);
    }
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

  /********************************************************************************************************************/
  // DEBUG MODE BUTTONS
  /********************************************************************************************************************/

  public stopDebug() {
    this._sharedService.nextDebugger(!this._sharedService.sharedDebuggerMode);
    this._sharedService.sharedProgram.debugger.initDebugger();
    this._sharedService.BtrheadsList = [];
  }

  public nextStep() {
    this._sharedService.sharedProgram.debugger.step();
    this._sharedService.BtrheadsList =
      this._sharedService.sharedProgram.debugger.getLastStep().bThreads.map(bt => bt.bThreadName);
  }

  public previousStep(){
    this._sharedService.sharedProgram.debugger.stepBack();
    this._sharedService.BtrheadsList =
      this._sharedService.sharedProgram.debugger.getLastStep().bThreads.map(bt => bt.bThreadName);
  }

  public nextBreakPoint() {
    window.alert('nextBreakPoint');
  }

  public previousBreakPoint() {
    window.alert('previousBreakPoint');
  }

  /********************************************************************************************************************/
  // MUTUAL BUTTONS
  /********************************************************************************************************************/

  public theme(n) {
    this._sharedService.sharedCodeEditor.setTheme(this._themes[n]);
  }

}
