import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs';
import { EditComponent } from './reporting/edit/edit.component';

const canDeactivateEditFn = (component: EditComponent) => component.canDeactivate().pipe(map((canDeactivate) => canDeactivate || window.confirm('Are you sure you want to leave this page?')));

const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(component => component.HomeComponent)
  },
  {
    path: 'list',
    loadComponent: () => import('./reporting/list/list.component').then(component => component.ListComponent)
  },
  {
    path: 'edit',
    loadComponent: () => import('./reporting/edit/edit.component').then(component => component.EditComponent),
    canDeactivate: [canDeactivateEditFn]
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./reporting/edit/edit.component').then(component => component.EditComponent),
    canDeactivate: [canDeactivateEditFn]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
