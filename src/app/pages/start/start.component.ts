import { Component } from '@angular/core';
import { LoginComponent } from "../../components/login/login.component";

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './start.component.html'
})
export class StartComponent {

}
