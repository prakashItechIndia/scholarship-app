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
    public partial class ChangePassword : System.Web.UI.Page
    {

        Object SubmitLock = new Object();
        clsCommon objCommon = new clsCommon();
        clsApproval objApproval = new clsApproval();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["Roles_Id"] != null && Session["User_ID"] != null)
            {
                int intRoleId = Convert.ToInt32(Session["Roles_Id"]);
                if (intRoleId == 1 || intRoleId == 7 || intRoleId == 3 || intRoleId == 4 || intRoleId == 5 || intRoleId == 6 || intRoleId == 8)
                {
                    lblUser.Text = "Welcome Mr/Miss : " + Session["User_Name"].ToString();
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

        public string CheckCurrentPassword(string strPassword, string strUsername)
        {
            string strCheckPassword = "";
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            string strQuery = null;
            clsApproval objApproval = new clsApproval();
            string EncryptPassword = "";

            try
            {
                EncryptPassword = objCommon.Encryptdata(strPassword);

                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand();

                strQuery = "";
                strQuery += "Select Password from TBL_USERMASTER where Password='" + EncryptPassword + "' and User_ID='" + strUsername + "'";
                da = new SqlDataAdapter(strQuery, sqlConn);
                da.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    strCheckPassword = ds.Tables[0].Rows[0]["Password"].ToString();
                }
                else
                {
                    strCheckPassword = "";
                }
                return strCheckPassword;

                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
                sqlConn.Dispose();
                SqlCmd.Dispose();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

            }
        }

        protected void btnChange_Click(object sender, EventArgs e)
        {
            objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlConnection SqlConn = new SqlConnection(strConn);
            String strEncryptPassword;
            DataTable dsData = new DataTable();
            DataSet ds = new DataSet();
            clsApproval objApproval = new clsApproval();
            string CheckPassword = null;

            try
            {
                string UserId = Convert.ToString(Session["User_ID"]);
                CheckPassword = CheckCurrentPassword(txtCurrentPassword.Text.Trim().ToString(), UserId);
                string DecryptPassword = objCommon.Decryptdata(CheckPassword);
                strEncryptPassword = objCommon.Encryptdata(txtConfirmPassword.Text.Trim().ToString());

                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand();

                if (DecryptPassword == txtCurrentPassword.Text.Trim())
                {
                    SqlCmd.CommandText = "USP_ChangePassword";
                    SqlCmd.CommandType = CommandType.StoredProcedure;
                    SqlCmd.Parameters.Add(new SqlParameter("@ConfirmPassword", strEncryptPassword));
                    SqlCmd.Parameters.Add(new SqlParameter("@UserId", UserId));
                    SqlCmd.Connection = sqlConn;
                    SqlCmd.ExecuteNonQuery();
                    if (sqlConn.State != ConnectionState.Closed)
                        sqlConn.Close();
                    sqlConn.Dispose();
                    SqlCmd.Dispose();

                    dvSuccess.Visible = true;
                    lblSuccess.Text = "Password has been Changed Successfully ";
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('Current password is wrong.! Please enter vaild password ');", true);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
