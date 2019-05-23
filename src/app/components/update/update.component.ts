import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { merge, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent{

  updateAvailable$: Observable<boolean>;
  closed$ = new Subject<void>();

  constructor(private updates: SwUpdate) {
      this.updateAvailable$ = merge(
          of(false),
          this.updates.available.pipe(map(() => true)),
          this.closed$.pipe(map(() => false)),
      );
  }

  activateUpdate() {
      if (environment.production) {
          this.updates.activateUpdate().then(() => {
              location.reload(true);
          });
      }
  }

}
