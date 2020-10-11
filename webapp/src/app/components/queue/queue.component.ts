import { Component, OnInit } from "@angular/core";
import { QueueService } from "src/app/services/queue.service";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styles: [],
})
export class QueueComponent implements OnInit {
  timer;

  constructor(
    public queueService: QueueService,
  ) { }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.queueService.getQueues();
    }, 1000);
  }

  get canShowStartButton() {
    let ret = true;
    this.queueService.items.forEach((q) => {
      if (q.started) {
        ret = false;
      }
    });
    return ret;
  }

  ngOnDestroy() {
    try {
      clearInterval(this.timer);
    } catch (error) {}
  }
}
