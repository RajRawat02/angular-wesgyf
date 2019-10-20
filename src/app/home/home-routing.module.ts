import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { ScreensComponent} from './components/screens/screens.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { NbAuthComponent } from '@nebular/auth';


//route object to store root level routes for all modules
const routes: Routes = [
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      { path: 'login', component: LoginComponent, },
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' }]
  },
  {
    path: 'mes',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'experimentalplan',
        component: ScreensComponent,
       },
    ]
   },
  { path: '', redirectTo: '/mes', pathMatch: 'full' },
  { path: '*', redirectTo: '/mes', pathMatch: 'full' },
  { path: '**', redirectTo: '/mes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload'})],
exports: [RouterModule]
})
export class HomeRoutingModule { }
