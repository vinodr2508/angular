// Milestone1 - TypeScript basics (Imports)
// Milestone3 - Observables and RxJS (Importing Observable)
// Milestone4 - Signals (Importing signal, computed, OnInit)
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

// Milestone1 - Class decorators (@Component)
@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Milestone3 - Async pipe (AsyncPipe must be imported in standalone components)
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  // Milestone4 - View encapsulation (Emulated is default - styles scoped to component)
  // encapsulation: ViewEncapsulation.Emulated
})

// Milestone1 - Component lifecycle (OnInit)
export class DashboardComponent implements OnInit {

  // Milestone1 - Property binding (Boolean flag for conditional rendering)
  isLoggedIn = true;

  // Milestone3 - Async pipe (Observable used directly in template with async pipe)
  dashboardData$!: Observable<{ users: any[]; postCount: number }>;

  // Milestone4 - Signals (Track loading state reactively)
  isLoading = signal<boolean>(true);

  // Milestone4 - Signals (Track error state)
  hasError = signal<boolean>(false);

  // Milestone4 - Computed signals (Derives a label based on loading + error signals)
  statusLabel = computed(() => {
    if (this.isLoading()) return 'Fetching dashboard data...';
    if (this.hasError()) return 'Failed to load data. Please retry.';
    return 'Dashboard loaded successfully.';
  });

  // Milestone1 - Services (Dependency Injection)
  constructor(private userService: UserService) {}

  // Milestone1 - Component lifecycle hook
  ngOnInit(): void {
    this.loadDashboard();
  }

  // Milestone3 - HTTP calls + forkJoin (Fetch users and post count in parallel)
  loadDashboard(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    // Milestone3 - forkJoin is used inside fetchDashboardData (see UserService)
    this.dashboardData$ = this.userService.fetchDashboardData().pipe(

      // Milestone3 - RxJS operator: catchError (handle stream errors gracefully)
      catchError(() => {
        this.hasError.set(true);
        this.isLoading.set(false);
        return of({ users: [], postCount: 0 });
      })
    );

    // Subscribe just to flip the loading signal off once data arrives
    this.dashboardData$.subscribe(() => {
      this.isLoading.set(false);
    });
  }
}
