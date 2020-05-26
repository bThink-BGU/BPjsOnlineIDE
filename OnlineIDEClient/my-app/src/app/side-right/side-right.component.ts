import {AfterViewInit, Component} from '@angular/core';
import {SharedService} from '../data.service';


@Component({
  selector: 'app-side-right',
  templateUrl: './side-right.component.html',
  styleUrls: ['./side-right.component.css']
})

export class SideRightComponent implements AfterViewInit {

  debugger: boolean;

  constructor(private sharedService: SharedService) {
  }

  ngAfterViewInit(): void {
    this.debugger = this.sharedService.sharedDebuggerMode;
  }

  get staticDebugger() {
    return this.sharedService.sharedDebuggerMode;
  }

  get bthreads() {
    return this.sharedService.sharedProgram.debugger.getLastStep().bThreads;
  }

  changed(evt, bt) {
    var isChecked = evt.target.checked;
    if(isChecked)
      this.sharedService.BtrheadsList.push(bt._bThreadName)
    else{
      this.sharedService.BtrheadsList = this.sharedService.BtrheadsList.filter(e => e != bt.bThreadName);    }
  }
  BThreads: any;
  checkbox: any = true;
}


