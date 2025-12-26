<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Verify.aspx.cs" Inherits="SaiAramFoundation.Verify" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>LEO MUTHU Scholarship</title>
</head>
<style type="text/css">
    .Content {
        font-family: verdana, arial, tahoma;
        font-size: 12px;
        vertical-align: baseline;
    }

    .fancybox-skin {
        height: auto;
        padding: 15px;
        width: 130%;
    }
</style>
<body>

    <script type="text/javascript">

        //$(document).ready(function (sender, args) {
        //    alert("mjhn");
        //    var aadhar = document.getElementById("txtAadhaarID.Text");
           
        //    if (aadhar == "") {

        //        document.getElementById("chkAadhaarID").style.display = "none";
        //    }
        //    else {
        //        document.getElementById("chkAadhaarID").style.display = "block";
        //    }
        //    var pan = document.getElementById("txtPanID.Text");
        //    if (pan == "") {
        //        document.getElementById("chkPanId").style.display = "none";
        //    }
        //    else {
        //        document.getElementById("chkPanId").style.display = "block";
        //    }
        //});

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
        function ValidateCheckBox(sender, args) {
            if (document.getElementById("<%=chkName.ClientID %>").checked == true) {
                args.IsValid = true;
            } else {
                args.IsValid = false;
            }
        }
        function ValidateCheckBox1(sender, args) {
            if (document.getElementById("<%=txtAadhaarID.ClientID%>").value != "") {
                if (document.getElementById("<%=chkAadhaarID.ClientID %>").checked == true) {
                    args.IsValid = true;
                } else {
                    args.IsValid = false;
                }
            }
        }
        function ValidateCheckBox2(sender, args) {
            if (document.getElementById("<%=txtPanId.ClientID%>").value != "") {
                if (document.getElementById("<%=chkPanId.ClientID%>").checked == true) {
                    args.IsValid = true;
                } else {
                    args.IsValid = false;
                }
            }
        }
       
        function validateLength(oSrc, args) {
            args.IsValid = (args.Value.length >= 12);
        }
        function validateLengthPanId(oSrc, args) {
            args.IsValid = (args.Value.length >= 10);
        }
    </script>

    <form id="form1" runat="server">
        <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </asp:ToolkitScriptManager>
        <div id="dvform" runat="server" style="">
            <div id="dvVerify" runat="server" class="Content">
                <table width="100%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                    <tr bgcolor="#FFFFFF">
                        <td colspan="4" style="height: 30px">
                            <span style="font-weight: bold">LEO MUTHU Scholarship - Document Verification (
                            <asp:Label ID="lblSchlorshipYear" runat="server" Text=""></asp:Label>
                                ) </span>
                        </td>
                    </tr>
                    <tr bgcolor="#DCDCDC">
                        <td colspan="4" align="center">
                            <span style="font-weight: bold">Previous Scholarship History</span>
                        </td>
                    </tr>
                    <tr bgcolor="#DCDCDC">
                        <td colspan="2" align="right">
                            <span>Already Applied:</span>
                        </td>
                        <td colspan="2">
                            <asp:Label ID="lblAlreadyApplied" runat="server" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#DCDCDC">
                        <td colspan="2" align="right">
                            <span>Already Scholarship Issued:</span>
                        </td>
                        <td colspan="2">
                            <asp:GridView ID="gvDisplayPreviousScholarshipDetails" runat="server" AutoGenerateColumns="False"
                                AllowPaging="False" CssClass="table table-condensed" EmptyDataText="----">
                                <RowStyle />
                                <PagerSettings Position="TopAndBottom" />
                                <Columns>
                                    <asp:TemplateField HeaderText="ScholarshipYear" ItemStyle-HorizontalAlign="Center">
                                        <ItemTemplate>
                                            <asp:Label ID="lblScholarshipYear" runat="server" Text='<%#Eval("ScholarshipYear_Code") %>'></asp:Label>
                                        </ItemTemplate>
                                        <ItemStyle Width="150px"></ItemStyle>
                                    </asp:TemplateField>
                                    <asp:TemplateField HeaderText="Issued Amount" ItemStyle-HorizontalAlign="Center">
                                        <ItemTemplate>
                                            <asp:Label ID="lblIssuedAmount" runat="server" Text='<%#Eval("Scholarship_Issued_Amount") %>'></asp:Label>
                                        </ItemTemplate>
                                        <ItemStyle Width="150px"></ItemStyle>
                                    </asp:TemplateField>
                                </Columns>
                            </asp:GridView>
                        </td>
                    </tr>

                    <tr bgcolor="#FFFFFF">
                        <td colspan="4">
                            <span>Application Number :</span>
                            <asp:Label ID="lblApplnNo" runat="server" Style="font-weight: bold;"></asp:Label>
                             <asp:Label ID="lblmandatoryError" runat="server" Style="font-weight: bold; color:red;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Name :</span>
                        </td>
                        <td class="lblData">
                            <asp:TextBox class="form-control" ID="txtName" runat="server" MaxLength="95"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvtxtName" runat="server" ErrorMessage="Please enter name"
                                ControlToValidate="txtName" SetFocusOnError="True" Display="Dynamic"></asp:RequiredFieldValidator>
                            <asp:RegularExpressionValidator ID="revLastName" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                ControlToValidate="txtName" ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True" Display="Dynamic">
                            </asp:RegularExpressionValidator>
                        </td>
                        <td valign="top">
                            <span>AADHAAR ID :</span>
                        </td>
                        <td class="lblData">
                            <asp:TextBox class="form-control" ID="txtAadhaarID" runat="server" MaxLength="12"></asp:TextBox>
                          <%--  <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="Please enter AadhaarID"
                                ControlToValidate="txtAadhaarID" SetFocusOnError="True" Display="Dynamic"></asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator19" runat="server"
                                ControlToValidate="txtAadhaarID" ErrorMessage="Enter only Numbers" SetFocusOnError="True"
                                ValidationExpression="[0-9]*" Display="Dynamic"></asp:RegularExpressionValidator>
                            <asp:CustomValidator ID="CustomValidator3" runat="server" ControlToValidate="txtAadhaarID"
                                ErrorMessage="You must enter 12 digits number!" ClientValidationFunction="validateLength" Display="Dynamic"></asp:CustomValidator>
                        </td>
                    </tr>
                  
                    <tr bgcolor="#FFFFFF">
                        <td colspan="2">
                            <asp:CheckBox runat="server" ID="chkName" />
                            <asp:CustomValidator ID="CustomValidator1" runat="server" ErrorMessage="Please check whether student name is correct or not!"
                                ClientValidationFunction="ValidateCheckBox" Display="Dynamic"></asp:CustomValidator>
                        </td>
                        <td colspan="2">
                            <asp:CheckBox runat="server" ID="chkAadhaarID" />
                            <asp:CustomValidator ID="CustomValidator2" runat="server" ErrorMessage="Please check whether AadhaarID is correct or not!"
                                ClientValidationFunction="ValidateCheckBox1" Display="Dynamic"></asp:CustomValidator>
                        </td>
                    </tr>
                      <tr>
                         <td valign="top" bgcolor="#FFFFFF">
                            <span>PAN NO :</span>
                        </td>
                        <td class="lblData" bgcolor="#FFFFFF">
                            <asp:TextBox class="form-control" ID="txtPanId" runat="server" MaxLength="10"></asp:TextBox>
                          <%--  <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="Please enter Pan Number"
                               ClientValidationFunction="ValidateTextBox2" ControlToValidate="txtPanId" SetFocusOnError="True" Display="Dynamic"></asp:RequiredFieldValidator>--%>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator2" runat="server"
                                ControlToValidate="txtPanId" ErrorMessage="Enter the correct PAN ID Number" SetFocusOnError="True"
                                ValidationExpression="[a-zA-Z0-9.@]*" Display="Dynamic"></asp:RegularExpressionValidator>
                            <asp:CustomValidator ID="CustomValidator4" runat="server" ControlToValidate="txtPanId"
                                ErrorMessage="You must enter 10 digits Alpha-Numeric!" ClientValidationFunction="validateLengthPanId" Display="Dynamic"></asp:CustomValidator>
                        </td>
                          <td bgcolor="#FFFFFF"><span>Student Id :</span></td>
                           <td bgcolor="#FFFFFF">
                                <asp:TextBox class="form-control" ID="txtStudentId" runat="server" MaxLength="10"></asp:TextBox>
                          <%--  <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="Please enter student Id"
                                ControlToValidate="txtStudentId" SetFocusOnError="True" Display="Dynamic"></asp:RequiredFieldValidator>--%>
                          <%-- <asp:RegularExpressionValidator ID="RegularExpressionValidator3" runat="server"
                                ControlToValidate="txtStudentId" ErrorMessage="Special characters not allowed" SetFocusOnError="True"
                                ValidationExpression="[a-zA-Z0-9.@]*" Display="Dynamic">
                            </asp:RegularExpressionValidator>--%>
                           </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                         <td colspan="2">
                            <asp:CheckBox runat="server" ID="chkPanId" />
                            <asp:CustomValidator ID="CustomValidator5" runat="server" ErrorMessage="Please check whether PAN ID is correct or not!"
                                ClientValidationFunction="ValidateCheckBox2" Display="Dynamic"></asp:CustomValidator>
                        </td>
                         <td bgcolor="#FFFFFF"></td>
                         <td bgcolor="#FFFFFF"></td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td width="20%" valign="top">
                            <span>Father's Name :</span>
                        </td>
                        <td width="26%">
                            <asp:TextBox class="form-control" ID="txtFatherName" runat="server" MaxLength="95"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ErrorMessage="Please enter father's name"
                                ControlToValidate="txtFatherName" SetFocusOnError="True" Display="Dynamic"></asp:RequiredFieldValidator>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator9" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                ControlToValidate="txtFatherName" ValidationExpression="^[a-zA-Z\s-.]{1,50}$"
                                SetFocusOnError="True" Display="Dynamic">
                            </asp:RegularExpressionValidator>
                        </td>
                        <td width="20%" valign="top">
                            <span>Father's Occupation :</span>
                            <asp:HiddenField ID="hideApplicationId" runat="server" />
                        </td>
                        <td width="26%" valign="top">
                            <asp:DropDownList class="form-control" ID="ddlFatherOccupathion" runat="server" Style="width: 85%"
                                OnSelectedIndexChanged="ddlFatherOccupathion_SelectedIndexChanged" AutoPostBack="true">
                                <asp:ListItem Value="0">..Select..</asp:ListItem>
                                <asp:ListItem Value="Agriculture Service">Agriculture Service</asp:ListItem>
                                <asp:ListItem Value="Business">Business</asp:ListItem>
                                <asp:ListItem Value="Defence Service">Defence service</asp:ListItem>
                                <asp:ListItem Value="Engineering Service">Engineering service</asp:ListItem>
                                <asp:ListItem Value="Public / Govt. Service">Public / Govt. service</asp:ListItem>
                                <asp:ListItem Value="Law Practice">Law practice</asp:ListItem>
                                <asp:ListItem Value="Medical Service">Medical service</asp:ListItem>
                                <asp:ListItem Value="Private Service">Private service</asp:ListItem>
                                <asp:ListItem Value="Self Employed">Self employed</asp:ListItem>
                                <asp:ListItem Value="Teaching Research">Teaching research</asp:ListItem>
                                <asp:ListItem Value="Working for daily wages">Working for daily wages</asp:ListItem>
                                <asp:ListItem Value="Unemployed">Unemployed</asp:ListItem>
                                <asp:ListItem Value="Retired">Retired</asp:ListItem>
                                <asp:ListItem Value="Divorced">Divorced</asp:ListItem>
                                <asp:ListItem Value="Late">Late</asp:ListItem>
                                <asp:ListItem Value="SaiRam Groups">SaiRam Groups</asp:ListItem>
                                <asp:ListItem Value="Others">Others</asp:ListItem>
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator SetFocusOnError="True" ID="rfvOccupation" ControlToValidate="ddlFatherOccupathion"
                                Text="Please enter occupation" runat="server" InitialValue="0" Display="Dynamic" />
                            <div class="form-group col-md-14" id="dvOtherFatherOccupation" runat="server" visible="false">
                                <asp:TextBox class="form-control" ID="txtOtherFatherOccupation" runat="server" MaxLength="95"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="rfvOtherFatherOccupation" runat="server" ErrorMessage="Please enter other occupation"
                                    ControlToValidate="txtOtherFatherOccupation" SetFocusOnError="True" Enabled="false" Display="Dynamic"></asp:RequiredFieldValidator>
                            </div>
                            <div class="form-group col-md-14" id="dvFatherOccupathionSaiRam" runat="server" visible="false">
                                <asp:DropDownList class="form-control" ID="ddlFatherOccupathionSaiRam" runat="server" Style="width: 85%">
                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Engineering College,West Tambaram,Chennai">Sri Sai Ram Engineering College,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Institute of Technology,West Tambaram,Chennai">Sri Sai Ram Institute of Technology,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Siddha,West Tambaram,Chennai">Sri Sai Ram Siddha,West Tambaram,Chennai </asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai">Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai">Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai </asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Polytechnic College,West Tambaram,Chennai">Sri Sai Ram Polytechnic College,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Advanced Centre for Research,West Tambaram,Chennai">Sai Ram Advanced Centre for Research,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai">Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Matriculation Hr Sec School,Madipakkam,Chennai">Sai Matriculation Hr Sec School,Madipakkam,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Vidyalaya,Madipakkam,Chennai">Sai Ram Vidyalaya,Madipakkam,Chennai</asp:ListItem>
                                    <%--<asp:ListItem Value="Sai Ram College of Education,Ullavaikal,Pondicherry">Sai Ram College of Education,Ullavaikal,Pondicherry</asp:ListItem>--%>
                                    <asp:ListItem Value="Sai Ram Vidyalaya,Ullavaikal,Pondicherry">Sai Ram Vidyalaya,Ullavaikal,Pondicherry</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai">Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai</asp:ListItem>
                                    <asp:ListItem Value="Sai Jothi Polytechnic College,Ellayarpathi,Madurai">Sai Jothi Polytechnic College,Ellayarpathi,Madurai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Thiruthuripoondi">Sai Ram Matriculation Hr Sec School,Thiruthuripoondi</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation School,Thiruvarur">Sai Ram Matriculation School,Thiruvarur</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram I.T.I,Senankottai,Dindigul">Sai Ram I.T.I,Senankottai,Dindigul</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram College of Engineering,Anekal,Bangalore">Shirdi Sai Engineering College,Anekal,Bangalore</asp:ListItem>
                                    <asp:ListItem Value="Shirdi Sai Pre University College,Guddanahalli,Bangalore">Shirdi Sai Pre University College,Guddanahalli,Bangalore</asp:ListItem>
                                    <asp:ListItem Value="Sairam Trust Office-T.Nagar,Chennai">Sairam Trust Office-T.Nagar,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Shri Padmavathi Medical college & Hospital , Tirupati">Shri Padmavathi Medical college & Hospital , Tirupati</asp:ListItem>
                                    <asp:ListItem Value="Leo Housing (p) Ltd,T. Nagar, Chennai">Leo Housing (p) Ltd,T. Nagar, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Leo Real Estate,T. Nagar, Chennai">Leo Real Estate,T. Nagar, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Super Seafood Products Private Limited,Kattalankulam,Tuticorin">Super Seafood Products Private Limited,Kattalankulam,Tuticorin</asp:ListItem>
                                    <asp:ListItem Value="Super Fibre Glass Ltd,Madipakkam, Chennai">Super Fibre Glass Ltd,Madipakkam, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sairaj Printers,west Tambaram Chennai">Sairaj Printers,west Tambaram Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sairam Hospital , Tambaram Chennai">Sairam Hospital , Tambaram Chennai</asp:ListItem>
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rfvFatherOccupathionSaiRam" runat="server" ErrorMessage="Please select occupation"
                                    ControlToValidate="ddlFatherOccupathionSaiRam" SetFocusOnError="True" InitialValue="0" Enabled="false" Display="Dynamic"></asp:RequiredFieldValidator>
                            </div>

                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Mother's Name :</span>
                        </td>
                        <td>
                            <asp:TextBox class="form-control" ID="txtMotherName" runat="server" MaxLength="95"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" ErrorMessage="Please enter mother's name" Display="Dynamic"
                                ControlToValidate="txtMotherName" SetFocusOnError="True"></asp:RequiredFieldValidator>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator10" runat="server"
                                ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtMotherName" Display="Dynamic"
                                ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                            </asp:RegularExpressionValidator>
                        </td>
                        <td valign="top">
                            <span>Mother's Occupation :</span>
                        </td>
                        <td valign="top">
                            <asp:DropDownList class="form-control" ID="ddlMotherOccupathion" runat="server" Style="width: 85%"
                                OnSelectedIndexChanged="ddlMotherOccupathion_SelectedIndexChanged" AutoPostBack="true">
                                <asp:ListItem Value="0">..Select..</asp:ListItem>
                                <asp:ListItem Value="Agriculture Service">Agriculture Service</asp:ListItem>
                                <asp:ListItem Value="Business">Business</asp:ListItem>
                                <asp:ListItem Value="Defence Service">Defence service</asp:ListItem>
                                <asp:ListItem Value="Engineering Service">Engineering service</asp:ListItem>
                                <asp:ListItem Value="Public / Govt. Service">Public / Govt. service</asp:ListItem>
                                <asp:ListItem Value="Law Practice">Law practice</asp:ListItem>
                                <asp:ListItem Value="Medical Service">Medical service</asp:ListItem>
                                <asp:ListItem Value="Private Service">Private service</asp:ListItem>
                                <asp:ListItem Value="Self Employed">Self employed</asp:ListItem>
                                <asp:ListItem Value="Teaching Research">Teaching research</asp:ListItem>
                                <asp:ListItem Value="Working for daily wages">Working for daily wages</asp:ListItem>
                                <asp:ListItem Value="Unemployed">Unemployed</asp:ListItem>
                                <asp:ListItem Value="House wife">House wife</asp:ListItem>
                                <asp:ListItem Value="Retired">Retired</asp:ListItem>
                                <asp:ListItem Value="Divorced">Divorced</asp:ListItem>
                                <asp:ListItem Value="Late">Late</asp:ListItem>
                                <asp:ListItem Value="SaiRam Groups">SaiRam Groups</asp:ListItem>
                                <asp:ListItem Value="Others">Others</asp:ListItem>
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator12"
                                ControlToValidate="ddlMotherOccupathion" Text="Please enter occupation" runat="server" Display="Dynamic"
                                InitialValue="0" />
                            <div class="form-group col-md-14" id="dvOtherMotherOccupathion" runat="server" visible="false">
                                <asp:TextBox class="form-control" ID="txtOtherMotherOccupation" runat="server" MaxLength="95"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="rvfOtherMotherOccupation" runat="server" ErrorMessage="Please enter other occupation" Display="Dynamic"
                                    ControlToValidate="txtOtherFatherOccupation" SetFocusOnError="True" Enabled="false"></asp:RequiredFieldValidator>
                            </div>
                            <div class="form-group col-md-14" id="dvMotherOccupathionSaiRam" runat="server" visible="false">
                                <asp:DropDownList class="form-control" ID="ddlMotherOccupathionSaiRam" runat="server" Style="width: 85%">
                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Engineering College,West Tambaram,Chennai">Sri Sai Ram Engineering College,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Institute of Technology,West Tambaram,Chennai">Sri Sai Ram Institute of Technology,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Siddha,West Tambaram,Chennai">Sri Sai Ram Siddha,West Tambaram,Chennai </asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai">Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai">Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai </asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Polytechnic College,West Tambaram,Chennai">Sri Sai Ram Polytechnic College,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Advanced Centre for Research,West Tambaram,Chennai">Sai Ram Advanced Centre for Research,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai">Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Matriculation Hr Sec School,Madipakkam,Chennai">Sai Matriculation Hr Sec School,Madipakkam,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Vidyalaya,Madipakkam,Chennai">Sai Ram Vidyalaya,Madipakkam,Chennai</asp:ListItem>
                                    <%--<asp:ListItem Value="Sai Ram College of Education,Ullavaikal,Pondicherry">Sai Ram College of Education,Ullavaikal,Pondicherry</asp:ListItem>--%>
                                    <asp:ListItem Value="Sai Ram Vidyalaya,Ullavaikal,Pondicherry">Sai Ram Vidyalaya,Ullavaikal,Pondicherry</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai">Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai</asp:ListItem>
                                    <asp:ListItem Value="Sai Jothi Polytechnic College,Ellayarpathi,Madurai">Sai Jothi Polytechnic College,Ellayarpathi,Madurai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Thiruthuripoondi">Sai Ram Matriculation Hr Sec School,Thiruthuripoondi</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation School,Thiruvarur">Sai Ram Matriculation School,Thiruvarur</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram I.T.I,Senankottai,Dindigul">Sai Ram I.T.I,Senankottai,Dindigul</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram College of Engineering,Anekal,Bangalore">Shirdi Sai Engineering College,Anekal,Bangalore</asp:ListItem>
                                    <asp:ListItem Value="Shirdi Sai Pre University College,Guddanahalli,Bangalore">Shirdi Sai Pre University College,Guddanahalli,Bangalore</asp:ListItem>
                                    <asp:ListItem Value="Sairam Trust Office-T.Nagar,Chennai">Sairam Trust Office-T.Nagar,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Shri Padmavathi Medical college & Hospital , Tirupati">Shri Padmavathi Medical college & Hospital , Tirupati</asp:ListItem>
                                    <asp:ListItem Value="Leo Housing (p) Ltd,T. Nagar, Chennai">Leo Housing (p) Ltd,T. Nagar, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Leo Real Estate,T. Nagar, Chennai">Leo Real Estate,T. Nagar, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Super Seafood Products Private Limited,Kattalankulam,Tuticorin">Super Seafood Products Private Limited,Kattalankulam,Tuticorin</asp:ListItem>
                                    <asp:ListItem Value="Super Fibre Glass Ltd,Madipakkam, Chennai">Super Fibre Glass Ltd,Madipakkam, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sairaj Printers,west Tambaram Chennai">Sairaj Printers,west Tambaram Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sairam Hospital , Tambaram Chennai">Sairam Hospital , Tambaram Chennai</asp:ListItem>
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rvfMotherOccupationSaiRam" runat="server" ErrorMessage="Please select occupation" Display="Dynamic"
                                    ControlToValidate="ddlMotherOccupathionSaiRam" SetFocusOnError="True" InitialValue="0" Enabled="false"></asp:RequiredFieldValidator>
                            </div>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Guardian Name :</span>
                        </td>
                        <td valign="top">
                            <asp:TextBox class="form-control" ID="txtGuardianName" runat="server" MaxLength="95"></asp:TextBox>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server"
                                ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtGuardianName" Display="Dynamic"
                                ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                            </asp:RegularExpressionValidator>
                        </td>
                        <td valign="top">
                            <span>Guardian Occupation :</span>
                        </td>
                        <td valign="top">
                            <asp:DropDownList class="form-control" ID="ddlGuardianOccupathion" runat="server" Style="width: 85%"
                                OnSelectedIndexChanged="ddlGuardianOccupathion_SelectedIndexChanged" AutoPostBack="true">
                                <asp:ListItem Value="0">..Select..</asp:ListItem>
                                <asp:ListItem Value="Agriculture Service">Agriculture Service</asp:ListItem>
                                <asp:ListItem Value="Business">Business</asp:ListItem>
                                <asp:ListItem Value="Defence Service">Defence service</asp:ListItem>
                                <asp:ListItem Value="Engineering Service">Engineering service</asp:ListItem>
                                <asp:ListItem Value="Public / Govt. Service">Public / Govt. service</asp:ListItem>
                                <asp:ListItem Value="Law Practice">Law practice</asp:ListItem>
                                <asp:ListItem Value="Medical Service">Medical service</asp:ListItem>
                                <asp:ListItem Value="Private Service">Private service</asp:ListItem>
                                <asp:ListItem Value="Self Employed">Self employed</asp:ListItem>
                                <asp:ListItem Value="Teaching Research">Teaching research</asp:ListItem>
                                <asp:ListItem Value="Working for daily wages">Working for daily wages</asp:ListItem>
                                <asp:ListItem Value="Unemployed">Unemployed</asp:ListItem>
                                <asp:ListItem Value="House wife">House wife</asp:ListItem>
                                <asp:ListItem Value="Retired">Retired</asp:ListItem>
                                <asp:ListItem Value="Divorced">Divorced</asp:ListItem>
                                <asp:ListItem Value="Late">Late</asp:ListItem>
                                <asp:ListItem Value="SaiRam Groups">SaiRam Group</asp:ListItem>
                                <asp:ListItem Value="Others">Others</asp:ListItem>
                            </asp:DropDownList>
                            <%--   <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator4"
                                ControlToValidate="ddlGuardianOccupathion" Text="Please enter occupation" runat="server"
                                InitialValue="0" />--%>
                            <div class="form-group col-md-14" id="dvOtherGuardianOccupathion" runat="server" visible="false">
                                <asp:TextBox class="form-control" ID="txtOtherGuardianOccupathion" runat="server" MaxLength="95" Style="width: 85%"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="rvfOtherGuardianOccupathion" runat="server" ErrorMessage="Please enter other occupation" Display="Dynamic"
                                    ControlToValidate="txtOtherGuardianOccupathion" SetFocusOnError="True" Enabled="false"></asp:RequiredFieldValidator>
                            </div>
                            <div class="form-group col-md-14" id="dvGuardianOccupathionSaiRam" runat="server" visible="false">
                                <asp:DropDownList class="form-control" ID="ddlGuardianOccupathionSaiRam" runat="server" Style="width: 85%">
                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Engineering College,West Tambaram,Chennai">Sri Sai Ram Engineering College,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Institute of Technology,West Tambaram,Chennai">Sri Sai Ram Institute of Technology,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Siddha,West Tambaram,Chennai">Sri Sai Ram Siddha,West Tambaram,Chennai </asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai">Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai">Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai </asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Polytechnic College,West Tambaram,Chennai">Sri Sai Ram Polytechnic College,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Advanced Centre for Research,West Tambaram,Chennai">Sai Ram Advanced Centre for Research,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai">Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Matriculation Hr Sec School,Madipakkam,Chennai">Sai Matriculation Hr Sec School,Madipakkam,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Vidyalaya,Madipakkam,Chennai">Sai Ram Vidyalaya,Madipakkam,Chennai</asp:ListItem>
                                    <%--<asp:ListItem Value="Sai Ram College of Education,Ullavaikal,Pondicherry">Sai Ram College of Education,Ullavaikal,Pondicherry</asp:ListItem>--%>
                                    <asp:ListItem Value="Sai Ram Vidyalaya,Ullavaikal,Pondicherry">Sai Ram Vidyalaya,Ullavaikal,Pondicherry</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai">Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai</asp:ListItem>
                                    <asp:ListItem Value="Sai Jothi Polytechnic College,Ellayarpathi,Madurai">Sai Jothi Polytechnic College,Ellayarpathi,Madurai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Thiruthuripoondi">Sai Ram Matriculation Hr Sec School,Thiruthuripoondi</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation School,Thiruvarur">Sai Ram Matriculation School,Thiruvarur</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram I.T.I,Senankottai,Dindigul">Sai Ram I.T.I,Senankottai,Dindigul</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram College of Engineering,Anekal,Bangalore">Shirdi Sai Engineering College,Anekal,Bangalore</asp:ListItem>
                                    <asp:ListItem Value="Shirdi Sai Pre University College,Guddanahalli,Bangalore">Shirdi Sai Pre University College,Guddanahalli,Bangalore</asp:ListItem>
                                    <asp:ListItem Value="Sairam Trust Office-T.Nagar,Chennai">Sairam Trust Office-T.Nagar,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Shri Padmavathi Medical college & Hospital , Tirupati">Shri Padmavathi Medical college & Hospital , Tirupati</asp:ListItem>
                                    <asp:ListItem Value="Leo Housing (p) Ltd,T. Nagar, Chennai">Leo Housing (p) Ltd,T. Nagar, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Leo Real Estate,T. Nagar, Chennai">Leo Real Estate,T. Nagar, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Super Seafood Products Private Limited,Kattalankulam,Tuticorin">Super Seafood Products Private Limited,Kattalankulam,Tuticorin</asp:ListItem>
                                    <asp:ListItem Value="Super Fibre Glass Ltd,Madipakkam, Chennai">Super Fibre Glass Ltd,Madipakkam, Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sairaj Printers,west Tambaram Chennai">Sairaj Printers,west Tambaram Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sairam Hospital , Tambaram Chennai">Sairam Hospital , Tambaram Chennai</asp:ListItem>
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rvfGuardianOccupationSaiRam" runat="server" ErrorMessage="Please select occupation" Display="Dynamic"
                                    ControlToValidate="ddlGuardianOccupathionSaiRam" SetFocusOnError="True" InitialValue="0" Enabled="false"></asp:RequiredFieldValidator>
                            </div>
                        </td>
                    </tr>

                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Type of Institution :</span>
                        </td>
                        <td valign="top">
                            <asp:RadioButtonList ID="radTypeofInstitution" runat="server" RepeatColumns="3">
                                <asp:ListItem Value="Government">Govt</asp:ListItem>
                                <asp:ListItem Value="Government Aided">Govt aided</asp:ListItem>
                                <asp:ListItem Value="Private">Private</asp:ListItem>
                            </asp:RadioButtonList>
                            <asp:RequiredFieldValidator ID="reqInstitution" runat="server" ErrorMessage="Please select institution Type" Display="Dynamic"
                                ControlToValidate="radTypeofInstitution" SetFocusOnError="True"></asp:RequiredFieldValidator>
                        </td>
                        <td valign="top">
                            <span>Name of Institution(Now studying)</span>
                        </td>
                        <td valign="top">
                            <asp:TextBox class="form-control" ID="txtInstitution" runat="server" MaxLength="100"></asp:TextBox>
                            <asp:CheckBox runat="server" ID="ChkInstitutionSaiRam" AutoPostBack="true" OnCheckedChanged="ChkInstitutionSaiRam_OnCheckedChanged" Text="SaiRam Group" />
                            <asp:RequiredFieldValidator SetFocusOnError="True" ID="rftxtInstitution"
                                ControlToValidate="txtInstitution" Text="Please enter institution" runat="server" Display="Dynamic" />
                            <%--      <asp:RegularExpressionValidator ID="regEvInstitution" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                ControlToValidate="txtInstitution" ValidationExpression="^[a-zA-Z\s-]{1,50}$" Display="Dynamic"
                                SetFocusOnError="True"></asp:RegularExpressionValidator>--%>
                            <div class="form-group col-md-14" id="divInstitutionSaiRam" runat="server" visible="false">
                                <asp:DropDownList class="form-control" ID="ddlInstitutionSaiRam" runat="server" Style="width: 85%">
                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Engineering College,West Tambaram,Chennai">Sri Sai Ram Engineering College,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Institute of Technology,West Tambaram,Chennai">Sri Sai Ram Institute of Technology,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Siddha,West Tambaram,Chennai">Sri Sai Ram Siddha,West Tambaram,Chennai </asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai">Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai">Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai </asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Polytechnic College,West Tambaram,Chennai">Sri Sai Ram Polytechnic College,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Advanced Centre for Research,West Tambaram,Chennai">Sai Ram Advanced Centre for Research,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai">Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Matriculation Hr Sec School,Madipakkam,Chennai">Sai Matriculation Hr Sec School,Madipakkam,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Vidyalaya,Madipakkam,Chennai">Sai Ram Vidyalaya,Madipakkam,Chennai</asp:ListItem>
                                    <%--<asp:ListItem Value="Sai Ram College of Education,Ullavaikal,Pondicherry">Sai Ram College of Education,Ullavaikal,Pondicherry</asp:ListItem>--%>
                                    <asp:ListItem Value="Sai Ram Vidyalaya,Ullavaikal,Pondicherry">Sai Ram Vidyalaya,Ullavaikal,Pondicherry</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai">Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai</asp:ListItem>
                                    <asp:ListItem Value="Sai Jothi Polytechnic College,Ellayarpathi,Madurai">Sai Jothi Polytechnic College,Ellayarpathi,Madurai</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Thiruthuripoondi">Sai Ram Matriculation Hr Sec School,Thiruthuripoondi</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram Matriculation School,Thiruvarur">Sai Ram Matriculation School,Thiruvarur</asp:ListItem>
                                    <asp:ListItem Value="Sai Ram I.T.I,Senankottai,Dindigul">Sai Ram I.T.I,Senankottai,Dindigul</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram College of Engineering,Anekal,Bangalore">Sri Sai Ram College of Engineering,Anekal,Bangalore</asp:ListItem>
                                    <asp:ListItem Value="Sri Sai Ram Pre University College,Anekal,Bangalore">Sri Sai Ram Pre University College,Anekal,Bangalore</asp:ListItem>
                                    <asp:ListItem Value="Sairam Trust Office-T.Nagar,Chennai">Sairam Trust Office-T.Nagar,Chennai</asp:ListItem>
                                    <asp:ListItem Value="Shri Padmavathi Medical college & Hospital , Tirupati">Shri Padmavathi Medical college & Hospital , Tirupati</asp:ListItem>
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rfInstitutionSaiRam" runat="server" ErrorMessage="Please select Institution" Display="Dynamic"
                                    ControlToValidate="ddlInstitutionSaiRam" SetFocusOnError="True" InitialValue="0" Enabled="false"></asp:RequiredFieldValidator>
                            </div>

                            <asp:HiddenField ID="hdClassOfStuding" runat="server" />
                            <asp:HiddenField ID="hdBoardOfStudying" runat="server" />
                        </td>
                    </tr>

                    <tr bgcolor="#FFFFFF" runat="server" id="trSchool" visible="false">
                        <td valign="top">
                            <span>Class Studying :</span>
                        </td>
                        <td valign="top">
                            <asp:DropDownList ID="ddlClassStudying" class="form-control" runat="server" AutoPostBack="true">
                                <asp:ListItem Value="0">..Select..</asp:ListItem>
                                <asp:ListItem Value="Pre-KG">Pre-KG</asp:ListItem>
                                <asp:ListItem Value="LKG">LKG</asp:ListItem>
                                <asp:ListItem Value="UKG">UKG</asp:ListItem>
                                <asp:ListItem Value="1st STD">1st STD</asp:ListItem>
                                <asp:ListItem Value="2nd STD">2nd STD</asp:ListItem>
                                <asp:ListItem Value="3rd STD">3rd STD</asp:ListItem>
                                <asp:ListItem Value="4th STD">4th STD</asp:ListItem>
                                <asp:ListItem Value="5th STD">5th STD</asp:ListItem>
                                <asp:ListItem Value="6th STD">6th STD</asp:ListItem>
                                <asp:ListItem Value="7th STD">7th STD</asp:ListItem>
                                <asp:ListItem Value="8th STD">8th STD</asp:ListItem>
                                <asp:ListItem Value="9th STD">9th STD</asp:ListItem>
                                <asp:ListItem Value="10th STD">10th STD</asp:ListItem>
                                <asp:ListItem Value="11th STD">11th STD</asp:ListItem>
                                <asp:ListItem Value="12th STD">12th STD</asp:ListItem>
                                <asp:ListItem Value="PreUniversity">PreUniversity</asp:ListItem>
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="rfvClassStudying" runat="server" ControlToValidate="ddlClassStudying"
                                ErrorMessage="Please select class" InitialValue="0" SetFocusOnError="true" Display="Dynamic" Enabled="false"></asp:RequiredFieldValidator>
                        </td>
                        <td valign="top">
                            <span>Board of Studying :</span>
                        </td>
                        <td valign="top">
                            <asp:DropDownList ID="ddlXIIBoard" runat="server" CssClass="form-control" AutoPostBack="True"
                                OnSelectedIndexChanged="ddlXIIBoard_SelectedIndexChanged">
                                <asp:ListItem Value="0">..Select..</asp:ListItem>
                                <asp:ListItem Value="State Board (TN State)">State Board (TN State)</asp:ListItem>
                                <asp:ListItem Value="Central Board(CBSE)">Central Board(CBSE)</asp:ListItem>
                                <asp:ListItem Value="Matriculation">Matriculation</asp:ListItem>
                                <asp:ListItem Value="Intermediate">Intermediate</asp:ListItem>
                                <asp:ListItem Value="Others">Others</asp:ListItem>
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="rfvXIIBoard" runat="server" ErrorMessage="Select board of study"
                                ControlToValidate="ddlXIIBoard" InitialValue="0" SetFocusOnError="True" Display="Dynamic" Enabled="false"></asp:RequiredFieldValidator>
                            <div id="dvBoardOthers" runat="server" visible="false">
                                <asp:TextBox CssClass="form-control" ID="txtBoardOthers" runat="server" MaxLength="25"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="reqBoardOthers" runat="server" ControlToValidate="txtBoardOthers" Display="Dynamic"
                                    SetFocusOnError="True" ErrorMessage="Pleae select board" Enabled="false"></asp:RequiredFieldValidator>
                            </div>
                        </td>
                    </tr>

                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Address :</span>
                        </td>
                        <td valign="top">
                            <asp:TextBox class="form-control" ID="txtAddressLine1" runat="server" Rows="2" MaxLength="100"></asp:TextBox>
                            <asp:RequiredFieldValidator SetFocusOnError="True" ID="rfvAddrLine1" ControlToValidate="txtAddressLine1" Display="Dynamic"
                                Text="Please enter address line1" runat="server" />
                            <asp:RegularExpressionValidator ID="revAddrLine1" runat="server" SetFocusOnError="True"
                                ErrorMessage="Enter valid address, Special charectors not allowed" ControlToValidate="txtAddressLine1" Display="Dynamic"
                                ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                            </asp:RegularExpressionValidator>
                        </td>
                        <td valign="top">
                            <span>City :</span>
                        </td>
                        <td valign="top">
                            <asp:TextBox class="form-control" ID="txtCity" runat="server" MaxLength="95"></asp:TextBox>
                            <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator13" Display="Dynamic"
                                ControlToValidate="txtCity" Text="Please enter city" runat="server" />
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator15" runat="server"
                                ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtCity" Display="Dynamic"
                                ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Pincode :</span>
                        </td>
                        <td valign="top">
                            <asp:TextBox class="form-control" ID="txtPin" runat="server" MaxLength="6"></asp:TextBox>
                            <asp:RequiredFieldValidator SetFocusOnError="True" ID="rfvPostalCode" ControlToValidate="txtPin" Display="Dynamic"
                                Text="Please enter postal code" runat="server" />
                            <asp:RegularExpressionValidator ID="revPostalCode" SetFocusOnError="True" runat="server" Display="Dynamic"
                                ControlToValidate="txtPin" ErrorMessage="Enter only numbers" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                        </td>
                        <td valign="top">
                            <span>Country :</span>
                        </td>
                        <td valign="top">
                            <asp:DropDownList ID="ddlCountry" class="form-control" runat="server" AutoPostBack="true"
                                OnSelectedIndexChanged="ddlCountry_SelectedIndexChanged" Style="width: 85%">
                                <asp:ListItem Value="0">..Select..</asp:ListItem>
                                <asp:ListItem Value="100">India</asp:ListItem>
                                <asp:ListItem Value="Others">Others</asp:ListItem>
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="rfvCountry" runat="server" ControlToValidate="ddlCountry" Display="Dynamic"
                                ErrorMessage="Please select country" InitialValue="0" SetFocusOnError="true"></asp:RequiredFieldValidator>
                            <div id="divtxtcountry" runat="server">
                                <asp:TextBox CssClass="form-control" ID="txtCountry" runat="server" MaxLength="25"
                                    TabIndex="16"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="rfvCountrtTxt" runat="server" ControlToValidate="txtCountry" Display="Dynamic"
                                    SetFocusOnError="True" ErrorMessage="Please enter country"></asp:RequiredFieldValidator>
                            </div>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>State :</span>
                        </td>
                        <td valign="top">
                            <div id="divddlstate" runat="server">
                                <asp:DropDownList ID="ddlState" runat="server" CssClass="form-control" AutoPostBack="true"
                                    OnSelectedIndexChanged="ddlState_SelectedIndexChanged" Style="width: 85%">
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rfvStatedddl" SetFocusOnError="True" runat="server" Display="Dynamic"
                                    ControlToValidate="ddlState" ErrorMessage="Please select state" InitialValue="0"></asp:RequiredFieldValidator>
                            </div>
                            <div id="divtxtstate" runat="server">
                                <asp:TextBox CssClass="form-control" ID="txtState" runat="server" MaxLength="25"
                                    TabIndex="18"></asp:TextBox>&nbsp;
                            <asp:RequiredFieldValidator ID="rfvStatetxt" SetFocusOnError="True" runat="server" Display="Dynamic"
                                ControlToValidate="txtState" ErrorMessage="Please enter state" CssClass="Warning"></asp:RequiredFieldValidator>
                            </div>
                        </td>
                        <td valign="top">
                            <span>District :</span>
                        </td>
                        <td valign="top">
                            <div id="divddlDistrict" runat="server">
                                <asp:DropDownList ID="ddlDistrict" runat="server" CssClass="form-control" Style="width: 85%">
                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                    <asp:ListItem Value="Ariyalur">Ariyalur</asp:ListItem>
                                    <asp:ListItem Value="Chennai">Chennai</asp:ListItem>
                                    <asp:ListItem Value="Coimbatore">Coimbatore</asp:ListItem>
                                    <asp:ListItem Value="Cuddalore">Cuddalore</asp:ListItem>
                                    <asp:ListItem Value="Dharmapuri">Dharmapuri</asp:ListItem>
                                    <asp:ListItem Value="Dindigul">Dindigul</asp:ListItem>
                                    <asp:ListItem Value="Erode">Erode</asp:ListItem>
                                    <asp:ListItem Value="Kanchipuram">Kanchipuram</asp:ListItem>
                                    <asp:ListItem Value="Kanniyakumari">Kanniyakumari</asp:ListItem>
                                    <asp:ListItem Value="Karur">Karur</asp:ListItem>
                                    <asp:ListItem Value="Krishnagiri">Krishnagiri</asp:ListItem>
                                    <asp:ListItem Value="Madurai">Madurai</asp:ListItem>
                                    <asp:ListItem Value="Nagapattinam">Nagapattinam</asp:ListItem>
                                    <asp:ListItem Value="Namakkal">Namakkal</asp:ListItem>
                                    <asp:ListItem Value="Nilgiris">Nilgiris</asp:ListItem>
                                    <asp:ListItem Value="Perambalur">Perambalur</asp:ListItem>
                                    <asp:ListItem Value="Pudukkottai">Pudukkottai</asp:ListItem>
                                    <asp:ListItem Value="Ramanathapuram">Ramanathapuram</asp:ListItem>
                                    <asp:ListItem Value="Salem">Salem</asp:ListItem>
                                    <asp:ListItem Value="Sivaganga">Sivaganga</asp:ListItem>
                                    <asp:ListItem Value="Thanjavur">Thanjavur</asp:ListItem>
                                    <asp:ListItem Value="Theni">Theni</asp:ListItem>
                                    <asp:ListItem Value="Thiruvallur">Thiruvallur</asp:ListItem>
                                    <asp:ListItem Value="Thiruvarur">Thiruvarur</asp:ListItem>
                                    <asp:ListItem Value="Thoothukudi">Thoothukudi</asp:ListItem>
                                    <asp:ListItem Value="Tiruchirappalli">Tiruchirappalli</asp:ListItem>
                                    <asp:ListItem Value="Tirunelveli">Tirunelveli</asp:ListItem>
                                    <asp:ListItem Value="Tiruppur">Tiruppur</asp:ListItem>
                                    <asp:ListItem Value="Tiruvannamalai">Tiruvannamalai</asp:ListItem>
                                    <asp:ListItem Value="Vellore">Vellore</asp:ListItem>
                                    <asp:ListItem Value="Villupuram">Villupuram</asp:ListItem>
                                    <asp:ListItem Value="Virudhunagar">Virudhunagar</asp:ListItem>
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rfvddlDistrict" SetFocusOnError="True" runat="server" Display="Dynamic"
                                    ControlToValidate="ddlDistrict" ErrorMessage="Select district" InitialValue="0"></asp:RequiredFieldValidator>
                            </div>
                            <div id="divtxtDistrict" runat="server">
                                <asp:TextBox CssClass="form-control" ID="txtDistrict" runat="server" MaxLength="25"></asp:TextBox>&nbsp;
                            <asp:RequiredFieldValidator ID="rfvtxtDistrict" SetFocusOnError="True" runat="server" Display="Dynamic"
                                ControlToValidate="txtDistrict" ErrorMessage="Please enter district"></asp:RequiredFieldValidator>
                            </div>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Date Of Birth :</span>
                        </td>
                        <td valign="top">
                            <asp:TextBox class="form-control" ID="txtDOB" runat="server" MaxLength="15" placeholder="DD/MM/YYYY"></asp:TextBox>
                            <asp:CalendarExtender ID="txtDate1_CalendarExtender" runat="server" Format="dd/MM/yyyy"
                                TodaysDateFormat="dd/MM/yyyy" Enabled="True" TargetControlID="txtDOB" OnClientDateSelectionChanged="checkDate">
                            </asp:CalendarExtender>
                            <asp:RegularExpressionValidator ID="regtxtBirthDate1" runat="server" ErrorMessage="Enter valid date dd/MM/YYYY"
                                SetFocusOnError="True" Style="position: relative" ValidationExpression="(((0[1-9]|[12][0-9]|3[01])([/])(0[13578]|10|12)([/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([/])(0[469]|11)([/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([/])(02)([/])(\d{4}))|((29)(\.|-|\/)(02)([/])([02468][048]00))|((29)([/])(02)([/])([13579][26]00))|((29)([/])(02)([/])([0-9][0-9][0][48]))|((29)([/])(02)([/])([0-9][0-9][2468][048]))|((29)([/])(02)([/])([0-9][0-9][13579][26])))"
                                ControlToValidate="txtDOB" Display="Dynamic"></asp:RegularExpressionValidator>
                            <asp:RequiredFieldValidator ID="rfvDOB" ControlToValidate="txtDOB" targetcontrolid="txtDOB"
                                Text="Please enter DOB" runat="server" SetFocusOnError="True" Display="Dynamic" />
                        </td>
                        <td valign="top">
                            <span>Gender :</span>
                        </td>
                        <td>
                            <asp:RadioButtonList ID="radGender" runat="server">
                                <asp:ListItem Value="Male">Male</asp:ListItem>
                                <asp:ListItem Value="Female">Female</asp:ListItem>
                            </asp:RadioButtonList>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="Please Select Gender" Display="Dynamic"
                                ControlToValidate="radGender" SetFocusOnError="True"></asp:RequiredFieldValidator>
                            <%-- <asp:DropDownList class="form-control" ID="ddlGender" runat="server" Style="width: 85%">
                            <asp:ListItem Value="0">..Select..</asp:ListItem>
                            <asp:ListItem Value="Male">Male</asp:ListItem>
                            <asp:ListItem Value="Female">Female</asp:ListItem>
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator10" runat="server" ErrorMessage="Please select gender"
                            ControlToValidate="ddlGender" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>--%>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Mobile Number (+91)</span>
                        </td>
                        <td>
                            <asp:TextBox class="form-control" ID="txtMobile" runat="server" MaxLength="10"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator14" ControlToValidate="txtMobile" Display="Dynamic"
                                targetcontrolid="txtMobile" Text="Please enter mobile no" runat="server" SetFocusOnError="True" />
                            <asp:RegularExpressionValidator ID="revMobile" runat="server" ControlToValidate="txtMobile" Display="Dynamic"
                                ErrorMessage="Enter only numbers" SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                        </td>
                        <td valign="top">
                            <span>Email Id :</span>
                        </td>
                        <td valign="top">
                            <asp:TextBox class="form-control" ID="txtEmailID" runat="server" MaxLength="95"></asp:TextBox>
                            <asp:RegularExpressionValidator ID="revEmail" runat="server" ErrorMessage="Enter valid email id"
                                Style="position: relative" ValidationExpression="^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,3}))$"
                                ControlToValidate="txtEmailID" SetFocusOnError="True" Display="Dynamic"></asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">
                            <span>Community :</span>
                        </td>
                        <td valign="top">
                            <asp:DropDownList ID="ddlCoomunity" runat="server" CssClass="form-control" Style="width: 85%">
                                <asp:ListItem Value="0">..Select..</asp:ListItem>
                                <asp:ListItem Value="OC">OC</asp:ListItem>
                                <asp:ListItem Value="BC">BC</asp:ListItem>
                                <asp:ListItem Value="BCM">BCM</asp:ListItem>
                                <asp:ListItem Value="MBC">MBC</asp:ListItem>
                                <asp:ListItem Value="SC">SC</asp:ListItem>
                                <asp:ListItem Value="SCA">SCA</asp:ListItem>
                                <asp:ListItem Value="ST">ST</asp:ListItem>
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator15" runat="server" ErrorMessage="Please select community" Display="Dynamic"
                                ControlToValidate="ddlCoomunity" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                        </td>
                        <td valign="top">
                            <span>Caste :</span>
                        </td>
                        <td>
                            <asp:TextBox class="form-control" ID="txtCaste" runat="server" MaxLength="95"></asp:TextBox>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator18" runat="server"
                                ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtCaste" Display="Dynamic"
                                ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                            </asp:RegularExpressionValidator>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td colspan="4" align="center">
                            <asp:Button ID="btnUpdate" runat="server" Text="Update" CausesValidation="true" OnClick="btnUpdate_Click"
                                Style="height: 26px" />
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td align="center" colspan="4">
                            <asp:Label ID="lblUpdateError" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
                        </td>
                    </tr>
                </table>
            </div>
            <div id="dvDocumenmtsUpload" runat="server" class="Content" visible="false">
                <table width="100%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                    <tr bgcolor="#FFFFFF">
                        <td valign="top">Documents Uploaded :
                        </td>
                        <td align="left" valign="top" colspan="3">
                            <table width="100%" cellpadding="4" cellspacing="1" border="0">

                                <tr id="trBC" runat="server" visible="false">
                                    <td width="35%">Birth Certificate
                                    </td>
                                    <td width="35%">
                                        <asp:RadioButtonList ID="rdoBC" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvBC" runat="server" ErrorMessage="* required" ControlToValidate="rdoBC">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td width="30%">
                                        <a target="_blank" id="aBC" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkTC" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>

                                <tr id="trAID" runat="server" visible="false">
                                    <td>AADHAAR ID
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoAID" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvAID" runat="server" ErrorMessage="* required"
                                            ControlToValidate="rdoAID">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aAID" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkDOT" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>

                                <tr id="trStuID" runat="server" visible="false">
                                    <td>Student IDCard
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoStuID" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvStuID" runat="server" ErrorMessage="* required"
                                            ControlToValidate="rdoStuID">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aStuID" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnk10th" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>
                                <tr id="trRC" runat="server" visible="false">
                                    <td>Ration Card
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoRC" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvRC" runat="server" ErrorMessage="* required" ControlToValidate="rdoRC">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aRC" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnk12" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>
                                <tr id="trVD" runat="server" visible="false">
                                    <td>Voter ID
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoVD" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvVD" runat="server" ErrorMessage="* required" ControlToValidate="rdoVD">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aVD" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnk12" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>
                                <tr id="trDD" runat="server" visible="false">
                                    <td>Driving License
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoDD" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvDD" runat="server" ErrorMessage="* required" ControlToValidate="rdoDD">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aDD" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkCommunity" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>
                                <tr id="trBPB" runat="server" visible="false">
                                    <td>Bank Pass Book
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoBPB" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvBPB" runat="server" ErrorMessage="* required"
                                            ControlToValidate="rdoBPB">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aBPB" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkDOT" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>

                                <tr id="trPC" runat="server" visible="false">
                                    <td>Pan Card
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoPC" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvPC" runat="server" ErrorMessage="* required" ControlToValidate="rdoPC">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aPC" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkDOT" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>

                                <tr id="trBS" runat="server" visible="false">
                                    <td>Bonafide (Student)
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoBS" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvBS" runat="server" ErrorMessage="* required" ControlToValidate="rdoBS">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aBS" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkDOT" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>

                                <tr id="trBP" runat="server" visible="false">
                                    <td>Bonafide (Parent)
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoBP" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvBP" runat="server" ErrorMessage="* required" ControlToValidate="rdoBP">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aBP" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkDOT" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>
                                <tr id="trAP" runat="server" visible="false">
                                    <td>Academic Performance
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoAP" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvAP" runat="server" ErrorMessage="* required" ControlToValidate="rdoAP">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aAP" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkDOT" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>

                                <tr id="trL" runat="server" visible="false">
                                    <td>Letter
                                    </td>
                                    <td>
                                        <asp:RadioButtonList ID="rdoL" runat="server" RepeatDirection="Horizontal">
                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="rfvL" runat="server" ErrorMessage="* required" ControlToValidate="rdoL">
                                        </asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        <a target="_blank" id="aL" runat="server">View Certificate</a>
                                        <%--<asp:LinkButton ID="lnkDOT" runat="server">View Certificate</asp:LinkButton>--%>
                                    </td>
                                </tr>

                                <tr id="trAdditional" runat="server" visible="true">
                                    <td colspan="3">
                                        <fieldset>
                                            <legend>Additional Certificates</legend>
                                            <table width="100%">
                                                <tr id="trSp1" runat="server" visible="false">
                                                    <td width="25%">
                                                        <asp:Label ID="lblC1" runat="server" Text=""></asp:Label>
                                                    </td>
                                                    <td width="45%">
                                                        <asp:RadioButtonList ID="rdoC1" runat="server" RepeatDirection="Horizontal">
                                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                                        </asp:RadioButtonList>
                                                        <asp:RequiredFieldValidator ID="rfvC1" runat="server" ErrorMessage="* required" ControlToValidate="rdoC1">
                                                        </asp:RequiredFieldValidator>
                                                    </td>
                                                    <td width="30%">
                                                        <a target="_blank" id="aC1" runat="server">View Certificate</a>
                                                        <%--<asp:LinkButton ID="lnkC1" runat="server">View Certificate</asp:LinkButton>--%>
                                                    </td>
                                                </tr>
                                                <tr id="trSp2" runat="server" visible="false">
                                                    <td>
                                                        <asp:Label ID="lblC2" runat="server" Text=""></asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:RadioButtonList ID="rdoC2" runat="server" RepeatDirection="Horizontal">
                                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                                        </asp:RadioButtonList>
                                                        <asp:RequiredFieldValidator ID="rfvC2" runat="server" ErrorMessage="* required" ControlToValidate="rdoC2">
                                                        </asp:RequiredFieldValidator>
                                                    </td>
                                                    <td>
                                                        <a target="_blank" id="aC2" runat="server">View Certificate</a>
                                                        <%--<asp:LinkButton ID="lnkC2" runat="server">View Certificate</asp:LinkButton>--%>
                                                    </td>
                                                </tr>
                                                <tr id="trSp3" runat="server" visible="false">
                                                    <td>
                                                        <asp:Label ID="lblC3" runat="server" Text=""></asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:RadioButtonList ID="rdoC3" runat="server" RepeatDirection="Horizontal">
                                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                                        </asp:RadioButtonList>
                                                        <asp:RequiredFieldValidator ID="rfvC3" runat="server" ErrorMessage="* required" ControlToValidate="rdoC3">
                                                        </asp:RequiredFieldValidator>
                                                    </td>
                                                    <td>
                                                        <a target="_blank" id="aC3" runat="server">View Certificate</a>
                                                        <%--<asp:LinkButton ID="lnkC3" runat="server">View Certificate</asp:LinkButton>--%>
                                                    </td>
                                                </tr>
                                                <tr id="trSp4" runat="server" visible="false">
                                                    <td>
                                                        <asp:Label ID="lblC4" runat="server" Text=""></asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:RadioButtonList ID="rdoC4" runat="server" RepeatDirection="Horizontal">
                                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                                        </asp:RadioButtonList>
                                                        <asp:RequiredFieldValidator ID="rfvC4" runat="server" ErrorMessage="* required" ControlToValidate="rdoC4">
                                                        </asp:RequiredFieldValidator>
                                                    </td>
                                                    <td>
                                                        <a target="_blank" id="aC4" runat="server">View Certificate</a>
                                                        <%--<asp:LinkButton ID="lnkC4" runat="server">View Certificate</asp:LinkButton>--%>
                                                    </td>
                                                </tr>
                                                <tr id="trSp5" runat="server" visible="false">
                                                    <td>
                                                        <asp:Label ID="lblC5" runat="server" Text=""></asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:RadioButtonList ID="rdoC5" runat="server" RepeatDirection="Horizontal">
                                                            <asp:ListItem Value="0">Valid</asp:ListItem>
                                                            <asp:ListItem Value="1">Invalid</asp:ListItem>
                                                        </asp:RadioButtonList>
                                                        <asp:RequiredFieldValidator ID="rfvC5" runat="server" ErrorMessage="* required" ControlToValidate="rdoC5">
                                                        </asp:RequiredFieldValidator>
                                                    </td>
                                                    <td>
                                                        <a target="_blank" id="aC5" runat="server">View Certificate</a>
                                                        <%--<asp:LinkButton ID="lnkC5" runat="server">View Certificate</asp:LinkButton>--%>
                                                    </td>
                                                </tr>
                                            </table>
                                        </fieldset>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td valign="top" valign="top"></td>
                        <td align="center" colspan="3">
                            <asp:Button ID="btnVerify" runat="server" Text="Verify" CausesValidation="true" OnClick="btnVerify_Click"
                                Style="height: 26px" />&nbsp;&nbsp;
                        </td>
                    </tr>
                    <tr bgcolor="#FFFFFF">
                        <td align="center" colspan="4">
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
