/*
' Copyright (c) 2011 Gooddogs
'  All rights reserved.
' 
' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
' TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
' THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
' CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
' DEALINGS IN THE SOFTWARE.
' 
*/

using System;
using System.Text;
using DotNetNuke.Web.Client.ClientResourceManagement;

namespace Gooddogs.Modules.Dnn.ModisenseDashboard
{
    public class ModisenseDashboardModuleBase : DotNetNuke.Entities.Modules.PortalModuleBase
    {
        // with this base class you can provide any custom properties and methods 
        // that all your controls can access here, you can also access all the DNN 
        // methods and properties available off of portalmodulebase such as TabId, 
        // UserId, UserInfo, etc.

        private const string STR_ModulePathScript = "modulePathScript";

        // override the OnLoad event so that we can register all the
        // necessary scripts and initialize environmental variables
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            RegisterModulePath();
        }

        // Establish module environmental variables, and inject all of the required
        // script libraries for the project
        public void RegisterModulePath()
        {
            var _modulepath = DotNetNuke.Common.Globals.DesktopModulePath;

            var _scriptblock = new StringBuilder();
            _scriptblock.Append("<script>");
            _scriptblock.Append(String.Format("var _modulePath = \"{0}\";", _modulepath));
            _scriptblock.Append(String.Format("var _editURL = \"{0}\";", EditUrl()));
            _scriptblock.Append(String.Format("var _returnURL = \"{0}\";", DotNetNuke.Common.Globals.NavigateURL()));
            _scriptblock.Append(String.Format("var _serviceURL = \"{0}\";", _modulepath + "/ModisenseDashboard/service/ModisenseDashboarddataservice.svc"));
            _scriptblock.Append("</script>");

            // register scripts
            if (!Page.IsClientScriptBlockRegistered(STR_ModulePathScript))
            {
                Page.RegisterClientScriptBlock(
                    STR_ModulePathScript, _scriptblock.ToString());
            }

            // register javascript libraries
            ClientResourceManager.RegisterScript(Page, _modulepath + "/ModisenseDashboard/Scripts/dump.js", 50);
            ClientResourceManager.RegisterScript(Page, _modulepath + "/ModisenseDashboard/Scripts/knockout-2.3.0.js", 51);
            ClientResourceManager.RegisterScript(Page, _modulepath + "/ModisenseDashboard/Scripts/knockout.mapping-latest.js", 52);
            ClientResourceManager.RegisterScript(Page, _modulepath + "/ModisenseDashboard/Scripts/datajs-1.0.2.min.js", 52);
            ClientResourceManager.RegisterScript(Page, _modulepath + "/ModisenseDashboard/Scripts/jquery.dateFormat.js", 53);
            ClientResourceManager.RegisterScript(Page, _modulepath + "/ModisenseDashboard/Scripts/ModuleScriptBase.js", 59, "DnnFormBottomProvider");

        }
    }
}
