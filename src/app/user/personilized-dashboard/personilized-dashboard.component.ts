import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "src/app/socket.service";

import { DatatableComponent } from "@swimlane/ngx-datatable";

import { Subscription, Subject } from "rxjs";

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-personilized-dashboard",
  templateUrl: "./personilized-dashboard.component.html",
  styleUrls: ["./personilized-dashboard.component.css"],
})
export class PersonilizedDashboardComponent implements OnInit, OnDestroy {
  public authToken: string;
  private localStorage = this.appService.getUserInfoFromLocalStorage();
  rows = [];
  temp = [];
  @ViewChild("myTable") table: DatatableComponent;

  public userId = this._route.snapshot.paramMap.get("id");
  public avatar;
  public allIssues: any;
  public assignedIssues: any;
  public counts: object;

  subscription: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.authToken = this.appService.getAuthToken();
    this.avatar = this.appService.getUserInfoFromLocalStorage().avatar;
    this.verifyUserConfirmation();
    this.getMessageFromAdmin();
    this.informReporteAboutIssueUpdate();
    this.informWatcherAboutIssueUpdate();

    this.getAllConnectedUsers();
    this.getCounts();
    this.getAllIssuesAssignedToMe();
  }

  ngOnDestroy() {
    console.log("destroy called", this.subscription.unsubscribe);
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  updateFilter(event) {
    console.log("key event", event.target.value);
    const val = event.target.value.toLowerCase();
    console.log("temp", this.temp);
    // filter our data
    let temp = this.temp.filter(function (d) {
      console.log("d", d);
      console.log(d.issueName.toLowerCase().indexOf(val) !== -1 || !val);
      return d.issueName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  public createIssue() {
    this.router.navigate([`user/${this.userId}/createIssue`]);
  }

  public viewIssue(issueId) {
    this.router.navigate([`user/${this.userId}/issue/${issueId}`]);
  }

  public getAllIssuesAssignedToMe() {
    this.appService.getAllIssuesAssignedToMe(this.localStorage._id).subscribe(
      (apiResponse) => {
        console.log("Assigned issues", apiResponse);
        if (apiResponse.data) {
          this.assignedIssues = apiResponse.data;
          this.temp = [...apiResponse.data];
          if (this.assignedIssues) {
            this.rows = this.assignedIssues;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //get the count of total issues, todo issues and completed issues
  public getCounts: any = () => {
    this.spinner.show();
    this.appService.getCounts(this.localStorage._id).subscribe(
      (apiResponse) => {
        this.spinner.hide();
        this.counts = { ...apiResponse.data };
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  };

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe((data) => {
      this.socketService.setUser(this.authToken);
    });
  };

  public getAllConnectedUsers: any = () => {
    console.log("getAll connected users");
    this.socketService.getAllConnectedUserList().subscribe((data) => {
      console.log("getting the connnected users", data);
    });
  };

  public getMessageFromAdmin: any = () => {
    console.log("getMessageFromAdmin is called once");
    this.subscription = this.socketService
      .meetingNotification(this.userId)
      .subscribe((data) => {
        this.toastr.info(`Informing assignee: ${data.message}`);
      }); //end of subscribe
    console.log("sub", this.subscription);
  }; //end get message from a user

  public informReporteAboutIssueUpdate: any = () => {
    this.subscription2 = this.socketService
      .informReporteAboutIssueUpdate()
      .subscribe((data) => {
        if (data.changesMade.reporter.userId == this.userId) {
          console.log("Reporter is present");
          this.toastr
            .info(`Informing reporter: ${data.message}`)
            .onTap.subscribe((action) => {
              console.log("Action", action);
              this.router.navigate([
                `user/${this.userId}/issue/${data.issueId}`,
              ]);
            });
        }
      });
  };

  public informWatcherAboutIssueUpdate: any = () => {
    this.subscription3 = this.socketService
      .informWatcherAboutIssueUpdate()
      .subscribe((data) => {
        console.log("informWatcherAboutIssueUpdate data", data);
        data.changesMade.watchers.forEach((element) => {
          if (
            element._id == this.appService.getUserInfoFromLocalStorage()._id
          ) {
            this.toastr
              .info(`Informing watcher: ${data.message}`, "", {
                disableTimeOut: true,
              })
              .onTap.subscribe((action) => {
                console.log("Action", action);
                this.router.navigate([
                  `user/${this.userId}/issue/${data.issueId}`,
                ]);
              });
          }
        });
      });
  };
}
