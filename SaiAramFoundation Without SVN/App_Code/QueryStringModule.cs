using SaiAramFoundation.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SaiAramFoundation.App_Code
{

    public class QueryStringModule : IHttpModule
    {

        #region IHttpModule Members

        public void Dispose()
        {
            // Nothing to dispose
        }

        public void Init(HttpApplication context)
        {
            context.BeginRequest += new EventHandler(context_BeginRequest);
        }

        #endregion



        void context_BeginRequest(object sender, EventArgs e)
        {
            HttpContext context = HttpContext.Current;
            var request = context.Request;

            string requestedUrl = context.Request.Url.AbsolutePath; // Get the absolute path of the URL
            string decodedUrl = Uri.UnescapeDataString(requestedUrl); // Decode the URL


            String clientMachineIP = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(clientMachineIP))
            {
                clientMachineIP = context.Request.ServerVariables["REMOTE_ADDR"];
            }
            string IPAddress = clientMachineIP;

            clsApproval obj = new clsApproval();
            obj.ErrorLog("","QueryStringModule", "context Begin Request - " + request.RawUrl + "PhysicalPath -" + request.PhysicalPath + " ApplicationPath-" + request.ApplicationPath + " PathInfo-" + request.PathInfo + " AppRelativeCurrentExecutionFilePath - " + request.AppRelativeCurrentExecutionFilePath, IPAddress);
            




        }



    }

}