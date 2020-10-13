import { Component, Input, OnInit } from "@angular/core";
import { QueueService } from "src/app/services/queue.service";

@Component({
  selector: "app-movie-entry",
  templateUrl: "./movie-entry.component.html",
  styles: [],
})
export class MovieEntryComponent implements OnInit {
  @Input()
  item: any;

  public expand = false;

  constructor(public queueService: QueueService) {}

  ngOnInit(): void {}

  toggleExpand() {
    this.expand = !this.expand;
  }
}
