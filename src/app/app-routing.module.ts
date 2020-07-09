import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeModule } from "./home/home.module";
import { SharedModule } from "./shared/shared.module";
import { UserModule } from "./user/user.module";
import { HomeComponent } from "./home/home/home.component";
import { PageNotFoundComponent } from "./home/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    pathMatch: "full",
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "*", component: HomeComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeModule, SharedModule, UserModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
