import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-save-file-dialog',
  templateUrl: './save-file-dialog.component.html',
  styleUrls: ['./save-file-dialog.component.css']
})


export class SaveFileDialogComponent implements OnInit {
  get text(): FormControl {
    return this._text;
  }

  get matcher(): MyErrorStateMatcher {
    return this._matcher;
  }

  constructor(public dialogRef: MatDialogRef<SaveFileDialogComponent>) {}

  private _text = new FormControl('', [Validators.required]);
  private _matcher = new MyErrorStateMatcher();

  ngOnInit() {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() {
    if(this._text.valid)
      this.dialogRef.close(this._text.value);
  }
}
