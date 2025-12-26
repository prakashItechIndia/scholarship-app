using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using SD = System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using Sairam_RegularUG.Classes;
using System.Data.SqlClient;
using System.Data;
using SaiAramFoundation.Classes;



namespace SaiAramFoundation
{
    public partial class ImageUpload : System.Web.UI.Page
    {
        String path = HttpContext.Current.Request.PhysicalApplicationPath + "TempImage\\";

        string strDate = "";
        protected void LoadinitialSettings()
        {
            clsCommon objCommon = new clsCommon();
            String strConn = objCommon.GetConnectionString();
            SqlConnection sqlConn = new SqlConnection(strConn);
            SqlCommand SqlCmd;
            SqlDataReader SqlReader;
            try
            {
                SqlCmd = new SqlCommand("select * from T_Scholarship_Year where Status='true'", sqlConn);
                if (sqlConn.State != ConnectionState.Open)
                    sqlConn.Open();
                SqlReader = SqlCmd.ExecuteReader();
                if (SqlReader.Read())
                {
                    Session["AdYearCode"] = SqlReader["ScholarshipYear_Code"].ToString();
                    Session["AdYearName"] = SqlReader["ScholarshipYear_Name"].ToString();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                if (sqlConn.State != ConnectionState.Closed)
                    sqlConn.Close();
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            LoadinitialSettings();
            if (!IsPostBack)
            {
                if (Session["ImageUploadError"] != null)
                {
                    string sScript = "";
                    sScript = String.Format("alert('{0}');", "Image size should not exceed 3 MB.");
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "alert", sScript, true);
                }
                Session["WorkingImage"] = null;
                Session["CroppedImage"] = null;
                Session["ImageUploadError"] = null;
            }
        }
        protected void btnUpload_Click(object sender, EventArgs e)
        {
            if (Upload.FileName == "")
            {
                string sScript = "";
                sScript = String.Format("alert('{0}');", "No file selected.");
                ScriptManager.RegisterStartupScript(this, this.GetType(), "alert", sScript, true);
            }
            else
            {
                float w = 0;
                float h = 0;
                Stream ipStream = Upload.PostedFile.InputStream;
                using (var image = System.Drawing.Image.FromStream(ipStream))
                {
                    w = image.PhysicalDimension.Width;
                    h = image.PhysicalDimension.Height;
                }
                //if (w > 800 || h > 608)
                //{
                //    string sScript = "";
                //    sScript = String.Format("alert('{0}');", "Image dimentions exceeds the limit.");
                //    ScriptManager.RegisterStartupScript(this, this.GetType(), "alert", sScript, true);
                //}
                if (Upload.PostedFile.ContentLength < 3145728)
                {

                    Boolean FileOK = false;

                    Boolean FileSaved = false;



                    if (Upload.HasFile)
                    {

                        Session["WorkingImage"] = Upload.FileName;

                        String FileExtension = Path.GetExtension(Session["WorkingImage"].ToString()).ToLower();

                        String[] allowedExtensions = { ".png", ".jpeg", ".jpg", ".gif" };

                        for (int i = 0; i < allowedExtensions.Length; i++)
                        {

                            if (FileExtension == allowedExtensions[i])
                            {

                                FileOK = true;

                            }

                        }

                    }



                    if (FileOK)
                    {

                        try
                        {

                            Upload.PostedFile.SaveAs(path + Session["WorkingImage"]);

                            FileSaved = true;

                        }

                        catch (Exception ex)
                        {

                            lblError.Text = "File could not be uploaded." + ex.Message.ToString();

                            lblError.Visible = true;

                            FileSaved = false;

                        }

                    }

                    else
                    {

                        lblError.Text = "Cannot accept files of this type.";

                        lblError.Visible = true;

                    }



                    if (FileSaved)
                    {

                        pnlUpload.Visible = false;

                        pnlCrop.Visible = true;

                        imgCrop.ImageUrl = "TempImage/" + Session["WorkingImage"].ToString();

                    }
                }
                else
                {
                    //Response.Write("<script type='text/javascript'>alert('Image size should not exceed 3 MB')</script>");
                    Session["ImageUploadError"] = "Image size should not exceed 3 MB";
                    Response.Redirect("ImageUpload.aspx", false);
                }
            }
        }
        protected void btnCrop_Click(object sender, EventArgs e)
        {

            //jegan
            strDate = DateTime.Now.ToString();
            strDate = strDate.Replace(":", "");
            strDate = strDate.Replace("/", "");
            strDate = strDate.Replace(" ", "");

            //--

            string ImageName = Session["WorkingImage"].ToString();

            int w = Convert.ToInt32(W.Value);

            int h = Convert.ToInt32(H.Value);

            int x = Convert.ToInt32(X.Value);

            int y = Convert.ToInt32(Y.Value);



            byte[] CropImage = Crop(path + ImageName, w, h, x, y);

            using (MemoryStream ms = new MemoryStream(CropImage, 0, CropImage.Length))
            {

                ms.Write(CropImage, 0, CropImage.Length);

                using (SD.Image CroppedImage = SD.Image.FromStream(ms, true))
                {

                    string SaveTo = path + "crop" + strDate + ImageName;

                    CroppedImage.Save(SaveTo, CroppedImage.RawFormat);

                    pnlCrop.Visible = false;

                    pnlCropped.Visible = true;
                    pnlProceed.Visible = true;

                    imgCropped.ImageUrl = "TempImage/crop" + strDate + ImageName;
                }

            }

        }
        static byte[] Crop(string Img, int Width, int Height, int X, int Y)
        {

            try
            {

                using (SD.Image OriginalImage = SD.Image.FromFile(Img))
                {

                    using (SD.Bitmap bmp = new SD.Bitmap(Width, Height))
                    {

                        bmp.SetResolution(OriginalImage.HorizontalResolution, OriginalImage.VerticalResolution);

                        using (SD.Graphics Graphic = SD.Graphics.FromImage(bmp))
                        {

                            Graphic.SmoothingMode = SmoothingMode.AntiAlias;

                            Graphic.InterpolationMode = InterpolationMode.HighQualityBicubic;

                            Graphic.PixelOffsetMode = PixelOffsetMode.HighQuality;

                            Graphic.DrawImage(OriginalImage, new SD.Rectangle(0, 0, Width, Height), X, Y, Width, Height, SD.GraphicsUnit.Pixel);

                            MemoryStream ms = new MemoryStream();

                            bmp.Save(ms, OriginalImage.RawFormat);

                            return ms.GetBuffer();

                        }

                    }

                }

            }

            catch (Exception Ex)
            {

                throw (Ex);

            }

        }

        protected void btnUndo_Click(object sender, EventArgs e)
        {
            Page_Load(sender, e);
            // imgCrop.ImageUrl = "images/" + Session["WorkingImage"].ToString();
        }

        protected void btnContinue_Click(object sender, EventArgs e)
        {
            Session["CroppedImage"] = imgCropped.ImageUrl.ToString();
            Response.Redirect("RG_Admission_New.aspx", true);
        }
    }
}
