import { Component } from '@angular/core';
import { InfoScreenComponent } from "../../components/info-screen/info-screen.component";
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { InteractionScreenComponent } from "../../components/interaction-screen/interaction-screen.component";
import { SidebarSystemComponent } from "../../components/sidebar-system/sidebar-system.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InfoScreenComponent, SearchBarComponent, InteractionScreenComponent, SidebarSystemComponent, FormsModule, CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  activeSection: string = 'inicio';

  onSectionChange(section: string): void {
    this.activeSection = section;
  }
}
