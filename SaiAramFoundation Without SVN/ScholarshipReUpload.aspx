<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScholarshipReUpload.aspx.cs"
    Inherits="SaiAramFoundation.ScholarshipReUpload" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>LEO MUTHU Scholarship</title>
    <style type="text/css">
        body {
            font-family: Verdana;
            font-size: 12px;
        }
    </style>
    <script src="JS/jquery-1.7.1.min.js" type="text/javascript"></script>

    <script type="text/javascript">
        $(function () {
            $('.Checkupload').change(function () {
                var f = this.files[0];
                if (f.size > 3145728) {
                    $('#' + this.id).attr("value", "");
                    alert('Upload File size less then 3 MB');
                }
            });
        })
    </script>

</head>
<body onload="javascript:onLoad()">
    <form id="form1" runat="server">
        <div id="dvform" runat="server">
            <div id="divPrint">
                <table id="tblContent" width="100%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                    <tr bgcolor="#FFFFFF">
                        <td colspan="3" class="lblData" style="height: 30px">

                            <span style="font-weight: bold;">LEO MUTHU - Scholarship Upload Document Panel (
                                <asp:Label ID="lblSchlorshipYear" runat="server" Text=""></asp:Label>
                                )</span><br />

                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td width="100%" colspan="3">
                            <asp:Label ID="lblverified" runat="server" Style="color: Red"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td width="30%">
                            <span style="font-weight: bold;">Application Number </span>
                        </td>
                        <td width="5%" align="center">:
                        </td>
                        <td width="65%" class="lblData">
                            <asp:Label ID="lblApplnNo" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td width="30%">
                            <span style="font-weight: bold;">Student Name</span>
                        </td>
                        <td width="5%" align="center">:
                        </td>
                        <td width="65%" class="lblData">
                            <asp:Label ID="lblStudentName" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span style="font-weight: bold;">Birth Certificate</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aBirthCertificate" runat="server" visible="false">View Certificate</a>
                           <%-- <asp:RequiredFieldValidator ID="rfvFile1" runat="server" ControlToValidate="fuBirthCertificate"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>--%>
                            <asp:FileUpload ID="fuBirthCertificate" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" ControlToValidate="fuBirthCertificate"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="tr1" runat="server">
                        <td>
                            <span style="font-weight: bold;">AADHAAR ID </span>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aAadharID" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile7" runat="server" ControlToValidate="fuAadharID"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuAadharID" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator7" runat="server" ControlToValidate="fuAadharID"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp  file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span style="font-weight: bold;">Student ID Card</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aStudentIDCard" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile2" runat="server" ControlToValidate="fuStudentIDCard"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuStudentIDCard" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator2" runat="server" ControlToValidate="fuStudentIDCard"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span style="font-weight: bold;">Ration Card</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aRationCard" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile3" runat="server" ControlToValidate="fuRationCard"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuRationCard" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="rexFile3" runat="server" ControlToValidate="fuRationCard"
                                ErrorMessage="Enter only .jpg or .pdf or .png  or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span style="font-weight: bold;">Voter ID</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aVoter" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile4" runat="server" ControlToValidate="fuVoter"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuVoter" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="rexFile4" runat="server" ControlToValidate="fuVoter"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp  file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trScholarshipSeeking" runat="server">
                        <td>
                            <span style="font-weight: bold;">Driving License </span>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aDrivingLicense" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile5" runat="server" ControlToValidate="fuDrivingLicense"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuDrivingLicense" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="rexFile5" runat="server" ControlToValidate="fuDrivingLicense"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp  file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trSuggestedAmount" runat="server">
                        <td>
                            <span style="font-weight: bold;">Bank Pass Book </span>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aBankPassBook" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile6" runat="server" ControlToValidate="fuBankPassBook"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuBankPassBook" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="rexFile6" runat="server" ControlToValidate="fuBankPassBook"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp  file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>

                    <tr bgcolor="#FFFFFF" id="tr2" runat="server">
                        <td>
                            <span style="font-weight: bold;">PAN Card </span>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aPanCard" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile8" runat="server" ControlToValidate="fuPanCard"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuPanCard" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator8" runat="server" ControlToValidate="fuPanCard"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp  file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="tr3" runat="server">
                        <td>
                            <span style="font-weight: bold;">Bonafide (Student)</span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aBonafideStudent" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile9" runat="server" ControlToValidate="fuBonafideStudent"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuBonafideStudent" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile8" runat="server" ControlToValidate="fuPanCard"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator3" runat="server" ControlToValidate="fuBonafideStudent"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="tr4" runat="server">
                        <td>
                            <span style="font-weight: bold;">Bonafide (Parent)</span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aBonafideParent" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile10" runat="server" ControlToValidate="fuBonafideParent"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuBonafideParent" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile8" runat="server" ControlToValidate="fuPanCard"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator4" runat="server" ControlToValidate="fuBonafideParent"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="tr5" runat="server">
                        <td>
                            <span style="font-weight: bold;">Academic Performance</span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aAcademicPerformance" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile11" runat="server" ControlToValidate="fuAcademicPerformance"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuAcademicPerformance" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile8" runat="server" ControlToValidate="fuPanCard"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator5" runat="server" ControlToValidate="fuAcademicPerformance"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="tr6" runat="server">
                        <td>
                            <span style="font-weight: bold;">Letter</span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aLetter" runat="server" visible="false">View Certificate</a>
                            <asp:RequiredFieldValidator ID="rfvFile12" runat="server" ControlToValidate="fuLetter"
                                Enabled="false" Visible="false" ErrorMessage="*">
                            </asp:RequiredFieldValidator>
                            <asp:FileUpload ID="fuLetter" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile8" runat="server" ControlToValidate="fuPanCard"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator6" runat="server" ControlToValidate="fuLetter"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="3" align="center">
                            <fieldset>
                                <legend>Upload if any other certificates available..</legend>
                                <asp:ScriptManager ID="ScriptManager1" runat="server">
                                </asp:ScriptManager>
                                <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                                    <ContentTemplate>
                                        <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                            <tr>
                                                <td align="center">S.No
                                                </td>
                                                <td align="center">Document Name
                                                </td>
                                                <td align="center">File To Upload
                                                </td>
                                                <td align="center"></td>
                                            </tr>
                                            <tr id="trDoc1" runat="server" visible="false">
                                                <td width="5%" align="center">1
                                                </td>
                                                <td width="25%" align="center">
                                                    <asp:TextBox ID="txtUploadDoc1" runat="server" MaxLength="30"></asp:TextBox>
                                                </td>
                                                <td width="45%" align="left">
                                                    <a target="_blank" id="aC1" runat="server" visible="false">View Certificate</a>
                                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="fuUploadDoc1"
                                                        Enabled="false" Visible="false" ErrorMessage="*"></asp:RequiredFieldValidator>
                                                    <asp:FileUpload ID="fuUploadDoc1" runat="server" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc1" runat="server" ControlToValidate="fuUploadDoc1"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png  or bmp ile format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                            </tr>
                                            <tr id="trDoc2" visible="false" runat="server">
                                                <td align="center">2
                                                </td>
                                                <td align="center">
                                                    <asp:TextBox ID="txtUploadDoc2" runat="server" MaxLength="30"></asp:TextBox>
                                                </td>
                                                <td align="left">
                                                    <a target="_blank" id="aC2" runat="server" visible="false">View Certificate</a>
                                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ControlToValidate="fuUploadDoc2"
                                                        Enabled="false" Visible="false" ErrorMessage="*"></asp:RequiredFieldValidator>
                                                    <asp:FileUpload ID="fuUploadDoc2" runat="server" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc2" runat="server" ControlToValidate="fuUploadDoc2"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png  or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                            </tr>
                                            <tr id="trDoc3" visible="false" runat="server">
                                                <td align="center">3
                                                </td>
                                                <td align="center">
                                                    <asp:TextBox ID="txtUploadDoc3" runat="server" MaxLength="30"></asp:TextBox>
                                                </td>
                                                <td align="left">
                                                    <a target="_blank" id="aC3" runat="server" visible="false">View Certificate</a>
                                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ControlToValidate="fuUploadDoc3"
                                                        Enabled="false" Visible="false" ErrorMessage="*"></asp:RequiredFieldValidator>
                                                    <asp:FileUpload ID="fuUploadDoc3" runat="server" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc3" runat="server" ControlToValidate="fuUploadDoc3"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                            </tr>
                                            <tr id="trDoc4" visible="false" runat="server">
                                                <td align="center">4
                                                </td>
                                                <td align=" ">
                                                    <asp:TextBox ID="txtUploadDoc4" runat="server" MaxLength="30"></asp:TextBox>
                                                </td>
                                                <td align="left">
                                                    <a target="_blank" id="aC4" runat="server" visible="false">View Certificate</a>
                                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ControlToValidate="fuUploadDoc4"
                                                        Enabled="false" Visible="false" ErrorMessage="*"></asp:RequiredFieldValidator>
                                                    <asp:FileUpload ID="fuUploadDoc4" runat="server" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc4" runat="server" ControlToValidate="fuUploadDoc4"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                            </tr>
                                            <tr id="trDoc5" visible="false" runat="server">
                                                <td align="center">5
                                                </td>
                                                <td align="center">
                                                    <asp:TextBox ID="txtUploadDoc5" runat="server" MaxLength="30"></asp:TextBox>
                                                </td>
                                                <td align="left">
                                                    <a target="_blank" id="aC5" runat="server" visible="false">View Certificate</a>
                                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ControlToValidate="fuUploadDoc5"
                                                        Enabled="false" Visible="false" ErrorMessage="*"></asp:RequiredFieldValidator>
                                                    <asp:FileUpload ID="fuUploadDoc5" runat="server" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc5" runat="server" ControlToValidate="fuUploadDoc5"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                            </tr>
                                        </table>
                                    </ContentTemplate>
                                </asp:UpdatePanel>
                            </fieldset>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trSuperAdminbutton" runat="server">
                        <td align="center" colspan="3">
                            <asp:Button ID="btnUpload" runat="server" Text="Upload Documents" OnClick="btnUpload_Click" />

                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td align="center" colspan="3">
                            <asp:Label ID="lblError" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div runat="server" id="dvSuccess" visible="false">
            <asp:Label ID="lblSuccess" runat="server" Text=""></asp:Label>
        </div>
    </form>
</body>
</html>
