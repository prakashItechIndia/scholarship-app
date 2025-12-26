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
    public partial class ScolarshipReSuggest : System.Web.UI.Page
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
                        divtxtstate.Attributes.CssStyle.Add("Display", "none");
                        rfvStatetxt.Enabled = false;
                        divtxtcountry.Attributes.CssStyle.Add("Display", "none");
                        rfvCountrtTxt.Enabled = false;
                        //divtxtDistrict.Attributes.CssStyle.Add("Display", "none");
                        //rfvtxtDistrict.Enabled = false;
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
            string MobileNo = "";
            try
            {
                lblApplnNo.Text = Request.QueryString["applnno"].ToString();

                ddlState.DataSource = objApproval.GetState("100");
                ddlState.DataTextField = "State_name";
                ddlState.DataValueField = "State_ID";
                ddlState.DataBind();
                ddlState.SelectedIndex = 0;

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
                cmd.Parameters.Add(new SqlParameter("@Process_Type", "Registered"));
                cmd.Parameters.Add(new SqlParameter("@Scholarship_Id", Request.QueryString["scholarshipId"].ToString().Trim().ToString()));
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    hideApplicationId.Value = dsData.Tables[0].Rows[0]["Application_Id"].ToString();
                    lblSchlorshipYear.Text = dsData.Tables[0].Rows[0]["ScholarshipYear_Name"].ToString();
                    txtName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                    txtAadhaarID.Text = dsData.Tables[0].Rows[0]["Aadhaar_ID"].ToString();
                    txtStudentId.Text = dsData.Tables[0].Rows[0]["Student_ID"].ToString().Trim();

                    if (string.IsNullOrEmpty(dsData.Tables[0].Rows[0]["Aadhaar_ID"].ToString()))
                    {
                        chkAadhaarID.Visible = false;
                        CustomValidator2.Visible = false;
                    }


                    txtPanId.Text = dsData.Tables[0].Rows[0]["Pan_ID"].ToString();
                    if (string.IsNullOrEmpty(dsData.Tables[0].Rows[0]["Pan_ID"].ToString()))
                    {
                        chkPanId.Visible = false;
                        CustomValidator5.Visible = false;
                    }

                    //--- Bind Completed Prevoise Record for Aadhaar ID
                    fncBindIssuedAmount(dsData.Tables[0].Rows[0]["Aadhaar_ID"].ToString(), dsData.Tables[0].Rows[0]["Pan_ID"].ToString());


                   

                    lblApplnNo.Text = dsData.Tables[0].Rows[0]["Application_Id"].ToString();
                    txtFatherName.Text = dsData.Tables[0].Rows[0]["Father_Name"].ToString();
                    if (dsData.Tables[0].Rows[0]["Father_Occupation"].ToString() == "Others")
                    {
                        ddlFatherOccupathion.SelectedValue = "Others";
                        dvOtherFatherOccupation.Visible = true;
                        txtOtherFatherOccupation.Text = dsData.Tables[0].Rows[0]["Father_Occupation_Other"].ToString();
                    }
                    else if (dsData.Tables[0].Rows[0]["Father_Occupation"].ToString() == "SaiRam Groups")
                    {
                        ddlFatherOccupathion.SelectedValue = "SaiRam Groups";
                        dvFatherOccupathionSaiRam.Visible = true;
                        ddlFatherOccupathionSaiRam.SelectedValue = dsData.Tables[0].Rows[0]["Father_Occupation_Other"].ToString();
                    }
                    else
                    {
                        ddlFatherOccupathion.SelectedValue = dsData.Tables[0].Rows[0]["Father_Occupation"].ToString();
                    }
                    txtMotherName.Text = dsData.Tables[0].Rows[0]["Mother_Name"].ToString();
                    if (dsData.Tables[0].Rows[0]["Mother_Occupation"].ToString() == "Others")
                    {
                        ddlMotherOccupathion.SelectedValue = "Others";
                        dvOtherMotherOccupathion.Visible = true;
                        txtOtherMotherOccupation.Text = dsData.Tables[0].Rows[0]["Mother_Occupation_Other"].ToString();
                    }
                    else if (dsData.Tables[0].Rows[0]["Mother_Occupation"].ToString() == "SaiRam Groups")
                    {
                        ddlMotherOccupathion.SelectedValue = "SaiRam Groups";
                        dvMotherOccupathionSaiRam.Visible = true;
                        ddlMotherOccupathionSaiRam.SelectedValue = dsData.Tables[0].Rows[0]["Mother_Occupation_Other"].ToString();
                    }
                    else
                    {
                        ddlMotherOccupathion.SelectedValue = dsData.Tables[0].Rows[0]["Mother_Occupation"].ToString();
                    }
                    txtGuardianName.Text = dsData.Tables[0].Rows[0]["Guardian_Name"].ToString();
                    if (dsData.Tables[0].Rows[0]["Guardian_Occupation"].ToString() == "Others")
                    {
                        ddlGuardianOccupathion.SelectedValue = "Others";
                        dvOtherGuardianOccupathion.Visible = true;
                        txtOtherGuardianOccupathion.Text = dsData.Tables[0].Rows[0]["Guardian_Occupation_Other"].ToString();
                    }
                    else if (dsData.Tables[0].Rows[0]["Guardian_Occupation"].ToString() == "SaiRam Groups")
                    {
                        ddlGuardianOccupathion.SelectedValue = "SaiRam Groups";
                        dvGuardianOccupathionSaiRam.Visible = true;
                        ddlGuardianOccupathionSaiRam.SelectedValue = dsData.Tables[0].Rows[0]["Guardian_Occupation_Other"].ToString();
                    }
                    else
                    {
                        ddlGuardianOccupathion.SelectedValue = dsData.Tables[0].Rows[0]["Guardian_Occupation"].ToString();
                    }

                    radTypeofInstitution.SelectedValue = dsData.Tables[0].Rows[0]["Type_Of_Institution"].ToString();
                    txtInstitution.Text = dsData.Tables[0].Rows[0]["Institution_Name"].ToString();

                    if (dsData.Tables[0].Rows[0]["Scholarship_For"].ToString() == "School")
                    {
                        trSchool.Visible = true;
                        ddlClassStudying.SelectedValue = dsData.Tables[0].Rows[0]["Class_Studying"].ToString();
                        rfvClassStudying.Enabled = true;
                        ddlXIIBoard.SelectedValue = dsData.Tables[0].Rows[0]["Board_Of_Studying"].ToString();
                        rfvXIIBoard.Enabled = true;
                        if (dsData.Tables[0].Rows[0]["Board_Of_Studying"].ToString() == "State Board (TN State)")
                        {
                        }
                        else if (dsData.Tables[0].Rows[0]["Board_Of_Studying"].ToString() == "Central Board(CBSE)")
                        {
                        }
                        else if (dsData.Tables[0].Rows[0]["Board_Of_Studying"].ToString() == "Matriculation")
                        {
                        }
                        else if (dsData.Tables[0].Rows[0]["Board_Of_Studying"].ToString() == "Intermediate")
                        {
                        }
                        else
                        {
                            ddlXIIBoard.SelectedValue = "Others";
                            dvBoardOthers.Visible = true;
                            reqBoardOthers.Enabled = true;
                            txtBoardOthers.Text = dsData.Tables[0].Rows[0]["Board_Of_Studying"].ToString();
                        }
                    }
                    else
                    {
                        hdClassOfStuding.Value = dsData.Tables[0].Rows[0]["Class_Studying"].ToString();
                        hdBoardOfStudying.Value = dsData.Tables[0].Rows[0]["Board_Of_Studying"].ToString();
                    }

                    txtAddressLine1.Text = dsData.Tables[0].Rows[0]["Address_Line1"].ToString();
                    txtCity.Text = dsData.Tables[0].Rows[0]["City"].ToString();
                    txtPin.Text = dsData.Tables[0].Rows[0]["PinCode"].ToString();
                    if (dsData.Tables[0].Rows[0]["Country"].ToString() == "India")
                    {
                        ddlCountry.SelectedValue = "100";
                    }
                    else
                    {
                        ddlCountry.SelectedValue = dsData.Tables[0].Rows[0]["Country"].ToString();
                    }
                    ddlState.SelectedValue = dsData.Tables[0].Rows[0]["State_Id"].ToString();
                    int StateId = Convert.ToInt32(dsData.Tables[0].Rows[0]["State_Id"]);
                    if (StateId != 31)
                    {
                        divddlDistrict.Attributes.CssStyle.Add("Display", "none");
                        divtxtDistrict.Attributes.CssStyle.Add("Display", "block");
                        rfvddlDistrict.Enabled = false;
                        rfvtxtDistrict.Enabled = true;
                        ddlDistrict.SelectedIndex = 0;
                        txtDistrict.Text = dsData.Tables[0].Rows[0]["District"].ToString();
                    }
                    else
                    {
                        ddlDistrict.SelectedValue = dsData.Tables[0].Rows[0]["District"].ToString();
                        //District
                        divddlDistrict.Attributes.CssStyle.Add("Display", "block");
                        divtxtDistrict.Attributes.CssStyle.Add("Display", "none");
                        rfvddlDistrict.Enabled = true;
                        rfvtxtDistrict.Enabled = false;
                        txtDistrict.Text = "";
                    }
                    radGender.SelectedValue = dsData.Tables[0].Rows[0]["Gender"].ToString();
                    txtDOB.Text = dsData.Tables[0].Rows[0]["Date_Of_Birth"].ToString();
                    txtEmailID.Text = dsData.Tables[0].Rows[0]["Email"].ToString();
                    ddlCoomunity.SelectedValue = dsData.Tables[0].Rows[0]["Community"].ToString();
                    txtCaste.Text = dsData.Tables[0].Rows[0]["Caste"].ToString();
                    string StrMob = dsData.Tables[0].Rows[0]["Mobile_Number"].ToString();
                    MobileNo = StrMob.Substring(2, StrMob.Length - 2);
                    txtMobile.Text = MobileNo;
                }
                else
                {
                    lblError.Text = "Invalid Application Number";
                }
                strQuery = "Select";
                strQuery = strQuery + " A.Application_Id,A.DocumentType ,A.DocumentPath,A.Is_Verified ";
                strQuery = strQuery + " FROM t_esch_ApplicantDocuments A";
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
                            trBC.Visible = true;
                            aBC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoBC.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoBC.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Student ID Card")
                        {
                            trStuID.Visible = true;
                            aStuID.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoStuID.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoStuID.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Ration Card")
                        {
                            trRC.Visible = true;
                            aRC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoRC.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoRC.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Voter ID")
                        {
                            trVD.Visible = true;
                            aVD.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoVD.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoVD.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Pan Card")
                        {
                            trPC.Visible = true;
                            aPC.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoPC.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoPC.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Driving License")
                        {
                            trDD.Visible = true;
                            aDD.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoDD.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoDD.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Bank Pass Book")
                        {
                            trBPB.Visible = true;
                            aBPB.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoBPB.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoBPB.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Aadhar ID")
                        {
                            trAID.Visible = true;
                            aAID.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoAID.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoAID.SelectedValue = "1";
                                    break;
                            }
                        }

                        if (DocumentType == "Bonafide-Student")
                        {
                            trBS.Visible = true;
                            aBS.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoBS.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoBS.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Bonafide-Parent")
                        {
                            trBP.Visible = true;
                            aBP.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoBP.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoBP.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Academic Performance")
                        {
                            trAP.Visible = true;
                            aAP.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoAP.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoAP.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (DocumentType == "Student Letter")
                        {
                            trL.Visible = true;
                            aL.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoL.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoL.SelectedValue = "1";
                                    break;
                            }
                        }

                        string jk = DocumentType;
                        string sp1 = jk.Substring(0, jk.Length - 8);
                        string sp2 = jk.Substring(sp1.Length + 1, 7);

                        if (sp2 == "sports1")
                        {
                            trSp1.Visible = true;
                            aC1.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC1.Text = sp1;
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoC1.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoC1.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (sp2 == "sports2")
                        {
                            trSp2.Visible = true;
                            aC2.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC2.Text = sp1;
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoC2.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoC2.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (sp2 == "sports3")
                        {
                            trSp3.Visible = true;
                            aC3.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC3.Text = sp1;
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoC3.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoC3.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (sp2 == "sports4")
                        {
                            trSp4.Visible = true;
                            aC4.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC4.Text = sp1;
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoC4.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoC4.SelectedValue = "1";
                                    break;
                            }
                        }
                        if (sp2 == "sports5")
                        {
                            trSp5.Visible = true;
                            aC5.Attributes.Add("href", "~" + dsData.Tables[0].Rows[i]["DocumentPath"].ToString());
                            lblC5.Text = sp1;
                            switch (dsData.Tables[0].Rows[i]["Is_Verified"].ToString())
                            {
                                case "0":
                                    rdoC5.SelectedValue = "0";
                                    break;
                                case "1":
                                    rdoC5.SelectedValue = "1";
                                    break;
                            }
                        }

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
                if (con.State != ConnectionState.Closed)
                {
                    con.Close();
                }
                cmd = null;
                dsData = null;

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
                    dvFatherOccupathionSaiRam.Visible = false;
                    rfvFatherOccupathionSaiRam.Enabled = false;
                    ddlFatherOccupathionSaiRam.SelectedIndex = -1;

                }
                else if (ddlFatherOccupathion.SelectedValue.ToString() == "SaiRam Groups")
                {
                    dvFatherOccupathionSaiRam.Visible = true;
                    rfvFatherOccupathionSaiRam.Enabled = true;
                    dvOtherFatherOccupation.Visible = false;
                    rfvOtherFatherOccupation.Enabled = false;
                }
                else
                {
                    dvOtherFatherOccupation.Visible = false;
                    rfvOtherFatherOccupation.Enabled = false;
                    txtOtherFatherOccupation.Text = "";
                    dvFatherOccupathionSaiRam.Visible = false;
                    rfvFatherOccupathionSaiRam.Enabled = false;
                    ddlFatherOccupathionSaiRam.SelectedIndex = -1;
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
                    dvMotherOccupathionSaiRam.Visible = false;
                    rvfMotherOccupationSaiRam.Enabled = false;
                    ddlMotherOccupathionSaiRam.SelectedIndex = -1;

                }
                else if (ddlMotherOccupathion.SelectedValue.ToString() == "SaiRam Groups")
                {
                    dvMotherOccupathionSaiRam.Visible = true;
                    rvfMotherOccupationSaiRam.Enabled = true;
                    dvOtherMotherOccupathion.Visible = false;
                    rvfOtherMotherOccupation.Enabled = false;
                }
                else
                {
                    dvOtherMotherOccupathion.Visible = false;
                    rvfOtherMotherOccupation.Enabled = false;
                    txtOtherMotherOccupation.Text = "";
                    dvMotherOccupathionSaiRam.Visible = false;
                    rvfMotherOccupationSaiRam.Enabled = false;
                    ddlMotherOccupathionSaiRam.SelectedIndex = -1;
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }

        protected void ddlGuardianOccupathion_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlGuardianOccupathion.SelectedValue.ToString() == "Others")
                {
                    dvOtherGuardianOccupathion.Visible = true;
                    rvfOtherGuardianOccupathion.Enabled = true;
                    dvGuardianOccupathionSaiRam.Visible = false;
                    rvfGuardianOccupationSaiRam.Enabled = false;
                    ddlGuardianOccupathionSaiRam.SelectedIndex = -1;

                }
                else if (ddlGuardianOccupathion.SelectedValue.ToString() == "SaiRam Groups")
                {
                    dvGuardianOccupathionSaiRam.Visible = true;
                    rvfGuardianOccupationSaiRam.Enabled = true;
                    dvOtherGuardianOccupathion.Visible = false;
                    rvfOtherGuardianOccupathion.Enabled = false;
                }
                else
                {
                    dvOtherGuardianOccupathion.Visible = false;
                    rvfOtherGuardianOccupathion.Enabled = false;
                    txtOtherGuardianOccupathion.Text = "";
                    dvGuardianOccupathionSaiRam.Visible = false;
                    rvfGuardianOccupationSaiRam.Enabled = false;
                    ddlGuardianOccupathionSaiRam.SelectedIndex = -1;
                }
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message.ToString();
            }
        }

        protected void btnUpdate_Click(object sender, EventArgs e)
        {
            clsApproval objApprove = new clsApproval();
           // clsEmail objEmail = new clsEmail();
            DataSet dsData = new DataSet();
            DataSet dsStudent = new DataSet();

            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            String strQuery;
            clsApproval objApproval = new clsApproval();

            string strState = "";
            string strCountry = "";
            string strDistrict = "";
            byte[] byteArray = null;
            try
            {
                lock (lckThis)
                {
                    //verify document
                    if ((txtAadhaarID.Text != "") || (txtPanId.Text != ""))
                    {


                    if (sqlConn.State != ConnectionState.Open)
                        sqlConn.Open();
                    SqlCmd = new SqlCommand();
                    SqlCmd.CommandText = "USP_UPDATE_SCHOLARSHIP";
                    SqlCmd.CommandType = CommandType.StoredProcedure;


                    SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", hideApplicationId.Value));
                    SqlCmd.Parameters.Add(new SqlParameter("@Applicant_Name", txtName.Text.Trim().ToString().ToUpper()));
                    SqlCmd.Parameters.Add(new SqlParameter("@Aadhaar_ID", txtAadhaarID.Text.Trim().ToString()));
                    SqlCmd.Parameters.Add(new SqlParameter("@Student_ID", txtStudentId.Text.Trim().ToString()));

                    SqlCmd.Parameters.Add(new SqlParameter("@Pan_ID", txtPanId.Text.Trim().ToString()));

                    SqlCmd.Parameters.Add(new SqlParameter("@Father_Name", txtFatherName.Text.Trim().ToString().ToUpper()));
                    if (ddlFatherOccupathion.SelectedValue == "Others")
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation", ddlFatherOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation_Other", txtOtherFatherOccupation.Text.Trim().ToString()));
                    }
                    else if (ddlFatherOccupathion.SelectedValue.ToString() == "SaiRam Groups")
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation", ddlFatherOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation_Other", ddlFatherOccupathionSaiRam.SelectedValue.Trim().ToString()));
                    }
                    else
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation", ddlFatherOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Father_Occupation_Other", ""));
                    }

                    SqlCmd.Parameters.Add(new SqlParameter("@Mother_Name", txtMotherName.Text.Trim().ToString().ToUpper()));
                    if (ddlMotherOccupathion.SelectedValue == "Others")
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation", ddlMotherOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation_Other", txtOtherMotherOccupation.Text.Trim().ToString()));
                    }
                    else if (ddlMotherOccupathion.SelectedValue.ToString() == "SaiRam Groups")
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation", ddlMotherOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation_Other", ddlMotherOccupathionSaiRam.SelectedValue.Trim().ToString()));
                    }
                    else
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation", ddlMotherOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Mother_Occupation_Other", ""));
                    }

                    SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Name", txtGuardianName.Text.Trim().ToString().ToUpper()));
                    if (ddlGuardianOccupathion.SelectedValue == "Others")
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation", ddlGuardianOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation_Other", txtOtherGuardianOccupathion.Text.Trim().ToString()));
                    }
                    else if (ddlGuardianOccupathion.SelectedValue.ToString() == "SaiRam Groups")
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation", ddlGuardianOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation_Other", ddlGuardianOccupathionSaiRam.SelectedValue.Trim().ToString()));
                    }
                    else
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation", ddlGuardianOccupathion.SelectedValue.Trim().ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Guardian_Occupation_Other", ""));
                    }


                    SqlCmd.Parameters.Add(new SqlParameter("@Type_Of_Institution", radTypeofInstitution.SelectedValue.ToString()));
                    if (ChkInstitutionSaiRam.Checked == true)
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Institution_Name", ddlInstitutionSaiRam.SelectedValue.ToString()));
                    }
                    else
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Institution_Name", txtInstitution.Text.Trim()));
                    }
                    if (trSchool.Visible == true)
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Class_Studying", ddlClassStudying.SelectedValue.ToString()));
                        if (ddlXIIBoard.SelectedValue == "Others")
                        {
                            SqlCmd.Parameters.Add(new SqlParameter("@Board_Of_Studying", txtBoardOthers.Text.Trim()));
                        }
                        else
                        {
                            SqlCmd.Parameters.Add(new SqlParameter("@Board_Of_Studying", ddlXIIBoard.SelectedValue.ToString()));
                        }
                    }
                    else
                    {
                        SqlCmd.Parameters.Add(new SqlParameter("@Class_Studying", hdClassOfStuding.Value.ToString()));
                        SqlCmd.Parameters.Add(new SqlParameter("@Board_Of_Studying", hdBoardOfStudying.Value.ToString()));
                    }

                    SqlCmd.Parameters.Add(new SqlParameter("@Address_Line1", txtAddressLine1.Text.Trim().ToString()));
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
                    SqlCmd.Parameters.Add(new SqlParameter("@Mobile_Number", "91" + txtMobile.Text.Trim().ToString()));
                    SqlCmd.Parameters.Add(new SqlParameter("@Email", txtEmailID.Text.Trim().ToString()));

                    //String strBirthDate = txtDOB.Text;
                    //String format = "dd/MM/yyyy";
                    //DateTime dtTime = DateTime.ParseExact(strBirthDate, format, CultureInfo.InvariantCulture);@Photo

                    SqlCmd.Parameters.Add(new SqlParameter("@Date_Of_Birth", txtDOB.Text.Trim().ToString()));
                    SqlCmd.Parameters.Add(new SqlParameter("@Gender", radGender.SelectedValue.ToString()));
                    SqlCmd.Parameters.Add(new SqlParameter("@Community", ddlCoomunity.Text.Trim().ToString()));
                    SqlCmd.Parameters.Add(new SqlParameter("@Caste", txtCaste.Text.Trim().ToString()));

                    SqlCmd.Connection = sqlConn;
                    SqlCmd.ExecuteNonQuery();
                    dvDocumenmtsUpload.Visible = true;
                    lblmandatoryError.Text = "";
                    lblmandatoryError.Visible = false;
                    }
                    else
                    {
                        lblmandatoryError.Text = "(AADHAAR ID or PAN ID is mandatory)";
                        //MessageBox.Show("AADHAAR ID or PAN ID is mandatory.");
                    }
                }
            }
            catch (Exception ex)
            {
                lblUpdateError.Text = ex.Message;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                {
                    con.Close();
                }
                cmd = null;
                objApprove = null;
                //objEmail = null;
                dsData = null;
                dsStudent = null;
            }

        }
        protected void btnVerify_Click(object sender, EventArgs e)
        {
            clsApproval objApprove = new clsApproval();
          //  clsEmail objEmail = new clsEmail();
            DataSet dsData = new DataSet();
            DataSet dsStudent = new DataSet();

            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            String strQuery;
            clsApproval objApproval = new clsApproval();

            string strState = "";
            string strCountry = "";
            string strDistrict = "";
            byte[] byteArray = null;
            string strBC = null;
            //string strBC2 = null;
            string strStuID = null;
            string strRC = null;
            string strDD = null;
            string strVD = null;
            string strBPB = null;
            string strAID = null;
            string strPC = null;
            string strBS = null;
            string strBP = null;
            string strAP = null;
            string strL = null;
            string strC1 = null;
            string strC2 = null;
            string strC3 = null;
            string strC4 = null;
            string strC5 = null;
            string strAction = null;
            string strBType = null;
            string strSType = null;
            string strRType = null;
            string strDType = null;
            string strVType = null;
            string strAType = null;
            string strPType = null;
            string strBSType = null;
            string strBPType = null;
            string strAPType = null;
            string strLType = null;
            string strBPBType = null;
            string strD1 = null;
            string strD2 = null;
            string strD3 = null;
            string strD4 = null;
            string strD5 = null;
            string strURL = null;
            string strVerify = null;
            string strSubject = null;

            try
            {
                lock (lckThis)
                {
                    int UserId = Convert.ToInt32(Session["intUser_ID"]);

                    strAction = "Document Verification Status :";
                    strVerify = "You are instructed to upload again the following document/s by the given below url," + "<br/><br/>";
                    //strURL = "http://192.168.152.28:81/sairam/Admissions12/PendingDocuments.aspx?appln=" + lblApplnNo.Text + "&";

                    //------Commented by Rajaprabhu on 02-03-2013
                    //strURL = "http://www.sairamgroup.in/Admissions12/PendingDocuments.aspx?appln=" + lblApplnNo.Text + "&";
                    //-------------
                    //strURL = "http://119.226.68.35:81/sairam/Admissions12/PendingDocuments.aspx?appln=" + lblApplnNo.Text + "&";
                    strSubject = "Document verification for application number : " + lblApplnNo.Text + " reg..";
                    if (trBC.Visible == true)
                    {
                        strBC = rdoBC.SelectedItem.Value;
                        strBType = "Birth Certificate";
                        strAction = strAction + "Birth Certificate Page One: " + rdoBC.SelectedItem.Text + "<br/>";
                        if (rdoBC.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "Birth Certificate Page One" + "<br/>";
                            //strURL = strURL + "TC=1&";
                        }
                        else
                        {
                            //strURL = strURL + "TC=0&";
                        }
                    }
                    else
                    {
                        strBC = "0";
                        //strURL = strURL + "TC=0&";
                    }
                    if (trStuID.Visible == true)
                    {
                        strStuID = rdoStuID.SelectedItem.Value;
                        strSType = "Student ID Card";
                        strAction = strAction + "Student Id Card : " + rdoStuID.SelectedItem.Text + "<br/>";
                        if (rdoStuID.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "Student Id Card " + "<br/>";
                            //strURL = strURL + "TEN=1&";
                        }
                        else
                        {
                            //strURL = strURL + "TEN=0&";
                        }
                    }
                    else
                    {
                        strStuID = "0";
                        //strURL = strURL + "TEN=0&";
                    }
                    if (trRC.Visible == true)
                    {
                        strRC = rdoRC.SelectedItem.Value;
                        strRType = "Ration Card";
                        strAction = strAction + "Ration Card : " + rdoRC.SelectedItem.Text + "<br/>";
                        if (rdoRC.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "Ration Card" + "<br/>";
                            //strURL = strURL + "TWEL=1&";
                        }
                        else
                        {
                            //strURL = strURL + "TWEL=0&";
                        }
                    }
                    else
                    {
                        strRC = "0";
                        //strURL = strURL + "TWEL=0&";
                    }
                    if (trVD.Visible == true)
                    {
                        strVD = rdoVD.SelectedItem.Value;
                        strVType = "Voter ID";
                        strAction = strAction + "Voter ID : " + rdoVD.SelectedItem.Text + "<br/>";
                        if (rdoVD.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "Voter ID" + "<br/>";
                            //strURL = strURL + "TC=1&";
                        }
                        else
                        {
                            //strURL = strURL + "TC=0&";
                        }
                    }
                    else
                    {
                        strVD = "0";
                        //strURL = strURL + "TC=0&";
                    }
                    if (trDD.Visible == true)
                    {
                        strDD = rdoDD.SelectedItem.Value;
                        strDType = "Driving License";
                        strAction = strAction + "Driving License : " + rdoDD.SelectedItem.Text + "<br/>";
                        if (rdoDD.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + " Driving License " + "<br/>";
                            //strURL = strURL + "CC=1&";
                        }
                        else
                        {
                            //strURL = strURL + "CC=0&";
                        }
                    }
                    else
                    {
                        strDD = "0";
                        //strURL = strURL + "CC=0&";
                    }
                    if (trBPB.Visible == true)
                    {
                        strBPB = rdoBPB.SelectedItem.Value;
                        strBPBType = "Bank Pass Book";
                        strAction = strAction + "Bank Pass Book : " + rdoBPB.SelectedItem.Text + "<br/>";
                        if (rdoBPB.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "Bank Pass Book " + "<br/>";
                            //strURL = strURL + "DOT=1&";
                        }
                        else
                        {
                            //strURL = strURL + "DOT=0&";
                        }
                    }
                    else
                    {
                        strBPB = "0";
                        //strURL = strURL + "DOT=0&";
                    }
                    if (trAID.Visible == true)
                    {
                        strAID = rdoAID.SelectedItem.Value;
                        strAType = "Aadhar ID";
                        strAction = strAction + "Aadhar ID : " + rdoAID.SelectedItem.Text + "<br/>";
                        if (rdoAID.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "Aadhar ID" + "<br/>";
                            //strURL = strURL + "DOT=1&";
                        }
                        else
                        {
                            //strURL = strURL + "DOT=0&";
                        }
                    }
                    else
                    {
                        strAID = "0";
                        //strURL = strURL + "DOT=0&";
                    }
                    if (trPC.Visible == true)
                    {
                        strPC = rdoPC.SelectedItem.Value;
                        strPType = "Pan Card";
                        strAction = strAction + "Pan Card : " + rdoPC.SelectedItem.Text + "<br/>";
                        if (rdoPC.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "" + "<br/>";
                            //strURL = strURL + "C1=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C1=0&";
                        }
                    }
                    else
                    {
                        strPC = "0";
                        //strURL = strURL + "C1=0&";
                    }

                    if (trBS.Visible == true)
                    {
                        strBS = rdoBS.SelectedItem.Value;
                        strBSType = "Bonafide-Student";
                        strAction = strAction + "Bonafide-Student : " + rdoBS.SelectedItem.Text + "<br/>";
                        if (rdoBS.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "" + "<br/>";
                            //strURL = strURL + "C1=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C1=0&";
                        }
                    }
                    else
                    {
                        strBS = "0";
                        //strURL = strURL + "C1=0&";
                    }

                    if (trBP.Visible == true)
                    {
                        strBP = rdoBP.SelectedItem.Value;
                        strBPType = "Bonafide-Parent";
                        strAction = strAction + "Bonafide-Parent: " + rdoBP.SelectedItem.Text + "<br/>";
                        if (rdoBP.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "" + "<br/>";
                            //strURL = strURL + "C1=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C1=0&";
                        }
                    }
                    else
                    {
                        strBP = "0";
                        //strURL = strURL + "C1=0&";
                    }

                    if (trAP.Visible == true)
                    {
                        strAP = rdoAP.SelectedItem.Value;
                        strAPType = "Academic Performance";
                        strAction = strAction + "Academic Performance : " + rdoAP.SelectedItem.Text + "<br/>";
                        if (rdoAP.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "" + "<br/>";
                            //strURL = strURL + "C1=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C1=0&";
                        }
                    }
                    else
                    {
                        strAP = "0";
                        //strURL = strURL + "C1=0&";
                    }

                    if (trL.Visible == true)
                    {
                        strL = rdoL.SelectedItem.Value;
                        strLType = "Student Letter";
                        strAction = strAction + "Student Letter : " + rdoL.SelectedItem.Text + "<br/>";
                        if (rdoL.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + "" + "<br/>";
                            //strURL = strURL + "C1=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C1=0&";
                        }
                    }
                    else
                    {
                        strL = "0";
                        //strURL = strURL + "C1=0&";
                    }

                    if (trSp1.Visible == true)
                    {
                        strC1 = rdoC1.SelectedItem.Value;
                        strD1 = lblC1.Text;
                        strAction = strAction + "Certificate 1 : " + rdoC1.SelectedItem.Text + "<br/>";
                        if (rdoC1.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + lblC1.Text + "<br/>";
                            //strURL = strURL + "C1=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C1=0&";
                        }
                    }
                    else
                    {
                        strC1 = "0";
                        //strURL = strURL + "C1=0&";
                    }
                    if (trSp2.Visible == true)
                    {
                        strC2 = rdoC2.SelectedItem.Value;
                        strD2 = lblC2.Text;
                        strAction = strAction + "Certificate 2 : " + rdoC2.SelectedItem.Text + "<br/>";
                        if (rdoC2.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + lblC2.Text + "<br/>";
                            //strURL = strURL + "C2=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C2=0&";
                        }
                    }
                    else
                    {
                        strC2 = "0";
                        //strURL = strURL + "C2=0&";
                    }
                    if (trSp3.Visible == true)
                    {
                        strC3 = rdoC3.SelectedItem.Value;
                        strD3 = lblC3.Text;
                        strAction = strAction + "Certificate 3 : " + rdoC3.SelectedItem.Text + "<br/>";
                        if (rdoC3.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + lblC3.Text + "<br/>";
                            //strURL = strURL + "C3=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C3=0&";
                        }
                    }
                    else
                    {
                        strC3 = "0";
                        //strURL = strURL + "C3=0&";
                    }
                    if (trSp4.Visible == true)
                    {
                        strC4 = rdoC4.SelectedItem.Value;
                        strD4 = lblC4.Text;
                        strAction = strAction + "Certificate 4 : " + rdoC4.SelectedItem.Text + "<br/>";
                        if (rdoC4.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + lblC4.Text + "<br/>";
                            //strURL = strURL + "C4=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C4=0&";
                        }
                    }
                    else
                    {
                        strC4 = "0";
                        //strURL = strURL + "C4=0&";
                    }
                    if (trSp5.Visible == true)
                    {
                        strC5 = rdoC5.SelectedItem.Value;
                        strD5 = lblC5.Text;
                        strAction = strAction + "Certificate 5 : " + rdoC5.SelectedItem.Text + "";
                        if (rdoC5.SelectedItem.Value == "1")
                        {
                            strVerify = strVerify + lblC5.Text + "<br/>";
                            //strURL = strURL + "C5=1&";
                        }
                        else
                        {
                            //strURL = strURL + "C5=0&";
                        }
                    }
                    else
                    {
                        strC5 = "0";
                        //strURL = strURL + "C5=0&";
                    }

                    if (strBType == "Birth Certificate")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strBC, strBType, Session["User_ID"].ToString());
                    }
                    if (strSType == "Student ID Card")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strStuID, strSType, Session["User_ID"].ToString());
                    }
                    if (strRType == "Ration Card")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strRC, strRType, Session["User_ID"].ToString());
                    }
                    if (strVType == "Voter ID")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strVD, strVType, Session["User_ID"].ToString());
                    }
                    if (strDType == "Driving License")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strDD, strDType, Session["User_ID"].ToString());
                    }
                    if (strBPBType == "Bank Pass Book")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strBPB, strBPBType, Session["User_ID"].ToString());
                    }
                    if (strAType == "Aadhar ID")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strAID, strAType, Session["User_ID"].ToString());
                    }
                    if (strPType == "Pan Card")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strPC, strPType, Session["User_ID"].ToString());
                    }

                    if (strBSType == "Bonafide-Student")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strBS, strBSType, Session["User_ID"].ToString());
                    }

                    if (strBPType == "Bonafide-Parent")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strBP, strBPType, Session["User_ID"].ToString());
                    }

                    if (strAPType == "Academic Performance")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strAP, strAPType, Session["User_ID"].ToString());
                    }

                    if (strLType == "Student Letter")
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strL, strLType, Session["User_ID"].ToString());
                    }

                    if (strD1 == lblC1.Text)
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strC1, strD1 + "_sports1", Session["User_ID"].ToString());
                    }
                    if (strD2 == lblC2.Text)
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strC2, strD2 + "_sports2", Session["User_ID"].ToString());
                    }
                    if (strD3 == lblC3.Text)
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strC3, strD3 + "_sports3", Session["User_ID"].ToString());
                    }
                    if (strD4 == lblC4.Text)
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strC4, strD4 + "_sports4", Session["User_ID"].ToString());
                    }
                    if (strD5 == lblC5.Text)
                    {
                        UpdateVerificationStatus(lblApplnNo.Text, strC5, strD5 + "_sports5", Session["User_ID"].ToString());
                    }
                    if (strBC == "1" || strStuID == "1" || strRC == "1" || strVD == "1" || strDD == "1" || strBPB == "1" || strAID == "1" || strPC == "1" || strBS == "1"
                       || strBP == "1" || strAP == "1" || strL == "1" || strC1 == "1" || strC2 == "1" || strC3 == "1" || strC4 == "1" || strC5 == "1")
                    {
                        if (con.State != ConnectionState.Open)
                        {
                            con.Open();
                        }
                        strQuery = "Update t_Registration_Process set status='Registered',IsVerify='1',IsUpload_Status='1',";
                        strQuery = strQuery + " Verifed_Date = '" + DateTime.Now.ToString() + "'";

                        strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'";
                        cmd = new SqlCommand(strQuery, con);
                        cmd.ExecuteNonQuery();

                        string strText = "Verification Faild due to following Document Not Varified : <b> " + InvaildType + " </b> has been Verified by <b> " + Session["User_ID"].ToString() + " </b>";
                        objApprove.UpdateHistory(lblApplnNo.Text, strText, "Document Verification ", Session["User_ID"].ToString());
                        dvform.Visible = false;
                        dvSuccess.Visible = true;

                        lblSuccess.Text = "Document Verification Partially completed for Application No : " + lblApplnNo.Text;
                        Response.Write("<script>window.open('DocumentVerification.aspx',target='_top');</script>");
                    }
                    else
                    {
                        if (con.State != ConnectionState.Open)
                        {
                            con.Open();
                        }
                        strQuery = "Update t_Registration_Process set status='Registered',IsVerify='0',IsUpload_Status='0',Verified_By='" + UserId + "',";
                        strQuery = strQuery + " Verifed_Date = '" + DateTime.Now.ToString() + "'";

                        strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'";
                        cmd = new SqlCommand(strQuery, con);
                        cmd.ExecuteNonQuery();

                        string strText = "Documents are Verified after ReUploaded by <b> " + Session["User_ID"].ToString() + " </b>";
                        objApprove.UpdateHistory(lblApplnNo.Text, strText, "ReVerification (Invaild) Document ", Session["User_ID"].ToString());

                        dvform.Visible = false;
                        dvSuccess.Visible = true;

                        lblSuccess.Text = "Document Verification completed succesfully thank you!";
                        Response.Write("<script>window.open('DocumentVerification.aspx',target='_top');</script>");
                    }
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
                objApprove = null;
               // objEmail = null;
                dsData = null;
                dsStudent = null;
            }
        }

        protected void UpdateVerificationStatus(string strApplicationNo, string strValue, string strtype, string userID)
        {
            clsApproval objApprove = new clsApproval();
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
                if (strValue == "1")
                {
                    SqlCmd.CommandText = "USP_Update_UploadDocument1";
                    if (strtype == lblC1.Text + "_sports1")
                    {
                        string jk = strtype;
                        string sp1 = jk.Substring(0, jk.Length - 8);
                        string sp2 = jk.Substring(sp1.Length + 1, 7);
                        InvaildType = InvaildType + sp1 + ",";
                    }
                    else if (strtype == lblC2.Text + "_sports2")
                    {
                        string jk = strtype;
                        string sp1 = jk.Substring(0, jk.Length - 8);
                        string sp2 = jk.Substring(sp1.Length + 1, 7);
                        InvaildType = InvaildType + sp1 + ",";
                    }
                    else if (strtype == lblC3.Text + "_sports3")
                    {
                        string jk = strtype;
                        string sp1 = jk.Substring(0, jk.Length - 8);
                        string sp2 = jk.Substring(sp1.Length + 1, 7);
                        InvaildType = InvaildType + sp1 + ",";
                    }
                    else if (strtype == lblC4.Text + "_sports4")
                    {
                        string jk = strtype;
                        string sp1 = jk.Substring(0, jk.Length - 8);
                        string sp2 = jk.Substring(sp1.Length + 1, 7);
                        InvaildType = InvaildType + sp1 + ",";
                    }
                    else if (strtype == lblC5.Text + "_sports5")
                    {
                        string jk = strtype;
                        string sp1 = jk.Substring(0, jk.Length - 8);
                        string sp2 = jk.Substring(sp1.Length + 1, 7);
                        InvaildType = InvaildType + sp1 + ",";
                    }
                    else
                    {
                        InvaildType = InvaildType + strtype + ",";
                    }

                }
                else
                {
                    SqlCmd.CommandText = "USP_Update_UploadDocument";
                }
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Parameters.Add(new SqlParameter("@Application_Id", strApplicationNo));
                SqlCmd.Parameters.Add(new SqlParameter("@DocumentType", strtype));
                SqlCmd.Connection = sqlConn;
                intRegistrationID = Convert.ToInt32(SqlCmd.ExecuteScalar());
                SqlCmd.Dispose();

            }
            catch (Exception ex)
            {

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
                    //DivStatelbl.Attributes.CssStyle.Add("Display", "none");
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
                    //DivStatelbl.Attributes.CssStyle.Add("Display", "block");
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
                    //DivStatelbl.Attributes.CssStyle.Add("Display", "block");
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
                    // trDistrict.Attributes.CssStyle.Add("Display", "block");
                    //DivDistrictlbl.Attributes.CssStyle.Add("Display", "block");
                    divddlDistrict.Attributes.CssStyle.Add("Display", "block");
                    divtxtDistrict.Attributes.CssStyle.Add("Display", "none");
                    rfvddlDistrict.Enabled = true;
                    rfvtxtDistrict.Enabled = false;
                    txtDistrict.Text = "";
                }
                else
                {
                    //District
                    //trDistrict.Attributes.CssStyle.Add("Display", "block");
                    // DivDistrictlbl.Attributes.CssStyle.Add("Display", "block");
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
                //trDistrict.Attributes.CssStyle.Add("Display", "none");
                //DivDistrictlbl.Attributes.CssStyle.Add("Display", "none");
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
                //trDistrict.Attributes.CssStyle.Add("Display", "block");
                //DivDistrictlbl.Attributes.CssStyle.Add("Display", "block");
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

        protected void ChkInstitutionSaiRam_OnCheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (ChkInstitutionSaiRam.Checked == true)
                {
                    divInstitutionSaiRam.Visible = true;
                    rfInstitutionSaiRam.Enabled = true;
                    rftxtInstitution.Enabled = false;
                    //regEvInstitution.Enabled = false;
                }
                else
                {
                    divInstitutionSaiRam.Visible = false;
                    rfInstitutionSaiRam.Enabled = false;
                    rftxtInstitution.Enabled = true;
                    //regEvInstitution.Enabled = true;
                }
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
                    dvBoardOthers.Visible = true;
                    reqBoardOthers.Enabled = true;
                }
                else
                {
                    dvBoardOthers.Visible = false;
                    reqBoardOthers.Enabled = false;
                    txtBoardOthers.Text = "";
                }

            }
            catch (Exception ex)
            {
                lblError.Text = "Error in Board Selection : " + ex.Message.ToString();
            }
        }

        public void fncBindIssuedAmount(string AadhaarID, string Pan_ID)
        {
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
                SqlCmd = new SqlCommand("GetPreviousIssuedAmountDetails_ByAadhaarId", con);
                SqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCmd.Parameters.Add(new SqlParameter("@AadhaarID", AadhaarID));
                SqlCmd.Parameters.Add(new SqlParameter("@Pan_ID", Pan_ID));
                da = new SqlDataAdapter(SqlCmd);
                da.Fill(ds);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    gvDisplayPreviousScholarshipDetails.DataSource = ds;
                    gvDisplayPreviousScholarshipDetails.DataBind();
                    //for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    //{
                    //    if (ds.Tables[0].Rows[i]["ScholarshipYear_Code"].ToString() != "Total")
                    //    {
                    //        strAlready = strAlready + ds.Tables[0].Rows[i]["ScholarshipYear_Code"].ToString() + ",";
                    //    }
                    //}

                    //lblAlreadyApplied.Text = strAlready.TrimEnd(',');
                }
                else
                {
                    //lblAlreadyApplied.Text = "----";
                    gvDisplayPreviousScholarshipDetails.DataSource = ds;
                    gvDisplayPreviousScholarshipDetails.DataBind();
                }
                lblAlreadyApplied.Text = objCommon.GetPreviousScholorshipApplied(AadhaarID, Pan_ID);
            }
            catch (Exception ex)
            {
                lblError.Text = "Error in issued amount details : " + ex.Message.ToString();
            }
        }

    }
}
