using System;
using System.Data;
using System.Configuration;

using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

using System.Net.Mail;
using System.IO;
using System.Collections.Generic;

namespace SaiAramFoundation.Classes
{
    public static class clsEmail
    {
        //public void sendMail1(string strToAddr, string strSubject, byte[] bytArray, string strFileName, string strName, string strContent)
        //{
        //    try
        //    {
        //        String strFromAddress = "donotreply@sairamgroup.in";
        //        MailMessage message = new MailMessage(strFromAddress, strToAddr, strSubject, strContent);

        //        if (bytArray != null)
        //        {
        //            MemoryStream strmAttachment = new MemoryStream(bytArray);
        //            Attachment attFiles = new Attachment(strmAttachment, strFileName);
        //            message.Attachments.Add(attFiles);
        //        }

        //        message.Bcc.Add("test@itech-india.com");
        //        //---------------saravanan on 20/02/2013---------------------------------
        //        //message.CC.Add("saravananiyappan.p@itech-india.com");
        //        message.IsBodyHtml = true;
        //        SmtpClient emailClient = new SmtpClient();
        //        emailClient.Host = "mail.itech-india.com";
        //        emailClient.Send(message);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //}



        public static bool SendMail(string mailFrom, string mailTo, string ReplyTo, string subject, string body, List<string> CCs, List<string> bCCs, Attachment attFiles)
        {
            clsApproval objApproval = new clsApproval();
            string aa ="";
            try
            {

                MailMessage mail = new MailMessage();

                //set the addresses
                mail.From = new MailAddress(mailFrom);
                mail.To.Add(mailTo);
                if (!string.IsNullOrEmpty(ReplyTo))
                {
                    mail.ReplyTo = new MailAddress(ReplyTo);
                }
              
                if (CCs != null)
                {
                    
                        foreach (string cc in CCs)
                        {
                            if(!string.IsNullOrEmpty(cc))
                            {
                                mail.CC.Add(cc);
                            }
                           
                        }
                   

                }

                if (bCCs != null)
                {
                    
                        foreach (string bcc in bCCs)
                        {
                            if (!string.IsNullOrEmpty(bcc))
                            {
                                mail.Bcc.Add(bcc);
                            }
                        }
                }


                //set the content
                mail.Subject = subject;
                mail.IsBodyHtml = true;
                mail.Body = body;

                if (attFiles != null)
                {
                    mail.Attachments.Add(attFiles);
                }


                string SmtpHost = ConfigurationManager.AppSettings["SmtpHostName"];//from app.config
                string UserName = ConfigurationManager.AppSettings["SmtpUserName"];//from app.config
                string Password = ConfigurationManager.AppSettings["SmtpPassword"];//from app.config
                int SmtpPort = Convert.ToInt32(ConfigurationManager.AppSettings["SmtpPort"]);
                string SmtpAuthentication = ConfigurationManager.AppSettings["SmtpAuthentication"];//from app.config

                aa = aa+",SmtpHost:" + SmtpHost;
                aa =aa+ ",UserName:" + UserName;
                aa = aa+",Password:" + Password;
                aa = aa+",SmtpPort:" + SmtpPort;
                aa = aa+",SmtpAuthentication:" + SmtpAuthentication;

                SmtpClient smtp = new SmtpClient(SmtpHost);
                smtp.Port = SmtpPort;

                if (SmtpAuthentication == "true")
                {
                    smtp.Credentials = new System.Net.NetworkCredential(UserName, Password);
                }
                smtp.Send(mail);


                HttpContext context = HttpContext.Current;
                var request = context.Request;
                String clientMachineIP = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (string.IsNullOrEmpty(clientMachineIP))
                {
                    clientMachineIP = context.Request.ServerVariables["REMOTE_ADDR"];
                }
                string IPAddress = clientMachineIP;


                objApproval.ErrorLog(aa, "SendApplnForm","mail SendMail", IPAddress);
                return true;
            }
            catch (System.Exception ex)
            {
                HttpContext context = HttpContext.Current;
                var request = context.Request;
                String clientMachineIP = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (string.IsNullOrEmpty(clientMachineIP))
                {
                    clientMachineIP = context.Request.ServerVariables["REMOTE_ADDR"];
                }
                string IPAddress = clientMachineIP;

                objApproval.ErrorLog(aa, "SendApplnForm", ex.Message, IPAddress);

                return false;
            }


        }




    }
}
