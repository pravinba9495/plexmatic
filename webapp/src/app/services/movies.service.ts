import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private _items: any[] = [];

  constructor(
    private http: HttpClient,
  ) { 
    this.http.get(environment.apiURL + '/movies').subscribe((response: any) => {
      this._items = response.data;
    });
  }

  get items(): any[] {
    return this._items;
  }
  
}
