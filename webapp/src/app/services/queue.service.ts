import { Injectable } from '@angular/core';
import { QueueItem } from 'src/app/models/queue-item';
@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private _items: QueueItem[] = [];

  constructor() { 
  }

  get items(): QueueItem[] {
    return this._items;
  }
}
