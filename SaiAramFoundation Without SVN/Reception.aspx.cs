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


namespace SaiAramFoundation
{
    public partial class Reception : System.Web.UI.Page
    {
        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet ds = null;
        SqlDataAdapter da = null;
        clsCommon objCommon = null;
        public string strMainCategory = "";
        public string strKey = "";
        public string dfromdate = "";
        public string dtodate = "";
        public string strSelectStatus = "";

        int intRegistered = 0;
        int intApproved = 0;
        int intWaiting = 0;
        int intCompleted = 0;
        int intRejected = 0;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["Roles_Id"] != null && Session["User_ID"] != null)
            {
                int intRoleId = Convert.ToInt32(Session["Roles_Id"]);
                if (intRoleId == 6)
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

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            DataSet dsData = new DataSet();
            SqlDataAdapter da = null;
            string status = "";
            string Uploadstatus = "";
            string Verifystatus = "";
            try
            {
                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand();

                strQuery = "Select";
                strQuery = strQuery + " Sch_Year ,Scholarship_For,R.Application_Id,";
                strQuery = strQuery + " Student_ID,Applicant_Name,Father_Name,";
                strQuery = strQuery + " Father_Occupation,Father_OfficeName,Mother_Name,";
                strQuery = strQuery + " Mother_Occupation,Mother_OfficeName ,Address_Line1,Address_Line2,City,";
                strQuery = strQuery + " PinCode ,State,District,Country,Mobile_Number,Email,Date_Of_Birth,";
                strQuery = strQuery + " Gender,Community,Caste,Class_Studying,Board_Of_Studying,Type_Of_Institution,";
                strQuery = strQuery + " Cource_Of_Studying ,Degree_Type,Degree,Other_Degree,Ph_D,Specialization,";
                strQuery = strQuery + " Institution_Name ,University,Current_Year ,Current_Semester,Aadhaar_ID,Status,";
                strQuery = strQuery + " case IsUpload_Status when '0' then 'Uploaded' when '1' then '[Partial] Upload Agine' when '2' then 'Upload' end as UploadStatus , ";
                strQuery = strQuery + " case IsVerify when '0' then ' Verified'  when '1' then 'Partial Verified' when '2' then 'Verify' end as VerifyStatus ";
                strQuery = strQuery + " FROM t_Registration R join t_Registration_Process as P on P.Application_Id = R.Application_Id ";
                strQuery = strQuery + " Where R.Application_Id = '" + txtKey.Text.Trim().ToString() + "'";
                da = new SqlDataAdapter(strQuery, sqlConn);
                da.Fill(dsData);
                if (dsData.Tables[0].Rows.Count > 0)
                {
                    lblAppNo.Text = dsData.Tables[0].Rows[0]["Application_Id"].ToString();
                    lblName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                    lblFatherName.Text = dsData.Tables[0].Rows[0]["Father_Name"].ToString();
                    lblAadhaarId.Text = dsData.Tables[0].Rows[0]["Aadhaar_ID"].ToString();
                    lblMobileNumber.Text = dsData.Tables[0].Rows[0]["Mobile_Number"].ToString();
                    lblClassStudying.Text = dsData.Tables[0].Rows[0]["Class_Studying"].ToString();
                    lblInstitutionname.Text = dsData.Tables[0].Rows[0]["Institution_Name"].ToString();
                    lblScholarshipFor.Text = dsData.Tables[0].Rows[0]["Scholarship_For"].ToString();
                    status = dsData.Tables[0].Rows[0]["Status"].ToString();
                    Uploadstatus = dsData.Tables[0].Rows[0]["UploadStatus"].ToString();
                    Verifystatus = dsData.Tables[0].Rows[0]["VerifyStatus"].ToString();

                    if (Uploadstatus == "Upload")
                    {
                        lblVerifyStatus.Text = Uploadstatus;
                    }
                    else if (Verifystatus == "Verify")
                    {
                        lblVerifyStatus.Text = Verifystatus;
                    }
                    else if (Verifystatus == "Partial Verified")
                    {
                        lblVerifyStatus.Text = Verifystatus;
                    }
                    else if (Verifystatus == "Verified")
                    {
                        lblVerifyStatus.Text = Verifystatus;
                    }
                    SetColor(status);
                }

            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
        }

        public void SetColor(string Status)
        {
            Label lblstatusColor = new Label();

            tdStatus.Controls.Add(lblstatusColor);

            if (Status == "Registered")
            {
                lblstatusColor.ForeColor = System.Drawing.Color.White;
                lblstatusColor.Font.Bold = true;
                lblstatusColor.BackColor = System.Drawing.Color.RoyalBlue;
                lblstatusColor.Style["padding"] = "4px";
                lblstatusColor.Text = "Registered";
            }
            if (Status == "Approved")
            {
                lblstatusColor.ForeColor = System.Drawing.Color.White;
                lblstatusColor.Font.Bold = true;
                lblstatusColor.BackColor = System.Drawing.Color.DarkViolet;
                lblstatusColor.Style["padding"] = "4px";
                lblVerifyStatus.Text = "DDCheque Upload";
                lblstatusColor.Text = "Approved";
            }
            if (Status == "Completed")
            {
                lblstatusColor.ForeColor = System.Drawing.Color.White;
                lblstatusColor.Font.Bold = true;
                lblstatusColor.BackColor = System.Drawing.Color.Green;
                lblstatusColor.Style["padding"] = "4px";
                lblVerifyStatus.Text = "Issued";
                lblstatusColor.Text = "Completed";
            }
            if (Status == "Rejected")
            {
                lblstatusColor.ForeColor = System.Drawing.Color.White;
                lblstatusColor.Font.Bold = true;
                lblstatusColor.BackColor = System.Drawing.Color.Red;
                lblstatusColor.Style["padding"] = "4px";
                lblVerifyStatus.Text = "Rejected";
                lblstatusColor.Text = "Rejected";
            }
            if (Status == "Waiting")
            {
                lblstatusColor.ForeColor = System.Drawing.Color.White;
                lblstatusColor.Font.Bold = true;
                lblstatusColor.BackColor = System.Drawing.Color.Orange;
                lblstatusColor.Style["padding"] = "4px";
                lblVerifyStatus.Text = "Amount Suggested";
                lblstatusColor.Text = "Waiting";
            }
        }
    }
}
