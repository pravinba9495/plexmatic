import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TvService {
  private _items: any[] = [];
  public progress = false;

  constructor(private http: HttpClient) {}

  get items(): any[] {
    return this._items;
  }

  getTvShows() {
    this.progress = true;
    this.http.get(environment.apiURL + "/tv").subscribe(
      (response: any) => {
        this._items = response.data;
        this.progress = false;
      },
      (error) => {
        console.error(error);
        this.progress = false;
      }
    );
  }

  refreshList() {
    this.progress = true;
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiURL + "/tv/refresh").subscribe(
        (response: any) => {
          this._items = response.data;
          this.progress = false;
          resolve();
        },
        (error) => {
          console.error(error);
          this.progress = false;
          resolve();
        }
      );
    });
  }
}
