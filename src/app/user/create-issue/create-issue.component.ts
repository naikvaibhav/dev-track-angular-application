import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-issue",
  templateUrl: "./create-issue.component.html",
  styleUrls: ["./create-issue.component.css"],
})
export class CreateIssueComponent implements OnInit {
  public userId = this._route.snapshot.paramMap.get("id");
  public reportedId = this.appService.getUserInfoFromLocalStorage()._id;
  public avatar;
  selectedFiles = [];
  imageArray = [];
  attachments = [];

  public allUsers = "";
  issueName: string;
  issueDescription: string;
  selectedAssignee: any;

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.avatar = this.appService.getUserInfoFromLocalStorage().avatar;
    this.getAllUsersFromDB();
  }

  goBack() {
    this.router.navigate([`userdashboard/${this.userId}`]);
  }

  //uploading images
  fileAdded(event) {
    if (event.target.files.length) {
      for (let file of event.target.files) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        this.imageArray.push(file);
        reader.onload = (event: any) => {
          // called once readAsDataURL is completed
          this.selectedFiles.push(event.target["result"]);
          console.log(this.selectedFiles);
        };
      }
    }
  } //end of fileAdded

  onImageUpload() {
    const imageForm = new FormData();
    if (this.imageArray.length === 0) {
      this.createIssue(this.imageArray);
    }
    for (let image of this.imageArray) {
      imageForm.append("image", image);
      this.appService.imageUpload(imageForm).subscribe((res) => {
        this.attachments.push(
          `https://project-images-upload.s3.amazonaws.com/${res["image"]}`
        );

        if (this.attachments.length == this.imageArray.length) {
          this.createIssue(this.attachments);
        }
      });
    }
  } //end of onImageUpload

  closeImage(image) {
    this.selectedFiles = this.selectedFiles.filter((url) => {
      return url !== image;
    });
  } //end of closeImage

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

  createIssue(attachments) {
    let images = attachments;
    let data = {
      issueName: this.issueName,
      issueDescription: this.issueDescription,
      assignee: this.selectedAssignee,
      attachments: images,
      reporter: this.reportedId,
    };
    this.appService.createIssue(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 201) {
          this.toastr.success(apiResponse.message);
          this.goBack();
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      (err) => {
        this.toastr.error(err.error.message);
      }
    );
  } //end of createIssue
}
