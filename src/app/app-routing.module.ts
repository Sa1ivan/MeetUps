import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {
    path: 'nav',
    title: 'nav',
    component: NavbarComponent,
    children: [
      {
        path: 'all',
        title: 'Все митапы',
        component: ListComponent,
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'nav/all',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
