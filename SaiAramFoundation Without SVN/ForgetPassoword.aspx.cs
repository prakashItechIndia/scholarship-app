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
using System.Drawing;
using System.Net.Mail;

namespace SaiAramFoundation
{
    public partial class ForgetPassoword : System.Web.UI.Page
    {

        Object SubmitLock = new Object();
        clsCommon objCommon = new clsCommon();
        List<ClsT_ScholarshipYearSetting> lstsetting = new List<ClsT_ScholarshipYearSetting>();
        public static string ScholarshipYearCode, ScholarshipYearName, ScholarshipYearMailId, ScholarshipYearReplyMailId, ScholarshipYearCCMailId, ScholarshipYearBCCMailId, ScholarshipYearMailSubject;

        clsApproval objApproval = new clsApproval();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                 lstsetting = getApplicationSetting();
                        if (lstsetting.Count > 0)
                        {
                            ScholarshipYearCode = lstsetting[0].ScholarshipYearCode;
                            ScholarshipYearName = lstsetting[0].ScholarshipYearName;
                            ScholarshipYearMailId = lstsetting[0].ScholarshipYearMailId;
                            ScholarshipYearReplyMailId = lstsetting[0].ScholarshipYearReplyMailId;
                            ScholarshipYearCCMailId = lstsetting[0].ScholarshipYearCCMailId;
                            ScholarshipYearBCCMailId = lstsetting[0].ScholarshipYearBCCMailId;
                            ScholarshipYearMailSubject = lstsetting[0].ScholarshipYearMailSubject;
                        }
                        else
                        {
                            lblError.Text = "Error in Page loading : ScholarshipYear Table Empty.....";
                        }
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

        public string CheckUserPassword(string strEMail)
        {
            string strCheckUserEMail;
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
                //SqlCmd.CommandText = " Select User_ID from TBL_USERMASTER where User_ID='"+ strUser+"' ";
                //SqlCmd.CommandType = CommandType.Text;
                //SqlCmd.Connection = sqlConn;
                strQuery = "";
                strQuery += "Select Password from TBL_USERMASTER where IsActive=1 and EMail_Id='" + strEMail + "'";
                da = new SqlDataAdapter(strQuery, sqlConn);
                da.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    strCheckUserEMail = ds.Tables[0].Rows[0]["Password"].ToString();
                }
                else
                {
                    strCheckUserEMail = "";
                }
                return strCheckUserEMail;

                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
                sqlConn.Dispose();
                SqlCmd.Dispose();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

            }
        }



        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            string strCheckUser = "";
            string strDecryptPassword = "";
            try
            {
                strCheckUser = CheckUserPassword(txtEmail.Text.Trim().ToString());
                strDecryptPassword = objCommon.Decryptdata(strCheckUser);

                //Mail function
                String strToAddress = txtEmail.Text.Trim().ToString();
                String strFromAddress = ScholarshipYearMailId;
                String strSubject = ScholarshipYearMailSubject + ": Your ARAM Foundation E-Challan Password ! ";
                String strBodyTxt = "<html><body><span style='font-family:Tahoma; font-size:small'>";
                strBodyTxt = strBodyTxt + "Dear Sir/Madam, <br><br>";
                strBodyTxt = strBodyTxt + "As per your request please find your Password as follows for ARAM E-Challan: <b>" + strDecryptPassword;

                strBodyTxt = strBodyTxt + "<br><br><b>Administration Officer</b><br>LEO MUTHU Scholarship(AUO)Aram Foundation, Chennai.</span></body></html>";

                ////Bccs
                List<string> Bccs = new List<string>();
                Bccs = ScholarshipYearBCCMailId.Split(',').ToList();


                //MailMessage message = new MailMessage(strFromAddress, strToAddress, strSubject, strBodyTxt);
                //message.ReplyTo = new MailAddress(ScholarshipYearReplyMailId);

                ////Bccs
                //List<string> Bccs = new List<string>();
                //Bccs = ScholarshipYearBCCMailId.Split(',').ToList();
                //foreach (string BCCemail in Bccs)
                //{
                //    message.Bcc.Add(BCCemail);
                //}
                ////message.Bcc.Add("Ladmission2013@sairamgroup.in");
                ////message.Bcc.Add("test@itech-india.com");                
                ////s message.Attachments.Add(attFiles);

                //message.IsBodyHtml = true;
                //SmtpClient emailClient = new SmtpClient();
                //emailClient.Host = ConfigurationManager.AppSettings["MailSmtp"].ToString();
                //emailClient.Port = 25;
                //emailClient.Credentials = new System.Net.NetworkCredential("donotreply@itechind.com", "donotreply123");
                //emailClient.Send(message);


                clsEmail.SendMail(ScholarshipYearMailId, strToAddress, ScholarshipYearReplyMailId, strSubject, strBodyTxt, null, Bccs, null);
                ScriptManager.RegisterStartupScript(this, typeof(Page), "Message", "alert('Password has sent to your mail id succerssfully');", true);
                txtEmail.Text = "";
            }
            catch (Exception ex)
            {                
                throw ex;
            }
        }
    }
}
