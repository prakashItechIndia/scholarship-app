using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;

namespace SaiAramFoundation
{
    public partial class AdminMaster : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["User_Login"] == null)
            {
                lblUserName.Text = "Welcome to Sairam Group..";
            }
            else
            {
                lblUserName.Text = "You are logged in as : " + "<span style='color: #CC3300;'>" + Session["User_Login"].ToString() + "</span>";
            }
        }
    }
}
