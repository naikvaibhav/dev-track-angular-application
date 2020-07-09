import { Component, OnInit, ViewChild } from "@angular/core";
import { AppService } from "src/app/app.service";
import { SocketService } from "src/app/socket.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DatatableComponent } from "@swimlane/ngx-datatable";

import { Location } from "@angular/common";

@Component({
  selector: "app-all-issues",
  templateUrl: "./all-issues.component.html",
  styleUrls: ["./all-issues.component.css"],
  providers: [Location],
})
export class AllIssuesComponent implements OnInit {
  public userId = this._route.snapshot.paramMap.get("id");
  public avatar;
  public allIssues: any = "";
  public searchText: string;

  public authToken: string;

  dataPresent: Boolean;
  rows = [];
  temp = [];
  @ViewChild("myTable") table: DatatableComponent;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public location: Location
  ) {}

  ngOnInit() {
    this.avatar = this.appService.getUserInfoFromLocalStorage().avatar;
    // this.authToken = this.appService.getAuthToken();
    // this.verifyUserConfirmation();
    // this.getMessageFromAdmin();
    // this.informReporteAboutIssueUpdate();
    // this.informWatcherAboutIssueUpdate();
  }

  public getAllIssues() {
    this.appService.getAllIssues().subscribe(
      (apiResponse) => {
        this.temp = [...apiResponse.data];
        this.allIssues = apiResponse.data;
        this.rows = this.allIssues;
      },
      (err) => {
        console.log(err);
      }
    );
  } //end of getAllIssues

  public viewIssue(issueId) {
    this.router.navigate([`user/${this.userId}/issue/${issueId}`]);
  } //end of viewIssue

  public searchIssues() {
    this.appService.searchIssues(this.searchText).subscribe(
      (apiResponse) => {
        this.temp = [...apiResponse.data];
        this.allIssues = apiResponse.data;
        this.rows = this.allIssues;
        if (this.allIssues.length > 0) {
          this.dataPresent = true;
        } else {
          this.dataPresent = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  } //end of searchIssues

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    let temp = this.temp.filter(function (d) {
      return d.issueName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  } //end of updateFilter

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
