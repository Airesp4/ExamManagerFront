import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  providers: [HttpClient],
  templateUrl: './sidebar-system.component.html',
  styleUrl: './sidebar-system.component.css'
})
export class SidebarSystemComponent {
  @Output() sectionChange = new EventEmitter<string>();

  constructor(
      private router: Router,
      private authService: AuthService
  ) {}

  changeSection(section: string): void {
    this.sectionChange.emit(section);
  }

  logout():void{
    this.router.navigate(['/start']);
    this.authService.clearToken();
  }
}
