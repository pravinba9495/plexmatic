import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProfileService } from "src/app/services/profile.service";
import { QueueService } from "src/app/services/queue.service";

@Component({
  selector: "app-job",
  templateUrl: "./job.component.html",
  styles: [],
})
export class JobComponent implements OnInit {
  public profileId = 0;

  constructor(
    public dialog: MatDialogRef<JobComponent>,
    public profileService: ProfileService,
    public queueService: QueueService,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  public async start() {
    try {
      await this.queueService.addToQueue(
        this.queueService.queues.map((file) => {
          return {
            profileId: this.profileId,
            filename: file,
          };
        })
      );
      this.dialog.close(true);
    } catch (error) {
      console.error(error);
      this.snackbar.open(error.message, "", { duration: 5000 });
    }
  }
}
