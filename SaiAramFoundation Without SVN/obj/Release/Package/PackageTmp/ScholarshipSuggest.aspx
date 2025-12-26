<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScholarshipSuggest.aspx.cs"
    Inherits="SaiAramFoundation.ScholarshipSuggest" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>LEO MUTHU Scholarship</title>
</head>
<body>  

    <script type="text/javascript">

        function Validation(event) {
            var remark = document.getElementById("<% =txtRemark.ClientID%>").value;
            if (remark == "") {
                ValidatorEnable(document.getElementById('<%= reqRemark.ClientID %>'), true);
                ValidatorEnable(document.getElementById('<%= reQSuggestedAmount.ClientID %>'), false);
                event.preventDefault();
            }
        }
        function Validation1(event) {
            ValidatorEnable(document.getElementById('<%= reQSuggestedAmount.ClientID %>'), true);
           // ValidatorEnable(document.getElementById('<%= reqRemark.ClientID %>'), false);
        }

        function keyUP(txt) {

            var words = toWords(txt);
            if (words != "") {
                document.getElementById("lbltextAmount").innerHTML = words + " Only";
            }
            else {
                document.getElementById("lbltextAmount").innerHTML = words;
            }

        }

        function toWords(num) {
            //var numbr=document.getElementById('num').value;
            var str = new String(num);
            var splt = str.split("");
            var rev = splt.reverse();
            var once = ['Zero', ' One', ' Two', ' Three', ' Four', ' Five', ' Six', ' Seven', ' Eight', ' Nine'];
            var twos = [' Ten', ' Eleven', ' Twelve', ' Thirteen', ' Fourteen', ' Fifteen', ' Sixteen', ' Seventeen', ' Eighteen', ' Nineteen'];
            var tens = ['', ' Ten', ' Twenty', ' Thirty', ' Forty', ' Fifty', ' Sixty', ' Seventy', ' Eighty', ' Ninety'];
            numlen = rev.length;
            var word = new Array();

            var j = 0;
            for (i = 0; i < numlen; i++) {
                switch (i) {
                    case 0:
                        if ((rev[i] == 0) || (rev[i + 1] == 1)) {
                            word[j] = '';
                        }
                        else {
                            word[j] = once[rev[i]];
                        }
                        word[j] = word[j];

                        break;
                    case 1:
                        abovetens();
                        break;
                    case 2:
                        if (rev[i] == 0) {
                            word[j] = '';
                        }
                        else if ((rev[i - 1] == 0) || (rev[i - 2] == 0)) {
                            word[j] = once[rev[i]] + " Hundred";
                        }
                        else {
                            word[j] = once[rev[i]] + " Hundred and";
                        }
                        break;
                    case 3:
                        if (rev[i] == 0 || rev[i + 1] == 1) {
                            word[j] = '';
                        }
                        else {
                            word[j] = once[rev[i]];
                        }
                        if ((rev[i + 1] != 0) || (rev[i] > 0)) {
                            word[j] = word[j] + " Thousand";
                        }
                        break;
                    case 4:
                        abovetens();
                        break;

                    case 5:
                        if ((rev[i] == 0) || (rev[i + 1] == 1)) {
                            word[j] = '';
                        }
                        else {
                            word[j] = once[rev[i]];
                        }
                        word[j] = word[j] + " Lakhs";
                        break;

                    case 6:
                        abovetens();
                        break;

                    case 7:
                        if ((rev[i] == 0) || (rev[i + 1] == 1)) {
                            word[j] = '';
                        }
                        else {
                            word[j] = once[rev[i]];
                        }
                        word[j] = word[j] + " Crore";
                        break;

                    case 8:
                        abovetens();
                        break;
                    default:
                        break;
                }

                j++;

            }

            function abovetens() {
                if (rev[i] == 0) {
                    word[j] = '';
                }
                else if (rev[i] == 1) {
                    word[j] = twos[rev[i - 1]];
                }
                else {
                    word[j] = tens[rev[i]];
                }
            }

            word.reverse();
            var finalw = '';
            for (i = 0; i < numlen; i++) {

                finalw = finalw + word[i];

            }
            return finalw;
        }

    </script>
    <style type="text/css">
     .Content
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
            vertical-align:baseline;
        }
    </style>

    <form id="form1" runat="server">
    <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </asp:ToolkitScriptManager>
    <div id="dvform" runat="server">
        <div id="divPrint" class="Content">
            <table id="tblContent" width="75%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                <tr bgcolor="#FFFFFF">
                    <td colspan="3" class="lblData" style="height:30px">
                     
                        <span style="font-weight: bold;">LEO MUTHU - Scholarship Suggestion Panel ( <asp:Label ID="lblSchlorshipYear" runat="server" Text=""></asp:Label> )</span><br />
                        
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
                        <asp:Label ID="lblApplnNo" runat="server" style="font-weight: bold;"></asp:Label>
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
                        <asp:Label ID="lblName" runat="server" Text="" style="font-weight: bold;"></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" style="display: none;">
                    <td>
                        <span>DOB</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">
                        <asp:Label ID="lblDOB" runat="server" Text="" style="font-weight: bold;"></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Father's Name</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">
                        <asp:Label ID="lblFatherName" runat="server" Text="" style="font-weight: bold;"></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Father's Occupation</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">
                        <asp:Label ID="lblFatherOccupation" runat="server" Text="" style="font-weight: bold;"></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" id="trScholarshipSeeking" runat="server">
                    <td>
                        <span>scholarship Seeking For </span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td>
                        <asp:Label ID="lblScholarShipSeekingFor" runat="server" Text="" style="font-weight: bold;"></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Request Amount</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td class="lblData">
                        <asp:Label ID="lblRequestAmount" runat="server" Text="" style="font-weight: bold;"></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" id="trSuggestedAmount" runat="server">
                    <td valign="top">
                        <span>Suggested Amount</span>
                    </td>
                    <td align="center" valign="top">
                        :
                    </td>
                    <td>

                        <asp:TextBox ID="txtScholarshipId" style="display:none;" runat="server"> </asp:TextBox>

                        <asp:TextBox ID="txtSuggestedAmount" runat="server" MaxLength="9" onkeyup="javascript:keyUP(this.value);"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="reQSuggestedAmount" ControlToValidate="txtSuggestedAmount"
                            targetcontrolid="txtSuggestedAmount" Text="Please Suggested Amount" runat="server"
                            SetFocusOnError="True" />
                        <asp:RegularExpressionValidator ID="reGSuggestedAmount" runat="server" ControlToValidate="txtSuggestedAmount"
                            ErrorMessage="Enter only Numbers" SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator><br />
                        <asp:Label ID="lbltextAmount" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" id="trRemark" runat="server">
                    <td>
                        <span>Comments</span>
                    </td>
                    <td align="center">
                        :
                    </td>
                    <td>
                        <asp:TextBox ID="txtRemark" runat="server" TextMode="MultiLine" MaxLength="500"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="reqRemark" ControlToValidate="txtRemark" targetcontrolid="txtRemark"
                            Text="Please enter Comments" runat="server" SetFocusOnError="True" Enabled="false" />
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" id="trAdminButtons">
                    <td align="center" colspan="3">
                        <asp:Button ID="btnSuggest" runat="server" Text="Suggest" OnClick="btnSuggest_Click"
                            OnClientClick="Validation1(event)" />
                        <asp:Button ID="btnReject" runat="server" Text="Reject" OnClick="btnReject_Click"
                            OnClientClick="Validation(event)" />
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
