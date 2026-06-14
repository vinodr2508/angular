// Milestone1 - TypeScript basics (Imports)
// Milestone2 - ActivatedRoute (For reading route + query params)
// Milestone3 - Observables and RxJS (switchMap, Observable)
// Milestone4 - Signals (signal, computed)
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { UserService, User } from '../../services/user.service';

// Milestone1 - Class decorators (@Component)
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html'
})

// Milestone1 - Component lifecycle (OnInit, OnDestroy)
export class UserProfileComponent implements OnInit, OnDestroy {

  // Milestone3 - Observables (Observable for async pipe in the template)
  user$!: Observable<User | undefined>;

  // Milestone2 - Query parameters (Stores ?mode=view from URL)
  mode: string = 'view';

  // Milestone4 - Signals (Track loading and error state as signals)
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // Milestone4 - Computed signals (Derive display label from mode signal)
  modeLabel = computed(() =>
    this.mode === 'edit' ? '✏️ Edit Mode' : '👁️ View Mode'
  );

  // Milestone3 - Observable patterns (Subject for cleanup on component destroy)
  private destroy$ = new Subject<void>();

  // Milestone1 - Services (Dependency Injection)
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  // Milestone1 - Component lifecycle hook
  ngOnInit(): void {

    // Milestone2 - Query parameters (Read ?mode=view from URL snapshot)
    this.mode = this.route.snapshot.queryParamMap.get('mode') || 'view';

    // Milestone3 - RxJS operators: switchMap
    // switchMap cancels previous HTTP call if route param changes quickly
    this.user$ = this.route.paramMap.pipe(

      // Milestone3 - switchMap (Extracts :id from route and switches to HTTP observable)
      switchMap(params => {
        const id = Number(params.get('id'));
        this.isLoading.set(true);

        // Milestone3 - HTTP calls using HttpClient (via service method)
        return this.userService.fetchUserById(id).pipe(

          // Milestone3 - catchError (Graceful handling if user not found)
          catchError(() => {
            this.errorMessage.set('Could not load user. Please go back.');
            return of(undefined);
          })
        );
      }),

      // Milestone3 - takeUntil (Auto-unsubscribe when component is destroyed)
      takeUntil(this.destroy$)
    );

    // Subscribe to flip loading signal off after first emit
    this.user$.subscribe(() => this.isLoading.set(false));
  }

  // Milestone1 - Component lifecycle (Cleanup on destroy)
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
