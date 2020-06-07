// import {SharedService} from "../data.service";
// import {TestBed, ComponentFixture, async} from "@angular/core/testing";
// import {SideRightComponent} from "./side-right.component";
// import {FormsModule} from "@angular/forms";
// import {ClarityModule} from "@clr/angular";
// import {MatDialogModule} from "@angular/material/dialog";
// import {By} from "@angular/platform-browser";
// import {CodeEditorComponent} from "../code-editor/code-editor.component";
// import {HeaderComponent} from "../header/header.component";
// import {DebugStep} from "../../CL/DebugStep";
// import {eventNames} from "cluster";
//
// /**********************************************************************************************************************/
// // THESE TESTS TEST THAT THE COMPONENT WAS LOADED AND THAT THE BUTTONS CALL THE RIGHT FUNCTIONS WHEN PRESSED
// /**********************************************************************************************************************/
//
// describe('side right component - unit tests', () => {
//
//   let sideRightComponent: SideRightComponent;
//   let sideRightFixture: ComponentFixture<SideRightComponent>;
//   let sharedService: SharedService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [SideRightComponent, CodeEditorComponent],
//       providers: [SharedService],
//       imports: [
//         FormsModule,
//         ClarityModule,
//         MatDialogModule
//       ]
//     });
//
//     // load side right
//     sideRightFixture = TestBed.createComponent(SideRightComponent);
//     sideRightComponent = sideRightFixture.componentInstance;
//     sideRightComponent.ngAfterViewInit();
//     sideRightFixture.detectChanges();
//
//     sharedService = TestBed.get(SharedService);
//   });
//
//   afterEach(()=>{
//     sideRightFixture.debugElement.nativeElement.remove();
//     sideRightFixture.destroy();
//   });
//   it('should load the component successfully',  () => {
//     expect(sideRightFixture.debugElement.query(By.css('section.sidenav-content')).nativeElement).toBeTruthy(); // shows up on view
//     expect(sideRightComponent).toBeDefined();
//   });
// });
//
// /**********************************************************************************************************************/
// // THESE TESTS TEST THE INTEGRATION BETWEEN THE SIDE AND THE CODE EDITOR AND HEADER COMPONENTS
// /**********************************************************************************************************************/
//
// describe('side right component - integration tests', () => {
//
//   let sideRightComponent: SideRightComponent;
//   let sideRightFixture: ComponentFixture<SideRightComponent>;
//   let codeEditorComponent: CodeEditorComponent;
//   let codeEditorFixture: ComponentFixture<CodeEditorComponent>;
//   let sharedService: SharedService;
//   let headerComponent: HeaderComponent;
//   let headerFixture: ComponentFixture<HeaderComponent>;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [SideRightComponent, HeaderComponent, CodeEditorComponent],
//       providers: [SharedService],
//       imports: [
//         FormsModule,
//         ClarityModule,
//         MatDialogModule
//       ]
//     });
//
//     // load side
//     sideRightFixture = TestBed.createComponent(SideRightComponent);
//     sideRightComponent = sideRightFixture.componentInstance;
//     sideRightComponent.ngAfterViewInit();
//     sideRightFixture.detectChanges();
//
//     headerFixture = TestBed.createComponent(HeaderComponent);
//     headerComponent = headerFixture.componentInstance;
//     headerComponent.ngAfterViewInit();
//     headerFixture.detectChanges(); // call the ngAfterInit
//
//     codeEditorFixture = TestBed.createComponent(CodeEditorComponent);
//     codeEditorComponent = codeEditorFixture.componentInstance;
//     codeEditorFixture.componentInstance.ngAfterViewInit();
//     codeEditorFixture.detectChanges();
//
//     sharedService = TestBed.get(SharedService);
//   });
//
//   afterEach(() => {
//     sideRightFixture.debugElement.nativeElement.remove();
//     sideRightFixture.destroy();
//     headerFixture.debugElement.nativeElement.remove();
//     headerFixture.destroy();
//     codeEditorFixture.debugElement.nativeElement.remove();
//     codeEditorFixture.destroy();
//   });
// });
//
