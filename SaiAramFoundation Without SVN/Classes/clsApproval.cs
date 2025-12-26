using System;
using System.Data;
using System.Configuration;

using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Collections.Generic;


using Sairam_RegularUG.Classes;
using System.Data.SqlClient;
using Telerik.Web.UI;

namespace SaiAramFoundation.Classes
{
    public class clsApproval
    {
        clsCommon objCommon = new clsCommon();
        Object thisLock = new Object();
        //By saravanan ---------------
       
        //----------------------------




















        public bool CheckSNRNoLE(string strSnrNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlCommand cmdSql = null;
            int count = 0;
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Select count(*) from TBL_LE_REGISTRATION_2013 where SnrNo='" + strSnrNo.Trim().ToString() + "'";
                if (connSql.State != ConnectionState.Open)
                {
                    connSql.Open();
                }
                cmdSql = new SqlCommand(strQuery, connSql);
                count = Convert.ToInt16(cmdSql.ExecuteScalar());
                if (count != 0)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                {
                    connSql.Close();
                }
                cmdSql = null;
            }
        }
        public bool CheckSNRNoTR(string strSnrNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlCommand cmdSql = null;
            int count = 0;
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Select count(*) from TBL_TRANSFER_REGISTRATION_2013 where SnrNo='" + strSnrNo.Trim().ToString() + "'";
                if (connSql.State != ConnectionState.Open)
                {
                    connSql.Open();
                }
                cmdSql = new SqlCommand(strQuery, connSql);
                count = Convert.ToInt16(cmdSql.ExecuteScalar());
                if (count != 0)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                {
                    connSql.Close();
                }
                cmdSql = null;
            }
        }
        public bool CheckAuRegistrationNoRG(string strAuRegNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlCommand cmdSql = null;
            int count = 0;
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Select count(*) from TBL_RG_REGISTRATION_2013 where AU_Registration_No='" + strAuRegNo.Trim().ToString() + "'";
                if (connSql.State != ConnectionState.Open)
                {
                    connSql.Open();
                }
                cmdSql = new SqlCommand(strQuery, connSql);
                count = Convert.ToInt16(cmdSql.ExecuteScalar());
                if (count != 0)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                {
                    connSql.Close();
                }
                cmdSql = null;
            }
        }
        public bool CheckSNRNoRG(string strSnrNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlCommand cmdSql = null;
            int count = 0;
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Select count(*) from TBL_RG_REGISTRATION_2013 where SnrNo='" + strSnrNo.Trim().ToString() + "'";
                if (connSql.State != ConnectionState.Open)
                {
                    connSql.Open();
                }
                cmdSql = new SqlCommand(strQuery, connSql);
                count = Convert.ToInt16(cmdSql.ExecuteScalar());
                if (count != 0)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (connSql.State != ConnectionState.Closed)
                {
                    connSql.Close();
                }
                cmdSql = null;
            }
        }
        public void UpdateSNRNo(string strAppNo, string strSNRNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlCommand cmdSql = null;
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Update TBL_RG_REGISTRATION_2013 set SnrNo='" + strSNRNo.ToString() + "' where ID='" + strAppNo.ToString() + "'";
                if (connSql.State != ConnectionState.Open)
                {
                    connSql.Open();
                }
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
                {
                    connSql.Close();
                }
                cmdSql = null;
            }
        }
        public void UpdateSNRNo_LE(string strAppNo, string strSNRNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlCommand cmdSql = null;
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Update TBL_LE_REGISTRATION_2013 set SnrNo='" + strSNRNo.ToString() + "' where ID='" + strAppNo.ToString() + "'";
                if (connSql.State != ConnectionState.Open)
                {
                    connSql.Open();
                }
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
                {
                    connSql.Close();
                }
                cmdSql = null;
            }
        }
        public void UpdateSNRNo_TR(string strAppNo, string strSNRNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlCommand cmdSql = null;
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Update TBL_TRANSFER_REGISTRATION_2013 set SnrNo='" + strSNRNo.ToString() + "' where ID='" + strAppNo.ToString() + "'";
                if (connSql.State != ConnectionState.Open)
                {
                    connSql.Open();
                }
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
                {
                    connSql.Close();
                }
                cmdSql = null;
            }
        }
        public DataSet DisplayAdmissions(string strStatus)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, Degree, Registration_Number, Department, College_Name,";
                strQuery = strQuery + " Case Approval_Status when 'True' then 'Approved' when 'False' then 'Waiting' end As [Status], ";
                strQuery = strQuery + " Case IsUpdated when 'True' then 'Waiting for Approval' when 'False' then 'Registered' end As [Updated_Status],";
                strQuery = strQuery + " Approved_By , convert(varchar,Approved_Date,100) As Approved_Date";
                strQuery = strQuery + " From Tbl_Registration ";
                if (strStatus != "PageLoad")
                {
                    strQuery = strQuery + " Where Approval_Status = 'False' order by Data_Date Desc";
                }

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
        public void UpdateAdmissionStatus(string strApplnID, string strApprovalStatus, string strUpdatedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update Tbl_Registration Set ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By='" + strUpdatedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public void OverrideRejection(string strApplnID, string strCollege, string strDept, string strApprovalStatus, string strUpdatedBy, string strReason)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "', ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By='" + strUpdatedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Reject_Comments ='" + strReason + "' Where ID = '" + strApplnID + "' ";

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
        public void OverrideRejectionLE(string strApplnID, string strCollege, string strDept, string strApprovalStatus, string strUpdatedBy, string strReason)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update tbl_le_registration_2013 Set College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "', ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By='" + strUpdatedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Reject_Comments ='" + strReason + "' Where ID = '" + strApplnID + "' ";

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
        public void OverrideRejectionTR(string strApplnID, string strCollege, string strDept, string strApprovalStatus, string strUpdatedBy, string strReason)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_TRANSFER_REGISTRATION_2013 Set CollegeAllocated = '" + strCollege + "', Dept_Approved='" + strDept + "', ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By='" + strUpdatedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Reject_Comments ='" + strReason + "' Where ID = '" + strApplnID + "' ";

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
        public void OverrideSelection(string strApplnID, string strApprovalStatus, string strUpdatedBy, string strReason)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By='" + strUpdatedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Reject_Comments ='" + strReason + "' Where ID = '" + strApplnID + "' ";

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
        public void OverrideSelectionLE(string strApplnID, string strApprovalStatus, string strUpdatedBy, string strReason)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update tbl_le_registration_2013 Set ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By='" + strUpdatedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Reject_Comments ='" + strReason + "' Where ID = '" + strApplnID + "' ";

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

        public void OverrideSelectionTR(string strApplnID, string strApprovalStatus, string strUpdatedBy, string strReason)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_TRANSFER_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By='" + strUpdatedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Reject_Comments ='" + strReason + "' Where ID = '" + strApplnID + "' ";

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

        public void UpdateReturnDocPath(string strApplnID, string strPathTC, string strPath10, string strPath12, string strCommunityPath, string strDOTpath,
            string strSportsDoc1, string strSportsDoc2, string strSportsDoc3, string strSportsDoc4, string strSportsDoc5, string strBoolTC,
            string strBool10, string strBool12, string strBoolCC, string strBoolDOT, string strBoolC1, string strBoolC2, string strBoolC3,
            string strBoolC4, string strBoolC5)
        {
            string strQuery = "";
            string strQry = "";
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set ";
                strQry = "";
                if (strBoolTC == "0")
                {
                    strQry = strQry + "Path_TC = '" + strPathTC + "',";
                }
                if (strBool10 == "0")
                {
                    strQry = strQry + "Path_10marks = '" + strPath10 + "',";
                }
                if (strBool12 == "0")
                {
                    strQry = strQry + "Path_12marks = '" + strPath12 + "',";
                }
                if (strBoolCC == "0")
                {
                    strQry = strQry + "Path_Community = '" + strCommunityPath + "',";
                }
                if (strBoolDOT == "0")
                {
                    strQry = strQry + "Path_DOT = '" + strDOTpath + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc1 = '" + strSportsDoc1 + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc2 = '" + strSportsDoc2 + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc3 = '" + strSportsDoc3 + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc4 = '" + strSportsDoc4 + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc5 = '" + strSportsDoc5 + "'";
                }
                int QryCount = Convert.ToInt32(strQry.Length - 1);
                if (strQry.Substring(strQry.Length - 1, 1) == ",")
                {
                    strQuery = strQuery + strQry.Substring(0, strQry.Length - 1) + " Where ID = '" + strApplnID + "' ";
                }
                else
                {
                    strQuery = strQuery + strQry + " Where ID = '" + strApplnID + "' ";
                }
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
        public void UpdateDocumentPath(string strApplnID, string strPathTC, string strPath10, string strPath12, string strPathDD, string strCommunityPath, string strDOTpath, string strFGpath,
            string strFatherImg, string strMotherImg, string strGuardianImg,
            string strSportsDoc1, string strSportsDoc2, string strSportsDoc3, string strSportsDoc4, string strSportsDoc5,
            string strDoc1, string strDoc2, string strDoc3, string strDoc4, string strDoc5)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Path_TC = '" + strPathTC + "', Path_10marks = '" + strPath10 + "', Path_12marks = '" + strPath12 + "',Path_DD = '" + strPathDD + "',";
                strQuery = strQuery + " Docs_Uploaded = '" + DateTime.Now.ToString() + "', Path_Community = '" + strCommunityPath + "',";
                strQuery = strQuery + " Path_DOT = '" + strDOTpath + "',Path_FG='" + strFGpath + "', ";
                strQuery = strQuery + " Path_FatherImg = '" + strFatherImg + "', Path_MotherImg = '" + strMotherImg + "', Path_GuardianImg='" + strGuardianImg + "', ";
                strQuery = strQuery + " SportsDoc1 = '" + strSportsDoc1 + "', SportsDoc2 = '" + strSportsDoc2 + "',";
                strQuery = strQuery + " SportsDoc3 = '" + strSportsDoc3 + "', SportsDoc4 = '" + strSportsDoc4 + "',  SportsDoc5 = '" + strSportsDoc5 + "',";
                strQuery = strQuery + " spDocName1 = '" + strDoc1 + "', spDocName2 = '" + strDoc2 + "',";
                strQuery = strQuery + " spDocName3 = '" + strDoc3 + "', spDocName4 = '" + strDoc4 + "',  spDocName5 = '" + strDoc5 + "',IsVerified='2'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public DataSet DisplayLateralAdmissions(string strStatus, string strUserType)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, Registration_Number, degree, dept_Approved, Marks, Polytechnic_Address, college_name, FullName, Third_Semester, Sixth_Semester, Fourth_Semester, Fifth_semester, ";
                strQuery = strQuery + " case Sixth_Semester when '0' then (select round(((Third_Semester+ Fourth_Semester+ Fifth_semester)/3),2) from TBL_LE_REGISTRATION_2013 te where te.id=tr.id)";
                strQuery = strQuery + " else (select round(((Third_Semester+ Sixth_Semester+ Fourth_Semester+ Fifth_semester)/4),2) as Avg2 from TBL_LE_REGISTRATION_2013 te where te.id=tr.id)";
                strQuery = strQuery + " end as Average,";
                strQuery = strQuery + " Case Approval_Status when '0' then 'Selected' when '1' then 'Rejected' when '2' then 'Waiting' when '3' then 'Allocated' when '4' then 'Enquired' when '5' then 'Registered' end As [Status], ";

                //For Link and Lable OF status(Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";

                    //For Link and Lable OF status (Approve)
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                }
                //-------------------------------
                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";
                    strQuery = strQuery + " OverrideEnablelbl='True',";
                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                    strQuery = strQuery + " OverrideEnablelbl='False',";
                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                //strQuery = strQuery + " Case IsUpdated when 'True' then 'Waiting for Approval' when 'False' then 'Registered' end As [Updated_Status],";
                strQuery = strQuery + " Updated_By ,SnrNo,convert(varchar,Approved_Date,100) As Approved_Date, Approved_By, convert(varchar,Updated_Date,100) As Updated_Date";
                strQuery = strQuery + " From TBL_LE_REGISTRATION_2013 tr ";
                if (strStatus == "PageLoad")
                {
                    //strQuery = strQuery + " Where Approval_Status ='Registered'";
                    strQuery = strQuery + " order by ID Desc";
                }
                if (strStatus == "AllData")
                {
                    strQuery = strQuery + " Where  Approval_Status between '0' and '3'";
                }
                if (strStatus == "PageLoadAllocate")
                {
                    strQuery = strQuery + " ORDER BY STATUS ASC";
                }


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
        public DataSet DisplayRegularAdmissions(string strStatus, string strUserType)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = "Select ID, Dept_Approved, College_Name, Marks, School_Name, XII_SchoolName,  ";
                strQuery = strQuery + " Case Examination_Appeared When 1 Then 'Appearing' When 2 Then 'Appeared' End As [Examination_Appeared],  ";
                strQuery = strQuery + " XII_Board, FullName, pYear, Updated_By , Convert(varchar,Approved_Date,100) As Approved_Date, ";

                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status], ";
                strQuery = strQuery + " Approved_By, School_Name, Convert(varchar,Updated_Date,100) As Updated_Date, ";
                strQuery = strQuery + " case Docs_Uploaded when '1' then '----' else 'Uploaded' end as [Doc_Status], ";

                strQuery = strQuery + " Case IsUpdated when 'True' then 'Waiting for Approval' when 'False' then 'Registered' end As [Updated_Status],";
                strQuery = strQuery + " Registration_Number, Mark3, Mark4, Mark6, Total_Marks, Physics_Marks, Chemistry_Marks, Maths_Marks, ";
                strQuery = strQuery + " RevisionTest_Physics, RevisionTest_Chemistry, RevisionTest_Maths, RevisionTest_Total,Total,";

                //For Link and Lable OF status(Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";


                    //For Link and Lable OF status (Approve)
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                    //-------------------------------
                }

                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";
                    strQuery = strQuery + " OverrideEnablelbl='True',";
                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                    strQuery = strQuery + " OverrideEnablelbl='False',";
                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                strQuery = strQuery + " SnrNo From TBL_RG_REGISTRATION_2013 tr Left Outer Join Tn_12result_2012 Tn ";
                strQuery = strQuery + " On Tr.Registration_Number = Tn.RegNo Order By Approval_Status Asc";

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
                objCommon = null;
                strQuery = null;
            }
        }
        public DataSet DisplaySelectedAdmissions(string strSearchKey, string strAppNo, string strCollege, string strDept)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = "Select ID, FullName, Dept_Approved, College_Name, XII_Board,SnrNo, ";
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status], ";
                //strQuery = strQuery + " case Docs_Uploaded when '1' then '----' else 'Uploaded' end as [Doc_Status], Isverified, Remarks_Verify, Student_ID, ";

                strQuery = strQuery + " case Docs_Uploaded when '1' then 'False' else 'True' end as [UploadEnablelbl],Docs_Uploaded, Isverified, Remarks_Verify, Student_ID, ";
                strQuery = strQuery + " case Docs_Uploaded when '1' then 'True' else 'False' end as [UploadEnablelnk],  ";

                //strQuery = strQuery + " case Docs_Uploaded when '1' then 'False' else 'True' end as [VerifyEnablelnk],  ";
                strQuery = strQuery + " case IsVerified when '1' then 'False' when '3' then 'False' when '0' then 'True' else 'True' end as [VerifyEnablelnk],  ";
                strQuery = strQuery + " case IsVerified when '1' then 'True' when '3' then 'True' when '0' then 'False' else 'False' end as [Verifylbl],  ";

                strQuery = strQuery + " case IsVerified when '0' then 'True' else 'False' end as [PartialVerifylbl],  ";


                strQuery = strQuery + " case ISNULL(student_ID,'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [VisibleViewlnk],  ";
                strQuery = strQuery + " case ISNULL(student_ID,'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [VisibleAdmitCardlnk],  ";
                strQuery = strQuery + " case ISNULL(student_ID,'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [visibleViewlbl],  ";
                strQuery = strQuery + " case ISNULL(student_ID,'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [VisibleAdmitCardlbl],  ";


                //For Link and Lable OF status(Allocate)               
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";

                //------------------------------

                //For Link and Lable OF status (Approve)
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl] ";
                //-------------------------------

                strQuery = strQuery + " From TBL_RG_REGISTRATION_2013 ";
                if (strSearchKey == "College")
                {
                    strQuery = strQuery + " Where Approval_Status = '0' And College_Name = '" + strCollege + "' And Dept_Approved = '" + strDept + "' Order By Student_ID Asc ";
                }
                else if (strSearchKey == "AppNo")
                {
                    strQuery = strQuery + " Where Approval_Status = '0' And ID like '%" + strAppNo + "%' Order By Student_ID Asc";
                }

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
                objCommon = null;
                strQuery = null;
            }
        }
        public DataSet GetReuploadDocUsers()
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = " Select ID, Fullname, Email_ID, MailSent From TBL_RG_REGISTRATION_2013 ";
                strQuery = strQuery + " Where Approval_Status='0' And (Path_10marks Is Null Or ";
                strQuery = strQuery + " Path_12marks Is Null Or Path_TC Is Null Or Path_Community ";
                strQuery = strQuery + " Is Null Or Path_DOT Is Null) ";

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
                objCommon = null;
                strQuery = null;
            }
        }
        public DataSet DisplaySelectedAdmissions()
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = "Select ID, FullName, Dept_Approved, College_Name, XII_Board, ";
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status], ";
                strQuery = strQuery + " case Docs_Uploaded when '1' then '----' else 'Uploaded' end as [Doc_Status], Isverified, Remarks_Verify, Student_ID ";
                strQuery = strQuery + " From TBL_RG_REGISTRATION_2013 ";
                strQuery = strQuery + " Where Approval_Status = '0' Order By IsVerified Asc ";

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
                objCommon = null;
                strQuery = null;
            }
        }
        public DataSet DisplayDocuments(string strApplnNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = "Select ID, FullName, Community, Path_TC, Path_10marks, Path_12marks, Path_DD, Path_Community, Path_DOT,Path_FG, Email_ID, ";
                strQuery = strQuery + " SportsDoc1, SportsDoc2, SportsDoc3, SportsDoc4, SportsDoc5, ";
                strQuery = strQuery + " IsVerifyTC, IsVerify10, IsVerify12,IsVerifyDD, IsVerifyCC, IsVerifyDOT,IsVerifyFG, ";
                strQuery = strQuery + " IsVerifySP1, IsVerifySP2, IsVerifySP3, IsVerifySP4, IsVerifySP5, ";
                strQuery = strQuery + " Path_FatherImg, Path_MotherImg, Path_GuardianImg, IsvFatherImg, IsvMotherImg, IsvGuardianImg, ";
                strQuery = strQuery + " SpDocName1, SpDocName2, SpDocName3, SpDocName4, SpDocName5 ";
                strQuery = strQuery + " From TBL_RG_REGISTRATION_2013 ";
                strQuery = strQuery + " Where ID = '" + strApplnNo + "'";

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
                objCommon = null;
                strQuery = null;
            }
        }
        public void UpdateVerificationStatus(string strApplnNo, string strTC, string str10, string str12, string strDD,
        string strCC, string strDOT, string strFG, string strFatherImg, string strMotherImg, string strGuardianImg,
            string strSP1, string strSP2, string strSP3, string strSP4, string strSP5, string strUpdatedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set IsVerifyTC = '" + strTC + "', IsVerify10 = '" + str10 + "', ";
                strQuery = strQuery + " IsVerify12 = '" + str12 + "',IsVerifyDD = '" + strDD + "', IsVerifyCC = '" + strCC + "', IsVerifyDOT = '" + strDOT + "',IsVerifyFG = '" + strFG + "', ";
                strQuery = strQuery + " IsvFatherImg = '" + strFatherImg + "', IsvMotherImg = '" + strMotherImg + "', IsvGuardianImg = '" + strGuardianImg + "', ";
                strQuery = strQuery + " IsVerifySP1 = '" + strSP1 + "', IsVerifySP2 = '" + strSP2 + "', IsVerifySP3 = '" + strSP3 + "', ";
                strQuery = strQuery + " IsVerifySP4 = '" + strSP4 + "', IsVerifySP5 = '" + strSP5 + "', ";
                strQuery = strQuery + " Updated_By = '" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "'";
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
        public void UpdateVerifyStatus(string strApplnNo, string strStatus, string strUpdatedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set Isverified = '" + strStatus + "', ";
                strQuery = strQuery + " Updated_By = '" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "',VerifyedDate='" + DateTime.Now.ToString() + "' ";
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
        public DataSet GetBusCode(string strYear)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select Code from TBL_BUS_BOARDING_POINT where year='" + strYear + "'";

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
        public DataSet GetBusBoard(string strYear, string strCode)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = " Select Boarding_Point from TBL_BUS_BOARDING_POINT where year='" + strYear + "' and Code='" + strCode + "'";
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
        public void UpdateHostel(string strApplnNo, string strHostel, string strAdmitType, string strUpdatedBy, string strBusCode, string strBusDetails, string strAuRegNo, string strConSortAppNo)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set IsHostel = '" + strHostel + "', Admission_Type = '" + strAdmitType + "', ";
                strQuery = strQuery + " Bus_Code = '" + strBusCode + "', Bus_board='" + strBusDetails + "',AU_Registration_No='" + strAuRegNo + "',Consortium_App_No='" + strConSortAppNo + "', ";
                strQuery = strQuery + " Updated_By = '" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "'";
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
        public void AllocateAdmission(string strApplnID, string strCollege, string strDept, string strSnrNo, string strRemarks, string strUpdatedBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Updated_By ='" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "',SnrNo='" + strSnrNo + "',Remarks='" + strRemarks + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public void AdminWaitingLE(string strApplnID, string strCollege, string strDept, string strRemarks, string strUpdatedBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Updated_By ='" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "',Remarks='" + strRemarks + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public void AllocateRGAdmission(string strApplnID, string strCollege, string strDept, string strSnrNo, string strAuRegNo, string strIsFG, string strRemarks, string strPriority, string strUpdatedBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Updated_By ='" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "',Allocated_Date='" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "',SnrNo='" + strSnrNo + "',AU_Registration_No='" + strAuRegNo + "',IsFirstGraduate='" + strIsFG + "',Remarks='" + strRemarks + "', Class_Referral='" + strPriority + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public void AdminWaitingRGAdmission(string strApplnID, string strCollege, string strDept, string strRemarks, string strUpdatedBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Updated_By ='" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "',Remarks='" + strRemarks + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public void ApproveAdmission(string strApplnID, string strCollege, string strDept, string strApprovalStatus, string strApprovedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By = '" + strApprovedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public void ApproveRGAdmission(string strApplnID, string strCollege, string strDept, string strApprovalStatus, string strApprovedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By = '" + strApprovedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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

        public void ProcessRGAdmission(string strApplnID, string strClass, string strSNRNo, string strCollege, string strDept, string strApprovalStatus, string strProcessBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set Class_Referral='" + strClass + "', SnrNo='" + strSNRNo + "', College_Name = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Updated_By = '" + strProcessBy + "', Updated_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Process_By='" + strProcessBy + "', Process_Date='" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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

        public void UpdateLateralAdmission(string strApplnID, string strApprovalStatus, string strUpdatedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By='" + strUpdatedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public void GenerateStudID(string strPrefix, string strApplnNo, string serverPath)
        {
            clsCommon objCommon = new clsCommon();
            SqlCommand cmdSql = null;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());
            int intMaxValue = 1;
            string strQuery;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                lock (thisLock)
                {
                    strQuery = "Select Max(Convert(int,Substring(Student_ID,5,7))) AS Stud_ID FROM TBL_RG_REGISTRATION_2013 Where Student_ID Like '" + strPrefix + "%'";
                    Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                    dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                    if (dsData.Tables[0].Rows.Count > 0)
                    {
                        if (dsData.Tables[0].Rows[0][0].ToString() == "")
                        {
                            intMaxValue = 1;
                        }
                        else
                        {
                            intMaxValue = Convert.ToInt32(dsData.Tables[0].Rows[0][0].ToString()) + 1;
                        }
                    }
                    strQuery = "";

                    strQuery = "Update TBL_RG_REGISTRATION_2013 Set ";
                    strQuery = strQuery + " Student_ID = '" + strPrefix + intMaxValue.ToString().PadLeft(3, '0') + "' ";
                    strQuery = strQuery + " Where ID = '" + strApplnNo + "' ";
                    if (connSql.State != ConnectionState.Open)
                        connSql.Open();
                    cmdSql = new SqlCommand(strQuery, connSql);
                    cmdSql.ExecuteNonQuery();
                    string stuID = strPrefix + intMaxValue.ToString().PadLeft(3, '0');
                    GenerateBarCodeStudentId(stuID, serverPath);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmdSql = null;
                strQuery = null;
                Params = null;
                dsData = null;
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
            }
        }

        protected void GenerateBarCodeStudentId(string strStudentId, string svrPath)
        {
            try
            {
                //-------Rad bar code
                string imagename = strStudentId + "_Barcode.png";
                RadBarcode barcode = new RadBarcode();
                barcode.Text = strStudentId;
                barcode.Type = Telerik.Web.UI.BarcodeType.Code128;
                barcode.LineWidth = 2;
                RadBinaryImage image = new RadBinaryImage();
                // PlaceHolder1.Controls.Add(image);
                System.IO.MemoryStream stream = new System.IO.MemoryStream();
                // barcode.GetImage().Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                barcode.GetImage().Save(svrPath + imagename);
                image.DataValue = stream.ToArray();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public DataSet GetStudDetails(string strApplnno)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID,  FullName, Email_ID, Polytechnic_Address,Community, Fourth_semester, Fifth_Semester, College_Name, Marks, Dept_Approved,SnrNo, Approval_Status,Student_ID,SnrNo ";
                strQuery = strQuery + " From TBL_LE_REGISTRATION_2013 ";
                strQuery = strQuery + " Where ID = '" + strApplnno + "'";

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
        public DataSet GetRGStudDetails(string strApplnno)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, (isnull(FullName,'')+' '+isnull(LastName,'')) as FullName,convert(varchar,DOB,103) as DOB,AU_Registration_No,Registration_Number,IsFirstGraduate,";
                strQuery = strQuery + " Cutoff,Total_Marks,Mobile_Number, School_Name, XII_SchoolName, Email_ID,Physics_Marks,Chemistry_Marks,Maths_Marks, ";
                strQuery = strQuery + " XII_Board,HSCCertificate_Sno, College_Name, Dept_Approved, Approval_Status, Enquiry_Date, Class_Referral, Marks,SnrNo,Registration_Number,";
                strQuery = strQuery + " First_Preference, Second_Preference, Third_Preference, Community,Mother_Tongue,Religion,Medium_Instruction, ";
                strQuery = strQuery + " Nationality,Parent_Name,convert(nvarchar(20),VerifyedDate,103) as VerifyedDate,case Examination_Appeared when 1 then 'Appearing' when 2 then 'Appeared' end as [Examination_Appeared], ";
                strQuery = strQuery + " XII_Board, FullName, Student_ID, IsHostel, Admission_Type, Bus_Code, Bus_board,FullName as FirstName, ";
                strQuery = strQuery + " LastName,Gender,Address1,Address2,City,Postal_Code,State,";
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status], ";


                strQuery = strQuery + " Country,Landline_Number,Father_Name,Mother_Name,Parents_Occupation,Father_Mobile_No,Mother_Mobile_No, Marks,Registration_Number,";
                strQuery = strQuery + " Physics_Marks,Chemistry_Marks,Maths_Marks,Cutoff,Total_Marks,NewXII_Board,AU_Registration_No,Consortium_App_No,Caste,Annual_Income,TNEA_ApplNo,TNEA_RepDate  ";
                //strQuery = strQuery + " case Examination_Appeared when 1 then ";
                //strQuery = strQuery + " (select RevisionTest_Total from TBL_RG_REGISTRATION_2013 te where te.id=tr.id) ";
                //strQuery = strQuery + " else (select Total_Marks from TBL_RG_REGISTRATION_2013 te where te.id=tr.id) end as [12percent],";

                //strQuery = strQuery + " case XII_Board when 'Central Board' then case Examination_Appeared when 1 then";
                //strQuery = strQuery + " (select (((cast((RevisionTest_Physics) as decimal(18,2))+cast((RevisionTest_Chemistry) as decimal(18,2)))/2.00)+cast((RevisionTest_Maths) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                //strQuery = strQuery + " where te.id=tr.id) else (select (((cast((Physics_Marks) as decimal(18,2))+cast((Chemistry_Marks) as decimal(18,2)))/2.00)+cast((Maths_Marks) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                //strQuery = strQuery + " where te.id=tr.id) end else case Examination_Appeared when 1 then";
                //strQuery = strQuery + " (select (((cast((RevisionTest_Physics) as decimal(18,2))+cast((RevisionTest_Chemistry) as decimal(18,2)))/4.00)+cast((RevisionTest_Maths/2.00) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                //strQuery = strQuery + " where te.id=tr.id) else (select (((cast((Physics_Marks) as decimal(18,2))+cast((Chemistry_Marks) as decimal(18,2)))/4.00)+cast((Maths_Marks/2.00) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                //strQuery = strQuery + " where te.id=tr.id) end end as [CutOff],"

                strQuery = strQuery + " From TBL_RG_REGISTRATION_2013 tr ";
                strQuery = strQuery + " Where ID = '" + strApplnno + "'";

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

        public DataSet GetRGConfigurationColumns(string Rolename)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select * From TBL_CFG_COLUMNS";
                strQuery = strQuery + " Where Role_Name = '" + Rolename + "'";

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

        public void UpdateRGStudentData(List<string> lstStudent, string strApplnno)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());
            try
            {
                strQuery = "update TBL_RG_REGISTRATION_2013 set FullName='" + lstStudent[0].ToString() + "',LastName='" + lstStudent[1].ToString() + "',";
                strQuery = strQuery + " DOB='" + lstStudent[2].ToString() + "',Gender='" + lstStudent[3].ToString() + "',";
                strQuery = strQuery + " Community='" + lstStudent[4].ToString() + "',Address1='" + lstStudent[5].ToString() + "',";
                strQuery = strQuery + " Address2='" + lstStudent[6].ToString() + "',City='" + lstStudent[7].ToString() + "',";
                strQuery = strQuery + " Postal_Code='" + lstStudent[8].ToString() + "',State='" + lstStudent[9].ToString() + "',";
                strQuery = strQuery + " Country='" + lstStudent[10].ToString() + "',Email_ID='" + lstStudent[11].ToString() + "',";
                strQuery = strQuery + " Mobile_Number='" + lstStudent[12].ToString() + "',Landline_Number='" + lstStudent[13].ToString() + "',";
                strQuery = strQuery + " Father_Name='" + lstStudent[14].ToString() + "',Mother_Name='" + lstStudent[15].ToString() + "',";
                strQuery = strQuery + " Parents_Occupation='" + lstStudent[16].ToString() + "', Father_Mobile_No='" + lstStudent[17].ToString() + "',";

                strQuery = strQuery + "Mother_Mobile_No='" + lstStudent[18].ToString() + "',Marks='" + lstStudent[19].ToString() + "',";


                strQuery = strQuery + " Registration_Number='" + lstStudent[20].ToString() + "',Physics_Marks='" + lstStudent[21].ToString() + "',";
                strQuery = strQuery + " Chemistry_Marks='" + lstStudent[22].ToString() + "',Maths_Marks='" + lstStudent[23].ToString() + "',";
                strQuery = strQuery + " Cutoff='" + lstStudent[24].ToString() + "',Total_Marks='" + lstStudent[25].ToString() + "',";
                strQuery = strQuery + " NewXII_Board='" + lstStudent[26].ToString() + "',Caste='" + lstStudent[27].ToString() + "',";
                strQuery = strQuery + " Annual_Income='" + lstStudent[28].ToString() + "',TNEA_ApplNo='" + lstStudent[29].ToString() + "',";
                strQuery = strQuery + " TNEA_RepDate='" + lstStudent[30].ToString() + "', HSCCertificate_Sno='" + lstStudent[31].ToString() + "', Affidavit_Document='" + lstStudent[32].ToString() + "' ";

                strQuery = strQuery + " Where ID = '" + strApplnno + "'";

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
        //-----------------------------saravanan 18/02/2013---------------------------------------
        //----------------------Later Entry Registration--------------------------------------------
        public void UpdateHostel_LE(string strApplnNo, string strHostel, string strAdmitType, string strUpdatedBy, string strBusCode, string strBusDetails)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set IsHostel = '" + strHostel + "', Admission_Type = '" + strAdmitType + "', ";
                strQuery = strQuery + " Bus_Code = '" + strBusCode + "', Bus_board='" + strBusDetails + "', ";
                strQuery = strQuery + " Updated_By = '" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "'";
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
        public void UpdateReturnDocPath_LE(string strApplnID, string strPathTC, string strPath10, string strPath12, string strCommunityPath, string strDOTpath,
          string strSportsDoc1, string strSportsDoc2, string strSportsDoc3, string strSportsDoc4, string strSportsDoc5, string strBoolTC,
          string strBool10, string strBool12, string strBoolCC, string strBoolDOT, string strBoolC1, string strBoolC2, string strBoolC3,
          string strBoolC4, string strBoolC5)
        {
            string strQuery = "";
            string strQry = "";
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set ";
                strQry = "";
                if (strBoolTC == "0")
                {
                    strQry = strQry + "Path_TC = '" + strPathTC + "',";
                }
                if (strBool10 == "0")
                {
                    strQry = strQry + "Path_10marks = '" + strPath10 + "',";
                }
                if (strBool12 == "0")
                {
                    strQry = strQry + "Path_12marks = '" + strPath12 + "',";
                }
                if (strBoolCC == "0")
                {
                    strQry = strQry + "Path_Community = '" + strCommunityPath + "',";
                }
                if (strBoolDOT == "0")
                {
                    strQry = strQry + "Path_DOT = '" + strDOTpath + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc1 = '" + strSportsDoc1 + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc2 = '" + strSportsDoc2 + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc3 = '" + strSportsDoc3 + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc4 = '" + strSportsDoc4 + "',";
                }
                if (strBoolC1 == "0")
                {
                    strQry = strQry + "SportsDoc5 = '" + strSportsDoc5 + "'";
                }
                int QryCount = Convert.ToInt32(strQry.Length - 1);
                if (strQry.Substring(strQry.Length - 1, 1) == ",")
                {
                    strQuery = strQuery + strQry.Substring(0, strQry.Length - 1) + " Where ID = '" + strApplnID + "' ";
                }
                else
                {
                    strQuery = strQuery + strQry + " Where ID = '" + strApplnID + "' ";
                }
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
        public void GenerateLEStudID(string strPrefix, string strApplnNo)
        {
            clsCommon objCommon = new clsCommon();
            SqlCommand cmdSql = null;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());
            int intMaxValue = 1;
            string strQuery;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = "Select Max(Convert(int,Substring(Student_ID,5,7))) AS Stud_ID FROM TBL_LE_REGISTRATION_2013 Where Student_ID Like '" + strPrefix + "%'";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                if (dsData.Tables[0].Rows.Count > 0)
                {
                    if (dsData.Tables[0].Rows[0][0].ToString() == "")
                    {
                        intMaxValue = 1;
                    }
                    else
                    {
                        intMaxValue = Convert.ToInt32(dsData.Tables[0].Rows[0][0].ToString()) + 1;
                    }
                }
                strQuery = "";

                strQuery = "Update TBL_LE_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Student_ID = '" + strPrefix + intMaxValue.ToString().PadLeft(3, '0') + "' ";
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
                cmdSql = null;
                strQuery = null;
                Params = null;
                dsData = null;
                if (connSql.State != ConnectionState.Closed)
                    connSql.Close();
            }
        }
        public DataSet GetLEStudDetails(string strApplnno)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = "Select ID, FullName, School_Name, Email_ID, XII_Board, College_Name, Dept_Approved, Approval_Status,";
                strQuery = strQuery + " Marks,Community,Student_ID, IsHostel, Admission_Type, Bus_Code, Bus_board,";
                strQuery = strQuery + " case Examination_Appeared when 'Appearing' then (select( cast((Sixth_Semester) as decimal(18,2))";
                strQuery = strQuery + " + cast((Fifth_Semester) as decimal(18,2)) + cast((Fourth_Semester) as decimal(18,2))";
                strQuery = strQuery + " + cast((Third_Semester) as decimal(18,2)))/4.00) end  as [CutOff] ";
                strQuery = strQuery + " From TBL_LE_REGISTRATION_2013";
                strQuery = strQuery + " Where ID = '" + strApplnno + "'";

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
        public void UpdateVerifyStatus_LE(string strApplnNo, string strStatus, string strUpdatedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set Isverified = '" + strStatus + "', ";
                strQuery = strQuery + " Updated_By = '" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "'";
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
        public void UpdateVerificationStatus_LE(string strApplnNo, string strTC, string str10, string str12,
            string strCC, string strDOT, string strSP1, string strSP2, string strSP3, string strSP4, string strSP5, string strUpdatedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set IsVerifyTC = '" + strTC + "', IsVerify10 = '" + str10 + "', ";
                strQuery = strQuery + " IsVerify12 = '" + str12 + "', IsVerifyCC = '" + strCC + "', IsVerifyDOT = '" + strDOT + "', ";
                strQuery = strQuery + " IsVerifySP1 = '" + strSP1 + "', IsVerifySP2 = '" + strSP2 + "', IsVerifySP3 = '" + strSP3 + "', ";
                strQuery = strQuery + " IsVerifySP4 = '" + strSP4 + "', IsVerifySP5 = '" + strSP5 + "', ";
                strQuery = strQuery + " Updated_By = '" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "'";
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
        public DataSet DisplayDocuments_LE(string strApplnNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = "Select ID, FullName, Community, Path_TC, Path_10marks, Path_12marks, Path_Community, Path_DOT, Email_ID, ";
                strQuery = strQuery + " SportsDoc1, SportsDoc2, SportsDoc3, SportsDoc4, SportsDoc5, ";
                strQuery = strQuery + " IsVerifyTC, IsVerify10, IsVerify12, IsVerifyCC, IsVerifyDOT, ";
                strQuery = strQuery + " IsVerifySP1, IsVerifySP2, IsVerifySP3, IsVerifySP4, IsVerifySP5, ";
                strQuery = strQuery + " SpDocName1, SpDocName2, SpDocName3, SpDocName4, SpDocName5 ";
                strQuery = strQuery + " From TBL_LE_REGISTRATION_2013 ";
                strQuery = strQuery + " Where ID = '" + strApplnNo + "'";

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
                objCommon = null;
                strQuery = null;
            }
        }
        public void UpdateHistory_LE(string strApplnNo, string strProcess, string strAction, string strUserID)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Insert into TBL_HISTORY_LE_2013(Appln_no, Process, Action, user_ID) Values(";
                strQuery = strQuery + " '" + strApplnNo + "', '" + strProcess + "', '" + strAction + "', '" + strUserID + "')";
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
                objCommon = null;
            }
        }
        public void UpdateHistory_TR(string strApplnNo, string strProcess, string strAction, string strUserID)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Insert into TBL_HISTORY_TR_2013(Appln_no, Process, Action, user_ID) Values(";
                strQuery = strQuery + " '" + strApplnNo + "', '" + strProcess + "', '" + strAction + "', '" + strUserID + "')";
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
                objCommon = null;
            }
        }
        public void UpdateDocumentPath_LE(string strApplnID, string strPathTC, string strPath10, string strPath12, string strCommunityPath, string strDOTpath,
          string strSportsDoc1, string strSportsDoc2, string strSportsDoc3, string strSportsDoc4, string strSportsDoc5,
          string strDoc1, string strDoc2, string strDoc3, string strDoc4, string strDoc5)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Path_TC = '" + strPathTC + "', Path_10marks = '" + strPath10 + "', Path_12marks = '" + strPath12 + "',";
                strQuery = strQuery + " Docs_Uploaded = '" + DateTime.Now.ToString() + "', Path_Community = '" + strCommunityPath + "',";
                strQuery = strQuery + " Path_DOT = '" + strDOTpath + "', ";
                strQuery = strQuery + " SportsDoc1 = '" + strSportsDoc1 + "', SportsDoc2 = '" + strSportsDoc2 + "',";
                strQuery = strQuery + " SportsDoc3 = '" + strSportsDoc3 + "', SportsDoc4 = '" + strSportsDoc4 + "',  SportsDoc5 = '" + strSportsDoc5 + "',";
                strQuery = strQuery + " spDocName1 = '" + strDoc1 + "', spDocName2 = '" + strDoc2 + "',";
                strQuery = strQuery + " spDocName3 = '" + strDoc3 + "', spDocName4 = '" + strDoc4 + "',  spDocName5 = '" + strDoc5 + "',IsVerified='2'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public DataSet DisplaySelectedAdmissionsLE(string strSearchKey, string strAppNo, string strCollege, string strDept)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = "Select ID, FullName, Dept_Approved, College_Name, XII_Board, ";
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status], ";

                strQuery = strQuery + " case IsVerified when '1' then 'False' when '3' then 'False' when '0' then 'True' else 'True' end as [VerifyEnablelnk],  ";
                strQuery = strQuery + " case IsVerified when '1' then 'True' when '3' then 'True' when '0' then 'False' else 'False' end as [Verifylbl],  ";

                //strQuery = strQuery + " case IsVerified when '2' then 'False' else 'True' end as [VerifyEnablelnk],  ";
                //strQuery = strQuery + " case IsVerified when '2' then 'True' else 'False' end as [Verifylbl],  ";
                strQuery = strQuery + " case IsVerified when '0' then 'True' else 'False' end as [PartialVerifylbl],  ";

                strQuery = strQuery + " case ISNULL(student_ID,'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [VisibleViewlnk],  ";
                strQuery = strQuery + " case ISNULL(student_ID,'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [VisibleAdmitCardlnk],  ";
                strQuery = strQuery + " case ISNULL(student_ID,'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [visibleViewlbl],  ";
                strQuery = strQuery + " case ISNULL(student_ID,'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [VisibleAdmitCardlbl],  ";

                //strQuery = strQuery + " case Docs_Uploaded when '1' then '----' else 'Uploaded' end as [Doc_Status], Isverified, Remarks_Verify, Student_ID, ";
                strQuery = strQuery + " case Docs_Uploaded when '1' then 'False' else 'True' end as [UploadEnablelbl], Isverified, Remarks_Verify, Student_ID, ";
                strQuery = strQuery + " case Docs_Uploaded when '1' then 'True' else 'False' end as [UploadEnablelnk],  ";
                strQuery = strQuery + " case Docs_Uploaded when '1' then 'False' else 'True' end as [VerifyEnablelnk]  ";
                //------------------------------------------------------------------------------------


                // strQuery = strQuery + " case Docs_Uploaded when '1' then '----' else 'Uploaded' end as [Doc_Status], Isverified, Remarks_Verify, Student_ID ";
                strQuery = strQuery + " From TBL_LE_REGISTRATION_2013 ";
                if (strSearchKey == "College")
                {
                    strQuery = strQuery + " Where Approval_Status = '0' And College_Name = '" + strCollege + "' And Dept_Approved = '" + strDept + "' Order By IsVerified Asc ";
                }
                else if (strSearchKey == "AppNo")
                {
                    strQuery = strQuery + " Where Approval_Status = '0' And ID like '%" + strAppNo + "%' ";
                }
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
                objCommon = null;
                strQuery = null;
            }
        }
        //-------------------------------------------------------------------------------------------
        //-------------------------Transfer Registration---------------------------------------------  
        public void ApproveTRAdmission(string strApplnID, string strCollege, string strDept, string strApprovalStatus, string strApprovedBy)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_TRANSFER_REGISTRATION_2013 Set CollegeAllocated = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Approved_By = '" + strApprovedBy + "', Approved_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public DataSet SearchbyMarksTR(string StrCategory, string strFrom, string strTo, string strUserType)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = "Select ID,Student_Name as FullName, Date_Of_Birth,University_Registration_Number,";
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status],";

                //For Link and Lable OF status(Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";


                    //For Link and Lable OF status (Approve)
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                }
                //-------------------------------
                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";

                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                strQuery = strQuery + " ModeOfAdmission,TwelfthRegistrationNo as Registration_Number,CutOff,RegID,Even_Studied_Institute,TotalSemLateralMark,Even_Studied_Branch,";
                strQuery = strQuery + " CollegeAllocated,Dept_Approved,Approval_Status,Approved_By,convert(varchar,Approved_Date,100) as Approved_Date,";
                strQuery = strQuery + " Updated_By,convert(varchar,Updated_Date,110) as Updated_Date,Enquiry_Status,Enquiry_By,convert(varchar,Enquiry_Date,100) as Enquiry_Date,SnrNo FROM TBL_TRANSFER_REGISTRATION_2013";


                if (StrCategory == "CutOff")
                {
                    strQuery = strQuery + " Where convert(float,cutoff) between '" + strFrom + "' and '" + strTo + "' order by CutOff Desc";
                }
                if (StrCategory == "Percentage")
                {
                    strQuery = strQuery + " where convert(float,TotalSemLateralMark) between '" + strFrom + "' and '" + strTo + "' order by TotalSemLateralMark Desc";
                }

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
        public void AllocateAdmissionTR(string strApplnID, string strCollege, string strDept, string strSnrNo, string strRemarks, string strUpdatedBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_TRANSFER_REGISTRATION_2013 Set CollegeAllocated = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Updated_By ='" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "',SnrNo='" + strSnrNo + "',Remarks='" + strRemarks + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public void AdminWaitingTR(string strApplnID, string strCollege, string strDept, string strRemarks, string strUpdatedBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_TRANSFER_REGISTRATION_2013 Set CollegeAllocated = '" + strCollege + "', Dept_Approved='" + strDept + "',";
                strQuery = strQuery + " Updated_By ='" + strUpdatedBy + "', Updated_Date = '" + DateTime.Now.ToString() + "',approved_date='" + DateTime.Now.ToString() + "',";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "',Remarks='" + strRemarks + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public DataSet GetTRStudDetails(string strApplnno)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, Student_Name as FullName,Stud_EmailID as Email_ID, Even_Studied_Institute,CutOff, CollegeAllocated, TotalSemLateralMark,SnrNo, Dept_Approved, Approval_Status,AU_Registration_No,";
                strQuery = strQuery + " Even_Studied_Branch,University_Registration_Number,Even_studied_Semester,Even_Request_Branch,SnrNo,Student_ID  From TBL_TRANSFER_REGISTRATION_2013";
                strQuery = strQuery + " Where ID = '" + strApplnno + "'";

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
        public DataSet DisplayTransferAdmissions(string strStatus, string strUserType)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = strQuery + "select ID,Student_Name as FullName,University_Registration_Number ,Even_Studied_Institute,Even_Studied_Branch,convert(varchar,Data_Date,100) as  Data_Date,";
                strQuery = strQuery + " TwelfthRegistrationNo,CutOff,TotalSemLateralMark,Dept_Approved,CollegeAllocated,TotalSemLateralMark,";
                strQuery = strQuery + " Case Approval_Status when '0' then 'Selected' when '1' then 'Rejected' when '2'";
                strQuery = strQuery + " then 'Waiting' when '3' then 'Allocated' when '4' then 'Enquired' when '5' then 'Registered' end As [Status], ";

                //For Link and Lable OF status(Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";

                    //For Link and Lable OF status (Approve)
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                    //-------------------------------
                }
                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";
                    strQuery = strQuery + " OverrideEnablelbl='True',";

                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                    strQuery = strQuery + " OverrideEnablelbl='False',";
                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                strQuery = strQuery + " Approval_Status,Approved_By,convert(varchar,Approved_Date,100) as Approved_Date,";
                strQuery = strQuery + " Updated_By,convert(varchar,Updated_Date,110) as Updated_Date,Enquiry_Status,Enquiry_By,convert(varchar,Enquiry_Date,100) as Enquiry_Date,SnrNo FROM TBL_TRANSFER_REGISTRATION_2013";

                if (strStatus == "AllData")
                {
                    strQuery = strQuery + " Where  Approval_Status between '0' and '3'";
                }
                if (strStatus == "PageLoadAllocate")
                {
                    strQuery = strQuery + " ORDER BY STATUS ASC";
                }
                if (strStatus == "PageLoad")
                {
                    strQuery = strQuery + " order by ID Desc";
                }


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
        public DataSet GeTRStudDetails(string strApplnno)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = strQuery + "select ID,Student_Name,Even_Studied_Institute,";
                strQuery = strQuery + "ModeOfAdmission,CutOff";
                strQuery = strQuery + " from TBL_TRANSFER_REGISTRATION_2013 where ID=" + strApplnno;
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
        public void UpdateTREnquiry(string strApplnID, string strFullName, string strSchoolName, string strEnquiredBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_TRANSFER_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', Student_Name='" + strFullName + "', Even_Studied_Institute = '" + strSchoolName + "',";
                strQuery = strQuery + " Enquiry_By = '" + strEnquiredBy + "', Enquiry_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
        public DataSet SearchTRData(string StrCategory, string strApplnNo, string strCollege, string strDeptApproved, string strApplnStatus, string strRegNo, string strBoard, string strSNRNo, string strUserType)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Select ID,Student_Name as FullName, Date_Of_Birth,University_Registration_Number,";
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status],";

                //For Link and Lable OF status(Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";

                    //For Link and Lable OF status (Approve)
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                    //-------------------------------
                }
                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";
                    strQuery = strQuery + " OverrideEnablelbl='True',";

                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                    strQuery = strQuery + " OverrideEnablelbl='False',";
                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                strQuery = strQuery + " ModeOfAdmission,TwelfthRegistrationNo as Registration_Number,CutOff,RegID,Even_Studied_Institute,TotalSemLateralMark,Even_Studied_Branch,";
                strQuery = strQuery + " CollegeAllocated,Dept_Approved,Approved_By,convert(varchar,Approved_Date,100) as Approved_Date,";
                strQuery = strQuery + " Updated_By,convert(varchar,Updated_Date,110) as Updated_Date,Enquiry_Status,Enquiry_By,convert(varchar,Enquiry_Date,100) as Enquiry_Date,SnrNo from TBL_TRANSFER_REGISTRATION_2013";

                if (StrCategory == "ApplnNo")
                {
                    //if (strUserType == "Reception")
                    //{
                    //    strQuery = strQuery + " Where ID like '201302%" + strApplnNo + "%'";
                    //}
                    //else
                    //{
                    //    strQuery = strQuery + " Where ID like '%" + strApplnNo + "%'";
                    //}
                    strQuery = strQuery + " Where ID like '%" + strApplnNo + "%' order by ID Desc";
                }
                if (StrCategory == "DeptAllocated")
                {
                    strQuery = strQuery + " Where CollegeAllocated like '%" + strCollege + "%' and Dept_Approved like '%" + strDeptApproved + "%' Order By Approval_Status Asc";
                }
                if (StrCategory == "ApplnStatus")
                {
                    //strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and College_Name like '%" + strCollege + "%' and Dept_Approved like '%" + strDeptApproved + "%' Order By Approval_Status Asc";
                    strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' Order By Approval_Status Asc";
                }
                if (StrCategory == "12thRegNo")
                {
                    strQuery = strQuery + " Where TwelfthRegistrationNo like '%" + strRegNo + "%'";
                }
                if (StrCategory == "College")
                {
                    strQuery = strQuery + " Where CollegeAllocated like '%" + strCollege + "%' Order By Approval_Status Asc";
                }
                if (StrCategory == "SNRNo")
                {
                    strQuery = strQuery + " Where SnrNo like '%" + strSNRNo + "%' Order By Approval_Status Asc";
                }
                //if (StrCategory == "Board")
                //{
                //    strQuery = strQuery + " Where XII_Board like '%" + strBoard + "%'";
                //}
                //strQuery = strQuery + " order by ID Desc";
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
        //----------------------------------------------------------------------------------------
        public void UpdateEnquiry(string strApplnID, string strFullName, string strPolytechnic, string strEnquiredBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_LE_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', FullName='" + strFullName + "', Polytechnic_Address = '" + strPolytechnic + "',";
                strQuery = strQuery + " Enquiry_By = '" + strEnquiredBy + "', Enquiry_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' ";

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
                objCommon = null;
            }
        }
        public void UpdateRGEnquiry(string strApplnID, string strFullName, string strSchoolName, string strEnquiredBy, string strApprovalStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Approval_Status = '" + strApprovalStatus + "', School_Name = '" + strSchoolName + "',";
                strQuery = strQuery + " Enquiry_By = '" + strEnquiredBy + "', Enquiry_Date = '" + DateTime.Now.ToString() + "'";
                strQuery = strQuery + " Where ID = '" + strApplnID + "' and Approval_Status = 5";

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
                objCommon = null;
            }
        }
        public DataSet DisplayHistory(string strApplnNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, Application_Id, Process, Action, Data_Date, User_ID";
                strQuery = strQuery + " From TBL_HISTORY Where Application_Id = '" + strApplnNo + "'";

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

        public DataSet DisplayEnquiryHistory(string strApplnNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, Appln_No, Process, Action, Data_Date, User_ID";
                strQuery = strQuery + " From TBL_HISTORY_2013 ";
                strQuery = strQuery + " Where Appln_No = '" + strApplnNo + "' and Process='Enquiry' Order By Data_Date DESC";

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

        public DataSet DisplayHistoryLE(string strApplnNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, Appln_No, Process, Action, Data_Date, User_ID";
                strQuery = strQuery + " From TBL_HISTORY_LE_2013 ";
                strQuery = strQuery + " Where Appln_No = " + strApplnNo + "";

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
        public DataSet DisplayHistoryTR(string strApplnNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, Appln_No, Process, Action, Data_Date, User_ID";
                strQuery = strQuery + " From TBL_HISTORY_TR_2013 ";
                strQuery = strQuery + " Where Appln_No = " + strApplnNo + "";

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
        public void UpdateHistory(string strApplnNo, string strProcess, string strAction, string strUserID)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Insert into TBL_HISTORY(Application_Id, Process, Action, user_ID) Values(";
                strQuery = strQuery + " '" + strApplnNo + "', '" + strProcess + "', '" + strAction + "', '" + strUserID + "')";
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
                objCommon = null;
            }
        }
        public void UpdateMailStatus(string strApplnNo, string strStatus)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set MailSent = '" + strStatus + "'";
                strQuery += " Where ID = '" + strApplnNo + "'";
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
                objCommon = null;
            }
        }
        public void UpdateAllocationHistory(string strApplnNo, string strCollege, string strDept, string strAllocatedby)
        {
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {
                strQuery = "Insert into Tbl_RG_History(Appln_no, Dept, College, Seat_Allocated_By, Seat_Allocated_Date) Values(";
                strQuery = strQuery + " '" + strApplnNo + "', '" + strDept + "',";
                strQuery = strQuery + "  '" + strCollege + "', '" + strAllocatedby + "',  '" + DateTime.Now.ToString() + "')";
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
        public DataSet SearchData(string StrCategory, string strApplnNo, string strCollege, string strDeptApproved, string strApplnStatus, string strRegNo, string strSNRNo, string strUserType, string strDate)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, FullName, dept_Approved, Degree, Registration_Number, Department, college_name, Marks,";
                strQuery = strQuery + "  Polytechnic_Address, college_name, Third_semester, Fourth_Semester, Fifth_semester, Sixth_Semester, ";
                strQuery = strQuery + " case Sixth_Semester when '0' then (select round(((Third_Semester+ Fourth_Semester+ Fifth_semester)/3),2) from TBL_LE_REGISTRATION_2013 te where te.id=tr.id)";
                strQuery = strQuery + " else (select round(((Third_Semester+ Sixth_Semester+ Fourth_Semester+ Fifth_semester)/4),2) as Avg2 from TBL_LE_REGISTRATION_2013 te where te.id=tr.id)";
                strQuery = strQuery + " end as Average,";


                //For Link and Lable OF status(Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";


                    //For Link and Lable OF status (Approve)
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                }
                //-------------------------------
                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";
                    strQuery = strQuery + " OverrideEnablelbl='True',";

                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                    strQuery = strQuery + " OverrideEnablelbl='False',";
                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                strQuery = strQuery + " Case Approval_Status when '0' then 'Selected' when '1' then 'Rejected' when '2' then 'Waiting' when '3' then 'Allocated' when '4' then 'Enquired' when '5' then 'Registered' end As [Status], ";
                strQuery = strQuery + " Case IsUpdated when 'True' then 'Waiting for Approval' when 'False' then 'Registered' end As [Updated_Status],";
                strQuery = strQuery + " Approved_By , convert(varchar,Approved_Date,100) As Approved_Date,";
                strQuery = strQuery + " Updated_By , convert(varchar,Updated_Date,100) As Updated_Date,SnrNo ";
                strQuery = strQuery + " From TBL_LE_REGISTRATION_2013 tr ";
                if (StrCategory == "ApplnNo")
                {
                    if (strUserType == "Reception")
                    {
                        strQuery = strQuery + " Where ID like '201302%" + strApplnNo + "%'";
                    }
                    else
                    {
                        strQuery = strQuery + " Where ID like '%" + strApplnNo + "%'";
                    }
                }
                if (StrCategory == "DeptAllocated")
                {
                    strQuery = strQuery + " Where college_name like '%" + strCollege + "%' and dept_Approved like '%" + strDeptApproved + "%'";
                }
                if (StrCategory == "ApplnStatus")
                {
                    strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%'";
                }
                if (StrCategory == "12thRegNo")
                {
                    strQuery = strQuery + " Where Registration_Number like '%" + strRegNo + "%'";
                }
                if (StrCategory == "College")
                {
                    strQuery = strQuery + " Where college_name like '%" + strCollege + "%'";
                }
                if (StrCategory == "SNRNo")
                {
                    strQuery = strQuery + " Where SnrNo like '%" + strSNRNo + "%'";
                }
                if (StrCategory == "Date")
                {
                    if (strApplnStatus == "0")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Approved_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "1")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Approved_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "2")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Approved_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "3")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Allocated_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "4")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Enquiry_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "5")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Data_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }

                }
                strQuery = strQuery + " order by ID Desc";
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
        public DataSet GetDocs(string strApplnNo)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Select ID, Path_TC, Path_10marks, Path_12marks, Path_Community, Path_DOT,  ";
                strQuery = strQuery + " SportsDoc1, SportsDoc2, SportsDoc3, SportsDoc4, SportsDoc5 ";
                strQuery = strQuery + " From TBL_RG_REGISTRATION_2013 ";
                strQuery = strQuery + " Where ID = '" + strApplnNo + "'";

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

        public long? GetToken()
        {
            string strQuery = null;
            long? maxTokenNo = 0;
            objCommon = new clsCommon();
            SqlConnection connSql = null;
            SqlCommand cmdSql;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Select Id, Token_Date, Token_No  ";
                strQuery = strQuery + " From TBL_TOKEN_RG ";
                strQuery = strQuery + " Where Token_Date = '" + DateTime.Today + "'";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                if (dsData.Tables[0].Rows.Count > 0)
                {
                    strQuery = null;
                    maxTokenNo = Convert.ToInt64(dsData.Tables[0].Rows[0]["Token_No"]) + 1;

                    strQuery = "Update TBL_TOKEN_RG Set Token_No = '" + maxTokenNo + "'";
                    strQuery = strQuery + " Where Token_Date = '" + DateTime.Today + "' ";

                    if (connSql.State != ConnectionState.Open)
                        connSql.Open();
                    cmdSql = new SqlCommand(strQuery, connSql);
                    cmdSql.ExecuteNonQuery();
                    return maxTokenNo;
                }
                else
                {
                    strQuery = "Insert into TBL_TOKEN_RG(Token_Date, Token_No) Values(";
                    strQuery = strQuery + " '" + DateTime.Today + "', '1')";
                    if (connSql.State != ConnectionState.Open)
                        connSql.Open();
                    cmdSql = new SqlCommand(strQuery, connSql);
                    cmdSql.ExecuteNonQuery();
                    return 1;
                }
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
                cmdSql = null;
                maxTokenNo = 0;
            }
        }

        public DataSet SearchRGData(string StrCategory, string strApplnNo, string strCollege, string strDeptApproved, string strApplnStatus, string strRegNo, string strBoard, string strSNRNo, string strUserType, string strDate)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "Select ID, Dept_Approved, College_Name, Marks, School_Name, XII_SchoolName, Cutoff, XII_Board,  ";
                strQuery = strQuery + " Case Examination_Appeared When 1 Then 'Appearing' When 2 Then 'Appeared' End As [Examination_Appeared],  ";
                strQuery = strQuery + " XII_Board, (CAST(Fullname AS varchar(50))+' '+CAST(lastname AS varchar(50))) AS FullName, pYear, Updated_By , Convert(varchar,Approved_Date,100) As Approved_Date, ";
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status], ";
                strQuery = strQuery + " Approved_By, School_Name, Convert(varchar,Updated_Date,100) As Updated_Date, ";
                strQuery = strQuery + " Case IsUpdated when 'True' then 'Waiting for Approval' when 'False' then 'Registered' end As [Updated_Status],";

                //For Link and Lable OF status (Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";

                    //For Link and Lable OF status (Approve)               
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                }
                //-------------------------------

                strQuery = strQuery + " case Docs_Uploaded when '1' then '----' else 'Uploaded' end as [Doc_Status], ";
                //Comment on 25/03/2013
                //strQuery = strQuery + " Registration_Number, Mark3, Mark4, Mark6, Total_Marks, Physics_Marks, Chemistry_Marks, Maths_Marks, ";
                strQuery = strQuery + " Registration_Number,  Total_Marks, Physics_Marks, Chemistry_Marks, Maths_Marks, ";
                strQuery = strQuery + " RevisionTest_Physics, RevisionTest_Chemistry, RevisionTest_Maths, RevisionTest_Total, ";

                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";
                    strQuery = strQuery + " OverrideEnablelbl='True',";
                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                    strQuery = strQuery + " OverrideEnablelbl='False',";
                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                //Comment on 25/03/2013
                //strQuery = strQuery + " Total,SnrNo From TBL_RG_REGISTRATION_2013 tr Left Outer Join Tn_12result_2013 Tn ";
                strQuery = strQuery + " SnrNo From TBL_RG_REGISTRATION_2013 tr ";
                //Comment on 25/03/2013
                //strQuery = strQuery + " On Tr.Registration_Number = Tn.RegNo ";

                if (StrCategory == "PageLoad")
                {
                    strQuery = strQuery + " Order By STATUS Asc";
                }
                if (StrCategory == "ApplnNo")
                {
                    if (strUserType == "Reception")
                    {
                        strQuery = strQuery + " Where ID = '" + strApplnNo + "' order by ID Desc";
                    }
                    else
                    {
                        strQuery = strQuery + " Where ID like '%" + strApplnNo + "%' order by ID Desc";
                    }
                }
                if (StrCategory == "DeptAllocated")
                {
                    strQuery = strQuery + " Where College_Name like '%" + strCollege + "%' and Dept_Approved like '%" + strDeptApproved + "%' Order By Approval_Status Asc";
                }
                if (StrCategory == "ApplnStatus")
                {
                    //strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and College_Name like '%" + strCollege + "%' and Dept_Approved like '%" + strDeptApproved + "%' Order By Approval_Status Asc";
                    strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' Order By Approval_Status Asc";
                }
                if (StrCategory == "12thRegNo")
                {
                    strQuery = strQuery + " Where Registration_Number like '%" + strRegNo + "%'";
                }
                if (StrCategory == "College")
                {
                    strQuery = strQuery + " Where College_Name like '%" + strCollege + "%' Order By Approval_Status Asc";
                }
                if (StrCategory == "Board")
                {
                    strQuery = strQuery + " Where XII_Board like '%" + strBoard + "%'";
                }
                if (StrCategory == "SNRNo")
                {
                    strQuery = strQuery + " Where SnrNo like '%" + strSNRNo + "%'";
                }
                if (StrCategory == "Date")
                {
                    if (strApplnStatus == "0")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Approved_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "1")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Approved_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "2")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Approved_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "3")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Allocated_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "4")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Enquiry_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }
                    else if (strApplnStatus == "5")
                    {
                        strQuery = strQuery + " Where Approval_Status like '%" + strApplnStatus + "%' and convert(varchar,Data_Date,103)='" + strDate + "' Order By Approval_Status Asc";
                    }

                }
                //strQuery = strQuery + " order by ID Desc";
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
        public DataSet SearchbyMarks(string StrCategory, string strFrom, string strTo, string strUserType)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                strQuery = " Select ID, FullName, dept_Approved, Degree, Registration_Number, Department, college_name, Marks,";
                strQuery = strQuery + "  Polytechnic_Address, college_name, Third_semester, Fourth_Semester, Fifth_semester, Sixth_Semester, ";
                strQuery = strQuery + " case Sixth_Semester when '0' then (select round(((Third_Semester+ Fourth_Semester+ Fifth_semester)/3),2) from TBL_LE_REGISTRATION_2013 te where te.id=tr.id)";
                strQuery = strQuery + " else (select round(((Third_Semester+ Sixth_Semester+ Fourth_Semester+ Fifth_semester)/4),2) as Avg2 from TBL_LE_REGISTRATION_2013 te where te.id=tr.id)";
                strQuery = strQuery + " end as Average,";


                //For Link and Lable OF status(Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";

                    //For Link and Lable OF status (Approve)
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                    //-------------------------------
                }
                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";
                    strQuery = strQuery + " OverrideEnablelbl='True',";

                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                    strQuery = strQuery + " OverrideEnablelbl='False',";

                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                strQuery = strQuery + " Case Approval_Status when '0' then 'Selected' when '1' then 'Rejected' when '2' then 'Waiting' when '3' then 'Allocated' when '4' then 'Enquired' when '5' then 'Registered' end As [Status], ";
                strQuery = strQuery + " Case IsUpdated when 'True' then 'Waiting for Approval' when 'False' then 'Registered' end As [Updated_Status],";
                strQuery = strQuery + " Approved_By , convert(varchar,Approved_Date,100) As Approved_Date,";
                strQuery = strQuery + " Updated_By , convert(varchar,Updated_Date,100) As Updated_Date,SnrNo ";
                strQuery = strQuery + " From TBL_LE_REGISTRATION_2013 tr ";
                if (StrCategory == "Marks")
                {
                    strQuery = strQuery + " Where Marks between '" + strFrom + "' and '" + strTo + "' order by Marks Desc";
                }
                if (StrCategory == "Percentage")
                {
                    strQuery = strQuery + " Where ";
                    strQuery = strQuery + " (select case Sixth_Semester when '0' then (select round(((Third_Semester+ Fourth_Semester+ Fifth_semester)/3),2) ";
                    strQuery = strQuery + " from TBL_LE_REGISTRATION_2013 te where te.id=tr.id) else (select round(((Third_Semester+ Sixth_Semester+ Fourth_Semester+ ";
                    strQuery = strQuery + " Fifth_semester)/4),2) as Avg2 from TBL_LE_REGISTRATION_2013 te where te.id=tr.id) end as Average)";
                    strQuery = strQuery + " between '" + strFrom + "' and '" + strTo + "' order by Average Desc";
                }

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
        public DataSet SearchbyMarksRG(string StrCategory, string strFrom, string strTo, string strUserType)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());

                //strQuery = " Select ID, Registration_Number, dept_Approved, college_name, Marks, School_Name, XII_SchoolName, ";
                //strQuery = strQuery + " case Examination_Appeared when 1 then 'Appearing' when 2 then 'Appeared' end as [Examination_Appeared], ";
                //strQuery = strQuery + " XII_Board, FullName, case Examination_Appeared when 1 then ";
                //strQuery = strQuery + " (select RevisionTest_Total from TBL_RG_REGISTRATION_2013 te where te.id=tr.id) ";
                //strQuery = strQuery + " else (select Total_Marks from TBL_RG_REGISTRATION_2013 te where te.id=tr.id) end as [12percent], ";

                //strQuery = strQuery + " case XII_Board when 'Central Board' then case Examination_Appeared when 1 then";
                //strQuery = strQuery + " (select (((cast((RevisionTest_Physics) as decimal(18,2))+cast((RevisionTest_Chemistry) as decimal(18,2)))/2.00)+cast((RevisionTest_Maths) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                //strQuery = strQuery + " where te.id=tr.id) else (select (((cast((Physics_Marks) as decimal(18,2))+cast((Chemistry_Marks) as decimal(18,2)))/2.00)+cast((Maths_Marks) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                //strQuery = strQuery + " where te.id=tr.id) end else case Examination_Appeared when 1 then";
                //strQuery = strQuery + " (select (((cast((RevisionTest_Physics) as decimal(18,2))+cast((RevisionTest_Chemistry) as decimal(18,2)))/4.00)+cast((RevisionTest_Maths/2.00) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                //strQuery = strQuery + " where te.id=tr.id) else (select (((cast((Physics_Marks) as decimal(18,2))+cast((Chemistry_Marks) as decimal(18,2)))/4.00)+cast((Maths_Marks/2.00) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                //strQuery = strQuery + " where te.id=tr.id) end end as [CutOff],";

                //strQuery = strQuery + " Case Approval_Status when '0' then 'Selected' when '1' then 'Rejected' when '2' then 'Waiting' when '3' then 'Allocated' when '4' then 'Enquired' when '5' then 'Registered' end As [Status], ";
                //strQuery = strQuery + " Case IsUpdated when 'True' then 'Waiting for Approval' when 'False' then 'Registered' end As [Updated_Status],";
                //strQuery = strQuery + " Approved_By , convert(varchar,Approved_Date,100) As Approved_Date,";
                //strQuery = strQuery + " Updated_By , convert(varchar,Updated_Date,100) As Updated_Date";
                //strQuery = strQuery + " From TBL_RG_REGISTRATION_2013 tr ";

                strQuery = "Select ID, Dept_Approved, College_Name, Marks, School_Name, XII_SchoolName,  ";
                strQuery = strQuery + " Case Examination_Appeared When 1 Then 'Appearing' When 2 Then 'Appeared' End As [Examination_Appeared],  ";
                strQuery = strQuery + " XII_Board, FullName, pYear, Updated_By , Convert(varchar,Approved_Date,100) As Approved_Date, ";
                strQuery = strQuery + " Case Approval_Status When '0' Then 'Selected' When '1' Then 'Rejected' When '2' Then 'Waiting' ";
                strQuery = strQuery + " When '3' Then 'Allocated' When '4' Then 'Enquired' When '5' Then 'Registered' When '6' Then 'Cancelled' End As [Status], ";
                strQuery = strQuery + " Approved_By, School_Name, Convert(varchar,Updated_Date,100) As Updated_Date, ";
                strQuery = strQuery + " case Docs_Uploaded when '1' then '----' else 'Uploaded' end as [Doc_Status], ";
                strQuery = strQuery + " Case IsUpdated when 'True' then 'Waiting for Approval' when 'False' then 'Registered' end As [Updated_Status],";

                //For Link and Lable OF status(Allocate)
                if (strUserType == "Secretary")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Allocate'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";
                    strQuery = strQuery + " AllocateEnable='False',AllocateEnablelbl='False', ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";
                    strQuery = strQuery + " ApproveEnable='False',ApproveEnablelbl='False', ";
                }
                else
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Completed'";
                    strQuery = strQuery + " When '3' Then 'Completed' When '4' Then 'Allocate' When '5' Then 'Allocate'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [AllocateText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AllocateEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [AllocateEnablelbl], ";


                    //For Link and Lable OF status (Approve)
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'Completed' When '1' Then 'Completed' When '2' Then 'Approve'";
                    strQuery = strQuery + " When '3' Then 'Approve' When '4' Then 'Approve' When '5' Then 'Approve'";
                    strQuery = strQuery + " When '6' Then 'Completed' End As [ApproveText],";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'True'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'True' When '5' Then 'True'";
                    strQuery = strQuery + " When '6' Then 'False' End As [ApproveEnable], ";

                    strQuery = strQuery + " Case Approval_Status When '0' Then 'True' When '1' Then 'True' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'False' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'True' End As [ApproveEnablelbl], ";
                    //-------------------------------
                }
                if (strUserType == "Supreme Admin")
                {
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'True' else 'False' end as [EditSNRNoEnablelbl],";
                    strQuery = strQuery + " case ISNULL(SnrNo, 'NULLVALUE') when 'NULLVALUE' then 'False' else 'True' end as [EditSNRNoEnable],";
                    strQuery = strQuery + " OverrideEnablelbl='True',";
                }
                else
                {
                    strQuery = strQuery + " EditSNRNoEnablelbl='True',EditSNRNoEnable='False',";
                    strQuery = strQuery + " OverrideEnablelbl='False',";
                }
                if (strUserType == "Admin")
                {
                    strQuery = strQuery + " Case Approval_Status When '0' Then 'False' When '1' Then 'False' When '2' Then 'False'";
                    strQuery = strQuery + " When '3' Then 'True' When '4' Then 'False' When '5' Then 'False'";
                    strQuery = strQuery + " When '6' Then 'False' End As [AdminWaitingEnable],";
                }
                else
                {
                    strQuery = strQuery + " AdminWaitingEnable='False',";
                }
                strQuery = strQuery + " Registration_Number, Mark3, Mark4, Mark6, Total_Marks, Physics_Marks, Chemistry_Marks, Maths_Marks, ";
                strQuery = strQuery + " RevisionTest_Physics, RevisionTest_Chemistry, RevisionTest_Maths, RevisionTest_Total, ";
                strQuery = strQuery + " Total,SnrNo From TBL_RG_REGISTRATION_2013 tr Left Outer Join Tn_12result_2012 Tn ";
                strQuery = strQuery + " On Tr.Registration_Number = Tn.RegNo ";

                if (StrCategory == "Marks")
                {
                    strQuery = strQuery + " Where Marks between '" + strFrom + "' and '" + strTo + "' order by Marks Desc";
                }
                if (StrCategory == "Percentage")
                {
                    strQuery = strQuery + " Where ";
                    strQuery = strQuery + " (Select case Examination_Appeared when 1 then   ";
                    strQuery = strQuery + " (select RevisionTest_Total from TBL_RG_REGISTRATION_2013 te where te.id=tr.id) else ( ";
                    strQuery = strQuery + " select Total_Marks from TBL_RG_REGISTRATION_2013 te where te.id=tr.id) end as [12percent]) ";
                    strQuery = strQuery + " between '" + strFrom + "' and '" + strTo + "' order by [12percent] Desc";
                }
                if (StrCategory == "CutOFF")
                {
                    strQuery = strQuery + " Where ";
                    //strQuery = strQuery + " (select ";
                    //strQuery = strQuery + " case XII_Board when 'Central Board' then case Examination_Appeared when 1 then";
                    //strQuery = strQuery + " (select (((cast((RevisionTest_Physics) as decimal(18,2))+cast((RevisionTest_Chemistry) as decimal(18,2)))/2.00)+cast((RevisionTest_Maths) as decimal(18,2))) from TBL_RG_REGISTRATION_2013 te ";
                    //strQuery = strQuery + " where te.id=tr.id) else (select (((cast((Physics_Marks) as decimal(18,2))+cast((Chemistry_Marks) as decimal(18,2)))/2.00)+cast((Maths_Marks) as decimal(18,2))) from tbl_RG_registration te ";
                    //strQuery = strQuery + " where te.id=tr.id) end else case Examination_Appeared when 1 then";
                    //strQuery = strQuery + " (select (((cast((RevisionTest_Physics) as decimal(18,2))+cast((RevisionTest_Chemistry) as decimal(18,2)))/4.00)+cast((RevisionTest_Maths/2.00) as decimal(18,2))) from tbl_RG_registration te ";
                    //strQuery = strQuery + " where te.id=tr.id) else (select (((cast((Physics_Marks) as decimal(18,2))+cast((Chemistry_Marks) as decimal(18,2)))/4.00)+cast((Maths_Marks/2.00) as decimal(18,2))) from tbl_RG_registration te ";
                    //strQuery = strQuery + " where te.id=tr.id) end end as [CutOff]";
                    //strQuery = strQuery + " )";

                    strQuery = strQuery + " CutOff between '" + strFrom + "' and '" + strTo + "' Order By Cutoff Desc ";
                }

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
        public DataTable GetCountry()
        {
            string strQuery;
            DataTable dtData = new DataTable();
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " Country_name, Country_ID";
                strQuery = strQuery + " From tbl_country_list";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);

                dtData.Columns.Add("Text");
                dtData.Columns.Add("Value");
                dtData.Rows.Add();
                dtData.Rows[0][0] = "--Select Country--";
                dtData.Rows[0][1] = "0";

                for (int k = 0; k < dsData.Tables[0].Rows.Count; k++)
                {
                    dtData.Rows.Add();
                    for (int i = 0; i < dsData.Tables[0].Columns.Count; i++)
                    {
                        dtData.Rows[k + 1][i] = dsData.Tables[0].Rows[k][i].ToString();
                    }
                }
                return dtData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                strQuery = null;
                Params = null;
                dsData = null;
            }
        }
        public DataTable GetState(string strCountry)
        {
            string strQuery;
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " State_name, Country_ID, State_ID";
                strQuery = strQuery + " From tbl_state_list";
                strQuery = strQuery + " where country_ID = '" + strCountry + "'";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                if (dsData.Tables[0].Rows.Count > 0)
                {
                    dtData.Columns.Add("State_name");
                    dtData.Columns.Add("Country_ID");
                    dtData.Columns.Add("State_ID");

                    dtData.Rows.Add();
                    dtData.Rows[0]["State_name"] = "..Select..";
                    dtData.Rows[0]["Country_ID"] = "0";
                    dtData.Rows[0]["State_ID"] = "0";

                    for (int i = 0; i < dsData.Tables[0].Rows.Count; i++)
                    {
                        dtData.Rows.Add();
                        dtData.Rows[i + 1]["State_name"] = dsData.Tables[0].Rows[i]["State_name"];
                        dtData.Rows[i + 1]["Country_ID"] = dsData.Tables[0].Rows[i]["Country_ID"];
                        dtData.Rows[i + 1]["State_ID"] = dsData.Tables[0].Rows[i]["State_ID"];

                    }
                }
                return dtData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                dtData = null;
                strQuery = null;
                Params = null;
                dsData = null;
            }
        }
        //Get Course Type
        public DataSet GetCourseType(string strCourse,string strType)
        {
            string strQuery;
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " Degree from t_Course_Type where Course='" + strCourse + "' and DegreeType ='" + strType + "'";              
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
                dtData = null;
                strQuery = null;
                Params = null;
                dsData = null;
            }
        }
        //Get only state
        public DataTable GetStateAlone()
        {
            string strQuery;
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " State_name, Country_ID, State_ID";
                strQuery = strQuery + " From tbl_state_list";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                if (dsData.Tables[0].Rows.Count > 0)
                {
                    dtData.Columns.Add("State_name");
                    dtData.Columns.Add("State_ID");

                    dtData.Rows.Add();
                    dtData.Rows[0]["State_name"] = "--Select State--";
                    dtData.Rows[0]["State_ID"] = "0";

                    for (int i = 0; i < dsData.Tables[0].Rows.Count; i++)
                    {
                        dtData.Rows.Add();
                        dtData.Rows[i + 1]["State_name"] = dsData.Tables[0].Rows[i]["State_name"];
                        dtData.Rows[i + 1]["State_ID"] = dsData.Tables[0].Rows[i]["State_ID"];

                    }
                }

                return dtData;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                dtData = null;
                strQuery = null;
                Params = null;
                dsData = null;
            }
        }
        public DataTable GetCountryAlone()
        {
            string strQuery;
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " COUNTRY_NAME";
                strQuery = strQuery + " From TBL_COUNTRY_LIST";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                if (dsData.Tables[0].Rows.Count > 0)
                {

                    dtData.Columns.Add("COUNTRY_NAME");

                    dtData.Rows.Add();
                    dtData.Rows[0]["COUNTRY_NAME"] = "--Select Country--";
                    //dtData.Rows[0]["COUNTRY_NAME"] = "0";

                    for (int i = 0; i < dsData.Tables[0].Rows.Count; i++)
                    {
                        dtData.Rows.Add();
                        dtData.Rows[i + 1]["COUNTRY_NAME"] = dsData.Tables[0].Rows[i]["COUNTRY_NAME"];

                    }
                }

                return dtData;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                dtData = null;
                strQuery = null;
                Params = null;
                dsData = null;
            }
        }
        public DataTable GetCollRequestedName()
        {
            string strQuery;
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " COLL_ID,COLL_NAME";
                strQuery = strQuery + " From T_COLLEGE_NAME";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                if (dsData.Tables[0].Rows.Count > 0)
                {
                    dtData.Columns.Add("COLL_ID");
                    dtData.Columns.Add("COLL_NAME");

                    dtData.Rows.Add();
                    dtData.Rows[0]["COLL_NAME"] = "Sri Sairam";
                    dtData.Rows[0]["COLL_ID"] = "0";

                    for (int i = 0; i < dsData.Tables[0].Rows.Count; i++)
                    {
                        dtData.Rows.Add();
                        dtData.Rows[i + 1]["COLL_NAME"] = dsData.Tables[0].Rows[i]["COLL_NAME"];
                        dtData.Rows[i + 1]["COLL_ID"] = dsData.Tables[0].Rows[i]["COLL_ID"];

                    }
                }

                return dtData;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                dtData = null;
                strQuery = null;
                Params = null;
                dsData = null;
            }
        }
        public DataTable GetCollName()
        {
            string strQuery;
            DataSet dsData = new DataSet();
            SqlParameter[] Params = new SqlParameter[1];
            DataTable dtData = new DataTable();
            try
            {
                strQuery = "Select";
                strQuery = strQuery + " Coll_Name";
                strQuery = strQuery + " From t_COLLEGE";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);
                if (dsData.Tables[0].Rows.Count > 0)
                {

                    dtData.Columns.Add("Coll_Name");

                    dtData.Rows.Add();
                    dtData.Rows[0]["Coll_Name"] = "--Select College Name--";


                    for (int i = 0; i < dsData.Tables[0].Rows.Count; i++)
                    {
                        dtData.Rows.Add();
                        dtData.Rows[i + 1]["Coll_Name"] = dsData.Tables[0].Rows[i]["Coll_Name"];

                    }
                }

                return dtData;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                dtData = null;
                strQuery = null;
                Params = null;
                dsData = null;
            }
        }
        public void UpdateCutOff(string strApplnNo, string strCutOff)
        {
            clsCommon objCmn = new clsCommon();
            string strQuery;
            SqlCommand cmdSql;
            SqlConnection connSql = new SqlConnection(objCmn.GetConnectionString());

            try
            {
                strQuery = "Update TBL_RG_REGISTRATION_2013 Set ";
                strQuery = strQuery + " Cutoff = '" + strCutOff + "' ";
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
                objCmn = null;
            }
        }
        //-----------------------Mayil-------------------------
        public DataSet GetCareer()
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlConnection connSql = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();
            try
            {
                connSql = new SqlConnection(objCommon.GetConnectionString());
                strQuery = "select * from view_all_dept";
                Params[0] = new SqlParameter("@Statement", strQuery.ToString());
                dsData = SqlHelper.ExecuteDataset(objCommon.GetConnectionString(), CommandType.StoredProcedure, "sp_ExecuteSql", Params);

                return dsData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
                return null;
            }
        }
        public DataSet SelectedFaculty(string strSearchKey, string strRegId, string strCollege, string strDept)
        {
            objCommon = new clsCommon();
            string strQuery = null;
            SqlParameter[] Params = new SqlParameter[1];
            DataSet dsData = new DataSet();

            try
            {
                strQuery = "Select * from view_all_dept";
                strQuery = strQuery + " Where Reg_Id = '" + strRegId + "'";

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
                objCommon = null;
                strQuery = null;
            }
        }



        public void ErrorLog(string strApplnNo, string FormName, string Messsage, string strUserID)
        {
            string strQuery;
            SqlCommand cmdSql;
            clsCommon objCommon = new clsCommon();
            SqlConnection connSql = new SqlConnection(objCommon.GetConnectionString());

            try
            {

                string ProjectName = "AF";
                strQuery = "Insert into T_CFG_ERRORLOG(ProjectName,FormName,ErrorDetails,UserName,Data_Date) Values(";
                strQuery = strQuery + " '" + ProjectName + "', '" + FormName + "', '" + strApplnNo +"-"+Messsage + "', '" + strUserID + "',getdate())";
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
                objCommon = null;
            }
        }


        //-----------------------------------------------------
    }
}
