import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router) { }

  public isAuthenticated(): boolean {
    const auth = localStorage.getItem('auth');
    return auth !== null && auth === 'true';
  }

  canActivate() {
    if (this.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/register']);
      return false;
    }
  }
}
