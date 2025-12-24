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
using System.Drawing;
using SaiAramFoundation.Classes;


namespace SaiAramFoundation
{
    public partial class AjaxSuggestHome : System.Web.UI.Page
    {

        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet ds = null;
        SqlDataAdapter da = null;
        clsCommon objCommon = null;
        public string strMainCategory = "";
        public string strKey = "";

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (Session["User_ID"] != null && Session["Roles_Id"] != null)
                {
                    if (!IsPostBack)
                    {

                        strMainCategory = Convert.ToString(Request.QueryString["MainCategory"]);
                        strKey = Convert.ToString(Request.QueryString["Key"]);
                        int intRoleId = Convert.ToInt32(Session["Roles_Id"]);

                        ds = GetAdminPanelLoadApprove(Request.QueryString["MainCategory"].Trim().ToString(), Request.QueryString["Key"].Trim().ToString(),
                            Request.QueryString["SelectedStatusText"].Trim().ToString(), Request.QueryString["fromdate"].Trim().ToString(), Request.QueryString["todate"].Trim().ToString(), Request.QueryString["AcyearId"].Trim().ToString());

                        if (ds.Tables[0].Rows.Count == 0)
                        {
                            gvDisplayScholarship.EmptyDataText = "No Data Available..";
                            gvDisplayScholarship.DataBind();
                        }
                        else
                        {
                            gvDisplayScholarship.DataSource = ds;
                            gvDisplayScholarship.DataBind();

                            lblAppNo.Text = ((HyperLink)gvDisplayScholarship.Rows[0].FindControl("lnkApplnNo")).Text;
                            lblName.Text = ((Label)gvDisplayScholarship.Rows[0].FindControl("lblApplicant_Name")).Text;

                            if (ds.Tables[0].Rows.Count >= 1)
                            {
                                clsCommon objCommon = new clsCommon();
                                string strAadharId = ((HiddenField)gvDisplayScholarship.Rows[0].FindControl("hdAadhaarId")).Value;
                                string strPanId = ((HiddenField)gvDisplayScholarship.Rows[0].FindControl("hdPanId")).Value;
                                objCommon.fncBindIssuedAmount(strAadharId, strPanId, gvDisplayPreviousScholarshipDetails, lblAlreadyApplied);
                               
                                dvVerify.Visible = true;
                            }
                        }
                    }
                }
                else
                {
                    gvDisplayScholarship.EmptyDataText = "Your session expired..";
                    gvDisplayScholarship.DataBind();
                    Response.Redirect("Login.aspx");
                }

            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
        }

        public DataSet GetAdminPanelLoadApprove(string MainCategory, string Key, string SelectedStatusText, string fromdate, string todate,string AcyearId)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            int intAcyearId = Convert.ToInt32(AcyearId);
            try
            {
                if (MainCategory != "Cheque No")
                {
                    gvDisplayScholarship.Columns[9].Visible = false;
                    gvDisplayScholarship.Columns[10].Visible = false;
                }
                if (MainCategory != "Scholarship No")
                {
                    gvDisplayScholarship.Columns[8].Visible = false;
                }

                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = "Select";
                strQuery = strQuery + " R.Sch_Year ,R.Scholarship_For,R.Application_Id,R.Applicant_Type,";
                strQuery = strQuery + " R.Student_ID,R.Applicant_Name,R.Guardian_Name ,R.Father_Name,R.Aadhaar_ID,R.Pan_ID,";
                strQuery = strQuery + " R.Father_Occupation,R.Father_OfficeName,R.Mother_Name,";
                strQuery = strQuery + " R.Mother_Occupation,R.Mother_OfficeName ,R.Address_Line1,R.Address_Line2,R.City,";
                strQuery = strQuery + " R.PinCode ,R.State,R.District,R.Country,R.Mobile_Number,R.Email,R.Date_Of_Birth,";
                strQuery = strQuery + " R.Gender,R.Community,R.Caste,R.Class_Studying,R.Board_Of_Studying,R.Type_Of_Institution,";
                strQuery = strQuery + " R.Cource_Of_Studying ,R.Degree_Type,R.Degree,R.Other_Degree,R.Ph_D,R.Specialization,";
                strQuery = strQuery + " R.Institution_Name ,R.University,R.Current_Year ,R.Current_Semester,";
                strQuery = strQuery + " R.Father_AnnualIncome,R.Bank_Account_Number,R.Bank_Name,R.Bank_Branch,";
                strQuery = strQuery + " R.IFSC_Code,P.Scholarship_Issued_AccNo,P.User_ID,P.Status,P.Scholarship_No,P.Update_Date,P.DDCheque_No,P.Scholarship_Approved_Amount,P.DDCheque_In_Favor,P.Donated_Date,P.Scholar_Reject,P.Scholarship_Id,";

                strQuery = strQuery + " Case P.Status When 'Registered' Then '1' When 'Approved' Then '3'";
                strQuery = strQuery + " When 'Waiting' Then '2' When '  ' Then '4' Else '' End As statuspriority";

                strQuery = strQuery + " FROM t_Registration R join t_Registration_Process as P on P.Application_Id = R.Application_Id join T_Scholarship_Year SY  on R.Scholarship_Year_Id = SY.ScholarshipYear_Id where ";

                if (intAcyearId != 0)
                {
                    strQuery = strQuery + "R.Scholarship_Year_Id=" + intAcyearId + " and ";
                }  

                if (MainCategory == "Application No")
                {
                    strQuery = strQuery + " R.Application_Id like '%" + Key + "%' order by Application_Id asc";
                }
                if (MainCategory == "Name")
                {
                    strQuery = strQuery + " R.Applicant_Name like '%" + Key + "%' order by Application_Id asc";
                }
                if (MainCategory == "Mobile No")
                {
                    strQuery = strQuery + " R.Mobile_Number like '%" + Key + "%' order by Application_Id asc";
                }
                if (MainCategory == "Scholarship No")
                {
                    strQuery = strQuery + " R.Scholarship_No like '%" + Key + "%' order by Application_Id asc";
                }
                if (MainCategory == "Student Id")
                {
                    strQuery = strQuery + " R.Student_ID like '%" + Key + "%' order by Application_Id asc";
                }
                if (MainCategory == "Aadhaar ID")
                {
                    strQuery = strQuery + " R.Aadhaar_ID like '%" + Key + "%' order by Application_Id asc";
                }
                if (MainCategory == "Cheque No")
                {
                    strQuery = strQuery + " P.DDCheque_No like '%" + Key + "%' order by Application_Id asc";
                }
                else if (MainCategory == "Status")
                {
                    strQuery = strQuery + " P.Status='" + SelectedStatusText + "' order by Application_Id asc";
                }
                else if (MainCategory == "Action Date")
                {
                    if (SelectedStatusText == "Registered")
                    {
                        strQuery = strQuery + " P.Data_Date >='" + fromdate + "' and P.Data_Date <='" + todate + "' and P.Status='" + SelectedStatusText + "' order by Application_Id asc";
                    }
                    else if (SelectedStatusText == "Approved")
                    {
                        strQuery = strQuery + " P.Approved_Date >='" + fromdate + "' and P.Approved_Date <='" + todate + "' and P.Status='" + SelectedStatusText + "' order by Application_Id asc";
                    }
                    else if (SelectedStatusText == "Waiting")
                    {
                        strQuery = strQuery + " P.Suggesred_Date >='" + fromdate + "' and P.Suggesred_Date <='" + todate + "' and P.Status='" + SelectedStatusText + "' order by Application_Id asc";
                    }
                    else if (SelectedStatusText == "Completed")
                    {
                        strQuery = strQuery + " P.Donated_Date >='" + fromdate + "' and P.Donated_Date <='" + todate + "' and P.Status='" + SelectedStatusText + "' order by Application_Id asc";
                    }
                    else if (SelectedStatusText == "Rejected")
                    {
                        strQuery = strQuery + " P.Update_Date >='" + fromdate + "' and P.Update_Date <='" + todate + "' and P.Status='" + SelectedStatusText + "' order by Application_Id asc";
                    }
                }
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

        protected void gvDisplayScholarship_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            try
            {
                if (e.Row.RowType == DataControlRowType.DataRow)
                {

                    Label lblstatus = (Label)e.Row.FindControl("lblStatus");
                    Label lblReject = (Label)e.Row.FindControl("lblScholarReject");
                    if (lblstatus.Text == "Registered")
                    {
                        e.Row.Cells[11].CssClass = "cssRegistered";
                    }
                    if (lblstatus.Text == "Approved")
                    {
                        e.Row.Cells[11].CssClass = "cssAllocated";
                    }
                    if (lblstatus.Text == "Completed")
                    {
                        e.Row.Cells[11].CssClass = "cssSelected";
                    }
                    if (lblstatus.Text == "Rejected")
                    {
                        e.Row.Cells[11].CssClass = "cssRejected";
                    }
                    if (lblReject.Text == "Rejected")
                    {
                        e.Row.Cells[11].CssClass = "cssRejected";
                    }
                    if (lblstatus.Text == "Waiting")
                    {
                        e.Row.Cells[11].CssClass = "cssWaiting";
                    }
                    if (lblstatus.Text == "Enquired")
                    {
                        e.Row.Cells[11].CssClass = "cssEnquired";
                    }
                    if (lblstatus.Text == "Cancelled")
                    {
                        e.Row.Cells[11].CssClass = "cssCancelled";
                    }
                    //else
                    //{
                    //    e.Row.Cells[8].BackColor = Color.Red;
                    //}
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
        }

        protected void lnkPrintDetails_Click(object sender, EventArgs e)
        {
            LinkButton templbtn;
            templbtn = (LinkButton)sender;
        }
    }
}
