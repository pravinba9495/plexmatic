import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-movie-entry',
  templateUrl: './movie-entry.component.html',
  styles: [
  ]
})
export class MovieEntryComponent implements OnInit {

  @Input()
  item: any;

  constructor() { }

  ngOnInit(): void {
  }

}
