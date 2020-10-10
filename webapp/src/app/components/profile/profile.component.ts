import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profile } from 'src/app/models/profile';
import { ProfileService } from 'src/app/services/profile.service';
import { codecs } from 'src/constants/codecs';
import { codes } from 'src/constants/codes';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public mode = 'add';
  public profile = new Profile();
  public codecs = codecs;
  public codes = codes;

  constructor(
    public dialog: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private profileService: ProfileService,
  ) { 
    this.calculateRecommendedBitrate();
  }

  ngOnInit(): void {
    if (this.data) {
      this.mode = 'edit';
      this.profile = this.data;
    }
  }

  public calculateRecommendedBitrate() {
    let recommendedStereoValue = this.profile.audio.codec === 'aac' ? 128 : 160;
    this.profile.audio.quality = recommendedStereoValue * 0.5 * this.profile.audio.channels;
  }

  public async save() {
    if (this.mode === 'add') {
      try {
        await this.profileService.saveProfile(this.profile);
        this.dialog.close(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await this.profileService.updateProfile(this.profile);
        this.dialog.close(true);
      } catch (error) {
        console.error(error);
      }
    }
  }

}
