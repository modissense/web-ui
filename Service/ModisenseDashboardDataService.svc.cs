using System;
using System.Collections.Generic;
using System.Data.Services;
using System.Data.Services.Common;
using System.Linq;
using System.ServiceModel.Web;
using System.Web;
using System.Runtime.Serialization;
using System.Reflection;
using System.Web.Script.Serialization;
using DotNetNuke.Services.Localization;
using System.Data.Objects;
using DotNetNuke.Common.Utilities;
using System.Data.SqlClient;
using System.Configuration;
using System.Data.EntityClient;

namespace Gooddogs.Modules.Dnn.ModisenseDashboard.Service
{
    public class ModisenseDashboardDataService : DataService<Data.ModisenseDashboardContainer>
    {
        // This method is called only once to initialize service-wide policies.
        public static void InitializeService(DataServiceConfiguration config)
        {
            // TODO: set rules to indicate which entity sets and service operations are visible, updatable, etc.
            // Examples:
            config.SetEntitySetAccessRule("*", EntitySetRights.All);
            config.SetServiceOperationAccessRule("*", ServiceOperationRights.AllRead);
            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V2;
        }

        protected override Data.ModisenseDashboardContainer CreateDataSource()
        {
            return CreateModuleDataSource();
        }

        [WebGet]
        public string GetVersion()
        {
            var ver = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
            return String.Format("{0}.{1}.{2}.{3}",
                ver.Major, ver.Minor, ver.Build, ver.Revision);
        }

        [WebGet]
        public string GetResourceString(string key)
        {
            return Localization.GetString(key, "/DesktopModules/ModisenseDashboard/Views/App_LocalResources/SharedResources.resx");
        }

        private Data.ModisenseDashboardContainer CreateModuleDataSource()
        {
            try
            {
                // first check the cache, we only want to do this once
                const string STR_ModisenseDashboard_EF_ConnectionString_Key = "ModisenseDashboard_EF_ConnectionString_Key";

                if (DataCache.GetCache(STR_ModisenseDashboard_EF_ConnectionString_Key) == null)
                {
                    // if not in the cache, construct the entity connection and cache it
                    using (var SiteSQLConnection = new SqlConnection(
                        ConfigurationManager.ConnectionStrings["SiteSQLServer"].ConnectionString))
                    {
                        //check if the connection string has integrated security enabled
                        {
                            bool isIntergratedEnabled = SiteSQLConnection.ConnectionString.Contains("Integrated Security");

                            //Build the Entity Framework connection string from the derived settings
                            var NewSQLConnectionString = new SqlConnectionStringBuilder();
                            var _with1 = NewSQLConnectionString;
                            _with1.DataSource = SiteSQLConnection.DataSource;
                            _with1.InitialCatalog = SiteSQLConnection.Database;
                            if (!isIntergratedEnabled)
                            {
                                string _uid, _pwd = string.Empty;
                                GetUserCredentialsFromConfigFile(SiteSQLConnection.ConnectionString, out _uid, out _pwd);
                                _with1.UserID = _uid;
                                _with1.Password = _pwd;
                            }
                            else
                            {
                                _with1.IntegratedSecurity = isIntergratedEnabled;
                                //.UserInstance = True
                            }
                            _with1.MultipleActiveResultSets = true;

                            var EFConnectionStringBuilder = new EntityConnectionStringBuilder();
                            var _with2 = EFConnectionStringBuilder;
                            _with2.Provider = "System.Data.SqlClient";
                            _with2.ProviderConnectionString = NewSQLConnectionString.ToString();
                            _with2.Metadata = "res://*/Data.ModisenseDashboard.csdl|res://*/Data.ModisenseDashboard.ssdl|res://*/Data.ModisenseDashboard.msl";

                            DataCache.SetCache(STR_ModisenseDashboard_EF_ConnectionString_Key, EFConnectionStringBuilder.ToString());
                        }

                    }
                }

                // now establish the connection from the cache
                return new Data.ModisenseDashboardContainer(new EntityConnection(DataCache.GetCache(STR_ModisenseDashboard_EF_ConnectionString_Key).ToString()));
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        private static void GetUserCredentialsFromConfigFile(string strConn, out string userid, out string password)
        {
            var s = new SqlConnectionStringBuilder(strConn);
            userid = s.UserID;
            password = s.Password;
            return;
        }
    }
}
