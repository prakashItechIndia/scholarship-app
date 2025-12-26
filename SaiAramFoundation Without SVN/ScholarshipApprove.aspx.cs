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
using System.Data.SqlClient;
using SaiAramFoundation.Classes;


namespace SaiAramFoundation
{
     
    public partial class ScholarshipApprove : System.Web.UI.Page
    {

        private System.Object lckThis = new System.Object();
        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet dsData = null;
        SqlDataAdapter da = null;
        string strQuery = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (Session["User_ID"] != null && Session["Roles_Id"] != null)
                {
                    if (!IsPostBack)
                    {
                        PopulateData();
                    }
                }
                else
                {
                    Response.Redirect("Login.aspx");
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }

        }

        public void PopulateData()
        {

            cmd = new SqlCommand();
            dsData = new DataSet();
            try
            {

                lblApplnNo.Text = Request.QueryString["applnno"].ToString();
                string scholarshipId = Request.QueryString["scholarshipId"].ToString();
                int intRoleId = Convert.ToInt32(Session["Roles_Id"]);

                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }

                cmd.CommandText = "USP_GET_DATA_BY_APPLICATION_NO";
                cmd.CommandType = CommandType.StoredProcedure;
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.Connection = con;
                cmd.Parameters.Add(new SqlParameter("@Application_Id", Request.QueryString["applnno"].ToString().Trim().ToString()));
                cmd.Parameters.Add(new SqlParameter("@Process_Type", "Approve"));
                cmd.Parameters.Add(new SqlParameter("@Scholarship_Id", scholarshipId));

                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    txtScholarshipId.Text = dsData.Tables[0].Rows[0]["Scholarship_Id"].ToString();
                    lblSchlorshipYear.Text = dsData.Tables[0].Rows[0]["ScholarshipYear_Name"].ToString();
                    string strRemark = dsData.Tables[0].Rows[0]["Remark_Reject"].ToString();
                    lblName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                    lblApplnNo.Text = dsData.Tables[0].Rows[0]["Application_Id"].ToString();
                    lblDOB.Text = dsData.Tables[0].Rows[0]["Date_Of_Birth"].ToString();
                    //lbl12std.Text = dsData.Tables[0].Rows[0]["12Percent"].ToString();
                    lblFatherName.Text = dsData.Tables[0].Rows[0]["Father_Name"].ToString();
                    lblFatherOccupation.Text = dsData.Tables[0].Rows[0]["Father_Occupation"].ToString();
                    if (dsData.Tables[0].Rows[0]["Scholarship_For"].ToString() == "School")
                    {
                        lblScholarShipSeekingFor.Text = dsData.Tables[0].Rows[0]["Class_Studying"].ToString();
                    }
                    else if (dsData.Tables[0].Rows[0]["Scholarship_For"].ToString() == "College")
                    {
                        lblScholarShipSeekingFor.Text = dsData.Tables[0].Rows[0]["Degree_Type"].ToString() + "-" + dsData.Tables[0].Rows[0]["Degree"].ToString();
                    }
                    else if (dsData.Tables[0].Rows[0]["Scholarship_For"].ToString() == "Research")
                    {
                        lblScholarShipSeekingFor.Text = dsData.Tables[0].Rows[0]["Ph_D"].ToString();
                    }
                    lblSuggestedAmount.Text = dsData.Tables[0].Rows[0]["Scholarship_Suggest_Amount"].ToString();
                    lblRequestedAmount.Text = dsData.Tables[0].Rows[0]["Request_Amount"].ToString();
                    txtRemark.Text = dsData.Tables[0].Rows[0]["Remark_Reject"].ToString();
                }
                else
                {
                    lblError.Text = "Invalid Application Number";
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
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
            
        protected void btnApprove_Click(object sender, EventArgs e)
        {
            string strScholarshipId = "";
            cmd = new SqlCommand();
            clsApproval objApprove = new clsApproval();
            try
            {
                lock (lckThis)
                {
                    int UserId = Convert.ToInt32(Session["intUser_ID"]);

                    if (con.State != ConnectionState.Open)
                    {
                        con.Open();
                    }
                    strScholarshipId = GenerateScholerID(Request.QueryString["applnno"].ToString().Trim().ToString());
                    strQuery = "Update t_Registration_Process set Scholarship_Approved_Amount = '" + txtApprovedAmt.Text.Trim().ToString() + "',status='Approved',";
                    strQuery = strQuery + " Approved_Date = '" + DateTime.Now.ToString() + "',Trustee=" + UserId + ",";
                    strQuery = strQuery + " Scholarship_No = '" + strScholarshipId + "'";
                    strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'  and  Scholarship_Id = '" + txtScholarshipId.Text.Trim().ToString() + "'";
                    cmd = new SqlCommand(strQuery, con);
                    cmd.ExecuteNonQuery();

                    //if (con.State != ConnectionState.Open)
                    //{
                    //    con.Open();
                    //}
                    //cmd.CommandText = "USP_UPDATE_SCHOLARSHIP_DATA_APPROVE";
                    //cmd.CommandType = CommandType.StoredProcedure;
                    //if (con.State != ConnectionState.Open)
                    //{
                    //    con.Open();
                    //}
                    //cmd.Connection = con;
                    //cmd.Parameters.Add(new SqlParameter("@Application_Id", Request.QueryString["applnno"].ToString().Trim().ToString()));
                    //cmd.Parameters.Add(new SqlParameter("@Scholarship_Approved_Amount", txtApprovedAmt.Text.Trim().ToString()));
                    //cmd.ExecuteNonQuery();

                    string strText = "Scholarship-" + this.txtScholarshipId.Text.Trim().ToString() + " amount approved <b> Rs." + txtApprovedAmt.Text.Trim().ToString() + " </b> by <b> " + Session["User_ID"].ToString() + " </b><br/> LMS Scholarship ID : <b> " + strScholarshipId + " </b>";
                    objApprove.UpdateHistory(lblApplnNo.Text, strText, "Scholarship Amount Approved", Session["User_ID"].ToString());

                    dvform.Visible = false;
                    dvSuccess.Visible = true;

                    lblSuccess.Text = "Scholarship-" + this.txtScholarshipId.Text.Trim().ToString() + " amount approved succesfully. </br>  Scholership ID : <b>" + strScholarshipId + "</b>. </br> thank you!";

                    Response.Write("<script>window.open('AdminPanelApprove.aspx',target='_top');</script>");
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
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

        protected void btnReject_Click(object sender, EventArgs e)
        {
            cmd = new SqlCommand();
            clsApproval objApprove = new clsApproval();
            string Amount = null;
            try
            {
                if (txtApprovedAmt.Text.Trim().ToString() != "")
                {
                    Amount = txtApprovedAmt.Text.Trim().ToString();
                }
                else
                {
                    Amount = null;
                }
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }

                strQuery = "Update t_Registration_Process set status='Rejected',Scholarship_Approved_Amount = '" + txtApprovedAmt.Text.Trim().ToString() + "',";
                strQuery = strQuery + " Remark_Reject = '" + txtRemark.Text.Trim() + "'," + " Update_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'  and  Scholarship_Id = '" + txtScholarshipId.Text.Trim().ToString() + "'";
                cmd = new SqlCommand(strQuery, con);
                cmd.ExecuteNonQuery();

                //if (con.State != ConnectionState.Open)
                //{
                //    con.Open();
                //}
                //cmd.CommandText = "USP_UPDATE_SCHOLARSHIP_DATA_APPROVE";
                //cmd.CommandType = CommandType.StoredProcedure;
                //if (con.State != ConnectionState.Open)
                //{
                //    con.Open();
                //}
                //cmd.Connection = con;
                //cmd.Parameters.Add(new SqlParameter("@Application_Id", Request.QueryString["applnno"].ToString().Trim().ToString()));
                //cmd.Parameters.Add(new SqlParameter("@Scholarship_Approved_Amount", txtApprovedAmt.Text.Trim().ToString()));
                //cmd.ExecuteNonQuery();

                string strText = "Scholarship-" + this.txtScholarshipId.Text.Trim().ToString() + " request has been Rejected due to  <b>" + txtRemark.Text.Trim() + " </b> by <b> " + Session["User_ID"].ToString() + " </b>";
                objApprove.UpdateHistory(lblApplnNo.Text, strText, "Scholarship Request Rejected", Session["User_ID"].ToString());  

                dvform.Visible = false;
                dvSuccess.Visible = true;

                lblSuccess.Text = "Scholarship-" + this.txtScholarshipId.Text.Trim().ToString() + " amount Rejected to : " + lblName.Text + " ( " + lblApplnNo.Text + " ) ";

                Response.Write("<script>window.open('AdminPanelApprove.aspx',target='_top');</script>");
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
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

        protected string GenerateScholerID(string strApplicationNo)
        {
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            String strQuery;
            string strScholershipNo = "";
            string strPrefixScholershipNo = "";
            int intScNo = 0;

            try
            {
                strPrefixScholershipNo = getAcYear(strApplicationNo);
                if (sqlConn.State != ConnectionState.Open)
                {
                    sqlConn.Open();
                }
                SqlCmd = new SqlCommand();
                SqlCmd.CommandText = "UPS_GET_MAX_ScholerShip_ID";
                SqlCmd.Parameters.Add("@ApplicationId", strApplicationNo);
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Connection = sqlConn;
                strScholershipNo = Convert.ToString(SqlCmd.ExecuteScalar());
                if (strScholershipNo == "")
                {
                    strScholershipNo = strPrefixScholershipNo + "LMSS1001";
                }
                else
                {
                    strScholershipNo = strScholershipNo.Substring(6, 4);
                    intScNo = Convert.ToInt32(Convert.ToInt32(strScholershipNo) + 1);
                    string strtemp = intScNo.ToString().PadLeft(4, '0');
                    strScholershipNo = strPrefixScholershipNo + "LMSS" + strtemp;
                }
                SqlCmd.Dispose();
                return strScholershipNo;
            }
            catch (Exception ex)
            {
                return "";
                throw ex;
            }
            finally
            {
                if (sqlConn.State != ConnectionState.Open)
                {
                    sqlConn.Open();
                }
            }
        }

        public string getAcYear(string strApplicationNo)
        {
            string strQuery = "";
            clsCommon objCommon = new clsCommon();
            string strgetAcYear = "";
            String strConn = objCommon.GetConnectionString();
            SqlConnection SqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataReader dr = null;
            try
            {
                if (SqlConn.State != ConnectionState.Open)
                    SqlConn.Open();
                SqlCmd = new SqlCommand();
                SqlCmd.CommandText = "UPS_GET_MAX_ScholerShip_ID_Year";
                SqlCmd.Parameters.Add("@ApplicationId", strApplicationNo);
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Connection = SqlConn;
                dr = SqlCmd.ExecuteReader();
                if (dr != null)
                {
                    while (dr.Read())
                    {
                        strgetAcYear = dr["ScholarshipYear_Code"].ToString();
                    }
                }
                return strgetAcYear;
            }
            catch (Exception ex)
            {
                return strgetAcYear;
            }
            finally
            {
                if (SqlConn.State != ConnectionState.Closed)
                    SqlConn.Close();
                dr.Close();
                dr.Dispose();
                SqlCmd = null;
            }
        }



    }
}
