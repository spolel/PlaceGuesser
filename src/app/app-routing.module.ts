import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassicComponent } from './components/pages/classic/classic.component';
import { CountryComponent } from './components/pages/country/country.component';
import { HelpComponent } from './components/pages/login/help/help.component';
import { HomeOldComponent } from './components/pages/home-old/home-old.component';
import { LoginComponent } from './components/pages/login/login.component';
import { PlayComponent } from './components/pages/play/play.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { HomeComponent } from './components/pages/home/home.component';
import { StatsComponent } from './components/pages/stats/stats.component';

const routes: Routes = [
  { path: '', component: HomeOldComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'classic', component: ClassicComponent },
  { path: 'country', component: CountryComponent },
  { path: 'play', component: PlayComponent },
  { path: 'help', component: HelpComponent },
  { path: 'stats', component: StatsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
