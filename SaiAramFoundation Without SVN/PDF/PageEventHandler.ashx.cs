using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace SaiAramFoundation.PDF
{
    /// <summary>
    /// Summary description for PageEventHandler
    /// </summary>
    public class PageEventHandler : PdfPageEventHelper
    {
        public override void OnStartPage(PdfWriter writer, Document doc)
        {
            iTextSharp.text.Image logo = null;
            try
            {
                string strlogoPath = "";
                strlogoPath = ConfigurationManager.AppSettings["WaterMarkLogo"].ToString();

                //if (ClsCommon.InstitutionCode == StudentPortal.Models.Utilities.Description(StudentPortal.Models.Utilities.Institution.SEC))
                //{
                //   strlogoPath = "/Images/Logo/" + StudentPortal.Models.Utilities.Description(StudentPortal.Models.Utilities.Institutionlogo.WATERMARKSEC);
                //}
                //else if (ClsCommon.InstitutionCode == StudentPortal.Models.Utilities.Description(StudentPortal.Models.Utilities.Institution.SIT))
                //{
                //    strlogoPath = "/Images/Logo/" + StudentPortal.Models.Utilities.Description(StudentPortal.Models.Utilities.Institutionlogo.WATERMARKSIT);
                //}


                logo = Image.GetInstance(HttpContext.Current.Server.MapPath("~" + strlogoPath));


                // logo = iTextSharp.text.Image.GetInstance(HttpContext.Current.Server.MapPath("/Images/Logo/Logo-sairameduin.gif"));


                //PdfContentByte under = writer.DirectContentUnder;
                // BaseFont baseFont = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);

                logo.SetAbsolutePosition(225f, 350f);

                // logo.Width = 50f;

                doc.Add(logo);

                //  under = writer.DirectContent;
                //under.Stroke();






            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
        }
    }
}