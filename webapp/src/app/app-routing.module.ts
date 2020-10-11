import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HistoryComponent } from "./components/history/history.component";
import { MoviesListComponent } from "./components/movies-list/movies-list.component";
import { ProfilesComponent } from "./components/profiles/profiles.component";
import { QueueComponent } from "./components/queue/queue.component";
import { TvListComponent } from "./components/tv-list/tv-list.component";
import { HomeComponent } from "./pages/home/home.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "queues", component: QueueComponent },
  { path: "history", component: HistoryComponent },
  { path: "profiles", component: ProfilesComponent },
  { path: "movies", component: MoviesListComponent },
  { path: "tv", component: TvListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
