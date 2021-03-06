import { UserInformation } from "./model/userInformation";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WeeklySummary } from "./model/weekly-summary";
import { YearlyVacation } from "./summary/YearlyVacation";
import { HttpHeaders } from "@angular/common/http";
import { User } from "./model/user";

@Injectable({
  providedIn: "root"
})
export class WebService {
  constructor(private http: HttpClient) {}

  authenticate(username, password) {
    const ui: UserInformation = new UserInformation();
    ui.username = username;
    ui.password = password;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post("api/auth/signin", JSON.stringify(ui), httpOptions);
  }

  getVacationLeft(summary) {
    const token = sessionStorage.getItem("token");
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token
      })
    };
    return this.http.post<YearlyVacation>(
      "api/smartComposite/vacationLeft",
      JSON.stringify(summary),
      httpOptions
    );
  }

  saveWeeklySummary(WeeklySummary) {
    const token = sessionStorage.getItem("token");
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token
      })
    };
    return this.http.post(
      "api/smartComposite/updateSummary",
      JSON.stringify(WeeklySummary),
      httpOptions
    );
  }

  getWeeklySummaries() {
    const token = sessionStorage.getItem("token");
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    return this.http.post<WeeklySummary[]>(
      "api/smartComposite/all",
      JSON.stringify("good"),
      httpOptions
    );
  }

  getWeeklySummariesByUseNameAndDate(date) {
    const token = sessionStorage.getItem("token");
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token
      })
    };
    return this.http.post<WeeklySummary>(
      "api/smartComposite/getSummary",
      JSON.stringify(date),
      httpOptions
    );
  }

  getUserInfo() {
    const token = sessionStorage.getItem("token");
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=UTF-8",

        Authorization: "Bearer " + token
      })
    };
    return this.http.post<User>(
      "api/profileComposite/detail",
      JSON.stringify(User),
      httpOptions
    );
  }

  saveUserInfo(User) {
    const token = sessionStorage.getItem("token");
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token
      })
    };
    return this.http.post(
      "api/profileComposite/updateDetail",
      JSON.stringify(User),
      httpOptions
    );
  }
}
