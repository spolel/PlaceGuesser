import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service'
import { GuestService } from './services/guest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  get guestMode(): boolean {
    return this.guest.guestMode;
  }
  set guestMode(value: boolean) {
    this.guest.guestMode = value;
  }

  constructor(private readonly supabase: SupabaseService,  private router: Router,  private guest: GuestService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(this.supabase.session || this.guestMode == true){
      return true
    }else{
      this.router.navigate(['login']);
      return false
    }
  }
  
}
