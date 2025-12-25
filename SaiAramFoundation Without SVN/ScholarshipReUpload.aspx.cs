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
    public partial class ScholarshipReUpload : System.Web.UI.Page
    {

        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet ds = null;
        SqlDataAdapter da = null;
        clsCommon objCommon = null;
        public string strVerify = null;

        protected void Page_Load(object sender, EventArgs e)
        {
            clsApproval objApproval = new clsApproval();
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();


            try
            {
                if (Session["User_ID"] != null && Session["Roles_Id"] != null)
                {
                    if (Request.QueryString["applnno"] != null)
                    {
                        lblApplnNo.Text = Request.QueryString["applnno"].ToString();

                        connSql = new SqlConnection(objCommon.GetConnectionString());

                        strQuery = "Select";
                        strQuery = strQuery + " AP.Application_Id,AP.DocumentType ,AP.DocumentPath,AP.Is_Verified ,SY.ScholarshipYear_Name,R.Applicant_Name ";
                        strQuery = strQuery + " FROM t_esch_ApplicantDocuments AP ";
                        strQuery = strQuery + " left outer join t_Registration R on AP.Application_Id=R.Application_Id,T_Scholarship_Year SY ";
                        strQuery = strQuery + " Where AP.Application_Id='" + Request.QueryString["applnno"].ToString() + "'and Sy.ScholarshipYear_Id=R.Scholarship_Year_Id";

                        Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                        dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);

                        if (dsData.Tables[0].Rows.Count > 0)
                        {
                            lblSchlorshipYear.Text = dsData.Tables[0].Rows[0]["ScholarshipYear_Name"].ToString();
                            lblStudentName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                            for (int i = 0; i < dsData.Tables[0].Rows.Count; i++)
                            {
                                string DocumentType = dsData.Tables[0].Rows[i]["DocumentType"].ToString();
                                int intTempVerify = Convert.ToInt32(dsData.Tables[0].Rows[i]["Is_Verified"]);

                                if (DocumentType == "Birth Certificate")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        //rfvFile1.Visible = true;
                                        //rfvFile1.Enabled = true;
                                    }
                                    else
                                    {
                                        aBirthCertificate.Visible = true;
                                        aBirthCertificate.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }

                                if (DocumentType == "Student ID Card")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile2.Visible = true;
                                        rfvFile2.Enabled = true;
                                    }
                                    else
                                    {
                                        aStudentIDCard.Visible = true;
                                        aStudentIDCard.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }

                                if (DocumentType == "Ration Card")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile3.Visible = true;
                                        rfvFile3.Enabled = true;
                                    }
                                    else
                                    {
                                        aRationCard.Visible = true;
                                        aRationCard.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }

                                if (DocumentType == "Voter ID")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile4.Visible = true;
                                        rfvFile4.Enabled = true;
                                    }
                                    else
                                    {
                                        aVoter.Visible = true;
                                        aVoter.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }

                                if (DocumentType == "Pan Card")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile8.Visible = true;
                                        rfvFile8.Enabled = true;
                                    }
                                    else
                                    {
                                        aPanCard.Visible = true;
                                        aPanCard.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }

                                if (DocumentType == "Driving License")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile5.Visible = true;
                                        rfvFile5.Enabled = true;
                                    }
                                    else
                                    {
                                        aDrivingLicense.Visible = true;
                                        aDrivingLicense.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }

                                if (DocumentType == "Bank Pass Book")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile6.Visible = true;
                                        rfvFile6.Enabled = true;
                                    }
                                    else
                                    {
                                        aBankPassBook.Visible = true;
                                        aBankPassBook.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }

                                if (DocumentType == "Aadhar ID")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile7.Visible = true;
                                        rfvFile7.Enabled = true;
                                    }
                                    else
                                    {
                                        aAadharID.Visible = true;
                                        aAadharID.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                                if (DocumentType == "Bonafide-Student")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile9.Visible = true;
                                        rfvFile9.Enabled = true;
                                    }
                                    else
                                    {
                                        aBonafideStudent.Visible = true;
                                        aBonafideStudent.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                                if (DocumentType == "Bonafide-Parent")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile10.Visible = true;
                                        rfvFile10.Enabled = true;
                                    }
                                    else
                                    {
                                        aBonafideParent.Visible = true;
                                        aBonafideParent.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                                if (DocumentType == "Academic Performance")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile11.Visible = true;
                                        rfvFile11.Enabled = true;
                                    }
                                    else
                                    {
                                        aAcademicPerformance.Visible = true;
                                        aAcademicPerformance.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                                if (DocumentType == "Student Letter")
                                {
                                    if (intTempVerify == 1)
                                    {
                                        strVerify = strVerify + DocumentType + ",";
                                        rfvFile12.Visible = true;
                                        rfvFile12.Enabled = true;
                                    }
                                    else
                                    {
                                        aLetter.Visible = true;
                                        aLetter.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }

                                string jk = DocumentType;
                                string sp1 = jk.Substring(0, jk.Length - 8);
                                string sp2 = jk.Substring(sp1.Length + 1, 7);

                                if (sp2 == "sports1")
                                {
                                    trDoc1.Visible = true;
                                    if (intTempVerify == 1)
                                    {
                                        txtUploadDoc1.Enabled = false;
                                        txtUploadDoc1.Text = sp1;
                                        strVerify = strVerify + sp1 + ",";
                                        RequiredFieldValidator1.Visible = true;
                                        RequiredFieldValidator1.Enabled = true;
                                    }
                                    else
                                    {
                                        txtUploadDoc1.Enabled = false;
                                        txtUploadDoc1.Text = sp1;
                                        aC1.Visible = true;
                                        aC1.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                                if (sp2 == "sports2")
                                {
                                    trDoc2.Visible = true;
                                    if (intTempVerify == 1)
                                    {
                                        txtUploadDoc2.Enabled = false;
                                        txtUploadDoc2.Text = sp1;
                                        strVerify = strVerify + sp1 + ",";
                                        RequiredFieldValidator2.Visible = true;
                                        RequiredFieldValidator2.Enabled = true;
                                    }
                                    else
                                    {
                                        txtUploadDoc2.Enabled = false;
                                        txtUploadDoc2.Text = sp1;
                                        aC2.Visible = true;
                                        aC2.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                                if (sp2 == "sports3")
                                {
                                    trDoc3.Visible = true;
                                    if (intTempVerify == 1)
                                    {
                                        txtUploadDoc3.Enabled = false;
                                        txtUploadDoc3.Text = sp1;
                                        strVerify = strVerify + sp1 + ",";
                                        RequiredFieldValidator3.Visible = true;
                                        RequiredFieldValidator3.Enabled = true;
                                    }
                                    else
                                    {
                                        txtUploadDoc3.Enabled = false;
                                        txtUploadDoc3.Text = sp1;
                                        aC3.Visible = true;
                                        aC3.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                                if (sp2 == "sports4")
                                {
                                    trDoc4.Visible = true;
                                    if (intTempVerify == 1)
                                    {
                                        txtUploadDoc4.Enabled = false;
                                        txtUploadDoc4.Text = sp1;
                                        strVerify = strVerify + sp1 + ",";
                                        RequiredFieldValidator4.Visible = true;
                                        RequiredFieldValidator4.Enabled = true;
                                    }
                                    else
                                    {
                                        txtUploadDoc4.Enabled = false;
                                        txtUploadDoc4.Text = sp1;
                                        aC4.Visible = true;
                                        aC4.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                                if (sp2 == "sports5")
                                {
                                    trDoc5.Visible = true;
                                    if (intTempVerify == 1)
                                    {
                                        txtUploadDoc5.Enabled = false;
                                        txtUploadDoc5.Text = sp1;
                                        strVerify = strVerify + sp1 + ",";
                                        RequiredFieldValidator5.Visible = true;
                                        RequiredFieldValidator5.Enabled = true;
                                    }
                                    else
                                    {
                                        txtUploadDoc5.Enabled = false;
                                        txtUploadDoc5.Text = sp1;
                                        aC5.Visible = true;
                                        aC5.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                    }
                                }
                            }

                            lblverified.Text = "This Documents are not verified : " + strVerify.ToString().TrimEnd(',');
                        }
                    }
                    else
                    {
                        Response.Write("<script>window.open('Login.aspx',target='_top');</script>");
                    }
                }
                else
                {
                    Response.Write("<script>window.open('Login.aspx',target='_top');</script>");
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
            finally
            {

            }
        }

        private bool checkFileType(string file1, string file2, string file3, string file4, string file5, string file6, string file7, string file8)
        {
            file1 = Path.GetExtension(fuBirthCertificate.FileName);
            file2 = Path.GetExtension(fuStudentIDCard.FileName);
            file3 = Path.GetExtension(fuRationCard.FileName);
            file4 = Path.GetExtension(fuVoter.FileName);
            file5 = Path.GetExtension(fuPanCard.FileName);
            file6 = Path.GetExtension(fuDrivingLicense.FileName);
            file7 = Path.GetExtension(fuBankPassBook.FileName);
            file8 = Path.GetExtension(fuAadharID.FileName);
            bool flag = false;
            string[] strFiles = { file1, file2, file3, file4, file5, file6, file7, file8 };
            for (int i = 0; i < strFiles.Length; i++)
            {
                switch (strFiles[i].ToLower())
                {
                    case ".pdf":
                    case ".jpg":
                    case ".png":
                        flag = true;
                        break;
                    default:
                        return false;
                        break;
                }
            }
            return flag;
        }

        protected void btnUpload_Click(object sender, EventArgs e)
        {
            SqlTransaction objTransaction = null;
            SqlCommand SqlCmd = null;
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            string strDocumentType = "";
            string strDocumentPath = "";
            string strBDocumentType = "";
            string strBDocumentPath = "";
            string strSDocumentType = "";
            string strSDocumentPath = "";
            string strRDocumentType = "";
            string strRDocumentPath = "";
            string strVDocumentType = "";
            string strVDocumentPath = "";
            string strPDocumentType = "";
            string strPDocumentPath = "";
            string strDDocumentType = "";
            string strDDocumentPath = "";
            string strBPDocumentType = "";
            string strBPDocumentPath = "";
            string strADocumentType = "";
            string strADocumentPath = "";
            string strSBDocumentType = "";
            string strSBDocumentPath = "";
            string strPBDocumentType = "";
            string strPBDocumentPath = "";
            string strAPDocumentType = "";
            string strAPDocumentPath = "";
            string strLDocumentType = "";
            string strLDocumentPath = "";
            string strApplicationNo = "";
            string[] ayDocumentType;
            string[] ayDocumentPath;
            int intRegistrationID = 0;
            clsApproval objApprove = new clsApproval();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = "Select";
                strQuery = strQuery + " Application_Id,DocumentType ,DocumentPath ";
                strQuery = strQuery + " FROM t_esch_ApplicantDocuments ";
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
                            strBDocumentType = DocumentType;
                            strBDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Student ID Card")
                        {
                            strSDocumentType = DocumentType;
                            strSDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Ration Card")
                        {
                            strRDocumentType = DocumentType;
                            strRDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Voter ID")
                        {
                            strVDocumentType = DocumentType;
                            strVDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Pan Card")
                        {
                            strPDocumentType = DocumentType;
                            strPDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Driving License")
                        {
                            strDDocumentType = DocumentType;
                            strDDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Bank Pass Book")
                        {
                            strBPDocumentType = DocumentType;
                            strBPDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Aadhar ID")
                        {
                            strADocumentType = DocumentType;
                            strADocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Bonafide-Student")
                        {
                            strSBDocumentType = DocumentType;
                            strSBDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Bonafide-Parent")
                        {
                            strPBDocumentType = DocumentType;
                            strPBDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Academic Performance")
                        {
                            strAPDocumentType = DocumentType;
                            strAPDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                        if (DocumentType == "Student Letter")
                        {
                            strLDocumentType = DocumentType;
                            strLDocumentPath = dsData.Tables[0].Rows[i]["DocumentPath"].ToString();
                        }
                    }
                }
                strApplicationNo = lblApplnNo.Text;

                string strBirthCertificate = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_BirthCertificate" + Path.GetExtension(fuBirthCertificate.FileName);
                string strStudentIDCard = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_StudentIDCard" + Path.GetExtension(fuStudentIDCard.FileName);
                string strRationCard = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_RationCard" + Path.GetExtension(fuRationCard.FileName);
                string strVoterID = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_VoterID" + Path.GetExtension(fuVoter.FileName);
                string strPanCard = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_PanCard" + Path.GetExtension(fuPanCard.FileName);
                string strDrivingLicense = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_DrivingLicense" + Path.GetExtension(fuDrivingLicense.FileName);
                string strBankPassBook = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_BankPassBook" + Path.GetExtension(fuBankPassBook.FileName);
                string strAadharID = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_AadharID" + Path.GetExtension(fuAadharID.FileName);
                string strBonafideStudent = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_BonafideStudent" + Path.GetExtension(fuBonafideStudent.FileName);
                string strBonafideParent = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_BonafideParent" + Path.GetExtension(fuBonafideParent.FileName);
                string strAcademicPerformance = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_AcademicPerformance" + Path.GetExtension(fuAcademicPerformance.FileName);
                string strLetter = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_Letter" + Path.GetExtension(fuLetter.FileName);

                createDir(strApplicationNo);
                if (fuBirthCertificate.HasFile)
                {
                    fuBirthCertificate.SaveAs(MapPath("~" + strBirthCertificate));
                    strDocumentType = strDocumentType + "Birth Certificate,";
                    strDocumentPath = strDocumentPath + strBirthCertificate + ",";

                }
                else
                {
                    strDocumentType = strBDocumentType + ",";
                    strDocumentPath = strBDocumentPath + ",";
                }
                if (fuStudentIDCard.HasFile)
                {
                    fuStudentIDCard.SaveAs(MapPath("~" + strStudentIDCard));
                    strDocumentType = strDocumentType + "Student ID Card,";
                    strDocumentPath = strDocumentPath + strStudentIDCard + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strSDocumentType + ",";
                    strDocumentPath = strDocumentPath + strSDocumentPath + ",";
                }
                if (fuRationCard.HasFile)
                {
                    fuRationCard.SaveAs(MapPath("~" + strRationCard));
                    strDocumentType = strDocumentType + "Ration Card,";
                    strDocumentPath = strDocumentPath + strRationCard + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strRDocumentType + ",";
                    strDocumentPath = strDocumentPath + strRDocumentPath + ",";
                }
                if (fuVoter.HasFile)
                {
                    fuVoter.SaveAs(MapPath("~" + strVoterID));
                    strDocumentType = strDocumentType + "Voter ID,";
                    strDocumentPath = strDocumentPath + strVoterID + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strVDocumentType + ",";
                    strDocumentPath = strDocumentPath + strVDocumentPath + ",";
                }
                if (fuPanCard.HasFile)
                {
                    fuPanCard.SaveAs(MapPath("~" + strPanCard));
                    strDocumentType = strDocumentType + "Pan Card,";
                    strDocumentPath = strDocumentPath + strPanCard + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strPDocumentType + ",";
                    strDocumentPath = strDocumentPath + strPDocumentPath + ",";
                }
                if (fuDrivingLicense.HasFile)
                {
                    fuDrivingLicense.SaveAs(MapPath("~" + strDrivingLicense));
                    strDocumentType = strDocumentType + "Driving License,";
                    strDocumentPath = strDocumentPath + strDrivingLicense + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strDDocumentType + ",";
                    strDocumentPath = strDocumentPath + strDDocumentPath + ",";
                }
                if (fuBankPassBook.HasFile)
                {
                    fuBankPassBook.SaveAs(MapPath("~" + strBankPassBook));
                    strDocumentType = strDocumentType + "Bank Pass Book,";
                    strDocumentPath = strDocumentPath + strBankPassBook + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strBPDocumentType + ",";
                    strDocumentPath = strDocumentPath + strBPDocumentPath + ",";
                }
                if (fuAadharID.HasFile)
                {
                    fuAadharID.SaveAs(MapPath("~" + strAadharID));
                    strDocumentType = strDocumentType + "Aadhar ID,";
                    strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strADocumentType + ",";
                    strDocumentPath = strDocumentPath + strADocumentPath + ",";
                }

                if (fuBonafideStudent.HasFile)
                {
                    fuBonafideStudent.SaveAs(MapPath("~" + strBonafideStudent));
                    strDocumentType = strDocumentType + "Bonafide-Student,";
                    strDocumentPath = strDocumentPath + strBonafideStudent + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strSBDocumentType + ",";
                    strDocumentPath = strDocumentPath + strSBDocumentPath + ",";
                }
                if (fuBonafideParent.HasFile)
                {
                    fuBonafideParent.SaveAs(MapPath("~" + strBonafideParent));
                    strDocumentType = strDocumentType + "Bonafide-Parent,";
                    strDocumentPath = strDocumentPath + strBonafideParent + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strPBDocumentType + ",";
                    strDocumentPath = strDocumentPath + strPBDocumentPath + ",";
                }
                if (fuAcademicPerformance.HasFile)
                {
                    fuAcademicPerformance.SaveAs(MapPath("~" + strAcademicPerformance));
                    strDocumentType = strDocumentType + "Academic Performance,";
                    strDocumentPath = strDocumentPath + strAcademicPerformance + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strAPDocumentType + ",";
                    strDocumentPath = strDocumentPath + strAPDocumentPath + ",";
                }
                if (fuLetter.HasFile)
                {
                    fuLetter.SaveAs(MapPath("~" + strLetter));
                    strDocumentType = strDocumentType + "Student Letter,";
                    strDocumentPath = strDocumentPath + strLetter + ",";
                }
                else
                {
                    strDocumentType = strDocumentType + strLDocumentType + ",";
                    strDocumentPath = strDocumentPath + strLDocumentPath + ",";
                }

                if (fuUploadDoc1.HasFile)
                {
                    string strUploadDoc1 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc1.Text + Path.GetExtension(fuUploadDoc1.FileName);
                    fuUploadDoc1.SaveAs(MapPath("~" + strUploadDoc1));
                    strDocumentType = strDocumentType + txtUploadDoc1.Text;
                    strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuUploadDoc2.HasFile)
                {
                    string strUploadDoc2 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc2.Text + Path.GetExtension(fuUploadDoc2.FileName);
                    fuUploadDoc2.SaveAs(MapPath("~" + strUploadDoc2));
                    strDocumentType = strDocumentType + txtUploadDoc2.Text;
                    strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuUploadDoc3.HasFile)
                {
                    string strUploadDoc3 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc3.Text + Path.GetExtension(fuUploadDoc3.FileName);
                    fuUploadDoc3.SaveAs(MapPath("~" + strUploadDoc3));
                    strDocumentType = strDocumentType + txtUploadDoc3.Text;
                    strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuUploadDoc4.HasFile)
                {
                    string strUploadDoc4 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc4.Text + Path.GetExtension(fuUploadDoc4.FileName);
                    fuUploadDoc4.SaveAs(MapPath("~" + strUploadDoc4));
                    strDocumentType = strDocumentType + txtUploadDoc4.Text;
                    strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuUploadDoc5.HasFile)
                {
                    string strUploadDoc5 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc5.Text + Path.GetExtension(fuUploadDoc5.FileName);
                    fuUploadDoc1.SaveAs(MapPath("~" + strUploadDoc5));
                    strDocumentType = strDocumentType + txtUploadDoc5.Text;
                    strDocumentPath = strDocumentPath + strAadharID + ",";
                }

                strDocumentType = strDocumentType.TrimEnd(',');
                strDocumentPath = strDocumentPath.TrimEnd(',');
                ayDocumentType = strDocumentType.Split(',');
                ayDocumentPath = strDocumentPath.Split(',');

                //Save uploaded document
                if (sqlConn.State != ConnectionState.Open)
                {
                    sqlConn.Open();
                }
                SqlCmd = new SqlCommand();
                //SqlCmd.CommandText = "USP_SAVESCHOLERSHIP";
                //SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Connection = sqlConn;

                for (int intI = 0; intI < ayDocumentType.Length; intI++)
                {
                    intRegistrationID = GetRegistrationID(strApplicationNo);
                    SqlCmd.CommandText = "USP_SAVE_ReUploadDocument";
                    SqlCmd.CommandType = CommandType.StoredProcedure;
                    SqlCmd.Parameters.Add(new SqlParameter("@Registration_ID", intRegistrationID));
                    SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", strApplicationNo));
                    SqlCmd.Parameters.Add(new SqlParameter("@DocumentType", ayDocumentType[intI]));
                    SqlCmd.Parameters.Add(new SqlParameter("@DocumentPath", ayDocumentPath[intI]));
                    SqlCmd.ExecuteNonQuery();
                    //objTransaction.Commit();    
                    // objApprove.UpdateHistory(lblApplnNo.Text, ayDocumentType[intI] + " - " + ayDocumentPath[intI], "Document Uploaded", Session["User_ID"].ToString());
                    SqlCmd.Parameters.Clear();
                }
                objApprove.UpdateHistory(lblApplnNo.Text, "Following Invaild Document Reuploaded : <b> " + strVerify.ToString().TrimEnd(',') + "</b>", "Initial Document ReUploaded", Session["User_ID"].ToString());
                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();

                //string strText = "Upload Documents <b> " + txtApprovedAmt.Text.Trim().ToString() + " </b> by <b> " + Session["User_ID"].ToString() + " </b>";


                dvform.Visible = false;
                dvSuccess.Visible = true;

                lblSuccess.Text = "Document ReUpload completed succesfully thank you!";
                Response.Write("<script>window.open('UploadDocument.aspx',target='_top');</script>");

            }
            catch (System.IO.DirectoryNotFoundException)
            {
                createDir(strApplicationNo);
                if (objTransaction != null) objTransaction.Rollback();
                throw;
            }
        }
        private void createDir(string strApplicationNo)
        {
            //DirectoryInfo myDir = new DirectoryInfo(MapPath("~/Admissions12/StudentDocs/" + DecryptQueryString(Request.QueryString["appln_no"].ToString())+"/"));
            DirectoryInfo myDir = new DirectoryInfo(MapPath("~/ScholerShipData/" + strApplicationNo.ToString() + "/"));
            myDir.Create();
        }

        protected int GetRegistrationID(string strApplicationNo)
        {
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            int intRegistrationID = 0;

            try
            {
                if (sqlConn.State != ConnectionState.Open)
                {
                    sqlConn.Open();
                }
                SqlCmd = new SqlCommand();
                SqlCmd.CommandText = "USP_GET_REgistreation_Id";
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", strApplicationNo));
                SqlCmd.Connection = sqlConn;
                intRegistrationID = Convert.ToInt32(SqlCmd.ExecuteScalar());

                SqlCmd.Dispose();
                return intRegistrationID;

            }
            catch (Exception ex)
            {
                return 0;
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


    }
}
