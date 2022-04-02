import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'Jobs',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./Jobs/jobs.module').then(m => m.JobsPageModule)
          }
        ]
      },
      {
        path: 'Estimate',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('./Estimate/estimate.module').then(m => m.EstimatePageModule)
          }
        ]
      },
      {
        path: 'Payments',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./Payments/payments.module').then(m => m.PaymentsPageModule)
          }
        ]
      },
      {
        path: 'Account',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./Account/account.module').then(m => m.AccountPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/Jobs',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/Jobs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
