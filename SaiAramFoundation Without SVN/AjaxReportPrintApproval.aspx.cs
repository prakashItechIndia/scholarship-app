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
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using System.IO;

namespace SaiAramFoundation
{
    public partial class AjaxReportPrintApproval : System.Web.UI.Page
    {
        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet ds = null;
        SqlDataAdapter da = null;
        clsCommon objCommon = null;
        TableLogOnInfos crtableLogoninfos = new TableLogOnInfos();
        TableLogOnInfo crtableLogoninfo = new TableLogOnInfo();
        ConnectionInfo crConnectionInfo = new ConnectionInfo();
        Tables CrTables;
        ReportDocument rpt = new ReportDocument();
        public string strMainCategory = "";
        public string strApplicationId = "";
        public string ScholarshipId = "";

        string strQRY_ReportType = string.Empty;
        string strPrint = "";
        string strExportFile = "";


        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (Session["User_ID"] != null && Session["Roles_Id"] != null)
                {
                    int intRoleId = Convert.ToInt32(Session["Roles_Id"]);
                    if (intRoleId == 1 || intRoleId == 4 || intRoleId == 7 || intRoleId == 8)
                    {
                        strApplicationId = Request.QueryString["applnno"].ToString();
                        ScholarshipId = Request.QueryString["scholarshipId"].ToString();
                        InitializeReport();
                        GetReport(strApplicationId, ScholarshipId);
                        rpt = (ReportDocument)Session["ReportObjectPrintApparoval"];
                        Session["ReportObjectPrintApparoval"] = null;
                        //sFinalizeReport();
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

        public void InitializeReport()
        {
            crConnectionInfo.ServerName = ConfigurationManager.AppSettings["DB_ServerName"].ToString();
            crConnectionInfo.DatabaseName = ConfigurationManager.AppSettings["Database_Name"].ToString();
            crConnectionInfo.UserID = ConfigurationManager.AppSettings["User_ID"].ToString();
            crConnectionInfo.Password = ConfigurationManager.AppSettings["Password"].ToString();
        }

        //public void FinalizeReport()
        //{
        //    try
        //    {
        //        int tblCount = Convert.ToInt32(rpt.Database.Tables.Count);

        //        if (tblCount != 0)
        //        {
        //            CrTables = rpt.Database.Tables;

        //            foreach (CrystalDecisions.CrystalReports.Engine.Table CrTable in CrTables)
        //            {
        //                crtableLogoninfo = CrTable.LogOnInfo;
        //                crtableLogoninfo.ConnectionInfo = crConnectionInfo;
        //                CrTable.ApplyLogOnInfo(crtableLogoninfo);
        //            }
        //           // crvReport.ReportSource = rpt;
        //           // crvReport.SeparatePages = false;
        //            MemoryStream oStream; 
        //            if (strPrint == "Excel")
        //            {
        //               // oStream = (MemoryStream)
        //                    rpt.ExportToHttpResponse(CrystalDecisions.Shared.ExportFormatType.Excel, Response, true, strExportFile);
        //                //here i have use [ CrystalDecisions.Shared.ExportFormatType.ExcelRecord ] to Export in Excel Response.Flush(); 
        //                Response.End();
        //                rpt.Dispose();
        //                rpt.Close();
        //                rpt = null;
        //            }
        //            else
        //            {
        //              // using System.IO           
        //                oStream = (MemoryStream)
        //                rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
        //                Response.Clear();
        //                Response.Buffer = true;
        //                Response.ContentType = "application/pdf";
        //                Response.BinaryWrite(oStream.ToArray());
        //                Response.End();
        //                Response.Flush();
        //                rpt.Dispose();
        //                rpt.Close();
        //                rpt = null;
        //            }
        //        }
        //        else
        //        {
        //            Response.Redirect("Login.aspx");
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }

        //}


        private void GetReport(string strApplicationId, string strScholarshipId)
        {
            ReportDocument rpt = new ReportDocument();
            try
            {

                rpt.Load(Server.MapPath("~/Reports/rptPrintApprovalForm.rpt"));
                if (strApplicationId != "")
                {
                    rpt.SetParameterValue("@Application_Id", strApplicationId);
                    rpt.SetParameterValue("@Scholarship_Id", strScholarshipId);
                }
                else
                {
                    rpt.SetParameterValue("@Status", null);
                }

                CrTables = rpt.Database.Tables;

                foreach (CrystalDecisions.CrystalReports.Engine.Table CrTable in CrTables)
                {
                    crtableLogoninfo = CrTable.LogOnInfo;
                    crtableLogoninfo.ConnectionInfo = crConnectionInfo;
                    CrTable.ApplyLogOnInfo(crtableLogoninfo);
                }
                // crvReport.ReportSource = rpt;
                // crvReport.SeparatePages = false;
                if (strPrint == "Excel")
                {
                    rpt.ExportToHttpResponse(CrystalDecisions.Shared.ExportFormatType.Excel, Response, true, strExportFile);
                    //here i have use [ CrystalDecisions.Shared.ExportFormatType.ExcelRecord ] to Export in Excel Response.Flush(); 
                    Response.End();
                }
                else
                {
                    MemoryStream oStream = new MemoryStream(); // using System.IO           
                    //oStream = (MemoryStream)rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                    CopyStream(rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat), oStream);
                    Response.Clear();
                    Response.Buffer = true;
                    Response.ContentType = "application/pdf";
                    //Response.AddHeader("Content-Disposition", "attachment; filename=" + "ApprovalFormReport.pdf");
                   //Response.AddHeader("Content-Length", oStream.Length.ToString());
                    Response.BinaryWrite(oStream.ToArray());
                    Response.Flush();
                    Response.Close();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (rpt != null)
                {
                    rpt.Dispose();
                    rpt.Close();
                    rpt = null;
                }
            }

        }

        protected static void CopyStream(Stream input, Stream output)
        {
            byte[] buffer = new byte[16 * 1024];
            int read;
            while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
            {
                output.Write(buffer, 0, read);
            }

        }

        protected void Page_Unload(object sender, EventArgs e)
        {
            if (rpt != null)
            {
                rpt.Dispose();
                rpt.Close();
                rpt = null;
            }
        }
    }
}
