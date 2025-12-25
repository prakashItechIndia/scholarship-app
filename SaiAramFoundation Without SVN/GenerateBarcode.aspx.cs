using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SaiAramFoundation.Classes;
using Telerik.Web.UI;

namespace SaiAramFoundation
{
    public partial class GenerateBarcode : System.Web.UI.Page
    {
        clsCommon objCommon = new clsCommon();
        protected void Page_Load(object sender, EventArgs e)
        {
            Generate_Barcode();
        }

        void Generate_Barcode()
        {
            string strConnectionString = objCommon.GetConnectionString();
            SqlConnection connSql = new SqlConnection(strConnectionString);
            SqlCommand cmd = new SqlCommand();
            try
            {
                cmd.CommandText = "Select Application_Id from t_Registration";
                cmd.Connection = connSql;
                if (connSql.State != ConnectionState.Open)
                    connSql.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    //-------Rad bar code
                    string imagename = dr["Application_Id"].ToString() + "_Barcode.png";
                    RadBarcode barcode = new RadBarcode();
                    barcode.Text = dr["Application_Id"].ToString();
                    barcode.Type = Telerik.Web.UI.BarcodeType.Code128;
                    barcode.LineWidth = 2;
                    RadBinaryImage image = new RadBinaryImage();
                    // PlaceHolder1.Controls.Add(image);
                    System.IO.MemoryStream stream = new System.IO.MemoryStream();
                    barcode.GetImage().Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                    //barcode.GetImage().Save(Server.MapPath("~/BarcodeImage/") + imagename);
                    image.DataValue = stream.ToArray();

                    File.WriteAllBytes(Server.MapPath(".") + "/BarcodeImage/" + imagename, stream.GetBuffer());
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}