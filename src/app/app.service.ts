import { Injectable } from "@angular/core";
//http client
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, Subscriber } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { stringify } from "querystring";
import { tap, map, filter } from "rxjs/operators";

import { Login } from "./home/login/login";
import { Signup } from "./home/signup/signup";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private url = "http://localhost:3000/api/v1";
  public showSpinner: boolean = false;

  showLoadingSpinner() {
    this.showSpinner = true;
  }

  hideLoadingSpinner() {
    this.showSpinner = false;
  }

  hideSideNav: boolean = false;
  toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }
  constructor(private _http: HttpClient) {}

  //user realted service
  //local signup
  public signUpFunction(data: Signup): Observable<any> {
    const params = new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("email", data.email)
      .set("password", data.password)
      .set("avatar", data.avatar);
    return this._http.post(`${this.url}/users/signup`, params);
  }

  //local login or signin
  public loginFunction(data: Login): Observable<any> {
    const params = new HttpParams()
      .set("email", data.email)
      .set("password", data.password);
    return this._http.post(`${this.url}/users/login`, params);
  }

  public forgotPasswordFunction(data): Observable<any> {
    const params = new HttpParams().set("email", data.email);
    return this._http.post(`${this.url}/users/forgotPassword`, params);
  }

  public verifyPasswordResetLink(id, token): Observable<any> {
    return this._http.get(`${this.url}/users/resetPassword/${id}/${token}`);
  }

  public updatePassword(data): Observable<any> {
    return this._http.post(`${this.url}/users/updatePassword`, data);
  }
  //verify social id token sent by the frontend to authenticate the user
  public verifySocialIdToken(data): Observable<any> {
    return this._http.post(`${this.url}/users/socialId`, data);
  }

  public getSingleUser(userId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http
      .get(`${this.url}/users/${userId}`, { headers: headers })
      .pipe(
        tap((data) => {
          // console.log("Get user details", data);
        }),
        catchError(this.handleError)
      );
  }

  public getAllUsers(): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.get(`${this.url}/users`, { headers: headers }).pipe(
      tap((data) => {
        // console.log("Get all the users", data);
      }),
      catchError(this.handleError)
    );
  }

  public logout(userId): Observable<any> {
    const params = new HttpParams().set("userId", userId);
    return this._http.post(`${this.url}/users/logout`, params);
  }

  //user realted service
  public createIssue(data): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.post(`${this.url}/issues/create`, data, {
      headers: headers,
    });
  }

  public editIssue(issueId, data): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.put(`${this.url}/issues/edit/${issueId}`, data, {
      headers: headers,
    });
  }

  public getAllIssues(): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.get(`${this.url}/issues`, { headers: headers }).pipe(
      tap((data) => {
        // console.log("Get all the issues", data);
      }),
      catchError(this.handleError)
    );
  }

  public getAllIssuesAssignedToMe(assigneedId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http
      .get(`${this.url}/assignedIssues/${assigneedId}`, { headers: headers })
      .pipe(
        tap((data) => {
          // console.log("Get assigned issues", data);
        }),
        catchError(this.handleError)
      );
  }

  public getCounts(assigneedId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http
      .get(`${this.url}/count/${assigneedId}`, { headers: headers })
      .pipe(
        tap((data) => {
          // console.log("Get assigned issue counting", data);
        }),
        catchError(this.handleError)
      );
  }

  public searchIssues(data): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    let params = new HttpParams();
    params = params.append("searchTerm", data);
    // console.log("params", params);
    return this._http
      .get(`${this.url}/issues/issue/searchIssue`, { params: params })
      .pipe(
        tap((data) => {
          // console.log("Get searched issues", data);
        }),
        catchError(this.handleError)
      );
  }

  public getSingleIssue(issueId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http
      .get(`${this.url}/issues/${issueId}`, { headers: headers })
      .pipe(
        tap((data) => {
          // console.log("Get the issue", data);
        }),
        catchError(this.handleError)
      );
  }

  imageUpload(imageForm) {
    return this._http.post(`${this.url}/upload`, imageForm);
  }

  public saveComment(data): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.post(`${this.url}/comments`, data, {
      headers: headers,
    });
  }

  public getComment(issueId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.get(`${this.url}/comments/${issueId}`, {
      headers: headers,
    });
  }

  public setWatcherForAnIssue(data): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.post(`${this.url}/watchers`, data, {
      headers: headers,
    });
  }

  public removeWatcherForAnIssue(userId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.delete(`${this.url}/watchers/remove/${userId}`, {
      headers: headers,
    });
  }

  public getWatchersOfIssue(issueId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.get(`${this.url}/watchers/${issueId}`, {
      headers: headers,
    });
  }

  public deleteImageFromServer(image): Observable<any> {
    const params = new HttpParams().set("image", image);
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.put(`${this.url}/deleteImage`, params, {
      headers: headers,
    });
  }

  //common services
  public setUserInfoInLocalStorage = (data): any => {
    localStorage.setItem("userInfo", JSON.stringify(data));
  };
  public getUserInfoFromLocalStorage = (): any => {
    return JSON.parse(localStorage.getItem("userInfo"));
  };

  public setAuthToken = (data): any => {
    localStorage.setItem("authToken", JSON.stringify(data));
  };
  public getAuthToken = (): any => {
    return JSON.parse(localStorage.getItem("authToken"));
  };

  public removeUserInfoFromLocalStorage = (): any => {
    localStorage.removeItem("userInfo");
  };

  public removeAuthTokenFromLocalStorage = (): any => {
    localStorage.removeItem("authToken");
  };

  //exception handler
  private handleError(err: HttpErrorResponse) {
    console.log("Handle error Http Calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
