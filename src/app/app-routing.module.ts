import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassicComponent } from './components/pages/classic/classic.component';
import { CountryComponent } from './components/pages/country/country.component';
import { HelpComponent } from './components/pages/help/help.component';
import { HomeOldComponent } from './components/pages/home-old/home-old.component';
import { LoginComponent } from './components/pages/login/login.component';
import { PlayComponent } from './components/pages/play/play.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { HomeComponent } from './components/pages/home/home.component';
import { StatsComponent } from './components/pages/stats/stats.component';
import { AuthGuard } from './auth.guard';
import { MultiplayerComponent } from './components/pages/multiplayer/multiplayer.component';
import { ProfileEditComponent } from './components/pages/profile-edit/profile-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: 'homeold', component: HomeOldComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'classic', component: ClassicComponent, canActivate: [AuthGuard] },
  { path: 'country', component: CountryComponent, canActivate: [AuthGuard]  },
  { path: 'play', component: PlayComponent, canActivate: [AuthGuard]  },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard]  },
  { path: 'stats', component: StatsComponent, canActivate: [AuthGuard]  },
  { path: 'multiplayer', component: MultiplayerComponent, canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
