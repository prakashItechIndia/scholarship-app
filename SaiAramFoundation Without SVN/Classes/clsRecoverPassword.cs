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
using Sairam_RegularUG.Classes;

namespace SaiAramFoundation.Classes
{
    public class clsRecoverPassword
    {
        clsCommon objCommon = null;
        SqlConnection connSql = null;
        SqlParameter[] Params = null;
        string strQuery = null;

        string strUserID = null;
        string strUsername = null;
        string strPassword = null;
        string strEmailID = null;

        public bool RecoverPwd(string strUserName)
        {
            objCommon = new clsCommon();
            Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                SqlCommand sqlCommand = new SqlCommand();
                sqlCommand.CommandText = "RecoverPassword";
                sqlCommand.CommandType = CommandType.StoredProcedure;

                // Use connection object of base class
                sqlCommand.Connection = connSql;

                sqlCommand.Parameters.Add(new SqlParameter("@User_Name", strUserName));

                if (connSql.State != ConnectionState.Open)
                    connSql.Open();

                using (SqlDataReader rdr = sqlCommand.ExecuteReader(CommandBehavior.CloseConnection))
                {
                    if (rdr.Read())
                    {
                        strUsername = rdr.GetString(rdr.GetOrdinal("User_Name"));
                        strPassword = rdr.GetString(rdr.GetOrdinal("User_Pwd"));
                        strEmailID = rdr.GetString(rdr.GetOrdinal("Email_ID"));
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                    rdr.Close();
                }

                //strQuery = " Select ID, User_ID, Password from tbl_UserMaster ";
                //strQuery = strQuery + " where User_ID = '"+ strUserName +"'  and IsActive = 'True'";

                //Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                //dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                //return dsData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                objCommon = null;
                connSql = null;
                strQuery = null;
            }
        }

        public DataSet GetUserDetails(string strUserID)
        {
            objCommon = new clsCommon();
            Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, User_ID, Email_ID, Designation, Phone_Number from tbl_User_Details ";
                strQuery = strQuery + " where User_ID = '" + strUserID + "'  and IsActive = 'True'";

                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                return dsData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                objCommon = null;
                connSql = null;
                strQuery = null;
            }
        }
    }
}
