/*
' Copyright (c) 2004-2008 Gooddogs
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
using DotNetNuke.Services.Exceptions;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Modules.Actions;
using DotNetNuke.Services.Localization;
using DotNetNuke.Security;

namespace Gooddogs.Modules.Dnn.ModisenseDashboard
{

    /// -----------------------------------------------------------------------------
    /// <summary>
    /// The ViewHelloWorld class displays the content
    /// </summary>
    /// -----------------------------------------------------------------------------
    public partial class View : ModisenseDashboardModuleBase, IActionable
    {

        #region Event Handlers

        override protected void OnInit(EventArgs e)
        {
            InitializeComponent();
            base.OnInit(e);
        }

        private void InitializeComponent()
        {
            this.Load += new System.EventHandler(this.Page_Load);
        }


        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Page_Load runs when the control is loaded
        /// </summary>
        /// -----------------------------------------------------------------------------
        private void Page_Load(object sender, System.EventArgs e)
        {
            try
            {
                // LoadData();
                logoutLink.NavigateUrl = "http://" + PortalAlias.HTTPAlias;
            }
            catch (Exception exc) //Module failed to load
            {
                Exceptions.ProcessModuleLoadException(this, exc);
            }
        }

        #endregion

        #region Optional Interfaces

        public ModuleActionCollection ModuleActions
        {
            get
            {
                var Actions = new ModuleActionCollection();

                // About view
                Actions.Add(GetNextActionID(),
                    Localization.GetString("About", this.LocalResourceFile), "", "", "",
                    EditUrl("About"), false, SecurityAccessLevel.Edit, true, false);

                // Demo view
                Actions.Add(GetNextActionID(),
                    Localization.GetString("Demo", this.LocalResourceFile), "", "", "",
                    EditUrl("Demo"), false, SecurityAccessLevel.Edit, true, false);

                return Actions;
            }
        }

        #endregion

    }

}
