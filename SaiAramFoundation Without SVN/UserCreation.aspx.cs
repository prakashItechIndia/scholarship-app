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
    public partial class UserCreation : System.Web.UI.Page
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
                    if (intRoleId == 1 || intRoleId == 7)
                    {

                        if (!IsPostBack)
                        {
                            //Getting User Type
                            ddlUserType.DataSource = GetUserType();
                            ddlUserType.DataTextField = "Role_Name";
                            ddlUserType.DataValueField = "Id";
                            ddlUserType.DataBind();
                            ddlUserType.SelectedIndex = 0;
                            ds = BingGrid();
                            gvDisplayUserCreation.DataSource = ds;
                            gvDisplayUserCreation.DataBind();

                            lstsetting = getApplicationSetting();
                            if (lstsetting.Count > 0)
                            {
                                ScholarshipYearCode = lstsetting[0].ScholarshipYearCode;
                                ScholarshipYearName = lstsetting[0].ScholarshipYearName;
                                ScholarshipYearMailId = lstsetting[0].ScholarshipYearMailId;
                                ScholarshipYearReplyMailId = lstsetting[0].ScholarshipYearReplyMailId;
                                ScholarshipYearCCMailId = lstsetting[0].ScholarshipYearCCMailId;
                                ScholarshipYearBCCMailId = lstsetting[0].ScholarshipYearBCCMailId;
                                ScholarshipYearMailSubject = lstsetting[0].ScholarshipYearMailSubject;
                            }
                            else
                            {
                                lblError.Text = "Error in Page loading : ScholarshipYear Table Empty.....";
                            }
                        }
                    }
                    else
                    {
                        Response.Redirect("Login.aspx");
                    }


                    txtUserId.Enabled = true;
                }
                else
                {
                    gvDisplayUserCreation.EmptyDataText = "Your session expired..";
                    gvDisplayUserCreation.DataBind();
                    Response.Redirect("Login.aspx");
                }
            }
            catch (Exception ex)
            {
                lblError.Text = "Error in Page loading : " + ex.Message.ToString();
            }
        }
        protected void gvDisplayUserCreation_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            try
            {
                if (e.Row.RowType == DataControlRowType.DataRow)
                {
                    DataRowView drv = (DataRowView)e.Row.DataItem;

                    gvDisplayUserCreation.SelectedRowStyle.BackColor = Color.CadetBlue;
                    //this allows the user to select row by clicking any place on the girdview
                    e.Row.Attributes["onmouseover"] = "this.style.cursor='hand';this.originalstyle=this.style.backgroundColor;this.style.backgroundColor='#cccccc';";
                    e.Row.Attributes["onmouseout"] = "this.style.textDecoration='none';this.style.backgroundColor=this.originalstyle ;";
                    e.Row.Attributes["onclick"] = ClientScript.GetPostBackClientHyperlink(this.gvDisplayUserCreation, "Select$" + e.Row.RowIndex);

                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
            }
        }

        //Get User Type
        public DataSet GetUserType()
        {
            string strQuery;
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " Id,Role_Name from T_ROLES where Is_Active=1 order by  Role_Name";
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


        public DataSet BingGrid()
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = "Select";
                strQuery = strQuery + " U.ID,U.User_ID,U.Password,R.Role_Name,U.User_Name,";
                strQuery = strQuery + " U.Mobile_Number,U.EMail_Id,U.Role_Id,U.IsActive,";
                strQuery = strQuery + " Case U.IsActive When '0' Then 'InActive' When '1' Then 'Active' Else 'false' End As ActiveStatus";
                strQuery = strQuery + " FROM TBL_USERMASTER U ";
                strQuery = strQuery + " left outer join T_ROLES R on U.Role_Id=R.Id";
                strQuery = strQuery + " where R.Is_Active=1 and U.IsDeleted=0 ";

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
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                objCommon = null;
                connSql = null;
                strQuery = null;
            }
        }

        protected void gvDisplayUserCreation_SelectedIndexChanged(object sender, EventArgs e)
        {
            string strDecryptpsw = "";
            string strDryPsw = "";
            objCommon = new clsCommon();
            try
            {
                hdUserId.Value = ((Label)gvDisplayUserCreation.Rows[gvDisplayUserCreation.SelectedIndex].FindControl("lblUserId")).Text;
                if (hdUserId.Value.Length > 0)
                {
                    ddlUserType.SelectedValue = ((Label)gvDisplayUserCreation.Rows[gvDisplayUserCreation.SelectedIndex].FindControl("lblRoleID")).Text;
                    txtName.Text = ((Label)gvDisplayUserCreation.Rows[gvDisplayUserCreation.SelectedIndex].FindControl("lblUserName")).Text;
                    txtUserId.Text = ((Label)gvDisplayUserCreation.Rows[gvDisplayUserCreation.SelectedIndex].FindControl("lblUserId")).Text;
                    txtMobile.Text = ((Label)gvDisplayUserCreation.Rows[gvDisplayUserCreation.SelectedIndex].FindControl("lblMobile_Number")).Text;
                    txtEmailID.Text = ((Label)gvDisplayUserCreation.Rows[gvDisplayUserCreation.SelectedIndex].FindControl("lblEmail")).Text;
                    ddlActive.SelectedItem.Text = ((Label)gvDisplayUserCreation.Rows[gvDisplayUserCreation.SelectedIndex].FindControl("lblActiveStatus")).Text;
                    btnSave.Text = "Update";
                    txtUserId.Enabled = false;
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }

        //Get Check User Name

        public string CheckUserId(string strUser)
        {
            string strCheckUsername;
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            string strQuery = null;
            clsApproval objApproval = new clsApproval();

            try
            {
                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand();
                //SqlCmd.CommandText = " Select User_ID from TBL_USERMASTER where User_ID='"+ strUser+"' ";
                //SqlCmd.CommandType = CommandType.Text;
                //SqlCmd.Connection = sqlConn;
                strQuery = "";
                strQuery += "Select User_ID from TBL_USERMASTER where User_ID='" + strUser + "'";
                da = new SqlDataAdapter(strQuery, sqlConn);
                da.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    strCheckUsername = ds.Tables[0].Rows[0]["User_ID"].ToString();
                }
                else
                {
                    strCheckUsername = "";
                }
                return strCheckUsername;

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

        protected void btnSave_Click(object sender, EventArgs e)
        {

            lock (SubmitLock)
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
                string strCheckUser;
                try
                {
                    lblError.Text = "";

                    int intStatus = Convert.ToInt32(ddlActive.SelectedValue);
                    strEncryptPassword = objCommon.Encryptdata(txtPassword.Text.Trim().ToString());

                    if (sqlConn.State != ConnectionState.Open)
                        sqlConn.Open();
                    SqlCmd = new SqlCommand();

                    if (btnSave.Text == "Save")
                    {
                        strCheckUser = CheckUserId(txtUserId.Text.Trim().ToString());
                        if (strCheckUser == "")
                        {
                            SqlCmd.CommandText = "USP_SAVE_USER_Master";
                            SqlCmd.CommandType = CommandType.StoredProcedure;
                            SqlCmd.Parameters.Add(new SqlParameter("@UserType", ddlUserType.SelectedValue.ToString()));
                            SqlCmd.Parameters.Add(new SqlParameter("@Name", txtName.Text.Trim().ToString()));
                            SqlCmd.Parameters.Add(new SqlParameter("@UserName", txtUserId.Text.Trim().ToString()));
                            SqlCmd.Parameters.Add(new SqlParameter("@Password", strEncryptPassword));
                            SqlCmd.Parameters.Add(new SqlParameter("@MobileNumber", txtMobile.Text.Trim().ToString()));
                            SqlCmd.Parameters.Add(new SqlParameter("@EMail", txtEmailID.Text.Trim().ToString()));
                            SqlCmd.Parameters.Add(new SqlParameter("@IsActive", intStatus));

                            SqlCmd.Connection = sqlConn;
                            SqlCmd.ExecuteNonQuery();

                            if (sqlConn.State != ConnectionState.Closed)
                                sqlConn.Close();
                            sqlConn.Dispose();
                            SqlCmd.Dispose();

                            ds = BingGrid();
                            gvDisplayUserCreation.DataSource = ds;
                            gvDisplayUserCreation.DataBind();

                            //Update history
                            string strText = txtName.Text.Trim().ToString() + " has registered successfully!...";
                            objApproval.UpdateHistory(txtUserId.Text.Trim(), strText, "New User Creation", Session["User_ID"].ToString());

                            dvSuccess.Visible = true;
                            lblSuccess.Text = "New User has been registered Successfully ";

                            //Mail function
                            String strToAddress = txtEmailID.Text.Trim().ToString();
                            String strFromAddress = ScholarshipYearMailId;
                            String strSubject = ScholarshipYearMailSubject + ": New user account has been created for you! ";
                            String strBodyTxt = "<html><body><span style='font-family:Tahoma; font-size:small'>";
                            strBodyTxt = strBodyTxt + "Dear <b><i>" + txtName.Text.Trim().ToString() + "</i></b>,<br><br>";
                            strBodyTxt = strBodyTxt + "We are pleased to inform you that, we have created new user account for you to access <b>LEO MUTHU Scholarship</b>.<br/> <br/> Your User Name : <b>" + txtUserId.Text.Trim().ToString() + "</b><br/> Password : <b>" + txtPassword.Text.Trim().ToString();

                            strBodyTxt = strBodyTxt + "<br><br><b>Administration Officer</b><br>LEO MUTHU Scholarship(AUO)Aram Foundation, Chennai.</span></body></html>";
                           // MailMessage message = new MailMessage(strFromAddress, strToAddress, strSubject, strBodyTxt);
                           // message.ReplyTo = new MailAddress(ScholarshipYearReplyMailId);

                            //Bccs
                            List<string> Bccs = new List<string>();
                            Bccs = ScholarshipYearBCCMailId.Split(',').ToList();
                            //foreach (string BCCemail in Bccs)
                            //{
                            //    message.Bcc.Add(BCCemail);
                            //}
                            //message.Bcc.Add("Ladmission2013@sairamgroup.in");
                            //message.Bcc.Add("test@itech-india.com");                
                            //s message.Attachments.Add(attFiles);

                            //message.IsBodyHtml = true;
                            //SmtpClient emailClient = new SmtpClient();
                            //emailClient.Host = ConfigurationManager.AppSettings["MailSmtp"].ToString();
                            //emailClient.Port = 25;
                            //emailClient.Credentials = new System.Net.NetworkCredential("donotreply@itechind.com", "donotreply123");

                            //emailClient.Send(message);

                            clsEmail.SendMail(strFromAddress, strToAddress, ScholarshipYearReplyMailId, strSubject, strBodyTxt, null, Bccs, null);

                            SqlCmd.Dispose();
                            SqlConn.Close();
                            SqlConn = null;
                            ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('User has created successfully..');", true);
                            Clear();
                        }
                        else
                        {
                            //string strMessage = "closeOk('Same Username already exist try some other username ');";
                            //ScriptManager.RegisterStartupScript(Page, Page.GetType(), Guid.NewGuid().ToString(), strMessage, true);
                            ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('Same Username already exist.! Try some other username');", true);

                        }
                    }
                    else if (btnSave.Text == "Update")
                    {
                        SqlCmd.CommandText = "USP_Update_USER_Master";
                        SqlCmd.CommandType = CommandType.StoredProcedure;
                        SqlCmd.Parameters.Add(new SqlParameter("@UserType", ddlUserType.SelectedValue.ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Name", txtName.Text.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@UserName", txtUserId.Text.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Password", strEncryptPassword));
                        SqlCmd.Parameters.Add(new SqlParameter("@MobileNumber", txtMobile.Text.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@EMail", txtEmailID.Text.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@IsActive", intStatus));

                        SqlCmd.Connection = sqlConn;
                        SqlCmd.ExecuteNonQuery();

                        if (sqlConn.State != ConnectionState.Closed)
                            sqlConn.Close();
                        sqlConn.Dispose();
                        SqlCmd.Dispose();

                        ds = BingGrid();
                        gvDisplayUserCreation.DataSource = ds;
                        gvDisplayUserCreation.DataBind();

                        //Update history
                        string strText = txtName.Text.Trim().ToString() + " has Updated successfully!...";
                        objApproval.UpdateHistory(txtUserId.Text.Trim(), strText, "Update Proccess", Session["User_ID"].ToString());

                        dvSuccess.Visible = true;
                        lblSuccess.Text = "User has been Updated Successfully ";
                        ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('User has been updated successfully');", true);
                        Clear();
                    }

                }
                catch (Exception ex)
                {
                    lblError.Text = ex.Message.ToString();

                }
                finally
                {
                    if (sqlConn.State != ConnectionState.Closed)
                        sqlConn.Close();
                    sqlConn.Dispose();
                }
            }
        }

        public void Clear()
        {
            txtName.Text = "";
            txtUserId.Text = "";
            txtPassword.Text = "";
            txtEmailID.Text = "";
            txtMobile.Text = "";
            btnSave.Text = "Save";
            dvSuccess.Visible = false;
            ddlUserType.SelectedIndex = 0;
            ddlActive.SelectedIndex = 0;
        }

        protected void btnDelete_Click(object sender, EventArgs e)
        {
            objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;

            DataTable dsData = new DataTable();
            DataSet ds = new DataSet();
            clsApproval objApproval = new clsApproval();
            try
            {
                lblError.Text = "";

                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand();

                SqlCmd.CommandText = "USP_Deleted_USER_Master";
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Parameters.Add(new SqlParameter("@UserId", txtUserId.Text.Trim().ToString()));
                SqlCmd.Connection = sqlConn;
                SqlCmd.ExecuteNonQuery();

                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
                sqlConn.Dispose();
                SqlCmd.Dispose();

                ds = BingGrid();
                gvDisplayUserCreation.DataSource = ds;
                gvDisplayUserCreation.DataBind();

                //Update history
                string strText = txtName.Text.Trim().ToString() + " has Deleted successfully!...";
                objApproval.UpdateHistory(txtUserId.Text.Trim(), strText, "Delete User", Session["User_ID"].ToString());

                dvSuccess.Visible = true;
                lblSuccess.Text = " User has been Deleted Successfully ";

            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
            finally
            {
                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
                sqlConn.Dispose();
                Clear();
            }
        }

        public List<ClsT_ScholarshipYearSetting> getApplicationSetting()
        {
            string strQuery = "";
            objCommon = new clsCommon();

            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            List<ClsT_ScholarshipYearSetting> lstScholarshipYearTable = new List<ClsT_ScholarshipYearSetting>();
            try
            {
                strQuery = strQuery + " select ScholarshipYear_Id, ScholarshipYear_Code, ScholarshipYear_Name,";
                strQuery = strQuery + " Scholarship_MailId, Scholarship_ReplyTo_MailId, Scholarship_CC_MailId,";
                strQuery = strQuery + " Scholarship_BCC_MailId, Scholarship_Mail_Subject, Status,";
                strQuery = strQuery + " Delete_Flag, Created_By, Created_Date,";
                strQuery = strQuery + " Modified_By, Modified_Date";
                strQuery = strQuery + " From T_Scholarship_Year";
                strQuery = strQuery + " WHERE Status = 'true'";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);


                lstScholarshipYearTable = (from DataRow row in dsData.Tables[0].Rows
                                           select new ClsT_ScholarshipYearSetting
                                           {
                                               ScholarshipYearCode = row["ScholarshipYear_Code"].ToString(),
                                               ScholarshipYearName = row["ScholarshipYear_Name"].ToString(),
                                               ScholarshipYearMailId = row["Scholarship_MailId"].ToString(),
                                               ScholarshipYearBCCMailId = row["Scholarship_BCC_MailId"].ToString(),
                                               ScholarshipYearMailSubject = row["Scholarship_Mail_Subject"].ToString(),
                                               ScholarshipYearReplyMailId = row["Scholarship_ReplyTo_MailId"].ToString(),
                                               ScholarshipYearCCMailId = row["Scholarship_CC_MailId"].ToString(),

                                           }).ToList();



                return lstScholarshipYearTable;
            }
            catch (Exception ex)
            {

                return lstScholarshipYearTable;
            }


        }
    }

}



