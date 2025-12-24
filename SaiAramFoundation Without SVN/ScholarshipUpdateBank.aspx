<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScholarshipUpdateBank.aspx.cs" Inherits="SaiAramFoundation.ScholarshipUpdateBank" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

    
<head id="Head1" runat="server">
    <title>Aram Foundation</title>
</head>
<body>
    <form id="form1" runat="server">
      <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
            </asp:ToolkitScriptManager>
    <div id="dvform" runat="server">

         <div id="divPrint">
        <table id="tblContent" width="75%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
            <tr bgcolor="#FFFFFF">
                <td colspan="3" class="lblData" style="height:30px">
                    <span style="font-weight:bold;">Aram Foundation - Scholarship Finalize Panel</span><br />
                   
                </td>
            </tr>
            <tr bgcolor="#FFFFFF">
                <td width="30%">
                   <span style="font-weight:bold;"> Application Number</span>
                </td>
                <td width="5%" align="center">
                    :
                </td>
                <td width="65%" class="lblData">
                    <asp:label id="lblApplnNo" runat="server"></asp:label>
                </td>
            </tr>
             <tr bgcolor="#FFFFFF">
                <td width="30%">
                   <span style="font-weight:bold;"> Scholership Number</span>
                </td>
                <td width="5%" align="center">
                    :
                </td>
                <td width="65%" class="lblData">
                    <asp:label id="lblScNo" runat="server"></asp:label>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF">
                <td>
                  <span style="font-weight:bold;"> Name</span>
                </td>
                <td align="center">
                    :
                </td>
                <td class="lblData">
                    <asp:label id="lblName" runat="server" text=""></asp:label>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF" style="display: none;">
                <td>
                   <span style="font-weight:bold;"> DOB</span>
                </td>
                <td align="center">
                    :
                </td>
                <td class="lblData">
                    <asp:label id="lblDOB" runat="server" text=""></asp:label>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF">
                <td>
                  <span style="font-weight:bold;"> Father's Name</span>
                </td>
                <td align="center">
                    :
                </td>
                <td class="lblData">
                    <asp:label id="lblFatherName" runat="server" text=""></asp:label>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF">
                <td>
                    <span style="font-weight:bold;">Father's Occupation</span>
                </td>
                <td align="center">
                    :
                </td>
                <td class="lblData">
                    <asp:label id="lblFatherOccupation" runat="server" text=""></asp:label>
                </td>
            </tr>
            
            
            
            <tr bgcolor="#FFFFFF" id="trDateOfIssue" runat="server">
                <td>
                    <span style="font-weight:bold;">Date of Issue</span>
                </td>
                <td align="center">
                    :
                </td>
                <td>
                 <asp:label id="lblDateOfIssue" runat="server" text=""></asp:label>   
                </td>
            </tr>
            <tr bgcolor="#FFFFFF" id="trScholarshipSeeking" runat="server">
                <td>
                    <span style="font-weight:bold;">scholarship Seeking For </span>  
                </td>
                <td align="center">
                    :
                </td>
                <td>
                <asp:label id="lblScholarShipSeekingFor" runat="server" text=""></asp:label>   
                </td>
            </tr>
          
       <tr bgcolor="#FFFFFF" id="tr1" runat="server">
                <td>
                   <span style="font-weight:bold;"> Suggested Amount</span>
                </td>
                <td align="center">
                    :
                </td>
                <td>                 
                   <asp:label id="lblSuggestedAmt" runat="server" text=""></asp:label>
                </td>
            </tr>
             <tr bgcolor="#FFFFFF" id="tr2" runat="server">
                <td>
                    <span style="font-weight:bold;">Approved Amount</span>
                </td>
                <td align="center">
                    :
                </td>
                <td>                 
                 <asp:label id="lblApprovedAmt" runat="server" text=""></asp:label>
                </td>
            </tr>
         
            
            <tr bgcolor="#FFFFFF" id="trChequeNo" runat="server">
                <td>
                   <span style="font-weight:bold;"> Cheque No</span>
                </td>
                <td align="center">
                    :
                </td>
                <td>                 
                 <asp:label id="lblChequeno" runat="server" text=""></asp:label>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF" id="trAmountIssued" runat="server">
                <td valign="top">
                    <span style="font-weight:bold;"> Amount Issued</span>
                </td>
                <td valign="top" align="center">
                    :
                </td>
                 <td>                 
                  <asp:label id="lblAmountIssued" runat="server" text=""></asp:label>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF" id="trAccountNo" runat="server">
                <td valign="top">
                    <span style="font-weight:bold;"> Account No</span>
                </td>
                <td valign="top" align="center">
                    :
                </td>
                 <td>                 
              <asp:label id="lblAccountNo" runat="server" text=""></asp:label>
                </td>
            </tr>            
            <tr bgcolor="#FFFFFF" id="trBankName" runat="server">
                <td valign="top">
                    <span style="font-weight:bold;"> Bank Name</span>
                </td>
                <td valign="top" align="center">
                    :
                </td>
                 <td>                 
                  <asp:DropDownList ID="ddlBankName" runat="server" TabIndex="5" 
                                                CssClass="form-control">
                                                <asp:ListItem Value="0">Select Bank</asp:ListItem>
                                                <asp:ListItem Value="Allahabad Bank">Allahabad Bank</asp:ListItem>
                                                <asp:ListItem Value="Andhra Bank">Andhra Bank</asp:ListItem>
                                                <asp:ListItem Value="Bank of Baroda">Bank of Baroda</asp:ListItem>
                                                <asp:ListItem Value="Bank of India">Bank of India</asp:ListItem>
                                                <asp:ListItem Value="Bank of Maharashtra">Bank of Maharashtra</asp:ListItem>
                                                <asp:ListItem Value="Canara Bank">Canara Bank</asp:ListItem>
                                                <asp:ListItem Value="Central Bank of India">Central Bank of India</asp:ListItem>
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
                    <span style="font-weight:bold;"> Branch</span>
                </td>
                <td valign="top" align="center">
                    :
                </td>
                 <td>                 
                   <asp:TextBox  ID="txtBranch" runat="server" MaxLength="100"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="reQBranch" ControlToValidate="txtBranch"
                                        targetcontrolid="txtBranch" Text="Please Enter Branch" runat="server" SetFocusOnError="True" />
                                     <asp:RegularExpressionValidator ID="reGBranch" runat="server"
                                                SetFocusOnError="True" ErrorMessage="Special charectors not allowed" ControlToValidate="txtBranch"
                                                ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                            </asp:RegularExpressionValidator>
                </td>
            </tr>
            
             <tr bgcolor="#FFFFFF" id="trAdminButtons">
                <td align="center" colspan="3">
                    <asp:Button ID="btnUpdate" runat="server" Text="Update" onclick="btnUpdate_Click" 
                        />
                </td>
            </tr>
           
            <tr bgcolor="#FFFFFF">
                <td align="center" colspan="3">
                    <asp:label id="lblError" runat="server" text="" forecolor="Red" font-bold="true"></asp:label>
                </td>
            </tr>
             
        </table>
        </div>
    </div>
    <div runat="server" id="dvSuccess" visible="false">
        <asp:label id="lblSuccess" runat="server" text=""></asp:label>
    </div>
    </form>
</body>
</html>
