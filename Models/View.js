//var mapOptions = {
//    center: new google.maps.LatLng(38.109915, 23.507851),
//    zoom: 10,
//    mapTypeId: google.maps.MapTypeId.ROADMAP
//};

var debug = true;

var map; //new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
var blogmap;
var mapZoom = 10;
var defaultLat = 38.109915;
var defaultLong = 23.507851;
var isNearMeMarkerLoaded = false;

initializeMap(defaultLat, defaultLong);

/* Check if we can get geolocation from the browser */
function getUserPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //define the map options
            var mapOptions = {
                center: myLatlng,
                zoom: mapZoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map.setOptions(mapOptions);
            console.log(position);

            if (!isNearMeMarkerLoaded) {
                /* Load near me marker only once */
                isNearMeMarkerLoaded = true;
                var currentmarker = new google.maps.Marker({
                    position: myLatlng,
                    map: map
                });
            }
        });
        
    } else {
        initializeMap(defaultLat, defaultLong);
    }
}


var newMarker = null;

var markersCollection = {};
var markersBlogCollection = {};


/* We initialize the infobubble styling */
var infoBubble = new InfoBubble({
    shadowStyle: 1,
    padding: 0,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    arrowSize: 10,
    borderWidth: 2,
    borderColor: '#3C74B6',
    maxWidth: 300,
    disableAutoPan: false,
    arrowPosition: 30,
    arrowStyle: 2,
    hideCloseButton: true
});


/* Service Endpoints */
var serviceUserEndpoint = "https://snf-97398.vm.okeanos.grnet.gr/user/";
var servicePoiEndpoint = "https://snf-97398.vm.okeanos.grnet.gr/poi/";

//var serviceUserEndpoint = "https://83.212.123.55/user/";
//var servicePoiEndpoint = "https://83.212.123.55/poi/";

var registerUserPath = "register/?";
var loggedInPath = "loggedin?";
var networksPath = "getnetworks/?";
var connectionsPath = "userinfo?";
var getPoisPath = "getpois?";
var addPoiPath = "addnewpois?";
var getNearestPoisPath = "getnn?";
var editPoiPath = "updatepoi?";
var deletePoiPath = "deletepoi?";
var getBlogsPath = "blog/getblogs/?"
var getBlogPath = "blog/getmicroblog/?"


var poiListMapping = {

    'poiList': {
        /*key: function (data) {
            return ko.utils.unwrapObservable(data.name);
        },*/
        create: function (options) {
            return new PoiObject(options.data);
        }
    }
};


var microblogListMapping = {

    'blog': {
        create: function (options) {

            return new BlogObject(options.data);
        }
    }
};


/* This object stores the connections that the user selects
   from the 3 listboxes (fb,twitter,4square)*/
function selectedConnections() {
   this.connections = {
    "facebook": ko.observableArray([]),
    "twitter" : ko.observableArray([]),
    "foursquare": ko.observableArray([])
    },

    this.selectedTotal = ko.computed(function () {        
        return this.connections['facebook']().concat(this.connections['twitter']()).concat(this.connections['foursquare']());
    }, this),

     this.selectedUserIds = ko.computed(function () {

         var usernames = ko.observableArray([]);
         ko.utils.arrayForEach(this.connections['facebook'](), function (user) {
             usernames.push(user.id());
         });
         ko.utils.arrayForEach(this.connections['twitter'](), function (user) {
             usernames.push(user.id());
         });
         ko.utils.arrayForEach(this.connections['foursquare'](), function (user) {
             usernames.push(user.id());
         });
         return usernames;

     }, this)


   this.selectedUsernames = ko.computed(function () {

       var usernames = ko.observableArray([]);
       ko.utils.arrayForEach(this.connections['facebook'](), function (user) {
           usernames.push(user.name());
       });
       ko.utils.arrayForEach(this.connections['twitter'](), function (user) {
           usernames.push(user.name());
       });
       ko.utils.arrayForEach(this.connections['foursquare'](), function (user) {
           usernames.push(user.name());
       });
       return usernames;
 
   }, this)

}

function PoiObject(item) {

    this.name = ko.observable(item.name);
    this.latitude = ko.observable(item.x);
    this.longitude = ko.observable(item.y);
    this.interest = ko.observable(item.interest);
    this.hotness = ko.observable(item.hotness);
    this.publicity = item.publicity;
    this.keywords = item.keywords;

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(item.x, item.y),
        /*title: name,*/
        map: map,
        visible: true,
        draggable: true,
        icon: _modulePath + "ModisenseDashboard/Content/images/flag-red.png"
    });
    
    google.maps.event.addListener(marker, 'click', function (event) {
       
        var keywords = "";
        for (var i = 0; i < item.keywords.length; i++)
        {
            keywords = keywords + " <span class='label label-info'>" + item.keywords[i] + "</span>";
        }

        infoBubble.setContent(
            "<button class='close' onclick='return overrideBubbleCloseClick();'>&times;</button>"
            + "<a class='edit' href='#' onclick='editPOI(\"" + item.name 
            + "\",\"" + item.description + "\",\"" + item.publicity + "\",\""
            + item.keywords + "\");'><i class='icon-edit'></i>Edit</a>"
            + "<a class='delete' href='#' onclick='deleteThePoi();'><i class='icon-remove-sign'></i>Delete</a>"
            + " <div class='poiDetails'>"
            + " <div class='title'>" + item.name 
            + " </div><span class='pull-left'>interest:" + item.interest
            + " </span><span class='pull-right'>hotness:" + item.hotness
            + " </span><br /><div class='description'>" + item.description
            + " </div>publicity:" + item.publicity
            + " <br />keywords:" + keywords
            + " </div>"
            );

        infoBubble.open(map, marker);
    }.bind(this));

    markersCollection[this.name()] = marker;
};

function BlogObject(item) {

    this.seqid = item.seqid;
    this.start = ko.observable(item.start);
    this.end = ko.observable(item.end);
    this.poi_id = item.poi_id;
    this.name = ko.observable(item.name);
    this.comment = ko.observable(item.comment);
    this.hotness = ko.observable(item.hotness);
    this.publicity = item.publicity;
    this.interest = ko.observable(item.interest);
    this.keywords =  ko.observableArray(item.keywords);
    this.latitude = ko.observable(item.lat);
    this.longitude = ko.observable(item.long);
    
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(item.lat, item.long),
        /*title: name,*/
        map: blogmap,
        visible: true,
        draggable: true,
        icon: _modulePath + "ModisenseDashboard/Content/images/flag-red.png"
    });

    google.maps.event.addListener(marker, 'click', function (event) {

        var keywords = "";
        for (var i = 0; i < item.keywords.length; i++) {
            keywords = keywords + " <span class='label label-info'>" + item.keywords[i] + "</span>";
        }

        infoBubble.setContent(
            "<button class='close' onclick='return overrideBubbleCloseClick();'>&times;</button>"
            + "<a class='edit' href='#' onclick='editBlog(\"" + item.name
            + "\",\"" + item.comment + "\",\"" + item.publicity + "\",\""
            + item.keywords + "\");'><i class='icon-edit'></i>Edit</a>"
            + "<a class='delete' href='#' onclick='deleteTheBlog();'><i class='icon-remove-sign'></i>Delete</a>"
            + " <div class='poiDetails'>"
            + " <div class='title'>" + item.name
            + " </div><span class='pull-left'>interest:" + item.interest
            + " </span><span class='pull-right'>hotness:" + item.hotness
            + " </span><br /><div class='description'>" + item.comment
            + " </div>publicity:" + item.publicity
            + " <br />keywords:" + keywords
            + " </div>"
            );

        infoBubble.open(blogmap, marker);
    }.bind(this));

    markersBlogCollection[this.name()] = marker;
};


function searchObject() {
    this.End,
    this.x1,
    this.y1,
    this.x2,
    this.y2,
    this.Start,	
    this.OrderBy,
    this.NoOfResults,
    this.Keywords = new Array(), 
    this.FriendsList = new Array(),
    this.token
}

/* Auxiliary functions */

function overrideBubbleCloseClick() {
    infoBubble.close();
    return false;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* Service URLs   */

function registerUserUrl(network, userid, callback) {

    var url = serviceUserEndpoint + registerUserPath + "network=" + network +
              "&token=" + userid + "&callback=" + callback;
    if (debug)
        console.log("Calling register user: " + url);
    return url;
}


function userNetworksUrl(userid) {

    var url = serviceUserEndpoint + networksPath + "token=" + userid + "&format=jsonp&jsonpcallback=?";
    if (debug)
        console.log("Called user networks: " + url);
    return url;
}

function userConnectionsUrl(userid) {

    var url = serviceUserEndpoint + connectionsPath + "token=" + userid + "&format=jsonp&jsonpcallback=?";
    if (debug)
        console.log("Called user connections: " + url);
    return url;
}

function getBlogsUrl(userid) {

    var url = serviceUserEndpoint + getBlogsPath + "token=" + userid + "&format=jsonp&jsonpcallback=?";
    if (debug)
        console.log("Called get Blogs: " + url);
    return url;
}

function getBlogUrl(userid,blogId) {

    var url = serviceUserEndpoint + getBlogPath + "token=" + userid + "&date=" + blogId + "&format=jsonp&jsonpcallback=?";
    if (debug)
        console.log("Called get Blog: " + url);
    return url;
}

function getPoisUrl(query) {

    var url = servicePoiEndpoint + getPoisPath
        + "&stime=" + query.Start
        + "&etime=" + query.End 
        + "&x1=" + query.x1 
        + "&y1=" + query.y1
        + "&x2=" + query.x2
        + "&y2=" + query.y2
        + "&friends=" + ko.toJSON(query.FriendsList).slice(1, -1)
        + "&keywords=" + query.Keywords
        + "&orderby=" + query.OrderBy
        + "&nresults=" + query.NoOfResults
        + "&format=jsonp&token=" + query.token;

    if (debug)
        console.log("Called get Pois: " + url);
    return url;
}


function getNearestPoisUrl(query) {

    var url = servicePoiEndpoint + getNearestPoisPath
        + "&lat=" + query.lat
        + "&lon=" + query.lon
        + "&k=" + query.k        
        + "&format=jsonp&token=" + query.token;

    if (debug)
        console.log("Called get Pois: " + url);
    return url;
}

function addPoiUrl(newpoi) {

    var url = servicePoiEndpoint + addPoiPath
        + "&name=" + encodeURIComponent(newpoi.name)
        + "&x=" + newpoi.x
        + "&y=" + newpoi.y
        + "&keywords=" + newpoi.keywords
        + "&publicity=" + newpoi.publicity
        + "&description=" + encodeURIComponent(newpoi.description)
        + "&format=jsonp&token=" + newpoi.token;

    if (debug)
        console.log("Called add Poi: " + url);
    return url;
}

function editPoiUrl(editpoi) {

    var url = servicePoiEndpoint + editPoiPath
        + "&name=" + encodeURIComponent(editpoi.name)
        + "&x=" + editpoi.x
        + "&y=" + editpoi.y
        + "&keywords=" + editpoi.keywords
        + "&publicity=" + editpoi.publicity
        + "&description=" + encodeURIComponent(editpoi.description)
        + "&format=jsonp&token=" + editpoi.token;

    if (debug)
        console.log("Called edit Poi: " + url);
    return url;
}

function deletePoiUrl(deletepoi) {

    var url = servicePoiEndpoint + deletePoiPath
        + "&x=" + deletepoi.x
        + "&y=" + deletepoi.y
        + "&format=jsonp&token=" + deletepoi.token;

    if (debug)
        console.log("Called delete Poi: " + url);
    return url;
}


/* Used to add a new poi on the map. It creates
     * a draggable marker and user can select a place 
     * on the map for his/her new poi
     */
function addPoi() {
    if (newMarker == null) {
        var current_latlon = map.getCenter();
        var newMarkerIcon = _modulePath + "ModisenseDashboard/Content/images/FlagGreen.png";
        newMarker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: current_latlon,
            icon: newMarkerIcon,
            title: 'My new POI'
        });

        var contentTemplate =
                "<button class='close' href='#' onclick='return overrideBubbleCloseClick();'>&times;</button>"
                + " <div class='poiDetails'>"
                + " Drag and drop the flag to the desired location and then click on it to fill the necessary information."
                + " </div>";

        infoBubble.setContent(contentTemplate);
        infoBubble.open(map, newMarker);


        //            // Register Custom "dragend" Event
        //            google.maps.event.addListener(newMarker, 'dragend', function() {
        //                // Get the Current position, where the pointer was dropped
        //                point = newMarker.getPosition();
        //                // Center the map at given point
        //                map.panTo(point);
        //                setAddNewMarkerCategory();
        //                $.mobile.changePage('#newPoiDialog', 'pop', true, true);
        //            });

        // Register Custom "click" Event
        google.maps.event.addListener(newMarker, 'click', function () {
            //close flag info window
            overrideBubbleCloseClick();
            // Get the Current position, where the pointer was dropped
            point = newMarker.getPosition();
            // Center the map at given point
            map.panTo(point);

            /* Initialize all fields*/
            $('#inputTitle').val("");
            $('#inputDescription').val("");
            $('#inputKeywords').val("");
            $('#addNewPoiLink').show();
            $('#updatePoiLink').hide();
            $('.control-group').show();

            $('#myModal').modal();

        });

    } else {
        alert("A new marker is already placed on the map. Either delete this marker or drag n drop it at the desired location");
    }
}


function editPOI(title,description,publicity,keywords) {
   
    $('#inputTitle').val(title);
    $('#inputDescription').val(description);
    $('#inputKeywords').val(keywords);
    $('#inputPublicity').val(publicity);
    $('#addNewPoiLink').hide();
    $('#updatePoiLink').show();    
    $('.control-group:last-child').hide();
    
    $('#myModal').modal();
}

function deleteThePoi() {
    $('#alertModal').modal();
}

/* Initialises a google map using map api v3 */
function initializeMap(Lat, Lon) {

    //define the center location 
    var myLatlng = new google.maps.LatLng(Lat, Lon);
    //define the map options
    var mapOptions = {
        center: myLatlng,
        zoom: mapZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //instantiate the map wih the options and put it in the div holder, "map-canvas"
    map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

    blogmap = new google.maps.Map(document.getElementById("blogmap_canvas"),
            mapOptions);
}





