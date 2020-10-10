import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Profile } from 'src/app/models/profile';
import { ProfileService } from 'src/app/services/profile.service';
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
    public profileService: ProfileService,
  ) { }

  ngOnInit(): void {
  }

  public openProfileModal(profile: Profile = null) {
    const dialog = this.dialog.open(ProfileComponent, {
      data: JSON.parse(JSON.stringify(profile))
    });
    dialog.afterClosed().subscribe((ok) => {
      if (ok) {
        this.profileService.getProfiles();
      }
    });
  }

}
