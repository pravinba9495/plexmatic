import { Injectable } from '@angular/core';
import { QueueItem } from 'src/app/models/queue-item';
import { SampleQueueItems } from 'src/app/services/queue.service.data';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QueueService {

  public items: QueueItem[] = [];

  constructor() { 
    if (!environment.production) {
      this.items = SampleQueueItems;
    }
  }
}
