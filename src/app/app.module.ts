import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { PlaceGuesserComponent } from './components/place-guesser/place-guesser.component';
import { MapSelectorComponent } from './components/map-selector/map-selector.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';

import { AngularMaterialModule } from './material.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';

import { FooterComponent } from './components/footer/footer.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarchartComponent } from './components/barchart/barchart.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { StatsPanelComponent } from './components/stats-panel/stats-panel.component';
import { LeaderboardExpandableComponent } from './components/leaderboard-expandable/leaderboard-expandable.component';
import { MapComponent } from './components/map/map.component';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlaceGuesserComponent,
    MapSelectorComponent,
    ImageCarouselComponent,
    FooterComponent,
    BarchartComponent,
    LeaderboardComponent,
    StatsPanelComponent,
    LeaderboardExpandableComponent,
    MapComponent,
    AuthComponent,
    ProfileComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    GoogleMapsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
