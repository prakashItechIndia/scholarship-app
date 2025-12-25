<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PrintDetails.aspx.cs" Inherits="SaiAramFoundation.PrintDetails" %>

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
        .gridView
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
            width: 1000px;
        }
        .gridHeader
        {
            font-family: verdana, arial, tahoma;
            font-size: 8pt;
            color: #FFFFFF;
            background-color: #1760A5;
            height: 20px;
            padding-left: 12px;
        }
        .gridFooter
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
        }
        .gridContent
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
            vertical-align: baseline;
        }
        .gridAltContent
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
            background-color: #CED8F6;
        }
        .graylink
        {
            font-family: Verdana, Tahoma, Arial;
            font-size: 12px;
            font-weight: normal;
            color: #333333;
            text-decoration: none;
        }
        .DetailsHeader
        {
            font-family: verdana, arial, tahoma;
            font-size: 8pt;
            color: #FFFFFF;
            background-color: #333333;
            height: 20px;
            padding-left: 12px;
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
            <table id="tblContent" width="75%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                <tr bgcolor="#FFFFFF">
                    <td colspan="3" class="lblData">
                        <br />
                        <span style="font-weight: bold;">LEO MUTHU - Scholarship Print Details (
                            <asp:Label ID="lblSchlorshipYear" runat="server" Text=""></asp:Label>
                            )</span><br />
                        <br />
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td width="30%">
                        <span>Application Number</span>
                    </td>
                    <td width="5%" align="center">
                        :
                    </td>
                    <td width="65%" class="lblData">
                        <asp:Label ID="lblAppNo" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Name</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">
                        <asp:Label ID="lblName" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" style="display: none;">
                    <td>
                        <span>Cheque Number</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">
                        <asp:Label ID="lblChequeNo" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Cheque in favour of</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">
                        <asp:Label ID="lblCIFO" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Cheque Date</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">
                        <asp:Label ID="lblChequeDate" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" runat="server">
                    <td>
                        <span>Cheque Amount</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td>
                        <asp:Label ID="lblChequeAmount" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Scholarship Issue Number</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">

                         <asp:TextBox ID="txtScholarshipId" Visible="false" runat="server"></asp:TextBox>
                        <asp:Label ID="lblSIN" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                    </td>
                </tr>
            </table>
            <br />
            <table class="tblSign" width="75%">
                <tr bgcolor="#FFFFFF">
                    <td width="33%">
                        <table border="0" cellspacing="1" width="75%" cellpadding="4" style="background: none repeat scroll 0 0 #ccc;
                            height: 50px;">
                            <tr bgcolor="#FFFFFF">
                                <td style="height: 40px;" class="lblData">
                                    <asp:Label ID="lblPreparedBy" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                                </td>
                            </tr>
                            <tr bgcolor="#FFFFFF">
                                <td align="center">
                                    <span>Prepared By</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td width="33%">
                        <table border="0" cellspacing="1" width="75%" cellpadding="4" style="background: none repeat scroll 0 0 #ccc;
                            height: 50px;">
                            <tr bgcolor="#FFFFFF">
                                <td style="height: 40px;" class="lblData">
                                    <asp:Label ID="lblVerifiedBy" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                                </td>
                            </tr>
                            <tr bgcolor="#FFFFFF">
                                <td align="center">
                                    <span>Verified By</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td width="33%">
                        <table border="0" cellspacing="1" width="75%" cellpadding="4" style="background: none repeat scroll 0 0 #ccc;
                            height: 50px;">
                            <tr bgcolor="#FFFFFF">
                                <td style="height: 40px;">
                                </td>
                            </tr>
                            <tr bgcolor="#FFFFFF">
                                <td align="center">
                                    <span>Suggested By</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <br />
            <table class="tblSign" width="75%">
                <tr bgcolor="#FFFFFF">
                    <td width="33%">
                        <table border="0" cellspacing="1" width="75%" cellpadding="4" style="background: none repeat scroll 0 0 #ccc;
                            height: 50px;">
                            <tr bgcolor="#FFFFFF">
                                <td style="height: 40px;">
                                </td>
                            </tr>
                            <tr bgcolor="#FFFFFF">
                                <td align="center">
                                    <span>Authorized By</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td width="33%">
                        <table border="0" cellspacing="1" width="75%" cellpadding="4" style="background: none repeat scroll 0 0 #ccc;
                            height: 50px;">
                            <tr bgcolor="#FFFFFF">
                                <td style="height: 40px;">
                                </td>
                            </tr>
                            <tr bgcolor="#FFFFFF">
                                <td>
                                    <span>Passed By</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td width="33%">
                        <table border="0" cellspacing="1" width="75%" cellpadding="4" style="background: none repeat scroll 0 0 #ccc;
                            height: 50px;">
                            <tr bgcolor="#FFFFFF">
                                <td style="height: 40px;">
                                </td>
                            </tr>
                            <tr bgcolor="#FFFFFF">
                                <td align="center">
                                    <span>Trustee</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <asp:Label ID="lblError" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
        </div>
    </div>
    </form>

    <script>
        function CallPrint(strid) {
            var prtContent = document.getElementById(strid);
            var WinPrint = window.open('', '', left = 100, top = 10, width = 800, height = 500, toolbar = 0, scrollbars = 0, status = 0);
            WinPrint.document.write(prtContent.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
            prtContent.innerHTML = strOldOne;
        }
    </script>

    <style>
        .tblSign
        {
            width: 75%;
            margin-top: 10px;
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
    </style>
</body>
</html>
