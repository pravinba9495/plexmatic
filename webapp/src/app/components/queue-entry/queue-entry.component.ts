import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-queue-entry',
  templateUrl: './queue-entry.component.html',
  styles: [
  ]
})
export class QueueEntryComponent implements OnInit {

  @Input()
  filename: string;

  @Input()
  progress: number;

  constructor() { }

  ngOnInit(): void {
  }

}
