import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideComponent } from './side/side.component';
import { FormsModule} from '@angular/forms';
import {HeaderComponent} from './header/header.component';
import {CodeEditorComponent} from './codeEditor/codeEditor.component';


@NgModule({
  declarations: [
    AppComponent,
    SideComponent,
    HeaderComponent,
    CodeEditorComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
