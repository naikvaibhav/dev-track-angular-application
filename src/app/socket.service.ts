import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { of } from "rxjs";
import { Observable, Subscriber } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { stringify } from "querystring";
import { tap, map, filter } from "rxjs/operators";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket;

  private authToken;
  constructor(private _http: HttpClient) {
    //connection is being created
    //that handshake
    // this.socket = io("http://localhost:3000");
    this.socket = io("https://apidevtrack.naikvaibhav.online");
    this.authToken = JSON.parse(localStorage.getItem("authToken"));
  }

  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on("verifyUser", (data) => {
        observer.next(data);
      });
    });
  };

  public getAllConnectedUserList = () => {
    return Observable.create((observer) => {
      this.socket.on("broadcast", (data) => {
        observer.next(data);
      });
    });
  };

  //events to be emitted
  public setUser = (token) => {
    this.socket.emit("set-user", token);
  }; //end setUser

  public exitSocket = () => {
    this.socket.disconnect();
  };

  public informServer = (data) => {
    this.socket.emit("inform-server", data);
  };

  public informServerAboutWatchers = (data) => {
    this.socket.emit("watcher-room", data);
  };

  public informUser = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); //end Socket
    }); //end Observable
  };

  public meetingNotification = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); //end Socket
    }); //end Observable
  }; //end of meetingNotification

  public informReporteAboutIssueUpdate = () => {
    return Observable.create((observer) => {
      this.socket.on("inform-reporter", (data) => {
        observer.next(data);
      });
    });
  };

  public informWatcherAboutIssueUpdate = () => {
    return Observable.create((observer) => {
      this.socket.on("inform-watcher", (data) => {
        observer.next(data);
      });
    });
  };

  public disconnectedSocket = () => {
    return Observable.create((observer) => {
      this.socket.emit("disconnect", () => {
        observer.next();
      });
    });
  };

  //exception handler
  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";
    if (err.error instanceof Error) {
      errorMessage = `An error occured: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.error.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}
