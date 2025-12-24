using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using Sairam_RegularUG.Classes;
using System.Data;
namespace SaiAramFoundation.Classes
{
    public class clsadmin
    {
       
          clsCommon objCommon = new clsCommon();
          public string ValidateUserLogin(string strUsername, string strPassword)
          {
              //string strQuery;
              //DataSet dsData = new DataSet();
              string strConnectionString = objCommon.GetConnectionString();
              SqlConnection connSql = new SqlConnection(strConnectionString);
              //SqlParameter[] Params = new SqlParameter[1];
              string strResult = null;
              try
              {
                  SqlCommand sqlCommand = new SqlCommand();
                  sqlCommand.CommandText = "ValidateCAdmin";
                  sqlCommand.CommandType = CommandType.StoredProcedure;

                  // Use connection object of base class
                  sqlCommand.Connection = connSql;

                  sqlCommand.Parameters.Add(new SqlParameter("@User_ID", strUsername));
                  sqlCommand.Parameters.Add(new SqlParameter("@Password", strPassword));

                  if (connSql.State != ConnectionState.Open)
                      connSql.Open();

                  using (SqlDataReader rdr = sqlCommand.ExecuteReader(CommandBehavior.CloseConnection))
                  {
                      if (rdr.Read())
                      {
                          strResult = rdr.GetString(rdr.GetOrdinal("User_Type"));
                      }
                      else
                      {
                          strResult = "Invalid User";
                      }
                      rdr.Close();
                  }

                  //strQuery = "Select User_ID, Password, User_Type, IsActive ";
                  //strQuery = strQuery + " From Tbl_UserMaster";
                  //strQuery = strQuery + " Where User_ID = '" + strUsername + "' and";
                  //strQuery = strQuery + " Password = '" + strPassword + "'";

                  //Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                  //dsData = SqlHelper.ExecuteDataset(strConnectionString, CommandType.StoredProcedure, "sp_ExecuteSql", Params);

                  //if (dsData.Tables[0].Rows.Count > 0)
                  //{
                  //    bool strBoolean = Convert.ToBoolean(dsData.Tables[0].Rows[0]["IsActive"].ToString());
                  //    if (strBoolean == true)
                  //    {
                  //        strResult = dsData.Tables[0].Rows[0]["User_Type"].ToString();
                  //    }
                  //    else
                  //    {
                  //        strResult = "User Blocked";
                  //    }
                  //}
                  //else
                  //{
                  //    strResult = "Invalid User";
                  //}
                  return strResult;
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

          public string ChangePassword(string strUsername)
          {
              string strQuery;
              DataSet dsData = new DataSet();
              string strConnectionString = objCommon.GetConnectionString();
              SqlConnection connSql = new SqlConnection(strConnectionString);
              SqlParameter[] Params = new SqlParameter[1];
              string strPasswordStatus = null;
              try
              {
                  strQuery = "Select User_ID, Password, Password_Change, User_Type, IsActive ";
                  strQuery = strQuery + " From T_Cadmin_Login";
                  strQuery = strQuery + " Where User_ID = '" + strUsername + "'";

                  Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                  dsData = SqlHelper.ExecuteDataset(strConnectionString, CommandType.StoredProcedure, "sp_ExecuteSql", Params);

                  if (dsData.Tables[0].Rows.Count > 0)
                  {
                      strPasswordStatus = dsData.Tables[0].Rows[0]["Password_Change"].ToString();
                  }
                  else
                  {
                      strPasswordStatus = "Invalid User";
                  }
                  return strPasswordStatus;
              }
              catch (Exception ex)
              {
                  throw new Exception(ex.Message);
              }
              finally
              {
                  Params = null;
                  dsData = null;
                  strQuery = null;
              }
          }

          public DataSet ValidateChangePassword(string strUsername)
          {
              string strQuery;
              DataSet dsData = new DataSet();
              string strConnectionString = objCommon.GetConnectionString();
              SqlConnection connSql = new SqlConnection(strConnectionString);
              SqlParameter[] Params = new SqlParameter[1];
              try
              {
                  strQuery = "Select User_ID, Password COLLATE Latin1_general_CS_AS As Password, Password_Change, User_Type, IsActive ";
                  strQuery = strQuery + " From T_Cadmin_Login";
                  strQuery = strQuery + " Where User_ID = '" + strUsername + "'";

                  Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                  dsData = SqlHelper.ExecuteDataset(strConnectionString, CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                  return dsData;
              }
              catch (Exception ex)
              {
                  throw new Exception(ex.Message);
              }
              finally
              {
                  Params = null;
                  dsData = null;
                  strQuery = null;
              }
          }

            

       

        public void CreateUser(string strUsername, string strPassword, string strUserType,string strDept, string strCreatedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());
               
            try
            {
                strQuery = "insert into T_Cadmin_Login( ";
                strQuery = strQuery + " User_ID, Password, User_Type,Department, IsActive, IsDeleted, ";
                strQuery = strQuery + " Created_Date, Created_By) Values('"+ strUsername +"', ";
                strQuery = strQuery + " '" + strPassword + "', 'True', '" + strUserType + "','" + strDept + "', ";
                strQuery = strQuery + " 'True', 'False', '" + DateTime.Now.ToString() + "', '" + strCreatedBy + "')";

                if (connSql.State != ConnectionState.Open)
                    connSql.Open();
                    cmdSql = new SqlCommand(strQuery, connSql);
                    cmdSql.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                cmdSql = null;
                strQuery = null;
            }
        }

        public void UpdateNewPassword(string strUsername, string strPassword, string strModifiedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update T_Cadmin_Login Set ";
                strQuery = strQuery + " Password ='" + strPassword + "',";
                strQuery = strQuery + " Modified_Date = '" + DateTime.Now.ToString() + "', Modified_By = '" + strModifiedBy + "' ";
                strQuery = strQuery + " Where User_ID = '" + strUsername + "'";

                if (connSql.State != ConnectionState.Open)
                    connSql.Open();
                cmdSql = new SqlCommand(strQuery, connSql);
                cmdSql.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                cmdSql = null;
                strQuery = null;
            }
        }

        public void UpdateUserStatus(string strUsername, string strToggle, string strModifiedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update T_Cadmin_login Set ";
                if (strToggle == "Checked")
                {
                    strQuery = strQuery + " IsActive = 'True', IsDeleted = 'False', ";
                }
                if (strToggle == "Unchecked")
                {
                    strQuery = strQuery + " IsActive = 'False', IsDeleted = 'True', ";
                }

                strQuery = strQuery + " Modified_Date = '" + DateTime.Now.ToString() + "', Modified_By = '" + strModifiedBy + "'";
                strQuery = strQuery + " Where User_ID = '"+ strUsername +"' ";

                if (connSql.State != ConnectionState.Open)
                    connSql.Open();
                cmdSql = new SqlCommand(strQuery, connSql);
                cmdSql.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                cmdSql = null;
                strQuery = null;
            }
        }

        public void CreateUser(string strUsername, string strPassword, string strUserType, string strCreatedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "insert into T_Cadmin_Login( ";
                strQuery = strQuery + " User_ID, Password, Password_change, User_Type, IsActive, IsDeleted, ";
                strQuery = strQuery + " Created_Date, Created_By) Values('" + strUsername + "', ";
                strQuery = strQuery + " '" + strPassword + "', 'True', '" + strUserType + "', ";
                strQuery = strQuery + " 'True', 'False', '" + DateTime.Now.ToString() + "', '" + strCreatedBy + "')";

                if (connSql.State != ConnectionState.Open)
                    connSql.Open();
                cmdSql = new SqlCommand(strQuery, connSql);
                cmdSql.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                cmdSql = null;
                strQuery = null;
            }
        }
       

      

        public DataSet GetUserDetails(string strUserID)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, User_ID, Password, User_Type";
                strQuery = strQuery + " From T_Cadmin_Login ";
                strQuery = strQuery + " where User_ID='" + strUserID + "'";

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
