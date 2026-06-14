// Milestone4 - Unit testing with Karma and Jasmine (Test file for UserService)
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

// Milestone4 - Unit testing (Importing the service under test)
import { UserService, User } from './user.service';

// Milestone4 - Unit testing (describe groups related tests together)
describe('UserService', () => {

  let service: UserService;
  let httpMock: HttpTestingController;

  // Milestone4 - Unit testing (beforeEach sets up the testing module before each test)
  beforeEach(() => {
    TestBed.configureTestingModule({
      // Milestone4 - Unit testing (HttpClientTestingModule replaces real HTTP calls)
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Milestone4 - Unit testing (afterEach ensures no unexpected HTTP requests remain)
  afterEach(() => {
    httpMock.verify();
  });

  // Milestone4 - Unit testing (it defines an individual test case)
  it('should be created', () => {
    // Milestone4 - Unit testing (expect with toBeTruthy assertion)
    expect(service).toBeTruthy();
  });

  it('should fetch users from API and update BehaviorSubject', () => {
    // Arrange: define mock API response
    const mockApiUsers = [
      { id: 1, name: 'Alice', email: 'alice@test.com', username: 'alice' },
      { id: 2, name: 'Bob',   email: 'bob@test.com',   username: 'bob'   }
    ];

    // Act: call the service method
    service.fetchUsers().subscribe(users => {
      // Milestone4 - Unit testing (Assert the mapped result)
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('Alice');
      // First user should be Admin
      expect(users[0].role).toBe('Admin');
      expect(users[1].role).toBe('User');
    });

    // Milestone4 - Unit testing (Flush mock data to the pending HTTP request)
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockApiUsers);
  });

  it('should update BehaviorSubject after fetchUsers', () => {
    const mockApiUsers = [
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob',   email: 'bob@test.com'   }
    ];

    service.fetchUsers().subscribe();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    req.flush(mockApiUsers);

    // Milestone4 - Unit testing (Verify BehaviorSubject was updated)
    expect(service.getUsers().length).toBe(2);
  });

  it('should add a user locally and emit via BehaviorSubject', () => {
    // Milestone4 - Unit testing (Test synchronous service method)
    const newUser: User = { id: 0, name: 'Charlie', email: 'c@test.com', role: 'User' };
    service.addUser(newUser);

    // Milestone4 - Unit testing (Assert the user was added)
    const users = service.getUsers();
    expect(users.some(u => u.name === 'Charlie')).toBeTrue();
  });

  it('should update selectedUserId signal when selectUser is called', () => {
    // Milestone4 - Signals (Test that signal updates correctly)
    service.selectUser(5);
    expect(service.selectedUserId()).toBe(5);
  });

  it('should return empty array on HTTP error', () => {
    service.fetchUsers().subscribe(users => {
      // Milestone4 - Unit testing (catchError in service returns [] on error)
      expect(users).toEqual([]);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    // Milestone4 - Unit testing (Simulate a network error)
    req.error(new ProgressEvent('network error'));
  });

});
