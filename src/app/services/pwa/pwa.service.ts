import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class PwaService {
  promptEvent;

  constructor() {}

  getAddHomeEvent() {
    window.addEventListener("beforeinstallprompt", event => {
      this.promptEvent = event;
    });
  }
}
