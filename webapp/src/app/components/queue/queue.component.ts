import { Component, OnInit } from '@angular/core';
import { QueueService } from 'src/app/services/queue.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styles: [
  ]
})
export class QueueComponent implements OnInit {

  constructor(
    public queueService: QueueService,
  ) { }

  ngOnInit(): void {
  }

}
