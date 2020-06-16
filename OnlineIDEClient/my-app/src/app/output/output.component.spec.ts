import {SharedService} from "../data.service";
import {TestBed, ComponentFixture, async} from "@angular/core/testing";
import { OutputComponent } from './output.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClarityModule} from "@clr/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule, By} from "@angular/platform-browser";
import {HeaderComponent} from "../header/header.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {AppComponent} from "../app.component";
import {SideComponent} from "../side/side.component";
import {SideRightComponent} from "../side-right/side-right.component";
import {CodeEditorComponent} from "../code-editor/code-editor.component";
import {SaveFileDialogComponent} from "../save-file-dialog/save-file-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {LayoutModule} from "@angular/cdk/layout";
import {AngularSplitModule} from "angular-split";
import {DebugElement} from "@angular/core";


describe('side right component - tests', () => {

  let sharedService: SharedService;
  let appComponent: AppComponent;
  let appFixture: ComponentFixture<AppComponent>;
  let headerDebugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SideComponent,
        SideRightComponent,
        HeaderComponent,
        CodeEditorComponent,
        SaveFileDialogComponent,
        OutputComponent
      ],
      providers: [SharedService],
      imports: [
        BrowserModule,
        ClarityModule,
        NoopAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule,
        LayoutModule,
        MatTabsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        AngularSplitModule,
      ]
    });

    appFixture = TestBed.createComponent(AppComponent);
    appComponent = appFixture.componentInstance;
    headerDebugElement = appFixture.debugElement.query(By.directive(HeaderComponent));
    appFixture.detectChanges();
    sharedService = TestBed.get(SharedService);

  });

  afterEach(() => {
    appFixture.debugElement.nativeElement.remove();
    appFixture.destroy();
  });

  it('should compile', () => {
    expect(appFixture).toBeTruthy();
    expect(appComponent).toBeDefined();
  });

  it('There should only be a single tab in run mode', () => {
    expect(appFixture.debugElement.queryAll(By.css('.mat-tab-label')).length).toBe(1);
  });

  it('There should be three tabs in debug mode', () => {
    let debugButton = headerDebugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));

    if (debugButton.length != 1)
      fail();

    spyOn(headerDebugElement.componentInstance,'debug' ).and.callFake(()=>{
      sharedService.nextDebugger(!sharedService.sharedDebuggerMode);
    });

    debugButton[0].nativeElement.click();
    expect(headerDebugElement.componentInstance.debug).toHaveBeenCalled();

    appFixture.detectChanges();

    expect(appFixture.debugElement.queryAll(By.css('.mat-tab-label')).length).toBe(3);
  });
});
