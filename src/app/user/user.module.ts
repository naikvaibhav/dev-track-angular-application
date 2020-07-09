import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
//importing ngx-datatable
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

//importing quill
import { QuillModule } from "ngx-quill";
//importing tiny cloud
import { EditorModule } from "@tinymce/tinymce-angular";

import { PersonilizedDashboardComponent } from "./personilized-dashboard/personilized-dashboard.component";
import { SharedModule } from "../shared/shared.module";
import { IssueDescriptionComponent } from "./issue-description/issue-description.component";
import { CreateIssueComponent } from "./create-issue/create-issue.component";
import { UserRouteGuardService } from "./user-route-guard.service";
import { AllIssuesComponent } from "./all-issues/all-issues.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    PersonilizedDashboardComponent,
    IssueDescriptionComponent,
    CreateIssueComponent,
    AllIssuesComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    QuillModule,
    EditorModule,
    RouterModule.forChild([
      {
        path: "userdashboard/:id",
        component: PersonilizedDashboardComponent,
        pathMatch: "full",
        data: { animation: "isUserDashboard" },
        canActivate: [UserRouteGuardService],
      },
      {
        path: "user/:id/createIssue",
        component: CreateIssueComponent,
        pathMatch: "full",
        canActivate: [UserRouteGuardService],
      },
      {
        path: "user/:id/issue/:issueId",
        component: IssueDescriptionComponent,
        pathMatch: "full",
        canActivate: [UserRouteGuardService],
      },
      {
        path: "user/:id/allIssues",
        component: AllIssuesComponent,
        pathMatch: "full",
        canActivate: [UserRouteGuardService],
      },
      {
        path: "user/user-profile/:id",
        component: UserProfileComponent,
        pathMatch: "full",
        canActivate: [UserRouteGuardService],
      },
    ]),
    SharedModule,
  ],
  providers: [UserRouteGuardService],
})
export class UserModule {}
