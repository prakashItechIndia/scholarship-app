using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SaiAramFoundation.Classes;
using Telerik.Web.UI;
using System.Net;

namespace SaiAramFoundation
{
    public partial class GeneratePDF : System.Web.UI.Page
    {
        List<ClsT_ScholarshipYearSetting> lstsetting = new List<ClsT_ScholarshipYearSetting>();
        clsCommon objCommon = new clsCommon();
        public static string ScholarshipYearCode, ScholarshipYearName, ScholarshipYearMailId, ScholarshipYearReplyMailId, ScholarshipYearCCMailId, ScholarshipYearBCCMailId, ScholarshipYearMailSubject;
        public static int ScholarshipYearId;
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //WriteLog("Page loaded.");

                if (!IsPostBack)
                {
                    string appNo = Request.QueryString["appno"];
                    LoadInitialSettings();

                    //  PhotomovefromEdmission();

                    string ScholarshipYear = ScholarshipYearCode.Substring(2, 2);
                    if (appNo == "bulk")
                    {


                        string strConnectionString = objCommon.GetConnectionString();
                        SqlConnection connSql = new SqlConnection(strConnectionString);
                        SqlCommand cmd = new SqlCommand();

                        cmd.CommandText = "Select Application_Id from t_Registration where Sch_Year='" + ScholarshipYear + "' ";
                        cmd.Connection = connSql;
                        if (connSql.State != ConnectionState.Open)
                            connSql.Open();
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {

                            GenerateBarCode(dr["Application_Id"].ToString());
                            Generate_PDF(dr["Application_Id"].ToString(), "bulk");
                        }
                        dr.Close();


                        int intRoleID = Convert.ToInt32(Session["Roles_Id"]);
                        if (intRoleID == 1 || intRoleID == 7)
                        {
                            ScriptManager.RegisterStartupScript(this, this.GetType(), "alert", "alert('Bulk print completed');window.location='AdminPanelApprove.aspx';", true);
                        }
                        else
                        {
                            ScriptManager.RegisterStartupScript(this, this.GetType(), "alert", "alert('Bulk print completed');window.location='AdminPanelHome.aspx';", true);
                        }
                    }
                    else
                    {

                        //WriteLog("Call1.");

                        GenerateBarCode(appNo);

                        //WriteLog("Call2.");
                        Generate_PDF(appNo, "");

                        //WriteLog("Call3.");
                    }
                }
            }
            catch(Exception ex)
            {
                throw ex;
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

                throw ex;
            }
        }

        protected void Generate_PDF(string appno, string strType)
        {
            clsCommon objCommon = new clsCommon();
            clsApproval objApprove = new clsApproval();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            MemoryStream mem = new MemoryStream();
            ScholarshipRegistration objAdmission = new ScholarshipRegistration();
            SqlCommand SqlCmd = new SqlCommand();
            SqlDataReader SqlReader;
            string strQuery;
            string strApplicationNo = "";
            string strName = "", strTo = "";

            try
            {
                strApplicationNo = appno;
                strQuery = "";
                strQuery = "Select * from t_Registration Where Application_Id = '" + strApplicationNo + "' ";
                SqlCmd = new SqlCommand(strQuery, sqlConn);
                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlReader = SqlCmd.ExecuteReader();

                int intRoleID = Convert.ToInt32(Session["Roles_Id"]);
                if (SqlReader.Read())
                {

                    //WriteLog("Call4.");


                    mem = objAdmission.Generate_PDF(strApplicationNo, ScholarshipYearName);
                    if (mem != null)
                    {

                        //WriteLog("Call5.");

                        strTo = SqlReader["Email"].ToString();
                        strName = SqlReader["Applicant_Name"].ToString();

                        if (!SqlReader.IsClosed)
                            SqlReader.Close();

                        byte[] bytes = new byte[mem.Length];
                        bytes = mem.ToArray();

                        if (!System.IO.Directory.Exists(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/"))
                        {
                            DirectoryInfo myDir = new DirectoryInfo(MapPath("~/Registered_Pdf_ScholerShip/"));
                            myDir.Create();
                        }
                        File.WriteAllBytes(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/" + strApplicationNo + ".pdf", bytes);

                        //Insert History
                        strQuery = "Insert into TBL_HISTORY";
                        strQuery += "(Application_Id, PROCESS, ACTION, DATA_DATE, USER_ID)";
                        strQuery += "Values(";
                        strQuery += "'" + strApplicationNo + "', 'Re-Print Application Form', 'Re-Print PDF',";
                        strQuery += "'" + DateTime.Now.ToString() + "', '" + Session["User_Name"].ToString() + "' )";
                        SqlCmd = new SqlCommand(strQuery, sqlConn);
                        SqlCmd.ExecuteNonQuery();

                        if (sqlConn.State != ConnectionState.Closed)
                            sqlConn.Close();


                        if (strTo != "" && strTo != null)
                        {
                            LoadInitialSettings();
                            Attachment attFiles = new Attachment(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/" + strApplicationNo + ".pdf");
                            String strToAddress = strTo;
                            String strFromAddress = ScholarshipYearMailId;
                            String strSubject = "Re-Print Application Form - LEO MUTHU Scholarship programme (" + ScholarshipYearName + ") - " + strApplicationNo;
                            String strBodyTxt = "<html><body><span style='font-family:Tahoma; font-size:small'>";
                            strBodyTxt = strBodyTxt + "Dear <b><i>" + strName + "</i></b>,<br><br>";
                            strBodyTxt = strBodyTxt + "You have successfully registered with LEO MUTHU Scholarship programme " + ScholarshipYearName + ". Please note your application number <b>" + strApplicationNo + "</b> for future reference.<br>Your application number has been sent to the registered mobile number. ";
                            strBodyTxt = strBodyTxt + "<br><br><b>Administration Officer</b><br>LEO MUTHU Scholarship(AUO)Aram Foundation, Chennai.</span></body></html>";
                           // MailMessage message = new MailMessage(strFromAddress, strToAddress, strSubject, strBodyTxt);
                           // message.ReplyTo = new MailAddress(ScholarshipYearReplyMailId);
                            //----------By PSI---23/04/2013------------------
                            //message.ReplyTo = new MailAddress("demo@itech-india.com");
                            //message.Bcc.Add("demo@itech-india.com");
                            //message.Bcc.Add("demo@itech-india.com");
                            //message.Bcc.Add("saravananiyappan.p@itech-india.com");
                            //Bccs
                            List<string> Bccs = new List<string>();
                            Bccs = ScholarshipYearBCCMailId.Split(',').ToList();
                            //foreach (string BCCemail in Bccs)
                            //{
                            //    message.Bcc.Add(BCCemail);
                            //}
                            attFiles.Name = "RegistrationForm_" + strApplicationNo + ".pdf";
                            //message.Attachments.Add(attFiles);

                            //message.IsBodyHtml = true;
                            //SmtpClient emailClient = new SmtpClient();
                            //emailClient.Host = ConfigurationManager.AppSettings["MailSmtp"].ToString();
                            //emailClient.Port = 25;
                            //emailClient.Credentials = new System.Net.NetworkCredential("donotreply@itechind.com", "donotreply123");

                            //emailClient.Send(message);
                           // clsEmail.SendMail(ScholarshipYearMailId, strToAddress, ScholarshipYearReplyMailId, strSubject, strBodyTxt, null, Bccs, attFiles);
                        }

                        if (strType != "bulk")
                        {
                            //Response.Redirect("RG_Registered_PDF/" + txtApplication.Text + ".pdf");
                            Response.Clear();
                            Response.ContentType = "application/force-download";
                            Response.AddHeader("content-disposition", "attachment;    filename=" + strApplicationNo + ".pdf");
                            Response.BinaryWrite(bytes);
                            Response.End();
                        }
                    }

                    //WriteLog("Call6.");
                }
            }
            catch (Exception ex)
            {
                //if (ex.Message.StartsWith("Thread") == false)
                //{
                //    //Response.Redirect("RGWarning.aspx");
                //}
                throw ex;
            }
            finally
            {
                //mem.Close();
                //mem = null;
                //SqlCmd.Dispose();
                //sqlConn.Close();
                //sqlConn = null;
            }
        }

        protected void LoadInitialSettings()
        {
            try
            {
                lstsetting = getApplicationSetting();
                ScholarshipYearId = Convert.ToInt32(lstsetting[0].ScholarshipYearId);
                ScholarshipYearCode = lstsetting[0].ScholarshipYearCode;
                ScholarshipYearName = lstsetting[0].ScholarshipYearName;
                ScholarshipYearMailId = lstsetting[0].ScholarshipYearMailId;
                ScholarshipYearReplyMailId = lstsetting[0].ScholarshipYearReplyMailId;
                ScholarshipYearCCMailId = lstsetting[0].ScholarshipYearCCMailId;
                ScholarshipYearBCCMailId = lstsetting[0].ScholarshipYearBCCMailId;
                ScholarshipYearMailSubject = lstsetting[0].ScholarshipYearMailSubject;
            }
            catch (Exception ex)
            {
                throw ex;
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
                throw ex;
                //return lstScholarshipYearTable;
            }


        }

        private void PhotomovefromEdmission()
        {

            string EA_applicationid = "";
            try
            {
                LoadInitialSettings();
                string ScholarshipYear = ScholarshipYearCode.Substring(2, 2);

                string strConnectionString = objCommon.GetConnectionString();
                SqlConnection connSql = new SqlConnection(strConnectionString);
                SqlCommand cmd = new SqlCommand();

                cmd.CommandText = "Select Application_Id,ApplicationID_SAI_EAdmission from t_Registration where Sch_Year='" + ScholarshipYear + "' and ApplicationID_SAI_EAdmission is not null ";
                cmd.Connection = connSql;
                if (connSql.State != ConnectionState.Open)
                    connSql.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                List<string> lstPhotoNotAvailable = new List<string>();
                while (dr.Read())
                {
                    string Eadmissionphotodir = "http://admission.sairamgroup.in/Engineering_UG/Photos/";
                    string lms_applicationid = dr["Application_Id"].ToString();
                     EA_applicationid = dr["ApplicationID_SAI_EAdmission"].ToString();

                    string photourl = Eadmissionphotodir + EA_applicationid + ".jpg";

                    byte[] data;

                    if (EA_applicationid == "20170150480")
                    {
                        string b = "";
                    }


                bool fileexist=    URLExists(photourl);
                if (fileexist)
                {
                    using (WebClient client = new WebClient())
                    {
                        data = client.DownloadData(photourl);
                    }
                    File.WriteAllBytes(Server.MapPath(".") + "/Photos/" + lms_applicationid + "_Photo.jpg", data);


                }
                else
                {
                    lstPhotoNotAvailable.Add(EA_applicationid);
                }

                   


                    // // FileInfo file = new FileInfo(photourl);
                    //  Stream onjStream;
                    //  onjStream = GetStreamFromUrl(photourl);
                    //  MemoryStream memoryStream = new MemoryStream();

                    //  onjStream.Co(requestStream);
                    // // fileStream.Position = 0;
                    // // fileStream.CopyTo(memoryStream);  



                    //memoryStream.wri(Server.MapPath(".") + "Photos/" + lms_applicationid + ".jpg");


                }
                dr.Close();



            }
            catch (Exception ex)
            {
                string aaa = EA_applicationid;
                
                throw ex ;
            }
           
           
          


        }

        public bool URLExists(string url)
        {
            try
            {
                byte[] data;
                using (WebClient client = new WebClient())
                {
                    data = client.DownloadData(url);
                }

                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }
        private static Stream GetStreamFromUrl(string url)
        {
            byte[] imageData = null;

            using (var wc = new System.Net.WebClient())
                imageData = wc.DownloadData(url);

            return new MemoryStream(imageData);
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