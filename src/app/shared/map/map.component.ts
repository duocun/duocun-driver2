import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { DeliveryDialogComponent } from '../../order/delivery-dialog/delivery-dialog.component';
import { OrderStatus } from '../../order/order.model';
import { environment } from '../../../environments/environment';

// import {MarkerClusterer} from '@google/markerclustererplus/dist/markerclusterer';

declare var MarkerClusterer: any;
declare let google: any;
const MEDIA_URL = environment.MEDIA_URL;
const icons = {
  'F': {
    yellow: 'assets/images/f-yellow.png',
    green: 'assets/images/f-green.png',
    red: 'assets/images/f-red.png',
  },
  'G': {
    yellow: 'assets/images/g-yellow.png',
    green: 'assets/images/g-green.png',
    red: 'assets/images/g-red.png',
  },
};
function getFunc(location) {
  return () => {
    (<any>window).location = encodeURI('https://www.google.com/maps/dir/?api=1&destination=' +
      + location.streetNumber + '+' + location.streetName + '+'
      + (location.subLocality ? location.subLocality : location.city) + '+'
      + location.province
      + '&destination_placeId=' + location.placeId);
  };
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() center: any;
  @Input() zoom: any;
  @Input() places: any[];
  @Input() pickup: any;
  @ViewChild('map', { static: true }) input: ElementRef;
  @Input() route;

  onDestroy$ = new Subject();
  map;
<<<<<<< HEAD
  markerCluster;
  markerMap = {};

=======
  routes = [];
>>>>>>> master

  constructor(
    public dialogSvc: MatDialog
  ) { }

  ngOnInit() {
    // this.initMap();
  }

  ngOnChanges(v) {
    this.initMap(this.places);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  openDeliveryDialog(place: any) {
    const pickup = this.pickup;
    const params = {
      width: '300px',
      data: {
        title: '订单', content: '', buttonTextNo: '取消', buttonTextYes: '确认', place, pickup
      },
      panelClass: 'delivery-dialog'
    };
    const dialogRef = this.dialogSvc.open(DeliveryDialogComponent, params);

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(group => {
      if (group) {
        this.updatePlace(group);
      }
    });
  }

  // init map
  addPlaces(map, places) {
    const self = this;
    let markerCluster = null;
    if (places && places.length) {
      places.forEach((p, i) => {
        const iconUrl = p.icon ? p.icon : 'http://labs.google.com/ridefinder/images/mm_20_red.png';
        const location = p.location;
        const marker1 = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          label: {
            text: self.getAddr(self.places[i].location),
            fontSize: '14px'
          },
          icon: {
            url: iconUrl
          },
          placeId: p.location.placeId,
          status: p.status
        });

        // if (p.status === 'done') {
        //   google.maps.event.removeListener(p.listener);
        // } else {
        p.listener = marker1.addListener('click', function () {
          self.openDeliveryDialog(self.places[i]);
        });
        // }

        marker1.setMap(map);
        this.markerMap[p.location.placeId] = marker1;
        // this.markers.push(marker1);
      });

      const markers = Object.keys(this.markerMap).map(placeId => this.markerMap[placeId]);
      markerCluster = new MarkerClusterer(map, markers, { imagePath: 'assets/images/cluster-red' });
      markerCluster.addListener('clusteringend', (mc) => {
        const a = mc.getClusters();
        if (a && a.length > 0) {
          a.forEach(p => {
            p.clusterIcon_.url_ = self.isFinished(p.markers_) ? 'assets/images/cluster-green1.png' : 'assets/images/cluster-red1.png';
          });
        }
      });
      // 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }// end of this.places

    return markerCluster;
  }

  isFinished(its) {
    const unfinished = its.filter(m => m.status !== OrderStatus.DONE);
    return !(unfinished && unfinished.length > 0);
  }

  addRoute(map) {
    const self = this;
    if (this.route && this.route.length) {
      const route = new google.maps.Polyline({
        path: this.route,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      route.setMap(map);
      this.routes.push(route);
    }// end of this.places
  }

  removePlaces() {
    if (this.places && this.places.length) {
      this.places.map((p, i) => {
        google.maps.event.removeListener(p.listener);
      });
    }
    Object.keys(this.markerMap).forEach(placeId => {
      this.markerMap[placeId].setMap(null);
    });
  }
<<<<<<< HEAD

  updatePlace(group: any) {
=======
  removeRoutes() {
    this.routes.map(m => {
      m.setMap(null);
    });
  }
  updatePlace(map: any, group: any) {
>>>>>>> master
    const self = this;

    const place: any = this.places.find(p => p.location.placeId === group.placeId);
    const marker: any = this.markerMap[group.placeId];
    const isDone = self.isFinished(group.items);
    const type = group.items[0].order.type;

    place.icon = isDone ? icons[type]['green'] : icons[type]['red']; // icons['green'] : icons['red'];

    const iconUrl = place.icon ? place.icon : 'http://labs.google.com/ridefinder/images/mm_20_red.png';
    marker.setIcon({ url: iconUrl, status: isDone ? OrderStatus.DONE : OrderStatus.NEW });
    const markers = this.markerCluster.getMarkers();
    markers.forEach(m => {
      if (m.placeId === marker.placeId) {
        m.icon = { url: iconUrl };
        m.status = isDone ? OrderStatus.DONE : OrderStatus.NEW;
      }
    });
  }


  initMap(places) {
    const self = this;

    if (typeof google !== 'undefined') {
      const mapDom = this.input.nativeElement;
      const map = new google.maps.Map(mapDom, {
        // const map = new google.maps.Map(document.getElementById('map'), {
        zoom: self.zoom,
        center: self.center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

<<<<<<< HEAD
      this.markerCluster = this.addPlaces(map, places);
=======
      this.addPlaces(map);
      this.addRoute(map);
>>>>>>> master
      this.map = map;
    }
  }

  getAddr(location) {
    if (location) {
      const addr = location.unit ? `${location.unit} ` : '';
      if (location.subLocality) {
        return addr + `${location.streetNumber} ${location.streetName}, ${location.subLocality}`;
      } else {
        return addr + `${location.streetNumber} ${location.streetName}, ${location.city}`;
      }
    } else {
      return '';
    }
  }
}
