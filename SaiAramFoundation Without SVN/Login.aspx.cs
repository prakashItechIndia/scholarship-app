using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sairam_RegularUG.Classes;
using System.Data;
using SaiAramFoundation.Classes;
using System.Data.SqlClient;
using System.Net.Mail;
using System.Configuration;

namespace SaiAramFoundation
{
    public partial class Login : System.Web.UI.Page
    {

        static public string strConnString = System.Configuration.ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet ds = null;
        SqlDataAdapter da = null;
        clsCommon objCommon = null;

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            { 

               // ScholarShipDataMoveToEdumate();
               // clsEmail obj = new clsEmail();
               //  string strApplnNumber = "AF1510016";
               // Attachment attFiles = new Attachment(Server.MapPath(".") + "/Registered_Pdf_ScholerShip/" + strApplnNumber + ".pdf");

                // clsEmail.SendMail("aram2016@sairamgroup.in", "sentamilmurugan.m@itech-india.com", "aram2016@sairamgroup.in", "sub", "body", null, null, null);


                //if ((txtPassword.Text == "Admin") && (txtUserName.Text == "Admin"))
                //{
                //    Session["UserType"] = "Admin";
                //}


                //  ScholarshipFinal obj = new ScholarshipFinal();
                //  obj.SaveScholarshipDatatoEdumate("E7IC005", "SEC", "30000", "2017-2018", "", "AF1711249", "17LMSS1369");

            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {

            clsUser objUser = new clsUser();
            string strUserType = null;
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            string strUSerID = "";
            string strRoleId = "";
            int intRoleID = 0;
            int intUserId=0;
            string strIntUserId="";
            string strUserName = "";
            string strEncyrptPsw = "";
            string Encrypt = "";
            try
            {
                Encrypt = txtPassword.Text.Trim().ToString();
                strEncyrptPsw = objCommon.Encryptdata(Encrypt);

                dsData = objUser.ValidateUserLogin(txtUserName.Text, strEncyrptPsw.Trim());//"Super Admin";

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    strUSerID = dsData.Tables[0].Rows[0]["User_ID"].ToString();
                    Session["User_ID"] = strUSerID;

                    strIntUserId = dsData.Tables[0].Rows[0]["ID"].ToString();
                    intUserId = Convert.ToInt32(strIntUserId);
                    Session["intUser_ID"] = intUserId;

                    strUserName = dsData.Tables[0].Rows[0]["User_Name"].ToString();
                    Session["User_Name"] = strUserName;

                    strRoleId = dsData.Tables[0].Rows[0]["Role_Id"].ToString();
                    intRoleID = Convert.ToInt32(strRoleId);
                    Session["Roles_Id"] = intRoleID;

                    if (intRoleID == 1 || intRoleID == 7)
                    {
                        Response.Redirect("AdminPanelApprove.aspx");
                    }
                    else
                    {
                        Response.Redirect("AdminPanelHome.aspx");
                    }

                }
                else
                {
                    throw new Exception("Invalid User");
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
            }

        }

        protected int GetRoleID(string strUSerID)
        {
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            int intRoleID = 0;

            try
            {
                if (sqlConn.State != ConnectionState.Open)
                {
                    sqlConn.Open();
                }
                SqlCmd = new SqlCommand();
                SqlCmd.CommandText = "USP_GetRoleID";
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Parameters.Add(new SqlParameter("@User_Id", strUSerID));
                SqlCmd.Connection = sqlConn;
                intRoleID = Convert.ToInt32(SqlCmd.ExecuteScalar());

                SqlCmd.Dispose();
                return intRoleID;

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




        private void ScholarShipDataMoveToEdumate()
        {
            string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();

            DataTable dtData = new DataTable();
            List<string> lstStudentNull = new List<string>();
            List<string> lstInstitution_NameInvalid = new List<string>();
            List<string> lstStudentNotinEdumate = new List<string>();

            try
            {
                string Sch_Year = "24";
                string Sch_YearName = "2024-2025";

                string strQuery = "select r.Sch_Year,r.Application_Id,r.Institution_Name,r.Student_ID,r.ApplicationID_SAI_EAdmission,rp.Scholarship_Issued_Amount,rp.Scholarship_No from t_Registration as r join t_Registration_Process as rp on r.Application_Id = rp.Application_Id where  r.Sch_Year=" + Sch_Year + " and rp.Status='Completed' and ";
                strQuery += "(Institution_Name like '%Sri Sai Ram Engineering College,West Tambaram,Chennai%' ";
                strQuery += "or Institution_Name like '%Sri Sai Ram Engineering College%'";
                strQuery += "or Institution_Name like '%Sri Sairam Engineering College%'";
                strQuery += "or Institution_Name like '%Sri Sai Ram Institute of Technology,West Tambaram,Chennai%'";
                strQuery += "or Institution_Name like '%Sri Sai Ram Institute of Technology%'";
                strQuery += "or Institution_Name like '%Sri Sairam Institute of Technology%' )";

                SqlConnection connSql = new SqlConnection(strConnString);
                if (connSql.State != ConnectionState.Open)
                    connSql.Open();




                SqlCommand cmdSql = new SqlCommand(strQuery, connSql);
                da = new SqlDataAdapter(cmdSql);
                da.Fill(dtData);

                string StudId = "";
                string Institution_Name = "";
                string ApprovedAmt = "";
                string EAdmissionNo = "";
                string ApplnNo = "";
                string SchNo = "";

                lstStudentNull = new List<string>();
                lstInstitution_NameInvalid = new List<string>();
                lstStudentNotinEdumate = new List<string>();
                ScholarshipFinal obj = new ScholarshipFinal();
                foreach (DataRow dr in dtData.Rows)
                {

                    StudId = Convert.ToString(dr["Student_ID"]);


                    StudId = StudId.Trim();
                    Institution_Name = Convert.ToString(dr["Institution_Name"]); ;
                    ApprovedAmt = Convert.ToString(dr["Scholarship_Issued_Amount"]);
                    EAdmissionNo = Convert.ToString(dr["ApplicationID_SAI_EAdmission"]);
                    ApplnNo = Convert.ToString(dr["Application_Id"]);
                    SchNo = Convert.ToString(dr["Scholarship_No"]);

                    if (ApplnNo == "AF1910081")
                    {
                        string aaa = "";
                    }
                    string College = "";
                    if (Institution_Name == "Sri Sai Ram Engineering College,West Tambaram,Chennai" || Institution_Name == "Sri Sai Ram Engineering College" || Institution_Name == "Sri Sairam Engineering College" || Institution_Name == "SRI SAIRAM ENGINEERING COLLEGE")
                    {
                        College = "SEC";
                    }
                    else if (Institution_Name == "Sri Sai Ram Institute of Technology,West Tambaram,Chennai" || Institution_Name == "Sri Sai Ram Institute of Technology" || Institution_Name == "Sri Sairam Institute of Technology" || Institution_Name == "SRI SAIRAM INSTITUTE OF TECHNOLOGY")
                    {
                        College = "SIT";

                    }
                    else
                    {
                        lstInstitution_NameInvalid.Add(ApplnNo);

                    }

                    if (string.IsNullOrEmpty(StudId))
                    {
                        lstStudentNull.Add(ApplnNo);
                    }
                    else
                    {
                        if (College == "SEC" || College == "SIT")
                        {
                            bool EduameStatus = false;
                            EduameStatus = obj.SaveScholarshipDatatoEdumate(StudId, College, ApprovedAmt, Sch_YearName, EAdmissionNo, ApplnNo, SchNo);
                            if (!EduameStatus)
                            {
                                lstStudentNotinEdumate.Add(ApplnNo + "-" + StudId + ",");
                            }
                        }


                    }

                }

                string aa = "StudentNull:" + string.Join(",", lstStudentNull.ToArray()) + "  Institution_NameInvalid:" + string.Join(",", lstInstitution_NameInvalid.ToArray() + "  Student not in Edumate :" + string.Join(",", lstStudentNotinEdumate.ToArray()));

            }
            catch (Exception ex)
            {

                throw ex;
            }



        }


    }
}
