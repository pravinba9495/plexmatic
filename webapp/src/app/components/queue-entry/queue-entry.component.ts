import { Component, Input, OnInit } from "@angular/core";
import { QueueItem } from "src/app/models/queue-item";
import { ProfileService } from "src/app/services/profile.service";
import { QueueService } from "src/app/services/queue.service";

@Component({
  selector: "app-queue-entry",
  templateUrl: "./queue-entry.component.html",
  styles: [],
})
export class QueueEntryComponent implements OnInit {
  @Input()
  item: QueueItem;

  public stopInProgress = false;

  constructor(
    public profileService: ProfileService,
    public queueService: QueueService
  ) {}

  ngOnInit(): void { }

  stop() {
    this.stopInProgress = true;
    console.log(this.stopInProgress);
    let timer = setTimeout(() => {
      this.queueService.stop();
    }, 1000);
  }
}
