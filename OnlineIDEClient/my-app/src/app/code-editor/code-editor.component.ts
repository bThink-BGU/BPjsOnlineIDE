import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as ace from 'ace-builds';
import {Ace, Range} from 'ace-builds';
import 'ace-builds/src-noconflict/theme-twilight'; // default theme
import 'ace-builds/src-noconflict/mode-javascript'; // for the custom bpjs mode what extends the javascript mode
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-language_tools'; // for auto-completion on ctrl-space
import 'ace-builds/webpack-resolver'; // for syntax checking to work properly
import {SharedService} from "../data.service";


@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent implements AfterViewInit {

  //input : string;
  // output: string;
  // debugger: boolean;
  // editorBeautify;
  // code: string;

  private codeEditor: Ace.Editor;
  private breakpoints: {};

  constructor(private sharedService: SharedService) { }

  @ViewChild('codeEditor', {static: false}) codeEditorElmRef: ElementRef;

  ngAfterViewInit(): void {
    // this.sharedService.sharedOutput.subscribe(output => this.output = output); - not needed because not used
    // this.debugger = this.sharedService.sharedDebuggerMode; - not needed because not used
    // this.code = this.sharedService.sharedCode; - not needed because not used
    // this.editorBeautify = this.sharedService.sharedEditorBeautify; - not needed because not used
    this.codeEditor = ace.edit(this.codeEditorElmRef.nativeElement, this.getEditorOptions());
    this.sharedService.sharedCodeEditor = this.codeEditor; // make the code editor usable by other components
    this.breakpoints = {};

    // Basic editor settings, custom mode will be set in the setBpjs() function
    this.codeEditor.setTheme('ace/theme/twilight');
    this.codeEditor.setValue(this.sharedService.sharedCode);
    this.codeEditor.focus();
    this.codeEditor.selection.clearSelection();

    // Custom editor settings
    this.prepareEditor();
  }

  get Output() {
    return this.sharedService.sharedProgram.runner.stdout;
  }

  get OutputDebug() {
    return this.sharedService.sharedProgram.debugger.stdout;
  }

  get staticDebugger() {
    return this.sharedService.sharedDebuggerMode;
  }

  get externalEvent() {
    return this.sharedService.sharedExternalEvent;
  }


  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {

    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      autoScrollEditorIntoView: true,
      showFoldWidgets: true,
      minLines: 14,
      maxLines: 14,
      fontSize: 16,
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true
    };
    return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  private prepareEditor() {
    this.setBpjsMode();
    this.bindCodeVariableAndValue();
    this.enableBreakpoints();
    this.enableMoveBreakpointsOnChange();
    this.disableSettingsMenu();
  }

  private bindCodeVariableAndValue() {
    this.codeEditor.on('change', () => {
      this.sharedService.sharedCode = this.codeEditor.getValue();
    });
  }

  /* The ts-ignore suppresses in this method are essential because the ace.d.ts file is not full.
     Typescript throws type errors because some methods exist in ace.js but are not declared in ace.d.ts. */
  private enableBreakpoints() {
    // not "on(...)" to prevent ace from calling the original default handler
    this.codeEditor.setDefaultHandler('guttermousedown', (e) => {
      if (e.domEvent.target.className.indexOf("ace_gutter-cell") == -1)
        return;
      if (!this.codeEditor.isFocused())
        return;
      // @ts-ignore
      if(this.codeEditor.renderer.$gutterLayer.getRegion(e) === 'foldWidgets')
        return;
      // @ts-ignore
      let row = e.getDocumentPosition().row;

      if(!(row in this.breakpoints)) {
        if(this.codeEditor.session.getLine(row) != '') //add support for only bp breakpoints here
          //add support for not being able to set a breakpoint on an existing annotation maybe
          this.addBreakpoint(row);
      }
      else {
        this.removeBreakpoint(row);
      }
    });
  }

  private addBreakpoint(row: number) {
    if(typeof this.codeEditor.session.getBreakpoints()[row] != typeof undefined) // if a breakpoint exists
      return;
    this.codeEditor.session.setBreakpoint(row, 'ace_breakpoint');
    let markerID = this.codeEditor.session.addMarker(
      new Range(row, 0, row, Infinity),
      'breakpoint-marker',
      'fullLine',
      false);
    this.breakpoints[row] = {'markerID': markerID};
  }

  private removeBreakpoint(row: number) {
    if(typeof this.codeEditor.session.getBreakpoints()[row] == typeof undefined) // if a breakpoint doesn't exist
      return;
    this.codeEditor.session.clearBreakpoint(row);
    this.codeEditor.session.removeMarker(this.breakpoints[row]['markerID']);
    delete this.breakpoints[row];
  }

  private sortKeys() {
    let sorted = [];
    for (let key in this.breakpoints) {
      sorted[sorted.length] = parseInt(key);
    }
    sorted.sort();
    return sorted;
  }

  private enableMoveBreakpointsOnChange() {
    this.codeEditor.on('change', (e) => {
      if (Object.keys(this.breakpoints).length > 0 && e.lines.length > 1) {
        let sortedRows = e.action === 'insert' ? this.sortKeys().reverse() : this.sortKeys();
        for (let breakpointRow of sortedRows) { // go over reverse sorted rows to avoid breakpoint overlap
          if (e.action === 'insert') {
            if (breakpointRow == e.start.row) {
              if (this.codeEditor.session.getLine(breakpointRow) === '') {
                this.removeBreakpoint(breakpointRow);
                this.addBreakpoint(breakpointRow + e.lines.length - 1);
              }
            } else if (breakpointRow > e.start.row) {
              this.removeBreakpoint(breakpointRow);
              this.addBreakpoint(breakpointRow + (e.end.row - e.start.row));
            }
          } else {  // e.action === 'remove'

            if(breakpointRow > e.start.row && breakpointRow < e.end.row){
              this.removeBreakpoint(breakpointRow);
            }
            if(breakpointRow > e.end.row){
              this.removeBreakpoint(breakpointRow);
              this.addBreakpoint(breakpointRow - (e.end.row - e.start.row));
            }
            if(breakpointRow == e.end.row){
              if(e.lines[e.lines.length-1] === ''){
                this.removeBreakpoint(breakpointRow);
                this.addBreakpoint(breakpointRow - (e.end.row - e.start.row));
              }
              else{
                this.removeBreakpoint(breakpointRow);
              }
            }
          }
        }
      }
    });
  }

  private setBpjsMode() {
    let oop = ace.require("ace/lib/oop");
    let jsMode = ace.require("ace/mode/javascript").Mode;
    let JavaScriptHighlightRules = ace.require("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
    let WorkerClient = ace.require("ace/worker/worker_client").WorkerClient;
    let CstyleBehaviour = ace.require("ace/mode/behaviour/cstyle").CstyleBehaviour;
    let CStyleFoldMode = ace.require("ace/mode/folding/cstyle").FoldMode;
    let MatchingBraceOutdent = ace.require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;

    // custom highlighting rules
    let bpjsHighlightRules = function (options) {

      // ADD NEW BPjs RULES HERE ACCORDING TO THE ACE EDITOR DOCUMENTATION
      // ADD CUSTOM CSS STYLING (IF NEEDED) IN THE styles.css FILE.
      // FOR TOKEN example, THE NAME OF THE STYLE CLASS WILL BE ace_example

      let bpjsRules = [
        {
          token : "bp_commands",
          regex : /(bp)(\.)(sync|Event|registerBThread)\b/
        },
        {
          token : "bp_keywords",
          regex : /(block|request|waitFor)\b/
        }
      ];


      let JSRules = new JavaScriptHighlightRules({jsx: (options && options.jsx) == true}).getRules();
      JSRules.no_regex = bpjsRules.concat(JSRules.no_regex);

      this.$rules = JSRules;
    };
    oop.inherits(bpjsHighlightRules, JavaScriptHighlightRules);

    //custom mode
    let bpjsMode = function() {
      this.HighlightRules = bpjsHighlightRules;
      this.$outdent = new MatchingBraceOutdent();
      this.$behaviour = new CstyleBehaviour();
      this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(bpjsMode, jsMode);

    //custom worker for live syntax checking - currently supports javascript syntax only
    (function() {
      this.createWorker = function(session) {
        let worker = new WorkerClient(["ace"], "ace/mode/javascript_worker", "JavaScriptWorker");
        worker.attachToDocument(session.getDocument());

        worker.on("annotate", function(results) {
          session.setAnnotations(results.data);
        });

        worker.on("terminate", function() {
          session.clearAnnotations();
        });

        return worker;
      };

      this.$id = "ace/mode/bpjs";

    }).call(bpjsMode.prototype);

    // finally, set the newly created mode dynamically for the current ace session
    this.codeEditor.getSession().setMode(new bpjsMode());

  }

  /* Ace's settings menu feature has things unnecessary for this project, such as setting a mode and disabling
  * the margin. Keeping it will expose the user to errors...*/
  private disableSettingsMenu() {
    this.codeEditor.commands.addCommand({
      name: "showSettingsMenu",
      bindKey: {
        win: "Ctrl-,",
        mac: "Command-,"
      },
      exec: function(editor) {
        return false;
      },
      readOnly: true
    });
  }


}

