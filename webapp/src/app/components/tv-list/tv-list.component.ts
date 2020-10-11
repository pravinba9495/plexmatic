import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { JobComponent } from "src/app/components/job/job.component";
import { QueueService } from "src/app/services/queue.service";
import { TvService } from "src/app/services/tv.service";

@Component({
  selector: "app-tv-list",
  templateUrl: "./tv-list.component.html",
  styles: [],
})
export class TvListComponent implements OnInit {
  constructor(
    public tvService: TvService,
    public snackbar: MatSnackBar,
    public queueService: QueueService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.queueService.resetQueues();
  }

  public async refreshList() {
    const snackbar = this.snackbar.open(
      "Please wait while we refresh the data ..."
    );
    await this.tvService.refreshList();
    snackbar.dismiss();
  }
  public addJob() {
    const dialog = this.dialog.open(JobComponent);
    dialog.afterClosed().subscribe((ok) => {
      if (ok) {
        this.queueService.getQueues();
        this.router.navigate(["/queues"]);
      }
    });
  }
}
