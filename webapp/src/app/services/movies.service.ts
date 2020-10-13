import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MoviesService {
  private _items: any[] = [];
  public progress = false;

  constructor(private http: HttpClient) {}

  get items(): any[] {
    return this._items;
  }

  getMovies() {
    this.progress = true;
    this.http.get(environment.apiURL + "/movies").subscribe(
      (response: any) => {
        this._items = this.getNestedFolderStructure(response.data);
        this.progress = false;
      },
      (error) => {
        console.error(error);
        this.progress = false;
      }
    );
  }

  getNestedFolderStructure(elements: any[], parentId = 0) {
    return elements.filter(e => e.parentId === parentId).map((e) => {
      return {
        ...e,
        children: this.getNestedFolderStructure(elements, e.id),
      }
    });
  }

  refreshList() {
    this.progress = true;
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiURL + "/movies/refresh").subscribe(
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
