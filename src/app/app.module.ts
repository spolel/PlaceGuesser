import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeOldComponent } from './components/pages/home-old/home-old.component';
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
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { LoginComponent } from './components/pages/login/login.component';
import { MapComponent } from './components/map/map.component';
import { CountryAutocompleteComponent } from './components/country-autocomplete/country-autocomplete.component';
import { StoreModule } from '@ngrx/store';
import { AvatarComponent } from './components/avatar/avatar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ClassicComponent } from './components/pages/classic/classic.component';
import { CountryComponent } from './components/pages/country/country.component';
import { PlayComponent } from './components/pages/play/play.component';
import { HelpComponent } from './components/pages/login/help/help.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ImageBackgroundComponent } from './components/image-background/image-background.component';
import { StatsComponent } from './components/pages/stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeOldComponent,
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
    LoginComponent,
    MapComponent,
    CountryAutocompleteComponent,
    AvatarComponent,
    NavbarComponent,
    ClassicComponent,
    CountryComponent,
    PlayComponent,
    HelpComponent,
    HomeComponent,
    ImageBackgroundComponent,
    StatsComponent
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
    NgxChartsModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
