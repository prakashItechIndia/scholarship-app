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
using Sairam_RegularUG.Classes;
using System.Data.SqlClient;
using SaiAramFoundation.Classes;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Globalization;


namespace SaiAramFoundation
{
    public partial class ScholarshipFinal : System.Web.UI.Page
    {
        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet dsData = null;
        SqlDataAdapter da = null;
        SqlDataReader dr = null;
        string strQuery = "";
        private System.Object lckThis = new System.Object();

        clsCommon objCommon = new clsCommon();
        List<ClsT_ScholarshipYearSetting> lstsetting = new List<ClsT_ScholarshipYearSetting>();
        public static string ScholarshipYearCode, ScholarshipYearName, ScholarshipYearMailId, ScholarshipYearReplyMailId, ScholarshipYearCCMailId, ScholarshipYearBCCMailId, ScholarshipYearMailSubject;
        public static int ScholarshipYearId;

        protected void Page_Load(object sender, EventArgs e)
        {
            clsApproval objApprove = new clsApproval();
            try
            {
                if (Session["User_ID"] != null && Session["Roles_Id"] != null)
                {
                    if (!IsPostBack)
                    {

                        PopulateData();
                        fncBindIssuedBy();
                        fncBindInstitution();
                        ddInstitution.Visible = false;
                        //RequiredValddInstitution.Visible = false;
                        //RequiredValddInstitution.Enabled = false;
                        txtOtherInstitution.Visible = false;
                        RequiredtxtOtherInstitution.Enabled = false;
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

        public void fncBindIssuedBy()
        {
            cmd = new SqlCommand();
            dsData = new DataSet();
            try
            {
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.CommandText = "sp_GetAllChequeIssuedBy";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = con;
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);
                ddlIssuedBy.DataSource = dsData.Tables[0];
                ddlIssuedBy.DataTextField = dsData.Tables[0].Columns["Issued_By"].ToString();
                ddlIssuedBy.DataValueField = dsData.Tables[0].Columns["Id"].ToString();
                ddlIssuedBy.DataBind();
            }
            catch (Exception ex)
            {
                throw;
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

        // Bind Institution 

        public void fncBindInstitution()
        {
            cmd = new SqlCommand();
            dsData = new DataSet();
            try
            {
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.CommandText = "sp_GetAllChequeIssuedBy";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = con;
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);
                ddInstitution.DataSource = dsData.Tables[0];
                ddInstitution.DataTextField = dsData.Tables[0].Columns["Issued_By"].ToString();
                ddInstitution.DataValueField = dsData.Tables[0].Columns["Id"].ToString();
                ddInstitution.DataBind();
                ddInstitution.Items.Insert(0, "--Select--");
            }
            catch (Exception ex)
            {

                throw;
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

        public void PopulateData()
        {

            cmd = new SqlCommand();
            dsData = new DataSet();
            string scholarshipId = "";
            try
            {
                lblApplnNo.Text = Request.QueryString["applnno"].ToString();
                scholarshipId = this.Request.QueryString["scholarshipId"].ToString();


                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                cmd.CommandText = "USP_GET_DATA_BY_APPLICATION_NO";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = con;
                cmd.Parameters.Add(new SqlParameter("@Application_Id", Request.QueryString["applnno"].ToString().Trim().ToString()));
                cmd.Parameters.Add(new SqlParameter("@Process_Type", "Donate"));
                cmd.Parameters.Add(new SqlParameter("@Scholarship_Id", scholarshipId));
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    txtScholarshipId.Text = dsData.Tables[0].Rows[0]["Scholarship_Id"].ToString();
                    lblSchlorshipYear.Text = dsData.Tables[0].Rows[0]["ScholarshipYear_Name"].ToString();
                    lblSchNo.Text = dsData.Tables[0].Rows[0]["Scholarship_No"].ToString();
                    lblName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                    lblApplnNo.Text = dsData.Tables[0].Rows[0]["Application_Id"].ToString();
                    lblDOB.Text = dsData.Tables[0].Rows[0]["Date_Of_Birth"].ToString();
                    lblEAdmissionNo.Text = dsData.Tables[0].Rows[0]["ApplicationID_SAI_EAdmission"].ToString();

                    //lbl12std.Text = dsData.Tables[0].Rows[0]["12Percent"].ToString();
                    lblFatherName.Text = dsData.Tables[0].Rows[0]["Father_Name"].ToString();
                    lblFatherOccupation.Text = dsData.Tables[0].Rows[0]["Father_Occupation"].ToString();
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
                    lblRequestedAmount.Text = dsData.Tables[0].Rows[0]["Request_Amount"].ToString();
                    lblSuggestedAmt.Text = dsData.Tables[0].Rows[0]["Scholarship_Suggest_Amount"].ToString();
                    lblApprovedAmt.Text = dsData.Tables[0].Rows[0]["Scholarship_Approved_Amount"].ToString();
                    lblAmountIssued.Text = dsData.Tables[0].Rows[0]["Scholarship_Approved_Amount"].ToString();

                    lblSchYear.Text = dsData.Tables[0].Rows[0]["ScholarshipYear_Name"].ToString();
                    lblStudCollege.Text = dsData.Tables[0].Rows[0]["Institution_Name"].ToString();
                    lblStudId.Text = dsData.Tables[0].Rows[0]["Student_ID"].ToString();
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

        //rdoChequeInFavor_OnSelectedIndexChanged

        protected void rdoChequeInFavor_OnSelectedIndexChanged(object sender, EventArgs e)        
        {
            txtOtherInstitution.Text = "";
            txtChequeInFavor.Text = "";
            txtChequeNo.Text = "";
            txtFeeReceiptDate.Text = "";

            trChequeNo.Visible = true;
            reQChequeNo.Enabled = true;
            trddlIssuedBy.Visible = true;
            RequiredFieldValidator1.Enabled = true;
            txtOtherInstitution.Visible = false;
            RequiredtxtOtherInstitution.Enabled = false;
            trFeeReceiptDate.Visible = false;
            reQtxtFeeReceiptDate.Enabled = false;


            if (rdoChequeInFavor.SelectedValue == "Institution")
            {
                lbluploadIdName.Text = "DD/Cheque Upload";
                lblChkRecpt.Text = "Cheque No";
                ddInstitution.Visible = true;
                //RequiredValddInstitution.Visible = true;
                RequiredValddInstitution.Enabled = true;
                txtChequeInFavor.Visible = false;
                reqChequeInFavor.Enabled = false;                
                regChequeInFavor.Enabled = false;
                reGChequeNo.Enabled = true;
            }
            else if (rdoChequeInFavor.SelectedValue == "Individual")
            {
                lbluploadIdName.Text = "DD/Cheque Upload";
                lblChkRecpt.Text = "Cheque No";
                txtChequeInFavor.Visible = true;
                reqChequeInFavor.Enabled = true;
                regChequeInFavor.Enabled = true;
                ddInstitution.Visible = false;
                //RequiredValddInstitution.Visible = false;
                RequiredValddInstitution.Enabled = false;
                reGChequeNo.Enabled = true;
            }
            else //ssssssssss
            {
                lbluploadIdName.Text = "Fees Receipt Upload";
                lblChkRecpt.Text = "Fees Receipt No";
                ddInstitution.Visible = false;
                //RequiredValddInstitution.Visible = false;
                RequiredValddInstitution.Enabled = false;
                txtChequeInFavor.Visible = false;
                reqChequeInFavor.Enabled = false;
                regChequeInFavor.Enabled = false;
                reGChequeNo.Enabled = false;

                //trChequeNo.Visible = false;
                //reQChequeNo.Enabled = false;
                trddlIssuedBy.Visible = false;
                RequiredFieldValidator1.Enabled = false;

                trFeeReceiptDate.Visible = true;
                reQtxtFeeReceiptDate.Enabled = true;
            }
        }

        //ddInstitution_OnSelectedIndexChanged

        protected void ddInstitution_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            if (ddInstitution.SelectedItem.Text == "Other")
            {
                txtOtherInstitution.Visible = true;
                RequiredtxtOtherInstitution.Enabled = true;
            }
            else
            {
                txtOtherInstitution.Visible = false;
                RequiredtxtOtherInstitution.Enabled = false;
            }
        }

        public void btnOk_Click(object sender, EventArgs e)
        {
            Response.Write("<script>window.open('DDCheckAdminProccess.aspx',target='_top');</script>");
        }

        protected void btnDonate_Click(object sender, EventArgs e)
        {
            cmd = new SqlCommand();
            clsApproval objApprove = new clsApproval();

            string strApplicationNo = "";
           // string strScholarshipId = "";
            try
            {
                //lock (lckThis)
                //{

                    if (con.State != ConnectionState.Open)
                    {
                        con.Open();
                    }
                    strApplicationNo = lblApplnNo.Text;
                   
                    string strDDCheck = "/ScholerShipData/" + strApplicationNo + "/" + strApplicationNo + "_DDCheck_" + DateTime.Now.ToString().Replace("/", "").Replace(" ", "").Replace(":", "")  + Path.GetExtension(fuDDChequeID.FileName);
                    if (fuDDChequeID.HasFile)
                    {
                        if (!Directory.Exists(Path.GetDirectoryName(Server.MapPath("~"+ "/ScholerShipData/" + strApplicationNo + "/"))))
                        {
                            Directory.CreateDirectory(Path.GetDirectoryName(Server.MapPath("~" + "/ScholerShipData/" + strApplicationNo + "/")));
                        }

                        fuDDChequeID.SaveAs(Server.MapPath("~" + strDDCheck));
                    }
                    //strScholarshipId = GenerateScholerID(strApplicationNo);
                    strQuery = "Update t_Registration_Process set  ";
                    //Bank_Branch = '" + txtBranch.Text.ToString() + "',";
                    //strQuery = strQuery + " Bank_Name = '" + ddlBankName.SelectedValue.ToString() + "', ";                        
                    //strQuery = strQuery + " Scholarship_Issued_BankBranch = '" + txtBranch.Text.ToString() + "', ";
                    //strQuery = strQuery + " Scholarship_Issued_BankName = '" + ddlBankName.SelectedValue.ToString() + "', ";

                    strQuery = strQuery + " DDCheque_No = '" + txtChequeNo.Text.ToString() + "', ";                 
                    strQuery = strQuery + " Scholarship_Issued_Amount = '" + lblAmountIssued.Text.Trim().ToString() + "', ";
                    strQuery = strQuery + " Scholarship_Issued_Date = '" + txtIssuedDate.Text.Trim().ToString() + "', ";
                    strQuery = strQuery + " Status = 'Completed',  ";
                    //strQuery = strQuery + " Scholarship_No = '" + strScholarshipId + "',";
                    strQuery = strQuery + " DDCheque_In_Favor_Type = '" + rdoChequeInFavor.SelectedItem.Text.ToString() + "', ";
                
                    if (rdoChequeInFavor.SelectedValue == "Institution")
                    {
                        if (ddInstitution.SelectedValue == "--Select--")
                        {
                            strQuery = strQuery + " DDCheque_Institution_ID = '', ";
                        }
                        else
                        {
                            strQuery = strQuery + " DDCheque_Institution_ID = '" + Convert.ToInt32(ddInstitution.SelectedValue.ToString()) + "', ";
                        }
                        strQuery = strQuery + " DDCheque_Other_Institution = '" + txtOtherInstitution.Text.ToString() + "', ";
                        strQuery = strQuery + " DDCheque_IssuedBy = '" + Convert.ToInt32(ddlIssuedBy.SelectedValue.ToString()) + "',";
                    }
                    else if (rdoChequeInFavor.SelectedValue == "Individual")
                    {
                        strQuery = strQuery + " DDCheque_In_Favor = '" + txtChequeInFavor.Text.ToString() + "', ";
                        strQuery = strQuery + " DDCheque_IssuedBy = '" + Convert.ToInt32(ddlIssuedBy.SelectedValue.ToString()) + "',";
                    }
                    else
                    {
                        DateTime dtFeeReceiptDate = DateTime.ParseExact(txtFeeReceiptDate.Text.ToString(), "dd/MM/yyyy", CultureInfo.InvariantCulture);
                        strQuery = strQuery + " DDCheque_Date = '" + dtFeeReceiptDate + "', ";
                    }
                                  
                    strQuery = strQuery + " Donated_Date = '" + DateTime.Now.ToString() + "',";
                    strQuery = strQuery + " DDCheque_Path = '" + strDDCheck.ToString() + "',";
                    strQuery = strQuery + " DDCheque_Path_ForCrystal = '" + MapPath("~" + strDDCheck).ToString() + "'";

                    strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "' and  Scholarship_Id = '" + txtScholarshipId.Text.Trim().ToString() + "'";
                cmd = new SqlCommand(strQuery, con);
                    cmd.ExecuteNonQuery();


                    string TrimValue = "";

                    if (rdoChequeInFavor.SelectedValue == "Institution")
                    {
                        TrimValue = ddInstitution.SelectedItem.Text.ToString() +"-"+ txtOtherInstitution.Text.ToString();
                    }
                    else if (rdoChequeInFavor.SelectedValue == "Individual")
                    {
                        TrimValue = txtChequeInFavor.Text.ToString();
                    }
                    else
                    {
                        TrimValue = "";
                    }


                    //if (ddInstitution.SelectedValue == "--Select--")
                    //{
                    //    TrimValue = txtChequeInFavor.Text.ToString() + txtOtherInstitution.Text.ToString();
                    //}
                    //else
                    //{
                    //    TrimValue = txtChequeInFavor.Text.ToString() + ddInstitution.SelectedItem.Text.ToString() + txtOtherInstitution.Text.ToString();
                    //}
                                    
                string strText = "";                 
                strText += "Scholarship-" + this.txtScholarshipId.Text.Trim().ToString() + "<br/>" + " Requested Amount is: <b> Rs." + lblRequestedAmount.Text.Trim().ToString() + "</b> <br/> Suggested Amount : <b> Rs." + lblSuggestedAmt.Text.ToString() + " </b> <br/> ";
                strText += " Approved Amount : <b> Rs." + lblApprovedAmt.Text.ToString() + "</b> <br/> Issued Amount : <b> Rs." + lblApprovedAmt.Text.ToString() + "</b> <br/>";
                strText += " Cheque Isseued By : <b>" + ddlIssuedBy.SelectedItem.Text.ToString() + "</b><br/> DD/Cheque in favor : <b>" + TrimValue.Trim() + " (" + rdoChequeInFavor.SelectedItem.Text.ToString() + ")" + "</b> <br/>";
                if (rdoChequeInFavor.SelectedValue == "Concession")
                {
                    strText += "Fee Receipt No : <b>" + txtChequeNo.Text.ToString() + "</b> <br/> Fee Receipt Date : <b>" + txtFeeReceiptDate.Text.Trim().ToString() + "</b>  ";
                }
                else
                {
                    strText += "Cheque/DD No : <b>" + txtChequeNo.Text.ToString() + "</b> <br/> Cheque/DD Date : <b>" + txtIssuedDate.Text.Trim().ToString() + "</b>  ";
                }
                
                
                // " LMS Scholarship ID : <b> " + strScholarshipId + " </b> <br/> ";  
                
                objApprove.UpdateHistory(lblApplnNo.Text, strText, "Final Document Upload, Scholership Issued Details", Session["User_ID"].ToString());

                    //Generate Scholership id

                    dvform.Visible = false;
                    dvSuccess.Visible = true;

                    //lblSuccess.Text = "Scholership amount issued succesfully to " + lblName.Text + "(" + lblApplnNo.Text + " ) </br>  Scholership Issued ID : <b>" + strScholarshipId + "</b>.";
                    lblSuccess.Text = "Scholarship amount issued succesfully to " + lblName.Text + "(" + lblApplnNo.Text + " )";

                   // Literal.Text += String.Format("<asp:HyperLink ID=\"hlContact\" runat=\"server\" NavigateUrl=\"{0}\">Contact</asp:HyperLink>", navigationUrl); 


                    //To save student data's to edumate server
                    if (!string.IsNullOrEmpty(lblStudId.Text) && (lblStudCollege.Text == "Sri Sai Ram Engineering College,West Tambaram,Chennai" || lblStudCollege.Text == "Sri Sai Ram Institute of Technology,West Tambaram,Chennai"
                       || lblStudCollege.Text == "Sri Sai Ram Engineering College" || lblStudCollege.Text == "Sri Sai Ram Institute of Technology"
                       || lblStudCollege.Text == "Sri Sairam Engineering College" || lblStudCollege.Text == "Sri Sairam Institute of Technology"
                       
                       ))
                    {
                        string College = "";
                        if (lblStudCollege.Text == "Sri Sai Ram Engineering College,West Tambaram,Chennai" || lblStudCollege.Text == "Sri Sai Ram Engineering College" || lblStudCollege.Text == "Sri Sairam Engineering College" || lblStudCollege.Text == "SRI SAIRAM ENGINEERING COLLEGE")                        
                            College = "SEC";
                        else
                            College = "SIT";
                        
                        bool statusSairam = false;
                        if (objCommon.GetStatus_Edumate())
                            statusSairam = SaveScholarshipDatatoEdumate(lblStudId.Text.Trim(), College, lblApprovedAmt.Text.Trim().ToString(), lblSchYear.Text.Trim(), lblEAdmissionNo.Text.Trim(), lblApplnNo.Text.Trim(), lblSchNo.Text.Trim());
                    }

                    lnkPrintFinal.NavigateUrl = "~/AjaxPrintDDChequeDetails.aspx?applnno=" +lblApplnNo.Text + "&scholarshipId=" + txtScholarshipId.Text;

                // Response.Write("<script>window.open('DDCheckAdminProccess.aspx',target='_top');</script>");
                //  }
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
            #region
            //cmd = new SqlCommand();
            //clsApproval objApprove = new clsApproval();
            //try
            //{
            //    if (con.State != ConnectionState.Open)
            //    {
            //        con.Open();
            //    }
            //    cmd.CommandText = "USP_UPDATE_SCHOLARSHIP_DATA_DONATE";
            //    cmd.CommandType = CommandType.StoredProcedure;
            //    if (con.State != ConnectionState.Open)
            //    {
            //        con.Open();
            //    }
            //    cmd.Connection = con;
            //    cmd.Parameters.Add(new SqlParameter("@Application_Id", Request.QueryString["applnno"].ToString().Trim().ToString()));
            //    cmd.Parameters.Add(new SqlParameter("@Scholarship_Issued_Amount", txtAmountIssued.Text.Trim().ToString()));
            //    cmd.ExecuteNonQuery();

            //    string strText = Session["User_ID"].ToString() + " has issued Mr." + lblName.Text.ToString() + "(" + lblApplnNo.Text.ToString() + ") for " + lblScholarShipSeekingFor.Text.ToString() + " amount " + txtAmountIssued.Text.Trim().ToString();
            //    objApprove.UpdateHistory(lblApplnNo.Text, strText, "Issued Scholarship Amount", Session["User_ID"].ToString());

            //    dvform.Visible = false;
            //    dvSuccess.Visible = true;

            //    lblSuccess.Text = "Process completed succesfully thak you!";
            //}
            //catch (Exception ex)
            //{
            //    lblError.Text = ex.Message;
            //}
            //finally
            //{
            //    if (con.State != ConnectionState.Closed)
            //    {
            //        con.Close();
            //    }
            //    cmd = null;
            //    dsData = null;

            //}
            #endregion


        }




        public bool SaveScholarshipDatatoEdumate(string studentId, string College, string Amount, string ScholarshipYear, string EAdmissionApplnNo, string LMSApplnNo, string LMSScholarshipNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = new SqlConnection();
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            SqlCommand cmdSql;
            SqlDataReader dr;
            SqlDataReader dr1;
            string strCurrentYear = Convert.ToString(DateTime.Today.Year);
            string[] conStr = new string[2];
           

            try
            {
                    Array.Copy(objCommon.GetConnectionStringEdumate(), conStr, 2);
                    connSql = new SqlConnection(conStr[College == "SEC" ? 0 : 1]);

                    if (connSql.State != ConnectionState.Open)
                        connSql.Open();

                // Check Student Id Exists
                        strQuery = "";                        
                        strQuery += "Select Top 1 Id from T_CFG_STUDENT_PERSONAL_DETAIL where StudentId_Rollno = '" + studentId + "' ";
                        cmdSql = new SqlCommand(strQuery, connSql);
                        dr1 = cmdSql.ExecuteReader();

                        if (dr1.Read())
                        {
                            dr1.Close();
                            
                            //Check duplication
                            strQuery = "";
                            strQuery += " Select * from T_STUDENT_SCHOLARSHIP where LMSSholarshipNo = '" + LMSScholarshipNo + "' and StudentTable_Id = (";
                            strQuery += "Select Top 1 Id from T_CFG_STUDENT_PERSONAL_DETAIL where StudentId_Rollno = '" + studentId + "') and AcademicYear_Id = (";
                            strQuery += "Select Top 1 Id from T_CFG_ACADEMIC_YEAR where SUBSTRING(Academic_year_code,1,4) = SUBSTRING('" + ScholarshipYear + "',1,4)) and ScholarshipType_Id = (";
                            strQuery += "Select Top 1 Id from T_CFG_SCHOLARSHIP Where Scholarship_Code = 'LMS' and Status = 1 and Delete_Flag = 0)";
                            cmdSql = new SqlCommand(strQuery, connSql);
                            dr = cmdSql.ExecuteReader();

                            if (!dr.Read())
                            {
                                dr.Close();

                                //Save Scholarship detail 
                                strQuery = "";
                                strQuery += " INSERT INTO T_STUDENT_SCHOLARSHIP ( E_AdmissionId,LMSRegId,LMSSholarshipNo, StudentTable_Id,AcademicYear_Id,ScholarshipType_Id,Scholarship_Amount,Status,Delete_Flag,Created_By,Created_Date) ";
                                strQuery += " Values (";
                                strQuery += " '" + EAdmissionApplnNo + "', '" + LMSApplnNo + "', '" + LMSScholarshipNo + "', ";
                                strQuery += "(Select Top 1 Id from T_CFG_STUDENT_PERSONAL_DETAIL where StudentId_Rollno = '" + studentId + "'), ";
                                strQuery += "(Select Top 1 Id from T_CFG_ACADEMIC_YEAR where SUBSTRING(Academic_year_code,1,4) = SUBSTRING('" + ScholarshipYear + "',1,4)),";
                                strQuery += "(Select Top 1 Id from T_CFG_SCHOLARSHIP Where Scholarship_Code = 'LMS' and Status = 1 and Delete_Flag = 0), ";
                                strQuery += "'" + Amount + "',";
                                //strQuery += "1,0,'" + Convert.ToInt32(Session["intUser_ID"]) + "','";
                                strQuery += "1,0,0,'";
                                strQuery += DateTime.Now + "')";

                                if (connSql.State != ConnectionState.Open)
                                    connSql.Open();
                                cmdSql = new SqlCommand(strQuery, connSql);
                                cmdSql.ExecuteNonQuery();


                            }
                        }
                
                return true;
            }
            catch (Exception ex)
            {
                
                return false;
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                objCommon = null;
                connSql = null;
                strQuery = null;
                cmdSql = null;
            }
        }





    }
}
