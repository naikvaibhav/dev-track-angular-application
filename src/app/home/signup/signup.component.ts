import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
//toaster
import { ToastrService } from "ngx-toastr";
//import service
import { AppService } from "src/app/app.service";
import { ImageUploadService } from "src/app/image-upload.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  public firstName: string = "";
  public lastName: string = "";
  public email: string = "";
  public password: string = "";
  public confirmPassword: string = "";

  imageObj: File;
  url: string | ArrayBuffer;
  imageUrl: string;

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit() {}

  //selecting the profile photo
  onSelectFile(event) {
    document.querySelector(".custom-file-label").textContent =
      event.target.files[0].name;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.imageObj = event.target.files[0];
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.url = event.target["result"];
      };
    }
  } //end of onSelectFile

  public goToLogIn: any = () => {
    this.router.navigate(["/login"]);
  }; //end of goToLogIn

  //uploading the image /profile photo to s3 abd getting its path to store the path in DB
  onImageUpload() {
    this.appService.showLoadingSpinner();
    if (this.url != undefined) {
      document.getElementById("imagePreview").style.display = "none";
    }
    const imageForm = new FormData();
    imageForm.append("image", this.imageObj);
    this.imageUploadService.imageUpload(imageForm).subscribe((res) => {
      this.appService.hideLoadingSpinner();
      this.imageUrl = res["image"];
      this.imageUrl = `https://project-images-upload.s3.amazonaws.com/${this.imageUrl}`;
    });
  } //end of onImageUpload

  public signUpFunction: any = () => {
    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      avatar: this.imageUrl,
    };
    document.querySelector(".signUpBtn").textContent = "Signing....";
    this.appService.signUpFunction(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 201) {
          this.toastr.success("Signup successful");
          setTimeout(() => {
            this.goToLogIn();
          }, 200);
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      (err) => {
        console.log(err);
        document.querySelector(".signUpBtn").textContent = "Sign Up";
        this.toastr.error(err.error.message);
      }
    );
  }; //end of signUpFunction

  public cancelRegister: any = () => {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.imageUrl = "";
    this.url = "";
  }; //end of cancelRegister
}
