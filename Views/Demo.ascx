<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Demo.ascx.cs" Inherits="Gooddogs.Modules.Dnn.ModisenseDashboard.Views.Demo" %>

<%@ Register TagPrefix="dnn" Namespace="DotNetNuke.Web.Client.ClientResourceManagement"
    Assembly="DotNetNuke.Web.Client" %>

<dnn:dnnjsinclude priority="60" id="viewmodel" runat="server" filepath="~/DesktopModules/ModisenseDashboard/ViewModels/Demo.js"
    forceprovider="DnnFormBottomProvider" />
	
<div class="container span-24">

    <div class="mbInfo">INSTRUCTIONS: This demo page uses the Blueprint.css Framework to control the module output.
    Change the First and Last name in the input boxes and as you exit each text field notice how the Greeting text below changes
    automatically. This is accomplished by using Knockout.js two-way data binding. Clicking the button will popup an
    alert box using the .save method on the Knockout.js viewModel defined in the ViewModel folder.</div>

    <div class="column span-24 last">
    
        <div class="mbClear">
        Enter a First Name <input type="text" data-bind="value: firstName" /><br />
        Enter a Last Name <input type="text" data-bind="value: lastName" />
        <button data-bind="click: save">Click me</button>
        </div>
    
    </div>

    <div class="column span-6">
        <div class="mbClear">
            <span data-bind="text: greet"></span>
        </div>
    </div>

    <div class="column span-6"><div class="mbError">Error!</div></div>

    <div class="column span-6"><div class="mbWarning">Warning</div></div>

    <div class="column span-6 last"><div class="mbSuccess">Congratulations!</div></div>

    <div class="column span-24 last" style="text-align: right;"><a href="<%= Page.ResolveUrl("DesktopModules/ModisenseDashboard/Mobile/ModisenseDashboard.htm") %>">Mobile version</a></div>

</div>