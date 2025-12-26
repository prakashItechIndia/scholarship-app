using System;
using System.Collections.Generic;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Data.SqlClient;
using System.Net.Mail;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;
using System.Text;
using System.Globalization;
using System.Net;
using Anders.Web.Controls;
using GenCode128;
using System.Drawing.Imaging;
using OnBarcode.Barcode;
using Telerik.Web.UI;
using SaiAramFoundation.Sairam_SMS_Gateway;
using Sairam_RegularUG.Classes;
using SaiAramFoundation.Classes;
using SaiAramFoundation.PDF;

namespace SaiAramFoundation
{
    public partial class ScholarshipRegistration : System.Web.UI.Page
    {
        Object SubmitLock = new Object();
        clsCommon objCommon = new clsCommon();
        List<ClsT_ScholarshipYearSetting> lstsetting = new List<ClsT_ScholarshipYearSetting>();
        public static string ScholarshipYearCode, ScholarshipYearName, ScholarshipYearMailId, ScholarshipYearReplyMailId, ScholarshipYearCCMailId, ScholarshipYearBCCMailId, ScholarshipYearMailSubject;
        public static int ScholarshipYearId;
        clsApproval objApproval = new clsApproval();
        string strApplnNumber;
        string strName;
        string stroption;
        public string strDate;

        string strState;
        string strPState;
        string strDistrict = "";
        string strPDistrict = "";
        string strImage_Path = "";
        string strGaurdian_Relation = "";
        string strUploadFiles = "";
        decimal intPhy, intChe, intMat, intTol;
        public string strQuery = "";

        protected void Page_Load(object sender, EventArgs e)
        {
           // objApproval.ErrorLog("AF001", "FormName", "errormessage", "balaji");
            try
            {
                if (!IsPostBack)
                {
                    ////getApplicationSetting
                    lstsetting = getApplicationSetting();
                    if (lstsetting.Count > 0)
                    {
                        ScholarshipYearId = Convert.ToInt32(lstsetting[0].ScholarshipYearId);
                        ScholarshipYearCode = lstsetting[0].ScholarshipYearCode;
                        ScholarshipYearName = lstsetting[0].ScholarshipYearName;
                        ScholarshipYearMailId = lstsetting[0].ScholarshipYearMailId;
                        ScholarshipYearReplyMailId = lstsetting[0].ScholarshipYearReplyMailId;
                        ScholarshipYearCCMailId = lstsetting[0].ScholarshipYearCCMailId;
                        ScholarshipYearBCCMailId = lstsetting[0].ScholarshipYearBCCMailId;
                        ScholarshipYearMailSubject = lstsetting[0].ScholarshipYearMailSubject;

                        LoadAdmissionYear();

                        ddlState.DataSource = objApproval.GetState("100");
                        ddlState.DataTextField = "State_name";
                        ddlState.DataValueField = "State_ID";
                        ddlState.DataBind();
                        ddlState.SelectedIndex = 0;

                        lblAcYear.Text = ScholarshipYearName;
                        //Country and state district

                        divtxtstate.Attributes.CssStyle.Add("Display", "none");
                        rfvStatetxt.Enabled = false;
                        divtxtcountry.Attributes.CssStyle.Add("Display", "none");
                        rfvCountrtTxt.Enabled = false;
                        divtxtDistrict.Attributes.CssStyle.Add("Display", "none");
                        rfvtxtDistrict.Enabled = false;
                        dvBoardOthers.Attributes.CssStyle.Add("Display", "none");
                        reqBoardOthers.Enabled = false;


                        spnEducation.Visible = false;
                        fuPanCard.Attributes.Clear();
                    }
                    else
                    {
                        lblError.Text = "Error in Page loading : ScholarshipYear Table Empty.....";
                    }
                }


            }
            catch (Exception ex)
            {
                lblError.Text = "Error in Page loading : " + ex.Message.ToString();
            }
        }

        public List<ClsT_ScholarshipYearSetting> getApplicationSetting()
        {
            string strQuery = "";
            objCommon = new clsCommon();

            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            List<ClsT_ScholarshipYearSetting> lstScholarshipYearTable = new List<ClsT_ScholarshipYearSetting>();
            try
            {
                strQuery = strQuery + " select ScholarshipYear_Id, ScholarshipYear_Code, ScholarshipYear_Name,";
                strQuery = strQuery + " Scholarship_MailId, Scholarship_ReplyTo_MailId, Scholarship_CC_MailId,";
                strQuery = strQuery + " Scholarship_BCC_MailId, Scholarship_Mail_Subject, Status,";
                strQuery = strQuery + " Delete_Flag, Created_By, Created_Date,";
                strQuery = strQuery + " Modified_By, Modified_Date";
                strQuery = strQuery + " From T_Scholarship_Year";
                strQuery = strQuery + " WHERE Status = 'true'";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);


                lstScholarshipYearTable = (from DataRow row in dsData.Tables[0].Rows
                                           select new ClsT_ScholarshipYearSetting
                                           {
                                               ScholarshipYearId = Convert.ToInt32(row["ScholarshipYear_Id"].ToString()),
                                               ScholarshipYearCode = row["ScholarshipYear_Code"].ToString(),
                                               ScholarshipYearName = row["ScholarshipYear_Name"].ToString(),
                                               ScholarshipYearMailId = row["Scholarship_MailId"].ToString(),
                                               ScholarshipYearBCCMailId = row["Scholarship_BCC_MailId"].ToString(),
                                               ScholarshipYearMailSubject = row["Scholarship_Mail_Subject"].ToString(),
                                               ScholarshipYearReplyMailId = row["Scholarship_ReplyTo_MailId"].ToString(),
                                               ScholarshipYearCCMailId = row["Scholarship_CC_MailId"].ToString(),

                                           }).ToList();



                return lstScholarshipYearTable;
            }
            catch (Exception ex)
            {

                return lstScholarshipYearTable;
            }


        }



        protected void txtConfirmAadhaarID_TextChanged(object sender, EventArgs e)
        {
            //string chechAadhaar = CheckAadhaarId(txtConfirmAadhaarID.Text.Trim().ToString());

            if (CheckAadhaarId(txtConfirmAadhaarID.Text.Trim().ToString(), ScholarshipYearId) == 0)
            {
                dvAadharCheck.Visible = true;
            }
            else
            {
                dvAadharCheck.Visible = false;
                ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('You information is already available with the Portal, for more details contact ARAM Foundation Office');", true);
            }
        }


        protected void txtConfirmPanID_TextChanged(object sender, EventArgs e)
        {

            if (CheckPanId(txtConfirmPanID.Text.Trim().ToString(), ScholarshipYearId) == 0)
            {
                dvAadharCheck.Visible = true;
            }
            else
            {
                dvAadharCheck.Visible = false;
                ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('You information is already available with the Portal, for more details contact ARAM Foundation Office');", true);
            }
        }

        private bool UploadDataValidation()
        {

            string strDocumentType = "";
            string strDocumentPath = "";
            string[] ayDocumentType;
            string[] ayDocumentPath;
            int intRegistrationID = 0;

            try
            {

                //string strBirthCertificate = "/ScholerShipDatas/" + strApplicationNo + "/" + strApplicationNo + "_BirthCertificate" + Path.GetExtension(fuBirthCertificate.FileName);
                //string strStudentIDCard = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_StudentIDCard" + Path.GetExtension(fuStudentIDCard.FileName);
                //string strRationCard = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_RationCard" + Path.GetExtension(fuRationCard.FileName);
                //string strVoterID = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_VoterID" + Path.GetExtension(fuVoter.FileName);
                //string strPanCard = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_PanCard" + Path.GetExtension(fuPanCard.FileName);
                //string strDrivingLicense = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_DrivingLicense" + Path.GetExtension(fuDrivingLicense.FileName);
                //string strBankPassBook = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_BankPassBook" + Path.GetExtension(fuBankPassBook.FileName);
                //string strAadharID = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_AadharID" + Path.GetExtension(fuAadharID.FileName);

                if (fuBirthCertificate.HasFile)
                {
                    strDocumentType = strDocumentType + "Birth Certificate,";
                    // strDocumentPath = strDocumentPath + strBirthCertificate + ",";
                }
                if (fuStudentIDCard.HasFile)
                {
                    strDocumentType = strDocumentType + "Student ID Card,";
                    //strDocumentPath = strDocumentPath + strStudentIDCard + ",";
                }
                if (fuRationCard.HasFile)
                {
                    strDocumentType = strDocumentType + "Ration Card,";
                    //strDocumentPath = strDocumentPath + strRationCard + ",";
                }
                if (fuVoter.HasFile)
                {
                    strDocumentType = strDocumentType + "Voter ID,";
                    // strDocumentPath = strDocumentPath + strVoterID + ",";
                }
                if (fuPanCard.HasFile)
                {
                    strDocumentType = strDocumentType + "Pan Card,";
                    //strDocumentPath = strDocumentPath + strPanCard + ",";
                }
                if (fuDrivingLicense.HasFile)
                {
                    strDocumentType = strDocumentType + "Driving License,";
                    //strDocumentPath = strDocumentPath + strDrivingLicense + ",";
                }
                if (fuBankPassBook.HasFile)
                {
                    strDocumentType = strDocumentType + "Bank Pass Book,";
                    //strDocumentPath = strDocumentPath + strBankPassBook + ",";
                }
                if (fuAadharID.HasFile)
                {
                    strDocumentType = strDocumentType + "Aadhar ID,";
                    //strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuBonafideStudent.HasFile)
                {
                    strDocumentType = strDocumentType + "Bonafide-Student,";
                    //strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuBonafideParent.HasFile)
                {
                    strDocumentType = strDocumentType + "Bonafide-Parent,";
                    //strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuAcademicPerformance.HasFile)
                {
                    strDocumentType = strDocumentType + "Academic Performance,";
                    //strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuLetter.HasFile)
                {
                    strDocumentType = strDocumentType + "Student Letter,";
                    //strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                strDocumentType = strDocumentType.TrimEnd(',');
                // strDocumentPath = strDocumentPath.TrimEnd(',');
                ayDocumentType = strDocumentType.Split(',');
                // ayDocumentPath = strDocumentPath.Split(',');

                int intCountStatus = 0;
                for (int i = 0; i < ayDocumentType.Length; i++)
                {
                    if (ayDocumentType[i] != "")
                    {
                        intCountStatus++;
                    }
                }
                if (intCountStatus < 3)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected void btnSave_Click(object sender, EventArgs e)
        {

            lock (SubmitLock)
            {
                clsCommon objCommon = new clsCommon();
                String strConn = objCommon.GetConnectionString();
                SqlConnection sqlConn = new SqlConnection(strConn);
                SqlCommand SqlCmd;
                String strQuery;
                DataTable dsData = new DataTable();
                clsApproval objApproval = new clsApproval();
                int AlreadyExistsCount = 0;
                //LoadAdmissionYear();
                //string strAdmissionYear = Convert.ToString(Session["AdYearCode"]);
                decimal phyMarks;
                decimal chemMarks;
                decimal mathMarks;
                string strPercent;
                string strState = "";
                string strCountry = "";
                string strDistrict = "";
                string strPhoto = "";
                string strImgPath = "";
                int i = 0;
                try
                {
                    lblError.Text = "";
                    //Page.Validate("vg");
                    if (Page.IsValid == false)
                    {
                        //bool isLocal = HttpContext.Current.Request.IsLocal;
                        //foreach (BaseValidator validator in Page.Validators)
                        //{
                        //    if ((validator) is RequiredFieldValidator)
                        //    {
                        //        RequiredFieldValidator vldtr = (RequiredFieldValidator)validator;
                        //        if (vldtr.IsValid == false)
                        //        {
                        //            // lblResult.Text = lblResult.Text + vldtr.ControlToValidate + ":" + vldtr.Text + "<br/>";
                        //        }
                        //    }
                        //}
                        return;
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(txtConfirmAadhaarID.Text.Trim().ToString()))
                        {
                             AlreadyExistsCount = CheckAadhaarId(txtConfirmAadhaarID.Text.Trim().ToString(), ScholarshipYearId);
                        }
                        else if (!string.IsNullOrEmpty(txtConfirmPanID.Text.Trim().ToString()))
                        {
                            AlreadyExistsCount = CheckPanId(txtConfirmPanID.Text.Trim().ToString(), ScholarshipYearId);
                        }


                        if (AlreadyExistsCount == 0)
                        {
                            bool checkupload = UploadDataValidation();

                            if (checkupload != false)
                            {
                                strApplnNumber = GenerateApplicationID();

                                if (sqlConn.State != ConnectionState.Open)
                                    sqlConn.Open();
                                SqlCmd = new SqlCommand();
                                SqlCmd.CommandText = "USP_SAVESCHOLERSHIP";
                                SqlCmd.CommandType = CommandType.StoredProcedure;

                                SqlCmd.Parameters.Add(new SqlParameter("@Sch_YearId", ScholarshipYearId));
                                SqlCmd.Parameters.Add(new SqlParameter("@Sch_Year", ScholarshipYearCode.Substring(2, 2).ToString()));

                                SqlCmd.Parameters.Add(new SqlParameter("@Scholarship_For", ddlAppllcantCat.SelectedValue.ToString()));

                                Session["ID"] = strApplnNumber;
                                SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", strApplnNumber));
                                SqlCmd.Parameters.Add(new SqlParameter("@Applicant_Type", ""));
                                SqlCmd.Parameters.Add(new SqlParameter("@Student_ID", txtStudentID.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Applicant_Name", txtName.Text.Trim().ToString().ToUpper()));

                                SqlCmd.Parameters.Add(new SqlParameter("@Father_Name", txtFatherName.Text.Trim().ToString().ToUpper()));

                                if (ddlFatherOccupathion.SelectedValue != "Others")
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation", ddlFatherOccupathion.SelectedValue.Trim().ToString()));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation_Other", ""));
                                }
                                else
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation", ddlFatherOccupathion.SelectedValue.Trim().ToString()));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation_Other", txtOtherFatherOccupation.Text.Trim().ToString()));
                                }
                                if (ddlFatherAnnualIncome.SelectedValue == "00")
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Father_AnnualIncome", "0"));
                                }
                                else
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Father_AnnualIncome", ddlFatherAnnualIncome.SelectedValue.ToString()));
                                }
                                SqlCmd.Parameters.Add(new SqlParameter("@Father_OfficeName", txtFatherOrganiz.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Mother_Name", txtMotherName.Text.Trim().ToString().ToUpper()));
                                if (ddlMotherOccupathion.SelectedValue != "Others")
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation", ddlMotherOccupathion.SelectedValue.Trim().ToString()));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation_Other", ""));
                                }
                                else
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation", ddlMotherOccupathion.SelectedValue.Trim().ToString()));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation_Other", txtOtherMotherOccupation.Text.Trim().ToString()));
                                }
                                if (ddlMotherAnnualIncome.SelectedValue == "00")
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Mother_AnnualIncome", "0"));
                                }
                                else
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Mother_AnnualIncome", ddlMotherAnnualIncome.SelectedValue.ToString()));
                                }
                                SqlCmd.Parameters.Add(new SqlParameter("@Mother_OfficeName", txtMotherOrganiz.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Name", txtParentName.Text.Trim().ToString().ToUpper()));
                                if (ddlGuardianOccupation.SelectedValue == "Others")
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation", ddlGuardianOccupation.SelectedValue.Trim().ToString()));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation_Other", txtOtherGuardianOccupation.Text.Trim().ToString()));
                                }
                                else if (ddlGuardianOccupation.SelectedValue == "0")
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation", ""));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation_Other", ""));
                                }
                                else
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation", ddlGuardianOccupation.SelectedValue.Trim().ToString()));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation_Other", ""));
                                }
                                if (ddlGuardianAnnulIncome.SelectedValue == "00")
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@GuardianAnnulIncome", "0"));
                                }
                                else if (ddlGuardianAnnulIncome.SelectedValue == "0")
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@GuardianAnnulIncome", ""));
                                }
                                else
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@GuardianAnnulIncome", ddlGuardianAnnulIncome.SelectedValue.ToString()));
                                }
                                SqlCmd.Parameters.Add(new SqlParameter("@Guardian_OfficeName", txtGuardianOrganiz.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Father_Designation", txtFatherDesignation.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Mother_Designation", txtMotherDesignation.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Designation", txtGuardianDesignation.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Address_Line1", txtAddressLine1.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Address_Line2", txtAddressLine2.Text.ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@City", txtCity.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@PinCode", txtPin.Text.Trim().ToString()));

                                if (ddlCountry.SelectedValue == "100")
                                {
                                    strState = ddlState.SelectedItem.Text.Trim().ToString();
                                    strCountry = ddlCountry.SelectedItem.Text.ToString();
                                    if (ddlState.SelectedValue == "31")
                                    {

                                        strDistrict = ddlDistrict.SelectedValue.ToString().Trim();
                                    }
                                    else
                                    {

                                        strDistrict = txtDistrict.Text.ToString().Trim();
                                    }
                                }
                                else
                                {
                                    strState = txtState.Text.Trim();
                                    strDistrict = txtDistrict.Text.ToString().Trim();
                                    strCountry = txtCountry.Text.ToString();
                                }


                                SqlCmd.Parameters.Add(new SqlParameter("@State", strState));
                                SqlCmd.Parameters.Add(new SqlParameter("@District", strDistrict));
                                SqlCmd.Parameters.Add(new SqlParameter("@Country", strCountry));
                                SqlCmd.Parameters.Add(new SqlParameter("@Aadhaar_ID", txtConfirmAadhaarID.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Pan_ID", txtPanID.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Mobile_Number", "91" + txtMobile.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Email", txtEmailID.Text.Trim().ToString()));

                                if (fuPhotoUpload.HasFile)
                                {
                                    strPhoto = "/Photos/" + strApplnNumber + "_Photo" + Path.GetExtension(fuPhotoUpload.FileName);
                                    fuPhotoUpload.SaveAs(MapPath("~" + strPhoto));
                                    strImgPath = strPhoto;
                                }

                                SqlCmd.Parameters.Add(new SqlParameter("@Photo", strImgPath.ToString()));

                                //String strBirthDate = txtDOB.Text;
                                //String format = "dd/MM/yyyy";
                                //DateTime dtTime = DateTime.ParseExact(strBirthDate, format, CultureInfo.InvariantCulture);@Photo

                                SqlCmd.Parameters.Add(new SqlParameter("@Date_Of_Birth", txtDOB.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Gender", radGender.SelectedValue.ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Community", ddlCoomunity.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Caste", txtCaste.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@AppliedOtherScholarship", rdoAppliedOtherScholarship.SelectedValue.ToString()));
                                if (ddlAppllcantCat.SelectedIndex == 1)
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Class_Studying", ddlClassStudying.SelectedValue.ToString()));
                                    if (ddlXIIBoard.SelectedValue.ToString() == "Others")
                                    {
                                        SqlCmd.Parameters.Add(new SqlParameter("@Board_Of_Studying", txtBoardOthers.Text.ToString()));
                                    }
                                    else
                                    {
                                        SqlCmd.Parameters.Add(new SqlParameter("@Board_Of_Studying", ddlXIIBoard.SelectedValue.ToString()));
                                    }

                                    //For college
                                    SqlCmd.Parameters.Add(new SqlParameter("@Cource_Of_Studying", ""));
                                    //SqlCmd.Parameters.Add(new SqlParameter("@Department_Branch", ""));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Degree_Type", ""));
                                }
                                else if (ddlAppllcantCat.SelectedIndex == 2)
                                {
                                    //For college
                                    if (ddlCourseofStudying.Text.ToString() == "Diploma" || ddlCourseofStudying.Text.ToString() == "PreUniversity")
                                    {
                                        SqlCmd.Parameters.Add(new SqlParameter("@Class_Studying", ddlCourseofStudying.Text.ToString()));
                                        SqlCmd.Parameters.Add(new SqlParameter("@Cource_Of_Studying", ddlCourseofStudying.Text.ToString()));
                                    }
                                    else
                                    {
                                        SqlCmd.Parameters.Add(new SqlParameter("@Class_Studying", ddlDegree.Text.ToString()));
                                        SqlCmd.Parameters.Add(new SqlParameter("@Cource_Of_Studying", ddlCourseofStudying.Text.ToString()));
                                    }
                                    SqlCmd.Parameters.Add(new SqlParameter("@Board_Of_Studying", ""));
                                    //SqlCmd.Parameters.Add(new SqlParameter("@Department_Branch", ""));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Degree_Type", radUgPGType.SelectedValue.ToString()));
                                }
                                else
                                {
                                    SqlCmd.Parameters.Add(new SqlParameter("@Cource_Of_Studying", ddlCourseofStudying.Text.ToString()));
                                    //SqlCmd.Parameters.Add(new SqlParameter("@Department_Branch", txtDepartment.Text.Trim().ToString()));

                                    //For school
                                    SqlCmd.Parameters.Add(new SqlParameter("@Class_Studying", "Ph.D"));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Board_Of_Studying", ""));
                                    SqlCmd.Parameters.Add(new SqlParameter("@Degree_Type", ""));
                                }
                                SqlCmd.Parameters.Add(new SqlParameter("@Type_Of_Institution", radTypeofInstitution.SelectedValue.ToString()));

                                SqlCmd.Parameters.Add(new SqlParameter("@Degree", ddlDegree.Text.ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Other_Degree", txtOtherDegree.Text.ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Ph_D", ddlPhd.Text.ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Specialization", txtSpecializhation.Text.ToString()));

                                SqlCmd.Parameters.Add(new SqlParameter("@Institution_Name", txtInstitution.Text.Trim().ToString()));

                                SqlCmd.Parameters.Add(new SqlParameter("@University", txtUniversity.Text.ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Current_Year", ddlCurrentYear.Text.ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Current_Semester", ddlCurrentSem.Text.ToString()));

                                SqlCmd.Parameters.Add(new SqlParameter("@Bank_Account_Number", txtAccountNo.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Bank_Name", ddlBankName.SelectedValue.ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Bank_Branch", txtBranch.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@IFSC_Code", txtIFSCCode.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@RequestAmount", txtRequestAmount.Text.Trim().ToString()));
                                SqlCmd.Parameters.Add(new SqlParameter("@Scholarship_Status", ""));
                                SqlCmd.Parameters.Add(new SqlParameter("@Scholarship_No", ""));

                                SqlCmd.Parameters.Add(new SqlParameter("@Payment_Mode", ""));
                                SqlCmd.Parameters.Add(new SqlParameter("@Payment_Date", ""));
                                SqlCmd.Parameters.Add(new SqlParameter("@NetBanking_RefNo", ""));
                                SqlCmd.Parameters.Add(new SqlParameter("@DDCheque_No", ""));
                                SqlCmd.Parameters.Add(new SqlParameter("@DDCheque_Date", ""));
                                SqlCmd.Parameters.Add(new SqlParameter("@User_ID", ""));
                                SqlCmd.Connection = sqlConn;
                                SqlCmd.ExecuteNonQuery();
                                //Upload Document
                                UploadData(strApplnNumber);

                                if (sqlConn.State != ConnectionState.Closed)
                                    sqlConn.Close();
                                sqlConn.Dispose();
                                SqlCmd.Dispose();


                                //Update history
                                string strText = strApplnNumber + " has registered successfully!...by <b>(" + txtName.Text.Trim().ToString() + ") ";
                                objApproval.UpdateHistory(strApplnNumber, strText, "Online Registration", txtName.Text.Trim().ToString());

                                GenerateBarCode(Session["ID"].ToString());

                                Print_ApplnForm();

                                // Server.Transfer("success.aspx?id=" + strApplnNumber);
                                Response.Redirect("success.aspx?id=" + strApplnNumber, false);

                            }
                            else
                            {
                                dvform.Visible = true;
                                lblValidation.Text = "Please upload atleast any 3 documents";
                            }
                        }
                        else
                        {
                            ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert(' Registeration Faild !.You information is already available with the Portal, for more details contact ARAM Foundation Office');", true);
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (sqlConn.State != ConnectionState.Closed)
                        sqlConn.Close();
                    sqlConn.Dispose();
                    //ClearText();
                }
            }

        }

        public int CheckAadhaarId(string strAadhaarID, int ScholarshipYear_Id)
        {
            string strAadhaar = "";
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            string strQuery = null;
            clsApproval objApproval = new clsApproval();

            try
            {
                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand();

                strQuery = "";
                strQuery += "Select count(*) from t_Registration where Aadhaar_ID='" + strAadhaarID + "' and Scholarship_Year_Id=" + ScholarshipYear_Id;
                SqlCmd.Connection = sqlConn;
                SqlCmd.CommandText = strQuery;
                int intCount = Convert.ToInt32(SqlCmd.ExecuteScalar());
                return intCount;

                //da = new SqlDataAdapter(strQuery, sqlConn);
                //da.Fill(ds);
                //if (ds.Tables[0].Rows.Count > 0)
                //{
                //    strAadhaar = ds.Tables[0].Rows[0]["Aadhaar_ID"].ToString();
                //}
                //else
                //{
                //    strAadhaar = "";
                //}
                //return strAadhaar;


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
                sqlConn.Dispose();
                SqlCmd = null;
            }
        }

        public int CheckPanId(string strPanID, int ScholarshipYear_Id)
        {
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            string strQuery = null;
            clsApproval objApproval = new clsApproval();

            try
            {
                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand();

                strQuery = "";
                strQuery += "Select count(*) from t_Registration where Pan_ID='" + strPanID + "' and Scholarship_Year_Id=" + ScholarshipYear_Id;
                SqlCmd.Connection = sqlConn;
                SqlCmd.CommandText = strQuery;
                int intCount = Convert.ToInt32(SqlCmd.ExecuteScalar());
                return intCount;


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
                sqlConn.Dispose();
                SqlCmd = null;
            }
        }


        protected string GenerateApplicationID()
        {
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            String strQuery;
            string strApplicationNo = "";
            int intAppNo = 0;

            try
            {
                if (sqlConn.State != ConnectionState.Open)
                {
                    sqlConn.Open();
                }
                SqlCmd = new SqlCommand();
                SqlCmd.CommandText = "UPS_GET_MAX_APPLICATION_ID";
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Connection = sqlConn;
                strApplicationNo = Convert.ToString(SqlCmd.ExecuteScalar());
                if (strApplicationNo == "")
                {
                    strApplicationNo = "AF" + ScholarshipYearCode.Substring(2, 2).ToString() + "10001";
                }
                else
                {
                    strApplicationNo = strApplicationNo.Substring(4, 5);
                    strApplicationNo = "AF" + ScholarshipYearCode.Substring(2, 2).ToString() + Convert.ToInt32(Convert.ToInt32(strApplicationNo) + 1).ToString();
                }
                SqlCmd.Dispose();
                return strApplicationNo;

            }
            catch (Exception ex)
            {
                return "";
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

        protected void GenerateBarCode(string strApplicationNo)
        {
            try
            {
                //-------Rad bar code
                string imagename = strApplicationNo + "_Barcode.png";
                RadBarcode barcode = new RadBarcode();
                barcode.Text = strApplicationNo;
                barcode.Type = Telerik.Web.UI.BarcodeType.Code128;
                barcode.LineWidth = 2;
                RadBinaryImage image = new RadBinaryImage();
                // PlaceHolder1.Controls.Add(image);
                System.IO.MemoryStream stream = new System.IO.MemoryStream();
                // barcode.GetImage().Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                barcode.GetImage().Save(Server.MapPath("~/BarcodeImage/") + imagename);
                image.DataValue = stream.ToArray();




            }
            catch (Exception ex)
            {
               
                throw new Exception(ex.Message);
            }
        }

        protected void Print_ApplnForm()
        {
            string strApplnNumber;
            MemoryStream mem = new MemoryStream();
            try
            {
                strApplnNumber = Session["ID"].ToString();
                mem = new MemoryStream();
                mem = Generate_PDF(strApplnNumber, ScholarshipYearName);

                objApproval.ErrorLog(Session["ID"].ToString(), "Print_ApplnForm", "Generate PDF memory stream", "");

                byte[] bytes = new byte[mem.Length];
                bytes = mem.ToArray();
                if (!System.IO.Directory.Exists(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/"))
                {
                    DirectoryInfo myDir = new DirectoryInfo(MapPath("~/Registered_Pdf_ScholerShip/"));
                    myDir.Create();
                }
                File.WriteAllBytes(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/" + strApplnNumber + ".pdf", bytes);

                // Mail Function 
                Attachment attFiles = new Attachment(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/" + strApplnNumber + ".pdf");
                String strToAddress = txtEmailID.Text;
                String strFromAddress = ScholarshipYearMailId;
                String strSubject = ScholarshipYearMailSubject + " " + strApplnNumber;
                String strBodyTxt = "<html><body><span style='font-family:Tahoma; font-size:small'>";
                strBodyTxt = strBodyTxt + "Dear <b><i>" + strName + "</i></b>,<br><br>";
                strBodyTxt = strBodyTxt + "You have successfully registered with LEO MUTHU Scholarship programme " + ScholarshipYearName + ". Please note your application number <b>" + strApplnNumber + "</b> for future reference.<br>Your application number has been sent to the registered mobile number. ";
                //strBodyTxt = strBodyTxt + "<br><br><b>Educating for the future... Preparing for life...</b><br><br><b>About the Institution...</b><br>Sri Sai Ram Engineering College located at Sai Leo Nagar, West Tambaram, Chennai, is an NBA Accredited and ISO 9001:2008 Certified Institution. The institution is the dream of its Chairman, <b><i>MJF.Ln.Leo Muthu</i></b>, realised by the blessings of Shirdi Sai Baba. Today, it is one of the most respected and sought after engineering colleges in Tamil Nadu.";
                strBodyTxt = strBodyTxt + "<br><br><b>Administration Officer</b><br>LEO MUTHU Scholarship(AUO)Aram Foundation, Chennai.</span></body></html>";

                if (strToAddress == "")
                {
                    strToAddress = strFromAddress;
                }
               // MailMessage message = new MailMessage(strFromAddress, strToAddress, strSubject, strBodyTxt);
               // message.ReplyTo = new MailAddress(ScholarshipYearReplyMailId);

                //Bccs
                List<string> Bccs = new List<string>();
                Bccs = ScholarshipYearBCCMailId.Split(',').ToList();
                //foreach (string BCCemail in Bccs)
                //{
                //    message.Bcc.Add(BCCemail);
                //}
                ////message.Bcc.Add("Ladmission2013@sairamgroup.in");
                ////message.Bcc.Add("test@itech-india.com");                
                //message.Attachments.Add(attFiles);

                //message.IsBodyHtml = true;
                //SmtpClient emailClient = new SmtpClient();
                //emailClient.Host = ConfigurationManager.AppSettings["MailSmtp"].ToString();
                //emailClient.Port = 25;
                //emailClient.Credentials = new System.Net.NetworkCredential("donotreply@itechind.com", "donotreply123");
                //emailClient.Send(message);

                attFiles.Name = "RegistrationForm_" + strApplnNumber + ".pdf";
                clsEmail.SendMail(strFromAddress, strToAddress, ScholarshipYearReplyMailId, strSubject, strBodyTxt, null, Bccs, attFiles);

                //send message
                SendMessage(strApplnNumber);
            }
            catch (Exception ex)
            {
                //Need to remove
                //throw ex;
            }
        }

        public MemoryStream Generate_PDF(string strAppNo, string AdmissionYear)
        {
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            //strConn = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + Server.MapPath(".");
            //strConn += "/Registration.mdb";
            SqlConnection SqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataReader SqlReader;
            string strQuery;
            MemoryStream mem = new MemoryStream();
            Document objDoc = new Document(iTextSharp.text.PageSize.A4, 25, 25, 50, 50);
            PdfWriter pWriter = PdfWriter.GetInstance(objDoc, mem);

            // Water mark logo using Event Handler
            PageEventHandler PageEventHandler = new PageEventHandler();
            pWriter.PageEvent = PageEventHandler;

            //string strData, strName, strApplnNumber;
            string strData = "", strName = "";
            string strDate = "", strFrom = "";
            DateTime dtDate;

            try
            {
                if (SqlConn.State != ConnectionState.Open)
                    SqlConn.Open();

                //WriteLog("PDF0.");
                SqlCmd = new SqlCommand();
                SqlCmd.CommandText = "USP_GET_DATA_BY_APPLICATION_NO";
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Connection = SqlConn;
                SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", strAppNo));
                SqlCmd.Parameters.Add(new SqlParameter("@Process_Type", ""));
                SqlCmd.Parameters.Add(new SqlParameter("@Scholarship_Id", "1"));
                SqlReader = SqlCmd.ExecuteReader();
                if (SqlReader.Read())
                {
                    //WriteLog("PDF1.");

                    strApplnNumber = SqlReader["Application_Id"].ToString().PadLeft(4, '0');
                    //Open the document
                    objDoc.Open();
                    Font fntNormal = FontFactory.GetFont("Arial", 9);
                    Font fntLBold = FontFactory.GetFont("Arial", 17, Font.BOLD);
                    Font fntBold = FontFactory.GetFont("Arial", 9, Font.BOLD);
                    Font fntHeading = FontFactory.GetFont("Arial", 10, Font.BOLD);
                    Font fntGray = FontFactory.GetFont("Arial", 9, Font.NORMAL, Color.GRAY);
                    Font fntWhite = FontFactory.GetFont("Arial", 9, Font.NORMAL, Color.WHITE);
                    Font fntSlogan = FontFactory.GetFont("Arial", 9, Font.BOLD);
                    Font fntName = FontFactory.GetFont("Arial", 16, Font.BOLD);
                    PdfPTable objTable = new PdfPTable(3);
                    objTable.DefaultCell.Border = 0;
                    objTable.DefaultCell.FixedHeight = 15;
                    objTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                    objTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                    objTable.DefaultCell.BorderWidth = 0;

                    objTable.SetWidths(new int[3] { 19, 1, 35 });

                    PdfPTable objTableHeader = new PdfPTable(3);
                    objTableHeader.DefaultCell.Border = 0;
                    objTableHeader.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                    objTableHeader.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                    objTableHeader.DefaultCell.BorderWidth = 0;

                    objTableHeader.SetWidths(new int[3] { 40, 1, 14 });

                    PdfPTable objTableApplnNumber = new PdfPTable(3);
                    objTableApplnNumber.DefaultCell.Border = 0;
                    objTableApplnNumber.DefaultCell.FixedHeight = 0;
                    objTableApplnNumber.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                    objTableApplnNumber.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    objTableApplnNumber.DefaultCell.BorderWidth = 0;

                    objTableApplnNumber.SetWidths(new int[3] { 40, 1, 14 });

                    Font fntApplNumberBold = FontFactory.GetFont("Arial", 17, Font.BOLD);
                    objTableApplnNumber.AddCell("");
                    objTableApplnNumber.AddCell("");
                    objTableApplnNumber.AddCell(new Phrase(SqlReader["Application_Id"].ToString(), fntApplNumberBold));

                    PdfPCell objCellApplnNumber = new PdfPCell(objTableApplnNumber);
                    objCellApplnNumber.Border = 0;
                    objCellApplnNumber.Colspan = 3;
                    objTable.AddCell(objCellApplnNumber);

                    PdfPTable objTableLogo = new PdfPTable(1);
                    objTableLogo.SetWidths(new int[1] { 40 });
                    objTableLogo.DefaultCell.Border = 0;
                    objTableLogo.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                    objTableLogo.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //WriteLog("PDF2.");
                    iTextSharp.text.Image objLogo;
                    objLogo = iTextSharp.text.Image.GetInstance(Server.MapPath(".") + "/images/Logo1.jpg");
                    //WriteLog("PDF3.");
                    PdfPCell objCellLogo = new PdfPCell(objLogo, true);
                    objCellLogo.Border = 0;
                    objCellLogo.BorderColor = Color.GRAY;
                    objCellLogo.HorizontalAlignment = Element.ALIGN_CENTER;
                    objTableLogo.AddCell(objCellLogo);


                    PdfPCell objCellBlankRow = new PdfPCell(new Phrase(".", fntWhite));
                    objCellBlankRow.Border = 0;
                    objCellBlankRow.Colspan = 4;



                    //Header 
                    objTableLogo.AddCell(" ");
                    //objTableLogo.AddCell(new Phrase("APPLICATION AND REGISTRATION FORM FOR ADMISSION TO \n II YEAR B.E./B.TECH (Lateral Entry 2013)", fntHeading));
                    objTableLogo.AddCell(new Phrase("LEO MUTHU Scholarship - " + AdmissionYear, fntHeading));
                    objTableLogo.AddCell(" ");

                    //by saravanan 16052014
                    PdfPCell objCellBlankRowHeader = new PdfPCell(new Phrase(".", fntWhite));
                    objCellBlankRowHeader.Border = 0;
                    //objTableLogo.AddCell(objCellBlankRowHeader);
                    //objTableLogo.AddCell(objCellBlankRowHeader);
                    //objTableLogo.AddCell(objCellBlankRowHeader);




                    //saravanan 13/08/2014
                    //objTableLogo.AddCell(new Phrase("APPLICATION AND REGISTRATION FORM FOR  \n B.E./B.TECH DEGREE 2013 - 2014", fntHeading));
                    PdfPCell objHeadName = new PdfPCell(new Phrase(SqlReader["Applicant_Name"].ToString(), fntLBold));
                    objHeadName.Border = 0;
                    //objHeadName.BorderColorBottom = Color.BLACK;
                    //objHeadName.HorizontalAlignment = Element.ALIGN_BOTTOM;
                    //objHeadName.BorderWidthBottom = 0.8f;
                    objTableLogo.AddCell(objHeadName);
                    objTableLogo.AddCell(objCellBlankRowHeader);

                    PdfPCell objCellLogoMain = new PdfPCell(objTableLogo);
                    objCellLogoMain.Border = 0;
                    objTableHeader.AddCell(objCellLogoMain);

                    objTableHeader.AddCell(" ");

                    //WriteLog("PDF4.");
                    string Path = SqlReader["Photo"].ToString();
                    //WriteLog("PDF5." + Path);
                    if (System.IO.File.Exists(Server.MapPath(".") + SqlReader["Photo"].ToString()))
                    {
                        try
                        {
                            //WriteLog("PDF6.");
                            iTextSharp.text.Image objPhoto;
                            //objPhoto = iTextSharp.text.Image.GetInstance(Server.MapPath(".") + "/Photos/" + strApplnNumber + Path.GetExtension(afuImage.FileName));
                            objPhoto = iTextSharp.text.Image.GetInstance(Server.MapPath(".") + SqlReader["Photo"].ToString());
                            objPhoto.ScaleAbsolute(100, 130);
                            PdfPCell objCellPhoto = new PdfPCell(objPhoto, true);
                            objCellPhoto.Border = Rectangle.BOTTOM_BORDER | Rectangle.TOP_BORDER | Rectangle.LEFT_BORDER | Rectangle.RIGHT_BORDER;
                            objCellPhoto.BorderColor = iTextSharp.text.Color.GRAY;
                            objCellPhoto.HorizontalAlignment = Element.ALIGN_CENTER;
                            objCellPhoto.VerticalAlignment = Element.ALIGN_MIDDLE;
                            objCellPhoto.FixedHeight = 10;
                            objTableHeader.AddCell(objCellPhoto);
                        }
                        catch(Exception ex)
                        {
                            PdfPCell objCellPhoto = new PdfPCell(new Phrase("Paste here firmly your recent colour photograph of good quality (Size 3.5 X 4.5 cms)", fntNormal));
                            objCellPhoto.Border = Rectangle.BOTTOM_BORDER | Rectangle.TOP_BORDER | Rectangle.LEFT_BORDER | Rectangle.RIGHT_BORDER;
                            objCellPhoto.BorderColor = iTextSharp.text.Color.GRAY;
                            objCellPhoto.HorizontalAlignment = Element.ALIGN_CENTER;
                            objCellPhoto.VerticalAlignment = Element.ALIGN_MIDDLE;
                            objTableHeader.AddCell(objCellPhoto);

                            WriteLog(ex.Message);
                        }
                    }
                    else
                    {
                        //WriteLog("PDF7.");
                        PdfPCell objCellPhoto = new PdfPCell(new Phrase("Paste here firmly your recent colour photograph of good quality (Size 3.5 X 4.5 cms)", fntNormal));
                        objCellPhoto.Border = Rectangle.BOTTOM_BORDER | Rectangle.TOP_BORDER | Rectangle.LEFT_BORDER | Rectangle.RIGHT_BORDER;
                        objCellPhoto.BorderColor = iTextSharp.text.Color.GRAY;
                        objCellPhoto.HorizontalAlignment = Element.ALIGN_CENTER;
                        objCellPhoto.VerticalAlignment = Element.ALIGN_MIDDLE;
                        objTableHeader.AddCell(objCellPhoto);
                    }

                    PdfPCell objCellHeader = new PdfPCell(objTableHeader);
                    objCellHeader.Border = 0;
                    objCellHeader.Colspan = 3;
                    objTable.AddCell(objCellHeader);
                    //WriteLog("PDF8.");
                    //PdfPCell objCellUnderline = new PdfPCell(new Phrase("", fntSlogan));
                    //objCellUnderline.Border = 0;
                    //objCellUnderline.Colspan = 3;
                    //objCellUnderline.BorderColorBottom = Color.BLACK;
                    //objCellUnderline.HorizontalAlignment = Element.ALIGN_BOTTOM;
                    //objCellUnderline.BorderWidthBottom = 0.8f;
                    //objTable.AddCell(objCellUnderline);

                    //PdfPCell objCellBlankRow = new PdfPCell(new Phrase(".", fntWhite));
                    //objCellBlankRow.Border = 0;
                    //objCellBlankRow.Colspan = 3;
                    //objTable.AddCell(objCellBlankRow);

                    //objTable.AddCell(new Phrase("1.   Application No.", fntNormal));
                    //objTable.AddCell(new Phrase(":", fntNormal));
                    //objTable.AddCell(new Phrase(SqlReader["ID"].ToString().PadLeft(4, '0'), fntBold));

                    if (SqlReader["Student_ID"].ToString().Trim().ToString() != "")
                    {
                        objTable.AddCell(new Phrase("Student ID", fntBold));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Student_ID"].ToString(), fntBold));
                    }

                    //objTable.AddCell(new Phrase("2.Applicant Name", fntNormal));
                    //objTable.AddCell(new Phrase(":", fntNormal));
                    //objTable.AddCell(new Phrase(SqlReader["Applicant_Name"].ToString(), fntBold));

                    objTable.AddCell(new Phrase("Parent/Guardian Details", fntBold));
                    objTable.AddCell(new Phrase("", fntNormal));
                    objTable.AddCell(new Phrase("", fntNormal));

                    //objTable.AddCell(objCellBlankRow);
                    //PdfPCell objCellLine = new PdfPCell(new Phrase(".", fntWhite));
                    //objCellLine.Border = Rectangle.BOTTOM_BORDER;
                    //objCellLine.BorderColor = iTextSharp.text.Color.GRAY;
                    //objCellLine.Colspan = 3;
                    //objTable.AddCell(objCellLine);

                    PdfPCell objCellUnderline1 = new PdfPCell(new Phrase("", fntSlogan));
                    objCellUnderline1.Border = 0;
                    objCellUnderline1.Colspan = 3;
                    objCellUnderline1.BorderColorBottom = Color.BLACK;
                    objCellUnderline1.HorizontalAlignment = Element.ALIGN_BOTTOM;
                    objCellUnderline1.BorderWidthBottom = 0.8f;
                    objTable.AddCell(objCellUnderline1);

                    int sno = 1;

                    if (SqlReader["Guardian_Name"].ToString().Trim().ToString() != "")
                    {
                        objTable.AddCell(new Phrase(sno + ".Guardian Name", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Guardian_Name"].ToString(), fntNormal));
                        sno++;
                    }
                    if (SqlReader["Guardian_OfficeName"].ToString() != "")
                    {
                        objTable.AddCell(new Phrase(sno + ".Occupation & Organization Name", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Guardian_Occupation"].ToString() + "/" + SqlReader["Guardian_OfficeName"].ToString(), fntNormal));
                        sno++;
                    }
                    else if (SqlReader["Guardian_Occupation"].ToString() != "")
                    {
                        objTable.AddCell(new Phrase(sno + ".Occupation & Organization Name", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Guardian_Occupation"].ToString(), fntNormal));
                        sno++;
                    }

                    objTable.AddCell(new Phrase(sno + ".Father Name", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Father_Name"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Occupation & Organization Name", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    if (SqlReader["Father_OfficeName"].ToString() != "")
                    {
                        objTable.AddCell(new Phrase(SqlReader["Father_Occupation"].ToString() + "/" + SqlReader["Father_OfficeName"].ToString(), fntNormal));
                    }
                    else
                    {
                        objTable.AddCell(new Phrase(SqlReader["Father_Occupation"].ToString(), fntNormal));
                    }
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Mother Name", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Mother_Name"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Occupation & Organization Name", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    if (SqlReader["Mother_Occupation"].ToString() == "House wife")
                    {
                        objTable.AddCell(new Phrase(SqlReader["Mother_Occupation"].ToString(), fntNormal));
                    }
                    else if (SqlReader["Mother_OfficeName"].ToString() == "")
                    {
                        objTable.AddCell(new Phrase(SqlReader["Mother_Occupation"].ToString(), fntNormal));
                    }
                    else
                    {
                        objTable.AddCell(new Phrase(SqlReader["Mother_Occupation"].ToString() + "/" + SqlReader["Mother_OfficeName"].ToString(), fntNormal));
                    }
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Father AnnualIncome", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Father_AnnualIncome"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Mother AnnualIncome", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Mother_AnnualIncome"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase("Personal Details", fntBold));
                    objTable.AddCell(new Phrase("", fntNormal));
                    objTable.AddCell(new Phrase("", fntNormal));

                    //objTable.AddCell(objCellBlankRow);

                    PdfPCell objCellUnderline2 = new PdfPCell(new Phrase("", fntSlogan));
                    objCellUnderline2.Border = 0;
                    objCellUnderline2.Colspan = 3;
                    objCellUnderline2.BorderColorBottom = Color.BLACK;
                    objCellUnderline2.HorizontalAlignment = Element.ALIGN_BOTTOM;
                    objCellUnderline2.BorderWidthBottom = 0.8f;
                    objTable.AddCell(objCellUnderline2);


                    objTable.AddCell(new Phrase(sno + ".Address", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    PdfPCell objCellAddress = new PdfPCell(new Phrase(SqlReader["Address_Line1"].ToString() + "," + SqlReader["Address_Line2"].ToString() + "\n" + SqlReader["City"].ToString() + " - " + SqlReader["PinCode"].ToString() + ", " + SqlReader["State"].ToString() + ", " + SqlReader["Country"].ToString(), fntNormal));
                    objCellAddress.Border = 0;
                    //objCellAddress.FixedHeight = 50;
                    objTable.AddCell(objCellAddress);
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Mobile No", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Mobile_Number"].ToString(), fntNormal));
                    sno++;

                    if (SqlReader["Email"].ToString().Trim().ToString() != "")
                    {
                        objTable.AddCell(new Phrase(sno + ".Email ID", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Email"].ToString(), fntNormal));
                        sno++;
                    }

                    //String strBirthDate = SqlReader["Date_Of_Birth"].ToString();
                    //String format = "dd/MM/yyyy";
                    //DateTime dtTime = DateTime.ParseExact(strBirthDate, format, CultureInfo.InvariantCulture);


                    objTable.AddCell(new Phrase(sno + ".Date of Birth", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Date_Of_Birth"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Gender", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Gender"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Community", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Community"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Caste", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Caste"].ToString() , fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Aadhaar ID", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Aadhaar_ID"].ToString()+ "                PAN Number   : "+SqlReader["Pan_ID"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase("Education Detail", fntBold));
                    objTable.AddCell(new Phrase("", fntNormal));
                    objTable.AddCell(new Phrase("", fntNormal));
                   

                    PdfPCell objCellUnderline3 = new PdfPCell(new Phrase("", fntSlogan));
                    objCellUnderline3.Border = 0;
                    objCellUnderline3.Colspan = 3;
                    objCellUnderline3.BorderColorBottom = Color.BLACK;
                    objCellUnderline3.HorizontalAlignment = Element.ALIGN_BOTTOM;
                    objCellUnderline3.BorderWidthBottom = 0.8f;
                    objTable.AddCell(objCellUnderline3);


                    if (SqlReader["Scholarship_For"].ToString() == "School")
                    {
                        objTable.AddCell(new Phrase(sno + ".Class Studying", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Class_Studying"].ToString(), fntNormal));
                        sno++;

                        objTable.AddCell(new Phrase(sno + ".Board Of Studying", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Board_Of_Studying"].ToString(), fntNormal));
                        sno++;
                    }
                    else if (SqlReader["Scholarship_For"].ToString() == "College")
                    {
                        objTable.AddCell(new Phrase(sno + ".Course Of Studying", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Cource_Of_Studying"].ToString(), fntNormal));
                        sno++;

                        if (SqlReader["Degree"].ToString() != "")
                        {
                            objTable.AddCell(new Phrase(sno + ".Degree", fntNormal));
                            objTable.AddCell(new Phrase(":", fntNormal));
                            objTable.AddCell(new Phrase(SqlReader["Degree"].ToString(), fntNormal));
                        }
                        else
                        {
                            objTable.AddCell(new Phrase(sno + ".Degree", fntNormal));
                            objTable.AddCell(new Phrase(":", fntNormal));
                            objTable.AddCell(new Phrase(SqlReader["Other_Degree"].ToString(), fntNormal));

                        }
                        sno++;
                    }
                    else
                    {
                        objTable.AddCell(new Phrase(sno + ".Ph.D", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Ph_D"].ToString(), fntNormal));
                        sno++;

                        objTable.AddCell(new Phrase(sno + ".Specialization", fntNormal));
                        objTable.AddCell(new Phrase(":", fntNormal));
                        objTable.AddCell(new Phrase(SqlReader["Specialization"].ToString(), fntNormal));
                        sno++;
                    }

                    objTable.AddCell(new Phrase(sno + ".Type Of Institution", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Type_Of_Institution"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Institution Name", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Institution_Name"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase("Bank Details of Applicant", fntBold));
                    objTable.AddCell(new Phrase("", fntNormal));
                    objTable.AddCell(new Phrase("", fntNormal));

                    PdfPCell objCellUnderline4 = new PdfPCell(new Phrase("", fntSlogan));
                    objCellUnderline4.Border = 0;
                    objCellUnderline4.Colspan = 3;
                    objCellUnderline4.BorderColorBottom = Color.BLACK;
                    objCellUnderline4.HorizontalAlignment = Element.ALIGN_BOTTOM;
                    objCellUnderline4.BorderWidthBottom = 0.8f;
                    objTable.AddCell(objCellUnderline4);

                    objTable.AddCell(new Phrase(sno + ".Account No", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Bank_Account_Number"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".IFSC Code", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["IFSC_Code"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Bank Name", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Bank_Name"].ToString(), fntNormal));
                    sno++;

                    objTable.AddCell(new Phrase(sno + ".Branch", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(SqlReader["Bank_Branch"].ToString(), fntNormal));
                    sno++;
                     
                    objTable.AddCell(new Phrase(sno + ".Registration Date", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    DateTime dtDatee = Convert.ToDateTime(SqlReader["Data_Date"]);
                    string RegistrationDate = string.Format("{0:dd/MM/yyyy hh:mm tt}", dtDatee);
                    objTable.AddCell(new Phrase(RegistrationDate, fntNormal));
                    sno++;


                    //WriteLog("PDF9.");
                    //Bind Upload documets
                    SqlCommand cmd = new SqlCommand();
                    SqlConnection con = new SqlConnection(strConn);
                    if (con.State != ConnectionState.Open)
                    {
                        con.Open();
                    }
                    //WriteLog("PDF10.");
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "USP_GET_USER_FILES";
                    cmd.Parameters.Add(new SqlParameter("@Application_Id", strApplnNumber));
                    cmd.Connection = con;
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    string strDoc = "";
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        for (int intJ = 0; intJ < ds.Tables[0].Rows.Count; intJ++)
                        {
                            strDoc = strDoc + ds.Tables[0].Rows[intJ]["DocumentType"].ToString() + ",";
                        }
                    }
                    //WriteLog("PDF11.");
                    objTable.AddCell(new Phrase(sno + ".Documents to be Enclosed", fntNormal));
                    objTable.AddCell(new Phrase(":", fntNormal));
                    objTable.AddCell(new Phrase(strDoc.TrimEnd(',').ToString(), fntNormal));

                    //objTable.AddCell(new Phrase("", fntNormal));
                    //objTable.AddCell(new Phrase("DECLARATION", fntApplNumberBold));
                    //objTable.AddCell(new Phrase("", fntNormal));

                    //PdfPCell objCellBl = new PdfPCell(new Phrase("I hereby declare that above written particulars are true to the best of my knowledge and belife", fntWhite));
                    //objCellBl.Border = 0;
                    //objCellBl.Colspan = 3;
                    //objTable.AddCell(objCellBl);


                    //objTable.AddCell(objCellBlankRow);
                    //objTable.AddCell(objCellBlankRow);
                    ////PdfPCell objCellLine4 = new PdfPCell(new Phrase(".", fntWhite));
                    ////objCellLine4.Border = Rectangle.BOTTOM_BORDER;
                    ////objCellLine4.BorderColor = iTextSharp.text.Color.GRAY;
                    ////objCellLine4.Colspan = 3;
                    ////objTable.AddCell(objCellLine4);

                    //objTable.AddCell(objCellBlankRow);



                    //Commd signature line by saravanan 13/05/2014
                    //PdfPTable objTableSignature = new PdfPTable(4);
                    //objTableSignature.SetWidths(new int[4] { 10, 21, 1, 21 });
                    //objTableSignature.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                    //objTableSignature.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;

                    //PdfPCell objCellDate = new PdfPCell(new Phrase("\n" + "\n" + "\n" + "Date :", fntNormal));
                    //objCellDate.Border = 0;
                    //objCellDate.BorderWidth = 0;
                    //objCellDate.BorderColor = Color.WHITE;
                    //objCellDate.VerticalAlignment = Element.ALIGN_BOTTOM;
                    //objTableSignature.AddCell(objCellDate);

                    //objTableSignature.AddCell(new Phrase(".", fntWhite));
                    //PdfPCell objCellBlank = new PdfPCell(new Phrase(".", fntWhite));
                    //objCellBlank.Border = 0;
                    //objCellBlank.VerticalAlignment = Element.ALIGN_BOTTOM;
                    //objTableSignature.AddCell(objCellBlank);

                    //objTableSignature.AddCell(new Phrase(".", fntWhite));

                    //PdfPCell objCellPlace = new PdfPCell(new Phrase("Place :", fntNormal));
                    //objCellPlace.Border = 0;
                    //objCellPlace.BorderWidth = 0;
                    //objCellPlace.BorderColor = Color.WHITE;
                    //objCellPlace.VerticalAlignment = Element.ALIGN_BOTTOM;
                    //objTableSignature.AddCell(objCellPlace);

                    //objTableSignature.AddCell(new Phrase("Parent Signature", fntNormal));
                    //objTableSignature.AddCell(objCellBlank);

                    //objTableSignature.AddCell(new Phrase("Student Signature", fntNormal));

                    //iTextSharp.text.Image objBar3;
                    //objBar3 = iTextSharp.text.Image.GetInstance(Server.MapPath(".") + "/BarcodeImage/" + strApplnNumber + "_Barcode.png");
                    //objBar3.ScaleAbsolute(100, 30);
                    //PdfPCell objCellBarcode3 = new PdfPCell(objBar3);
                    //objCellBarcode3.Border = 0;
                    //objTableSignature.AddCell(objCellBarcode3);


                    //PdfPCell objCellSignature = new PdfPCell(objTableSignature);
                    //objCellSignature.Border = 0;
                    //objCellSignature.Colspan = 3;
                    //objTable.AddCell(objCellSignature);


                    //Added newly
                    //objTable.AddCell(objCellBlankRow);
                    //objTable.AddCell(objCellBlankRow);

                    PdfPTable objTableSignature = new PdfPTable(4);
                    objTableSignature.SetWidths(new int[4] { 25, 25, 25, 25 });
                    objTableSignature.DefaultCell.Border = 0;

                    //WriteLog("PDF12.");
                    objTableSignature.DefaultCell.VerticalAlignment = Element.ALIGN_BOTTOM;
                    objTableSignature.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    string pdtDate = string.Format("{0:dd/MM/yyyy hh:mm tt}", DateTime.Now);
                    PdfPCell objCellDate = new PdfPCell(new Phrase("\n" + "Date :", fntNormal));
                    objCellDate.Border = 0;
                    objCellDate.BorderWidth = 0;
                    objCellDate.BorderColor = Color.WHITE;
                    objCellDate.VerticalAlignment = Element.ALIGN_BOTTOM;
                    objTableSignature.AddCell(objCellDate);

                    objTableSignature.AddCell(new Phrase(".", fntWhite));

                    //saravanan 11/01/2014
                    PdfPCell objCellBlank = new PdfPCell(new Phrase(".", fntWhite));
                    objCellBlank.Border = 0;
                    objCellBlank.VerticalAlignment = Element.ALIGN_BOTTOM;
                    objTableSignature.AddCell(objCellBlank);

                    objTableSignature.AddCell("");

                    PdfPCell objCellPlace = new PdfPCell(new Phrase("Place :", fntNormal));
                    objCellPlace.Border = 0;
                    objCellPlace.BorderWidth = 0;
                    objCellPlace.BorderColor = Color.WHITE;
                    objCellPlace.VerticalAlignment = Element.ALIGN_BOTTOM;
                    objTableSignature.AddCell(objCellPlace);

                    objTableSignature.AddCell(new Phrase("Signature of Parent", fntNormal));

                    objTableSignature.AddCell(new Phrase("Signature of Applicant", fntNormal));
                    //WriteLog("PDF13.");
                    //saravanan 11/01/2014
                    iTextSharp.text.Image objBar3;
                    objBar3 = iTextSharp.text.Image.GetInstance(Server.MapPath(".") + "/BarcodeImage/" + strApplnNumber + "_Barcode.png");
                    objBar3.ScaleAbsolute(100, 30);
                    PdfPCell objCellBarcode3 = new PdfPCell(objBar3);
                    objCellBarcode3.Border = 0;
                    objTableSignature.AddCell(objCellBarcode3);
                    //WriteLog("PDF14.");
                    //objCellBarcode3.HorizontalAlignment = Element.ALIGN_LEFT;
                    ////objCellBarcode.Colspan = 3;
                    //objTableSignature.AddCell(objCellBarcode3);

                    //objTableSignature.AddCell(objCellBlank);

                    PdfPCell objCellSignature = new PdfPCell(objTableSignature);
                    objCellSignature.Border = 0;
                    objCellSignature.Colspan = 3;
                    objTable.AddCell(objCellSignature);



                    //objTable.AddCell(objCellBlankRow);
                    //For office USE 
                    objTable.AddCell(objCellBlankRow);

                    PdfPTable objTableOffHead = new PdfPTable(3);
                    objTableOffHead.SetWidths(new int[3] { 30, 30, 30 });
                    objTableOffHead.DefaultCell.Border = 0;
                    objTableOffHead.DefaultCell.VerticalAlignment = Element.ALIGN_BOTTOM;
                    objTableOffHead.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;




                    objTableOffHead.AddCell(new Phrase("", fntNormal));
                    objTableOffHead.AddCell(new Phrase("OFFICE USE", fntBold));
                    objTableOffHead.AddCell(new Phrase("", fntNormal));

                    PdfPCell poffHcell = new PdfPCell(objTableOffHead);
                    poffHcell.Border = 0;
                    poffHcell.Colspan = 3;
                    objTable.AddCell(poffHcell);

                    PdfPCell objCellUnderline5 = new PdfPCell(new Phrase("", fntSlogan));
                    objCellUnderline5.Border = 0;
                    objCellUnderline5.Colspan = 3;
                    objCellUnderline5.BorderColorBottom = Color.BLACK;
                    objCellUnderline5.HorizontalAlignment = Element.ALIGN_BOTTOM;
                    objCellUnderline5.BorderWidthBottom = 0.8f;
                    objTable.AddCell(objCellUnderline5);


                    objTable.AddCell(objCellBlankRow);

                    //PdfPTable objTableSignature1 = new PdfPTable(4);
                    //objTableSignature1.SetWidths(new int[4] { 25, 25, 25, 25 });
                    //objTableSignature1.DefaultCell.Border = 0;                   
                    //objTableSignature1.DefaultCell.VerticalAlignment = Element.ALIGN_BOTTOM;
                    //objTableSignature1.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;

                    //PdfPCell objCellDate1 = new PdfPCell(new Phrase("\n" + "\n" + "\n" + "Date :", fntNormal));
                    //objCellDate1.Border = 0;
                    //objCellDate1.BorderWidth = 0;
                    //objCellDate1.BorderColor = Color.WHITE;
                    //objCellDate1.VerticalAlignment = Element.ALIGN_BOTTOM;
                    //objTableSignature1.AddCell(objCellDate1);

                    //objTableSignature1.AddCell(new Phrase(".", fntWhite));

                    ////saravanan 11/01/2014
                    //PdfPCell objCellBlank1 = new PdfPCell(new Phrase(".", fntWhite));
                    //objCellBlank1.Border = 0;
                    //objCellBlank1.VerticalAlignment = Element.ALIGN_BOTTOM;
                    //objTableSignature1.AddCell(objCellBlank1);

                    //objTableSignature1.AddCell("");

                    //PdfPCell objCellPlace1 = new PdfPCell(new Phrase("", fntNormal));
                    //objCellPlace1.Border = 0;
                    //objCellPlace1.BorderWidth = 0;
                    //objCellPlace1.BorderColor = Color.WHITE;
                    //objCellPlace1.VerticalAlignment = Element.ALIGN_BOTTOM;
                    //objTableSignature1.AddCell(objCellPlace1);



                    //objTableSignature1.AddCell(new Phrase("", fntNormal));

                    //objTableSignature1.AddCell(new Phrase("", fntNormal));

                    //objTableSignature1.AddCell(new Phrase("Signature with seal", fntNormal));

                    ////saravanan 11/01/2014

                    ////PdfPCell objCellBarcode4 = new PdfPCell(new Phrase(".", fntWhite));
                    ////objCellBarcode4.Border = 0;

                    ////objCellBarcode3.HorizontalAlignment = Element.ALIGN_LEFT;
                    //////objCellBarcode.Colspan = 3;
                    ////objTableSignature.AddCell(objCellBarcode3);

                    ////objTableSignature.AddCell(objCellBlank);

                    //PdfPCell objCellSignature1 = new PdfPCell(objTableSignature1);
                    //objCellSignature1.Border = 0;
                    //objCellSignature1.Colspan = 3;
                    //objTable.AddCell(objCellSignature1);



                    objDoc.Add(objTable);
                    //WriteLog("PDF15.");
                    strFrom = SqlReader["Email"].ToString();
                    strName = SqlReader["Applicant_Name"].ToString();
                }
                else
                {
                    //WriteLog("PDF16.");
                    return null;
                }
                pWriter.CloseStream = false;
                objDoc.Close();
                SqlReader.Close();
                //WriteLog("PDF17.");
                return mem;
            }
            catch (Exception ex)
            {
                //WriteLog("PDF18.");
                //Need to remove
                throw ex;
                //return null;
            }
        }

        private bool UploadData(string strApplicationNo)
        {

            SqlTransaction objTransaction = null;
            SqlCommand SqlCmd = null;
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            string strDocumentType = "";
            string strDocumentPath = "";
            string[] ayDocumentType;
            string[] ayDocumentPath;
            int intRegistrationID = 0;
            string strAction = null;
            string strSubject = null;
            try
            {

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
                if (fuStudentIDCard.HasFile)
                {
                    fuStudentIDCard.SaveAs(MapPath("~" + strStudentIDCard));
                    strDocumentType = strDocumentType + "Student ID Card,";
                    strDocumentPath = strDocumentPath + strStudentIDCard + ",";
                }
                if (fuRationCard.HasFile)
                {
                    fuRationCard.SaveAs(MapPath("~" + strRationCard));
                    strDocumentType = strDocumentType + "Ration Card,";
                    strDocumentPath = strDocumentPath + strRationCard + ",";
                }
                if (fuVoter.HasFile)
                {
                    fuVoter.SaveAs(MapPath("~" + strVoterID));
                    strDocumentType = strDocumentType + "Voter ID,";
                    strDocumentPath = strDocumentPath + strVoterID + ",";
                }
                if (fuPanCard.HasFile)
                {
                    fuPanCard.SaveAs(MapPath("~" + strPanCard));
                    strDocumentType = strDocumentType + "Pan Card,";
                    strDocumentPath = strDocumentPath + strPanCard + ",";
                }
                if (fuDrivingLicense.HasFile)
                {
                    fuDrivingLicense.SaveAs(MapPath("~" + strDrivingLicense));
                    strDocumentType = strDocumentType + "Driving License,";
                    strDocumentPath = strDocumentPath + strDrivingLicense + ",";
                }
                if (fuBankPassBook.HasFile)
                {
                    fuBankPassBook.SaveAs(MapPath("~" + strBankPassBook));
                    strDocumentType = strDocumentType + "Bank Pass Book,";
                    strDocumentPath = strDocumentPath + strBankPassBook + ",";
                }
                if (fuAadharID.HasFile)
                {
                    fuAadharID.SaveAs(MapPath("~" + strAadharID));
                    strDocumentType = strDocumentType + "Aadhar ID,";
                    strDocumentPath = strDocumentPath + strAadharID + ",";
                }
                if (fuBonafideStudent.HasFile)
                {
                    fuBonafideStudent.SaveAs(MapPath("~" + strBonafideStudent));
                    strDocumentType = strDocumentType + "Bonafide-Student,";
                    strDocumentPath = strDocumentPath + strBonafideStudent + ",";
                }
                if (fuBonafideParent.HasFile)
                {
                    fuBonafideParent.SaveAs(MapPath("~" + strBonafideParent));
                    strDocumentType = strDocumentType + "Bonafide-Parent,";
                    strDocumentPath = strDocumentPath + strBonafideParent + ",";
                }
                if (fuAcademicPerformance.HasFile)
                {
                    fuAcademicPerformance.SaveAs(MapPath("~" + strAcademicPerformance));
                    strDocumentType = strDocumentType + "Academic Performance,";
                    strDocumentPath = strDocumentPath + strAcademicPerformance + ",";
                }
                if (fuLetter.HasFile)
                {
                    fuLetter.SaveAs(MapPath("~" + strLetter));
                    strDocumentType = strDocumentType + "Student Letter,";
                    strDocumentPath = strDocumentPath + strLetter + ",";
                }
                strDocumentType = strDocumentType.TrimEnd(',');
                strDocumentPath = strDocumentPath.TrimEnd(',');
                ayDocumentType = strDocumentType.Split(',');
                ayDocumentPath = strDocumentPath.Split(',');
                strUploadFiles = strDocumentType;

                int intCountStatus = 0;
                for (int i = 0; i < ayDocumentPath.Length; i++)
                {
                    if (ayDocumentPath[i] != "")
                    {
                        intCountStatus++;
                    }
                }

                if (intCountStatus < 3)
                {
                    return false;
                }
                else
                {

                    //Save uploaded document
                    if (sqlConn.State != ConnectionState.Open)
                    {
                        sqlConn.Open();
                    }
                    SqlCmd = new SqlCommand();
                    SqlCmd.CommandText = "USP_SAVESCHOLERSHIP";
                    SqlCmd.CommandType = CommandType.StoredProcedure;
                    SqlCmd.Connection = sqlConn;

                    for (int intI = 0; intI < ayDocumentType.Length; intI++)
                    {
                        intRegistrationID = GetRegistrationID(strApplicationNo);
                        SqlCmd.CommandText = "USP_SAVE_USER_FILES";
                        SqlCmd.CommandType = CommandType.StoredProcedure;
                        SqlCmd.Parameters.Add(new SqlParameter("@Registration_ID", intRegistrationID));
                        SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", strApplicationNo));
                        SqlCmd.Parameters.Add(new SqlParameter("@DocumentType", ayDocumentType[intI]));
                        SqlCmd.Parameters.Add(new SqlParameter("@DocumentPath", ayDocumentPath[intI]));
                        SqlCmd.ExecuteNonQuery();
                        //objTransaction.Commit();    
                        SqlCmd.Parameters.Clear();
                    }

                    if (sqlConn.State != ConnectionState.Closed)
                        sqlConn.Close();
                    return true;
                }

            }
            catch (Exception ex)
            {
                createDir(strApplicationNo);
                if (objTransaction != null) objTransaction.Rollback();
                throw ex;
            }
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


        private void createDir(string strApplicationNo)
        {
            //DirectoryInfo myDir = new DirectoryInfo(MapPath("~/Admissions12/StudentDocs/" + DecryptQueryString(Request.QueryString["appln_no"].ToString())+"/"));
            DirectoryInfo myDir = new DirectoryInfo(MapPath("~/ScholerShipData/" + strApplicationNo.ToString() + "/"));
            myDir.Create();
        }
        private bool checkFileType(string file1, string file2, string file3)
        {
            file1 = Path.GetExtension(fuBirthCertificate.FileName);
            file2 = Path.GetExtension(fuStudentIDCard.FileName);
            file3 = Path.GetExtension(fuRationCard.FileName);
            bool flag = false;
            string[] strFiles = { file1, file2, file3 };
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

        public void SendMessage(string strApplnNumber)
        {
            SendRegistrationSMS objSMS = new SendRegistrationSMS();
            try
            {
                //objSMS.SendSMS(txtMobile.Text.Trim(), "20140150003");
                if (txtMobile.Text != null)
                {
                    StringBuilder sb = new StringBuilder();
                    //sb.Append("http://203.122.19.234/sendsmsapi.aspx?uid=navin&pwd=navin121&to=" + txtMobile.Text + "&rout=other&type=TextSMS&from=SAIRAM&msg=" + "214," + strApplnNumber);
                    sb.Append("http://sms.viblogic.com/sendsmsapi.aspx?uid=navin&pwd=navin121&to=" + txtMobile.Text + "&rout=other&type=TextSMS&from=SAIRAM&msg=" + "214," + "20140150003");
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(sb.ToString());
                    HttpWebResponse response = (HttpWebResponse)
                    request.GetResponse();
                    Stream resStream = response.GetResponseStream();
                }


            }
            catch (Exception ex)
            {
                //lblError.Text = ex.Message;
            }
        }

        protected void btnReset_Click(object sender, EventArgs e)
        {
            try
            {
                ClearText();
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }

        }

        protected void ClearText()
        {
            try
            {
                txtStudentID.Text = "";
                txtAadhaarID.Text = "";
               
                txtConfirmAadhaarID.Text = "";
                txtName.Text = "";
                txtParentName.Text = "";
                txtFatherName.Text = "";
                ddlFatherOccupathion.SelectedIndex = 0;
                ddlMotherOccupathion.SelectedIndex = 0;
                txtMotherName.Text = "";
                txtFatherOrganiz.Text = "";
                ddlMotherOccupathion.SelectedIndex = 0;
                txtMotherOrganiz.Text = "";
                txtAddressLine1.Text = "";
                txtAddressLine2.Text = "";
                txtCity.Text = "";
                txtPin.Text = "";
                ddlState.SelectedIndex = 0;
                ddlCountry.SelectedIndex = 0;
                ddlDistrict.SelectedIndex = 0;
                txtState.Text = "";
                txtDistrict.Text = "";
                txtCountry.Text = "";
                txtMobile.Text = "";
                txtEmailID.Text = "";
                txtDOB.Text = "";
                radGender.ClearSelection();
                ddlCoomunity.SelectedIndex = 0;
                txtCaste.Text = "";
                ddlAppllcantCat.SelectedIndex = 0;
                ddlClassStudying.SelectedIndex = 0;
                ddlXIIBoard.SelectedIndex = 0;
                txtBoardOthers.Text = "";
                ddlCourseofStudying.SelectedIndex = 0;
                radTypeofInstitution.ClearSelection();
                radUgPGType.ClearSelection();
                txtOtherDegree.Text = "";
                ddlPhd.SelectedIndex = 0;
                txtSpecializhation.Text = "";
                txtInstitution.Text = "";
                txtUniversity.Text = "";
                ddlCurrentYear.SelectedIndex = 0;
                ddlCurrentSem.SelectedIndex = 0;
                ddlMotherAnnualIncome.SelectedIndex = 0;

                ddlFatherAnnualIncome.SelectedIndex = 0;

                txtAccountNo.Text = "";
                ddlBankName.SelectedIndex = 0;
                txtBranch.Text = "";
                txtIFSCCode.Text = "";
                txtRequestAmount.Text = "";
                txtOtherMotherOccupation.Text = "";
                txtOtherFatherOccupation.Text = "";
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected void LoadAdmissionYear()
        {
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataReader SqlReader;
            try
            {
                SqlCmd = new SqlCommand("select * from T_Scholarship_Year where Status='true'", sqlConn);
                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlReader = SqlCmd.ExecuteReader();
                if (SqlReader.Read())
                {
                    Session["AdYearCode"] = SqlReader["ScholarshipYear_Code"].ToString();
                    Session["AdYearName"] = SqlReader["ScholarshipYear_Name"].ToString();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
            }
        }

        //public byte[] imageToByteArray(System.Drawing.Image imageIn)
        //{
        //    MemoryStream ms = new MemoryStream();
        //    imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
        //    return ms.ToArray();
        //}



        //----For RG 
        protected void ddlCountry_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlCountry.SelectedValue.Trim() == "0") // Select
                {
                    //Country
                    divtxtcountry.Attributes.CssStyle.Add("Display", "none");
                    rfvCountrtTxt.Enabled = false;
                    //State
                    DivStatelbl.Attributes.CssStyle.Add("Display", "none");
                    divddlstate.Attributes.CssStyle.Add("Display", "none");
                    rfvStatedddl.Enabled = false;
                    divtxtstate.Attributes.CssStyle.Add("Display", "none");
                    rfvStatetxt.Enabled = false;

                    txtCountry.Text = "";
                    txtState.Text = "";
                    ddlState.SelectedIndex = 0;
                    Disable_Other_District();

                }
                else if (ddlCountry.SelectedValue.Trim() == "100") //india
                {
                    //Country
                    divtxtcountry.Attributes.CssStyle.Add("Display", "none");
                    rfvCountrtTxt.Enabled = false;
                    //State
                    DivStatelbl.Attributes.CssStyle.Add("Display", "block");
                    divddlstate.Attributes.CssStyle.Add("Display", "block");
                    rfvStatedddl.Enabled = true;
                    divtxtstate.Attributes.CssStyle.Add("Display", "none");
                    rfvStatetxt.Enabled = false;

                    txtCountry.Text = "";
                    txtState.Text = "";
                    ddlState.SelectedIndex = 0;

                    Disable_Other_District();
                }
                else //others
                {
                    //Country
                    divtxtcountry.Attributes.CssStyle.Add("Display", "block");
                    rfvCountrtTxt.Enabled = true;
                    //State
                    divddlstate.Attributes.CssStyle.Add("Display", "none");
                    rfvStatedddl.Enabled = false;
                    DivStatelbl.Attributes.CssStyle.Add("Display", "block");
                    divtxtstate.Attributes.CssStyle.Add("Display", "block");
                    rfvStatetxt.Enabled = true;

                    txtCountry.Text = "";
                    txtState.Text = "";
                    ddlState.SelectedIndex = 0;
                    Enable_Other_District();

                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }
        protected void ddlState_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlState.SelectedItem.Text == "Tamil Nadu")
                {
                    //District
                    trDistrict.Attributes.CssStyle.Add("Display", "block");
                    DivDistrictlbl.Attributes.CssStyle.Add("Display", "block");
                    divddlDistrict.Attributes.CssStyle.Add("Display", "block");
                    divtxtDistrict.Attributes.CssStyle.Add("Display", "none");
                    rfvddlDistrict.Enabled = true;
                    rfvtxtDistrict.Enabled = false;
                    txtDistrict.Text = "";
                }
                else
                {
                    //District
                    trDistrict.Attributes.CssStyle.Add("Display", "block");
                    DivDistrictlbl.Attributes.CssStyle.Add("Display", "block");
                    divddlDistrict.Attributes.CssStyle.Add("Display", "none");
                    divtxtDistrict.Attributes.CssStyle.Add("Display", "block");
                    rfvddlDistrict.Enabled = false;
                    rfvtxtDistrict.Enabled = true;
                    ddlDistrict.SelectedIndex = 0;
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }
        private void Disable_Other_District()
        {
            try
            {
                //pDistrict
                trDistrict.Attributes.CssStyle.Add("Display", "none");
                DivDistrictlbl.Attributes.CssStyle.Add("Display", "none");
                divddlDistrict.Attributes.CssStyle.Add("Display", "none");
                divtxtDistrict.Attributes.CssStyle.Add("Display", "none");
                rfvddlDistrict.Enabled = false;
                rfvtxtDistrict.Enabled = true;

                txtDistrict.Text = "";
                ddlDistrict.SelectedIndex = 0;
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }
        private void Enable_Other_District()
        {
            try
            {
                //pDistrict
                trDistrict.Attributes.CssStyle.Add("Display", "block");
                DivDistrictlbl.Attributes.CssStyle.Add("Display", "block");
                divddlDistrict.Attributes.CssStyle.Add("Display", "none");
                divtxtDistrict.Attributes.CssStyle.Add("Display", "block");
                rfvddlDistrict.Enabled = false;
                rfvtxtDistrict.Enabled = true;

                txtDistrict.Text = "";
                ddlDistrict.SelectedIndex = 0;
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }
        protected void ddlXIIBoard_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlXIIBoard.SelectedItem.Value == "Others")
                {
                    dvBoardOthers.Attributes.CssStyle.Add("Display", "block");
                }
                else
                {
                    dvBoardOthers.Attributes.CssStyle.Add("Display", "none");
                    txtBoardOthers.Text = "";
                }

            }
            catch (Exception ex)
            {
                lblError.Text = "Error in Board Selection : " + ex.Message.ToString();
            }
        }
        protected void ddlCourseofStudying_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                ddlDegree.DataSource = objApproval.GetCourseType(ddlCourseofStudying.SelectedValue.ToString(), radUgPGType.SelectedValue.ToString());
                ddlDegree.DataTextField = "Degree";
                ddlDegree.DataValueField = "Degree";
                ddlDegree.DataBind();


                if (ddlCourseofStudying.SelectedValue == "Medical" || ddlCourseofStudying.SelectedValue == "Legal")
                {
                    dvOtherDegree.Visible = true;
                    dvCurrentYear.Visible = true;
                    dvCurrentSemester.Visible = true;
                    dvDegree.Visible = false;
                    dvUgPgtype.Visible = false;
                    reqUgPGType.Enabled = false;
                    rfvDegree.Enabled = false;
                    reqOtherdegree.Enabled = true;
                    txtOtherDegree.Text = "";
                    ddlCurrentSem.SelectedIndex = 0;
                    ddlCurrentYear.SelectedIndex = 0;
                }
                else if (ddlCourseofStudying.SelectedValue == "Others")
                {
                    dvOtherDegree.Visible = true;
                    dvDegree.Visible = false;
                    dvUgPgtype.Visible = true;
                    dvCurrentYear.Visible = true;
                    dvCurrentSemester.Visible = true;

                    reqUgPGType.Enabled = true;
                    rfvDegree.Enabled = false;
                    reqOtherdegree.Enabled = true;
                    ddlCurrentSem.SelectedIndex = 0;
                    ddlCurrentYear.SelectedIndex = 0;
                }
                else if (ddlCourseofStudying.SelectedValue == "Diploma")
                {
                    dvOtherDegree.Visible = false;
                    dvDegree.Visible = false;
                    dvUgPgtype.Visible = false;
                    dvCurrentYear.Visible = true;
                    dvCurrentSemester.Visible = true;

                    reqUgPGType.Enabled = false;
                    rfvDegree.Enabled = false;
                    reqOtherdegree.Enabled = false;
                    ddlCurrentSem.SelectedIndex = 0;
                    ddlCurrentYear.SelectedIndex = 0;
                }
                else if (ddlCourseofStudying.SelectedValue == "PreUniversity")
                {
                    dvOtherDegree.Visible = false;
                    dvDegree.Visible = false;
                    dvUgPgtype.Visible = false;

                    reqUgPGType.Enabled = false;
                    rfvDegree.Enabled = false;
                    reqOtherdegree.Enabled = false;
                    dvCurrentYear.Visible = false;
                    dvCurrentSemester.Visible = false;
                }
                else
                {
                    dvOtherDegree.Visible = false;
                    dvDegree.Visible = true;
                    dvUgPgtype.Visible = true;
                    dvCurrentYear.Visible = true;
                    dvCurrentSemester.Visible = true;

                    reqUgPGType.Enabled = true;
                    rfvDegree.Enabled = true;
                    reqOtherdegree.Enabled = false;
                    ddlCurrentSem.SelectedIndex = 0;
                    ddlCurrentYear.SelectedIndex = 0;
                }
            }
            catch (Exception ex)
            {
                lblError.Text = "Error in Course Selection : " + ex.Message.ToString();
            }
        }
        protected void fncradiochange()
        {
            try
            {
                if (ddlAppllcantCat.SelectedIndex == 1)
                {
                    dvClassStudying.Visible = true;
                    rfvClassStudying.Enabled = true;
                    dvBoard.Visible = true;
                    rfvXIIBoard.Enabled = true;

                    //College
                    dvCourseOfStudying.Visible = false;
                    rfvCourseofStudying.Enabled = false;
                    //dvProfessional.Visible = false;
                    //rfvProfessionalCourse.Enabled = false;
                    // dvDept.Visible = false;
                    //rfvDepartment.Enabled = false;
                    //regEvDepartment.Enabled = false;
                    dvUniversity.Visible = false;
                    regEvUniversity.Enabled = false;
                    dvCurrentYear.Visible = false;
                    reqCurrentYear.Enabled = false;
                    dvCurrentSemester.Visible = false;
                    reqCurrentSem.Enabled = false;

                    //Recearch
                    dvPhdCources.Visible = false;
                    reqPhdCources.Enabled = false;
                    dvSpecialization.Visible = false;
                    reqSpecialization.Enabled = false;


                    dvUgPgtype.Visible = false;
                    reqUgPGType.Enabled = false;
                    dvDegree.Visible = false;
                    rfvDegree.Enabled = false;

                    dvOtherDegree.Visible = false;
                    reqOtherdegree.Enabled = false;

                }
                else if (ddlAppllcantCat.SelectedIndex == 2)
                {
                    dvCourseOfStudying.Visible = true;
                    rfvCourseofStudying.Enabled = true;
                    //dvProfessional.Visible=true;
                    //rfvProfessionalCourse.Enabled=true;
                    //dvDept.Visible=true;
                    // rfvDepartment.Enabled=true;
                    // regEvDepartment.Enabled=true;
                    dvUniversity.Visible = true;
                    regEvUniversity.Enabled = true;

                    dvCurrentYear.Visible = true;
                    dvCurrentSemester.Visible = true;

                    reqCurrentYear.Enabled = true;
                    reqCurrentSem.Enabled = true;

                    //School
                    dvClassStudying.Visible = false;
                    rfvClassStudying.Enabled = false;
                    dvBoard.Visible = false;
                    rfvXIIBoard.Enabled = false;


                    //research
                    dvPhdCources.Visible = false;
                    dvSpecialization.Visible = false;
                    reqPhdCources.Enabled = false;
                    reqSpecialization.Enabled = false;

                    dvUgPgtype.Visible = true;
                    reqUgPGType.Enabled = true;
                    dvDegree.Visible = true;
                    rfvDegree.Enabled = true;
                    dvOtherDegree.Visible = true;
                    reqOtherdegree.Enabled = true;
                }
                else
                {

                    //research
                    dvPhdCources.Visible = true;
                    dvSpecialization.Visible = true;



                    dvCourseOfStudying.Visible = false;
                    rfvCourseofStudying.Enabled = true;
                    //dvProfessional.Visible=false;
                    //rfvProfessionalCourse.Enabled=true;
                    //  dvDept.Visible=true;
                    //rfvDepartment.Enabled=true;
                    //regEvDepartment.Enabled=true;
                    dvUniversity.Visible = true;
                    regEvUniversity.Enabled = true;

                    dvCurrentYear.Visible = false;
                    dvCurrentSemester.Visible = false;
                    reqCurrentYear.Enabled = false;
                    reqCurrentSem.Enabled = false;


                    //School
                    dvClassStudying.Visible = false;
                    rfvClassStudying.Enabled = false;
                    dvBoard.Visible = false;
                    rfvXIIBoard.Enabled = false;

                    dvUgPgtype.Visible = false;
                    reqUgPGType.Enabled = false;
                    dvDegree.Visible = false;
                    rfvDegree.Enabled = false;
                    dvOtherDegree.Visible = false;
                    reqOtherdegree.Enabled = false;

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //protected void radRegisteredFor_SelectedIndexChanged(object sender, EventArgs e)
        //{
        //    try
        //    {
        //        spnEducation.Visible = true;
        //        fncradiochange();
        //    }
        //    catch (Exception ex)
        //    {
        //        lblError.Text = ex.Message;
        //    }
        //}
        protected void radUgPGType_SelectedIndexChanged(object sender, EventArgs e)
        {

            try
            {
                ddlDegree.DataSource = objApproval.GetCourseType(ddlCourseofStudying.SelectedValue.ToString(), radUgPGType.SelectedValue.ToString());
                ddlDegree.DataTextField = "Degree";
                ddlDegree.DataValueField = "Degree";
                ddlDegree.DataBind();
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }

        }

        protected void ddlFatherOccupathion_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlFatherOccupathion.SelectedValue.ToString() == "Others")
                {
                    dvOtherFatherOccupation.Visible = true;
                    rfvOtherFatherOccupation.Enabled = true;

                }
                else
                {
                    dvOtherFatherOccupation.Visible = false;
                    rfvOtherFatherOccupation.Enabled = false;
                    txtOtherFatherOccupation.Text = "";

                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }

        protected void ddlMotherOccupathion_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlMotherOccupathion.SelectedValue.ToString() == "Others")
                {
                    dvOtherMotherOccupathion.Visible = true;
                    rvfOtherMotherOccupation.Enabled = true;

                }
                else
                {
                    dvOtherMotherOccupathion.Visible = false;
                    rvfOtherMotherOccupation.Enabled = false;
                    txtOtherMotherOccupation.Text = "";

                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }

        protected void ddlGuardianOccupation_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlGuardianOccupation.SelectedValue.ToString() == "Others")
                {
                    dvOtherGuardianOccupation.Visible = true;
                    rvOtherGuardianOccupation.Enabled = true;
                }
                else
                {
                    dvOtherGuardianOccupation.Visible = false;
                    rvOtherGuardianOccupation.Enabled = false;
                    txtOtherGuardianOccupation.Text = "";
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }

        protected void ddlDegree_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlDegree.SelectedValue.ToString() == "Others")
                {
                    dvOtherDegree.Visible = true;
                    ddlCurrentSem.SelectedIndex = 0;
                    ddlCurrentYear.SelectedIndex = 0;
                }
                else
                {
                    dvOtherDegree.Visible = false;
                    txtOtherDegree.Text = "";
                    ddlCurrentSem.SelectedIndex = 0;
                    ddlCurrentYear.SelectedIndex = 0;
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }

        protected void ddlAppllcantCat_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlAppllcantCat.SelectedIndex != 0)
                {
                    spnEducation.Visible = true;
                    fncradiochange();
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
        }



        public void SendApplnForm(string ApplnNumber)
        {
            string strApplnNumber=ApplnNumber;
            MemoryStream mem = new MemoryStream();
            try
            {
                strApplnNumber = Session["ID"].ToString();
                mem = new MemoryStream();
                mem = Generate_PDF(strApplnNumber, ScholarshipYearName);

                objApproval.ErrorLog(strApplnNumber, "SendApplnForm", "Generate PDF memory stream", "");

                byte[] bytes = new byte[mem.Length];
                bytes = mem.ToArray();
                if (!System.IO.Directory.Exists(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/"))
                {
                    DirectoryInfo myDir = new DirectoryInfo(MapPath("~/Registered_Pdf_ScholerShip/"));
                    myDir.Create();
                }
                File.WriteAllBytes(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/" + strApplnNumber + ".pdf", bytes);

                // Mail Function 
                Attachment attFiles = new Attachment(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/" + strApplnNumber + ".pdf");
                String strToAddress = txtEmailID.Text;
                String strFromAddress = ScholarshipYearMailId;
                String strSubject = ScholarshipYearMailSubject + " " + strApplnNumber;
                String strBodyTxt = "<html><body><span style='font-family:Tahoma; font-size:small'>";
                strBodyTxt = strBodyTxt + "Dear <b><i>" + strName + "</i></b>,<br><br>";
                strBodyTxt = strBodyTxt + "You have successfully registered with LEO MUTHU Scholarship programme " + ScholarshipYearName + ". Please note your application number <b>" + strApplnNumber + "</b> for future reference.<br>Your application number has been sent to the registered mobile number. ";
                //strBodyTxt = strBodyTxt + "<br><br><b>Educating for the future... Preparing for life...</b><br><br><b>About the Institution...</b><br>Sri Sai Ram Engineering College located at Sai Leo Nagar, West Tambaram, Chennai, is an NBA Accredited and ISO 9001:2008 Certified Institution. The institution is the dream of its Chairman, <b><i>MJF.Ln.Leo Muthu</i></b>, realised by the blessings of Shirdi Sai Baba. Today, it is one of the most respected and sought after engineering colleges in Tamil Nadu.";
                strBodyTxt = strBodyTxt + "<br><br><b>Administration Officer</b><br>LEO MUTHU Scholarship(AUO)Aram Foundation, Chennai.</span></body></html>";

                if (strToAddress == "")
                {
                    strToAddress = strFromAddress;
                }
               // MailMessage message = new MailMessage(strFromAddress, strToAddress, strSubject, strBodyTxt);
               // message.ReplyTo = new MailAddress(ScholarshipYearReplyMailId);
                objApproval.ErrorLog(strApplnNumber, "SendApplnForm", "FromAddress" + strFromAddress + "strToAddress;"+strToAddress , "");
                //Bccs
                List<string> Bccs = new List<string>();
                Bccs = ScholarshipYearBCCMailId.Split(',').ToList();
                //foreach (string BCCemail in Bccs)
                //{
                //    message.Bcc.Add(BCCemail);
                //}
                ////message.Bcc.Add("Ladmission2013@sairamgroup.in");
                ////message.Bcc.Add("test@itech-india.com");                
                //message.Attachments.Add(attFiles);

                //message.IsBodyHtml = true;
                //SmtpClient emailClient = new SmtpClient();
                //emailClient.Host = ConfigurationManager.AppSettings["MailSmtp"].ToString();
                //emailClient.Port = 25;
                //emailClient.Credentials = new System.Net.NetworkCredential("donotreply@itechind.com", "donotreply123");
                //emailClient.Send(message);

                attFiles.Name = "RegistrationForm_" + strApplnNumber + ".pdf";
                clsEmail.SendMail(strFromAddress, strToAddress, ScholarshipYearReplyMailId, strSubject, strBodyTxt, null, Bccs, attFiles);

                //send message
                SendMessage(strApplnNumber);
            }
            catch (Exception ex)
            {

                objApproval.ErrorLog(strApplnNumber, "SendApplnForm", "error:" +ex.Message, "");
                //Need to remove
                //throw ex;
            }



        }


        private void WriteLog(string message)
            {
                try
                {
                    string logFolder = Server.MapPath("~/App_Data/Logs/");
                    if (!Directory.Exists(logFolder))
                    {
                        Directory.CreateDirectory(logFolder);
                    }

                    string logFile = Path.Combine(logFolder, "app_log.txt");

                    using (StreamWriter writer = new StreamWriter(logFile, true))
                    {
                        writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss}  -  {message}");
                    }
                }
                catch
                {
                    // Avoid throwing logging errors to user
                }
            }












        




    }
}
