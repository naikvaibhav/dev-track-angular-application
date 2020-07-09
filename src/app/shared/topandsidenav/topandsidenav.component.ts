import { Component, OnInit, Input } from "@angular/core";
import { AppService } from "../../app.service";
import { AuthService } from "angularx-social-login";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "src/app/socket.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-topandsidenav",
  templateUrl: "./topandsidenav.component.html",
  styleUrls: ["./topandsidenav.component.css"],
})
export class TopandsidenavComponent implements OnInit {
  @Input() avatar: string;
  @Input() userId: string;
  @Input() issueId: string;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.userId);
  }

  public logout: any = () => {
    console.log(this.userId);
    this.authService.signOut();
    console.log(this.authService.signOut());
    this.appService.logout(this.userId).subscribe(
      (apiResponse) => {
        console.log("apiResponse", apiResponse);
        this.toastr.success(apiResponse.message);
        console.log("logout sucessfull");
        if (apiResponse.status == 200) {
          // Cookie.delete("authToken");
          // Cookie.delete("receiverId");
          // Cookie.delete("receiverName");
          this.appService.removeUserInfoFromLocalStorage();
          this.appService.removeAuthTokenFromLocalStorage();
          this.socketService.exitSocket();
          this.socketService.disconnectedSocket();

          // this.appService.removeUserInfoFromLocalStorage();
          // this.appService.removeAuthTokenFromLocalStorage();
          console.log("disconnected socket from socket service is called");

          this.router.navigate(["/login"]);
        } else {
          console.log(apiResponse.message);
        }
      },
      (err) => {
        console.log(err.error);
        console.log("some error occured");
      }
    );
  };
}
