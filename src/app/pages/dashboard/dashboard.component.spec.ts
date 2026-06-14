// Milestone4 - Unit testing with Karma and Jasmine (Test file for DashboardComponent)
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

// Milestone4 - Unit testing (Importing component and its dependency)
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../../services/user.service';

// Milestone4 - Unit testing (describe block groups dashboard tests)
describe('DashboardComponent', () => {

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // Milestone4 - Unit testing (Mock UserService to avoid real HTTP calls)
  const mockUserService = {
    fetchDashboardData: jasmine.createSpy('fetchDashboardData').and.returnValue(
      of({ users: [{ id: 1, name: 'Alice', email: 'a@test.com', role: 'Admin' }], postCount: 10 })
    ),
    users$: of([])
  };

  // Milestone4 - Unit testing (Set up the testing module before each test)
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,        // Standalone component import
        HttpClientTestingModule,   // Mock HTTP
        RouterTestingModule        // Mock Router/RouterLink
      ],
      providers: [
        // Milestone4 - Unit testing (Override UserService with mock)
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Milestone4 - Unit testing (Basic creation test)
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchDashboardData on init', () => {
    // Milestone4 - Unit testing (Verify service method was called)
    expect(mockUserService.fetchDashboardData).toHaveBeenCalled();
  });

  it('should set isLoading to false after data loads', () => {
    // Milestone4 - Signals (Verify signal was updated after load)
    expect(component.isLoading()).toBeFalse();
  });

  it('should have isLoggedIn as true by default', () => {
    // Milestone1 - Property binding (Verify default property value)
    expect(component.isLoggedIn).toBeTrue();
  });

  it('statusLabel should show success when not loading and no error', () => {
    // Milestone4 - Computed signals (Test computed signal output)
    component.isLoading.set(false);
    component.hasError.set(false);
    expect(component.statusLabel()).toBe('Dashboard loaded successfully.');
  });

  it('statusLabel should show loading message when isLoading is true', () => {
    // Milestone4 - Computed signals (Test different signal state)
    component.isLoading.set(true);
    expect(component.statusLabel()).toContain('Fetching');
  });

});
