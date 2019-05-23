import { Component, OnInit, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs/";
import { MapsAPILoader } from "@agm/core";
import { IndexedDbService } from "../../services/indexedDb/indexed-db.service";
import { Router } from "@angular/router";

declare var google: any;

@Component({
  selector: "app-map",
  templateUrl: "./map.page.html",
  styleUrls: ["./map.page.scss"]
})
export class MapPage implements OnInit {
  locations: Locations[];
  location: any;

  origin: [];
  destination: [];

  distance = new BehaviorSubject<string>(null);
  duration = new BehaviorSubject<string>(null);

  constructor(
    public mapsAPILoader: MapsAPILoader,
    public setlocation: IndexedDbService,
    public router: Router
  ) {}

  lat: number = 55.980511;
  lng: number = -3.179788;
  currentLat: number;
  currentLng: number;

  zoom: number = 11;
  gestureHandling: string = "greedy";

  loader: boolean = true;
  protected map: any;

  selectedLocationId: any;

  ngOnInit() {
    this.setlocation.makeDatabase();
    this.setlocation.connectToDatabase();
    this.getUserLocation();
    this.sotreLocations();
  }

  fetchLocations() {
    return fetch(
      "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/locations"
    );
  }

  async sotreLocations() {
    let data = await this.fetchLocations();
    let toStore = await data.json();

    this.locations = await toStore;
    this.loader = false;
  }

  protected mapReady(map) {
    this.map = map;
  }

  async markerClicked(markerObj) {
    if (this.map) {
      this.map.panTo({ lat: markerObj.lat, lng: markerObj.lng });
      this.getTravelData(markerObj);
    }

    this.selectedLocationId = await markerObj.locationId;
    this.location = await markerObj;
  }

  getUserLocation() {
    let self = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.storeUserLocation(pos);
        },
        function(error) {
          if (error) {
            self.posBlock();
          }
        },
        { timeout: 5000 }
      );
    }
  }
  async storeUserLocation(pos) {
    let posLng = await pos.coords.longitude;
    let posLat = await pos.coords.latitude;

    this.currentLng = posLng;
    this.currentLat = posLat;
  }

  posBlock() {
    this.currentLat = 55.980511;
    this.currentLng = -3.179788;
  }

  getTravelData(markerObj) {
    this.mapsAPILoader
      .load()
      .then(() => {
        var origin1 = new google.maps.LatLng(this.currentLat, this.currentLng);
        var destinationA = new google.maps.LatLng(markerObj.lat, markerObj.lng);
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin1],
            destinations: [destinationA],
            travelMode: "DRIVING",
            avoidHighways: false,
            avoidTolls: false
          },
          callback
        );

        let self = this;
        function callback(response, status) {
          if (status == "OK") {
            self.getResponse(
              response.originAddresses,
              response.destination,
              response
            );
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async getResponse(origin, destination, response) {
    let self = this;
    this.origin = await origin;
    this.destination = await destination;
    let rep = await response;
    for (var i = 0; i < this.origin.length; i++) {
      var results = rep.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        self.distance = await element.distance.text;
        self.duration = await element.duration.text;
      }
    }
  }

  getLocation(location) {
    this.setlocation.addRowLocation(location);
    this.setlocation.getLocation();
    this.router.navigateByUrl("/order");
  }
}

export interface Locations {
  locationId: string;
  name: string;
  lat: number;
  lng: number;
}
