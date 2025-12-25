using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Drawing;
using System.IO;
using System.Data;
using SaiAramFoundation.Classes;

namespace SaiAramFoundation
{
    public partial class ExportExcel : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string strKey = Request.QueryString["key"];
            if (strKey == "Excel")
            {
                BindExcel();
            }
            else
            {
                BindWord();
            }
        }
        public void BindExcel()
        {
            DataSet ds = new DataSet();
            ds = (DataSet)Session["OldDataset"];
            try
            {
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response.ClearContent();
                        Response.Buffer = true;
                        Response.AddHeader("content-disposition", string.Format("attachment; filename={0}", "Admitted_Students.xls"));
                        Response.ContentType = "application/ms-excel";
                        StringWriter sw = new StringWriter();
                        HtmlTextWriter htw = new HtmlTextWriter(sw);
                        GridView gvdetails = new GridView();

                        List<clsExcelVariables> lstStudent = new List<clsExcelVariables>();
                        lstStudent = (from DataRow drRow in ds.Tables[0].Rows
                                      select new clsExcelVariables
                                      {
                                        Application_Id = drRow["Application_Id"].ToString(),
                                        Applicant_Name = drRow["Applicant_Name"].ToString(),                                          
                                        Class_Studying = drRow["Class_Studying"].ToString(),
                                        Board_Of_Studying = drRow["Board_Of_Studying"].ToString(),
                                        Cource_Of_Studying = drRow["Cource_Of_Studying"].ToString(),
                                        Degree = drRow["Degree"].ToString(),
                                        Other_Degree = drRow["Other_Degree"].ToString(),
                                        Ph_D = drRow["Ph_D"].ToString(),
                                        Specialization = drRow["Specialization"].ToString(),                                         
                                        Institution_Name = drRow["Institution_Name"].ToString(),
                                        Father_AnnualIncome = drRow["Father_AnnualIncome"].ToString(),
                                        Mobile_Number = drRow["Mobile_Number"].ToString(),
                                        Address = drRow["Address_Line1"].ToString()+","+drRow["City"].ToString()+","+drRow["Country"].ToString(),
                                        DOB = drRow["Date_Of_Birth"].ToString(),
                                        Father_Occupation = drRow["Father_Occupation"].ToString()
                                        }).ToList();



                        gvdetails.DataSource = lstStudent;
                        gvdetails.DataBind();
                        gvdetails.AllowPaging = false;

                        //Change the Header Row back to white color
                        gvdetails.HeaderRow.Style.Add("background-color", "#FFFFFF");
                        //Applying stlye to gridview header cells
                        for (int i = 0; i < gvdetails.HeaderRow.Cells.Count; i++)
                        {
                            gvdetails.HeaderRow.Cells[i].Style.Add("background-color", "#507CD1");
                        }
                        int j = 1;
                        //This loop is used to apply stlye to cells based on particular row
                        foreach (GridViewRow gvrow in gvdetails.Rows)
                        {
                            gvrow.BackColor = Color.White;
                            if (j <= gvdetails.Rows.Count)
                            {
                                if (j % 2 != 0)
                                {
                                    for (int k = 0; k < gvrow.Cells.Count; k++)
                                    {
                                        gvrow.Cells[k].Style.Add("background-color", "#EFF3FB");
                                    }
                                }
                            }
                            j++;
                        }

                        gvdetails.RenderControl(htw);
                        Response.Write(sw.ToString());
                        Response.End();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void BindWord()
        {
            HttpResponse Response = HttpContext.Current.Response;
            DataSet ds = new DataSet();
            ds = (DataSet)Session["OldDataset"];
            try
            {
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response.ClearContent();
                        Response.AddHeader("content-disposition", string.Format("attachment; filename={0}", "Admitted_Students.doc"));
                        Response.Charset = "";
                        Response.ContentType = "application/ms-word";
                        StringWriter sw = new StringWriter();
                        HtmlTextWriter htw = new HtmlTextWriter(sw);
                        GridView gvdetails = new GridView();
                        List<clsExcelVariables> lstStudent = new List<clsExcelVariables>();
                        lstStudent = (from DataRow drRow in ds.Tables[0].Rows
                                      select new clsExcelVariables
                                      {
                                          Application_Id = drRow["Application_Id"].ToString(),
                                          Applicant_Name = drRow["Applicant_Name"].ToString(),
                                          Class_Studying = drRow["Class_Studying"].ToString(),
                                          Board_Of_Studying = drRow["Board_Of_Studying"].ToString(),
                                          Cource_Of_Studying = drRow["Cource_Of_Studying"].ToString(),
                                          Degree = drRow["Degree"].ToString(),
                                          Other_Degree = drRow["Other_Degree"].ToString(),
                                          Ph_D = drRow["Ph_D"].ToString(),
                                          Specialization = drRow["Specialization"].ToString(),
                                          Institution_Name = drRow["Institution_Name"].ToString(),
                                          Father_AnnualIncome = drRow["Father_AnnualIncome"].ToString(),
                                          Mobile_Number = drRow["Mobile_Number"].ToString(),
                                          Address = drRow["Address_Line1"].ToString() + "," + drRow["City"].ToString() + "," + drRow["Country"].ToString(),
                                          DOB = drRow["Date_Of_Birth"].ToString(),
                                          Father_Occupation = drRow["Father_Occupation"].ToString()
                                                               
                                       }).ToList();


                        gvdetails.DataSource = lstStudent;
                        gvdetails.DataBind();
                        gvdetails.AllowPaging = false;
                        //Change the Header Row back to white color
                        gvdetails.HeaderRow.Style.Add("background-color", "#FFFFFF");
                        //Applying stlye to gridview header cells
                        for (int i = 0; i < gvdetails.HeaderRow.Cells.Count; i++)
                        {
                            gvdetails.HeaderRow.Cells[i].Style.Add("background-color", "#507CD1");
                        }
                        int j = 1;
                        //This loop is used to apply stlye to cells based on particular row
                        foreach (GridViewRow gvrow in gvdetails.Rows)
                        {
                            gvrow.BackColor = Color.White;
                            if (j <= gvdetails.Rows.Count)
                            {
                                if (j % 2 != 0)
                                {
                                    for (int k = 0; k < gvrow.Cells.Count; k++)
                                    {
                                        gvrow.Cells[k].Style.Add("background-color", "#EFF3FB");
                                    }
                                }
                            }
                            j++;
                        }

                        gvdetails.RenderControl(htw);
                        Response.Write(sw.ToString());
                        Response.End();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
