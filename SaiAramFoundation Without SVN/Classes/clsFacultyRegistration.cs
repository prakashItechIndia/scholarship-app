using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using Sairam_RegularUG.Classes;
using System.Data;

namespace SaiAramFoundation.Classes
{

    public class clsFacultyRegistration
    {
        clsCommon objCommon = new clsCommon();
        public DataSet GetJobPosts()
        {
            string strQuery;


            DataSet dSData = new DataSet();
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());
            SqlDataAdapter da;
            try
            {
                // strQuery = "usp_getAllJobPosts";
                strQuery = "SELECT [POST_ID],[POST_NAME],[POST_DESCRIPTION],[IS_DELETED],[IS_ACTIVE] FROM [T_JOB_POST] where IS_DELETED=0 and IS_ACTIVE=1";
                if (connSql.State != ConnectionState.Open)
                {
                    connSql.Open();
                }
                //  cmdSql = new SqlCommand(strQuery, connSql);
                da = new SqlDataAdapter(strQuery, connSql);
                da.Fill(dSData);
                return dSData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

                strQuery = null;

            }
        }

        public string InsertFacutyRegistration(string Title,
        string Surname,
        string Firstname,
        string Lastname,
        string Dept_Applied_For,
        string Subject,
        int Post_Applied_For,
        string Other_Post_Applied_For,
        string Address_Line1,
        string Address_Line2,
        string City,
        string District,
        string State,
        string Pincode,
        string Maritial_Status,
        string Spousename,
        int No_of_Child,
        string Fathername,
        string Mothername,
        string Landline_No,
        string Mobile_No,
        string Email,
        string Gender,
        string Religion,
        string Community,
        string PAN_No,
        string PAN_Reason,
        string Passport_No,
        string Passport_Reason,
        string DOB,
        string Present_College,
        string Present_Department,
        string Present_Designation,
        string GATE_Score,
        string NET_SLET_Score,
        string PHD_Thesis_Titile
        , string PHD_Faculty
           , string Other_Contributions
           , string Publications, string Photo_Path, string Resume_path, DataTable dtEducation, DataTable dtAcademic, DataTable dtIndustrial, DataTable dtSubjects
            )
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());
            SqlTransaction objTran;
            if (connSql.State != ConnectionState.Open)
                connSql.Open();
            objTran = connSql.BeginTransaction();
            string strReg_No;
            try
            {
                cmdSql = new SqlCommand();
                strQuery = "usp_insert_Faculty_Registration";
                cmdSql.CommandText = strQuery;
                cmdSql.Connection = connSql;
                cmdSql.CommandType = CommandType.StoredProcedure;
                cmdSql.Transaction = objTran;

                cmdSql.Parameters.AddWithValue("@Title", Title);
                cmdSql.Parameters.AddWithValue("@Surname", Surname);
                cmdSql.Parameters.AddWithValue("@Firstname", Firstname);
                cmdSql.Parameters.AddWithValue("@Lastname", Lastname);
                cmdSql.Parameters.AddWithValue("@Dept_Applied_For", Dept_Applied_For);
                cmdSql.Parameters.AddWithValue("@Subject", Subject);
                cmdSql.Parameters.AddWithValue("@Post_Applied_For", Post_Applied_For);
                cmdSql.Parameters.AddWithValue("@Other_Post_Applied_For", Other_Post_Applied_For);
                cmdSql.Parameters.AddWithValue("@Address_Line1", Address_Line1);
                cmdSql.Parameters.AddWithValue("@Address_Line2", Address_Line2);
                cmdSql.Parameters.AddWithValue("@City", City);
                cmdSql.Parameters.AddWithValue("@District", District);
                cmdSql.Parameters.AddWithValue("@State", State);
                cmdSql.Parameters.AddWithValue("@Pincode", Pincode);
                cmdSql.Parameters.AddWithValue("@Maritial_Status", Maritial_Status);
                cmdSql.Parameters.AddWithValue("@Spousename", Spousename);
                cmdSql.Parameters.AddWithValue("@No_of_Child", No_of_Child);
                cmdSql.Parameters.AddWithValue("@Fathername", Fathername);
                cmdSql.Parameters.AddWithValue("@Mothername", Mothername);
                cmdSql.Parameters.AddWithValue("@Landline_No", Landline_No);
                cmdSql.Parameters.AddWithValue("@Mobile_No", Mobile_No);
                cmdSql.Parameters.AddWithValue("@Email", Email);
                cmdSql.Parameters.AddWithValue("@Gender", Gender);
                cmdSql.Parameters.AddWithValue("@Religion", Religion);
                cmdSql.Parameters.AddWithValue("@Community", Community);
                cmdSql.Parameters.AddWithValue("@PAN_No", PAN_No);
                cmdSql.Parameters.AddWithValue("@PAN_Reason", PAN_Reason);
                cmdSql.Parameters.AddWithValue("@Passport_No", Passport_No);
                cmdSql.Parameters.AddWithValue("@Passport_Reason", Passport_Reason);
                cmdSql.Parameters.AddWithValue("@DOB", DOB);
                cmdSql.Parameters.AddWithValue("@Present_College", Present_College);
                cmdSql.Parameters.AddWithValue("@Present_Department", Present_Department);
                cmdSql.Parameters.AddWithValue("@Present_Designation", Present_Designation);
                cmdSql.Parameters.AddWithValue("@GATE_Score", GATE_Score);
                cmdSql.Parameters.AddWithValue("@NET_SLET_Score", NET_SLET_Score);
                cmdSql.Parameters.AddWithValue("@PHD_Thesis_Titile", PHD_Thesis_Titile);
                cmdSql.Parameters.AddWithValue("@PHD_Faculty", PHD_Faculty);
                cmdSql.Parameters.AddWithValue("@Other_Contributions", Other_Contributions);
                cmdSql.Parameters.AddWithValue("@Publications", Publications);
                cmdSql.Parameters.AddWithValue("@Photo_path", Photo_Path);
                cmdSql.Parameters.AddWithValue("@Resume_path", Resume_path);
                cmdSql.Parameters.AddWithValue("@Reg_ID", "");
                cmdSql.Parameters["@Reg_ID"].Direction = ParameterDirection.Output;

                //  cmdSql.ExecuteNonQuery();
                strReg_No = cmdSql.ExecuteScalar().ToString(); ;
                //strReg_No = cmdSql.Parameters["@Reg_ID"].Value.ToString();
                if (dtEducation.Rows.Count > 0)
                {
                    for (int i = 0; i < dtEducation.Rows.Count; i++)
                    {
                        cmdSql.Parameters.Clear();
                        strQuery = "usp_insert_Faculty_Education";
                        cmdSql.CommandText = strQuery;
                        cmdSql.Connection = connSql;
                        cmdSql.CommandType = CommandType.StoredProcedure;
                        cmdSql.Transaction = objTran;

                        cmdSql.Parameters.AddWithValue("@Reg_No", strReg_No);
                        cmdSql.Parameters.AddWithValue("@Category", dtEducation.Rows[i]["Category"]);
                        cmdSql.Parameters.AddWithValue("@Degree", dtEducation.Rows[i]["Degree"]);
                        cmdSql.Parameters.AddWithValue("@Specialization", dtEducation.Rows[i]["Specialization"]);
                        cmdSql.Parameters.AddWithValue("@Year_of_Passing", dtEducation.Rows[i]["Year_of_Passing"]);
                        cmdSql.Parameters.AddWithValue("@College", dtEducation.Rows[i]["College"]);
                        cmdSql.Parameters.AddWithValue("@University", dtEducation.Rows[i]["University"]);
                        cmdSql.Parameters.AddWithValue("@Marks", dtEducation.Rows[i]["Marks"]);
                        cmdSql.Parameters.AddWithValue("@Class_Obtained", dtEducation.Rows[i]["Class_Obtained"]);
                        cmdSql.ExecuteNonQuery();

                    }
                }
                if (dtIndustrial.Rows.Count > 0)
                {
                    for (int i = 0; i < dtIndustrial.Rows.Count; i++)
                    {
                        cmdSql.Parameters.Clear();
                        strQuery = "usp_insert_Faculty_Industrial_Experience";
                        cmdSql.CommandText = strQuery;
                        cmdSql.Connection = connSql;
                        cmdSql.CommandType = CommandType.StoredProcedure;
                        cmdSql.Transaction = objTran;

                        cmdSql.Parameters.AddWithValue("@Reg_No", strReg_No);
                        cmdSql.Parameters.AddWithValue("@Organisation", dtIndustrial.Rows[i]["Organisation"]);
                        cmdSql.Parameters.AddWithValue("@Designation", dtIndustrial.Rows[i]["Designation"]);
                        cmdSql.Parameters.AddWithValue("@Nature_of_Work", dtIndustrial.Rows[i]["NatureofWork"]);
                        cmdSql.Parameters.AddWithValue("@No_of_Years", dtIndustrial.Rows[i]["NoofYears"]);
                        cmdSql.Parameters.AddWithValue("@From", dtIndustrial.Rows[i]["From"]);
                        cmdSql.Parameters.AddWithValue("@To", dtIndustrial.Rows[i]["To"]);

                        cmdSql.ExecuteNonQuery();

                    }
                }

                if (dtAcademic.Rows.Count > 0)
                {
                    for (int i = 0; i < dtAcademic.Rows.Count; i++)
                    {
                        cmdSql.Parameters.Clear();
                        strQuery = "usp_insert_Faculty_Academic_Experience";
                        cmdSql.CommandText = strQuery;
                        cmdSql.Connection = connSql;
                        cmdSql.CommandType = CommandType.StoredProcedure;
                        cmdSql.Transaction = objTran;

                        cmdSql.Parameters.AddWithValue("@Reg_No", strReg_No);
                        cmdSql.Parameters.AddWithValue("@College", dtAcademic.Rows[i]["College"]);
                        cmdSql.Parameters.AddWithValue("@Position", dtAcademic.Rows[i]["Position"]);
                        cmdSql.Parameters.AddWithValue("@Years", dtAcademic.Rows[i]["Years"]);
                        cmdSql.Parameters.AddWithValue("@From", dtAcademic.Rows[i]["From"]);
                        cmdSql.Parameters.AddWithValue("@To", dtAcademic.Rows[i]["To"]);

                        cmdSql.ExecuteNonQuery();

                    }
                }
                if (dtSubjects.Rows.Count > 0)
                {
                    for (int i = 0; i < dtSubjects.Rows.Count; i++)
                    {
                        cmdSql.Parameters.Clear();
                        strQuery = "usp_insertFaculty_Subjects_Handled";
                        cmdSql.CommandText = strQuery;
                        cmdSql.Connection = connSql;
                        cmdSql.CommandType = CommandType.StoredProcedure;
                        cmdSql.Transaction = objTran;

                        cmdSql.Parameters.AddWithValue("@Reg_No", strReg_No);
                        cmdSql.Parameters.AddWithValue("@Institution", dtSubjects.Rows[i]["Institution"]);
                        cmdSql.Parameters.AddWithValue("@Subjects_Handled", dtSubjects.Rows[i]["SubjectsHandled"]);
                        cmdSql.Parameters.AddWithValue("@Subject_Code", dtSubjects.Rows[i]["Subject_Code"]);
                        cmdSql.Parameters.AddWithValue("@Results_Produced", dtSubjects.Rows[i]["ResultsProduced"]);
                        cmdSql.Parameters.AddWithValue("@Academic_Year", dtSubjects.Rows[i]["AcademicYear"]);
                        cmdSql.ExecuteNonQuery();

                    }
                }
                objTran.Commit();
                return strReg_No;
            }
            catch (Exception ex)
            {
                objTran.Rollback();
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
                cmdSql = null;
                strQuery = null;
                objTran = null;
                connSql = null;
            }
        }
    }
}
