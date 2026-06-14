import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './components/user-card/user-form.component';
// Import the Profile component
import { UserProfileComponent } from './pages/user-profile/user-profile.component'; 

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/create', component: UserFormComponent },
  
  // TOPIC: Dynamic routes (The ':' makes 'id' a parameter)
  { path: 'user-profile/:id', component: UserProfileComponent }, 
  
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];