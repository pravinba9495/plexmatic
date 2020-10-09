import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
  }

}
