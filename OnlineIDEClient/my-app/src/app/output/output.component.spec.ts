import {SharedService} from "../data.service";
import {TestBed, ComponentFixture, async} from "@angular/core/testing";
import { OutputComponent } from '../output/output.component';
import {FormsModule} from "@angular/forms";
import {ClarityModule} from "@clr/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {By} from "@angular/platform-browser";
import {HeaderComponent} from "../header/header.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";


describe('side right component - tests', () => {

  let sharedService: SharedService;
  let outputComponent: OutputComponent;
  let outputFixture: ComponentFixture<OutputComponent>;
  let headerComponent: HeaderComponent;
  let headerFixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutputComponent, HeaderComponent],
      providers: [SharedService],
      imports: [
        FormsModule,
        ClarityModule,
        MatDialogModule,
        MatTabsModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
      ]
    });

    // load components
    outputFixture = TestBed.createComponent(OutputComponent);
    outputComponent = outputFixture.componentInstance;
    outputComponent.ngAfterViewInit();
    outputFixture.detectChanges();


    headerFixture = TestBed.createComponent(HeaderComponent);
    headerComponent = headerFixture.componentInstance;
    headerFixture.detectChanges();

    sharedService = TestBed.get(SharedService);
  });

  it('should compile', () => {
    expect(outputFixture).toBeTruthy();
    expect(outputComponent).toBeDefined();
  });

  it('There should only be a single tab in run mode', () => {
    expect(outputFixture.debugElement.queryAll(By.css('.mat-tab-label')).length).toBe(1);
  });

  it('There should be three tabs in debug mode', () => {
    let debugButton = headerFixture.debugElement.queryAll(By.css('div.run-view a')).filter(button =>
      button.nativeElement.innerText.includes('Debug'));

    if (debugButton.length != 1)
      fail();

    spyOn(headerComponent,'debug' ).and.callFake(()=>{
      sharedService.nextDebugger(!sharedService.sharedDebuggerMode);
    });

    debugButton[0].nativeElement.click();
    expect(headerComponent.debug).toHaveBeenCalled();

    outputFixture.detectChanges();

    expect(outputFixture.debugElement.queryAll(By.css('.mat-tab-label')).length).toBe(3);
  });
});
