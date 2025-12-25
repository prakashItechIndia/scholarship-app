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


namespace SaiAramFoundation
{
    public partial class ScholarshipUpdateBank : System.Web.UI.Page
    {
        static public string strConnString = ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet dsData = null;
        SqlDataAdapter da = null;
        string strQuery = "";
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
                    }
                }
                else
                {
                    Response.Redirect("Login.aspx");
                }
            }
            catch (Exception ex)
            {                
                lblError.Text=ex.Message;
            }
                    
        }

        public void PopulateData()
        {
            
            cmd = new SqlCommand();
            dsData = new DataSet();
            try
            {
                lblApplnNo.Text = Request.QueryString["applnno"].ToString();

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
                cmd.Parameters.Add(new SqlParameter("@Process_Type", "Completed"));           
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);              

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    lblName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                    lblApplnNo.Text = dsData.Tables[0].Rows[0]["Application_Id"].ToString();
                    lblDOB.Text = dsData.Tables[0].Rows[0]["Date_Of_Birth"].ToString();
                    lblScNo.Text = dsData.Tables[0].Rows[0]["Scholarship_No"].ToString();
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
                    lblSuggestedAmt.Text = dsData.Tables[0].Rows[0]["Scholarship_Suggest_Amount"].ToString();
                    lblApprovedAmt.Text = dsData.Tables[0].Rows[0]["Scholarship_Approved_Amount"].ToString();
                    lblAccountNo.Text = dsData.Tables[0].Rows[0]["Scholarship_Issued_AccNo"].ToString();
                    lblChequeno.Text = dsData.Tables[0].Rows[0]["DDCheque_No"].ToString();
                    lblAmountIssued.Text = dsData.Tables[0].Rows[0]["Scholarship_Issued_Amount"].ToString();


                    lblDateOfIssue.Text = dsData.Tables[0].Rows[0]["Scholarship_Issued_Date"].ToString();
                    ddlBankName.SelectedValue = dsData.Tables[0].Rows[0]["Bank_Name"].ToString();
                    txtBranch.Text = dsData.Tables[0].Rows[0]["Bank_Branch"].ToString();
                    
                    
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

        protected void btnUpdate_Click(object sender, EventArgs e)
        {
            cmd = new SqlCommand();
            clsApproval objApprove = new clsApproval();
            try
            {
                if (con.State != ConnectionState.Open)
                {
                    con.Open();
                }
                 strQuery = "Update t_Registration set Bank_Branch = '"+txtBranch.Text.ToString()+"',";
                 strQuery = strQuery + " Bank_Name = '"+ddlBankName.SelectedValue.ToString()+"', ";
                 strQuery = strQuery + " Update_Date = '" + DateTime.Now.ToString() + "'";
                 strQuery = strQuery + " where Application_Id='" + Request.QueryString["applnno"].ToString().Trim().ToString() + "'";
                 cmd = new SqlCommand(strQuery,con);
                 cmd.ExecuteNonQuery();

                 string strText = "Bank detail has been updated by " +Session["User_ID"].ToString();
                 objApprove.UpdateHistory(lblApplnNo.Text, strText, "Bank detail updated", Session["User_ID"].ToString());
                
                dvform.Visible = false;
                dvSuccess.Visible = true;

                lblSuccess.Text = "Process completed succesfully thak you!";
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
    }
}
