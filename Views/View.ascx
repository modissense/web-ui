<%@ Control Language="C#" Inherits="Gooddogs.Modules.Dnn.ModisenseDashboard.View" AutoEventWireup="false" CodeBehind="View.ascx.cs" %>

<%@ Register TagPrefix="dnn" Namespace="DotNetNuke.Web.Client.ClientResourceManagement"
    Assembly="DotNetNuke.Web.Client" %>

<script type="text/javascript"
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8u427F1iuOCJkC-qQwtABo8ZnONuB_1o&sensor=false">
</script>
<!-- Google Maps Utility Library - Infobubble -->
<script type="text/javascript"
    src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobubble/src/infobubble.js">
</script>
<!-- Overlapping markers Library: Deals with overlapping markers in Google Maps -->
<script src="http://jawj.github.com/OverlappingMarkerSpiderfier/bin/oms.min.js"></script>


<dnn:dnnjsinclude priority="59" id="model" runat="server" filepath="~/DesktopModules/ModisenseDashboard/Models/View.js"
    forceprovider="DnnFormBottomProvider" />
<dnn:dnnjsinclude priority="60" id="viewmodel" runat="server" filepath="~/DesktopModules/ModisenseDashboard/ViewModels/View.js"
    forceprovider="DnnFormBottomProvider" />
<dnn:dnnjsinclude priority="61" id="datepicker" runat="server" filepath="~/DesktopModules/ModisenseDashboard/Content/bootstrap/js/bootstrap-datetimepicker.min.js"
    forceprovider="DnnFormBottomProvider" />
<dnn:dnnjsinclude priority="62" id="bootstrap" runat="server" filepath="~/DesktopModules/ModisenseDashboard/Content/bootstrap/js/bootstrap.js"
    forceprovider="DnnFormBottomProvider" />
<dnn:dnnjsinclude priority="63" id="moment" runat="server" filepath="~/DesktopModules/ModisenseDashboard/Scripts/moment-langs.min.js"
    forceprovider="DnnFormBottomProvider" />


<div id="modissense" class="container">

    <!--  Login page -->

    <div class="row" data-bind="visible: !userLoggedIn()">
        <div class="span12 text-center">
            <h1>Είσοδος στο Modissense</h1>

            <a id="facebook" class="connect fb" href="#" data-bind="click: login">&nbsp;</a>

            <a id="twitter" class="connect tw" href="#" data-bind="click: login">&nbsp;</a>

            <a id="foursquare" class="connect fq" href="#" data-bind="click: login">&nbsp;</a>

        </div>
    </div>

    <!--  User account links-->

    <div class="row" data-bind="visible: userLoggedIn">

        <div class="span5">
            <ul class="nav nav-tabs">
                <li data-bind="css: { active: isActivePage('homePage')}">
                    <a href="#" data-bind="click: showPage.bind($data,'homePage')">Αρχική</a>
                </li>
                <li data-bind="css: { active: isActivePage('blogPage')}">
                    <a href="#" data-bind="click: showPage.bind($data,'blogPage')">Ιστολόγια</a></li>

            </ul>
        </div>

        <div class="span7 text-right">
            <a href="#" class="btn btn-primary" data-bind="click: showPage.bind($data,'accountPage')">
                <span>Διαχείριση Λογαριασμού</span></a>
            <asp:HyperLink ID="logoutLink" CssClass="btn btn-danger" runat="server">Log out</asp:HyperLink>
            <i class="icon-user"></i>
            UserName: <span data-bind="text :userName"></span>
        </div>
    </div>


    <!--  Main 2-column page -->

    <div class="row" data-bind="visible: isActivePage('homePage') || isActivePage('blogPage') ">
        <div class="span3">
            <div class="row">
                <div class="span3">
                    <h4>Σημεία Ενδιαφέροντος από χρήστη</h4>
                    <div class="row" data-bind="foreach:{ data: userConnections, as: 'userConnection' }">
                        <div class="span3">
                            <a class="btn btn-info" data-bind="text: userConnection.network,click: $parent.showFriends.bind($data,userConnection.network())"></a>
                            <span class="badge badge-success" data-bind="text: userConnection.friends().length"></span>
                        </div>
                        <div class="span3 nopadtop" style="display: none" data-bind="attr:{ 'id': 'conn_' + network()  }">
                            <select size="4" multiple="true" data-bind="options: userConnection.friends, optionsText:'name',selectedOptions:$root.chosenConnections.connections[userConnection.network()]">
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="span3">
                            <a id="addPoi" class="btn btn-primary" title="Προσθήκη Νέου Σημείου" data-bind="text: 'Add new POI',click: addPoi"></a>
                        </div>
                    </div>

                </div>
            </div>
            <div class="row" data-bind="visible: isActivePage('blogPage')">
                <div class="span3">
                    <div id="blogmap_canvas"></div>
                </div>
            </div>

        </div> <%--end span3 (side column) --%>
        <div class="span9">

            <!--  Pois  -->           
            <div class="row" data-bind="visible: isActivePage('homePage')">
                <div class="span9 white">
                     <h3>Σημεία Ενδιαφέροντος</h3>

                    <div class="alert alert-success" data-bind="visible: succesMessage">
                        <button class="close" type="button" data-bind="click: dismissSuccesMessage">&times;</button>
                        <span data-bind="text:succesMessageText"></span>
                    </div>
                    <div class="alert alert-error" data-bind="visible: errorMessage">
                        <button class="close" type="button" data-bind="click: dismissErrorMessage">&times;</button>                        
                        <span data-bind="text:errorMessageText"></span>

                    </div>
                    <p> Λέξεις κλειδιά:
                    <input size="100" style="width:45%" type="text" placeholder="Διαχωρίστε τις λέξεις με κόμμα" data-bind="value: searchKeywords" />
                    </p>                   
                        Από:
                         <div class="input-append date form_datetime">
                             <input size="16" type="text" value="" data-bind="value: startDate" />
                             <span class="add-on"><i class="icon-calendar"></i></span>
                         </div>
                        Έως:
                     <div class="input-append date form_datetime">
                         <input size="16" type="text" value="" data-bind="value: endDate" />
                         <span class="add-on"><i class="icon-calendar"></i></span>
                     </div>
                   <div class="dnnClear"></div>
                    Ταξινόμηση κατά: 
                    <div id="orderBySelection" class="btn-group" data-toggle="buttons-radio">
                        <button type="button" class="btn btn-info" value="hotness">Hotness</button>
                        <button type="button" class="btn btn-info" value="interest" >Interest</button>                        
                    </div>
                    <div class="dnnClear"></div>
                    <br />Από τους φίλους μου:
                    <input size="160" type="text" style="width:45%" readonly="true" placeholder="Επιλέξτε από την αριστερή στήλη" data-bind="value: chosenConnections.selectedUsernames()" />

                    <div class="pull-right">
                        <a class="btn btn-primary" data-bind="text: 'Αναζήτηση',click: getPois"></a>
                        <a class="btn btn-primary" data-bind="text: 'Τι υπάρχει γύρω μου',click: getNearestPois"></a>
                    </div>
                </div>
                 <div class="span9">
                     <div id="map_canvas"></div>
                </div>
            </div>

            <!--  Blog page  -->           
            <div class="row"  data-bind="visible: isActivePage('blogPage')">
                <div class="span9">
                    <h3>Ιστολόγια</h3>

                    <h5>Ημέρα</h5>

                    <div class="list-group" data-bind="foreach: blogCollection">           
                        <a href="#" class="list-group-item" data-bind="attr:{ 'id': date}, text: moment(date()).format('LL'), click: $parent.selectBlog,css:{ active : $parent.isActiveBlog($data)}"></a>
                    </div>

                    <div class="row">
                    <div class="span9"><h5>Περίληψη</h5></div>
                    <div class="span9 well" data-bind="text: BlogDescription"></div>                    
                    </div>

                    <h5>Λεπτομέρειες</h5>

                   <div data-bind="foreach: BlogDetails">
                        <div class="list-group-blog">
                            <div class="span4 muted"><small data-bind="text: 'Από: ' + moment(start()).format('LLLL')"></small></div>
                            <div class="span4 muted"><small data-bind="text: ' έως ' + moment(end()).format('LLLL')"></small></div>
                            <div class="span1 muted"><small data-bind="text: moment(end()).from(moment(start()),'minutes')"></small></div>
                            <div class="span9"><h3 data-bind="text: name"></h3> </div>
                            <div class="span7" data-bind="text: comment"></div>
                            <div class="span2">
                                 <a href="#" class="btn btn-warning pull-right">Edit</a><br /><br />
                                <a href="#" class="btn btn-danger pull-right">Delete</a>
                            </div>
                            <div class="span7">
                                Λέξεις κλειδιά:
                                <div class="float:left" data-bind="foreach: keywords">
                                    <span class='label label-info' data-bind="text: $data"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                  
                </div>
            </div>
        </div>   <!--end span9 -->
    </div>    <!--end row -->

    
    <!--  Account Management page -->

    <div class="row" data-bind="visible: isActivePage('accountPage')">
        <div class="span8 offset2 text-center">

            <h3>Συνδεδεμένα Social Networks</h3>

            <div data-bind="foreach: supportedNetworks">
                <div class="well">
                    <div class="row">
                        <div class="span2 social_net" data-bind="css: $data + '_icon'"></div>                        
                        <div class="span3 social_name" data-bind="text: $data"></div>
                        <div class="span3  text-right"> 
                                <div class="social_disconnect" data-bind="if: $root.checkNetwork($root.userNetworks(),$data)">
                                    <div class="network_connected"></div>
                                    <a href="#"><span>Αποσύνδεση</span></a>
                                </div>
                                <div class="social_connect" data-bind="ifnot: $root.checkNetwork($root.userNetworks(),$data)">
                                    <button class="btn btn-primary" data-bind="click: $root.connectNetwork"><span>Σύνδεση</span></button>
                                </div>  
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    </div>   

</div>
<!--end container -->

<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-bind="click: deleteMarker" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Προσθήκη Σημείου</h3>
    </div>
    <div class="modal-body">

        <div class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="inputTitle">Τίτλος</label>
                <div class="controls">
                    <input type="text" size="100" name="inputTitle" id="inputTitle" data-bind="value: poiTitle" required placeholder="Εισάγετε ένα σύντομο τίτλο" />
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="inputKeywords">Λέξεις κλειδιά</label>
                <div class="controls">
                    <input type="text" size="100" name="inputKeywords" data-bind="value: poiKeywords" placeholder="Διαχωρίστε τις λέξεις με κόμμα" id="inputKeywords" />
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="inputDescription">Περιγραφή</label>
                <div class="controls">
                    <textarea rows="3" cols="50" name="inputDescription" data-bind="value: poiDescription" placeholder="Σύντομη περιγραφή" id="inputDescription"> </textarea>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="inputPublicity">Να εμφανίζεται σε όλους?</label>
                <div class="controls">
                    <input type="checkbox" id="inputPublicity"  name="inputPublicity" data-bind="checked: poiPublicity">
                </div>
            </div>          
        </div>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn btn-inverse" data-dismiss="modal" aria-hidden="true" data-bind="click: deleteMarker" >Άκυρο</a>
        <a id="addNewPoiLink" href="#" class="btn btn-primary" data-dismiss="modal"  data-bind="click: addNewPoi">Αποθήκευση</a>
        <a id="updatePoiLink" href="#" class="btn btn-primary" data-dismiss="modal"  data-bind="click: updatePoi">Ενημέρωση</a>
    </div>
</div>


<div id="alertModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-body">       
            <button data-dismiss="modal" class="close" type="button">&times;</button>
            <h4 class="alert-heading">Επιβεβαίωση Διαγραφής</h4>
            <p>Θέλετε σίγουρα να διαγράψετε αυτό το σημείο?</p>
            <p>
                <a href="#" class="btn btn-inverse" data-dismiss="modal" aria-hidden="true">Άκυρο</a>
                <a href="#" class="btn btn-danger" data-dismiss="modal" data-bind="click: deletePoi">NAI</a>
           </p>
    </div> 
</div>

