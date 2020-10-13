import { Component, Input, OnInit } from "@angular/core";
import { QueueService } from "src/app/services/queue.service";

@Component({
  selector: "app-tv-entry",
  templateUrl: "./tv-entry.component.html",
  styles: [],
})
export class TvEntryComponent implements OnInit {
  @Input()
  item: any;

  public expand = false;

  constructor(public queueService: QueueService) {}

  ngOnInit(): void { }
  
  toggleExpand() {
    this.expand = !this.expand;
  }
  
}
