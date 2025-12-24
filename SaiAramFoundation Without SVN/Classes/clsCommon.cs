using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Data.SqlClient;
using System.IO;
using GenCode128;
using System.Drawing;
using Microsoft.SqlServer;
using System.Text;

namespace SaiAramFoundation.Classes
{
    public class clsCommon
    {
       
        public string GetConnectionString()
        {
            string strConnString;
            strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
            SqlConnection con = new SqlConnection(strConnString);
          //  strConnString = "Server=SQLOLEDB.1;Initial Catalog=SSEC;Data Source=192.168.152.23;User ID=SSEC;Password=Ssec123#;Max Pool Size=100; Connection Timeout=30";
            //strConnString = "Server=SQLOLEDB.1;Initial Catalog=SSEC;Data Source=192.168.152.28\\SQLEXPRESS;User ID=SSEC;Password=Ssec123#;Max Pool Size=100; Connection Timeout=30";            
            return strConnString;
        }


        public bool GetStatus_Edumate()
        {
            bool blStatusEdumate;
            blStatusEdumate = Convert.ToBoolean(ConfigurationManager.AppSettings["edumateServerStatus"]);
            return blStatusEdumate;
        }

        public Array GetConnectionStringEdumate()
        {
            string[] GetConnectionStringEdumate;
            GetConnectionStringEdumate = new string[] { ConfigurationManager.AppSettings["Main.ConnectionStringEdumate_SEC"].ToString(), 
                ConfigurationManager.AppSettings["Main.ConnectionStringEdumate_SIT"].ToString()};
            return GetConnectionStringEdumate;
        }


        public string GetPublishPath()
        {
            string strPublishPath = "";
            strPublishPath = ConfigurationManager.AppSettings["PublishPath"].ToString();
            return strPublishPath;
        }

        public string CreateRandomPassword()
        {
            string allowedChars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!@$?";
            char[] chars = new char[8];
            Random rd = new Random();
            for (int i = 0; i < 8; i++)
            {
                chars[i] = allowedChars[rd.Next(0, allowedChars.Length)];
            }
            return new string(chars);
        }

        public byte[] ImagetoByteConvertor(System.Web.UI.WebControls.FileUpload fuImageFile)
        {

            byte[] imgBinaryData = new byte[0];
            if (fuImageFile.PostedFile != null)
            {
                Stream imgStream = fuImageFile.PostedFile.InputStream;
                int imgLen = fuImageFile.PostedFile.ContentLength;
                imgBinaryData = new byte[imgLen];

                try
                {
                    if (imgBinaryData.Length != 0)
                    {
                        int n = imgStream.Read(imgBinaryData, 0, imgLen);
                        System.Drawing.Bitmap objImage = new System.Drawing.Bitmap(fuImageFile.PostedFile.InputStream);
                        return imgBinaryData;
                    }
                    return imgBinaryData;
                }

                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    imgStream = null;
                    imgLen = 0;
                }

            }
            return imgBinaryData;
        }

        public string Encryptdata(string password)
        {
            string strmsg = string.Empty;
            byte[] encode = new byte[password.Length];
            encode = Encoding.UTF8.GetBytes(password);
            strmsg = Convert.ToBase64String(encode);
            return strmsg;
        }

        public string Decryptdata(string encryptpwd)
        {
            string decryptpwd = string.Empty;
            UTF8Encoding encodepwd = new UTF8Encoding();
            Decoder Decode = encodepwd.GetDecoder();
            byte[] todecode_byte = Convert.FromBase64String(encryptpwd);
            int charCount = Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            char[] decoded_char = new char[charCount];
            Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            decryptpwd = new String(decoded_char);
            return decryptpwd;
        }

        public void fncBindIssuedAmount(string AadhaarID, string Pan_ID, GridView gv, Label lblAlreadyApplied)
        {
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            string strAlready = "";
            try
            {
                if (string.IsNullOrEmpty(AadhaarID))
                    AadhaarID = "0";
                if (string.IsNullOrEmpty(Pan_ID))
                    Pan_ID = "0";

                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlCmd = new SqlCommand("GetPreviousIssuedAmountDetails_ByAadhaarId", sqlConn);
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Parameters.Add(new SqlParameter("@AadhaarID", AadhaarID));
                SqlCmd.Parameters.Add(new SqlParameter("@Pan_ID", Pan_ID));
                da = new SqlDataAdapter(SqlCmd);
                da.Fill(ds);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    gv.DataSource = ds;
                    gv.DataBind();

                    //for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    //{
                    //    if (ds.Tables[0].Rows[i]["ScholarshipYear_Code"].ToString() != "Total")
                    //    {
                    //        strAlready = strAlready + ds.Tables[0].Rows[i]["ScholarshipYear_Code"].ToString() + "| ";
                    //    }
                    //}

                    //lblAlreadyApplied.Text = strAlready.Remove(strAlready.Length - 2, 2);// strAlready.TrimEnd('|');
                }
                else
                {
                    //lblAlreadyApplied.Text = "----";
                    gv.DataSource = ds;
                    gv.DataBind();
                }
                lblAlreadyApplied.Text = objCommon.GetPreviousScholorshipApplied(AadhaarID, Pan_ID);
            }
            catch (Exception ex)
            {
               // lblError.Text = "Error in issued amount details : " + ex.Message.ToString();
                throw ex;
            }
        }

        public string GetPreviousScholorshipApplied(string AadhaarID, string Pan_ID)
        {
            String strConn = GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            string strAlreadyApplied = "";
            try
            {
                if (sqlConn.State != ConnectionState.Open)
                sqlConn.Open();
                SqlCmd = new SqlCommand("GetPreviousScholorshipApplied", sqlConn);
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Parameters.Add(new SqlParameter("@AadhaarID", AadhaarID));
                SqlCmd.Parameters.Add(new SqlParameter("@Pan_ID", Pan_ID));
                da = new SqlDataAdapter(SqlCmd);
                da.Fill(ds);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        if (ds.Tables[0].Rows[i]["ScholarshipYear_Code"].ToString() != "Total")
                        {
                            strAlreadyApplied = strAlreadyApplied + ds.Tables[0].Rows[i]["ScholarshipYear_Code"].ToString() + ",";
                        }
                    }

                    strAlreadyApplied = strAlreadyApplied.TrimEnd(',');
                }
                else
                {
                    strAlreadyApplied = "----";
                }
                return strAlreadyApplied;

            }
            catch (Exception ex) 
            { 
                throw ex; 
            }
        }
    }
}
