# DevTrack

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Description of the application
The Dev Track app is a MEAN stack application. The actual name of the project is Issue Tracker. The name of this application is given by the developer as Dev Track. This app is used to log issues which the tester or developer faces during the development or testing of the software application. This application is similar to Jira software with much more intuitive design and easy to use UI. It’s a toned down version of Jira.

## Sample login credentials
(Robert can be a assignee)
email: robertjones@email.com
password: Password@123

(Sam can be a reporter)
email: samtucker@email.com  
password: Password@123

## Features of the app:
1.	A user has to provide credentials such as his first name, last name, email while signing up for the Dev Track app.
2.	The user has to provide his registered email address and password while logging in to the app.
3.	If the user wants to create an account using a social login, a social login button is provided. The user can use the same social account to login further.
4.	Once the user logs-in personalized dashboard should be displayed.
5.	The personalized dashboard should have a table displaying all the issues that are been assigned to the logged in user.
6.	The table must contain the Name of the issue, status of the issue, name of the reporter who reported the issue and the date when the issue was created.
7.	The table also has a text box to filter out the data in the table.
8.	Clicking on the header columns enables sorting of the table.
9.	Pagination is provided to the table.
10.	Clicking on the view button opens the Issue description of the issue.
11.	The user can edit the issue such as change the Name of the issue, Description of the issue, Status of the issue.
12.	The user can even add or delete the attachments that are posted along with the issue.
13.	A logged-in user can be a watcher to the issue. Hence a Watch button is provided in the Edit form.
14.	A user can also view other watchers who are watching the issue.
15.	There is a comment section where the users of dev track application can post comments regarding the particular issue and interact with each other.
16.	Whenever a comment is posted on a particular issue or the details of the issue are edited then a real time notification is sent to the Reporter and Watchers of the issue.
17.	The notification appears as toast message on the Dashboard of the Reporter or Watcher.
18.	If the Reporter or watcher clicks on the notification then he is directed to the Issue description view of the issue where he can view the changes made.
19.	The notification will have a short description regarding the issue such as the name of the issue that has been edited or if the issue had some comments posted.
20.	Also there is a search view with a text input to search for the issues. The user can enter the name of the issue or the status of the issue to search all the issues related to the text entered.
21.	If the user forgets his password he can opt for a reset password. A link is send to his registered email address. The user can reset his password by clicking on the link.
22.	The reset password link has duration. Once the duration expires the reset password link is invalid. This is done to improve the security.
23.	The user can upload his profile picture while signing up using the local signup.
24.	Once the logged in user becomes a Watcher to a issue by clicking the Watch button then he will see the stop watching the issue option. If he clicks on the Stop watching issue then he will not be watching anymore. If the user wants to be Watcher again he can do so.
25.	Custom domain name address is provided by which the user will receive an email for resetting his password.
26.	There is a user profile section so that the user can check his profile picture, name, email, user Id. The card is designed similar to an Identity Card to look innovative.
27.	Showing beautiful cards with data such as Total issues, Completed Issues, ToDo issues and InProgress issues. So that a user gets a glimpse of it in the dashboard itself.





## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
