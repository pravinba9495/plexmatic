import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profile } from 'src/app/models/profile';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public mode = 'add';
  public profile = new Profile();

  constructor(
    public dialog: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.data = 'edit';
    }
  }

}
