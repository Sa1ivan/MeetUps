import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListComponent } from './components/list/list.component';
import { AuthComponent } from './components/auth/auth.component';
import { LogupComponent } from './components/logup/logup.component';
import { UsersComponent } from './components/users/users.component';
import { UserlistComponent } from './components/userlist/userlist.component';

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
      },
      {
        path: 'my',
        title: 'Мои митапы',
        component: ListComponent,
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
        component: UserlistComponent
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
