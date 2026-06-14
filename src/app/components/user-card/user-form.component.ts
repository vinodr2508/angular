import { Component } from '@angular/core';
// TOPIC: Reactive forms (Importing required classes)
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // To redirect after saving
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('User')
  });
  // TOPIC: Reactive forms (Handling form submission)
 onSubmit() {
    if (this.userForm.valid) {
      const newUser = {
        id: Math.floor(Math.random() * 1000), // Temporary ID generation
        ...this.userForm.value
      } as any;

      // TOPIC: Services (Sending form data to the service)
      this.userService.addUser(newUser);
      
      // Redirect back to the list to see the update
      this.router.navigate(['/users']);
    }
  }
}