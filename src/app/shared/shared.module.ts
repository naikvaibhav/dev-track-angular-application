import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TopandsidenavComponent } from "./topandsidenav/topandsidenav.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [TopandsidenavComponent],
  imports: [CommonModule, RouterModule],
  exports: [TopandsidenavComponent],
})
export class SharedModule {}
