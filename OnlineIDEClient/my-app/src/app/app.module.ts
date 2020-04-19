import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideComponent } from './side/side.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { CodeEditorComponent } from './codeEditor/codeEditor.component';
import { SaveFileDialogComponent } from './save-file-dialog/save-file-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";


@NgModule({
  declarations: [
    AppComponent,
    SideComponent,
    HeaderComponent,
    CodeEditorComponent,
    SaveFileDialogComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SaveFileDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
