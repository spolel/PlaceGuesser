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
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeOldComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'classic', component: ClassicComponent, canActivate: [AuthGuard] },
  { path: 'country', component: CountryComponent, canActivate: [AuthGuard]  },
  { path: 'play', component: PlayComponent, canActivate: [AuthGuard]  },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard]  },
  { path: 'stats', component: StatsComponent, canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
