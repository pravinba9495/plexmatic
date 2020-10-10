import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TvService {

  private _items: any[] = [];

  constructor(
    private http: HttpClient,
  ) { 
    this.getTvShows();
  }

  get items(): any[] {
    return this._items;
  }

  getTvShows() {
    this.http.get(environment.apiURL + '/tv').subscribe((response: any) => {
      this._items = response.data;
    });
  }
  
}
