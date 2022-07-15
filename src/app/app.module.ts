import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { PlaceGuesserComponent } from './components/place-guesser/place-guesser.component';
import { MapSelectorComponent } from './components/map-selector/map-selector.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';

import { AngularMaterialModule } from './material.module';
import { GoogleMapsModule } from '@angular/google-maps';

import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlaceGuesserComponent,
    MapSelectorComponent,
    ImageCarouselComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
