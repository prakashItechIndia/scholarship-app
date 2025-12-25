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
    public partial class AjaxAdminPanelApprove : System.Web.UI.Page
    {
        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet ds = null;
        SqlDataAdapter da = null;
        clsCommon objCommon = null;
        public string strMainCategory = "";
        public string strKey = "";

        int intRegistered = 0;
        int intApproved = 0;
        int intWaiting = 0;
        int intCompleted = 0;
        int intRejected = 0;

        protected void Page_Load(object sender, EventArgs e)
        {
            DataSet ds = new DataSet();
            clsApproval objApprove = new clsApproval();
            try
            {
                if (Session["Roles_Id"] == null)
                {
                    gvDisplayScholarship.EmptyDataText = "Your session expired..";
                    gvDisplayScholarship.DataBind();
                    Response.Redirect("Login.aspx");
                }
                else
                {

                    strMainCategory = Convert.ToString(Request.QueryString["MainCategory"]);
                    strKey = Convert.ToString(Request.QueryString["Key"]);
                    int intRoleId = Convert.ToInt32(Session["Roles_Id"]);

                    ds = GetAdminPanelLoadProcess(Request.QueryString["MainCategory"].Trim().ToString(), Request.QueryString["Key"].Trim().ToString(), Request.QueryString["AcyearId"].Trim().ToString());
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

                        if (ds.Tables[0].Rows.Count == 1)
                        {
                            clsCommon objCommon = new clsCommon();
                            string strAadharId = ((HiddenField)gvDisplayScholarship.Rows[0].FindControl("hdAadhaarId")).Value;
                            string strPanId = ((HiddenField)gvDisplayScholarship.Rows[0].FindControl("hdPanId")).Value;
                            objCommon.fncBindIssuedAmount(strAadharId,strPanId,gvDisplayPreviousScholarshipDetails, lblAlreadyApplied);
                            dvVerify.Visible = true;
                        }
                    }



                }
                //else
                //{
                //    Response.Redirect("Login.aspx");
                //}
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
        }

        public DataSet GetAdminPanelLoadProcess(string MainCategory, string Key, string AcyearId)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            int intRoleId = Convert.ToInt32(Session["Roles_Id"]);

            int intAcyearId = Convert.ToInt32(AcyearId);

            try
            {
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
                strQuery = strQuery + " R.IFSC_Code,P.Scholarship_Issued_AccNo,P.User_ID,P.Status,P.Update_Date,P.Scholar_Reject,P.Scholarship_Id,";

                strQuery = strQuery + " concat('Approve-', P.Scholarship_Id) as ApproveText  ,";

                strQuery = strQuery + " Case P.Status When 'Registered' Then 'false' When 'Approved' Then 'false'";
                strQuery = strQuery + " When 'Waiting' Then 'true' Else 'false' End As ProcessLinkText,";

                if (intRoleId == 7)
                {
                    strQuery = strQuery + " Case P.Status When 'Rejected' Then 'true' Else 'false' End As RejectApprovalLinkText,";

                    strQuery = strQuery + " Case P.Status When 'Rejected' Then 'False' Else 'false' End As lblRejected,";

                    strQuery = strQuery + " Case P.Status When 'Registered' Then 'false' When 'Approved' Then 'true'";
                    strQuery = strQuery + " When 'Waiting' Then 'false' when 'Completed' then 'false' Else  'false' End As ApprovedOverrideLinkText,";

                    strQuery = strQuery + " Case P.Status When 'Registered' Then 'false' When 'Approved' Then 'False'";
                    strQuery = strQuery + " When 'Waiting' Then 'false' when 'Completed' then 'false' Else  'false' End As lblApproved ";
                }
                else
                {
                    strQuery = strQuery + " Case P.Status When 'Rejected' Then 'false' Else 'false' End As RejectApprovalLinkText,";

                    strQuery = strQuery + " Case P.Status When 'Rejected' Then 'true' Else 'false' End As lblRejected,";

                    strQuery = strQuery + " Case P.Status When 'Registered' Then 'false' Else  'false' End As ApprovedOverrideLinkText,";

                    strQuery = strQuery + " Case P.Status When 'Registered' Then 'false' When 'Approved' Then 'true'";
                    strQuery = strQuery + " When 'Waiting' Then 'false' when 'Completed' then 'false' Else  'false' End As lblApproved ";
                }


                strQuery = strQuery + " FROM t_Registration R join t_Registration_Process as P on P.Application_Id = R.Application_Id,T_Scholarship_Year SY ";
                strQuery = strQuery + " Where P.Status in ('Waiting','Approved','Rejected')";

                if (MainCategory == "Application No")
                {
                    strQuery = strQuery + " And R.Application_Id like '%" + Key + "%'";
                }
                if (MainCategory == "Name")
                {
                    strQuery = strQuery + " And R.Applicant_Name like '%" + Key + "%'";
                }
                if (MainCategory == "Mobile No")
                {
                    strQuery = strQuery + " And R.Mobile_Number like '%" + Key + "%'";
                }
                if (MainCategory == "Cheque No")
                {
                    strQuery = strQuery + " And P.DDCheque_No like '%" + Key + "%'";
                }
                if (MainCategory == "Student Id")
                {
                    strQuery = strQuery + " And R.Student_ID like '%" + Key + "%'";
                }
                if (MainCategory == "Aadhaar ID")
                {
                    strQuery = strQuery + " And R.Aadhaar_ID like '%" + Key + "%'";
                }
                if (intAcyearId != 0)
                {
                    strQuery = strQuery + "and Sy.ScholarshipYear_Id=R.Scholarship_Year_Id  and R.Scholarship_Year_Id=" + intAcyearId + "";
                }
                strQuery = strQuery + " order by ProcessLinkText desc";

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

        //public DataSet GetAdminPanelLoadApprove(string MainCategory, string Key,string SelectedStatusText ,string fromdate,string todate)
        //{
        //    objCommon = new clsCommon();
        //    string strQuery = null;
        //    SqlConnection connSql = null;
        //    SqlParameter[] Params = new SqlParameter[1];
        //    DataSet dsData = new DataSet();
        //    try
        //    {
        //        connSql = new SqlConnection(objCommon.GetConnectionString());

        //        strQuery = "Select";
        //        strQuery = strQuery + " Sch_Year ,Scholarship_For,Application_Id,Applicant_Type,";
        //        strQuery = strQuery + " Student_ID,Applicant_Name,Guardian_Name ,Father_Name,";
        //        strQuery = strQuery + " Father_Occupation,Father_OfficeName,Mother_Name,";
        //        strQuery = strQuery + " Mother_Occupation,Mother_OfficeName ,Address_Line1,Address_Line2,City,";
        //        strQuery = strQuery + " PinCode ,State,District,Country,Mobile_Number,Email,Date_Of_Birth,";
        //        strQuery = strQuery + " Gender,Community,Caste,Class_Studying,Board_Of_Studying,Type_Of_Institution,";
        //        strQuery = strQuery + " Cource_Of_Studying ,Degree_Type,Degree,Other_Degree,Ph_D,Specialization,";
        //        strQuery = strQuery + " Institution_Name ,University,Current_Year ,Current_Semester,";
        //        strQuery = strQuery + " Parent_AnnualIncome,Bank_Account_Number,Bank_Name,Bank_Branch,";
        //        strQuery = strQuery + " IFSC_Code,Scholarship_Issued_AccNo,User_ID,Status,Update_Date,";

        //        strQuery = strQuery + " Case Status When 'Registered' Then 'false' When 'Approved' Then 'false'";
        //        strQuery = strQuery + " When 'Waiting' Then 'true' Else 'false' End As ProcessLinkText,";

        //        strQuery = strQuery + " Case Status When 'Registered' Then 'false' When 'Approved' Then 'true'";
        //        strQuery = strQuery + " When 'Waiting' Then 'false' when 'Completed' then 'false' Else  'false' End As lblApproved ";

        //        strQuery = strQuery + " FROM t_esch_Registration ";
        //        strQuery = strQuery + " Where Status in ('Waiting','Approved')";

        //        if (MainCategory == "Application No")
        //        {
        //            strQuery = strQuery + " And Application_Id like '%" + Key + "%'";
        //        }
        //        if (MainCategory == "Name")
        //        {
        //            strQuery = strQuery + " And Applicant_Name like '%" + Key + "%'";
        //        }
        //        if (MainCategory == "Mobile No")
        //        {
        //            strQuery = strQuery + " And Mobile_Number like '%" + Key + "%'";
        //        }
        //        else if (MainCategory == "Status")
        //        {
        //            strQuery = strQuery + " And Status='" + SelectedStatusText + "'";
        //        }
        //        else if (MainCategory == "Action Date")
        //        {
        //            if (SelectedStatusText == "Registered")
        //            {
        //                strQuery = strQuery + " And Data_Date >='" + fromdate + "' and Data_Date <='" + todate + "' and Status='" + SelectedStatusText + "'";
        //            }
        //            else if (SelectedStatusText == "Approved")
        //            {
        //                strQuery = strQuery + " And Approved_Date >='" + fromdate + "' and Approved_Date <='" + todate + "' and Status='" + SelectedStatusText + "'";
        //            }
        //            else if (SelectedStatusText == "Waiting")
        //            {
        //                strQuery = strQuery + " And Suggesred_Date >='" + fromdate + "' and Suggesred_Date <='" + todate + "' and Status='" + SelectedStatusText + "'";
        //            }
        //            else if (SelectedStatusText == "Completed")
        //            {
        //                strQuery = strQuery + " And Donated_Date >='" + fromdate + "' and Donated_Date <='" + todate + "' and Status='" + SelectedStatusText + "'";
        //            }
        //        }

        //        Params[0] = new SqlParameter("@Statement", strQuery.ToString());
        //        dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
        //        return dsData;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //    finally
        //    {
        //        if (connSql.State != ConnectionState.Closed)
        //            connSql.Close();
        //        objCommon = null;
        //        connSql = null;
        //        strQuery = null;
        //    }
        //}


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
                        lblCntRegistered.Text = "| R-" + Convert.ToString(++intRegistered) + " ";
                        e.Row.Cells[8].CssClass = "cssRegistered";
                    }
                    if (lblstatus.Text == "Approved")
                    {
                        lblCntApproved.Text = "| A-" + Convert.ToString(++intApproved) + " ";
                        e.Row.Cells[8].CssClass = "cssAllocated";
                    }
                    if (lblstatus.Text == "Completed")
                    {
                        e.Row.Cells[8].CssClass = "cssSelected";
                        lblCntCompleted.Text = "| C-" + Convert.ToString(++intCompleted) + " ";
                    }
                    if (lblstatus.Text == "Rejected")
                    {
                        e.Row.Cells[8].CssClass = "cssRejected";
                        lblCntRejected.Text = "| Rej-" + Convert.ToString(++intRejected) + " ";
                    }
                    if (lblstatus.Text == "Waiting")
                    {
                        e.Row.Cells[8].CssClass = "cssWaiting";
                        lblCntWaiting.Text = "| W-" + Convert.ToString(++intWaiting) + " ";
                    }
                    if (lblReject.Text == "Rejected")
                    {
                        e.Row.Cells[8].CssClass = "cssRejected";
                        lblRejected.Text = "| W-" + Convert.ToString(++intWaiting) + " ";
                    }
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
        }
    }
}
