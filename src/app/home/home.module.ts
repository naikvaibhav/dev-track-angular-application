import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

import { HomeComponent } from "./home/home.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { LoginComponent } from "./login/login.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { NavbarComponent } from "./navbar/navbar.component";

@NgModule({
  declarations: [
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    ResetPasswordComponent,
    SignupComponent,
    ForgotPasswordComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {
        path: "login",
        component: LoginComponent,
        pathMatch: "full",
        data: { animation: "isLogin" },
      },
      {
        path: "signup",
        component: SignupComponent,
        pathMatch: "full",
        data: { animation: "isLogin" },
      },
      { path: "forgotPassword", component: ForgotPasswordComponent },
      { path: "resetPassword/:id/:token", component: ResetPasswordComponent },
    ]),
  ],
})
export class HomeModule {}
