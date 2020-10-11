import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { JobComponent } from "src/app/components/job/job.component";
import { MoviesService } from "src/app/services/movies.service";
import { QueueService } from "src/app/services/queue.service";

@Component({
  selector: "app-movies-list",
  templateUrl: "./movies-list.component.html",
  styles: [],
})
export class MoviesListComponent implements OnInit {
  constructor(
    public moviesService: MoviesService,
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
    await this.moviesService.refreshList();
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
