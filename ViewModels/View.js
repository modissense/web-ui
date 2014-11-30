$(document).ready(function () {

    function viewModel() {

        var model;
        var self = this;
       
        self.homeCallbackUrl = "http://localhost/dnn705/Home.aspx?";
        self.accountCallbackUrl = "http://localhost/dnn705/Home.aspx?section=account";
       
       
        self.userLoggedIn = ko.observable(false);
        self.userToken = ko.observable();
        self.userName = ko.observable();

        self.supportedNetworks = ['facebook', 'twitter', 'foursquare'];
        self.userNetworks = ko.observableArray([]);
        self.userConnections = ko.observableArray([]);
        self.blogCollection = ko.observableArray([]);
        self.poisList = ko.observable();

        self.SelectedBlog = ko.observable();
        self.BlogDetails = ko.observableArray([]);
        self.BlogDescription = ko.observable("Επιλέξτε μια ημέρομηνία από την παραπάνω λίστα για να δείτε το blog σας");
        self.chosenConnections = new selectedConnections(); 
        self.activePage = ko.observable();
        self.ActiveBlogId = ko.observable();

        /* search form fields */
        self.searchKeywords = ko.observable("");
        self.startDate = ko.observable("");
        self.endDate = ko.observable("");
        self.orderByHotness = ko.observable("");
        self.orderByInterest = ko.observable("");

        /* new poi form fields */
        self.poiTitle = ko.observable("");
        self.poiKeywords = ko.observable("");
        self.poiPublicity = ko.observable(true);        
        self.poiDescription = ko.observable("");
        

        self.succesMessage = ko.observable(false);
        self.succesMessageText = ko.observable("");
        self.errorMessage = ko.observable(false);
        self.errorMessageText = ko.observable("");


        self.loadConnections = function (userid) {
            $.ajax(
                {
                    url: userConnectionsUrl(userid),
                    dataType: "jsonp",
                    jsonpCallback: 'callback',
                    success: function (data) {
                        ko.mapping.fromJS(data.user.connections, {}, self.userConnections);
                        self.userName(data.user.username);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.debug(jqXHR.status);
                        console.debug(textStatus);
                        console.debug(errorThrown);
                    }
                });
                   
           /* $.getJSON('http://www.json-generator.com/j/hFKZ?indent=4', function (allData) {
                ko.mapping.fromJS(allData[0].connections, {}, self.userConnections);
                self.userName(allData[0].username);
            });*/

        };


        self.loadNetworks = function (userid) {
            $.ajax(
                {
                    url: userNetworksUrl(userid),
                    dataType: "jsonp",
                    jsonpCallback: 'callback',
                    success: function (data) {
                        ko.mapping.fromJS(data.networks, {}, self.userNetworks);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.debug(jqXHR.status);
                        console.debug(textStatus);
                        console.debug(errorThrown);
                    }
                });

            /* $.getJSON('http://www.json-generator.com/j/hpwP?indent=4', function (allData) {
                ko.mapping.fromJS(allData.result.networks, {}, self.userNetworks);                
            });*/
        };

        self.loadBlogs = function (userid) {
            $.ajax(
                {
                    url: getBlogsUrl(userid),
                    dataType: "jsonp",
                    jsonpCallback: 'callback',
                    success: function (data) {
                        ko.mapping.fromJS(data.blogs, {}, self.blogCollection);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.debug(jqXHR.status);
                        console.debug(textStatus);
                        console.debug(errorThrown);
                    }
                });

           /* $.getJSON('http://www.json-generator.com/j/bHlrecfyEO?indent=4', function (allData) {
                ko.mapping.fromJS(allData.blogs, {}, self.blogCollection);
            });*/
            google.maps.event.trigger(blogmap, 'resize');
        };

        self.loadBlog = function (userid, blogId) {

            /* Hide the previous markers */
            for (var key in markersBlogCollection) {
                if (markersBlogCollection.hasOwnProperty(key)) {
                    markersBlogCollection[key].setVisible(false);
                }
            }
            markersBlogCollection = {};

             $.ajax(
                 {
                     url: getBlogUrl(userid,blogId),
                     dataType: "jsonp",
                     jsonpCallback: 'callback',
                     success: function (data) {
                         self.BlogDetails(ko.utils.arrayMap(data.blog, function (item) {
                                 return new BlogObject(item);
                         }));
                         self.BlogDescription(data.description);
                     },
                     error: function (jqXHR, textStatus, errorThrown) {
                         console.debug(jqXHR.status);
                         console.debug(textStatus);
                         console.debug(errorThrown);
                     }
                 });
                 
           

            //$.getJSON('http://www.json-generator.com/j/cmQdqOovdu?indent=4', function (allData) {

            //    /* ko.mapping does not map an array of objects to an observable array.
            //     * The following DOES NOT work
            //     * ko.mapping.fromJS(allData, microblogListMapping,self.BlogDetails);
            //     */

            //    /* Use the normal ko map function*/
            //    self.BlogDetails(ko.utils.arrayMap(allData.blog, function (item) {
            //        return new BlogObject(item);
            //    }));
                
            //});
            
            google.maps.event.trigger(blogmap, 'resize');
        };
       
        self.getPois = function () {

            var keywords = self.searchKeywords().split(",");
            var sorting = $('#orderBySelection > .active').val();

            var bounds = map.getBounds();
            var ne = bounds.getNorthEast(); // LatLng of the north-east corner
            var sw = bounds.getSouthWest(); // LatLng of the south-west corder

            var query = new searchObject();
            query.Start = self.startDate();
            query.End = self.endDate();
            query.x1 = ne.lat();
            query.y1 = ne.lng();
            query.x2 = sw.lat();
            query.y2 = sw.lng();
            query.OrderBy = sorting != undefined ? sorting : ""; 
            query.NoOfResults = 10;
            query.Keywords = keywords[0] != "" ? keywords : [];
            query.FriendsList = self.chosenConnections.selectedUserIds();
            query.token = self.userToken();
         
            /* Hide the previous markers */
            for (var key in markersCollection) {
                if (markersCollection.hasOwnProperty(key)) {
                    markersCollection[key].setVisible(false);
                }
            }
            markersCollection = {};

            $.ajax(
                {
                    url: getPoisUrl(query),
                    dataType: "jsonp",
                    jsonpCallback: 'callback',                    
                    success: function (result) {
                        ko.mapping.fromJS(result, poiListMapping, self.poisList);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.debug(jqXHR.status);
                        console.debug(textStatus);
                        console.debug(errorThrown);
                    }
                });

            /* $.getJSON('http://www.json-generator.com/j/hHWs?indent=4', function (allData) {
                ko.mapping.fromJS(allData, poiListMapping, self.poisList);
            });       */
        };

        self.getNearestPois = function () {

            var query = {};
            var currentPosition = map.getCenter();
                        
            query["lat"] = currentPosition.lat();
            query["lon"] = currentPosition.lng();
            query["k"] = 20;
            query["token"] = self.userToken();

            /* Hide the previous markers */
            for (var key in markersCollection) {
                if (markersCollection.hasOwnProperty(key)) {
                    markersCollection[key].setVisible(false);
                }
            }
            markersCollection = {};

            $.ajax(
                {
                    url: getNearestPoisUrl(query),
                    dataType: "jsonp",
                    jsonpCallback: 'callback',
                    success: function (result) {
                        ko.mapping.fromJS(result, poiListMapping, self.poisList);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.debug(jqXHR.status);
                        console.debug(textStatus);
                        console.debug(errorThrown);
                    }
                });

            /* $.getJSON('http://www.json-generator.com/j/hHWs?indent=4', function (allData) {
                ko.mapping.fromJS(allData, poiListMapping, self.poisList);
            });       */
        };

        self.addNewPoi = function () {

            var newPOI = {};

            var keywords = self.poiKeywords().split(",");
            var currentPosition = newMarker.getPosition();

            newPOI["name"] = self.poiTitle();
            newPOI["x"]= currentPosition.lat();
            newPOI["y"] = currentPosition.lng();         
            newPOI["description"] = self.poiDescription();
            newPOI["publicity"] = self.poiPublicity();
            newPOI["keywords"] = keywords[0] != "" ? keywords : [];
            newPOI["token"] = self.userToken();

            $.ajax(
                {
                    url: addPoiUrl(newPOI),
                    dataType: "jsonp",
                    jsonpCallback: 'callback',
                    success: function (data) {
                        console.log(data.result);
                        if (data.result == "true") {
                            self.succesMessage(true);
                            self.succesMessageText("Επιτυχία! Το νέο σημείο ενδιαφέροντος αποθηκεύτηκε");
                            self.deleteMarker();
                        }
                        else {
                            self.errorMessage(true);
                            self.errorMessageText("Αποτυχία! Το νέο σημείο ενδιαφέροντος δεν αποθηκεύτηκε");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.debug(jqXHR.status);
                        console.debug(textStatus);
                        console.debug(errorThrown);
                    }
                });

           /* $.getJSON('http://www.json-generator.com/j/hyqD?indent=4', function (allData) {
                ko.mapping.fromJS(allData.result, poiListMapping, self.poisList);
            });*/
        };

        self.updatePoi = function () {

            var updatePOI = {};

            var keywords = self.poiKeywords().split(",");           

            updatePOI["name"] = self.poiTitle();
            updatePOI["x"] = selectedPOIlat;
            updatePOI["y"] = selectedPOIlon;
            updatePOI["description"] = self.poiDescription();
            updatePOI["publicity"] = self.poiPublicity();
            updatePOI["keywords"] = keywords[0] != "" ? keywords : [];
            
            $.ajax(
                {
                    url: editPoiUrl(updatePOI),
                    dataType: "jsonp",
                    jsonpCallback: 'callback',
                    success: function (data) {
                        console.log(data.result);
                        if (data.result == "true") {
                            self.succesMessage(true);
                            self.succesMessageText("Επιτυχία! Το σημείο ενδιαφέροντος ενημερώθηκε");
                        }
                        else {
                            self.errorMessage(true);
                            self.errorMessageText("Αποτυχία! Η ενημέρωση του σημείου ενδιαφέροντος απέτυχε");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.debug(jqXHR.status);
                        console.debug(textStatus);
                        console.debug(errorThrown);
                    }
                });
        };

        self.deletePoi = function () {

            var deletePOI = {};

            deletePOI["x"] = selectedPOIlat;
            deletePOI["y"] = selectedPOIlon;            
            deletePOI["token"] = self.userToken();


            $.ajax(
                {
                    url: deletePoiUrl(deletePOI),
                    dataType: "jsonp",
                    jsonpCallback: 'callback',
                    success: function (data) {
                        console.log(data.result);
                        if (data.result == "true") {
                            self.succesMessage(true);
                            self.succesMessageText("Επιτυχία! Το σημείο ενδιαφέροντος διεγράφη");
                        }
                        else {
                            self.errorMessage(true);
                            self.errorMessageText("Αποτυχία! Η διαγραφή του σημείου ενδιαφέροντος απέτυχε");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.debug(jqXHR.status);
                        console.debug(textStatus);
                        console.debug(errorThrown);
                    }
                });

        };

        self.login = function (data, event) {
           window.location.href = registerUserUrl(event.target.id, null, self.homeCallbackUrl); 

           /* if (event.target.id == 'facebook') {
                self.userLoggedIn(true);
                self.activePage('homePage');
                google.maps.event.trigger(map, 'resize');
            }
            else
                self.userLoggedIn(false);*/
        };

        self.logout = function () {
            self.userLoggedIn(false);
            self.activePage('');// hide all pages

            var element = $('#modissense');
            ko.cleanNode(element);
        };        

        self.isActivePage = function (page) {
            return self.activePage() == page;
        };

        self.showPage = function (page) { 
            if (page == "accountPage")
            {
                self.loadNetworks(self.userToken());             
            }
            else if (page == "blogPage")
            {
                self.loadBlogs(self.userToken());
                google.maps.event.trigger(blogmap, 'resize');
            }
            self.activePage(page);
        };

        /* chekks if the currentNet is one of the user's connected networks*/
        self.checkNetwork = function (uNetworks, currentNet) {          
            for (i = 0; i < uNetworks.length; ++i) {
                if (uNetworks[i].Name() === currentNet) {                  
                    return true;
                }
            }          
        };

        self.connectNetwork = function (data, event) {          
           
            window.location.href = registerUserUrl(data, self.userToken(), self.accountCallbackUrl);
        };

        self.showFriends = function (data) {
            $('#conn_' + data).toggle('slow');  
        };

        self.selectBlog = function (blog) {
            self.SelectedBlog(blog);
            self.ActiveBlogId(blog.date());
            self.loadBlog(self.userToken(), blog.date());            
        };

        self.isActiveBlog = function (blog) {
      
            return self.ActiveBlogId() == blog.date() ? true : false;
        };

        self.dismissSuccesMessage = function (data) {
            self.succesMessage(false);
            self.succesMessageText("");
        };

        self.dismissErrorMessage = function (data) {
            self.errorMessage(false);
            self.errorMessageText("");
        };

        /* Delete the new marker and close dialog window */
        self.deleteMarker = function (data) {
            if (newMarker != null) {
                newMarker.setMap(null);
                newMarker = null;

                self.poiTitle("");
                self.poiKeywords("");
                self.poiPublicity(true);                
            }
        }

         
        /* Initialization Code */


        if (getParameterByName("uid") != "")
        {
            self.userToken(getParameterByName("uid"));                               
            self.loadConnections(self.userToken()); 
         
            self.userLoggedIn(true);
            self.activePage('homePage');
            google.maps.event.trigger(map, 'resize');
            
            getUserPosition();

            if (getParameterByName("section") == "account")
            {
                self.showPage("accountPage");
            }
        }
        else
        {           
            self.userLoggedIn(false);
            self.activePage('');// hide all pages
        }            
    };

    moment.lang('el');
    ko.applyBindings(new viewModel());

    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd hh:ii"
    });
       
});
