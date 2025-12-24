using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.Sql;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using Telerik.Web.UI;
using System.Text;
using Sairam_RegularUG.Classes;
using SaiAramFoundation.Classes;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;

namespace SaiAramFoundation
{
    public partial class Report : System.Web.UI.Page
    {

        private System.Object lckThis = new System.Object();
        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet dsData = null;
        SqlDataAdapter da = null;
        string strQuery = "";
        string InvaildType = "";
        clsCommon objCommon = null;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                int intRoleId = Convert.ToInt32(Session["Roles_Id"]);
                if (intRoleId == 1 || intRoleId == 4 || intRoleId == 7 || intRoleId == 8)
                {
                    lblUser.Text = "Welcome Mr/Miss : " + Session["User_Name"].ToString();
                }
                else
                {
                    Response.Redirect("Login.aspx");
                }

            }
        }
    }
}
