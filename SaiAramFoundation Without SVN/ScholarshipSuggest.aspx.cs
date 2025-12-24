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
    public partial class ScholarshipSuggest : System.Web.UI.Page
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
                lblError.Text = ex.Message;
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
                if (Request.QueryString["scholarshipId"].ToString().Trim().ToString() == "1")
                    reqRemark.Enabled = false;
                else
                    reqRemark.Enabled = true;

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
                cmd.Parameters.Add(new SqlParameter("@Process_Type", "Suggest"));
                cmd.Parameters.Add(new SqlParameter("@Scholarship_Id", Request.QueryString["scholarshipId"].ToString().Trim().ToString()));
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    txtScholarshipId.Text = dsData.Tables[0].Rows[0]["Scholarship_Id"].ToString();
                    lblSchlorshipYear.Text = dsData.Tables[0].Rows[0]["ScholarshipYear_Name"].ToString();
                    lblName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                    lblApplnNo.Text = dsData.Tables[0].Rows[0]["Application_Id"].ToString();
                    lblDOB.Text = dsData.Tables[0].Rows[0]["Date_Of_Birth"].ToString();
                    lblFatherName.Text = dsData.Tables[0].Rows[0]["Father_Name"].ToString();
                    lblFatherOccupation.Text = dsData.Tables[0].Rows[0]["Father_Occupation"].ToString();
                    lblRequestAmount.Text = dsData.Tables[0].Rows[0]["Request_Amount"].ToString();
                    txtSuggestedAmount.Text = dsData.Tables[0].Rows[0]["Scholarship_Suggest_Amount"].ToString();
                    if (dsData.Tables[0].Rows[0]["Scholarship_For"].ToString() == "School")
                    {
                        lblScholarShipSeekingFor.Text = dsData.Tables[0].Rows[0]["Class_Studying"].ToString();
                    }
                    else if (dsData.Tables[0].Rows[0]["Scholarship_For"].ToString() == "College")
                    {
                        lblScholarShipSeekingFor.Text = dsData.Tables[0].Rows[0]["Degree_Type"].ToString() + "-" + dsData.Tables[0].Rows[0]["Degree"].ToString();
                    }
                    else if (dsData.Tables[0].Rows[0]["Scholarship_For"].ToString() == "Research")
                    {
                        lblScholarShipSeekingFor.Text = dsData.Tables[0].Rows[0]["Ph_D"].ToString();
                    }
                }
                else
                {
                    lblError.Text = "Invalid Application Number";
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
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

        protected void btnSuggest_Click(object sender, EventArgs e)
        {
            cmd = new SqlCommand();
            clsApproval objApprove = new clsApproval();
            try
            {
                int UserId = Convert.ToInt32(Session["intUser_ID"]);
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }

                if (txtScholarshipId.Text.Trim().ToString() == "1")
                {
                    strQuery = "Update t_Registration_Process set Scholarship_Suggest_Amount = '" + txtSuggestedAmount.Text.Trim().ToString() + "', status='Waiting',";
                    strQuery = strQuery + " Suggesred_Date = '" + DateTime.Now.ToString() + "',Suggested_By=" + UserId + "";

                    strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'  and  Scholarship_Id = '" + txtScholarshipId.Text.Trim().ToString() + "'";

                }

                else
                {
                    strQuery = "INSERT INTO t_Registration_Process (Application_Id,Scholarship_Id,Scholarship_Status,Scholarship_No,Request_Amount,Scholarship_Suggest_Amount,";
                    strQuery += " IsUpload_Status,IsVerify,Status,User_ID,Data_Date,Suggested_By,Suggesred_Date ) ";
                    strQuery = strQuery + " Values ( '" + Request.QueryString["applnno"].ToString().Trim().ToString() + "', '" + txtScholarshipId.Text.Trim().ToString() + "', ";
                    strQuery = strQuery + " '', '', '" + txtSuggestedAmount.Text.Trim().ToString() + "', '" + txtSuggestedAmount.Text.Trim().ToString() + "', 0,0, 'Waiting', ";
                    strQuery = strQuery + " '" + UserId + "' , '" + DateTime.Now.ToString() + "', '" + UserId + "' , '" + DateTime.Now.ToString() + "')";


                }

                cmd = new SqlCommand(strQuery, con);
                cmd.ExecuteNonQuery();

                string strText = "Scholarship-" + txtScholarshipId.Text.Trim().ToString() + "  amount <b> Rs." + txtSuggestedAmount.Text.Trim().ToString() + " </b> has been suggested by <b> " + Session["User_ID"].ToString() + " </b>";
                objApprove.UpdateHistory(lblApplnNo.Text, strText, "Scholarship Amount Suggested", Session["User_ID"].ToString());

                dvform.Visible = false;
                dvSuccess.Visible = true;

                lblSuccess.Text = "Scholarship-" + txtScholarshipId.Text.Trim().ToString() + "  Amount Suggested succesfully to <b> " + lblApplnNo.Text + "</b>";
                Response.Write("<script>window.open('AdminPanelProcess.aspx',target='_top');</script>");
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
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

        protected void btnReject_Click(object sender, EventArgs e)
        {
            cmd = new SqlCommand();
            clsApproval objApprove = new clsApproval();

            string Amount = null;
            try
            {
                if (txtSuggestedAmount.Text.Trim().ToString() != "")
                {
                    Amount = txtSuggestedAmount.Text.Trim().ToString();
                }
                else
                {
                    Amount = null;
                }

                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                strQuery = "Update t_Registration_Process set status='Rejected',Scholarship_Suggest_Amount = '" + txtSuggestedAmount.Text.Trim().ToString() + "',";
                strQuery = strQuery + " Remark_Reject = '" + txtRemark.Text.Trim() + "'," + " Update_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'  and  Scholarship_Id = '" + txtScholarshipId.Text.Trim().ToString() + "'";
                cmd = new SqlCommand(strQuery, con);
                cmd.ExecuteNonQuery();

                //if (con.State != ConnectionState.Open)
                //{
                //    con.Open();
                //}
                //cmd.CommandText = "USP_UPDATE_SCHOLARSHIP_DATA_APPROVE";
                //cmd.CommandType = CommandType.StoredProcedure;
                //if (con.State != ConnectionState.Open)
                //{
                //    con.Open();
                //}
                //cmd.Connection = con;
                //cmd.Parameters.Add(new SqlParameter("@Application_Id", Request.QueryString["applnno"].ToString().Trim().ToString()));
                //cmd.Parameters.Add(new SqlParameter("@Scholarship_Approved_Amount", txtApprovedAmt.Text.Trim().ToString()));
                //cmd.ExecuteNonQuery();

                string strText = "Scholarship-" + txtScholarshipId.Text.Trim().ToString() + " request has been Rejected due to  <b>" + txtRemark.Text.Trim() + " </b> by <b> " + Session["User_ID"].ToString() + " </b>";
                objApprove.UpdateHistory(lblApplnNo.Text, strText, "Scholarship Request Rejected", Session["User_ID"].ToString());

                dvform.Visible = false;
                dvSuccess.Visible = true;

                lblSuccess.Text = "Scholarship-" + txtScholarshipId.Text.Trim().ToString() + " Request Rejected to : " + lblName.Text + " ( " + lblApplnNo.Text + " ) ";
                Response.Write("<script>window.open('AdminPanelProcess.aspx',target='_top');</script>");
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
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

        //protected void btnVerify_Click(object sender, EventArgs e)
        //{
        //    clsApproval objApprove = new clsApproval();
        //    clsEmail objEmail = new clsEmail();
        //    DataSet dsData = new DataSet();
        //    DataSet dsStudent = new DataSet();
        //    byte[] byteArray = null;
        //    string strBC = null;
        //    //string strBC2 = null;
        //    string strStuID = null;
        //    string strRC = null;
        //    string strDD = null;
        //    string strVD = null;
        //    string strBPB = null;
        //    string strAID = null;
        //    string strPC = null;
        //    string strC1 = null;
        //    string strC2 = null;
        //    string strC3 = null;
        //    string strC4 = null;
        //    string strC5 = null;
        //    string strAction = null;
        //    string strBType = null;
        //    string strSType = null;
        //    string strRType = null;
        //    string strDType = null;
        //    string strVType = null;
        //    string strAType = null;
        //    string strPType = null;
        //    string strBPType = null;
        //    string strD1 = null;
        //    string strD2 = null;
        //    string strD3 = null;
        //    string strD4 = null;
        //    string strD5 = null;
        //    string strURL = null;
        //    string strVerify = null;
        //    string strSubject = null;

        //    try
        //    {
        //        lock (lckThis)
        //        {
        //            //verify document
        //            strAction = "Document Verification Status :";
        //            strVerify = "You are instructed to upload again the following document/s by the given below url," + "<br/><br/>";
        //            //strURL = "http://192.168.152.28:81/sairam/Admissions12/PendingDocuments.aspx?appln=" + lblApplnNo.Text + "&";

        //            //------Commented by Rajaprabhu on 02-03-2013
        //            //strURL = "http://www.sairamgroup.in/Admissions12/PendingDocuments.aspx?appln=" + lblApplnNo.Text + "&";
        //            //-------------
        //            //strURL = "http://119.226.68.35:81/sairam/Admissions12/PendingDocuments.aspx?appln=" + lblApplnNo.Text + "&";
        //            strSubject = "Document verification for application number : " + lblApplnNo.Text + " reg..";
        //            if (trBC.Visible == true)
        //            {
        //                strBC = rdoBC.SelectedItem.Value;
        //                strBType = "Birth Certificate";
        //                strAction = strAction + "Birth Certificate Page One: " + rdoBC.SelectedItem.Text + "<br/>";
        //                if (rdoBC.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + "Birth Certificate Page One" + "<br/>";
        //                    //strURL = strURL + "TC=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "TC=0&";
        //                }
        //            }
        //            else
        //            {
        //                strBC = "0";
        //                //strURL = strURL + "TC=0&";
        //            }
        //            if (trStuID.Visible == true)
        //            {
        //                strStuID = rdoStuID.SelectedItem.Value;
        //                strSType = "Student ID Card";
        //                strAction = strAction + "Student Id Card : " + rdoStuID.SelectedItem.Text + "<br/>";
        //                if (rdoStuID.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + "Student Id Card " + "<br/>";
        //                    //strURL = strURL + "TEN=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "TEN=0&";
        //                }
        //            }
        //            else
        //            {
        //                strStuID = "0";
        //                //strURL = strURL + "TEN=0&";
        //            }
        //            if (trRC.Visible == true)
        //            {
        //                strRC = rdoRC.SelectedItem.Value;
        //                strRType = "Ration Card";
        //                strAction = strAction + "Ration Card : " + rdoRC.SelectedItem.Text + "<br/>";
        //                if (rdoRC.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + "Ration Card" + "<br/>";
        //                    //strURL = strURL + "TWEL=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "TWEL=0&";
        //                }
        //            }
        //            else
        //            {
        //                strRC = "0";
        //                //strURL = strURL + "TWEL=0&";
        //            }
        //            if (trVD.Visible == true)
        //            {
        //                strVD = rdoVD.SelectedItem.Value;
        //                strVType = "Voter ID";
        //                strAction = strAction + "Voter ID : " + rdoVD.SelectedItem.Text + "<br/>";
        //                if (rdoVD.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + "Voter ID" + "<br/>";
        //                    //strURL = strURL + "TC=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "TC=0&";
        //                }
        //            }
        //            else
        //            {
        //                strVD = "0";
        //                //strURL = strURL + "TC=0&";
        //            }
        //            if (trDD.Visible == true)
        //            {
        //                strDD = rdoDD.SelectedItem.Value;
        //                strDType = "Driving License";
        //                strAction = strAction + "Driving License : " + rdoDD.SelectedItem.Text + "<br/>";
        //                if (rdoDD.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + " Driving License " + "<br/>";
        //                    //strURL = strURL + "CC=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "CC=0&";
        //                }
        //            }
        //            else
        //            {
        //                strDD = "0";
        //                //strURL = strURL + "CC=0&";
        //            }
        //            if (trBPB.Visible == true)
        //            {
        //                strBPB = rdoBPB.SelectedItem.Value;
        //                strBPType = "Bank Pass Book";
        //                strAction = strAction + "Bank Pass Book : " + rdoBPB.SelectedItem.Text + "<br/>";
        //                if (rdoBPB.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + "Bank Pass Book " + "<br/>";
        //                    //strURL = strURL + "DOT=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "DOT=0&";
        //                }
        //            }
        //            else
        //            {
        //                strBPB = "0";
        //                //strURL = strURL + "DOT=0&";
        //            }
        //            if (trAID.Visible == true)
        //            {
        //                strAID = rdoAID.SelectedItem.Value;
        //                strAType = "Aadhar ID";
        //                strAction = strAction + "Aadhar ID : " + rdoAID.SelectedItem.Text + "<br/>";
        //                if (rdoAID.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + "Aadhar ID" + "<br/>";
        //                    //strURL = strURL + "DOT=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "DOT=0&";
        //                }
        //            }
        //            else
        //            {
        //                strAID = "0";
        //                //strURL = strURL + "DOT=0&";
        //            }
        //            if (trPC.Visible == true)
        //            {
        //                strPC = rdoPC.SelectedItem.Value;
        //                strPType = "Pan Card";
        //                strAction = strAction + "Pan Card : " + rdoPC.SelectedItem.Text + "<br/>";
        //                if (rdoPC.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + "" + "<br/>";
        //                    //strURL = strURL + "C1=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "C1=0&";
        //                }
        //            }
        //            else
        //            {
        //                strPC = "0";
        //                //strURL = strURL + "C1=0&";
        //            }

        //            if (trSp1.Visible == true)
        //            {
        //                strC1 = rdoC1.SelectedItem.Value;
        //                strD1 = lblC1.Text;
        //                strAction = strAction + "Certificate 1 : " + rdoC1.SelectedItem.Text + "<br/>";
        //                if (rdoC1.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + lblC1.Text + "<br/>";
        //                    //strURL = strURL + "C1=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "C1=0&";
        //                }
        //            }
        //            else
        //            {
        //                strC1 = "0";
        //                //strURL = strURL + "C1=0&";
        //            }
        //            if (trSp2.Visible == true)
        //            {
        //                strC2 = rdoC2.SelectedItem.Value;
        //                strD2 = lblC2.Text;
        //                strAction = strAction + "Certificate 2 : " + rdoC2.SelectedItem.Text + "<br/>";
        //                if (rdoC2.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + lblC2.Text + "<br/>";
        //                    //strURL = strURL + "C2=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "C2=0&";
        //                }
        //            }
        //            else
        //            {
        //                strC2 = "0";
        //                //strURL = strURL + "C2=0&";
        //            }
        //            if (trSp3.Visible == true)
        //            {
        //                strC3 = rdoC3.SelectedItem.Value;
        //                strD3 = lblC3.Text;
        //                strAction = strAction + "Certificate 3 : " + rdoC3.SelectedItem.Text + "<br/>";
        //                if (rdoC3.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + lblC3.Text + "<br/>";
        //                    //strURL = strURL + "C3=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "C3=0&";
        //                }
        //            }
        //            else
        //            {
        //                strC3 = "0";
        //                //strURL = strURL + "C3=0&";
        //            }
        //            if (trSp4.Visible == true)
        //            {
        //                strC4 = rdoC4.SelectedItem.Value;
        //                strD4 = lblC4.Text;
        //                strAction = strAction + "Certificate 4 : " + rdoC4.SelectedItem.Text + "<br/>";
        //                if (rdoC4.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + lblC4.Text + "<br/>";
        //                    //strURL = strURL + "C4=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "C4=0&";
        //                }
        //            }
        //            else
        //            {
        //                strC4 = "0";
        //                //strURL = strURL + "C4=0&";
        //            }
        //            if (trSp5.Visible == true)
        //            {
        //                strC5 = rdoC5.SelectedItem.Value;
        //                strD5 = lblC5.Text;
        //                strAction = strAction + "Certificate 5 : " + rdoC5.SelectedItem.Text + "";
        //                if (rdoC5.SelectedItem.Value == "1")
        //                {
        //                    strVerify = strVerify + lblC5.Text + "<br/>";
        //                    //strURL = strURL + "C5=1&";
        //                }
        //                else
        //                {
        //                    //strURL = strURL + "C5=0&";
        //                }
        //            }
        //            else
        //            {
        //                strC5 = "0";
        //                //strURL = strURL + "C5=0&";
        //            }

        //            if (strBType == "Birth Certificate")
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strBC, strBType, Session["User_ID"].ToString());
        //            }
        //            if (strSType == "Student ID Card")
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strStuID, strSType, Session["User_ID"].ToString());
        //            }
        //            if (strRType == "Ration Card")
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strRC, strRType, Session["User_ID"].ToString());
        //            }
        //            if (strVType == "Voter ID")
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strVD, strVType, Session["User_ID"].ToString());
        //            }
        //            if (strDType == "Driving License")
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strDD, strDType, Session["User_ID"].ToString());
        //            }
        //            if (strBPType == "Bank Pass Book")
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strBPB, strBPType, Session["User_ID"].ToString());
        //            }
        //            if (strAType == "Aadhar ID")
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strAID, strAType, Session["User_ID"].ToString());
        //            }
        //            if (strPType == "Pan Card")
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strPC, strPType, Session["User_ID"].ToString());
        //            }
        //            if (strD1 == lblC1.Text)
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strC1, strD1 + "_sports1", Session["User_ID"].ToString());
        //            }
        //            if (strD2 == lblC2.Text)
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strC2, strD2 + "_sports2", Session["User_ID"].ToString());
        //            }
        //            if (strD3 == lblC3.Text)
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strC3, strD3 + "_sports3", Session["User_ID"].ToString());
        //            }
        //            if (strD4 == lblC4.Text)
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strC4, strD4 + "_sports4", Session["User_ID"].ToString());
        //            }
        //            if (strD5 == lblC5.Text)
        //            {
        //                UpdateVerificationStatus(lblApplnNo.Text, strC5, strD5 + "_sports5", Session["User_ID"].ToString());
        //            }
        //            if (strBC == "1" || strStuID == "1" || strRC == "1" || strVD == "1" || strDD == "1" || strBPB == "1" || strAID == "1" || strPC == "1"
        //                || strC1 == "1" || strC2 == "1" || strC3 == "1" || strC4 == "1" || strC5 == "1")
        //            {
        //                if (con.State != ConnectionState.Open)
        //                {
        //                    con.Open();
        //                }
        //                strQuery = "Update t_esch_Registration set Scholarship_Suggest_Amount = '" + txtSuggestedAmount.Text.ToString() + "', status='Registered',IsVerify='1',IsUpload_Status='1',";
        //                strQuery = strQuery + " Suggesred_Date = '" + DateTime.Now.ToString() + "'";

        //                strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'";
        //                cmd = new SqlCommand(strQuery, con);
        //                cmd.ExecuteNonQuery();

        //                string strText = "Verification Faild due to following Document Not Varified : <b> " + InvaildType + " </b> has been Verified by <b> " + Session["User_ID"].ToString() + " </b>";
        //                objApprove.UpdateHistory(lblApplnNo.Text, strText, "Document Verification and Scholarship Amount Suggested", Session["User_ID"].ToString());
        //                dvform.Visible = false;
        //                dvSuccess.Visible = true;

        //                lblSuccess.Text = "Document Verification Partially completed for Application No : " + lblApplnNo.Text;
        //                Response.Write("<script>window.open('AdminPanelProcess.aspx',target='_top');</script>");
        //            }
        //            else
        //            {
        //                if (con.State != ConnectionState.Open)
        //                {
        //                    con.Open();
        //                }
        //                strQuery = "Update t_esch_Registration set Scholarship_Suggest_Amount = '" + txtSuggestedAmount.Text.ToString() + "', status='Waiting',IsVerify='0',IsUpload_Status='0',";
        //                strQuery = strQuery + " Suggesred_Date = '" + DateTime.Now.ToString() + "'";

        //                strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'";
        //                cmd = new SqlCommand(strQuery, con);
        //                cmd.ExecuteNonQuery();

        //                string strText = "Documents are Verified and Scholership amount <b> Rs." + txtSuggestedAmount.Text.Trim().ToString() + " </b> has been suggested by <b> " + Session["User_ID"].ToString() + " </b>";
        //                objApprove.UpdateHistory(lblApplnNo.Text, strText, "Document Verification and Scholarship Amount Suggested", Session["User_ID"].ToString());

        //                dvform.Visible = false;
        //                dvSuccess.Visible = true;

        //                lblSuccess.Text = "Document Verification completed succesfully thank you!";
        //                Response.Write("<script>window.open('AdminPanelProcess.aspx',target='_top');</script>");
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        lblError.Text = ex.Message;
        //    }
        //    finally
        //    {
        //        if (con.State != ConnectionState.Closed)
        //        {
        //            con.Close();
        //        }
        //        cmd = null;
        //        objApprove = null;
        //        objEmail = null;
        //        dsData = null;
        //        dsStudent = null;
        //    }
        //}

        //protected void UpdateVerificationStatus(string strApplicationNo, string strValue, string strtype, string userID)
        //{
        //    clsApproval objApprove = new clsApproval();
        //    clsCommon objCommon = new clsCommon();
        //    String strConn = objCommon.GetConnectionString();
        //    SqlConnection sqlConn = new SqlConnection(strConn);
        //    SqlCommand SqlCmd;
        //    int intRegistrationID = 0;
        //    try
        //    {
        //        if (sqlConn.State != ConnectionState.Open)
        //        {
        //            sqlConn.Open();
        //        }
        //        SqlCmd = new SqlCommand();
        //        if (strValue == "1")
        //        {
        //            SqlCmd.CommandText = "USP_Update_UploadDocument1";
        //            if (strtype == lblC1.Text + "_sports1")
        //            {
        //                string jk = strtype;
        //                string sp1 = jk.Substring(0, jk.Length - 8);
        //                string sp2 = jk.Substring(sp1.Length + 1, 7);
        //                InvaildType = InvaildType + sp1 + ",";
        //            }
        //            else if (strtype == lblC2.Text + "_sports2")
        //            {
        //                string jk = strtype;
        //                string sp1 = jk.Substring(0, jk.Length - 8);
        //                string sp2 = jk.Substring(sp1.Length + 1, 7);
        //                InvaildType = InvaildType + sp1 + ",";
        //            }
        //            else if (strtype == lblC3.Text + "_sports3")
        //            {
        //                string jk = strtype;
        //                string sp1 = jk.Substring(0, jk.Length - 8);
        //                string sp2 = jk.Substring(sp1.Length + 1, 7);
        //                InvaildType = InvaildType + sp1 + ",";
        //            }
        //            else if (strtype == lblC4.Text + "_sports4")
        //            {
        //                string jk = strtype;
        //                string sp1 = jk.Substring(0, jk.Length - 8);
        //                string sp2 = jk.Substring(sp1.Length + 1, 7);
        //                InvaildType = InvaildType + sp1 + ",";
        //            }
        //            else if (strtype == lblC5.Text + "_sports5")
        //            {
        //                string jk = strtype;
        //                string sp1 = jk.Substring(0, jk.Length - 8);
        //                string sp2 = jk.Substring(sp1.Length + 1, 7);
        //                InvaildType = InvaildType + sp1 + ",";
        //            }
        //            else
        //            {
        //                InvaildType = InvaildType + strtype + ",";
        //            }

        //        }
        //        else
        //        {
        //            SqlCmd.CommandText = "USP_Update_UploadDocument";
        //        }

        //        SqlCmd.CommandType = CommandType.StoredProcedure;
        //        SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", strApplicationNo));
        //        SqlCmd.Parameters.Add(new SqlParameter("@DocumentType", strtype));
        //        SqlCmd.Parameters.Add(new SqlParameter("@strValue", strApplicationNo));
        //        SqlCmd.Connection = sqlConn;
        //        intRegistrationID = Convert.ToInt32(SqlCmd.ExecuteScalar());
        //        SqlCmd.Dispose();

        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //    finally
        //    {
        //        if (sqlConn.State != ConnectionState.Open)
        //        {
        //            sqlConn.Open();
        //        }
        //    }
        //}
    }
}
