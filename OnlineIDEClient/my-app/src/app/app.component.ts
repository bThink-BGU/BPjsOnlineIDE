import {Component, AfterViewInit} from '@angular/core';
import {CodeEditorComponent} from './code-editor/code-editor.component';
import {Program} from '../BL/Program';
import {SharedService} from './data.service';
import {IOutputData} from "angular-split/lib/interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  constructor(private sharedService: SharedService) { }

  ngAfterViewInit() {
    this.sharedService.sharedProgram.subscribeOutputStream(this.sharedService);
    
  }

  get staticDebugger() {
    return this.sharedService.sharedDebuggerMode;
  }

  // private wp_offset = 0;
  // private dragging_ace = false;

  startSplitterDrag() {
    this.sharedService.sharedCodeEditor.resize();
    //
    // let top_offset = this.sharedService.sharedCodeEditor.renderer.container.offsetTop - this.wp_offset;
    // this.dragging_ace = true;
    //
    // let mouse_move = (e) => {
    //   let actualY = e.pageY - this.wp_offset;
    //   // editor height
    //   let e_height = actualY - top_offset;
    //
    //   document.getElementById('editor-container').style.height = String(e_height);
    //   this.sharedService.sharedCodeEditor.renderer.container.style.height = String(e_height);
    //   this.sharedService.sharedCodeEditor.resize();
    // };
    //
    // document.addEventListener('mousemove', mouse_move, false);
    //
    // // window.addEventListener('mouseup', (e)=>{
    // //   if(this.dragging_ace){
    // //
    // //     let top_offset = this.sharedService.sharedCodeEditor.renderer.container.offsetTop - this.wp_offset;
    // //     let actualY = e.pageY - this.wp_offset;
    // //     let e_height = actualY - top_offset;
    // //     window.removeEventListener('mousemove', mouse_move, false);
    // //     document.getElementById('editor-container').style.height = String(e_height);
    // //     this.sharedService.sharedCodeEditor.resize();
    // //     this.dragging_ace = false;
    // //   }
    // // });
  }

}
