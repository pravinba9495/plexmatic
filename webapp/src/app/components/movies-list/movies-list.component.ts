import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
  }

}
