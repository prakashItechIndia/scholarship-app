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
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using System.IO;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;




namespace SaiAramFoundation
{
    public partial class SubReportForCategories : System.Web.UI.Page
    {
        private System.Object lckThis = new System.Object();
        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet dsData = null;
        SqlDataAdapter da = null;
        string strQuery = "";
        string InvaildType = "";
        clsCommon objCommon = null;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                int intRoleId = Convert.ToInt32(Session["Roles_Id"]);
                if (intRoleId == 1 || intRoleId == 4 || intRoleId == 7 || intRoleId == 8)
                {
                    lblUser.Text = "Welcome Mr/Miss : " + Session["User_Name"].ToString();
                    DateTime today = DateTime.Today.Date;
                    DateTime startOfMonth = new DateTime(today.Year, today.Month, 1).Date;
                    DateTime endOfMonth = new DateTime(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month)).Date;
                    txtFromDate.Text = startOfMonth.ToString("dd/MM/yyyy");
                    txtToDate.Text = endOfMonth.ToString("dd/MM/yyyy");
                }
                else
                {
                    Response.Redirect("Login.aspx");
                }

                fncBindAcYear();
            }
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            string strMainCategory = ddlMainCategory.SelectedValue.ToString();
            string strSelectedStatusText = ddlSelectedStatus.SelectedValue.ToString();
            string strfromdate = txtFromDate.Text.Trim();
            string strtodate = txtToDate.Text.Trim();
            string strSelectedAmountText = ddlSelectedAmount.SelectedValue.ToString();
            string strSelectedGenderText = ddlSelectedGender.SelectedValue.ToString();
            string strSelectedIssuedText = ddlSelectedIssued.SelectedValue.ToString();
            string strAcademicYear = ddAcYear.SelectedValue.ToString();
            string strSairamCategeory = ddlSairamgroup.SelectedValue.ToString();
            string strCollegeName = ddSairamCollege.SelectedValue.ToString();
            string strSchoolName = ddSairamSchool.SelectedValue.ToString();
            string strPolytechnicName = ddSairamPolytechnic.SelectedValue.ToString();
            string strMedicalName = ddSairamMedical.SelectedValue.ToString();
            string strParentOffice = txtParentOffice.Text.Trim();
            string FavourCategory = ddlSelectedFavour.SelectedValue.ToString();
            string FavourGroup = ddlSelectedFavourGroup.SelectedValue.ToString();

            int intTemp = CheckData(strMainCategory, strSelectedStatusText, strfromdate, strtodate, strSelectedAmountText, strSelectedGenderText, strSelectedIssuedText, strAcademicYear, strSairamCategeory, strCollegeName, strSchoolName, strPolytechnicName, strMedicalName, strParentOffice, FavourCategory, FavourGroup);

            if (intTemp != 0)
            {
                GetReport();
                ScriptManager.RegisterStartupScript(Page, Page.GetType(), "newWindow", "window.open('AjaxReport.aspx');", true);
            }
            else
            {
                ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('No Data Available.. ');", true);
            }

            ddlMainCategory.SelectedValue = strMainCategory;

        }

        protected void btnExcelExport_Click(object sender, EventArgs e)
        {
            try
            {
                string strMainCategory = ddlMainCategory.SelectedValue.ToString();
                string strSelectedStatusText = ddlSelectedStatus.SelectedValue.ToString();
                string strfromdate = txtFromDate.Text.Trim();
                string strtodate = txtToDate.Text.Trim();
                string strSelectedAmountText = ddlSelectedAmount.SelectedValue.ToString();
                string strSelectedGenderText = ddlSelectedGender.SelectedValue.ToString();
                string strSelectedIssuedText = ddlSelectedIssued.SelectedValue.ToString();
                string strScholarshipId = ddAcYear.SelectedValue.ToString();
                string strSairamCategeory = ddlSairamgroup.SelectedValue.ToString();
                string strCollegeName = ddSairamCollege.SelectedValue.ToString();
                string strSchoolName = ddSairamSchool.SelectedValue.ToString();
                string strPolytechnicName = ddSairamPolytechnic.SelectedValue.ToString();
                string strMedicalName = ddSairamMedical.SelectedValue.ToString();
                string strParentOffice = txtParentOffice.Text.Trim();
                string FavourCategory = ddlSelectedFavour.SelectedValue.ToString();
                string FavourGroup = ddlSelectedFavourGroup.SelectedValue.ToString();

                MemoryStream oStream = new MemoryStream();

                int intTemp = CheckData(strMainCategory, strSelectedStatusText, strfromdate, strtodate, strSelectedAmountText, strSelectedGenderText, strSelectedIssuedText, strScholarshipId, strSairamCategeory, strCollegeName, strSchoolName, strPolytechnicName, strMedicalName, strParentOffice, FavourCategory, FavourGroup);
                if (intTemp != 0)
                {
                    DataTable dt = ExcelData(strMainCategory, strSelectedStatusText, strfromdate, strtodate, strSelectedAmountText, strSelectedGenderText, strSelectedIssuedText, strScholarshipId, strSairamCategeory, strCollegeName, strSchoolName, strPolytechnicName, strMedicalName,strParentOffice,FavourCategory,FavourGroup);
                    oStream = Excel(dt, strMainCategory, strSelectedStatusText, strfromdate, strtodate, strSelectedAmountText, strSelectedGenderText, strSelectedIssuedText, strSairamCategeory, strCollegeName, strSchoolName, strPolytechnicName, strMedicalName, strParentOffice,FavourCategory,FavourGroup);
                    byte[] bytes = new byte[oStream.Length];
                    bytes = oStream.ToArray();
                    Response.Clear();
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.ScholarshipCategorieswiseReport.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=ScholarshipCategorieswiseReport.xls");
                    Response.BinaryWrite(bytes);
                    Response.Flush();
                    Response.End();
                    //GetReport();
                    // ScriptManager.RegisterStartupScript(Page, Page.GetType(), "newWindow", "window.open('AjaxReport.aspx?Option=Excel&FileName=ScholarshipReport');", true);
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('No Data Available.. ');", true);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void GetReport()
        {
            ReportDocument rpt = new ReportDocument();
            string strSelectedStatusText = null;
            string strMainCategory = null;
            string strfromdate = null;
            string strtodate = null;
            string strSelectedAmountText = null;
            string strSelectedGenderText = null;
            string strSelectedIssuedText = null;
            string strScholarshipId = null;
            string strSairamCategeory = null;
            string strCollegeName = null;
            string strSchoolName = null;
            string strPolytechnicName = null;
            string strMedicalName = null;
            string strParentOffice = null;
            string FavourCategory = null;
            string FavourGroup = null;

            try
            {
                strMainCategory = ddlMainCategory.SelectedValue.ToString();
                strSelectedStatusText = ddlSelectedStatus.SelectedValue.ToString();
                strfromdate = txtFromDate.Text.Trim();
                strtodate = txtToDate.Text.Trim();
                strSelectedAmountText = ddlSelectedAmount.SelectedValue.ToString();
                strSelectedGenderText = ddlSelectedGender.SelectedValue.ToString();
                strSelectedIssuedText = ddlSelectedIssued.SelectedValue.ToString();
                strScholarshipId = ddAcYear.SelectedValue.ToString();
                strSairamCategeory = ddlSairamgroup.SelectedValue.ToString();
                strCollegeName = ddSairamCollege.SelectedValue.ToString();
                strSchoolName = ddSairamSchool.SelectedValue.ToString();
                strPolytechnicName = ddSairamPolytechnic.SelectedValue.ToString();
                strMedicalName = ddSairamMedical.SelectedValue.ToString();
                strParentOffice = txtParentOffice.Text.Trim();
                FavourCategory = ddlSelectedFavour.SelectedValue.ToString();
                FavourGroup = ddlSelectedFavourGroup.SelectedValue.ToString();

                if (strSelectedStatusText == "Approved")
                {
                    rpt.Load(Server.MapPath("~/Reports/rptGetApprovedReport.rpt"));
                    rpt.SetParameterValue("@Status", strSelectedStatusText);
                    rpt.SetParameterValue("@ScholarshipYearId", strScholarshipId);
                }
                else if (strSelectedStatusText == "Registered")
                {
                    rpt.Load(Server.MapPath("~/Reports/rptGetRegisteredReport.rpt"));
                    rpt.SetParameterValue("@Status", strSelectedStatusText);
                    rpt.SetParameterValue("@ScholarshipYearId", strScholarshipId);
                }
                else if (strSelectedStatusText == "Waiting")
                {
                    rpt.Load(Server.MapPath("~/Reports/rptGetWaitingReport.rpt"));
                    rpt.SetParameterValue("@Status", strSelectedStatusText);
                    rpt.SetParameterValue("@ScholarshipYearId", strScholarshipId);
                }
                else
                {         
                    rpt.Load(Server.MapPath("~/Reports/rptGetReport.rpt"));
                    rpt.SetParameterValue("@MainCategory", strMainCategory);
                    rpt.SetParameterValue("@ScholarshipYearId", strScholarshipId);
                    rpt.SetParameterValue("@SairamCategory", strSairamCategeory);                   
                    if (strSelectedStatusText != "")
                    {
                        rpt.SetParameterValue("@Status", strSelectedStatusText);
                    }
                    else
                    {
                        rpt.SetParameterValue("@Status", null);
                    }

                    if (strfromdate != "")
                    {
                        rpt.SetParameterValue("@FromDate", DateTime.ParseExact(strfromdate, "dd/MM/yyyy", null).ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        rpt.SetParameterValue("@FromDate", null);
                    }
                    if (strtodate != "")
                    {
                        rpt.SetParameterValue("@ToDate", DateTime.ParseExact(strtodate, "dd/MM/yyyy", null).ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        rpt.SetParameterValue("@ToDate", null);
                    }
                    if (strSelectedAmountText != "")
                    {
                        rpt.SetParameterValue("@Amount", strSelectedAmountText);
                    }
                    else
                    {
                        rpt.SetParameterValue("@Amount", null);
                    }
                    if (strSelectedGenderText != "")
                    {
                        rpt.SetParameterValue("@Gender", strSelectedGenderText);
                    }
                    else
                    {
                        rpt.SetParameterValue("@Gender", null);
                    }
                    if (strSelectedIssuedText != "")
                    {
                        rpt.SetParameterValue("@IssuedTo", strSelectedIssuedText);
                    }
                    else
                    {
                        rpt.SetParameterValue("@IssuedTo", null);
                    }

                    if (strParentOffice != "")
                    {
                        rpt.SetParameterValue("@ParentOccupation", strParentOffice);
                    }
                    else
                    {
                        rpt.SetParameterValue("@ParentOccupation", "");
                    }
                    if (FavourCategory != "")
                    {
                        rpt.SetParameterValue("@FavourCategory", FavourCategory);
                    }
                    else
                    {
                        rpt.SetParameterValue("@FavourCategory", "");
                    }

                    if (FavourGroup != "")
                    {
                        rpt.SetParameterValue("@FavourGroup", FavourGroup);
                    }
                    else
                    {
                        rpt.SetParameterValue("@FavourGroup", "");
                    }

                    if (strSairamCategeory == "College")
                    {
                        rpt.SetParameterValue("@InstitutionName", strCollegeName);
                    }
                    if (strSairamCategeory == "School")
                    {
                        rpt.SetParameterValue("@InstitutionName", strSchoolName);
                    }
                    if (strSairamCategeory == "Polytechnic")
                    {
                        rpt.SetParameterValue("@InstitutionName", strPolytechnicName);
                    }
                    if (strSairamCategeory == "Medical")
                    {
                        rpt.SetParameterValue("@InstitutionName", strMedicalName);
                    }
                    if (strSairamCategeory == "All")
                    {
                        rpt.SetParameterValue("@InstitutionName", strSairamCategeory);
                    }
                }


                Session["ReportObject"] = rpt;
                ddlMainCategory.SelectedIndex = -1;
                ddlSelectedGender.SelectedIndex = -1;
                ddlSelectedIssued.SelectedIndex = -1;
                ddlSelectedAmount.SelectedIndex = -1;
                ddlSelectedStatus.SelectedIndex = -1;

            }
            catch (Exception)
            {
                throw;
            }
        }

        protected void ddlMainCategory_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            txtParentOffice.Text = "";
            ddlSairamgroup.SelectedValue = "All";
            ddlSelectedFavour.SelectedValue = "All";
            ddlSelectedFavourGroup.SelectedValue = "All";

            string strSelectedValue = ddlMainCategory.SelectedValue.ToString();
            string strSelectedGroup = ddlSairamgroup.SelectedValue.ToString();
          
            if (strSelectedValue != "0")
            {
                if (strSelectedValue == "Applied Date" || strSelectedValue == "Processed Date")
                {
                    divDate.Visible = true;
                    divAmount.Visible = false;
                    divGender.Visible = false;
                    divIssuedTo.Visible = false;
                    divStatus.Visible = false;
                    divSairamgroup.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamMedical.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;
                    divParentOffice.Visible = false;
                    divFavour.Visible = false;
                    divFavourGroup.Visible = false;
                }
                if (strSelectedValue == "Amount")
                {
                    divDate.Visible = false;
                    divAmount.Visible = true;
                    divGender.Visible = false;
                    divIssuedTo.Visible = false;
                    divStatus.Visible = false;
                    divSairamgroup.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamMedical.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;
                    divParentOffice.Visible = false;
                    divFavour.Visible = false;
                    divFavourGroup.Visible = false;
                }
                if (strSelectedValue == "Gender")
                {
                    divDate.Visible = false;
                    divAmount.Visible = false;
                    divGender.Visible = true;
                    divIssuedTo.Visible = false;
                    divStatus.Visible = false;
                    divSairamgroup.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamMedical.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;
                    divParentOffice.Visible = false;
                    divFavour.Visible = false;
                    divFavourGroup.Visible = false;
                }
                if (strSelectedValue == "Issued to")
                {
                    divDate.Visible = false;
                    divAmount.Visible = false;
                    divGender.Visible = false;
                    divIssuedTo.Visible = true;
                    divStatus.Visible = false;
                    divSairamgroup.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamMedical.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;
                    divParentOffice.Visible = false;
                    divFavour.Visible = false;
                    divFavourGroup.Visible = false;
                }
                if (strSelectedValue == "Status")
                {
                    divDate.Visible = false;
                    divAmount.Visible = false;
                    divGender.Visible = false;
                    divIssuedTo.Visible = false;
                    divStatus.Visible = true;
                    divSairamgroup.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamMedical.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;
                    divParentOffice.Visible = false;
                    divFavour.Visible = false;
                    divFavourGroup.Visible = false;
                }

                if (strSelectedValue == "Parent Office")
                {
                    divParentOffice.Visible = true;
                    divDate.Visible = false;
                    divAmount.Visible = false;
                    divGender.Visible = false;
                    divIssuedTo.Visible = false;
                    divStatus.Visible = false;
                    divSairamgroup.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamMedical.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;
                    divFavour.Visible = false;
                    divFavourGroup.Visible = false;
                    divFavourGroup.Visible = false;

                }

                if (strSelectedValue == "Favour Type")
                {
                    divFavourGroup.Visible = true;
                    divFavour.Visible = true;
                    divParentOffice.Visible = false;
                    divDate.Visible = false;
                    divAmount.Visible = false;
                    divGender.Visible = false;
                    divIssuedTo.Visible = false;
                    divStatus.Visible = false;
                    divSairamgroup.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamMedical.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;
                }

                if (strSelectedValue == "Sairam Group")
                {
                    divSairamgroup.Visible = true;
                    divDate.Visible = false;
                    divAmount.Visible = false;
                    divGender.Visible = false;
                    divIssuedTo.Visible = false;
                    divStatus.Visible = false;
                    divParentOffice.Visible = false;
                    divFavour.Visible = false;
                    divFavourGroup.Visible = false;

                    if (strSelectedGroup == "All")
                    {
                        divSairamCollege.Visible = false;
                        divSairamMedical.Visible = false;
                        divSairamPolytechnic.Visible = false;
                        divSairamSchool.Visible = false;
                    }
                    if(strSelectedGroup == "College")
                    {
                        divSairamCollege.Visible = true;
                        divSairamMedical.Visible = false;
                        divSairamPolytechnic.Visible = false;
                        divSairamSchool.Visible = false;
                    }
                    if(strSelectedGroup == "Medical")
                    {
                        divSairamMedical.Visible = true;
                        divSairamCollege.Visible = false;
                        divSairamPolytechnic.Visible = false;
                        divSairamSchool.Visible = false;
                    }
                    if(strSelectedGroup == "School")
                    {
                        divSairamMedical.Visible = false;
                        divSairamCollege.Visible = false;
                        divSairamPolytechnic.Visible = false;
                        divSairamSchool.Visible = true;

                    }
                    if (strSelectedGroup == "Polytechnic")
                    {
                        divSairamMedical.Visible = false;
                        divSairamCollege.Visible = false;
                        divSairamPolytechnic.Visible = true;
                        divSairamSchool.Visible = false;
                    }
                }
            }
            else
            {
                divParentOffice.Visible = false;
                divDate.Visible = false;
                divAmount.Visible = false;
                divGender.Visible = false;
                divIssuedTo.Visible = false;
                divStatus.Visible = false;
                divSairamgroup.Visible = false;
                divSairamCollege.Visible = false;
                divSairamMedical.Visible = false;
                divSairamPolytechnic.Visible = false;
                divSairamSchool.Visible = false;
             
            }
        }

        protected void ddlSairamgroup_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            string strSelectedGroup = ddlSairamgroup.SelectedValue.ToString();

            if (strSelectedGroup == "All")
            {
                divSairamMedical.Visible = false;
                divSairamCollege.Visible = false;
                divSairamPolytechnic.Visible = false;
                divSairamSchool.Visible = false;

            }

            if (strSelectedGroup == "College")
            {
                divSairamCollege.Visible = true;
                divSairamMedical.Visible = false;
                divSairamPolytechnic.Visible = false;
                divSairamSchool.Visible = false;

            }
            if (strSelectedGroup == "Medical")
            {
                divSairamMedical.Visible = true;
                divSairamCollege.Visible = false;
                divSairamPolytechnic.Visible = false;
                divSairamSchool.Visible = false;

            }
            if (strSelectedGroup == "School")
            {
                divSairamMedical.Visible = false;
                divSairamCollege.Visible = false;
                divSairamPolytechnic.Visible = false;
                divSairamSchool.Visible = true;

            }
            if (strSelectedGroup == "Polytechnic")
            {
                divSairamMedical.Visible = false;
                divSairamCollege.Visible = false;
                divSairamPolytechnic.Visible = true;
                divSairamSchool.Visible = false;

            }
        }

        protected void ddlFavourSairamgroup_OnSelectedIndexCahnged(object sender, EventArgs e)
        {
            string strSelectedGroup = ddlSairamgroup.SelectedValue.ToString();
            string strSelectedFavourGroup = ddlSelectedFavourGroup.SelectedValue.ToString();

            if (strSelectedFavourGroup == "Sairam Group")
            {
                divSairamgroup.Visible = true;

                if (strSelectedGroup == "All")
                {
                    divSairamMedical.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;

                }

                if (strSelectedGroup == "College")
                {
                    divSairamCollege.Visible = true;
                    divSairamMedical.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;

                }
                if (strSelectedGroup == "Medical")
                {
                    divSairamMedical.Visible = true;
                    divSairamCollege.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = false;

                }
                if (strSelectedGroup == "School")
                {
                    divSairamMedical.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamPolytechnic.Visible = false;
                    divSairamSchool.Visible = true;

                }
                if (strSelectedGroup == "Polytechnic")
                {
                    divSairamMedical.Visible = false;
                    divSairamCollege.Visible = false;
                    divSairamPolytechnic.Visible = true;
                    divSairamSchool.Visible = false;

                }
            }
            else
            {
                divSairamgroup.Visible = false;
                divSairamMedical.Visible = false;
                divSairamCollege.Visible = false;
                divSairamPolytechnic.Visible = false;
                divSairamSchool.Visible = false;
            }

        }

        // CheckData(strMainCategory, strSelectedStatusText, strfromdate, strtodate,strSelectedAmountText, strSelectedGenderText, strSelectedIssuedText);

        public int CheckData(string strMainCategory, string strSelectedStatusText, string strfromdate, string strtodate, string strSelectedAmountText, string strSelectedGenderText, string strSelectedIssuedText,string strScholarshipId,string strSairamCategory,string strCollege,string strSchool,string strPolytechnic,string strMedical,string strParentOffice,string FavourCategory,string FavourGroup)
        {
            SqlParameter[] Params = new SqlParameter[1];
            clsApproval objApproval = new clsApproval();
            objCommon = new clsCommon();
            cmd = new SqlCommand();
            dsData = new DataSet();
            int intTemp = 0;
            try
            {
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.Connection = con;
                if (strSelectedStatusText == "Approved" || strSelectedStatusText == "Waiting")
                {
                    cmd.CommandText = "USP_GetReportApproved_Waiting_Status";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Status", strSelectedStatusText));
                    cmd.Parameters.Add(new SqlParameter("@ScholarshipYearId", strScholarshipId));
                }
                else if (strSelectedStatusText == "Registered")
                {
                    cmd.CommandText = "USP_GetReport_Registered";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Status", strSelectedStatusText));
                    cmd.Parameters.Add(new SqlParameter("@ScholarshipYearId", strScholarshipId));
                }
                else
                {
                    cmd.CommandText = "USP_GetReportDump";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@MainCategory", strMainCategory));
                    cmd.Parameters.Add(new SqlParameter("@ScholarshipYearId", strScholarshipId));
                    cmd.Parameters.Add(new SqlParameter("@SairamCategory", strSairamCategory));
                    if (strSelectedStatusText != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@Status", strSelectedStatusText));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@Status", null));
                    }

                    if (strfromdate != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@FromDate", DateTime.ParseExact(strfromdate, "dd/MM/yyyy", null).ToString("MM/dd/yyyy")));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@FromDate", null));
                    }
                    if (strtodate != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@ToDate", DateTime.ParseExact(strtodate, "dd/MM/yyyy", null).ToString("MM/dd/yyyy")));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@ToDate", null));
                    }
                    if (strSelectedAmountText != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@Amount", strSelectedAmountText));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@Amount", null));
                    }
                    if (strSelectedGenderText != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@Gender", strSelectedGenderText));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@Gender", null));
                    }
                    if (strSelectedIssuedText != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@IssuedTo", strSelectedIssuedText));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@IssuedTo", null));
                    }
                    if (strParentOffice != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@ParentOccupation",strParentOffice));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@ParentOccupation", ""));
                    }

                    if (FavourCategory != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@FavourCategory", FavourCategory));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@FavourCategory",""));
                    }

                    if (FavourGroup != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@FavourGroup", FavourGroup));
                    }

                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@FavourGroup", ""));
                    }

                    //if (strMainCategory == "SairamGroup")
                    //{
                    //    cmd.Parameters.Add(new SqlParameter("@SairamCategory", strSairamCategory));
                    //}
                    //else
                    //{
                    //    cmd.Parameters.Add(new SqlParameter("@SairamCategory", strSairamCategory));
                    //}
                    if (strSairamCategory == "College")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", strCollege));
                    }
                    if (strSairamCategory == "School")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", strSchool));
                    }
                    if (strSairamCategory == "Polytechnic")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", strPolytechnic));
                    }
                    if (strSairamCategory == "Medical")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", strMedical));
                    }
                    if (strSairamCategory == "All")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", "All"));
                    }

                }

                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);
                if (dsData.Tables[0].Rows.Count != 0)
                {
                    intTemp = 1;
                }
                return intTemp;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataTable ExcelData(string strMainCategory, string strSelectedStatusText, string strfromdate, string strtodate, string strSelectedAmountText, string strSelectedGenderText, string strSelectedIssuedText, string strScholarshipYearId, string strSairamCategory, string strCollege, string strSchool, string strPolytechnic, string strMedical,string strParentOffice,string FavourCategory,string FavourGroup)
        {
            SqlParameter[] Params = new SqlParameter[1];
            clsApproval objApproval = new clsApproval();
            objCommon = new clsCommon();
            cmd = new SqlCommand();
            //dsData = new DataSet();
            DataTable dt = new DataTable();         
            try
            {
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.Connection = con;
                if (strSelectedStatusText == "Approved" || strSelectedStatusText == "Waiting")
                {
                    cmd.CommandText = "USP_GetReportApproved_Waiting_Status";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Status", strSelectedStatusText));
                    cmd.Parameters.Add(new SqlParameter("@ScholarshipYearId", strScholarshipYearId));
                }
                else if (strSelectedStatusText == "Registered")
                {
                    cmd.CommandText = "USP_GetReport_Registered";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Status", strSelectedStatusText));
                    cmd.Parameters.Add(new SqlParameter("@ScholarshipYearId", strScholarshipYearId));
                }
                else
                {
                    cmd.CommandText = "USP_GetReportDump";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@MainCategory", strMainCategory));
                    cmd.Parameters.Add(new SqlParameter("@ScholarshipYearId", strScholarshipYearId));
                    cmd.Parameters.Add(new SqlParameter("@SairamCategory", strSairamCategory));
                    if (strSelectedStatusText != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@Status", strSelectedStatusText));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@Status", null));
                    }

                    if (strfromdate != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@FromDate", DateTime.ParseExact(strfromdate, "dd/MM/yyyy", null).ToString("MM/dd/yyyy")));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@FromDate", null));
                    }
                    if (strtodate != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@ToDate", DateTime.ParseExact(strtodate, "dd/MM/yyyy", null).ToString("MM/dd/yyyy")));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@ToDate", null));
                    }
                    if (strSelectedAmountText != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@Amount", strSelectedAmountText));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@Amount", null));
                    }
                    if (strSelectedGenderText != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@Gender", strSelectedGenderText));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@Gender", null));
                    }
                    if (strSelectedIssuedText != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@IssuedTo", strSelectedIssuedText));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@IssuedTo", null));
                    }
                    if (strParentOffice != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@ParentOccupation", strParentOffice));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@ParentOccupation", ""));
                    }
                    if (FavourCategory != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@FavourCategory", FavourCategory));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@FavourCategory", ""));
                    }
                    if (FavourGroup != "")
                    {
                        cmd.Parameters.Add(new SqlParameter("@FavourGroup", FavourGroup));
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter("@FavourGroup", ""));
                    }

                    //if (strMainCategory == "SairamGroup")
                    //{
                    //    cmd.Parameters.Add(new SqlParameter("@SairamCategory", strSairamCategory));
                    //}
                    //else
                    //{
                    //    cmd.Parameters.Add(new SqlParameter("@SairamCategory", null));
                    //}
                    if (strSairamCategory == "College")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", strCollege));
                    }
                    if (strSairamCategory == "School")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", strSchool));
                    }
                    if (strSairamCategory == "Polytechnic")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", strPolytechnic));
                    }
                    if (strSairamCategory == "Medical")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", strMedical));
                    }
                    if (strSairamCategory == "All")
                    {
                        cmd.Parameters.Add(new SqlParameter("@InstitutionName", "All"));
                    }
                }

                da = new SqlDataAdapter(cmd);
                da.Fill(dt);
                return dt;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public MemoryStream Excel(DataTable dtAuresult, string strMainCategory, string strSelectedStatusText, string strfromdate, string strtodate, string strSelectedAmountText, string strSelectedGenderText, string strSelectedIssuedText, string strSairamCategory, string strCollege, string strSchool, string strPolytechnic, string strMedical,string strParentOffice,string FavourCategory,string FavourGroup)
        {
            string appno = "";
            try
            {
                string Totalcolumn = "Approved Amount";
                int Totalcolumn_no = 14;
                //string AcYear = "2016-2017";
                //Create new Excel workbook
                var workbook = new HSSFWorkbook();
                //Create new Excel sheet
                var sheet = workbook.CreateSheet();
                ////(Optional) set the width of the columns

                #region Cell Styles

                #region font

                var bold16font = workbook.CreateFont();
                bold16font.FontHeightInPoints = 16;
                bold16font.FontName = "Calibri";
                bold16font.Boldweight = (short)FontBoldWeight.Bold;

                var bold12font = workbook.CreateFont();
                bold12font.FontHeightInPoints = 12;
                bold12font.FontName = "Calibri";
                bold12font.Boldweight = (short)FontBoldWeight.Bold;

                var noraml12font = workbook.CreateFont();
                noraml12font.FontHeightInPoints = 12;
                noraml12font.FontName = "Calibri";
                noraml12font.Boldweight = (short)FontBoldWeight.Normal;


                var colorfont = workbook.CreateFont();
                colorfont.FontHeightInPoints = 12;
                colorfont.FontName = "Calibri";

                colorfont.Color = (short)(FontColor.Red);

                var colorAlignedCellStyle = workbook.CreateCellStyle();
                colorAlignedCellStyle.Alignment = HorizontalAlignment.Center;
                colorAlignedCellStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
                colorAlignedCellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                colorAlignedCellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                colorAlignedCellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
                colorAlignedCellStyle.SetFont(colorfont);

                # endregion

                #region InstitutionLabel Cell Style
                var InstitutionLabelLabelCellStyle = workbook.CreateCellStyle();
                InstitutionLabelLabelCellStyle.Alignment = HorizontalAlignment.Center;
                InstitutionLabelLabelCellStyle.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.Brown.Index;
                //InstitutionLabelLabelCellStyle.FillPattern= ce
                InstitutionLabelLabelCellStyle.SetFont(bold16font);
                #endregion

                #region subtitile Cell Style
                var subTitleLabelCellStyle = workbook.CreateCellStyle();
                subTitleLabelCellStyle.Alignment = HorizontalAlignment.Center;
                subTitleLabelCellStyle.SetFont(bold12font);
                #endregion
                #region Right Cell Style
                var RightLabelCellStyle = workbook.CreateCellStyle();
                RightLabelCellStyle.Alignment = HorizontalAlignment.Right;
                RightLabelCellStyle.SetFont(bold12font);
                #endregion

                #region HeaderLabel Cell Style
                var headerLabelCellStyle = workbook.CreateCellStyle();
                headerLabelCellStyle.Alignment = HorizontalAlignment.Center;
                headerLabelCellStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
                headerLabelCellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                headerLabelCellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                headerLabelCellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
                //headerLabelCellStyle.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.RED.index;
                headerLabelCellStyle.SetFont(bold12font);
                #endregion

                #region ResultLabel Cell Style
                var headerLabelCellStyle1 = workbook.CreateCellStyle();
                headerLabelCellStyle1.Alignment = HorizontalAlignment.Center;
                headerLabelCellStyle1.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
                headerLabelCellStyle1.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                headerLabelCellStyle1.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                headerLabelCellStyle1.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
                //headerLabelCellStyle.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.RED.index;
                headerLabelCellStyle1.SetFont(noraml12font);
                #endregion
                #region RightAligned Cell Style
                var rightAlignedCellStyle = workbook.CreateCellStyle();
                rightAlignedCellStyle.Alignment = HorizontalAlignment.Right;
                rightAlignedCellStyle.SetFont(noraml12font);
                #endregion

                #region LeftAligned Cell Style
                var leftAlignedCellStyle = workbook.CreateCellStyle();
                leftAlignedCellStyle.Alignment = HorizontalAlignment.Left;
                leftAlignedCellStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
                leftAlignedCellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                leftAlignedCellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                leftAlignedCellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
                leftAlignedCellStyle.SetFont(noraml12font);
                #endregion

                #region CenetrAligned Cell Style
                var CenterAlignedCellStyle = workbook.CreateCellStyle();
                CenterAlignedCellStyle.Alignment = HorizontalAlignment.Center;
                CenterAlignedCellStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
                CenterAlignedCellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                CenterAlignedCellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                CenterAlignedCellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
                CenterAlignedCellStyle.SetFont(noraml12font);
                #endregion

                #region LeftAligned Cell Style
                var leftAlignedCellStyle1 = workbook.CreateCellStyle();
                leftAlignedCellStyle1.Alignment = HorizontalAlignment.Left;
                //leftAlignedCellStyle1.BorderTop = BorderStyle.THIN;
                //leftAlignedCellStyle1.BorderBottom = BorderStyle.THIN;
                //leftAlignedCellStyle1.BorderLeft = BorderStyle.THIN;
                //leftAlignedCellStyle1.BorderRight = BorderStyle.THIN;
                leftAlignedCellStyle1.SetFont(bold12font);
                #endregion
                #region Currency Cell Style
                var currencyCellStyle = workbook.CreateCellStyle();
                currencyCellStyle.Alignment = HorizontalAlignment.Right;
                var formatId = HSSFDataFormat.GetBuiltinFormat("$#,##0.00");
                if (formatId == -1)
                {
                    var newDataFormat = workbook.CreateDataFormat();
                    currencyCellStyle.DataFormat = newDataFormat.GetFormat("$#,##0.00");
                }
                else
                    currencyCellStyle.DataFormat = formatId;
                #endregion
                #region Detail Subtotal Style
                var detailSubtotalCellStyle = workbook.CreateCellStyle();
                detailSubtotalCellStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
                detailSubtotalCellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                var detailSubtotalFont = workbook.CreateFont();
                detailSubtotalFont.Boldweight = (short)FontBoldWeight.Bold;
                detailSubtotalCellStyle.SetFont(detailSubtotalFont);
                #endregion
                #region Detail Currency Subtotal Style
                var detailCurrencySubtotalCellStyle = workbook.CreateCellStyle();
                detailCurrencySubtotalCellStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
                detailCurrencySubtotalCellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                var detailCurrencySubtotalFont = workbook.CreateFont();
                detailCurrencySubtotalFont.Boldweight = (short)FontBoldWeight.Bold;
                detailCurrencySubtotalCellStyle.SetFont(detailCurrencySubtotalFont);
                formatId = HSSFDataFormat.GetBuiltinFormat("$#,##0.00");
                if (formatId == -1)
                {
                    var newDataFormat = workbook.CreateDataFormat();
                    detailCurrencySubtotalCellStyle.DataFormat = newDataFormat.GetFormat("$#,##0.00");
                }
                else
                    detailCurrencySubtotalCellStyle.DataFormat = formatId;
                #endregion
                #endregion

                int rowNumber = 1;
                IRow headerRow = sheet.CreateRow(rowNumber);
                ICell cell = headerRow.CreateCell(3);

                if (strMainCategory == "Amount")
                {
                    cell.SetCellValue("Scholarship Based on " + strMainCategory + " ( " + strSelectedAmountText + " )");
                }

                else if (strMainCategory == "Applied Date")
                {
                    cell.SetCellValue("Scholarship Based on " + strMainCategory + " - From " + strfromdate + " To " + strtodate);
                }

                else if (strMainCategory == "Processed Date")
                {
                    cell.SetCellValue("Scholarship Based on " + strMainCategory + " - From " + strfromdate + " To " + strtodate);
                }
                else if (strMainCategory == "Gender")
                {
                    cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSelectedGenderText);
                }

                else if (strMainCategory == "Status")
                {

                    if (strSelectedStatusText == "Approved")
                    {
                        Totalcolumn_no = 15;
                        Totalcolumn = "Approved Amount";
                    }
                    if (strSelectedStatusText == "Completed")
                    {
                        Totalcolumn_no = 14;
                        Totalcolumn = "Issued Amount";
                    }
                    cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSelectedStatusText);
                }

                else if (strMainCategory == "Issued to")
                {
                    cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSelectedIssuedText);
                }

                else if (strMainCategory == "Parent Office")
                {
                    cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strParentOffice);
                }
                else if (strMainCategory == "Sairam Group" && strSairamCategory == "All")
                {
                    cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSairamCategory);
                }

                else if (strMainCategory == "Sairam Group")
                {
                    if (strSairamCategory == "College")
                    {
                        cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSairamCategory + "/" + strCollege);
                    }
                    if (strSairamCategory == "School")
                    {
                        cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSairamCategory + "/" + strSchool);
                    }
                    if (strSairamCategory == "Polytechnic")
                    {
                        cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSairamCategory + "/" + strPolytechnic);
                    }
                    if (strSairamCategory == "Medical")
                    {
                        cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSairamCategory + "/" + strMedical);
                    }
                    if (strSairamCategory == "All")
                    {
                        cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + strSairamCategory + "/" + "All");
                    }
                }

                else if (strMainCategory == "Favour Type")
                {
                    if (FavourGroup == "Sairam Group")
                    {
                        if (strSairamCategory == "College")
                        {
                            cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + FavourCategory + "/" + FavourGroup + " - " + strSairamCategory + "/" + strCollege);
                        }
                        if (strSairamCategory == "School")
                        {
                            cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + FavourCategory + "/" + FavourGroup + " - " + strSairamCategory + "/" + strSchool);
                        }
                        if (strSairamCategory == "Polytechnic")
                        {
                            cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + FavourCategory + "/" + FavourGroup + " - " + strSairamCategory + "/" + strPolytechnic);
                        }
                        if (strSairamCategory == "Medical")
                        {
                            cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + FavourCategory + "/" + FavourGroup + " - " + strSairamCategory + "/" + strMedical);
                        }
                        if (strSairamCategory == "All")
                        {
                            cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + FavourCategory + "/" + FavourGroup + " - " + strSairamCategory + "/" + "All");
                        }
                    }
                    else
                    {
                        cell.SetCellValue("Scholarship Based on " + strMainCategory + " - " + FavourCategory + "/" + FavourGroup);
                    }
                }

                cell.CellStyle = InstitutionLabelLabelCellStyle;
                CellRangeAddress region = new CellRangeAddress(rowNumber, rowNumber, 3, 16);

                rowNumber += 2;
                //  Set the column names in the header row
                headerRow = sheet.CreateRow(rowNumber);
                cell = headerRow.CreateCell(0);
                cell.SetCellValue("S.No");
                cell.CellStyle = headerLabelCellStyle;

                int count = 1;
                foreach (DataColumn column in dtAuresult.Columns)
                {
                    //Set the column names in the header row
                    cell = headerRow.CreateCell(count);
                    cell.SetCellValue(column.ColumnName);
                    cell.CellStyle = headerLabelCellStyle;
                    count = count + 1;

                }
                //(Optional) freeze the header row so it is not scrolled
                // sheet.CreateFreezePane(0, 1, 0, 1);
                int c = 1;
                rowNumber++;
                foreach (DataRow r in dtAuresult.Rows)
                {
                    appno = r["Application Id"].ToString();

                    if (appno == "AF1811123")
                    {
                        string bb = "";
                    }
                    var row = sheet.CreateRow(rowNumber++);

                    cell = row.CreateCell(0);
                    cell.SetCellValue(c);
                    cell.CellStyle = leftAlignedCellStyle;
                    c++;
                    for (int i = 1; i <= dtAuresult.Columns.Count; i++)
                    {
                        cell = row.CreateCell(i);
                        cell.SetCellType(CellType.String);
                        cell.SetCellValue(r[i - 1] == null ? "" : r[i - 1].ToString());
                        cell.CellStyle = leftAlignedCellStyle;
                    }
                }


                // Declare an object variable.
                object sumObject;
                sumObject = dtAuresult.Compute("sum([" + dtAuresult.Columns[Totalcolumn] + "])", "");
                int SumOfIssuedAmount = Convert.ToInt32(sumObject);

                var rowTotal = sheet.CreateRow(rowNumber++);
                int rowi = rowNumber - 1;

                cell = rowTotal.CreateCell(0);
                cell.SetCellType(CellType.String);
                cell.SetCellValue("Total " + Totalcolumn);
                cell.CellStyle = headerLabelCellStyle;
                CellRangeAddress regi = new CellRangeAddress(rowi, rowi, 0, Totalcolumn_no);
                sheet.AddMergedRegion(regi);

                cell = rowTotal.CreateCell(Totalcolumn_no +1);
                cell.SetCellType(CellType.String);
                cell.SetCellValue(SumOfIssuedAmount);
                cell.CellStyle = headerLabelCellStyle;

                //for(int j = 1; j <= dtAuresult.Columns.Count; j++) 
                //{
                //    string ColumName = dtAuresult.Columns[j - 1].ToString();

                //    if (ColumName == "Issued Amount")
                //    {
                //        cell = rowTotal.CreateCell(j);
                //        cell.SetCellType(CellType.String);
                //        cell.SetCellValue(SumOfIssuedAmount);
                //        cell.CellStyle = CenterAlignedCellStyle;                  
                //    }
                //    else
                //    {
                //        cell = rowTotal.CreateCell(j);
                //        cell.SetCellType(CellType.String);
                //        cell.SetCellValue("");
                //        cell.CellStyle = CenterAlignedCellStyle;                   
                //    }
                //}


                // Auto-size each column
                //for (var i = 0; i < sheet.GetRow(7).LastCellNum; i++)
                //{
                //    sheet.AutoSizeColumn(i);

                //    // Bump up with auto-sized column width to account for bold headers
                //    sheet.SetColumnWidth(i, sheet.GetColumnWidth(i) + 1024);
                //}
                //Write the workbook to a memory stream
                MemoryStream output = new MemoryStream();
                workbook.Write(output);
                return output;

            }
            catch (Exception ex)
            {
                string aa = appno;
                throw ex ;
            }
            
        }

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
                ddAcYear.DataSource = dsData.Tables[0];
                ddAcYear.DataTextField = dsData.Tables[0].Columns["ScholarshipYear_Code"].ToString();
                ddAcYear.DataValueField = dsData.Tables[0].Columns["ScholarshipYear_Id"].ToString();
                ddAcYear.DataBind();

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                {
                    con.Close();
                }

            }

        }

    }
}