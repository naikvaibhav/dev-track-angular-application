import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";
import { SocketService } from "src/app/socket.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
  providers: [Location],
})
export class UserProfileComponent implements OnInit {
  public avatar;
  public authToken: string;
  public userId = this._route.snapshot.paramMap.get("id");
  public userDetails;

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public location: Location,
    private spinner: NgxSpinnerService,
    public socketService: SocketService
  ) {}

  ngOnInit() {
    // this.authToken = this.appService.getAuthToken();
    this.spinner.show();
    this.avatar = this.appService.getUserInfoFromLocalStorage().avatar;
    this.appService.getSingleUser(this.userId).subscribe(
      (apiResponse) => {
        this.spinner.hide();
        this.userDetails = apiResponse.data;
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );

    // this.verifyUserConfirmation();
    // this.getMessageFromAdmin();
    // this.informReporteAboutIssueUpdate();
    // this.informWatcherAboutIssueUpdate();
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe((data) => {
      this.socketService.setUser(this.authToken);
    });
  }; //end of verifyUserConfirmation

  public getAllConnectedUsers: any = () => {
    this.socketService.getAllConnectedUserList().subscribe((data) => {});
  }; //end of getAllConnectedUsers

  public getMessageFromAdmin: any = () => {
    this.socketService.meetingNotification(this.userId).subscribe((data) => {
      this.toastr.info(`Informing assignee: ${data.message}`);
    }); //end of subscribe
  }; //end get message from a user

  public informReporteAboutIssueUpdate: any = () => {
    this.socketService.informReporteAboutIssueUpdate().subscribe((data) => {
      if (data.changesMade.reporter.userId == this.userId) {
        this.toastr
          .info(`Informing reporter: ${data.message}`)
          .onTap.subscribe((action) => {
            this.router.navigate([`user/${this.userId}/issue/${data.issueId}`]);
          });
      }
    });
  }; //end of informReporteAboutIssueUpdate

  public informWatcherAboutIssueUpdate: any = () => {
    this.socketService.informWatcherAboutIssueUpdate().subscribe((data) => {
      data.changesMade.watchers.forEach((element) => {
        if (element._id == this.appService.getUserInfoFromLocalStorage()._id) {
          this.toastr
            .info(`Informing watcher: ${data.message}`, "", {
              disableTimeOut: true,
            })
            .onTap.subscribe((action) => {
              this.router.navigate([
                `user/${this.userId}/issue/${data.issueId}`,
              ]);
            });
        }
      });
    });
  }; //end of informWatcherAboutIssueUpdate
}
