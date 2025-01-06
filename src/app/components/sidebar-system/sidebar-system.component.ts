import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-bank',
  standalone: true,
  imports: [],
  providers: [HttpClient],
  templateUrl: './sidebar-system.component.html',
  styleUrl: './sidebar-system.component.css'
})
export class SidebarSystemComponent {

}
