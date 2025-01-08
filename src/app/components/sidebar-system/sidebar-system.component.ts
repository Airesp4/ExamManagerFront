import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  providers: [HttpClient],
  templateUrl: './sidebar-system.component.html',
  styleUrl: './sidebar-system.component.css'
})
export class SidebarSystemComponent {
  @Output() sectionChange = new EventEmitter<string>(); // Evento para notificar o pai

  changeSection(section: string): void {
    this.sectionChange.emit(section);
  }
}
