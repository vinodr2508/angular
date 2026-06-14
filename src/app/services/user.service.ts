// Milestone1 - Services (Imports for Angular DI and HTTP)
// Milestone3 - Observables and RxJS (Importing Observable, Subject, BehaviorSubject)
// Milestone3 - HTTP calls using HttpClient (Importing HttpClient)
// Milestone4 - Signals (Importing signal, computed, effect)
import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

// Milestone1 - TypeScript basics (Interface definition for User)
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Milestone1 - Services (Injectable decorator makes this service available app-wide)
@Injectable({ providedIn: 'root' })
export class UserService {

  // Milestone3 - API base URL (using JSONPlaceholder as a mock REST API)
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  // Milestone3 - Observable patterns (BehaviorSubject holds the current user list)
  // BehaviorSubject always emits the latest value to new subscribers
  private usersSubject = new BehaviorSubject<User[]>([]);

  // Milestone3 - Observable patterns (Public Observable that components subscribe to)
  users$ = this.usersSubject.asObservable();

  // Milestone4 - Signals (Signal to track selected user id)
  selectedUserId = signal<number | null>(null);

  // Milestone4 - Computed signals (Derives selected user from the signal above)
  selectedUser = computed(() => {
    const id = this.selectedUserId();
    return this.usersSubject.getValue().find(u => u.id === id) ?? null;
  });

  // Milestone1 - Services (Dependency Injection of HttpClient)
  constructor(private http: HttpClient) {

    // Milestone4 - Effects (Runs a side effect whenever selectedUserId signal changes)
    effect(() => {
      const id = this.selectedUserId();
      if (id !== null) {
        // Just logging – a real app might track analytics here
        console.log(`[Effect] Selected user changed to ID: ${id}`);
      }
    });
  }

  // Milestone3 - HTTP calls using HttpClient (GET all users from API)
  // Milestone3 - RxJS operators: map, tap
  fetchUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(

      // Milestone3 - RxJS operator: map (transform API response to our User shape)
      map(apiUsers =>
        apiUsers.slice(0, 6).map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.id === 1 ? 'Admin' : 'User'   // Simple role assignment
        }))
      ),

      // Milestone3 - RxJS operator: tap (side effect - update the BehaviorSubject)
      tap(users => this.usersSubject.next(users)),

      // Milestone3 - Error handling with catchError
      catchError(err => {
        console.error('[UserService] fetchUsers error:', err);
        return of([]);   // Return empty array on error
      })
    );
  }

  // Milestone3 - HTTP calls using HttpClient (GET single user by ID)
  // Milestone3 - RxJS operators: switchMap (cancels previous request if called again)
  fetchUserById(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(

      // Milestone3 - RxJS operator: map (reshape API response)
      map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.id === 1 ? 'Admin' : 'User'
      })),

      catchError(err => {
        console.error('[UserService] fetchUserById error:', err);
        // Return a fallback user object on error
        return of({ id, name: 'Unknown', email: '', role: 'User' });
      })
    );
  }

  // Milestone3 - RxJS operators: forkJoin (run multiple API calls in parallel)
  // This fetches users and a separate "posts" count at the same time
  fetchDashboardData(): Observable<{ users: User[]; postCount: number }> {
    const users$ = this.http.get<any[]>(this.apiUrl).pipe(
      map(list =>
        list.slice(0, 6).map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.id === 1 ? 'Admin' : 'User'
        }))
      )
    );

    const posts$ = this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(map(posts => posts.length));

    // Milestone3 - forkJoin: waits for BOTH observables to complete, then combines
    return forkJoin({ users: users$, postCount: posts$ }).pipe(
      tap(data => this.usersSubject.next(data.users)),
      catchError(err => {
        console.error('[UserService] fetchDashboardData error:', err);
        return of({ users: [], postCount: 0 });
      })
    );
  }

  // Milestone3 - Observable patterns (Add user locally and emit updated list)
  addUser(user: User): void {
    const current = this.usersSubject.getValue();
    // Assign next available id
    user.id = current.length ? Math.max(...current.map(u => u.id)) + 1 : 1;
    this.usersSubject.next([...current, user]);
  }

  // Milestone1 - Services (Simple synchronous getter for local list)
  getUsers(): User[] {
    return this.usersSubject.getValue();
  }

  // Milestone1 - Services (Find user by id from local cache)
  getUserById(id: number): User | undefined {
    return this.usersSubject.getValue().find(u => u.id === id);
  }

  // Milestone4 - Signals (Update the selected user signal)
  selectUser(id: number): void {
    this.selectedUserId.set(id);
  }
}
