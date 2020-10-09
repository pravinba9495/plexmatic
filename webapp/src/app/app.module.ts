import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HistoryComponent } from './components/history/history.component';
import { MoviesListComponent } from './components/movies-list/movies-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { QueueEntryComponent } from './components/queue-entry/queue-entry.component';
import { QueueComponent } from './components/queue/queue.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TvListComponent } from './components/tv-list/tv-list.component';
import { MaterialModule } from './modules/material/material.module';
import { HomeComponent } from './pages/home/home.component';
import { MovieEntryComponent } from './components/movie-entry/movie-entry.component';
import { TvEntryComponent } from './components/tv-entry/tv-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    TabsComponent,
    QueueComponent,
    HistoryComponent,
    ProfilesComponent,
    MoviesListComponent,
    TvListComponent,
    QueueEntryComponent,
    ProfileComponent,
    MovieEntryComponent,
    TvEntryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
