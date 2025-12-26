<%@ Page Title="" Language="C#" MasterPageFile="~/RegisterMaster.Master" AutoEventWireup="true"
    CodeBehind="viewdocs.aspx.cs" Inherits="SaiAramFoundation.viewdocs" %>

<%@ Register TagPrefix="Anders" Assembly="Anders.Web.Controls" Namespace="Anders.Web.Controls" %>
<%@ Register Assembly="System.Web.Entity, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
    Namespace="System.Web.UI.WebControls" TagPrefix="asp" %>
<%@ Register TagPrefix="telerik" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<asp:Content ID="Content2" ContentPlaceHolderID="cntPnlHead" runat="server">

    <script src="fancyboxJs/jquery-1.9.0.min.js" type="text/javascript"></script>

    <script src="fancyboxJs/jquery.fancybox.js" type="text/javascript"></script>

    <link href="fancyboCss/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <link href="bcss/bs-table.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        jQuery(document).ready(function () {
            jQuery("a.inline1").fancybox({
                'transitionIn': 'elastic',
                'transitionOut': 'none',
                'type': 'iframe',
                'height': 750,
                'width': 1000,
            });
        });

    </script>

</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cntPlacBody" runat="server">
    <form id="Form1" runat="server">
        <div class="row">
            <div class="col-md-10">
                <asp:Label ID="Label1" runat="server"></asp:Label>
            </div>
            <div class="col-md-2">
            </div>
        </div>
        <table width="100%" cellpadding="5" cellspacing="1" border="0">
            <tr>
                <td align="center" colspan="3">
                    <asp:Label ID="lblError" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <span>Name :</span>
                </td>
                <td class="lblData">
                    <asp:Label ID="lblName" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                </td>
                <td align="right">
                    <span>Application Number :</span>
                </td>
                <td class="lblData">
                    <asp:Label ID="lblApplnNo" Style="font-weight: bold;" runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td colspan="4"></td>
            </tr>
        </table>
        <table width="100%" cellpadding="5" cellspacing="1" border="0">

            <tr>
                <td id="tdBirthCertificate" runat="server" align="center" style="font-weight: bold;" visible="false">Birth Certificate<br />
                    <asp:Image ID="imgBC" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image><br />
                </td>
                <td id="tdStudentIdCertificate" runat="server" align="center" style="font-weight: bold;" visible="false">Student IDCard<br />
                    <asp:Image ID="imgStuID" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                    <br />
                </td>
                <td id="tdRationCertificate" runat="server" align="center" style="font-weight: bold;" visible="false">Ration Card<br />
                    <asp:Image ID="imgRC" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                    <br />
                </td>
                <td id="tdVoterCertificate" runat="server" align="center" style="font-weight: bold;" visible="false">Voter ID<br />
                    <asp:Image ID="imgVD" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid #BBB;">
                <td id="tdBC" align="center" runat="server" visible="false">
                    <a target="_blank" id="aBC" runat="server"></a>
                </td>
                <td id="tdSID" align="center" runat="server" visible="false">
                    <a target="_blank" id="aStuID" runat="server"></a>
                </td>
                <td id="tdRC" align="center" runat="server" visible="false">
                    <a target="_blank" id="aRC" runat="server"></a>
                </td>
                <td id="tdVC" align="center" runat="server" visible="false">
                    <a target="_blank" id="aVD" runat="server"></a>
                </td>
            </tr>
           

            <tr>

                <td align="center" id="tdDrivingLicense" runat="server" style="font-weight: bold;" visible="false">Driving License<br />
                    <asp:Image ID="imgDD" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image><br />
                </td>
                <td align="center" id="tdBankPassBookCertificate" style="font-weight: bold;" runat="server" visible="false">Bank Pass Book<br />
                    <asp:Image ID="imgBPB" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
                <td align="center" id="tdAadhaarIdBirthCertificate" style="font-weight: bold;" runat="server" visible="false">AADHAAR ID<br />
                    <asp:Image ID="imgAID" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
                <td align="center" id="tdPanCardCertificate" runat="server" style="font-weight: bold;" visible="false">Pan Card<br />
                    <asp:Image ID="imgPC" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid #BBB;">
                <td align="center" id="tdDL" runat="server" visible="false">
                    <a target="_blank" id="aDD" runat="server"></a>
                </td>
                <td align="center" id="tdBPB" runat="server" visible="false">
                    <a target="_blank" id="aBPB" runat="server"></a>
                </td>
                <td align="center" id="tdAID" runat="server" visible="false">
                    <a target="_blank" id="aAID" runat="server"></a>
                </td>
                <td align="center" id="tdPC" runat="server" visible="false">
                    <a target="_blank" id="aPC" runat="server"></a>
                </td>
            </tr>
           
            <tr>
                <td align="center" id="tdBonafideStudent" runat="server" style="font-weight: bold;" visible="false">Bonafide-Student<br />
                    <asp:Image ID="imgBS" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image><br />
                </td>
                <td align="center" id="tdBonafideParent" runat="server" style="font-weight: bold;" visible="false">Bonafide-Parent<br />
                    <asp:Image ID="imgBP" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
                <td align="center" id="tdAcademicPerformance" runat="server" style="font-weight: bold;" visible="false">Academic Performance<br />
                    <asp:Image ID="imgAP" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
                <td align="center" id="tdLetter" runat="server" style="font-weight: bold;" visible="false">Letter<br />
                    <asp:Image ID="imgL" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid #BBB;">
                <td align="center" id="tdBS" runat="server" visible="false">
                    <a target="_blank" id="aBS" runat="server"></a>
                </td>
                <td align="center" id="tdBP" runat="server" visible="false">
                    <a target="_blank" id="aBP" runat="server"></a>
                </td>
                <td align="center" id="tdAP" runat="server" visible="false">
                    <a target="_blank" id="aAP" runat="server"></a>
                </td>
                <td align="center" id="tdL" runat="server" visible="false">
                    <a target="_blank" id="aL" runat="server"></a>
                </td>
            </tr>
           
            <tr>
                <td align="center" id="tdSport1" runat="server" visible="false">
                    <asp:Label ID="lblC1" runat="server" Style="font-weight: bold;" Text=""></asp:Label><br />
                    <asp:Image ID="imgS1" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
                <td align="center" id="tdSport2" runat="server" visible="false">
                    <asp:Label ID="lblC2" runat="server" Style="font-weight: bold;" Text=""></asp:Label><br />
                    <asp:Image ID="imgS2" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
                <td align="center" id="tdSport3" runat="server" visible="false">
                    <asp:Label ID="lblC3" runat="server" Style="font-weight: bold;" Text=""></asp:Label><br />
                    <asp:Image ID="imgS3" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
                <td align="center" id="tdSport4" runat="server" visible="false">
                    <asp:Label ID="lblC4" runat="server" Style="font-weight: bold;" Text=""></asp:Label><br />
                    <asp:Image ID="imgS4" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
                <td align="center" id="tdSport5" visible="false" runat="server">
                    <asp:Label ID="lblC5" runat="server" Style="font-weight: bold;" Text=""></asp:Label><br />
                    <asp:Image ID="imgS5" runat="server" Width="200" Height="350" CssClass="magnify"></asp:Image>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid #BBB;">
                <td align="center" id="tdSp1" runat="server" visible="false">
                    <a target="_blank" id="aS1" runat="server"></a>
                </td>
                <td align="center" id="tdSp2" runat="server" visible="false">
                    <a target="_blank" id="aS2" runat="server"></a>
                </td>
                <td align="center" id="tdSp3" runat="server" visible="false">
                    <a target="_blank" id="aS3" runat="server"></a>
                </td>
                <td align="center" id="tdSp4" runat="server" visible="false">
                    <a target="_blank" id="aS4" runat="server"></a>
                </td>
                <td align="center" id="tdSp5" runat="server" visible="false">
                    <a target="_blank" id="aS5" runat="server"></a>
                </td>
            </tr>

        </table>
    </form>
</asp:Content>
