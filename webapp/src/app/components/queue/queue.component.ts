import { Component, OnDestroy, OnInit } from "@angular/core";
import { QueueService } from "src/app/services/queue.service";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styles: [],
})
export class QueueComponent implements OnInit, OnDestroy {
  private timer;

  constructor(
    public queueService: QueueService,
  ) { }

  async ngOnInit() {
    try {
      await this.queueService.getQueues();
      this.timer = setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    } catch (error) {
      this.timer = setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    }
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

  get canShowClearButton() {
    let ret = true;
    this.queueService.items.forEach((q) => {
      if (q.started && !q.finished) {
        ret = false;
      }
    });
    return ret;
  }

  ngOnDestroy() {
    try {
      clearTimeout(this.timer);
    } catch (error) {}
  }
}
