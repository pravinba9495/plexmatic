import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TvService } from 'src/app/services/tv.service';

@Component({
  selector: 'app-tv-list',
  templateUrl: './tv-list.component.html',
  styles: [
  ]
})
export class TvListComponent implements OnInit {

  constructor(
    public tvService: TvService,
    public snackbar: MatSnackBar,

  ) { }

  ngOnInit(): void {
  }

  public async refreshList() {
    const snackbar = this.snackbar.open('Please wait while we refresh the data ...');
    await this.tvService.refreshList();
    snackbar.dismiss();
  }

}
