import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WebService } from "../web.service";
import { WeeklySummary } from "../model/weekly-summary";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-time-sheet",
  templateUrl: "./time-sheet.component.html",
  styleUrls: ["./time-sheet.component.css"]
})
export class TimeSheetComponent implements OnInit {
  endingDay: string;
  totalBillingHours: number;
  totalCompensatedHours: number;
  endDate:{year: number, month: number, day:number};
  summaries$: Observable<WeeklySummary>;
  summaries: WeeklySummary;
  timeHardCode: string[]=["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM",
  "03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"]
  constructor(private api: WebService, private router: Router, private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.endingDay = params['endingDay'];
  });
    this.summaries$ = this.api.getWeeklySummariesByUseNameAndDate(this.endingDay).pipe(map(data => data));
    this.summaries$.subscribe(data => {
      this.summaries = data;
    });
  }
  changeDate(){
    this.endingDay=(this.endDate.year)+'-'+this.pad(this.endDate.month)+'-'+this.pad(this.endDate.day);
    this.router.navigate(['/timeSheet'], { queryParams: {endingDay: this.endingDay}});
  }
  timeFit(startingTime,hour){
    if(this.timeTransfer(hour)===startingTime){
      return true;
    }
    else{
      return false;
    }
  }
  timeTransferwithNull(time: string){
    if(time==="N/A"){
      return null;
    }
    else{
      return this.timeTransfer(time);
    }

  }
  timeTransfer(time: string){
    const postfix=time.slice(-2);
    if(postfix==="AM"||(postfix==="PM"&&time.substring(0,2)==="12")){
      return (time.substring(0,2)+":00:00");
    }
    else{
      return (+time.substring(0,2)+12)+":00:00"
    }
  }
  save(){
      console.log(this.summaries)
  }
  calBilling(){
    let billing = 0;
    for(const day of this.summaries.days){
      billing=billing+day.totalHours;
    }
    return billing;
  }
  calCompensated(){
    let compensated = 0;
    for(const day of this.summaries.days){
      if(day.floatingDay){
        compensated=compensated+8;
      }
      compensated=compensated+day.totalHours;
    }
    return compensated;
  }
  pad(num) {
    let s = num+"";
    while (s.length < 2){
      s = "0" + s;
    }
    return s;
}

}
