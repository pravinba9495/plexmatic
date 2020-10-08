import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styles: [
  ]
})
export class QueueComponent implements OnInit {

  items = [
    {
      filename: 'Sample.mkv',
      progress: 45,
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
