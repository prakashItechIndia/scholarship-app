<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UploadPopup.aspx.cs" Inherits="SaiAramFoundation.UploadPopup" %>

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
        

        function onLoad() {
            document.getElementById('trDoc2').style.visibility = "hidden";
            document.getElementById('trDoc3').style.visibility = "hidden";
            document.getElementById('trDoc4').style.visibility = "hidden";
            document.getElementById('trDoc5').style.visibility = "hidden";

        }

        function showDocV1() {
            var fuData = document.getElementById('<%= fuUploadDoc1.ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc1.ClientID%>").enabled = true;
            }
        }
        function showDocV2() {
            var fuData = document.getElementById('<%= fuUploadDoc2.ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc2.ClientID%>").enabled = true;
            }
        }
        function showDocV3() {
            var fuData = document.getElementById('<%= fuUploadDoc3.ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc3.ClientID%>").enabled = true;
            }
        }
        function showDocV4() {
            var fuData = document.getElementById('<%= fuUploadDoc4.ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc4.ClientID%>").enabled = true;
            }
        }
        function showDocV5() {
            var fuData = document.getElementById('<%= fuUploadDoc5.ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc5.ClientID%>").enabled = true;
            }
        }

        function showtr2() {
            document.getElementById('trDoc2').style.visibility = "visible";
            document.getElementById('btnClose1').style.visibility = "visible";
        }
        function hidetr2() {
            document.getElementById('trDoc2').style.visibility = "hidden";
            document.getElementById('btnClose3').style.visibility = "hidden";
            document.getElementById('btnClose2').style.visibility = "hidden";
            document.getElementById('btnClose1').style.visibility = "hidden";
            var fuData = document.getElementById('<%= fuUploadDoc2.ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc2.ClientID%>").enabled = false;
                document.getElementById("<%=rfvSportsDoc2.ClientID%>").style.visibility = "hidden";
                fuData.value = "";
            }
        }
        function showtr3() {
            document.getElementById('trDoc3').style.visibility = "visible";
            document.getElementById('btnClose1').style.visibility = "hidden";
            document.getElementById('btnClose2').style.visibility = "visible";
        }
        function hidetr3() {
            document.getElementById('trDoc3').style.visibility = "hidden";
            document.getElementById('btnClose1').style.visibility = "visible";
            document.getElementById('btnClose2').style.visibility = "hidden";
            document.getElementById('btnClose3').style.visibility = "hidden";
            var fuData = document.getElementById('<%= fuUploadDoc3  .ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc3.ClientID%>").enabled = false;
                document.getElementById("<%=rfvSportsDoc3.ClientID%>").style.visibility = "hidden";
                fuData.value = "";
            }
        }
        function showtr4() {
            document.getElementById('trDoc4').style.visibility = "visible";
            document.getElementById('btnClose2').style.visibility = "hidden";
            document.getElementById('btnClose3').style.visibility = "visible";
        }
        function hidetr4() {
            document.getElementById('trDoc4').style.visibility = "hidden";
            document.getElementById('btnClose2').style.visibility = "visible";
            document.getElementById('btnClose1').style.visibility = "hidden";
            document.getElementById('btnClose3').style.visibility = "hidden";
            var fuData = document.getElementById('<%= fuUploadDoc4.ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc4.ClientID%>").enabled = false;
                document.getElementById("<%=rfvSportsDoc4.ClientID%>").style.visibility = "hidden";
                fuData.value = "";
            }
        }
        function showtr5() {
            document.getElementById('trDoc5').style.visibility = "visible";
            document.getElementById('btnClose3').style.visibility = "hidden";
        }
        function hidetr5() {
            document.getElementById('trDoc5').style.visibility = "hidden";
            document.getElementById('btnClose3').style.visibility = "visible";
            document.getElementById('btnClose2').style.visibility = "hidden";
            document.getElementById('btnClose1').style.visibility = "hidden";
            var fuData = document.getElementById('<%= fuUploadDoc5.ClientID %>');
            var FileUploadPath = fuData.value;
            if (FileUploadPath != "") {
                document.getElementById("<%=rfvSportsDoc5.ClientID%>").enabled = false;
                document.getElementById("<%=rfvSportsDoc5.ClientID%>").style.visibility = "hidden";
                fuData.value = "";
            }
        }
    </script>

</head>
<body onload="javascript:onLoad()">
    <form id="form1" runat="server">
        <div id="dvform" runat="server">
            <div id="divPrint">
                <table id="tblContent" width="100%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                    <tr bgcolor="#FFFFFF" style="height: 30px">
                        <td colspan="3" class="lblData">

                            <span style="font-weight: bold;">LEO MUTHU - Scholarship Upload Document Panel (
                            <asp:Label ID="lblSchlorshipYear" runat="server" Text=""></asp:Label>
                                )</span><br />

                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td width="30%">
                            <span style="font-weight: bold;">Application Number </span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td width="5%" align="center">:
                        </td>
                        <td width="65%" class="lblData">
                            <asp:Label ID="lblApplnNo" runat="server"></asp:Label>
                            <font style="color: Red">( Please upload minimum 3 documents )</font>
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
                            <span style="font-weight: bold;">Birth Certificate (Student) <font color="#FF0000"></font></span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aBirthCertificate" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuBirthCertificate" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile1" runat="server" ControlToValidate="fuBirthCertificate"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" ControlToValidate="fuBirthCertificate"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>

                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span style="font-weight: bold;">Photo (Student) <font color="#FF0000"></font></span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aStudentPhoto" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuStudentPhoto" runat="server" CssClass="Checkupload" />
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator9" runat="server" ControlToValidate="fuStudentPhoto"
                                ErrorMessage="Enter only .jpg or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.JPE?G|.*\.PNG|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>




                    <tr bgcolor="#FFFFFF" id="tr1" runat="server">
                        <td>
                            <span style="font-weight: bold;">AADHAAR ID (Student)  </span>                            
                            <asp:Label ID="lblAdharReq" runat="server" Text="*" Style="color: Red"></asp:Label>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aAadharID" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuAadharID" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile7" runat="server" ControlToValidate="fuAadharID"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator7" runat="server" ControlToValidate="fuAadharID"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span style="font-weight: bold;">Student ID Card (Student)</span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aStudentIDCard" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuStudentIDCard" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile2" runat="server" ControlToValidate="fuStudentIDCard"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator2" runat="server" ControlToValidate="fuStudentIDCard"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span style="font-weight: bold;">Ration Card (Student)</span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aRationCard" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuRationCard" runat="server" CssClass="Checkupload" />
                            <%--<asp:RequiredFieldValidator ID="rfvRationCard" runat="server" ControlToValidate="fuRationCard"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="rexFile3" runat="server" ControlToValidate="fuRationCard"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span style="font-weight: bold;">Voter ID (Student)</span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aVoter" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuVoter" runat="server" CssClass="Checkupload" />
                            <%--  <asp:RequiredFieldValidator ID="rfvVoter" runat="server" ControlToValidate="fuVoter"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="rexFile4" runat="server" ControlToValidate="fuVoter"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trScholarshipSeeking" runat="server">
                        <td>
                            <span style="font-weight: bold;">Driving License (Student)</span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aDrivingLicense" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuDrivingLicense" runat="server" CssClass="Checkupload" />
                            <%--<asp:RequiredFieldValidator ID="rfvDrivingLicense" runat="server" ControlToValidate="fuDrivingLicense"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="rexFile5" runat="server" ControlToValidate="fuDrivingLicense"
                                ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trSuggestedAmount" runat="server">
                        <td>
                            <span style="font-weight: bold;">Bank Pass Book (Student) </span>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aBankPassBook" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuBankPassBook" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvBankPassBook" runat="server" ControlToValidate="fuBankPassBook"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="rexFile6" runat="server" ControlToValidate="fuBankPassBook"
                                ErrorMessage="Enter only .jpg or .pdf or .png  or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>

                    <tr bgcolor="#FFFFFF" id="tr2" runat="server">
                        <td>
                            <span style="font-weight: bold;">PAN Card (Student)</span>
                            <asp:Label ID="lblPanReq" runat="server" Text="*" Style="color: Red"></asp:Label>
                            <%--<font color="#FF0000">*</font>--%>
                        </td>
                        <td align="center">:
                        </td>
                        <td align="left">
                            <a target="_blank" id="aPanCard" runat="server" visible="false">View Certificate</a>
                            <asp:FileUpload ID="fuPanCard" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile8" runat="server" ControlToValidate="fuPanCard"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator8" runat="server" ControlToValidate="fuPanCard"
                                ErrorMessage="Enter only .jpg or .pdf or .png  or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
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
                            <asp:FileUpload ID="fuLetter" runat="server" CssClass="Checkupload" />
                            <%-- <asp:RequiredFieldValidator ID="rfvFile8" runat="server" ControlToValidate="fuPanCard"
                            ErrorMessage="*" Enabled="false">
                        </asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator6" runat="server" ControlToValidate="fuLetter"
                                ErrorMessage="Enter only .jpg or .pdf or .png  or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)">
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
                                            <tr>
                                                <td width="5%" align="center">1
                                                </td>
                                                <td width="25%" align="center">
                                                    <asp:TextBox ID="txtUploadDoc1" runat="server" MaxLength="30"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rfvSportsDoc1" runat="server" ControlToValidate="txtUploadDoc1"
                                                        ErrorMessage="*" Enabled="false">
                                                    </asp:RequiredFieldValidator>
                                                </td>
                                                <td width="45%" align="left">
                                                    <asp:FileUpload ID="fuUploadDoc1" runat="server" onchange="showDocV1()" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc1" runat="server" ControlToValidate="fuUploadDoc1"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png  or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                                <td width="25%" align="left">
                                                    <input id="btnAdd1" type="button" value="Add Another File" onclick='javascript: showtr2()' />
                                                </td>
                                            </tr>
                                            <tr id="trDoc2" visible="false">
                                                <td align="center">2
                                                </td>
                                                <td align="center">
                                                    <asp:TextBox ID="txtUploadDoc2" runat="server" MaxLength="30"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rfvSportsDoc2" runat="server" ControlToValidate="txtUploadDoc2"
                                                        ErrorMessage="*" Enabled="false">
                                                    </asp:RequiredFieldValidator>
                                                </td>
                                                <td align="left">
                                                    <asp:FileUpload ID="fuUploadDoc2" runat="server" onchange="showDocV2()" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc2" runat="server" ControlToValidate="fuUploadDoc2"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                                <td align="left">
                                                    <input id="btnAdd2" type="button" value="Add Another File" onclick='javascript: showtr3()' /><input
                                                        id='btnClose1' type="button" value="X" onclick='javascript: hidetr2()' />
                                                </td>
                                            </tr>
                                            <tr id="trDoc3" visible="false">
                                                <td align="center">3
                                                </td>
                                                <td align="center">
                                                    <asp:TextBox ID="txtUploadDoc3" runat="server" MaxLength="30"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rfvSportsDoc3" runat="server" ControlToValidate="txtUploadDoc3"
                                                        ErrorMessage="*" Enabled="false">
                                                    </asp:RequiredFieldValidator>
                                                </td>
                                                <td align="left">
                                                    <asp:FileUpload ID="fuUploadDoc3" runat="server" onchange="showDocV3()" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc3" runat="server" ControlToValidate="fuUploadDoc3"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                                <td align="left">
                                                    <input id="btnAdd3" type="button" value="Add Another File" onclick='javascript: showtr4()' /><input
                                                        id="btnClose2" type="button" value="X" onclick='javascript: hidetr3()' />
                                                </td>
                                            </tr>
                                            <tr id="trDoc4" visible="false">
                                                <td align="center">4
                                                </td>
                                                <td align="center">
                                                    <asp:TextBox ID="txtUploadDoc4" runat="server" MaxLength="30"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rfvSportsDoc4" runat="server" ControlToValidate="txtUploadDoc4"
                                                        ErrorMessage="*" Enabled="false">
                                                    </asp:RequiredFieldValidator>
                                                </td>
                                                <td align="left">
                                                    <asp:FileUpload ID="fuUploadDoc4" runat="server" onchange="showDocV4()" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc4" runat="server" ControlToValidate="fuUploadDoc4"
                                                        ErrorMessage="Enter only .jpg or .pdf or .png or bmp file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                                <td align="left">
                                                    <input id="btnAdd4" type="button" value="Add Another File" onclick='javascript: showtr5()' /><input
                                                        id="btnClose3" type="button" value="X" onclick='javascript: hidetr4()' />
                                                </td>
                                            </tr>
                                            <tr id="trDoc5" visible="false">
                                                <td align="center">5
                                                </td>
                                                <td align="center">
                                                    <asp:TextBox ID="txtUploadDoc5" runat="server" MaxLength="30"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rfvSportsDoc5" runat="server" ControlToValidate="txtUploadDoc5"
                                                        ErrorMessage="*" Enabled="false">
                                                    </asp:RequiredFieldValidator>
                                                </td>
                                                <td align="left">
                                                    <asp:FileUpload ID="fuUploadDoc5" runat="server" onchange="showDocV5()" CssClass="Checkupload" />
                                                    <asp:RegularExpressionValidator ID="revSportsDoc5" runat="server" ControlToValidate="fuUploadDoc5"
                                                        ErrorMessage="Enter only .jpg or .pdf or .pdf file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF|.*\.bmp|.*\.BMP)"></asp:RegularExpressionValidator>
                                                </td>
                                                <td align="left">
                                                    <input id="btnAdd5" type="button" value="Add Another File" /><input id="btnClose4"
                                                        type="button" value="X" onclick='javascript: hidetr5()' />
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
                            <asp:Label ID="lblValidation" runat="server" Text="" Style="color: Red"></asp:Label>
                        </td>
                    </tr>
                    <%-- <tr id="trValidation" bgcolor="#FFFFFF" visible="false" runat="server">
                    <td colspan="3" class="lblData" align="center">
                        
                        <br />
                    </td>
                </tr>--%>
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
