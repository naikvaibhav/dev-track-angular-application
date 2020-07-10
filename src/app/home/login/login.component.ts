import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  private user: SocialUser;
  private loggedIn: boolean;

  public email: string = "";
  public password: string = "";

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
    });
  }

  signInWithGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((userData) => {
        this.verifySocialIdToken(this.user);
      });
  }

  verifySocialIdToken = (data) => {
    this.appService.verifySocialIdToken(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          if (apiResponse.data.userDetails.userRole == "admin") {
            this.router.navigate(["/admindashboard"]);
            this.appService.setUserInfoInLocalStorage(
              apiResponse.data.userDetails
            );
            this.appService.setAuthToken(apiResponse.data.authToken);
            this.toastr.success(apiResponse.message);
          } else {
            this.router.navigate([
              `/userdashboard/${apiResponse.data.userDetails.userId}`,
            ]);
            this.appService.setUserInfoInLocalStorage(
              apiResponse.data.userDetails
            );
            this.appService.setAuthToken(apiResponse.data.authToken);
            this.toastr.success(apiResponse.message);
          }
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      (err) => {
        document.querySelector(".loginBtn").textContent = "Login";
        this.toastr.error(err.error.message);
      }
    );
  };

  //check if email and password are entered before login
  public checkFormValidation = () => {
    if (!this.email) {
      this.toastr.warning("Email is missing");
    } else if (!this.password) {
      this.toastr.warning("Password is missing");
    } else {
      return;
    }
  }; //end of checkFormValidation

  public loginFunction = () => {
    document.querySelector(".loginBtn").textContent = "Logging....";
    this.checkFormValidation();
    let data = {
      email: this.email,
      password: this.password,
    };
    this.appService.loginFunction(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          if (apiResponse.data.userDetails.userRole == "admin") {
            this.router.navigate(["/admindashboard"]);
            this.appService.setUserInfoInLocalStorage(
              apiResponse.data.userDetails
            );
            this.appService.setAuthToken(apiResponse.data.authToken);
            this.toastr.success(apiResponse.message);
          } else {
            this.router.navigate([
              `/userdashboard/${apiResponse.data.userDetails.userId}`,
            ]);
            this.appService.setUserInfoInLocalStorage(
              apiResponse.data.userDetails
            );
            this.appService.setAuthToken(apiResponse.data.authToken);
            this.toastr.success(apiResponse.message);
          }
        } else {
          this.toastr.error(apiResponse.message);
          document.querySelector(".loginBtn").textContent = "Login";
        }
      },
      (err) => {
        document.querySelector(".loginBtn").textContent = "Login";
        this.toastr.error(err.error.message);
      }
    );
  }; //end of loginFunction
}
