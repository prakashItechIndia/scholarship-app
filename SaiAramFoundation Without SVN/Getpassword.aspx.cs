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
using System.Drawing;
using System.Net.Mail;

namespace SaiAramFoundation
{
    public partial class Getpassword : System.Web.UI.Page
    {
        Object SubmitLock = new Object();
        clsCommon objCommon = new clsCommon();
        List<ClsT_ScholarshipYearSetting> lstsetting = new List<ClsT_ScholarshipYearSetting>();
        public static string ScholarshipYearCode, ScholarshipYearName, ScholarshipYearMailId, ScholarshipYearReplyMailId, ScholarshipYearCCMailId, ScholarshipYearBCCMailId, ScholarshipYearMailSubject;

        clsApproval objApproval = new clsApproval();

        protected void Page_Load(object sender, EventArgs e)
        {
            DataSet ds = new DataSet();
            try
            {
                if (Session["Roles_Id"] != null && Session["User_ID"] != null)
                {
                    lblUser.Text = "Welcome Mr/Miss : " + Session["User_Name"].ToString();
                    int intRoleId = Convert.ToInt32(Session["Roles_Id"]);
                    if (intRoleId == 1)
                    {
                        if (!IsPostBack)
                        {
                            //Getting User Type
                            ddlUserName.DataSource = GetUserName();
                            ddlUserName.DataTextField = "User_ID";
                            ddlUserName.DataValueField = "ID";
                            ddlUserName.DataBind();
                            ddlUserName.SelectedIndex = 0;
                        }
                    }
                    else
                    {
                        Response.Redirect("Login.aspx");
                    }

                }
                else
                {
                    Response.Redirect("Login.aspx");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get User Name
        public DataSet GetUserName()
        {
            string strQuery;
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " ID,User_ID from TBL_USERMASTER where IsActive=1";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                return dsData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                dtData = null;
                strQuery = null;
                Params = null;
                dsData = null;
            }
        }

        //ddlUserName_SelectedIndexChanged

        protected void ddlUserName_SelectedIndexChanged(object sender, EventArgs e)
        {
            string strPassword;
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            string strQuery = null;
            clsApproval objApproval = new clsApproval();
            string strEncryptPassword = "";
            try
            {
                string strUserName = ddlUserName.SelectedItem.Text;

                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand();
                //SqlCmd.CommandText = " Select User_ID from TBL_USERMASTER where User_ID='"+ strUser+"' ";
                //SqlCmd.CommandType = CommandType.Text;
                //SqlCmd.Connection = sqlConn;
                strQuery = "";
                strQuery += "Select User_ID,Password from TBL_USERMASTER where User_ID='" + strUserName + "'";
                da = new SqlDataAdapter(strQuery, sqlConn);
                da.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    strPassword = ds.Tables[0].Rows[0]["Password"].ToString();
                }
                else
                {
                    strPassword = "";
                }
                strEncryptPassword = objCommon.Decryptdata(strPassword);

                lblPassword.Text = strEncryptPassword;

                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
                sqlConn.Dispose();
                SqlCmd.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
