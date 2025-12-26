<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PrintApprovalFormDetails.aspx.cs"
    Inherits="SaiAramFoundation.PrintApprovalFormDetails" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Aram Foundation</title>
    <style type="text/css">
        body
        {
            font-family: Verdana;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div id="dvform" runat="server">
        <div style="text-align: center">
            <input id="btnPrint" type="button" name="btnPrint" class="button" value="Print" onclick="javascript:CallPrint('divPrint');"
                runat="Server" />
        </div>
        <div id="divPrint">
            <link href="CSS/print.css" rel="stylesheet" type="text/css" />
            <table id="tblContent" width="100%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                <tr bgcolor="#FFFFFF">
                    <td colspan="4" class="lblData" align="center">
                        <img src="~/../images/Logo_Reg_Aram.jpg" style="width: 400px;" />
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td colspan="2" class="lblData" align="center">
                        <span style="font-size: 18px; font-weight: bold;">APPROVAL FORM (
                            <asp:Label ID="lblSchlorshipYear" runat="server" Text=""></asp:Label>
                            )</span><br />
                    </td>
                    <td colspan="2" class="lblData" align="center">
                        <asp:Label ID="lblAppNo" runat="server" Style="font-size: 35px; font-weight: bold;
                            letter-spacing: 2px;" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td width="30%">
                        <span>Name </span>
                    </td>
                    <td colspan="3">
                        <asp:Label ID="lblName" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" style="display: none;">
                    <td>
                        <span>Student ID </span>
                    </td>
                    <td colspan="3">
                        <asp:Label ID="lblStudentId" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Aadhaar ID </span>
                    </td>
                    <td colspan="3">
                        <asp:Label ID="lblAadhaarId" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Mobile number </span>
                    </td>
                    <td colspan="3">
                        <asp:Label ID="lblMobileNumber" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr id="Tr1" bgcolor="#FFFFFF" runat="server">
                    <td>
                        <span>Class Studying </span>
                    </td>
                    <td colspan="3">
                        <asp:Label ID="lblClassStudying" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Institution Name </span>
                    </td>
                    <td colspan="3">
                        <asp:Label ID="lblInstitutionname" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Suggested Amount </span>
                    </td>
                    <td>
                        <asp:Label ID="lblSuggestAmounr" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                    </td>
                    <td>
                        <span>Approved Amount </span>
                    </td>
                    <td style="min-width: 100px">
                        <asp:Label ID="lblApproveAmount" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Cheque in favour of </span>
                    </td>
                    <td>
                        <asp:CheckBox runat="server" ID="chkName" Visible="true" Text="Individual" Style="font-weight: bold;" />
                    </td>
                    <td colspan="2">
                        <asp:CheckBox runat="server" ID="chk" Text="Institution" Style="font-weight: bold;" />
                    </td>
                </tr>
            </table>
            <br />
            <table class="tblSign" width="100%" border="0">
                <tr style="height: 56px;">
                    <td align="center">
                        <asp:Label ID="lblPreparedBy" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                    <td align="center">
                        <asp:Label ID="lblVerifiedBy" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                    <td>
                    </td>
                </tr>
                <tr style="height: 25px;">
                    <td align="center">
                        <span style="font-weight: bold;">Prepared By</span>
                    </td>
                    <td align="center">
                        <span style="font-weight: bold;">Verified By</span>
                    </td>
                    <td align="center">
                        <span style="font-weight: bold;">Suggested By</span>
                    </td>
                </tr>
            </table>
            <br />
            <table class="tblSign" width="100%">
                <tr style="height: 56px;">
                    <td width="27%">
                    </td>
                    <td width="24%">
                    </td>
                    <td width="29%">
                    </td>
                </tr>
                <tr style="height: 25px;">
                    <td align="center">
                        <span style="font-weight: bold;">Authorized By</span>
                    </td>
                    <td align="center">
                        <span style="font-weight: bold;">Passed By</span>
                    </td>
                    <td align="center">
                        <span style="font-weight: bold;">Trustee</span>
                    </td>
                </tr>
            </table>
            <br />
            <hr />
            <br />
            <table id="Table1" width="100%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                <tr bgcolor="#FFFFFF">
                    <td colspan="4" class="lblData" align="center">
                        <br />
                        <span style="font-weight: bold; border: 1px solid #000; padding: 6px;">Scholarship Approved
                            Cheque Payment Details </span>
                        <br />
                        <br />
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td colspan="4">
                        <table border="2" cellspacing="1" width="100%" cellpadding="4" style="background: none repeat scroll 0 0 #ccc;
                            height: 50px;">
                            <tr bgcolor="#FFFFFF">
                                <td align="center">
                                    <span>Date</span>
                                </td>
                                <td align="center">
                                    <span>Cheque No</span>
                                </td>
                                <td align="center">
                                    <span>Amount</span>
                                </td>
                                <td align="center">
                                    <span>Passed By</span>
                                </td>
                            </tr>
                            <tr bgcolor="#FFFFFF">
                                <td style="height: 30px;" align="center">
                                    <asp:Label ID="lblDDDate" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                                </td>
                                <td style="height: 30px;" align="center">
                                    <asp:Label ID="lblChequeNo" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                                </td>
                                <td style="height: 30px;" align="center">
                                    <asp:Label ID="lblIssuedAmount" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                                </td>
                                <td style="height: 30px;">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td colspan="4">
                        <span style="line-height: 20px;">Amount Rs :
                            <asp:Label ID="SplblIssuedAmount" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                        </span><span style="line-height: 20px;">( Rupees
                            <asp:Label ID="lblRupessText" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                            ) Received with Thanks.</span>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <table class="tblSign" width="100%">
                        <tr style="height: 30px;">
                            <td align="right">
                                <span>Name :</span>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr style="height: 60px;">
                            <td align="right">
                                <span>Signature :</span>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr style="height: 30px;">
                            <td align="right">
                                <span>Date :</span>
                            </td>
                            <td width="52%">
                            </td>
                        </tr>
                    </table>
                </tr>
            </table>
            <asp:Label ID="lblError" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
        </div>
    </div>
    </form>

    <script>
        function CallPrint(strid) {
            var prtContent = document.getElementById(strid);
            var WinPrint = window.open('', '', left = 100, top = 10, width = 800, height = 400, toolbar = 0, scrollbars = 0, status = 0);
            WinPrint.document.write(prtContent.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
            prtContent.innerHTML = strOldOne;
        }
    </script>

    <%--<style>
        .tblSign
        {
            width: 75%;
            margin-top: 8px;
        }
        .clsdiv
        {
            border: solid 1px #CCCCCC;
            height: 25px;
            border-bottom: 0px;
        }
        .clsdivdown
        {
            border: solid 1px #CCCCCC;
            height: 25px;
        }
    </style>--%>
</body>
</html>
