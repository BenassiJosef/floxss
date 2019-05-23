import { Component, OnInit } from '@angular/core';
import {IndexedDbService} from '../../services/indexedDb/indexed-db.service';



@Component({
  selector: 'app-location-ui',
  templateUrl: './location-ui.component.html',
  styleUrls: ['./location-ui.component.scss']
})
export class LocationUiComponent implements OnInit {

  constructor(public indexDb:IndexedDbService) { }
  location:any;
  ngOnInit() {
    this.indexDb.getLocation();
    this.indexDb.currentLocation.subscribe(value =>{
    this.location = value;
    });
  }


 
 

}
