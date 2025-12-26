using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using SaiAramFoundation.Classes;

namespace SaiAramFoundation
{
    public partial class HomeMaster : System.Web.UI.MasterPage
    {
        static public string strConnString = System.Configuration.ConfigurationManager.AppSettings["Main.ConnectionString"].ToString();
        SqlConnection con = new SqlConnection(strConnString);
        SqlCommand cmd = null;
        DataSet ds = null;
        SqlDataAdapter da = null;
        clsCommon objCommon = new clsCommon();
        StringBuilder sb = new StringBuilder();

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (!IsPostBack)
                {                 
                    BindMenu();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void BindMenu()
        {          
            string strScreen = "";
            DataSet dsMenu = new DataSet();
            int intRoldID=0;
            try
            {
                if (Session["Roles_Id"] != null)
                {
                    intRoldID = Convert.ToInt32(Session["Roles_Id"]);
                    dsMenu = GetScreenBasedRole(intRoldID);
                    if (dsMenu != null)
                    {
                        if (dsMenu.Tables.Count > 0)
                        {
                            // sb.Append("<a class='togglemenu'></a>");
                            sb.Append("<ul  class='nav navbar-nav'>");

                            for (int iScreen = 0; iScreen < dsMenu.Tables[0].Rows.Count; iScreen++)
                            {
                                strScreen = dsMenu.Tables[0].Rows[iScreen]["Screen_Name"].ToString();
                                    // sb.Append("<li><a href=" + dsMenu.Tables[0].Rows[iScreen]["URL"].ToString() + ">" + strScreen + "</a></li>");
                                    // sb.Append("<li><a href='<%=ResolveUrl(" + dsMenu.Tables[0].Rows[iScreen]["URL"].ToString() + ")%>'" + ">" + strScreen + "</a></li>");
                                    //  sb.Append("<li><a href='../../" + dsMenu.Tables[0].Rows[iScreen]["URL"].ToString() + "'>" + strScreen + "</a></li>");
                                    // sb.Append("<li><a href='pzone/../../" + dsMenu.Tables[0].Rows[iScreen]["URL"].ToString() + "'>" + strScreen + "</a></li>");
                                    //  sb.Append("<li><a href='"+ Server.MapPath(".")+ "/" + dsMenu.Tables[0].Rows[iScreen]["URL"].ToString() + "'>" + strScreen + "</a></li>");

                                sb.Append("<li class='active'><a href='" + ("/" + dsMenu.Tables[0].Rows[iScreen]["URL"].ToString()) + "'>" + strScreen + "</a></li>");
                                                         
                            }
                        }
                        sb.Append("</ul>");                      
                        }
                    }
                else
                {
                    Response.Redirect("Login.aspx");
                }
                menu.InnerHtml = sb.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSet GetScreenBasedRole(int intRoleId)
        {
            string strConnectionString = objCommon.GetConnectionString();
            SqlConnection connSql = new SqlConnection(strConnectionString);
            string strResult = null;
            try
            {
                SqlCommand sqlCommand = new SqlCommand();
                sqlCommand.CommandText = "USP_GetScreens";
                sqlCommand.CommandType = CommandType.StoredProcedure;
                // Use connection object of base class
                sqlCommand.Connection = connSql;
                sqlCommand.Parameters.Add(new SqlParameter("@RoleID", intRoleId));

                if (connSql.State != ConnectionState.Open)
                    connSql.Open();
                DataSet ds = new DataSet();
                SqlDataAdapter da = new SqlDataAdapter(sqlCommand);
                da.Fill(ds);
                return ds;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                //Params = null;
                //dsData = null;
                //strQuery = null;
            }
        }
    }
}
