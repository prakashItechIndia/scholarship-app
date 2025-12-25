using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using AjaxControlToolkit;
using System.Collections.Specialized;

namespace Sairam_RegularUG.Webservice
{
    /// <summary>
    /// Summary description for DropdownLoad1
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]  
    [System.Web.Script.Services.ScriptService] 
    public class DropdownLoad1 : System.Web.Services.WebService
    {

        [WebMethod]
        public CascadingDropDownNameValue[] BindCollege(string knownCategoryValues, string category)
        {
            List<CascadingDropDownNameValue> CollegeCategorydetails = new List<CascadingDropDownNameValue>();
            CollegeCategorydetails.Add(new CascadingDropDownNameValue("Sairam Engineering College", "1"));
            CollegeCategorydetails.Add(new CascadingDropDownNameValue("Sairam Institute of Technology", "2"));
            CollegeCategorydetails.Add(new CascadingDropDownNameValue("Sri Sai Ram College of Engineering", "3"));
            return CollegeCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindDepartment(string knownCategoryValues, string category)
        {

            int CollegeCategoryID;
            //This method will return a StringDictionary containing the name/value pairs of the currently selected values
            StringDictionary CollegeCategorydetails = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
            CollegeCategoryID = Convert.ToInt32(CollegeCategorydetails["CollegeCategory"]);

            //create list and add items in it by looping through dataset table  
            List<CascadingDropDownNameValue> Departmentdetails = new List<CascadingDropDownNameValue>();

            string[] strSSEC = { "CSE", "Civil", "ECE", "EEE", "EIE", "ICE", "IT", "Mech", "Production Engg" };
            string[] strSSIT = { "CSE", "ECE", "EEE", "IT", "Mech", "Civil" };
            string[] strSSECBglr = { "CSE", "ECE", "EEE", "Mech" };

            if (CollegeCategoryID == 1)
            {
                for (int i = 0; i < strSSEC.Length; i++)
                {
                    Departmentdetails.Add(new CascadingDropDownNameValue(strSSEC[i], Convert.ToString(i)));
                }
            }
            if (CollegeCategoryID == 2)
            {
                for (int i = 0; i < strSSIT.Length; i++)
                {
                    Departmentdetails.Add(new CascadingDropDownNameValue(strSSIT[i], Convert.ToString(i)));
                }
            }
            if (CollegeCategoryID == 3)
            {
                for (int i = 0; i < strSSECBglr.Length; i++)
                {
                    Departmentdetails.Add(new CascadingDropDownNameValue(strSSECBglr[i], Convert.ToString(i)));
                }
            }

            return Departmentdetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindMark(string knownCategoryValues, string category)
        {
            List<CascadingDropDownNameValue> MarkCategorydetails = new List<CascadingDropDownNameValue>();
            MarkCategorydetails.Add(new CascadingDropDownNameValue("12th Std (%)", "1"));
            MarkCategorydetails.Add(new CascadingDropDownNameValue("10th Std (%)", "2"));
            MarkCategorydetails.Add(new CascadingDropDownNameValue("CutOff Marks", "3"));
            return MarkCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindFromMark(string knownCategoryValues, string category)
        {
            int MarkCategoryID;
            int j = 1;
            StringDictionary MarkCategorydetails = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
            MarkCategoryID = Convert.ToInt32(MarkCategorydetails["MarkCategory"]);

            List<CascadingDropDownNameValue> FromMarkCategorydetails = new List<CascadingDropDownNameValue>();
            if (MarkCategoryID != 3)
            {
                for (int i = 60; i <= 95; i = i + 5)
                {
                    FromMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j++;
                }
            }
            else
            {
                for (int i = 150; i <= 195; i = i + 5)
                {
                    FromMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j++;
                }
            }
            return FromMarkCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindToMark(string knownCategoryValues, string category)
        {

            int MarkCategoryID;
            int FromMarkCategoryID;
            int j = 1;

            StringDictionary MarkCategorydetails = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
            MarkCategoryID = Convert.ToInt32(MarkCategorydetails["MarkCategory"]);


            StringDictionary FromMarkCategorydetails = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
            FromMarkCategoryID = Convert.ToInt32(FromMarkCategorydetails["FromMarkCategory"]);
            List<CascadingDropDownNameValue> ToMarkCategorydetails = new List<CascadingDropDownNameValue>();

            if (MarkCategoryID != 3)
            {
                if (FromMarkCategoryID == 1)
                {
                    for (int i = 65; i <= 95; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 2)
                {
                    for (int i = 70; i <= 95; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 3)
                {
                    for (int i = 75; i <= 95; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 4)
                {
                    for (int i = 80; i <= 95; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 5)
                {
                    for (int i = 85; i <= 95; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 6)
                {
                    for (int i = 90; i <= 95; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 7)
                {
                    for (int i = 95; i <= 95; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
            }
            else
            {
                if (FromMarkCategoryID == 1)
                {
                    for (int i = 155; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 2)
                {
                    for (int i = 160; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 3)
                {
                    for (int i = 165; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 4)
                {
                    for (int i = 170; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 5)
                {
                    for (int i = 175; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 6)
                {
                    for (int i = 180; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 7)
                {
                    for (int i = 185; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 8)
                {
                    for (int i = 190; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 9)
                {
                    for (int i = 195; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
                else if (FromMarkCategoryID == 10)
                {
                    for (int i = 200; i <= 200; i = i + 5)
                    {
                        ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                        j = j + 1;
                    }
                }
            }
            return ToMarkCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindMarkLE(string knownCategoryValues, string category)
        {
            List<CascadingDropDownNameValue> MarkCategorydetails = new List<CascadingDropDownNameValue>();
            MarkCategorydetails.Add(new CascadingDropDownNameValue("Overall Percentage(%)", "1"));
            MarkCategorydetails.Add(new CascadingDropDownNameValue("10th Std (%)", "2"));
            return MarkCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindFromMarkLE(string knownCategoryValues, string category)
        {
            //int MarkCategoryID;
            int j = 1;
            //StringDictionary MarkCategorydetails = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
            //MarkCategoryID = Convert.ToInt32(MarkCategorydetails["MarkCategory"]);
            List<CascadingDropDownNameValue> FromMarkCategorydetails = new List<CascadingDropDownNameValue>();
            for (int i = 60; i <= 95; i = i + 5)
            {
                FromMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                j++;
            }
            return FromMarkCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindToMarkLE(string knownCategoryValues, string category)
        {
            int FromMarkCategoryID;
            int j = 1;
            StringDictionary FromMarkCategorydetails = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
            FromMarkCategoryID = Convert.ToInt32(FromMarkCategorydetails["FromMarkCategory"]);
            List<CascadingDropDownNameValue> ToMarkCategorydetails = new List<CascadingDropDownNameValue>();
            if (FromMarkCategoryID == 1)
            {
                for (int i = 65; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 2)
            {
                for (int i = 70; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 3)
            {
                for (int i = 75; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 4)
            {
                for (int i = 80; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 5)
            {
                for (int i = 85; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 6)
            {
                for (int i = 90; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 7)
            {
                for (int i = 95; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            return ToMarkCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindMarkTR(string knownCategoryValues, string category)
        {
            List<CascadingDropDownNameValue> MarkCategorydetails = new List<CascadingDropDownNameValue>();
            MarkCategorydetails.Add(new CascadingDropDownNameValue("Overall Percentage(%)", "1"));
            MarkCategorydetails.Add(new CascadingDropDownNameValue("12th Std (%)", "2"));
            return MarkCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindFromMarkTR(string knownCategoryValues, string category)
        {
            //int MarkCategoryID;
            int j = 1;
            //StringDictionary MarkCategorydetails = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
            //MarkCategoryID = Convert.ToInt32(MarkCategorydetails["MarkCategory"]);
            List<CascadingDropDownNameValue> FromMarkCategorydetails = new List<CascadingDropDownNameValue>();
            for (int i = 60; i <= 95; i = i + 5)
            {
                FromMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                j++;
            }
            return FromMarkCategorydetails.ToArray();
        }
        [WebMethod]
        public CascadingDropDownNameValue[] BindToMarkTR(string knownCategoryValues, string category)
        {
            int FromMarkCategoryID;
            int j = 1;
            StringDictionary FromMarkCategorydetails = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
            FromMarkCategoryID = Convert.ToInt32(FromMarkCategorydetails["FromMarkCategory"]);
            List<CascadingDropDownNameValue> ToMarkCategorydetails = new List<CascadingDropDownNameValue>();
            if (FromMarkCategoryID == 1)
            {
                for (int i = 65; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 2)
            {
                for (int i = 70; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 3)
            {
                for (int i = 75; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 4)
            {
                for (int i = 80; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 5)
            {
                for (int i = 85; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 6)
            {
                for (int i = 90; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            else if (FromMarkCategoryID == 7)
            {
                for (int i = 95; i <= 95; i = i + 5)
                {
                    ToMarkCategorydetails.Add(new CascadingDropDownNameValue(Convert.ToString(i), Convert.ToString(j)));
                    j = j + 1;
                }
            }
            return ToMarkCategorydetails.ToArray();
        }
    }
}
