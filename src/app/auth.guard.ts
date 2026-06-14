import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// TOPIC: Class decorator (@Injectable)
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate { // TOPIC: Route guards
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = true; // Simple logic for beginner level
    
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}