import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppService } from "src/app/app.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  public isLink: boolean = false;
  public password: string;
  public confirmPassword: string;
  public userId: string;
  public token: string;

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    let id = this._route.snapshot.paramMap.get("id");
    let token = this._route.snapshot.paramMap.get("token");
    this.appService.verifyPasswordResetLink(id, token).subscribe(
      (apiResponse) => {
        this.isLink = true;
        this.token = apiResponse.data.token;
        this.userId = apiResponse.data.userId;
      },
      (err) => {
        console.log(err);
        console.log("Link expired");
        this.toastr.error("Link expired");
      }
    );
  }

  public updatePasswordFunction = () => {
    let data = {
      userId: this.userId,
      token: this.token,
      password: this.password,
    };
    this.appService.updatePassword(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 1000);
        } else {
          this.toastr.error(apiResponse.message);
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 5000);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };
}
