import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { Profile } from "src/app/models/profile";
import { ProfileService } from "src/app/services/profile.service";
import { ProfileComponent } from "../profile/profile.component";

@Component({
  selector: "app-profiles",
  templateUrl: "./profiles.component.html",
  styles: [],
})
export class ProfilesComponent implements OnInit {

  public displayedColumns = ['name', 'container', 'video_codec', 'audio_passthrough', 'audio_codec', 'languages'];

  constructor(
    public dialog: MatDialog,
    public profileService: ProfileService
  ) {}

  ngOnInit(): void { 
    this.profileService.getProfiles();
  }

  public refreshList() {
    this.profileService.getProfiles();
  }

  public openProfileModal(profile: Profile = null) {
    const dialog = this.dialog.open(ProfileComponent, {
      data: JSON.parse(JSON.stringify(profile)),
    });
    dialog.afterClosed().subscribe((ok) => {
      if (ok) {
        this.profileService.getProfiles();
      }
    });
  }

  get dataSource() {
    return new MatTableDataSource<any>(this.profileService.items);
  }
}
