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
    public partial class UploadPopup : System.Web.UI.Page
    {

        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet ds = null;
        SqlDataAdapter da = null;
        clsCommon objCommon = null;

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
                        //strQuery1 = "Select";
                        //strQuery1 = strQuery1 + " Aadhaar_ID,Pan_ID  ";
                        //strQuery1 = strQuery1 + " FROM t_esch_Registration ";
                        //strQuery1 = strQuery1 + " Where Application_Id='" + Request.QueryString["applnno"].ToString() + "'";

                        //Param[0] = new SqlParameter("@Statement", strQuery1.ToString());
                        //dsDataSet = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Param);

                        //string adherId = dsDataSet.Tables[0].Rows[0]["Aadhaar_ID"].ToString();
                        //string paneId = dsDataSet.Tables[0].Rows[0]["Pan_ID"].ToString();

                        lblApplnNo.Text = Request.QueryString["applnno"].ToString();

                        connSql = new SqlConnection(objCommon.GetConnectionString());

                        strQuery = "Select";
                        strQuery = strQuery + " AP.Application_Id,AP.DocumentType ,AP.DocumentPath,SY.ScholarshipYear_Name,R.Applicant_Name, R.Aadhaar_ID, R.Pan_ID, R.Photo";
                        strQuery = strQuery + " FROM t_esch_ApplicantDocuments AP ";
                        strQuery = strQuery + " left outer join t_Registration R on AP.Application_Id=R.Application_Id,T_Scholarship_Year SY ";
                        strQuery = strQuery + " Where AP.Application_Id='" + Request.QueryString["applnno"].ToString() + "'and Sy.ScholarshipYear_Id=R.Scholarship_Year_Id";

                        Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                        dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);

                        if (dsData.Tables[0].Rows.Count > 0)
                        {
                            lblSchlorshipYear.Text = dsData.Tables[0].Rows[0]["ScholarshipYear_Name"].ToString();
                            lblStudentName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();

                            string adherId = dsData.Tables[0].Rows[0]["Aadhaar_ID"].ToString();
                            string paneId = dsData.Tables[0].Rows[0]["Pan_ID"].ToString();
                            if (!string.IsNullOrEmpty(adherId))
                                lblAdharReq.Visible = true;
                            else
                                lblAdharReq.Visible = false;

                            if (!string.IsNullOrEmpty(paneId))
                                lblPanReq.Visible = true;
                            else
                                lblPanReq.Visible = false;

                            string photPath = dsData.Tables[0].Rows[0]["Photo"].ToString();
                            if (!string.IsNullOrEmpty(photPath))
                            {
                                aStudentPhoto.Visible = true;
                                aStudentPhoto.Attributes.Add("href", "~" + dsData.Tables[0].Rows[0]["Photo"].ToString());
                            }


                            for (int i = 0; i < dsData.Tables[0].Rows.Count; i++)
                            {
                                string DocumentType = dsData.Tables[0].Rows[i]["DocumentType"].ToString();
                                if (DocumentType == "Birth Certificate")
                                {
                                    aBirthCertificate.Visible = true;
                                    aBirthCertificate.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Student ID Card")
                                {
                                    aStudentIDCard.Visible = true;
                                    aStudentIDCard.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Ration Card")
                                {
                                    aRationCard.Visible = true;
                                    aRationCard.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Voter ID")
                                {
                                    aVoter.Visible = true;
                                    aVoter.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Pan Card")
                                {
                                    aPanCard.Visible = true;
                                    aPanCard.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Driving License")
                                {
                                    aDrivingLicense.Visible = true;
                                    aDrivingLicense.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Bank Pass Book")
                                {
                                    aBankPassBook.Visible = true;
                                    aBankPassBook.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Aadhar ID")
                                {
                                    aAadharID.Visible = true;
                                    aAadharID.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Bonafide-Student")
                                {
                                    aBonafideStudent.Visible = true;
                                    aBonafideStudent.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Bonafide-Parent")
                                {
                                    aBonafideParent.Visible = true;
                                    aBonafideParent.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Academic Performance")
                                {
                                    aAcademicPerformance.Visible = true;
                                    aAcademicPerformance.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                                if (DocumentType == "Student Letter")
                                {
                                    aLetter.Visible = true;
                                    aLetter.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                                }
                            }
                        }
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
            string strQuery1 = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            SqlParameter[] Param = new SqlParameter[1];
            DataSet dsData = new DataSet();
            DataSet dsDataSet = new DataSet();
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
            string strHasDocumentType = "";
            string[] ayDocumentType;
            string[] ayDocumentPath;
            int intRegistrationID = 0;
            int UserId = 0;
            clsApproval objApprove = new clsApproval();


            try
            {

                UserId = Convert.ToInt32(Session["intUser_ID"]);

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
                    strHasDocumentType = "Birth Certificate,";
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
                    strHasDocumentType = strHasDocumentType + "Student ID Card,";
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
                    strHasDocumentType = strHasDocumentType + "Ration Card,";
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
                    strHasDocumentType = strHasDocumentType + "Voter ID,";
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
                    strHasDocumentType = strHasDocumentType + "Pan Card,";
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
                    strHasDocumentType = strHasDocumentType + "Driving License,";
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
                    strHasDocumentType = strHasDocumentType + "Bank Pass Book,";
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
                    strHasDocumentType = strHasDocumentType + "Aadhar ID,";
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
                    strHasDocumentType = strHasDocumentType + "Bonafide-Student,";
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
                    strHasDocumentType = strHasDocumentType + "Bonafide-Parent,";
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
                    strHasDocumentType = strHasDocumentType + "Academic Performance,";
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
                    strHasDocumentType = strHasDocumentType + "Student Letter,";
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
                    strDocumentType = strDocumentType + txtUploadDoc1.Text + "_sports1,";
                    strDocumentPath = strDocumentPath + strUploadDoc1 + ",";
                    strHasDocumentType = strHasDocumentType + txtUploadDoc1.Text + ",";
                }
                if (fuUploadDoc2.HasFile)
                {
                    string strUploadDoc2 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc2.Text + Path.GetExtension(fuUploadDoc2.FileName);
                    fuUploadDoc2.SaveAs(MapPath("~" + strUploadDoc2));
                    strDocumentType = strDocumentType + txtUploadDoc2.Text + "_sports2,";
                    strDocumentPath = strDocumentPath + strUploadDoc2 + ",";
                    strHasDocumentType = strHasDocumentType + txtUploadDoc2.Text + ",";
                }
                if (fuUploadDoc3.HasFile)
                {
                    string strUploadDoc3 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc3.Text + Path.GetExtension(fuUploadDoc3.FileName);
                    fuUploadDoc3.SaveAs(MapPath("~" + strUploadDoc3));
                    strDocumentType = strDocumentType + txtUploadDoc3.Text + "_sports3,";
                    strDocumentPath = strDocumentPath + strUploadDoc3 + ",";
                    strHasDocumentType = strHasDocumentType + txtUploadDoc3.Text + ",";
                }
                if (fuUploadDoc4.HasFile)
                {
                    string strUploadDoc4 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc4.Text + Path.GetExtension(fuUploadDoc4.FileName);
                    fuUploadDoc4.SaveAs(MapPath("~" + strUploadDoc4));
                    strDocumentType = strDocumentType + txtUploadDoc4.Text + "_sports4,";
                    strDocumentPath = strDocumentPath + strUploadDoc4 + ",";
                    strHasDocumentType = strHasDocumentType + txtUploadDoc4.Text + ",";
                }
                if (fuUploadDoc5.HasFile)
                {
                    string strUploadDoc5 = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + txtUploadDoc5.Text + Path.GetExtension(fuUploadDoc5.FileName);
                    fuUploadDoc1.SaveAs(MapPath("~" + strUploadDoc5));
                    strDocumentType = strDocumentType + txtUploadDoc5.Text + "_sports5,";
                    strDocumentPath = strDocumentPath + strUploadDoc5 + ",";
                    strHasDocumentType = strHasDocumentType + txtUploadDoc5.Text + ",";
                }

                strDocumentType = strDocumentType.TrimEnd(',');
                strDocumentPath = strDocumentPath.TrimEnd(',');
                ayDocumentType = strDocumentType.Split(',');
                ayDocumentPath = strDocumentPath.Split(',');
                int intCountStatus = 0;
                int intBirthCheck = 0;
                int intAadhaarCheck = 0;
                int intPanCheck = 0;
                for (int i = 0; i < ayDocumentPath.Length; i++)
                {
                    if (ayDocumentPath[i] != "")
                    {
                        intCountStatus++;
                    }
                    if (ayDocumentType[i] == "Birth Certificate")
                    {
                        intBirthCheck = 1;
                    }
                    if (ayDocumentType[i] == "Aadhar ID")
                    {
                        intAadhaarCheck = 1;
                    }
                    if (ayDocumentType[i] == "Pan Card")
                    {
                        intPanCheck = 1;
                    }
                }

                strQuery1 = "Select";
                strQuery1 = strQuery1 + " Aadhaar_ID,Pan_ID  ";
                strQuery1 = strQuery1 + " FROM t_Registration ";
                strQuery1 = strQuery1 + " Where Application_Id='" + Request.QueryString["applnno"].ToString() + "'";

                Param[0] = new SqlParameter("@Statement", strQuery1.ToString());
                dsDataSet = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Param);

                string adherId = dsDataSet.Tables[0].Rows[0]["Aadhaar_ID"].ToString();
               string paneId =  dsDataSet.Tables[0].Rows[0]["Pan_ID"].ToString();

                // Commented on 11.09.2018
               //if (!string.IsNullOrEmpty(adherId) && !string.IsNullOrEmpty(paneId) && (intAadhaarCheck == 0 || intPanCheck == 0 || intBirthCheck == 0))
               //{
               //    dvform.Visible = true;
               //    lblValidation.Text = "Please upload minimum 3 documents in which BirthCertificate and AadharID and  PanCard are mandatory... ";
               //}
               //else if (!string.IsNullOrEmpty(adherId) && string.IsNullOrEmpty(paneId) && (intAadhaarCheck == 0 || intBirthCheck == 0 || intCountStatus < 3))
               //{
               //    dvform.Visible = true;
               //    lblValidation.Text = "Please upload minimum 3 documents in which BirthCertificate and AadharID are mandatory... ";
               //}
               //else if (string.IsNullOrEmpty(adherId) && !string.IsNullOrEmpty(paneId) && (intPanCheck == 0 || intBirthCheck == 0 || intCountStatus < 3))
               //{
               //    dvform.Visible = true;
               //    lblValidation.Text = "Please upload minimum 3 documents in which BirthCertificate and PanCard are mandatory... ";
               //}
               // Commented on 11.09.2018

               if (!string.IsNullOrEmpty(adherId) && !string.IsNullOrEmpty(paneId) && (intAadhaarCheck == 0 || intPanCheck == 0 ))
               {
                   dvform.Visible = true;
                   lblValidation.Text = "Please upload minimum 3 documents in which AadharID and PanCard are mandatory... ";
               }
               else if (!string.IsNullOrEmpty(adherId) && string.IsNullOrEmpty(paneId) && (intAadhaarCheck == 0 || intCountStatus < 3))
               {
                   dvform.Visible = true;
                   lblValidation.Text = "Please upload minimum 3 documents in which AadharID are mandatory... ";
               }
               else if (string.IsNullOrEmpty(adherId) && !string.IsNullOrEmpty(paneId) && (intPanCheck == 0 || intCountStatus < 3))
               {
                   dvform.Visible = true;
                   lblValidation.Text = "Please upload minimum 3 documents in which PanCard are mandatory... ";
               }



                //if (intCountStatus < 3 || intBirthCheck == 0 || intAadhaarCheck == 0)
                //{
                //    dvform.Visible = true;
                //    lblValidation.Text = "Please upload minimum 3 documents in which BirthCertificate and AadharID are mandatory... ";

                //}
                else
                {
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
                        if (ayDocumentType[intI] != "")
                        {
                            intRegistrationID = GetRegistrationID(strApplicationNo);
                            SqlCmd.CommandText = "USP_SAVE_UploadDocument";
                            SqlCmd.CommandType = CommandType.StoredProcedure;
                            SqlCmd.Parameters.Add(new SqlParameter("@Registration_ID", intRegistrationID));
                            SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", strApplicationNo));
                            SqlCmd.Parameters.Add(new SqlParameter("@DocumentType", ayDocumentType[intI]));
                            SqlCmd.Parameters.Add(new SqlParameter("@DocumentPath", ayDocumentPath[intI]));
                            SqlCmd.Parameters.Add(new SqlParameter("@UserId", UserId));
                            SqlCmd.ExecuteNonQuery();
                            //objTransaction.Commit();                      
                            SqlCmd.Parameters.Clear();
                        }

                    }

                    if (fuStudentPhoto.HasFile)
                    {
                        string strPhotoPath = "/Photos/" + strApplicationNo + "_Photo" + Path.GetExtension(fuStudentPhoto.FileName);
                        fuStudentPhoto.SaveAs(MapPath("~" + strPhotoPath));


                        // update photo to t_esch_Registration
                        SqlCommand command = new SqlCommand();
                        command.Connection = sqlConn;
                        command.CommandText = "UPDATE t_Registration SET Photo = '" + strPhotoPath + "' Where Application_Id='" + strApplicationNo + "'";
                        command.ExecuteNonQuery();
                    }




                    objApprove.UpdateHistory(lblApplnNo.Text, "Following Initial Document Uploaded : " + strHasDocumentType.TrimEnd(','), "Initial Document Uploaded", Session["User_ID"].ToString());

                    if (sqlConn.State != ConnectionState.Closed)
                        sqlConn.Close();

                    //string strText = "Upload Documents <b> " + txtApprovedAmt.Text.Trim().ToString() + " </b> by <b> " + Session["User_ID"].ToString() + " </b>";


                    dvform.Visible = false;
                    dvSuccess.Visible = true;

                    lblSuccess.Text = "Document Upload completed succesfully thank you!";
                    Response.Write("<script>window.open('UploadDocument.aspx',target='_top');</script>");
                }

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
