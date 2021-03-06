import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { QueueItem } from "src/app/models/queue-item";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class QueueService {
  private _items: QueueItem[] = [];
  private _tempQueue = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  get items(): QueueItem[] {
    return this._items;
  }

  get queues(): any[] {
    return this._tempQueue;
  }

  addOrRemoveFromQueue(event: MatCheckboxChange, path: string) {
    if (event.checked) {
      this._tempQueue.push(path);
    } else {
      this._tempQueue.splice(this._tempQueue.indexOf(path), 1);
    }
  }

  getQueues() {
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiURL + "/queues").subscribe(
        (response: any) => {
          for (let q of response.data) {
            let index = this.items.map((item) => item.id).indexOf(q.id);
            if (index > -1) {
              for (let key of Object.keys(q)) {
                this._items[index][key] = q[key];
              }
            } else {
              this._items.push(q);
            }
          }
          for (let i = this.items.length - 1; 0 <= i; i--) {
            let index = response.data
              .map((q) => q.id)
              .indexOf(this.items[i].id);
            if (index === -1) {
              this._items.splice(i, 1);
            }
          }
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  existsInQueue(path: string) {
    return this.items.map((item) => item.filename).includes(path);
  }

  resetQueues() {
    this._tempQueue = [];
  }

  addToQueue(queues: QueueItem[]) {
    return this.http.post(environment.apiURL + "/queues", queues).toPromise();
  }

  start() {
    return this.http.get(environment.apiURL + "/queues/start").toPromise();
  }

  stop() {
    return this.http.get(environment.apiURL + "/queues/stop").toPromise();
  }

  clear() {
    return this.http.get(environment.apiURL + "/queues/clear").toPromise();
  }

  removeFromQueue(filename: string) {
    return this.http
      .post(environment.apiURL + `/queues/remove`, { filename })
      .toPromise();
  }
}
