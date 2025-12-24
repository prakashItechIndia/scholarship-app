<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScholarshipFinal.aspx.cs"  Inherits="SaiAramFoundation.ScholarshipFinal" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Aram Foundation</title>
</head>
<body>
    <style type="text/css">
        .Content {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
            vertical-align: baseline;
        }
    </style>

    <script type="text/javascript">
        function fncHideButton() {
            document.getElementById('<%=btnDonate.ClientID %>').style.visibility = "hidden";
        }

        function checkDate(sender, args) {
            if (sender._selectedDate > new Date()) {
                alert("You cannot select future date!");
                sender._selectedDate = new Date();
                // set the date back to the current date
                sender._textbox.set_Value("")
                return false;
            }
            else {
                return true;
            }
        }



    </script>

    <form id="form1" runat="server">
        <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </asp:ToolkitScriptManager>
        <div id="dvform" runat="server">
            <div id="divPrint" class="Content">
                <table id="tblContent" width="100%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                    <tr bgcolor="#FFFFFF">
                        <td colspan="3" class="lblData" style="height: 30px">
                            <span style="font-weight: bold;">Aram Foundation - Scholarship Finalize Panel (
                            <asp:Label ID="lblSchlorshipYear" runat="server" Text=""></asp:Label>
                                )</span><br />
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td width="30%">
                            <span>Application Number</span>
                        </td>
                        <td width="5%" align="center">:
                        </td>
                        <td width="65%" class="lblData">
                            <asp:Label ID="lblStudId" runat="server" Style="font-weight: bold; display:none;" ></asp:Label> 
                            <asp:Label ID="lblStudCollege" runat="server" Style="font-weight: bold; display:none;"></asp:Label>
                             <asp:Label ID="lblSchYear" runat="server" Style="font-weight: bold; display:none;"></asp:Label>
                            
                            <asp:Label ID="lblApplnNo" runat="server" Style="font-weight: bold;"></asp:Label>

                             <span style="padding-left:20px;padding-right:0px;">LMS Scholarship Number - </span>
                            <asp:Label ID="lblSchNo" runat="server" Style="font-weight: bold;"></asp:Label>

                             <asp:Label ID="lblEAdmissionNo" runat="server" Style="font-weight: bold;display:none;"></asp:Label>

                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span>Name</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td class="lblData">
                            <asp:Label ID="lblName" runat="server" Text="" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" style="display: none;">
                        <td>
                            <span>DOB</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td class="lblData">
                            <asp:Label ID="lblDOB" runat="server" Text=""></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span>Father's Name</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td class="lblData">
                            <asp:Label ID="lblFatherName" runat="server" Text="" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td>
                            <span>Father's Occupation</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td class="lblData">
                            <asp:Label ID="lblFatherOccupation" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trDateOfIssue" runat="server">
                        <td valign="top">
                            <span>Date of Issue</span><font color="#FF0000">*</font>
                        </td>
                        <td align="center" valign="top">:
                        </td>
                        <td>
                            <asp:TextBox ID="txtIssuedDate" runat="server" MaxLength="15" TabIndex="1" placeholder="DD/MM/YYYY"></asp:TextBox>
                            <asp:CalendarExtender ID="txtDate1_CalendarExtender" runat="server" Format="dd/MM/yyyy"
                                TodaysDateFormat="dd/MM/yyyy" Enabled="True" TargetControlID="txtIssuedDate" OnClientDateSelectionChanged="checkDate">
                            </asp:CalendarExtender>
                            <asp:RegularExpressionValidator ID="reGtxtBirthDate" runat="server" ErrorMessage="Enter valid Date dd/MM/YYYY"
                                SetFocusOnError="True" Style="position: relative" ValidationExpression="(((0[1-9]|[12][0-9]|3[01])([/])(0[13578]|10|12)([/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([/])(0[469]|11)([/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([/])(02)([/])(\d{4}))|((29)(\.|-|\/)(02)([/])([02468][048]00))|((29)([/])(02)([/])([13579][26]00))|((29)([/])(02)([/])([0-9][0-9][0][48]))|((29)([/])(02)([/])([0-9][0-9][2468][048]))|((29)([/])(02)([/])([0-9][0-9][13579][26])))"
                                ControlToValidate="txtIssuedDate"></asp:RegularExpressionValidator>
                            <asp:RequiredFieldValidator ID="reQtxtBirthDate" ControlToValidate="txtIssuedDate"
                                targetcontrolid="txtIssuedDate" Text="Please Enter Issued Date" runat="server"
                                SetFocusOnError="True" />
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trScholarshipSeeking" runat="server">
                        <td>
                            <span>scholarship Seeking For </span>
                        </td>
                        <td align="center">:
                        </td>
                        <td>
                            <asp:Label ID="lblScholarShipSeekingFor" runat="server" Text="" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="tr3" runat="server">
                        <td>
                            <span>Requested Amount</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td>
                            <asp:Label ID="lblRequestedAmount" runat="server" Text="" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="tr1" runat="server">
                        <td>
                            <span>Suggested Amount</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td>
                            <asp:Label ID="lblSuggestedAmt" runat="server" Text="" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="tr2" runat="server">
                        <td>
                            <span>Approved Amount</span>
                        </td>
                        <td align="center">:
                        </td>
                        <td>
                            <asp:Label ID="lblApprovedAmt" runat="server" Text="" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trAmountIssued" runat="server">
                        <td valign="top">
                            <span>Amount Issued</span>
                        </td>
                        <td valign="top" align="center">:
                        </td>
                        <td>

                             <asp:TextBox ID="txtScholarshipId" Visible="false" runat="server"></asp:TextBox>

                            <asp:Label ID="lblAmountIssued" runat="server" Text="" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    
                    <tr bgcolor="#FFFFFF" id="trChequeInFavor" runat="server">
                        <td valign="top">
                            <span>DD/Cheque In favour </span><font color="#FF0000">*</font>
                        </td>
                        <td valign="top" align="center">:
                        </td>
                        <td>
                            <asp:RadioButtonList ID="rdoChequeInFavor" runat="server" RepeatLayout="Flow" RepeatDirection="Horizontal"
                                OnSelectedIndexChanged="rdoChequeInFavor_OnSelectedIndexChanged" AutoPostBack="true">
                                <asp:ListItem Text="Individual" Value="Individual"></asp:ListItem>
                                <asp:ListItem Text="Institution" Value="Institution"></asp:ListItem>
                                <asp:ListItem Text="Concession" Value="Concession"></asp:ListItem>
                            </asp:RadioButtonList>
                            <br />
                            <asp:DropDownList ID="ddInstitution" runat="server" AutoPostBack="true" OnSelectedIndexChanged="ddInstitution_OnSelectedIndexChanged">
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="RequiredValddInstitution" ControlToValidate="ddInstitution"
                                 ErrorMessage="Please select Institution" runat="server" InitialValue="--Select--" Enabled="false" />
                            <br />
                            <br />
                            <asp:TextBox ID="txtOtherInstitution" runat="server" MaxLength="100" Visible="false"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredtxtOtherInstitution" ControlToValidate="txtOtherInstitution"
                                targetcontrolid="txtOtherInstitution" Text="Enter institution name" runat="server"
                                SetFocusOnError="True" />
                            <br />
                            <asp:TextBox ID="txtChequeInFavor" runat="server" MaxLength="100" Visible="false"></asp:TextBox>

                            <asp:RequiredFieldValidator ID="RequiredFieldValidator2" ControlToValidate="rdoChequeInFavor"
                                targetcontrolid="rdoChequeInFavor" Text="Please select DD/Cheque favour" runat="server"
                                SetFocusOnError="True" /><br />
                            <asp:RequiredFieldValidator ID="reqChequeInFavor" ControlToValidate="txtChequeInFavor"
                                targetcontrolid="txtChequeInFavor" Text="Please Enter DD/Cheque favour" runat="server"
                                Enabled="False" /><br />
                            <asp:RegularExpressionValidator ID="regChequeInFavor" runat="server" Enabled="False"
                                ErrorMessage="Special charectors not allowed" ControlToValidate="txtChequeInFavor"
                                ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>


                    <tr bgcolor="#FFFFFF" id="trChequeNo" runat="server">
                        <td valign="top">  
                             <asp:Label id="lblChkRecpt" runat="server">Cheque No</asp:Label><font color="#FF0000">*</font>
                        </td>
                        <td align="center" valign="top">:
                        </td>
                        <td>
                            <asp:TextBox ID="txtChequeNo" runat="server" MaxLength="7"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="reQChequeNo" ControlToValidate="txtChequeNo" targetcontrolid="txtChequeNo"
                                Text="Please Enter Cheque No" runat="server" SetFocusOnError="True" /><br />
                            <asp:RegularExpressionValidator ID="reGChequeNo" runat="server" ControlToValidate="txtChequeNo"
                                ErrorMessage="Enter only Numbers" SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <%--<tr bgcolor="#FFFFFF" id="trAccountNo" runat="server">
                    <td valign="top">
                        <span style="font-weight: bold;">Account No</span>
                    </td>
                    <td valign="top" align="center">
                        :
                    </td>
                    <td>
                        <asp:TextBox ID="txtAccountNo" runat="server" MaxLength="25" TabIndex="41"></asp:TextBox>
                        <asp:RequiredFieldValidator SetFocusOnError="True" ID="reQAccountNo" ControlToValidate="txtAccountNo"
                            Text="Please enter account no" runat="server" />
                        <asp:RegularExpressionValidator ID="reGAccountNo" runat="server" SetFocusOnError="True"
                            ErrorMessage="Special charectors not allowed" ControlToValidate="txtAccountNo"
                            ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                        </asp:RegularExpressionValidator>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" id="trBankName" runat="server">
                    <td valign="top">
                        <span style="font-weight: bold;">Bank Name</span>
                    </td>
                    <td valign="top" align="center">
                        :
                    </td>
                    <td>
                        <asp:DropDownList ID="ddlBankName" runat="server" TabIndex="5" CssClass="form-control">
                            <asp:ListItem Value="0">Select Bank</asp:ListItem>
                            <asp:ListItem Value="Allahabad Bank">Allahabad Bank</asp:ListItem>
                            <asp:ListItem Value="Andhra Bank">Andhra Bank</asp:ListItem>
                            <asp:ListItem Value="Bank of Baroda">Bank of Baroda</asp:ListItem>
                            <asp:ListItem Value="Bank of India">Bank of India</asp:ListItem>
                            <asp:ListItem Value="Bank of Maharashtra">Bank of Maharashtra</asp:ListItem>
                            <asp:ListItem Value="Canara Bank">Canara Bank</asp:ListItem>
                            <asp:ListItem Value="Central Bank of India">Central Bank of India</asp:ListItem>
                            <asp:ListItem Value="City Union Bank">City Union Bank</asp:ListItem>
                            <asp:ListItem Value="Corporation Bank">Corporation Bank</asp:ListItem>
                            <asp:ListItem Value="Dena Bank">Dena Bank</asp:ListItem>
                            <asp:ListItem Value="IDBI Bank Limited">IDBI Bank Limited</asp:ListItem>
                            <asp:ListItem Value="Indian Bank">Indian Bank</asp:ListItem>
                            <asp:ListItem Value="Indian Overseas Bank">Indian Overseas Bank</asp:ListItem>
                            <asp:ListItem Value="IDBI Bank">IDBI Bank</asp:ListItem>
                            <asp:ListItem Value="Industrial Development Bank of India">Industrial Development Bank of India</asp:ListItem>
                            <asp:ListItem Value="Oriental Bank of Commerce">Oriental Bank of Commerce</asp:ListItem>
                            <asp:ListItem Value="Punjab & Sind Bank">Punjab & Sind Bank</asp:ListItem>
                            <asp:ListItem Value="Punjab National Bank">Punjab National Bank</asp:ListItem>
                            <asp:ListItem Value="State Bank of Bikaner and Jaipur">State Bank of Bikaner and Jaipur</asp:ListItem>
                            <asp:ListItem Value="State Bank of Hyderabad">State Bank of Hyderabad</asp:ListItem>
                            <asp:ListItem Value="State Bank of India">State Bank of India</asp:ListItem>
                            <asp:ListItem Value="State Bank of Mysore">State Bank of Mysore</asp:ListItem>
                            <asp:ListItem Value="State Bank of Patiala">State Bank of Patiala</asp:ListItem>
                            <asp:ListItem Value="State Bank of Travancore">State Bank of Travancore</asp:ListItem>
                            <asp:ListItem Value="Syndicate Bank">Syndicate Bank</asp:ListItem>
                            <asp:ListItem Value="UCO Bank">UCO Bank</asp:ListItem>
                            <asp:ListItem Value="Union Bank of India">Union Bank of India</asp:ListItem>
                            <asp:ListItem Value="United Bank Of India">United Bank Of India</asp:ListItem>
                            <asp:ListItem Value="Vijaya Bank">Vijaya Bank</asp:ListItem>
                            <asp:ListItem Value="Axis Bank">Axis Bank</asp:ListItem>
                            <asp:ListItem Value="Catholic Syrian Bank Ltd">Catholic Syrian Bank Ltd</asp:ListItem>
                            <asp:ListItem Value="IndusInd Bank Limited">IndusInd Bank Limited</asp:ListItem>
                            <asp:ListItem Value="ICICI Bank">ICICI Bank</asp:ListItem>
                            <asp:ListItem Value="ING Vysya Bank">ING Vysya Bank</asp:ListItem>
                            <asp:ListItem Value="Kotak Mahindra Bank Limited">Kotak Mahindra Bank Limited</asp:ListItem>
                            <asp:ListItem Value="Karnataka Bank">Karnataka Bank</asp:ListItem>
                            <asp:ListItem Value="Karur Vysya Bank Limited">Karur Vysya Bank Limited</asp:ListItem>
                            <asp:ListItem Value="Tamilnad Mercantile Bank Ltd">Tamilnad Mercantile Bank Ltd</asp:ListItem>
                            <asp:ListItem Value="The Dhanalakshmi Bank Limited">The Dhanalakshmi Bank Limited</asp:ListItem>
                            <asp:ListItem Value="The Federal Bank Ltd">The Federal Bank Ltd</asp:ListItem>
                            <asp:ListItem Value="The HDFC Bank Ltd">The HDFC Bank Ltd</asp:ListItem>
                            <asp:ListItem Value="The Jammu & Kashmir Bank Ltd">The Jammu & Kashmir Bank Ltd</asp:ListItem>
                            <asp:ListItem Value="The Nainital Bank Ltd">The Nainital Bank Ltd</asp:ListItem>
                            <asp:ListItem Value="The Lakshmi Vilas Bank Ltd">The Lakshmi Vilas Bank Ltd</asp:ListItem>
                            <asp:ListItem Value="Yes Bank">Yes Bank</asp:ListItem>
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="reQBankName" runat="server" ErrorMessage="Please Select Bank"
                            ControlToValidate="ddlBankName" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" id="trBranch" runat="server">
                    <td valign="top">
                        <span style="font-weight: bold;">Branch</span>
                    </td>
                    <td valign="top" align="center">
                        :
                    </td>
                    <td>
                        <asp:TextBox ID="txtBranch" runat="server" MaxLength="100"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="reQBranch" ControlToValidate="txtBranch" targetcontrolid="txtBranch"
                            Text="Please Enter Branch" runat="server" SetFocusOnError="True" />
                        <asp:RegularExpressionValidator ID="reGBranch" runat="server" SetFocusOnError="True"
                            ErrorMessage="Special charectors not allowed" ControlToValidate="txtBranch" ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                        </asp:RegularExpressionValidator>
                    </td>
                </tr>--%>
                    <tr bgcolor="#FFFFFF" id="trddlIssuedBy" runat="server">
                        <td valign="top">
                            <span>DD/Cheque Issued By </span><font color="#FF0000">*</font>
                        </td>
                        <td valign="top" align="center">:
                        </td>
                        <td>
                            <asp:DropDownList ID="ddlIssuedBy" runat="server" AutoPostBack="true">
                            </asp:DropDownList>
                            <br />
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" ControlToValidate="ddlIssuedBy"
                                targetcontrolid="ddlIssuedBy" Text="Please select DD/Cheque favour" runat="server" />
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trFeeReceiptDate" Visible="false" runat="server">
                        <td valign="top">
                            <span>Fees Receipt Date</span><font color="#FF0000">*</font>
                        </td>
                        <td align="center" valign="top">:
                        </td>
                        <td>
                            <asp:TextBox ID="txtFeeReceiptDate" runat="server" MaxLength="15" TabIndex="1" placeholder="DD/MM/YYYY"></asp:TextBox>
                            <asp:CalendarExtender ID="txtDate2_CalendarExtender" runat="server" Format="dd/MM/yyyy"
                                TodaysDateFormat="dd/MM/yyyy" Enabled="True" TargetControlID="txtFeeReceiptDate" OnClientDateSelectionChanged="checkDate">
                            </asp:CalendarExtender>
                            <asp:RegularExpressionValidator ID="reGtxtFeeReceiptDate" runat="server" ErrorMessage="Enter valid Date dd/MM/YYYY"
                                SetFocusOnError="True" Style="position: relative" ValidationExpression="(((0[1-9]|[12][0-9]|3[01])([/])(0[13578]|10|12)([/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([/])(0[469]|11)([/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([/])(02)([/])(\d{4}))|((29)(\.|-|\/)(02)([/])([02468][048]00))|((29)([/])(02)([/])([13579][26]00))|((29)([/])(02)([/])([0-9][0-9][0][48]))|((29)([/])(02)([/])([0-9][0-9][2468][048]))|((29)([/])(02)([/])([0-9][0-9][13579][26])))"
                                ControlToValidate="txtFeeReceiptDate"></asp:RegularExpressionValidator>
                            <asp:RequiredFieldValidator ID="reQtxtFeeReceiptDate" ControlToValidate="txtFeeReceiptDate"
                                targetcontrolid="txtFeeReceiptDate" Text="Please Enter Fee Receipt Date" runat="server"
                                SetFocusOnError="True" />
                        </td>
                    </tr>



                    <tr bgcolor="#FFFFFF" id="trUpload" runat="server">
                        <td valign="top">
                            <asp:Label id="lbluploadIdName" runat="server">DD/Cheque Upload</asp:Label><font color="#FF0000">*</font>
                        </td>
                        <td align="center" valign="top">:
                        </td>
                        <td align="left">
                            <asp:FileUpload ID="fuDDChequeID" runat="server" />
                            <asp:RequiredFieldValidator ID="rfvFile7" runat="server" ControlToValidate="fuDDChequeID"
                                ErrorMessage="*">
                            </asp:RequiredFieldValidator><br />
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator7" runat="server" ControlToValidate="fuDDChequeID"
                                ErrorMessage="Enter only .jpg or .png file format" ValidationExpression="(.*\.jpe?g|.*\.JPE?G|.*\.png|.*\.PNG|)">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF" id="trAdminButtons">
                        <td align="center" colspan="3">
                            <asp:Button ID="btnDonate" runat="server" Text="Donate" OnClick="btnDonate_Click"
                                OnClientClick="fncHideButton" />
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
            <p>
            <asp:Label ID="lblSuccess" runat="server" Text=""></asp:Label>
               
            
          
                <asp:HyperLink ID="lnkPrintFinal" class="inline1" NavigateUrl='<%#"" %>'
                            runat="server" Text="Final Form" ></asp:HyperLink> </p>

            <p>

            <asp:Button ID="Button1" runat="server" Text="Ok" OnClick="btnOk_Click" /></p>
        </div>
    </form>
</body>
</html>
