// Milestone1 - TypeScript basics (Imports)
// Milestone3 - Observables and RxJS
// Milestone4 - Signals
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

// Milestone1 - Services (Importing the shared service)
import { UserService, User } from '../../services/user.service';
import { UserCardComponent } from '../../components/user-card/user-card.component';

// Milestone1 - Class decorators (@Component)
@Component({
  selector: 'app-user-list',
  standalone: true,
  // Milestone3 - Async pipe (AsyncPipe via CommonModule)
  imports: [CommonModule, RouterLink, UserCardComponent],
  templateUrl: './user-list.component.html'
})

// Milestone1 - Component lifecycle (OnInit, OnDestroy)
export class UserListComponent implements OnInit, OnDestroy {

  // Milestone3 - Async pipe (Observable for template, subscribed via async pipe)
  users$!: Observable<User[]>;

  // Milestone4 - Signals (Track search term reactively)
  searchTerm = signal<string>('');

  // Milestone4 - Signals (Track loading state)
  isLoading = signal<boolean>(true);

  // Milestone4 - Computed signals (Filter users based on search term signal)
  // This is a signal-based approach; the Observable users$ feeds it via subscribe below
  private allUsers = signal<User[]>([]);

  // Milestone4 - Computed signals (Derives filtered list from allUsers + searchTerm)
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allUsers();
    return this.allUsers().filter(
      u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  });

  // Milestone3 - Observable patterns (Subject used to clean up subscriptions on destroy)
  private destroy$ = new Subject<void>();

  // Milestone1 - Services (Dependency Injection)
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  // Milestone1 - Component lifecycle hook
  ngOnInit(): void {
    this.loadUsers();
  }

  // Milestone3 - HTTP calls + BehaviorSubject (Fetch from API and stream into template)
  loadUsers(): void {
    this.isLoading.set(true);

    // Milestone3 - switchMap pattern in service handles the HTTP request
    this.userService.fetchUsers().pipe(
      // Milestone3 - takeUntil: automatically unsubscribes when destroy$ emits
      takeUntil(this.destroy$)
    ).subscribe(users => {
      // Milestone4 - Signals (Update signal so computed() re-evaluates)
      this.allUsers.set(users);
      this.isLoading.set(false);
    });

    // Milestone3 - Async pipe (Expose BehaviorSubject observable for async pipe usage)
    // Milestone3 - RxJS operator: map (we can transform the stream here if needed)
    this.users$ = this.userService.users$.pipe(
      map(users => users)   // Identity map – can add transforms here e.g. sort
    );
  }

  // Milestone4 - Signals (Update search signal on keyup)
  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  // Milestone1 - Event binding (Triggered by app-user-card (selected) output)
  navigateToUser(userId: number): void {
    // Milestone4 - Signals (Set selected user via signal in service)
    this.userService.selectUser(userId);
    // Milestone2 - Dynamic routes (Navigate to profile with route parameter)
    this.router.navigate(['/user-profile', userId]);
  }

  // Milestone1 - Component lifecycle (Cleanup to prevent memory leaks)
  ngOnDestroy(): void {
    // Milestone3 - Observable patterns (Complete the Subject to unsubscribe all)
    this.destroy$.next();
    this.destroy$.complete();
  }
}
