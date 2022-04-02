import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './core/auth/auth.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'start', canActivate: [AuthGuard], loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'steps', loadChildren: './Pages/steps/steps.module#StepsPageModule' },
  { path: 'detail-quote', loadChildren: './Pages/detail-quote/detail-quote.module#DetailQuotePageModule' },
  { path: 'invoice-detail', loadChildren: './Pages/invoice-detail/invoice-detail.module#InvoiceDetailPageModule' },
  { path: 'test', loadChildren: './Pages/test/test.module#TestPageModule' },
  { path: 'view-profile', loadChildren: './Pages/view-profile/view-profile.module#ViewProfilePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'edit-scope', loadChildren: './Pages/edit-scope/edit-scope.module#EditScopePageModule' },
  { path: 'add-scope', loadChildren: './Pages/add-scope/add-scope.module#AddScopePageModule' },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
