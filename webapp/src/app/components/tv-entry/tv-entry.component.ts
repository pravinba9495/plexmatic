import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tv-entry',
  templateUrl: './tv-entry.component.html',
  styles: [
  ]
})
export class TvEntryComponent implements OnInit {

  @Input()
  item: any;

  constructor() { }

  ngOnInit(): void {
  }

}
