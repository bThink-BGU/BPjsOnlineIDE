import {AfterViewInit, Component, ElementRef} from '@angular/core';
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

  private _codeEditor: Ace.Editor;
  private _breakpoints: {};

  // debugger coloring variables
  private bThreadMarkers;

  get externalEvent() {
    return this.sharedService.sharedExternalEvent;
  }

  get codeEditor(): Ace.Editor {
    return this._codeEditor;
  }

  get breakpoints(): {} {
    return this._breakpoints;
  }

  constructor(private sharedService: SharedService) {
  }

  ngAfterViewInit(): void {

    this._codeEditor = ace.edit('editor', this.getEditorOptions());
    this.sharedService.sharedCodeEditor = this._codeEditor; // make the code editor usable by other components
    this.sharedService.sharedCodeEditorComponent = this;
    this._breakpoints = {};
    this.bThreadMarkers = [];

    // Basic editor settings, custom mode will be set in the setBpjs() function
    this._codeEditor.setTheme('ace/theme/twilight');
    this._codeEditor.setValue(this.sharedService.sharedCode);
    this._codeEditor.focus();
    this._codeEditor.selection.clearSelection();

    // Custom editor settings
    this.prepareEditor();
  }

  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {

    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      autoScrollEditorIntoView: true,
      showFoldWidgets: true,
      fontSize: 16,
      tabSize: 2,
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true
    };
    return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  private prepareEditor() {
    this.enableDebuggerColoringFeatures();
    this.setBpjsMode();
    this.bindCodeVariableAndValue();
    this.enableBreakpoints();
    this.enableMoveBreakpointsOnChange();
    this.disableSettingsMenu();
  }

  /********************************************************************************************************************/
  // DEBUGGER COLORING FEATURES
  /********************************************************************************************************************/

  private counter = 3;

  removeMarkers(){
    for (let markerID of this.bThreadMarkers) {
      this.codeEditor.session.removeMarker(markerID);
    }
  }

  // UNCOMMENT WHEN NEXT SYNC LINE NUMBER FUNCTIONALITY IS ADDED
  // RIGHT NOW IT JUST PAINTS RANDOM LINES IN EACH DEBUGGER STEP
  private enableDebuggerColoringFeatures() {
    this.sharedService.sharedProgram.debugger.subscribeCodeEditor({
    //   next: (data) => {
    //     // remove old ones
    //     this.removeMarkers();
    //
    //     // insert new ones
    //     this.bThreadMarkers = data.map(bThread => {
    //
    //       // REPLACE WITH REAL IMPLEMENTATION WHEN NEXT SYNC TO BE EXECUTED ROW IS WORKING
    //       // "this.counter;" in the next line should be replaced with "bThread.getNextSyncLineNumber();"
    //       // IN EVERY STEP, THE SERVER SHOULD RETURN THE LINE OF THE NEXT bp.sync TO BE EXECUTED IN EVERY bThread
    //
    //       let rowToBeExecuted = this.counter; //bThread.getNextSyncLineNumber();
    //       this.counter+=1;
    //       return this._codeEditor.session.addMarker(
    //         new Range(rowToBeExecuted, 0, rowToBeExecuted, Infinity),
    //         'thread-advanced-marker',
    //         'fullLine',
    //         false);
    //     });
    //
    //   }
    //
    //
    });
  }

  /********************************************************************************************************************/
  // BREAKPOINT HANDLING
  /********************************************************************************************************************/

  /* The ts-ignore suppresses in this method are essential because the ace.d.ts file is not full.
     Typescript throws type errors because some methods exist in ace.js but are not declared in ace.d.ts. */
  private enableBreakpoints() {
    // not "on(...)" to prevent ace from calling the original default handler
    this._codeEditor.setDefaultHandler('guttermousedown', (e) => {

      if (this.sharedService.sharedDebuggerMode)
        return;

      if (e.domEvent.target.className.indexOf("ace_gutter-cell") == -1)
        return;
      // @ts-ignore
      if (this._codeEditor.renderer.$gutterLayer.getRegion(e) === 'foldWidgets')
        return;
      // @ts-ignore
      let row = e.getDocumentPosition().row;

      if (!(row in this._breakpoints)) {
        if (this._codeEditor.session.getLine(row).includes('bp.sync'))
          this.addBreakpoint(row);
      } else {
        this.removeBreakpoint(row);
      }
    });
  }

  private addBreakpoint(row: number) {
    if (typeof this._codeEditor.session.getBreakpoints()[row] != typeof undefined) // if a breakpoint exists
      return;
    this._codeEditor.session.setBreakpoint(row, 'ace_breakpoint');
    let markerID = this._codeEditor.session.addMarker(
      new Range(row, 0, row, Infinity),
      'breakpoint-marker',
      'fullLine',
      false);

    this._breakpoints[row] = {'markerID': markerID};
    this.sharedService.sharedProgram.debugger.addBreakPoint(row);
  }

  private removeBreakpoint(row: number) {
    if (typeof this._codeEditor.session.getBreakpoints()[row] == typeof undefined) // if a breakpoint doesn't exist
      return;
    this._codeEditor.session.clearBreakpoint(row);
    this._codeEditor.session.removeMarker(this._breakpoints[row]['markerID']);
    delete this._breakpoints[row];
    this.sharedService.sharedProgram.debugger.removeBreakPoint(row);
  }

  private sortKeys() {
    let sorted = [];
    for (let key in this._breakpoints) {
      sorted[sorted.length] = parseInt(key);
    }
    sorted.sort();
    return sorted;
  }

  private enableMoveBreakpointsOnChange() {
    this._codeEditor.on('change', (e) => {
      if (Object.keys(this._breakpoints).length > 0 && e.lines.length > 1) {
        let sortedRows = e.action === 'insert' ? this.sortKeys().reverse() : this.sortKeys();
        for (let breakpointRow of sortedRows) { // go over reverse sorted rows to avoid breakpoint overlap
          if (e.action === 'insert') {
            if (breakpointRow == e.start.row) {
              if (this._codeEditor.session.getLine(breakpointRow) === '') {
                this.removeBreakpoint(breakpointRow);
                this.addBreakpoint(breakpointRow + e.lines.length - 1);
              }
            } else if (breakpointRow > e.start.row) {
              this.removeBreakpoint(breakpointRow);
              this.addBreakpoint(breakpointRow + (e.end.row - e.start.row));
            }
          } else {  // e.action === 'remove'

            if (breakpointRow > e.start.row && breakpointRow < e.end.row) {
              this.removeBreakpoint(breakpointRow);
            }
            if (breakpointRow > e.end.row) {
              this.removeBreakpoint(breakpointRow);
              this.addBreakpoint(breakpointRow - (e.end.row - e.start.row));
            }
            if (breakpointRow == e.end.row) {
              if (e.lines[e.lines.length - 1] === '') {
                this.removeBreakpoint(breakpointRow);
                this.addBreakpoint(breakpointRow - (e.end.row - e.start.row));
              } else {
                this.removeBreakpoint(breakpointRow);
              }
            }
          }
        }
      }
    });
  }

  /********************************************************************************************************************/
  // BPjs SYNTAX COLORING FEATURES
  /********************************************************************************************************************/

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
          token: "bp_commands",
          regex: /(bp)(\.)(sync|Event|registerBThread)\b/
        },
        {
          token: "bp_keywords",
          regex: /(block|request|waitFor)\b/
        }
      ];


      let JSRules = new JavaScriptHighlightRules({jsx: (options && options.jsx) == true}).getRules();
      JSRules.no_regex = bpjsRules.concat(JSRules.no_regex);

      this.$rules = JSRules;
    };
    oop.inherits(bpjsHighlightRules, JavaScriptHighlightRules);

    //custom mode
    let bpjsMode = function () {
      this.HighlightRules = bpjsHighlightRules;
      this.$outdent = new MatchingBraceOutdent();
      this.$behaviour = new CstyleBehaviour();
      this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(bpjsMode, jsMode);

    //custom worker for live syntax checking - currently supports javascript syntax only
    (function () {
      this.createWorker = function (session) {
        let worker = new WorkerClient(["ace"], "ace/mode/javascript_worker", "JavaScriptWorker");
        worker.attachToDocument(session.getDocument());

        worker.on("annotate", function (results) {
          session.setAnnotations(results.data);
        });

        worker.on("terminate", function () {
          session.clearAnnotations();
        });

        return worker;
      };

      this.$id = "ace/mode/bpjs";

    }).call(bpjsMode.prototype);

    // finally, set the newly created mode dynamically for the current ace session
    this._codeEditor.getSession().setMode(new bpjsMode());

  }

  /********************************************************************************************************************/
  // EXTRA STUFF
  /********************************************************************************************************************/


  /* Ace's settings menu feature has things unnecessary for this project, such as setting a mode and disabling
  * the margin. Keeping it will expose the user to errors...*/
  private disableSettingsMenu() {
    this._codeEditor.commands.addCommand({
      name: "showSettingsMenu",
      bindKey: {
        win: "Ctrl-,",
        mac: "Command-,"
      },
      exec: function (editor) {
        return false;
      },
      readOnly: true
    });
  }

  private bindCodeVariableAndValue() {
    this._codeEditor.on('change', () => {
      this.sharedService.sharedCode = this._codeEditor.getValue();
    });
  }

}

