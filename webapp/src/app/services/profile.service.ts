import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Profile } from "../models/profile";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private _items: any[] = [];

  constructor(private http: HttpClient) {}

  get items(): any[] {
    return this._items;
  }

  getProfiles() {
    this.http
      .get(environment.apiURL + "/profiles")
      .subscribe((response: any) => {
        this._items = response.data;
      });
  }

  getProfilebyID(id: number) {
    return this.items.find((p) => p.id === id);
  }

  saveProfile(profile: Profile) {
    return this.http
      .post(environment.apiURL + "/profiles", profile)
      .toPromise();
  }

  updateProfile(profile: Profile) {
    return this.http
      .patch(environment.apiURL + `/profiles/${profile.id}`, profile)
      .toPromise();
  }
}
