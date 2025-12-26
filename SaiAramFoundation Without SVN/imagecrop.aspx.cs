using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Drawing;


namespace SaiAramFoundation
{
    public partial class imagecrop : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //if (!this.IsPostBack)
            //{
            //    //this.ImageUpload1.CropConstraint = new FixedCropConstraint(300, 200);
            //    //this.ImageUpload1.PreviewFilter = new FixedResizeConstraint(200, 200, Color.Black);

            //    //this.ImageUpload2.PostProcessingFilter = new ScaledResizeConstraint(300, 300);

                
            //}

        }

        //protected void btnLoadImage_Click(object sender, EventArgs e)
        //{
        //    this.ImageUpload1.LoadImageFromFileSystem("~/App_Data/source/trevi1.jpg");
        //}
        //protected void btnCrop_Click(object sender, EventArgs e)
        //{

        //    //If ImageResizing.net is installed, we can just use CroppedUrl from now on
        //    Result.Visible = true;
        //    Result.ImageUrl = CropImage1.CroppedUrl;

        //    //If not, we can save out a copy
        //    CropImage1.Crop(MapPath("~/images/basic-cropped"), true);

        //    //We can also access the coordinates
        //    this.Title = CropImage1.X + "," + CropImage1.Y + "," + CropImage1.X2 + "," + CropImage1.Y2;

        //}

        //protected void btnCrop_Click(object sender, EventArgs e)
        //{
        //    //We're assuming the default names are used here - Button1, Image1, CropImage1, Button2, Image2, CropImage2, etc.
        //    //Find the cropimage instance near the clicked button
        //    CropImage ci = this.FindControl(((Button)sender).ID.Replace("Button", "CropImage")) as CropImage;


        //    //Show the image using the CroppedUrl property
        //    result.ImageUrl = ci.CroppedUrl;
        //    result.Visible = true;

        //    //Save an unneccesary copy of the file out with Crop(), just to show we can
        //    ci.Crop(MapPath("~/images/last-cropped"), true);

        //    //Tell user about it
        //    message.Text = "Crop successful. (copy saved to /images/last-cropped.jpg/png)";
        //    coords.Text = "Final Coordinates:" + ci.X + "," + ci.Y + "," + ci.X2 + "," + ci.Y2 + "  XUnits:" + ci.CropXUnits + ", YUnits:" + ci.CropYUnits;
        //    cropped.NavigateUrl = ci.CroppedUrl;
        //    cropped.Text = "Dynamic URL: " + ci.CroppedUrl;


        //}

        protected void btnCrop_Click(object sender, EventArgs e)
        {

            ////If ImageResizing.net is installed, we can just use CroppedUrl from now on
            //Result.Visible = true;
            //Result.ImageUrl = CropImage1.CroppedUrl;

            ////If not, we can save out a copy
            //CropImage1.Crop(MapPath("~/images/basic-cropped"), true);

            ////We can also access the coordinates
            //this.Title = CropImage1.X + "," + CropImage1.Y + "," + CropImage1.X2 + "," + CropImage1.Y2;

        }
        protected void FileUploadComplete(object sender, EventArgs e)
        {
            try
            {
               // string filename = System.IO.Path.GetFileName(afuImage.FileName);
               // afuImage.SaveAs(Server.MapPath(".") + "/tempImage/" + filename);
               // imgDisplay.ImageUrl = Server.MapPath(".") + "/tempImage/" + filename;
               //// CropImage1.Image = imgDisplay.ImageUrl;

               // CropImage1.ImageID = "imgDisplay" ;
            }
            catch (Exception ex)
            {
                throw;
            }
           // afuImage.SaveAs("D:/VSS/Sairam_Registration/sairam/Admission13/tempImage" + filename);
            //CropImage1.Image = imgDisplay.ImageUrl;
        }
    }
}
