import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarSystemComponent } from "./components/sidebar-system/sidebar-system.component";
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { InfoScreenComponent } from "./components/info-screen/info-screen.component";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarSystemComponent, SearchBarComponent, FormsModule, InfoScreenComponent, CommonModule],
  providers: [HttpClient],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sistema-angular';
}
