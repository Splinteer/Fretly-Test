import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuardService  } from './auth/auth-guard.service'

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService],  pathMatch: 'full' },
  { path:'', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
