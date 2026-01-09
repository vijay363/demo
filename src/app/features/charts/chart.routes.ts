import { Routes } from "@angular/router";
import { authGuard } from "../../auth/guards/auth.guard";
import { roleGuard } from "../../auth/guards/role.guard";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const CHART_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
];
