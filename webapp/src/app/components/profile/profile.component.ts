import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profile } from 'src/app/models/profile';
import { codecs } from 'src/constants/codecs';

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

  constructor(
    public dialog: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { 
    this.calculateRecommendedBitrate();
  }

  ngOnInit(): void {
    if (this.data) {
      this.data = 'edit';
    }
  }

  public calculateRecommendedBitrate() {
    let recommendedStereoValue = this.profile.acodec === 'aac' ? 128 : 160;
    this.profile.aquality = recommendedStereoValue * 0.5 * this.profile.achannels;
  }

}
