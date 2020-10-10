import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styles: [
  ]
})
export class MoviesListComponent implements OnInit {

  constructor(
    public moviesService: MoviesService,
    public snackbar: MatSnackBar,

  ) { }

  ngOnInit(): void {
  }

  public async refreshList() {
    const snackbar = this.snackbar.open('Please wait while we refresh the data ...');
    await this.moviesService.refreshList();
    snackbar.dismiss();
  }

}
