import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
//importing service
import { AppService } from "src/app/app.service";
import { SocketService } from "src/app/socket.service";

import { Location } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-issue-description",
  templateUrl: "./issue-description.component.html",
  styleUrls: ["./issue-description.component.css"],
})
export class IssueDescriptionComponent implements OnInit {
  @ViewChild("scrollMe", { read: ElementRef })
  public scrollMe: ElementRef;
  public scrollToChatTop: boolean = false;

  public userId = this._route.snapshot.paramMap.get("id");
  public issueId = this._route.snapshot.paramMap.get("issueId");
  public _id = this.appService.getUserInfoFromLocalStorage()._id;

  public issueComments: string;
  public allUsers = "";
  public avatar;
  public isWatcher: boolean = false;
  attachments = [];
  newAddedAttachments = [];
  selectedFiles = [];
  imageArray = [];

  commentsArray = [];
  changeAssignee: Boolean = false;
  public currentIssue;

  public authToken: string;

  selectAssignee;
  watcherList: any;

  statusList: object = {
    "0": "todo",
    "1": "inprogress",
    "2": "completed",
  };

  statusName = [];
  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.avatar = this.appService.getUserInfoFromLocalStorage().avatar;
    this.getAllUsersFromDB();
    this.getComment();
    this.getWatcherOfAIssue();
    this.getSingleIssue();
    this.getStatusName();

    // this.authToken = this.appService.getAuthToken();
    // this.verifyUserConfirmation();
    // this.getMessageFromAdmin();
    // this.informReporteAboutIssueUpdate();
    // this.informWatcherAboutIssueUpdate();
  }

  public getStatusName: any = () => {
    let result = Object.keys(this.statusList).map((data) => {
      return { code: data, name: this.statusList[data] };
    });
    return (this.statusName = result);
  }; //end getStatusName

  closeImage(image) {
    this.selectedFiles = this.selectedFiles.filter((url) => {
      return url !== image;
    });
  } //end closeImage

  deleteImage(image, i) {
    this.currentIssue.attachments.splice(i, 1);
    this.appService.deleteImageFromServer(image).subscribe(
      (apiResponse) => {},
      (err) => {
        console.log(err);
      }
    );
    this.editIssue(this.currentIssue.attachments);
  } //end deleteImage

  goBack() {
    this.location.back();
  } //end goBack

  //save comment
  public saveComment() {
    let data = {
      issueId: this.issueId,
      comment: this.issueComments,
      commentedBy: this._id,
    };
    this.appService.saveComment(data).subscribe(
      (apiResponse) => {
        this.getComment();
        this.issueComments = "";
        setTimeout(() => {
          const message = `${
            this.appService.getUserInfoFromLocalStorage().firstName
          } commented on ${this.currentIssue.issueName}`;
          let messageObj = {
            issueId: this.issueId,
            changesMade: this.currentIssue,
            message: message,
          };
          this.socketService.informServer(messageObj);
          // this.socketService.informServerAboutWatchers(this.watcherList);
        }, 5000);
        this.goBack();
      },
      (err) => {
        this.toastr.error("Some error occured");
      }
    );
  } //end of saveComment

  cancelComment() {
    this.issueComments = "";
  }

  //public getComment
  public getComment() {
    this.appService.getComment(this.issueId).subscribe(
      (apiResponse) => {
        this.commentsArray = apiResponse.data;
        this.scrollToChatTop = true;
      },
      (err) => {
        console.log(err);
      }
    );
  } //end of getComment

  //add watcher
  public becomeWatcher() {
    let data = {
      issueId: this.issueId,
      watcher: this._id,
      userId: this.userId,
    };
    this.appService.setWatcherForAnIssue(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 201) {
          this.toastr.success(apiResponse.message);
          this.getWatcherOfAIssue();
        } else {
          this.toastr.error(apiResponse.message);
          this.getWatcherOfAIssue();
        }
      },
      (err) => {
        console.log(err);
        this.toastr.error(err);
      }
    );
  } //end becomeWatcher

  public removeWatcher() {
    this.appService.removeWatcherForAnIssue(this.userId).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.watcherList = this.getWatcherOfAIssue();
          this.isWatcher = false;
        } else {
          this.toastr.error(apiResponse.message);
          this.getWatcherOfAIssue();
          this.isWatcher = false;
        }
      },
      (err) => {
        console.log(err);
        this.toastr.error(err);
      }
    );
  } //end removeWatcher

  public getWatcherOfAIssue() {
    this.appService.getWatchersOfIssue(this.issueId).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.watcherList = apiResponse.data;
          this.watcherList.map((each) => {
            if (each.userId === this.userId) {
              this.isWatcher = true;
            }
          });
          return this.watcherList;
        }
      },
      (err) => {
        console.log(err);
        this.toastr.error(err);
      }
    );
  } //end getWatcherOfAIssue

  public getSingleIssue() {
    this.spinner.show();
    this.appService.getSingleIssue(this.issueId).subscribe(
      (apiResponse) => {
        this.spinner.hide();
        this.currentIssue = apiResponse.data;
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  } //end getSingleIssue

  activateChangeAssign() {
    this.changeAssignee = !this.changeAssignee;
  }

  //uploading images
  fileAdded(event) {
    if (event.target.files.length) {
      for (let file of event.target.files) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        this.imageArray.push(file);
        reader.onload = (event: any) => {
          this.selectedFiles.push(event.target["result"]);
        };
      }
    }
  }
  onImageUpload() {
    const imageForm = new FormData();
    if (this.imageArray.length > 0) {
      for (let image of this.imageArray) {
        imageForm.append("image", image);

        this.appService.imageUpload(imageForm).subscribe((res) => {
          this.newAddedAttachments.push(
            `https://project-images-upload.s3.amazonaws.com/${res["image"]}`
          );

          if (
            this.newAddedAttachments.length == this.imageArray.length ||
            this.imageArray.length == 0
          ) {
            this.currentIssue.attachments = [
              ...this.currentIssue.attachments,
              ...this.newAddedAttachments,
            ];
            this.selectedFiles = [];
            this.editIssue(this.currentIssue.attachments);
          }
        });
      }
    } else {
      this.editIssue(this.currentIssue.attachments);
    }
  } //end of onImageUpload

  editIssue(attachments) {
    this.spinner.show();
    let images = attachments;
    if (this.selectAssignee == undefined) {
      this.selectAssignee = this.currentIssue.assignee._id;
    }
    let data = {
      issueName: this.currentIssue.issueName,
      issueDescription: this.currentIssue.issueDescription,
      assignee: this.selectAssignee,
      attachments: images,
      status: this.currentIssue.status,
      reporter: this.currentIssue.reporter._id,
    };
    this.getWatcherOfAIssue();
    let watcherUpdate = [];
    if (this.watcherList) {
      this.watcherList.forEach((element) => {
        watcherUpdate.push(element.watcher);
      });
    }
    data["watchers"] = watcherUpdate;
    this.appService.editIssue(this.issueId, data).subscribe(
      (apiResponse) => {
        this.spinner.hide();
        this.activateChangeAssign();
        this.toastr.success(apiResponse.message);
        this.getSingleIssue();
        setTimeout(() => {
          const message = `A issue on ${data.issueName} is been updated by ${
            this.appService.getUserInfoFromLocalStorage().firstName
          }`;
          let messageObj = {
            issueId: this.issueId,
            changesMade: this.currentIssue,
            message: message,
          };
          this.socketService.informServer(messageObj);
        }, 5000);
        this.goBack();
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      }
    );
  } //end of editIssue

  getAllUsersFromDB() {
    this.appService.getAllUsers().subscribe(
      (apiResponse) => {
        this.allUsers = apiResponse.data;
      },
      (err) => {
        console.log(err);
      }
    );
  } //end of getAllUsersFromDB

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
