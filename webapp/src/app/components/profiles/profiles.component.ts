import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styles: [
  ]
})
export class ProfilesComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  public openProfileModal(mode: string) {
    const dialog = this.dialog.open(ProfileComponent);
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        
      }
    });
  }

}
