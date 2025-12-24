using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using SaiAramFoundation.Classes;
using System.Data;
using System.Configuration;

namespace SaiAramFoundation
{
    public partial class PrintDetails : System.Web.UI.Page
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
                if (!IsPostBack)
                {
                    PopulateData();
                }
            }
            catch (Exception ex)
            {

                throw ex;
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

                //lblAppNo.Text = Request.QueryString["applnno"].ToString();
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
                cmd.Parameters.Add(new SqlParameter("@Process_Type", ""));
                cmd.Parameters.Add(new SqlParameter("@Scholarship_Id", Request.QueryString["ScholarshipId"].ToString().Trim().ToString()));
                da = new SqlDataAdapter(cmd);
                da.Fill(dsData);

                if (dsData.Tables[0].Rows.Count > 0)
                {
                    lblSchlorshipYear.Text = dsData.Tables[0].Rows[0]["ScholarshipYear_Name"].ToString();
                    lblName.Text = dsData.Tables[0].Rows[0]["Applicant_Name"].ToString();
                    lblAppNo.Text = dsData.Tables[0].Rows[0]["Application_Id"].ToString();
                    lblChequeNo.Text = dsData.Tables[0].Rows[0]["DDCheque_No"].ToString();
                    lblCIFO.Text = dsData.Tables[0].Rows[0]["DDCheque_In_Favor"].ToString();
                    lblChequeDate.Text = dsData.Tables[0].Rows[0]["Scholarship_Issued_Date"].ToString();
                    lblChequeAmount.Text = dsData.Tables[0].Rows[0]["Scholarship_Issued_Amount"].ToString();
                    lblSIN.Text = dsData.Tables[0].Rows[0]["Scholarship_No"].ToString();
                    lblPreparedBy.Text = dsData.Tables[0].Rows[0]["Prepared_By"].ToString();
                    lblVerifiedBy.Text = dsData.Tables[0].Rows[0]["Verified_By"].ToString();

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

    }
}
