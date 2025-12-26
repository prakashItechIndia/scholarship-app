using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml.Linq;
using System.Text;

namespace SaiAramFoundation
{
    public partial class success : System.Web.UI.Page
    {
        StringBuilder sbQuery = new StringBuilder();
        protected void Page_Load(object sender, EventArgs e)
        {
            string baseURL = ConfigurationManager.AppSettings["LMSBaseUrl"].ToString();
            if (Request.QueryString["id"] != null)
            {
                sbQuery.Append(@"<a href='" + baseURL + "Registered_Pdf_ScholerShip/" + Request.QueryString["id"].ToString() + ".pdf'" + "' target='_blank'>Click Here</a>&nbsp; to view your registration details.");
                tdClick.InnerHtml = sbQuery.ToString();
            }
            else
            {
                Response.Redirect("ScholarshipRegistration.aspx", false);
            }
        }
    }
}
