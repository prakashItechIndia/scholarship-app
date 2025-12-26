using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SaiAramFoundation
{
    public partial class DocumentVerification : System.Web.UI.Page
    {

        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet dsData = null;
        SqlDataAdapter da = null;

        string strQuery = "";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["Roles_Id"] != null && Session["User_ID"] != null)
            {
                if (!IsPostBack)
                {
                    int intRoleId = Convert.ToInt32(Session["Roles_Id"]);
                    if (intRoleId == 1 || intRoleId == 7 || intRoleId == 5 || intRoleId == 8)
                    {
                        lblUser.Text = "Welcome Mr/Miss : " + Session["User_Name"].ToString();
                    }
                    else
                    {
                        Response.Redirect("Login.aspx");
                    }
                    fncBindAcYear();
                }
            }
            else
            {
                Response.Redirect("Login.aspx");
            }
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            try
            {

            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
        }

        // Bind Acyear 

        public void fncBindAcYear()
        {
            cmd = new SqlCommand();
            dsData = new DataSet();
            try
            {
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.CommandText = "UPS_Get_AcYear";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = con;
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);
                ddAcyear.DataSource = dsData.Tables[0];
                ddAcyear.DataTextField = dsData.Tables[0].Columns["ScholarshipYear_Code"].ToString();
                ddAcyear.DataValueField = dsData.Tables[0].Columns["ScholarshipYear_Id"].ToString();
                ddAcyear.DataBind();
                //ddAcyear.Items.Insert(0, "--Select--");
            }
            catch (Exception ex)
            {

                throw;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                {
                    con.Close();
                }
                cmd = null;
                dsData = null;

            }
        }
    }
}
