import React, {Component} from 'react';
import LocationList from './LocationList';

class App extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            'alllocations': [
                {
                    'name': "warangal railway station",
                    'type': "Raliway Station",
                    'latitude': 17.973,
                    'longitude': 79.6055,
                    'streetAddress': "Station Road, Shiva Nagar"
                },
                {
                    'name': "Ramappa Lake",
                    'type': "Lake",
                    'latitude': 18.239,
                    'longitude': 79.9361,
                    'streetAddress': "Ramappa Lake,warangal"
                },
                {
                    'name': "Laknavaram Cheruvu",
                    'type': "lake",
                    'latitude': 18.1494,
                    'longitude': 80.073,
                    'streetAddress': "Laknavaram Cheruvu,Warangal"
                },
                {
                    'name': "University Gate Bus Stop",
                    'type': "Bus Stop",
                    'latitude': 18.0215,
                    'longitude': 79.5574,
                    'streetAddress': "Kakatiya University Bypass Rd, Kakatiya University"
                },
                {
                    'name': "Ashoka A-plex",
                    'type': "movie theater",
                    'latitude': 18.0076,
                    'longitude': 79.5671,
                    'streetAddress': "242, 6-1-242, Main Road, Reddy Colony"
                },
                {
                    'name': "Bhadrakali Temple",
                    'type': "Hindu Temple",
                    'latitude': 17.9948,
                    'longitude': 79.5827,
                    'streetAddress': "Bhadrakali Temple Rd, Near Lal Bahadur college Kupuwada"
                },
                {
                    'name': "Thousand Pillar Temple",
                    'type': "Hindu Temple",
                    'latitude': 18.0037,
                    'longitude': 79.5748,
                    'streetAddress': "Warangal-Hyderabad Rd, Brahmanawada"
                },
                {
                    'name': "Asian Cinemas - Asian Sridevi Mall ",
                    'type': "Movie Theatre",
                    'latitude': 18.0046,
                    'longitude': 79.56297,
                    'streetAddress': "Bus Stand Road,Hanamkonda"
                },
                {
                    'name': "Kakatiya Musical Garden",
                    'type': "Garden",
                    'latitude': 17.9911,
                    'longitude': 79.5888,
                    'streetAddress': "Near & Back Side of Warangal Muncipal Corporation , Near MGM"
                },
                {
                    'name': "Hotel Suprabha",
                    'type': "Hotel",
                    'latitude': 18.0002,
                    'longitude': 79.5559,
                    'streetAddress': "Nakkalagutta, NH163, Balasamudram"
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };

        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap')
    }

    /**
     * Initialise the map once the google map script is loaded
     */
    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 26.907502, lng: 75.737586},
            zoom: 15,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var alllocations = [];
        this.state.alllocations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            alllocations.push(location);
        });
        this.setState({
            'alllocations': alllocations
        });
    }

    /**
     * Open the infowindow for the marker
     * @param {object} location marker
     */
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
    }
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    /**
     * Render function of App
     */
    render() {
        return (
            <div>
                <LocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;

/**
 * Load the google maps Asynchronously
 * @param {url} url of the google maps script
 */
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}
