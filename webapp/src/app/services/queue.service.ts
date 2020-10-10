import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueueItem } from 'src/app/models/queue-item';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private _items: QueueItem[] = [];

  constructor(
    private http: HttpClient,
  ) { 
    this.getQueues();
  }

  get items(): QueueItem[] {
    return this._items;
  }

  getQueues() {
    this.http.get(environment.apiURL + '/queues').subscribe((response: any) => {
      this._items = response.data;
    });
  }

  saveQueues(queues: QueueItem[]) {
    return this.http.post(environment.apiURL + '/queues', queues).toPromise();
  }
}
