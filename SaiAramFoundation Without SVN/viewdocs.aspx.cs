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
using SaiAramFoundation;
using SaiAramFoundation.Classes;
using System.IO;
using System.Data.SqlClient;

namespace SaiAramFoundation
{
    public partial class viewdocs : System.Web.UI.Page
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
                throw ex;
            }

        }

        public void PopulateData()
        {
            SqlParameter[] Params = new SqlParameter[1];
            clsApproval objApproval = new clsApproval();
            objCommon = new clsCommon();
            cmd = new SqlCommand();
            dsData = new DataSet();
            try
            {
                lblApplnNo.Text = Request.QueryString["applnno"].ToString();
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
                cmd.Parameters.Add(new SqlParameter("@Process_Type", ""));
                cmd.Parameters.Add(new SqlParameter("@Scholarship_Id", "1"));
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    lblName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                    lblApplnNo.Text = dsData.Tables[0].Rows[0]["Application_Id"].ToString();

                }
                else
                {
                    lblError.Text = "Invalid Application Number";
                }
                strQuery = "Select";
                strQuery = strQuery + " A.Application_Id,A.DocumentType ,A.DocumentPath,A.Is_Verified ";
                strQuery = strQuery + " FROM t_esch_ApplicantDocuments A";
                strQuery = strQuery + " Where Application_Id='" + Request.QueryString["applnno"].ToString() + "'";

                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsData.Tables[0].Rows.Count; i++)
                    {
                        string DocumentType = dsData.Tables[0].Rows[i]["DocumentType"].ToString();

                        if (DocumentType == "Birth Certificate")
                        {
                            tdBirthCertificate.Visible = true;
                            tdBC.Visible = true;
                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());

                            if (ext == ".pdf")
                            {
                                aBC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                aBC.InnerText = "View" + DocumentType;
                                imgBC.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgBC.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aBC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                aBC.InnerText = "View" + DocumentType;
                            }
                        }
                        if (DocumentType == "Student ID Card")
                        {
                            tdStudentIdCertificate.Visible = true;
                            tdSID.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aStuID.InnerText = "View" + DocumentType;
                                aStuID.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgStuID.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgStuID.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aStuID.InnerText = "View" + DocumentType;
                                aStuID.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }

                        }
                        if (DocumentType == "Ration Card")
                        {
                            tdRationCertificate.Visible = true;
                            tdRC.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aRC.InnerText = "View" + DocumentType;
                                aRC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgRC.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgRC.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aRC.InnerText = "View" + DocumentType;
                                aRC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (DocumentType == "Voter ID")
                        {
                            tdVoterCertificate.Visible = true;
                            tdVC.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aVD.InnerText = "View" + DocumentType;
                                aVD.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgVD.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgVD.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aVD.InnerText = "View" + DocumentType;
                                aVD.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (DocumentType == "Pan Card")
                        {
                            tdPanCardCertificate.Visible = true;
                            tdPC.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aPC.InnerText = "View" + DocumentType;
                                aPC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgPC.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgPC.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aPC.InnerText = "View" + DocumentType;
                                aPC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (DocumentType == "Driving License")
                        {
                            tdDrivingLicense.Visible = true;
                            tdDL.Visible = true;
                           
                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aDD.InnerText = "View" + DocumentType;
                                aDD.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgDD.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgDD.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aDD.InnerText = "View" + DocumentType;
                                aDD.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (DocumentType == "Bank Pass Book")
                        {
                            tdBankPassBookCertificate.Visible = true;
                            tdBPB.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aBPB.InnerText = "View" + DocumentType;
                                aBPB.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgBPB.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgBPB.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aBPB.InnerText = "View" + DocumentType;
                                aBPB.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (DocumentType == "Aadhar ID")
                        {
                            tdAadhaarIdBirthCertificate.Visible = true;
                            tdAID.Visible = true;
                           
                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aAID.InnerText = "View" + DocumentType;
                                aAID.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgAID.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgAID.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aAID.InnerText = "View" + DocumentType;
                                aAID.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }

                        if (DocumentType == "Bonafide-Student")
                        {
                            tdBonafideStudent.Visible = true;
                            tdBS.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aBS.InnerText = "View" + DocumentType;
                                aBS.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgBS.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgBS.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aBS.InnerText = "View" + DocumentType;
                                aBS.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }

                        if (DocumentType == "Bonafide-Parent")
                        {
                            tdBonafideParent.Visible = true;
                            tdBP.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aBP.InnerText = "View" + DocumentType;
                                aBP.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgBP.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgBP.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aBP.InnerText = "View" + DocumentType;
                                aBP.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }

                        if (DocumentType == "Academic Performance")
                        {
                            tdAcademicPerformance.Visible = true;
                            tdAP.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aAP.InnerText = "View" + DocumentType;
                                aAP.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgAP.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgAP.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aAP.InnerText = "View" + DocumentType;
                                aAP.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }

                        if (DocumentType == "Student Letter")
                        {
                            tdLetter.Visible = true;
                            tdL.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            if (ext == ".pdf")
                            {
                                aL.InnerText = "View" + DocumentType;
                                aL.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgL.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgL.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aL.InnerText = "View" + DocumentType;
                                aL.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }

                        string jk = DocumentType;
                        string sp1 = jk.Substring(0, jk.Length - 8);
                        string sp2 = jk.Substring(sp1.Length + 1, 7);

                        if (sp2 == "sports1")
                        {
                            tdSport1.Visible = true;
                            tdSp1.Visible = true;
                            
                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC1.Text = sp1;
                            if (ext == ".pdf")
                            {
                                aS1.InnerText = "View" + sp1;
                                aS1.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgS1.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgS1.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aS1.InnerText = "View" + sp1;
                                aS1.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (sp2 == "sports2")
                        {
                            tdSport2.Visible = true;
                            tdSp2.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC2.Text = sp1;
                            if (ext == ".pdf")
                            {
                                aS2.InnerText = "View" + sp1;
                                aS2.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgS2.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgS2.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aS2.InnerText = "View" + sp1;
                                aS2.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (sp2 == "sports3")
                        {
                            tdSport3.Visible = true;
                            tdSp3.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC3.Text = sp1;
                            if (ext == ".pdf")
                            {
                                aS3.InnerText = "View" + sp1;
                                aS3.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgS3.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgS3.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aS3.InnerText = "View" + sp1;
                                aS3.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (sp2 == "sports4")
                        {
                            tdSport4.Visible = true;
                            tdSp4.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC4.Text = sp1;
                            if (ext == ".pdf")
                            {
                                aS4.InnerText = "View" + sp1;
                                aS4.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgS4.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgS4.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aS4.InnerText = "View" + sp1;
                                aS4.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                        if (sp2 == "sports5")
                        {
                            tdSport5.Visible = true;
                            tdSp5.Visible = true;

                            string ext = System.IO.Path.GetExtension(dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC5.Text = sp1;
                            if (ext == ".pdf")
                            {
                                aS5.InnerText = "View" + sp1;
                                aS5.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                imgS5.ImageUrl = "~/images/logo-pdf.jpg";
                            }
                            else
                            {
                                imgS5.ImageUrl = "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                                aS5.InnerText = "View" + sp1;
                                aS5.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            }
                        }
                    }
                }
                else
                {
                    Response.Write("<script>window.open('Login.aspx',target='_top');</script>");
                }
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
                cmd = null;
                dsData = null;

            }

        }
    }
}
