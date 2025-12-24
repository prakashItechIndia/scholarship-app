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

using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.HSSF.UserModel;


namespace SaiAramFoundation
{
    public partial class SubReportForScholarshipIssued : System.Web.UI.Page
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
                    fncBindIssuedInstitution();
                    fncBindIssuedFrom();
                    ddlIssuedInstitution.Visible = false;
                    RequiredIssuedBy.Enabled = false;
                    ddlIssuedBy.Visible = false;
                    RequiredIssuedByValues.Enabled = false;
                    lblIssuedInstitution.Visible = false;
                    lblIssuedBy.Visible = false;
                    lblFromDate.Visible = false;
                    txtFromDate.Visible = false;
                    lblToDate.Visible = false;
                    txtToDate.Visible = false;
                    lblChequeInFavorType.Visible = false;
                    ddChequeInFavorType.Visible = false;
                }
                else
                {
                    Response.Redirect("Login.aspx");
                }

            }
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            string strMainCategory = ddlMainCategory.SelectedValue.ToString();
            string strChequeInFavorType = ddChequeInFavorType.SelectedValue.ToString();
            string strfromdate = txtFromDate.Text.Trim();
            string strtodate = txtToDate.Text.Trim();
            string strIssuedBy = "";
            int intIssuedBy = 0;
            string strInstitution = "";
            int intInstitution = 0;

            if (ddChequeInFavorType.SelectedItem.Text == "All")
            {
                strInstitution = "";
                intInstitution = 0;
            }
            else
            {
                if (ddChequeInFavorType.SelectedItem.Text == "Individual")
                {
                    strInstitution = "";
                    intInstitution = 0;
                }
                else
                {
                    if (ddlIssuedInstitution.SelectedItem.Text == "All")
                    {
                        strInstitution = "All";
                    }
                    else if (ddlIssuedInstitution.SelectedItem.Text == "Other")
                    {
                        strInstitution = "Other";
                    }
                    else
                    {
                        intInstitution = Convert.ToInt32(ddlIssuedInstitution.SelectedValue.ToString());
                    }
                }
            }
            if (ddlIssuedBy.SelectedItem.Text == "All")
            {
                strIssuedBy = "All";
            }
            else
            {
                intIssuedBy = Convert.ToInt32(ddlIssuedBy.SelectedValue.ToString());
            }

            int intTemp = CheckData(strfromdate, strtodate, intInstitution, strInstitution, strChequeInFavorType, intIssuedBy, strIssuedBy);
            if (intTemp != 0)
            {
                GetReport();
                ScriptManager.RegisterStartupScript(Page, Page.GetType(), "newWindow", "window.open('AjaxReportForScholarshipIssued.aspx');", true);
            }
            else
            {
                ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('No Data Available.. ');", true);
            }

            DateTime today = DateTime.Today.Date;
            DateTime startOfMonth = new DateTime(today.Year, today.Month, 1).Date;
            DateTime endOfMonth = new DateTime(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month)).Date;
            txtFromDate.Text = startOfMonth.ToString("dd/MM/yyyy");
            txtToDate.Text = endOfMonth.ToString("dd/MM/yyyy");

        }
        protected void btnExcelExport_Click(object sender, EventArgs e)
        {
            try
            {
                string strMainCategory = ddlMainCategory.SelectedValue.ToString();
                string strChequeInFavorType = ddChequeInFavorType.SelectedValue.ToString();
                string strfromdate = txtFromDate.Text.Trim();
                string strtodate = txtToDate.Text.Trim();
                string strIssuedBy = "";
                int intIssuedBy = 0;
                string strInstitution = "";
                int intInstitution = 0;
                MemoryStream oStream = new MemoryStream();

                if (ddChequeInFavorType.SelectedItem.Text == "All")
                {
                    strInstitution = "";
                    intInstitution = 0;
                }
                else
                {
                    if (ddChequeInFavorType.SelectedItem.Text == "Individual")
                    {
                        strInstitution = "";
                        intInstitution = 0;
                    }
                    else
                    {
                        if (ddlIssuedInstitution.SelectedItem.Text == "All")
                        {
                            strInstitution = "All";
                        }
                        else if (ddlIssuedInstitution.SelectedItem.Text == "Other")
                        {
                            strInstitution = "Other";
                        }
                        else
                        {
                            intInstitution = Convert.ToInt32(ddlIssuedInstitution.SelectedValue.ToString());
                        }
                    }
                }
                if (ddlIssuedBy.SelectedItem.Text == "All")
                {
                    strIssuedBy = "All";
                }
                else
                {
                    intIssuedBy = Convert.ToInt32(ddlIssuedBy.SelectedValue.ToString());
                }

                int intTemp = CheckData(strfromdate, strtodate, intInstitution, strInstitution, strChequeInFavorType, intIssuedBy, strIssuedBy);
                if (intTemp != 0)
                {
                    DataTable dt = ExcelData(strfromdate, strtodate, intInstitution, strInstitution, strChequeInFavorType, intIssuedBy, strIssuedBy);
                    oStream = Excel(dt, strfromdate, strtodate);
                    byte[] bytes = new byte[oStream.Length];
                    bytes = oStream.ToArray();
                    Response.Clear();
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.ScholarshipCategorieswiseReport.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=ScholarshipCategorieswiseReport.xls");
                    Response.BinaryWrite(bytes);
                    Response.Flush();
                    Response.End();
                    //GetReport();
                    //ScriptManager.RegisterStartupScript(Page, Page.GetType(), "newWindow", "window.open('AjaxReportForScholarshipIssued.aspx?Option=Excel&FileName=ScholarshipReport');", true);
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('No Data Available.. ');", true);
                }

                DateTime today = DateTime.Today.Date;
                DateTime startOfMonth = new DateTime(today.Year, today.Month, 1).Date;
                DateTime endOfMonth = new DateTime(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month)).Date;
                txtFromDate.Text = startOfMonth.ToString("dd/MM/yyyy");
                txtToDate.Text = endOfMonth.ToString("dd/MM/yyyy");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private void GetReport()
        {
            ReportDocument rpt = new ReportDocument();
            string strMainCategory = null;
            string strfromdate = null;
            string strtodate = null;
            int intInstitution = 0;
            string strInstitution = "";
            string strChequeInFavorType = "";
            int intIssuedBy = 0;
            string strIssuedBy = "";
            try
            {
                strMainCategory = ddlMainCategory.SelectedValue.ToString();

                strfromdate = txtFromDate.Text.Trim();
                strtodate = txtToDate.Text.Trim();
                strChequeInFavorType = ddChequeInFavorType.SelectedValue.ToString();

                if (ddChequeInFavorType.SelectedItem.Text == "All")
                {
                    strInstitution = "";
                    intInstitution = 0;
                }
                else
                {
                    if (ddChequeInFavorType.SelectedItem.Text == "Individual")
                    {
                        strInstitution = "";
                        intInstitution = 0;
                    }
                    else
                    {
                        if (ddlIssuedInstitution.SelectedItem.Text == "All")
                        {
                            strInstitution = "All";
                        }
                        else if (ddlIssuedInstitution.SelectedItem.Text == "Other")
                        {
                            strInstitution = "Other";
                        }
                        else
                        {
                            intInstitution = Convert.ToInt32(ddlIssuedInstitution.SelectedValue.ToString());
                        }
                    }
                }
                if (ddlIssuedBy.SelectedItem.Text == "All")
                {
                    strIssuedBy = "All";
                }
                else
                {
                    intIssuedBy = Convert.ToInt32(ddlIssuedBy.SelectedValue.ToString());
                }


                rpt.Load(Server.MapPath("~/Reports/rptScholarshipChequeIssued.rpt"));
                //rpt.SetParameterValue("@MainCategory", strMainCategory);

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
                if (intInstitution != 0)
                {
                    rpt.SetParameterValue("@InstitutionId", intInstitution);
                }
                else
                {
                    rpt.SetParameterValue("@InstitutionId", null);
                }
                if (strInstitution != "")
                {
                    rpt.SetParameterValue("@strInstitution", strInstitution);
                }
                else
                {
                    rpt.SetParameterValue("@strInstitution", null);
                }

                if (strChequeInFavorType != "")
                {
                    rpt.SetParameterValue("@DDCheque_In_Favor_Type", strChequeInFavorType);
                }
                else
                {
                    rpt.SetParameterValue("@DDCheque_In_Favor_Type", null);
                }

                if (strIssuedBy != "")
                {
                    rpt.SetParameterValue("@strIssuedBy", strIssuedBy);
                }
                else
                {
                    rpt.SetParameterValue("@strIssuedBy", null);
                }

                if (intIssuedBy != 0)
                {
                    rpt.SetParameterValue("@intIssuedBy", intIssuedBy);
                }
                else
                {
                    rpt.SetParameterValue("@intIssuedBy", null);
                }

                Session["ReportObjectIssued"] = rpt;
                fnClear();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void fnClear()
        {
            ddlMainCategory.SelectedIndex = -1;
            ddlIssuedInstitution.SelectedIndex = -1;
            ddlIssuedBy.SelectedIndex = -1;
            ddChequeInFavorType.SelectedIndex = -1;
            ddlIssuedInstitution.Visible = false;
            RequiredIssuedBy.Enabled = false;
            ddlIssuedBy.Visible = false;
            RequiredIssuedByValues.Enabled = false;
            lblIssuedInstitution.Visible = false;
            lblIssuedBy.Visible = false;
            lblFromDate.Visible = false;
            txtFromDate.Visible = false;
            txtFromDate.Text = "";
            lblToDate.Visible = false;
            txtToDate.Visible = false;
            txtToDate.Text = "";
            lblChequeInFavorType.Visible = false;
            ddChequeInFavorType.Visible = false;
        }

        //Bind Institution

        public void fncBindIssuedInstitution()
        {
            cmd = new SqlCommand();
            dsData = new DataSet();
            try
            {
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.CommandText = "sp_GetAllChequeIssuedBy";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = con;
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);
                ddlIssuedInstitution.DataSource = dsData.Tables[0];
                ddlIssuedInstitution.DataTextField = dsData.Tables[0].Columns["Issued_By"].ToString();
                ddlIssuedInstitution.DataValueField = dsData.Tables[0].Columns["Id"].ToString();
                ddlIssuedInstitution.DataBind();
                ddlIssuedInstitution.Items.Insert(0, "--Select--");
                ddlIssuedInstitution.Items.Insert(1, "All");
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

        //Bind Institution IssuedFrom

        public void fncBindIssuedFrom()
        {
            cmd = new SqlCommand();
            dsData = new DataSet();
            try
            {
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.CommandText = "sp_GetAllChequeIssuedBy";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = con;
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);
                ddlIssuedBy.DataSource = dsData.Tables[0];
                ddlIssuedBy.DataTextField = dsData.Tables[0].Columns["Issued_By"].ToString();
                ddlIssuedBy.DataValueField = dsData.Tables[0].Columns["Id"].ToString();
                ddlIssuedBy.DataBind();
                //ddlIssuedBy.Items.Insert(0, "--Select--");
                ddlIssuedBy.Items.Insert(0, "All");
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

        public int CheckData(string strfromdate, string strtodate, int intInstitution, string strInstitution, string strChequeInFavorType, int intIssuedBy, string strIssuedBy)
        {
            SqlParameter[] Params = new SqlParameter[1];
            clsApproval objApproval = new clsApproval();
            objCommon = new clsCommon();
            cmd = new SqlCommand();
            dsData = new DataSet();
            int intTemp = 0;
            try
            {
                //lblAppNo.Text = Request.QueryString["applnno"].ToString();
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.CommandText = "rptScholarshipChequeIssued";
                cmd.CommandType = CommandType.StoredProcedure;
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.Connection = con;

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
                if (intInstitution != 0)
                {
                    cmd.Parameters.Add(new SqlParameter("@InstitutionId", intInstitution));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@InstitutionId", null));
                }
                if (strInstitution != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@strInstitution", strInstitution));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@strInstitution", null));
                }

                if (strChequeInFavorType != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@DDCheque_In_Favor_Type", strChequeInFavorType));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@DDCheque_In_Favor_Type", null));
                }
                if (intIssuedBy != 0)
                {
                    cmd.Parameters.Add(new SqlParameter("@intIssuedBy", intIssuedBy));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@intIssuedBy", null));
                }
                if (strIssuedBy != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@strIssuedBy", strIssuedBy));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@strIssuedBy", null));
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

        // ddChequeInFavorType_OnSelectedIndexChanged

        protected void ddChequeInFavorType_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            if (ddChequeInFavorType.SelectedItem.Text == "Individual")
            {
                ddlIssuedInstitution.Visible = false;
                RequiredIssuedBy.Enabled = false;
                lblIssuedInstitution.Visible = false;
            }
            else if (ddChequeInFavorType.SelectedItem.Text == "All")
            {
                ddlIssuedInstitution.Visible = false;
                RequiredIssuedBy.Enabled = false;
            }
            else
            {
                lblIssuedInstitution.Visible = true;
                ddlIssuedInstitution.Visible = true;
                RequiredIssuedBy.Enabled = true;
                ddlIssuedInstitution.SelectedIndex = -1;
            }
        }

        //ddlMainCategory_OnSelectedIndexChanged

        protected void ddlMainCategory_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            if (ddlMainCategory.SelectedItem.Text == "Issued Date")
            {
                lblIssuedBy.Visible = false;
                ddlIssuedBy.Visible = false;
                RequiredIssuedByValues.Enabled = false;
                lblFromDate.Visible = true;
                txtFromDate.Visible = true;
                lblToDate.Visible = true;
                txtToDate.Visible = true;
                lblChequeInFavorType.Visible = true;
                ddChequeInFavorType.Visible = true;
                ddlIssuedBy.SelectedIndex = -1;
            }
            else if (ddlMainCategory.SelectedItem.Text == "--Select--")
            {
                ddlIssuedInstitution.Visible = false;
                RequiredIssuedBy.Enabled = false;
                ddlIssuedBy.Visible = false;
                RequiredIssuedByValues.Enabled = false;
                lblIssuedInstitution.Visible = false;
                lblIssuedBy.Visible = false;
                lblFromDate.Visible = false;
                txtFromDate.Visible = false;
                lblToDate.Visible = false;
                txtToDate.Visible = false;
                lblChequeInFavorType.Visible = false;
                ddChequeInFavorType.Visible = false;
            }

            else
            {
                lblIssuedBy.Visible = true;
                ddlIssuedBy.Visible = true;
                RequiredIssuedByValues.Enabled = true;
                ddlIssuedBy.SelectedIndex = -1;
                lblFromDate.Visible = true;
                txtFromDate.Visible = true;
                lblToDate.Visible = true;
                txtToDate.Visible = true;
                lblChequeInFavorType.Visible = true;
                ddChequeInFavorType.Visible = true;
            }
        }

        public DataTable ExcelData(string strfromdate, string strtodate, int intInstitution, string strInstitution, string strChequeInFavorType, int intIssuedBy, string strIssuedBy)
        {
            SqlParameter[] Params = new SqlParameter[1];
            clsApproval objApproval = new clsApproval();
            objCommon = new clsCommon();
            cmd = new SqlCommand();
            //dsData = new DataSet();
            DataTable dt = new DataTable();
            int intTemp = 0;
            try
            {

                //lblAppNo.Text = Request.QueryString["applnno"].ToString();
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.CommandText = "rptScholarshipChequeIssued";
                cmd.CommandType = CommandType.StoredProcedure;
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.Connection = con;

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
                if (intInstitution != 0)
                {
                    cmd.Parameters.Add(new SqlParameter("@InstitutionId", intInstitution));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@InstitutionId", null));
                }
                if (strInstitution != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@strInstitution", strInstitution));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@strInstitution", null));
                }

                if (strChequeInFavorType != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@DDCheque_In_Favor_Type", strChequeInFavorType));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@DDCheque_In_Favor_Type", null));
                }
                if (intIssuedBy != 0)
                {
                    cmd.Parameters.Add(new SqlParameter("@intIssuedBy", intIssuedBy));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@intIssuedBy", null));
                }
                if (strIssuedBy != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@strIssuedBy", strIssuedBy));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@strIssuedBy", null));
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

        public MemoryStream Excel(DataTable dtAuresult, string strfromdate, string strtodate)
        {
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

            cell.SetCellValue("Scholarship Cheques Issued - From " + strfromdate + " To " + strtodate);
            cell.CellStyle = InstitutionLabelLabelCellStyle;
            CellRangeAddress region = new CellRangeAddress(rowNumber, rowNumber, 4, 7);

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
                var row = sheet.CreateRow(rowNumber++);
                cell = row.CreateCell(0);
                cell.SetCellValue(c);
                cell.CellStyle = leftAlignedCellStyle;
                c++;
                for (int i = 1; i <= dtAuresult.Columns.Count; i++)
                {
                    cell = row.CreateCell(i);
                   // cell.SetCellType(CellType.STRING);
                    cell.SetCellValue(r[i - 1] == null ? "" : r[i - 1].ToString());
                    cell.CellStyle = leftAlignedCellStyle;
                }
            }

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

    }
}