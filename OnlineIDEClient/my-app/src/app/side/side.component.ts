import {AfterViewInit, Component} from '@angular/core';
import {SharedService} from '../data.service';


@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})

export class SideComponent implements AfterViewInit {

  externalE: string;
  debugger: boolean;

  constructor(private sharedService: SharedService) {
    this.externalE = this.sharedService.sharedExternalEvent;
  }

  ngAfterViewInit(): void {
    this.debugger = this.sharedService.sharedDebuggerMode;
  }

  get externalEvent() {
    return this.sharedService.sharedExternalEvent;
  }
  set externalEvent(externalEvent) {
    this.sharedService.sharedExternalEvent = externalEvent;
  }
  get staticDebugger() {
    return this.sharedService.sharedDebuggerMode;
  }
  get trace() {
    return this.sharedService.sharedProgram.debugger.eventTrace;
  }
  get request() {
    return this.sharedService.sharedProgram.debugger.getLastStep().reqList;
  }
  get block() {
    return this.sharedService.sharedProgram.debugger.getLastStep().blockList;
  }

  get selectable() {
    return this.sharedService.sharedProgram.debugger.getLastStep().selectableEvents;
  }

  get sentences() {
    return this.sharedService.sentences;
  }

  get shortcuts() {
    return this.sharedService.shortcuts;
  }

  // buttons
  sentence: any
  Request: any;
  Block: any;
  Wait: any;
  Trace: any;
  shortcut: any;

  public addSentence(n) {
    this.sharedService.sharedCodeEditor.getSession().insert(this.sharedService.sharedCodeEditor.getCursorPosition(),
        this.sharedService.sentence[n]);
  }

  public addExternalEvent() {
    this.sharedService.sharedProgram.addExternalEvent(this.sharedService.sharedExternalEvent);
    this.sharedService.sharedExternalEvent = '';
    this.sharedService.BtrheadsList = this.sharedService.sharedProgram.debugger.getLastStep().bThreads.map(bt => bt.bThreadName);
  }

  public clickOnTrace(n){
    this.sharedService.sharedProgram.debugger.stepBackToIndex(n);
    this.sharedService.BtrheadsList = this.sharedService.sharedProgram.debugger.getLastStep().bThreads.map(bt => bt.bThreadName);
  }
}


