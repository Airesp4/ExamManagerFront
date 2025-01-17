import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: '/start', pathMatch: 'full' },
    { path: 'start', component: StartComponent },
    { path: 'home', component: HomeComponent },
];
