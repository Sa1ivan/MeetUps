import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListComponent } from './meetup/list/list.component';
import { AuthComponent } from './components/auth/auth.component';
import { LogupComponent } from './components/logup/logup.component';
import { UserlistComponent } from './meetup/userlist/userlist.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

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
        canActivate: [authGuard]
      },
      {
        path: 'my',
        title: 'Мои митапы',
        component: ListComponent,
        canActivate: [authGuard]
      },
      {
        path: 'auth',
        title: 'Вход',
        component: AuthComponent
      },
      {
        path: 'logup',
        title: 'Регистрация',
        component: LogupComponent
      },
      {
        path: 'users',
        title: 'Пользователи',
        component: UserlistComponent,
        canActivate: [authGuard, adminGuard]
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'nav/auth',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
