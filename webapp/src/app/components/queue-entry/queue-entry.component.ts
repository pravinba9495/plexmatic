import { Component, Input, OnInit } from '@angular/core';
import { QueueItem } from 'src/app/models/queue-item';

@Component({
  selector: 'app-queue-entry',
  templateUrl: './queue-entry.component.html',
  styles: [
  ]
})
export class QueueEntryComponent implements OnInit {

  @Input()
  item: QueueItem; 

  constructor() { }

  ngOnInit(): void {
  }

}
