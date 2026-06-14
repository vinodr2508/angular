import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // TOPIC: router-outlet (Needs RouterModule)

@Component({
  selector: 'app-root',
  templateUrl: './app.html', // TOPIC: Property binding (Linking the correct template file)
  standalone: true,
  imports: [RouterModule]
})
export class AppComponent { }