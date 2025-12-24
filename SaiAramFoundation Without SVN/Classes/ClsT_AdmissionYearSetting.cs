using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;

namespace SaiAramFoundation.Classes
{
    public class ClsT_ScholarshipYearSetting
    {
        public long ScholarshipYearId { get; set; }
        public string ScholarshipYearCode { get; set; }
        public string ScholarshipYearName { get; set; }
        public string ScholarshipYearMailId { get; set; }
        public string ScholarshipYearReplyMailId { get; set; }
        public string ScholarshipYearCCMailId { get; set; }
        public string ScholarshipYearBCCMailId { get; set; }
        public string ScholarshipYearMailSubject { get; set; }
        public bool Status { get; set; }
        public bool DeleteFlag { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
