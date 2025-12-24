using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using SaiAramFoundation;
using SaiAramFoundation.Classes;

namespace SaiAramFoundation
{
    public partial class History : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            clsApproval objApproval = new clsApproval();
            DataSet dsData = new DataSet();
            try
            {
                if (Session["User_ID"] != null && Session["Roles_Id"] != null)
                {
                    if (Request.QueryString["applnno"] != null)
                    {
                        int intRoleId = Convert.ToInt32(Session["Roles_Id"]);
                        lblHeading.Text = "History against application number : " + Request.QueryString["applnno"].ToString();
                        if (intRoleId == 6)
                        {
                            dsData = objApproval.DisplayEnquiryHistory(Request.QueryString["applnno"].ToString());
                        }
                        else
                        {
                            dsData = objApproval.DisplayHistory(Request.QueryString["applnno"].ToString());
                        }
                        if (dsData.Tables[0].Rows.Count > 0)
                        {
                            gvHistory.DataSource = dsData;
                            gvHistory.DataBind();
                        }
                        else
                        {
                            gvHistory.EmptyDataText = "No Data Available..";
                        }
                    }
                    else
                    {
                        Response.Write("<script>window.open('Login.aspx',target='_top');</script>");
                        //Response.Redirect("Login.aspx", false);
                    }
                }
                else
                {
                    Response.Write("<script>window.open('Login.aspx',target='_top');</script>");
                    //Response.Redirect("Login.aspx", false);
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
            finally
            {

            }
        }
    }
}
