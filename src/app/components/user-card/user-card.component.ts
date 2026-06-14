// Milestone1 - TypeScript basics (Imports)
// Milestone1 - Property decorators (@Input, @Output, EventEmitter)
// Milestone4 - View encapsulation (ViewEncapsulation controls style scoping)
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { User } from '../../services/user.service';

// Milestone1 - Class decorators (@Component)
@Component({
  selector: 'app-user-card',
  standalone: true,

  // Milestone4 - View encapsulation
  // Emulated (default): styles are scoped to this component using attribute selectors
  encapsulation: ViewEncapsulation.Emulated,

  // Milestone1 - Reusable components (Inline template for this card component)
  template: `
    <!-- Milestone1 - Reusable components (app-user-card used in user-list) -->
    <div class="card border-0 shadow-sm h-100 user-card">
      <div class="card-body d-flex flex-column p-4">

        <!-- Avatar + name row -->
        <div class="d-flex align-items-center gap-3 mb-3">
          <div
            class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
            style="width:48px;height:48px;font-size:18px;"
            [style.background-color]="user.role === 'Admin' ? '#dc3545' : '#0d6efd'"
          >
            {{ user.name.charAt(0) }}
          </div>
          <div class="overflow-hidden">
            <!-- Milestone1 - String interpolation -->
            <h6 class="mb-0 fw-semibold text-truncate">{{ user.name }}</h6>
            <small class="text-muted text-truncate d-block">{{ user.email }}</small>
          </div>
        </div>

        <!-- Role badge -->
        <!-- Milestone1 - Attribute directives (class binding based on role) -->
        <span
          class="badge rounded-pill px-3 py-1 mb-3 align-self-start"
          [class.bg-danger]="user.role === 'Admin'"
          [class.bg-secondary]="user.role !== 'Admin'"
        >{{ user.role }}</span>

        <!-- Spacer pushes button to bottom -->
        <div class="mt-auto">
          <!-- Milestone1 - Event binding ((click) triggers viewDetails) -->
          <button class="btn btn-outline-primary btn-sm w-100" (click)="viewDetails()">
            <i class="bi bi-eye me-1"></i>View Details
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* Milestone4 - View encapsulation (Styles scoped to this component only) */
    .user-card {
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      cursor: default;
    }
    .user-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.10) !important;
    }
  `]
})
export class UserCardComponent {

  // Milestone1 - Implement @Input (Receive user data from parent)
  @Input() user!: User;

  // Milestone1 - Implement @Output (Emit selected user id to parent)
  @Output() selected = new EventEmitter<number>();

  // Milestone1 - Event binding (Emits user id on button click)
  viewDetails(): void {
    this.selected.emit(this.user.id);
  }
}
