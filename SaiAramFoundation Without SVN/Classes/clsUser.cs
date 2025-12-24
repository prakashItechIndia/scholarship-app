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
    public class clsUser
    {
        clsCommon objCommon = new clsCommon();
        public DataSet ValidateUserLogin(string strUsername, string strPassword)
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
                sqlCommand.CommandText = "ValidateUser";
                sqlCommand.CommandType = CommandType.StoredProcedure;

                // Use connection object of base class
                sqlCommand.Connection = connSql;

                sqlCommand.Parameters.Add(new SqlParameter("@USER_ID", strUsername));
                sqlCommand.Parameters.Add(new SqlParameter("@PASSWORD", strPassword));

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
                strQuery = strQuery + " From Tbl_UserMaster";
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
                strQuery = strQuery + " From Tbl_UserMaster";
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

        public DataSet GetStudentDetails(string strApplnNo)
        {
            string strQuery;
            DataSet dsData = new DataSet();
            string strConnectionString = objCommon.GetConnectionString();
            SqlConnection connSql = new SqlConnection(strConnectionString);
            SqlParameter[] Params = new SqlParameter[1];
            try
            {
                strQuery = "Select ID, FullName, DOB, Gender, Religion, Community, Mother_Tongue, Blood_Group, Address_Correspondence, ";
                strQuery = strQuery + " City, State, Country, Postal_Code, Mobile_Number, Landline_Number, Email_ID, Parent_Name, Relationship_Candiate,";
                strQuery = strQuery + " Parent_PhoneNumber, Parents_Occupation, Marks, School_Name, RevisionTest_Physics, RevisionTest_Chemistry,";
                strQuery = strQuery + " RevisionTest_Maths, RevisionTest_Total, Registration_Number, School_Address, Examination_Appeared,";
                strQuery = strQuery + " Physics_Marks, Chemistry_Marks, Maths_Marks, Total_Marks, Pmonth, PYear, Medium_Instruction,";
                strQuery = strQuery + " XII_Board, Apply_AIEE, Curricular_Activity, BloodRelation_SSEC, First_Preference, Second_Preference,";
                strQuery = strQuery + " Third_Preference, Admission_Add, Data_Date, College_Name, Degree, Department, Approval_Status,";
                strQuery = strQuery + " Approved_By, Approved_Date, IsUpdated";
                strQuery = strQuery + " From Tbl_Registration";
                strQuery = strQuery + " Where ID = '" + strApplnNo + "'";

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

        public void AllocateStudentAdmission(string strApplnNo, string strDegree, string strDept, string strCollege)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update Tbl_Registration Set ";
                strQuery = strQuery + " Degree = '" + strDegree + "', Department = '" + strDept + "', College_Name = '" + strCollege + "', IsUpdated = 'true' ";
                strQuery = strQuery + " Where ID = '"+ strApplnNo +"' ";

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

        public void AllocateLateralAdmission(string strApplnNo, string strDept, string strCollege)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update Tbl_LE_Registration Set ";
                strQuery = strQuery + " Approval_Status = '3', Dept_Approved = '" + strDept + "', College_Name = '" + strCollege + "', IsUpdated = 'true' ";
                strQuery = strQuery + " Where ID = '" + strApplnNo + "' ";

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
                strQuery = "insert into Tbl_UserMaster( ";
                strQuery = strQuery + " User_ID, Password, Password_change, User_Type, IsActive, IsDeleted, ";
                strQuery = strQuery + " Created_Date, Created_By) Values('"+ strUsername +"', ";
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

        public void UpdateNewPassword(string strUsername, string strPassword, string strModifiedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update Tbl_UserMaster Set ";
                strQuery = strQuery + " Password ='" + strPassword + "', Password_change = 'False', ";
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
                strQuery = "Update Tbl_UserMaster Set ";
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


        public DataSet DisplayUsers()
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select";
                strQuery = strQuery + " Tbl_UserMaster.[User_ID], Tbl_UserMaster.User_Type, ";
                strQuery = strQuery + " Tbl_User_Details.Designation, Tbl_User_Details.Email_ID, ";
                strQuery = strQuery + " case Tbl_UserMaster.IsActive when 'True' then 'Active' when 'False' then 'Blocked' end As [Status] ";
                strQuery = strQuery + " From Tbl_UserMaster INNER JOIN ";
                strQuery = strQuery + " Tbl_User_Details ON Tbl_UserMaster.ID = Tbl_User_Details.[User_ID]";
                strQuery = strQuery + " where User_Type != 'Webmaster'";

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

        public DataSet UserDetails(string strUserID)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select Tbl_UserMaster.[ID] As [ID],";
                strQuery = strQuery + " Tbl_UserMaster.[User_ID] As [User_ID], Tbl_UserMaster.Password As [Password], ";
                strQuery = strQuery + " Tbl_User_Details.FirstName As [FirstName], Tbl_User_Details.LastName As [LastName],";
                strQuery = strQuery + " Tbl_User_Details.Address As [Address],";
                strQuery = strQuery + " Tbl_User_Details.City As [City], Tbl_User_Details.State As [State],";
                strQuery = strQuery + " Tbl_User_Details.Pincode As [Pincode], Tbl_User_Details.Country As [Country],";
                strQuery = strQuery + " Tbl_User_Details.Phone_Number As [Phone_Number], Tbl_User_Details.Email_ID As [Email_ID],";
                strQuery = strQuery + " Tbl_User_Details.Designation As [Designation], Tbl_User_Details.IsActive As [IsActive],";
                strQuery = strQuery + " Tbl_User_Details.IsDeleted As [IsDeleted] From Tbl_UserMaster Inner Join";
                strQuery = strQuery + " Tbl_User_Details ON Tbl_UserMaster.ID = Tbl_User_Details.[User_ID]";
                strQuery = strQuery + " where Tbl_UserMaster.[User_ID]='" + strUserID + "'";

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

                strQuery = " Select ID, User_ID, Password, Password_Change, User_Type";
                strQuery = strQuery + " From Tbl_UserMaster ";
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

        public void UpdateAdminDetails(string strUsername, string strFirstName, string strContactNo, string strEmailID, string strDesignation, string strModifiedBy)
        {
            clsCommon objCommon = new clsCommon();
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update Tbl_User_Details Set ";
                strQuery = strQuery + " FirstName = '" + strFirstName + "',";
                strQuery = strQuery + " Phone_Number = '"+ strContactNo +"',";
                strQuery = strQuery + " Email_ID = '"+ strEmailID +"', Designation = '"+ strDesignation +"',";
                strQuery = strQuery + " IsActive = 'True', IsDeleted = 'False', ";
                strQuery = strQuery + " Modified_Date = '" + DateTime.Now.ToString() + "', Modified_By = '" + strModifiedBy + "'";
                strQuery = strQuery + " Where User_ID = '" + strUsername + "' ";

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

        public void InsertAdminDetails(string strUserID, string strFirstName, string strContactNo, string strEmailID, string strDesignation, string strCreatedBy)
        {
            clsCommon objCommon = new clsCommon();
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Insert InTo Tbl_User_Details( ";
                strQuery = strQuery + " User_ID, FirstName,";
                strQuery = strQuery + " Phone_Number, Email_ID, Designation, IsActive, IsDeleted, ";
                strQuery = strQuery + " Created_Date, Created_By) Values";
                strQuery = strQuery + " ('" + strUserID + "', '" + strFirstName + "', ";
                strQuery = strQuery + " '" + strContactNo + "', '" + strEmailID + "', '" + strDesignation + "', 'True',";
                strQuery = strQuery + " 'False', '" + DateTime.Now.ToString() + "', '" + strCreatedBy + "')";

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
    }
}
