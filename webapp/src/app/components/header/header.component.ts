import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styles: [],
})
export class HeaderComponent implements OnInit {
  @Input()
  version: string;

  @Input()
  title: string;

  constructor() {}

  ngOnInit(): void {}
}
