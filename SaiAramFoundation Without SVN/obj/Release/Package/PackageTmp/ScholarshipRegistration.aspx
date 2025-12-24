<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/RegisterMaster.Master"
    CodeBehind="ScholarshipRegistration.aspx.cs" MaintainScrollPositionOnPostback="true"
    Inherits="SaiAramFoundation.ScholarshipRegistration" EnableViewStateMac="false"
    EnableSessionState="True" EnableEventValidation="false" ValidateRequest="false"
    ViewStateEncryptionMode="Never" %>

<%@ Register TagPrefix="Anders" Assembly="Anders.Web.Controls" Namespace="Anders.Web.Controls" %>
<%@ Register Assembly="System.Web.Entity, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
    Namespace="System.Web.UI.WebControls" TagPrefix="asp" %>
<%@ Register TagPrefix="telerik" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cntPnlHead" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cntPlacBody" runat="server">

    <script src="JS/jquery-1.7.1.min.js" type="text/javascript"></script>

    <script type="text/javascript">


        function myPrePostValidationFunction() {

            var adhar = $("#<%=txtAadhaarID.ClientID %>").val();
            var pan = $("#<%=txtPanID.ClientID %>").val();
            if (adhar.length == 0 && pan.length == 0) {
                $('#idValidation').text('Please enter Aadhaar Id  or PAN ID');
                $('#idValidation').show();
                return false;
            }
            else {
                //var Cadhar = $("#<%=txtConfirmAadhaarID.ClientID %>").val();
                //var Cpan = $("#<%=txtConfirmPanID.ClientID %>").val();
                $('#idValidation').hide();
                return true;
            }                
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

        function ISAlphaNumeric(e) {

            var keyCode = e.which ? e.which : e.keyCode
            var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1 || (keyCode >= 97 && keyCode <= 122) || (keyCode >= 65 && keyCode <= 90) || keyCode == 127 || keyCode == 9);
            //document.getElementById("error").style.display = ret ? "none" : "inline";
            return ret;

                //var regex = new RegExp("^[a-zA-Z0-9]+$");
                //var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                //if (regex.test(str)) {
                //    return true;
                //}
                //e.preventDefault();
                //return false;           
        }



        function validateLength(oSrc, args) {
            args.IsValid = (args.Value.length >= 12);
        }

        function validatePANLength(oSrc, args) {
            args.IsValid = (args.Value.length >= 10);
        }
        var specialKeys = new Array();
        specialKeys.push(8); //Backspace
        function IsNumeric(e) {
            var keyCode = e.which ? e.which : e.keyCode
            var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1 || keyCode == 127 || keyCode == 9);
            //document.getElementById("error").style.display = ret ? "none" : "inline";
            return ret;
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

        $(document).ready(function () {
            $('.Checkupload').change(function () {
                var f = this.files[0];
                if (f.size > 3145728) {
                    $('#' + this.id).attr("value", "");
                    alert('Please upload File size less then 3 MB');
                }
            });
        });

    </script>

    <form id="form1" runat="server" enctype="multipart/form-data" class="registration">
        <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </asp:ToolkitScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server" ChildrenAsTriggers="true" UpdateMode="Conditional">
            <ContentTemplate>
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="head1">ONLINE REGISTRATION FOR SCHOLARSHIP ASSISTANCE - ACADEMIC YEAR
                            <asp:Label ID="lblAcYear" runat="server"></asp:Label></h1>
                    </div>
                </div>
                <h1></h1>
                <div class="row">
                    <div class="col-md-12">
                        <div class="row row-1 appcategory">
                            <div class="col-md-12">
                                <div class="row">
                                    <label class="col-sm-3 control-label" for="inputEmail3">
                                        What describes you better<font color="#FF0000">*</font></label>
                                    <%--<asp:RadioButtonList ID="radRegisteredFor" runat="server" AutoPostBack="true" OnSelectedIndexChanged="radRegisteredFor_SelectedIndexChanged"
                                            CssClass="col-sm-4" TabIndex="1">
                                            <asp:ListItem Value="School">School</asp:ListItem>
                                            <asp:ListItem Value="College">College</asp:ListItem>
                                            <asp:ListItem Value="Research">Research</asp:ListItem>
                                        </asp:RadioButtonList>                                      
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server"  ErrorMessage="Select your Application Category"
                                            ControlToValidate="radRegisteredFor"  SetFocusOnError="True" ></asp:RequiredFieldValidator>--%>
                                    <div class="col-md-4">
                                        <asp:DropDownList ID="ddlAppllcantCat" runat="server" AutoPostBack="true" CssClass="form-control top-select"
                                            TabIndex="1" OnSelectedIndexChanged="ddlAppllcantCat_SelectedIndexChanged">
                                            <asp:ListItem Value="0">..Select..</asp:ListItem>
                                            <asp:ListItem Value="School">I am a SCHOOL Student seeking Scholarship</asp:ListItem>
                                            <asp:ListItem Value="College">I am a COLLEGE Student seeking Scholarship</asp:ListItem>
                                            <asp:ListItem Value="Research">I am a RESEARCH Scholar</asp:ListItem>
                                        </asp:DropDownList>
                                    </div>
                                    <div class="col-md-4">
                                        <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator1" ControlToValidate="ddlAppllcantCat"
                                            Text="Select your application category" runat="server" InitialValue="0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row row-1" style="margin-left: 25px;">
                            <div class="form-group col-md-4">
                                <label for="exampleInputEmail1">
                                    AADHAAR ID (Candidate)<font color="#FF0000"></font></label>
                                <asp:TextBox class="form-control" ID="txtAadhaarID" runat="server" TabIndex="2"
                                    onkeypress="return IsNumeric(event);" ondrop="return false;" onpaste="return false;"></asp:TextBox>
                               <%-- <asp:RequiredFieldValidator ID="RequiredFieldValidator16" ControlToValidate="txtAadhaarID"
                                    targetcontrolid="txtAadhaarID" Text="Please enter AadhaarID number" runat="server"
                                    SetFocusOnError="True" />--%>
                                <asp:CustomValidator ID="CustomValidator2" runat="server" ControlToValidate="txtAadhaarID"
                                    ErrorMessage="You must enter 12 digits number!" ClientValidationFunction="validateLength"></asp:CustomValidator>
                            </div>
                            <div class="form-group col-md-4">
                                <label for="exampleInputEmail1">
                                    Confirm AADHAAR ID (Candidate)<font color="#FF0000"></font></label>
                                <asp:TextBox class="form-control" ID="txtConfirmAadhaarID" runat="server" TabIndex="3"
                                    MaxLength="12" OnTextChanged="txtConfirmAadhaarID_TextChanged" AutoPostBack="true"
                                    onkeypress="return IsNumeric(event);" ondrop="return false;" onpaste="return false;"></asp:TextBox>
                                <%--<asp:RequiredFieldValidator ID="RequiredFieldValidator17" ControlToValidate="txtConfirmAadhaarID"
                                    targetcontrolid="txtConfirmAadhaarID" Text="Please enter Confirm AadhaarID number"
                                    runat="server" SetFocusOnError="True" />--%>
                                <asp:CustomValidator ID="CustomValidator1" runat="server" ControlToValidate="txtConfirmAadhaarID"
                                    ErrorMessage="You must enter 12 digits number!" ClientValidationFunction="validateLength"></asp:CustomValidator>
                                <asp:CompareValidator runat="server" ID="cmpNumbers" ControlToValidate="txtAadhaarID"
                                    ControlToCompare="txtConfirmAadhaarID" Operator="Equal" ErrorMessage=" Confirm AadhaarID must be same in AadhaarID" />
                            </div>
                        </div>



                        <div class="row row-1" style="margin-left: 25px;">
                            <div class="form-group col-md-4">
                                <label for="exampleInputEmail1">
                                    PAN ID (Candidate)<font color="#FF0000"></font></label>
                                <asp:TextBox class="form-control" ID="txtPanID" runat="server" TabIndex="4" MaxLength="10"
                                    onkeypress="return ISAlphaNumeric(event);" ondrop="return false;" onpaste="return false;"></asp:TextBox>
                              <%--  <asp:RequiredFieldValidator ID="RequiredFieldValidator4" ControlToValidate="txtPanID"
                                    targetcontrolid="txtPanID" Text="Please enter Pan number" runat="server"
                                    SetFocusOnError="True" /> --%>
                                   <asp:CustomValidator ID="CustomValidator3" runat="server" ControlToValidate="txtPanID"
                                    ErrorMessage="You must enter 10 digits!" ClientValidationFunction="validatePANLength"></asp:CustomValidator>                          
                            </div>
                            <div class="form-group col-md-4">
                                <label for="exampleInputEmail1">
                                    Confirm PAN ID (Candidate)<font color="#FF0000"></font></label>
                                <asp:TextBox class="form-control" ID="txtConfirmPanID" runat="server" TabIndex="5"
                                    MaxLength="12" OnTextChanged="txtConfirmPanID_TextChanged" AutoPostBack="true"
                                    onkeypress="return ISAlphaNumeric(event);" ondrop="return false;" onpaste="return false;"></asp:TextBox>
                               <%-- <asp:RequiredFieldValidator ID="RequiredFieldValidator21" ControlToValidate="txtConfirmPanID"
                                    targetcontrolid="txtConfirmPanID" Text="Please enter Confirm PanID number"
                                    runat="server" SetFocusOnError="True" />--%>
                                 <asp:CustomValidator ID="CustomValidator4" runat="server" ControlToValidate="txtConfirmPanID"
                                    ErrorMessage="You must enter 10 digits!" ClientValidationFunction="validatePANLength"></asp:CustomValidator>
                                <asp:CompareValidator runat="server" ID="CompareValidator1" ControlToValidate="txtPanID"
                                    ControlToCompare="txtConfirmPanID" Operator="Equal" ErrorMessage=" Confirm PanID must be same in PanID" />
                            </div>
                        </div>

                         <div class="row row-1" style="margin-left: 25px;">
                            <div class="form-group col-md-4">

                                <span id="idValidation" style="color:red; display:none;"></span>
                                </div> 
                             </div>



                        <div id="dvAadharCheck" runat="server">
                            <div class="group-box">
                                <h6 class="cat">Family details</h6>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="inputEmail3">
                                            Student ID(if known)</label>
                                        <asp:TextBox class="form-control" ID="txtStudentID" runat="server" MaxLength="25"
                                            TabIndex="5"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator20" runat="server"
                                            SetFocusOnError="True" ErrorMessage="Special charectors not allowed" ControlToValidate="txtStudentID"
                                            ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                        </asp:RegularExpressionValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Name of Applicant<font color="#FF0000">*</font></label>
                                        <asp:TextBox class="form-control" ID="txtName" runat="server" MaxLength="95" TabIndex="6"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="rfvtxtName" runat="server" ErrorMessage="Please enter name"
                                            ControlToValidate="txtName" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                        <asp:RegularExpressionValidator ID="revLastName" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                            ControlToValidate="txtName" ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                                        </asp:RegularExpressionValidator>
                                    </div>

                                </div>
                                <div class="row row-1">
                                    <asp:UpdatePanel ID="UpdatePanel3" runat="server">
                                        <ContentTemplate>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Father's Name<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtFatherName" runat="server" MaxLength="95"
                                                    TabIndex="7"></asp:TextBox>
                                                <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ErrorMessage="Please enter father's name"
                                                    ControlToValidate="txtFatherName" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator9" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                                    ControlToValidate="txtFatherName" ValidationExpression="^[a-zA-Z\s-.]{1,50}$"
                                                    SetFocusOnError="True">
                                                </asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Father's Occupation<font color="#FF0000">*</font></label>
                                                <asp:DropDownList class="form-control" ID="ddlFatherOccupathion" runat="server" TabIndex="8"
                                                    OnSelectedIndexChanged="ddlFatherOccupathion_SelectedIndexChanged" AutoPostBack="true">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="Agriculture Service">Agriculture Service</asp:ListItem>
                                                    <asp:ListItem Value="Business">Business</asp:ListItem>
                                                    <asp:ListItem Value="Defence Service">Defence Service</asp:ListItem>
                                                    <asp:ListItem Value="Engineering Service">Engineering Service</asp:ListItem>
                                                    <asp:ListItem Value="Public / Govt. Service">Public / Govt. Service</asp:ListItem>
                                                    <asp:ListItem Value="Law Practice">Law practice</asp:ListItem>
                                                    <asp:ListItem Value="Medical Service">Medical Service</asp:ListItem>
                                                    <asp:ListItem Value="Private Service">Private Service</asp:ListItem>
                                                    <asp:ListItem Value="Self Employed">Self Employed</asp:ListItem>
                                                    <asp:ListItem Value="Teaching Research">Teaching Research</asp:ListItem>
                                                    <asp:ListItem Value="Working for daily wages">Working for daily Wages</asp:ListItem>
                                                    <asp:ListItem Value="Unemployed">Unemployed</asp:ListItem>
                                                    <asp:ListItem Value="Retired">Retired</asp:ListItem>
                                                    <asp:ListItem Value="Divorced">Divorced</asp:ListItem>
                                                    <asp:ListItem Value="Late">Late</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator SetFocusOnError="True" ID="rfvOccupation" ControlToValidate="ddlFatherOccupathion"
                                                    Text="Please enter occupation" runat="server" InitialValue="0" />
                                                <div class="form-group col-md-14" id="dvOtherFatherOccupation" runat="server" visible="false">
                                                    <asp:TextBox class="form-control" ID="txtOtherFatherOccupation" runat="server" MaxLength="95"
                                                        TabIndex="9"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rfvOtherFatherOccupation" runat="server" ErrorMessage="Please enter other occupation"
                                                        ControlToValidate="txtOtherFatherOccupation" SetFocusOnError="True" Enabled="false"></asp:RequiredFieldValidator>
                                                </div>
                                            </div>

                                        </ContentTemplate>
                                    </asp:UpdatePanel>
                                </div>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Father Designation</label>
                                        <asp:TextBox class="form-control" ID="txtFatherDesignation" runat="server" MaxLength="100"
                                            TabIndex="10"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator19" runat="server"
                                            ErrorMessage="Special characters not allowed" ControlToValidate="txtFatherDesignation"
                                            ValidationExpression="^[a-zA-Z0-9\s-.]{1,50}$" SetFocusOnError="True">
                                        </asp:RegularExpressionValidator>

                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Father Organization Name</label>
                                        <asp:TextBox class="form-control" ID="txtFatherOrganiz" runat="server" TabIndex="11"
                                            MaxLength="100"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator13" runat="server"
                                            ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtFatherOrganiz"
                                            ValidationExpression="^[a-zA-Z0-9\s-.]{1,50}$" SetFocusOnError="True">
                                        </asp:RegularExpressionValidator>
                                    </div>

                                </div>
                                <div class="row row-1">
                                    <asp:UpdatePanel ID="UpdatePanel4" runat="server">
                                        <ContentTemplate>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Mother's Name<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtMotherName" runat="server" MaxLength="95"
                                                    TabIndex="12"></asp:TextBox>
                                                <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" ErrorMessage="Please enter mother's name"
                                                    ControlToValidate="txtMotherName" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator10" runat="server"
                                                    ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtMotherName"
                                                    ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                                                </asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Mother's Occupation<font color="#FF0000">*</font></label>
                                                <asp:DropDownList class="form-control" ID="ddlMotherOccupathion" runat="server" TabIndex="13"
                                                    OnSelectedIndexChanged="ddlMotherOccupathion_SelectedIndexChanged" AutoPostBack="true">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="Agriculture Service">Agriculture Service</asp:ListItem>
                                                    <asp:ListItem Value="Business">Business</asp:ListItem>
                                                    <asp:ListItem Value="Defence Service">Defence Service</asp:ListItem>
                                                    <asp:ListItem Value="Engineering Service">Engineering Service</asp:ListItem>
                                                    <asp:ListItem Value="Public / Govt. Service">Public / Govt. Service</asp:ListItem>
                                                    <asp:ListItem Value="Law Practice">Law practice</asp:ListItem>
                                                    <asp:ListItem Value="Medical Service">Medical Service</asp:ListItem>
                                                    <asp:ListItem Value="Private Service">Private Service</asp:ListItem>
                                                    <asp:ListItem Value="Self Employed">Self Employed</asp:ListItem>
                                                    <asp:ListItem Value="Teaching Research">Teaching Research</asp:ListItem>
                                                    <asp:ListItem Value="Working for daily wages">Working for daily Wages</asp:ListItem>
                                                    <asp:ListItem Value="Unemployed">Unemployed</asp:ListItem>
                                                    <asp:ListItem Value="House wife">House Wife</asp:ListItem>
                                                    <asp:ListItem Value="Retired">Retired</asp:ListItem>
                                                    <asp:ListItem Value="Divorced">Divorced</asp:ListItem>
                                                    <asp:ListItem Value="Late">Late</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator12"
                                                    ControlToValidate="ddlMotherOccupathion" Text="Please enter occupation" runat="server"
                                                    InitialValue="0" />
                                                <div class="form-group col-md-14" id="dvOtherMotherOccupathion" runat="server" visible="false">
                                                    <asp:TextBox class="form-control" ID="txtOtherMotherOccupation" runat="server" MaxLength="95"
                                                        TabIndex="14"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rvfOtherMotherOccupation" runat="server" ErrorMessage="Please enter other occupation"
                                                        ControlToValidate="txtOtherFatherOccupation" SetFocusOnError="True" Enabled="false"></asp:RequiredFieldValidator>
                                                </div>
                                            </div>

                                        </ContentTemplate>
                                    </asp:UpdatePanel>
                                </div>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Mother Designation</label>
                                        <asp:TextBox class="form-control" ID="txtMotherDesignation" runat="server" MaxLength="100"
                                            TabIndex="15"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator22" runat="server"
                                            ErrorMessage="Special characters not allowed" ControlToValidate="txtMotherDesignation"
                                            ValidationExpression="^[a-zA-Z0-9\s-.]{1,50}$" SetFocusOnError="True">
                                        </asp:RegularExpressionValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Mother Organization Name</label>
                                        <asp:TextBox class="form-control" ID="txtMotherOrganiz" runat="server" MaxLength="100"
                                            TabIndex="16"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator14" runat="server"
                                            ErrorMessage="Special characters not allowed" ControlToValidate="txtMotherOrganiz"
                                            ValidationExpression="^[a-zA-Z0-9\s-.]{1,50}$" SetFocusOnError="True">
                                        </asp:RegularExpressionValidator>
                                    </div>

                                </div>
                                <div class="row row-1">
                                    <asp:UpdatePanel ID="UpdatePanel5" runat="server">
                                        <ContentTemplate>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Guardian Name</label>
                                                <asp:TextBox class="form-control" ID="txtParentName" runat="server" MaxLength="95"
                                                    TabIndex="17"></asp:TextBox>
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator8" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                                    ControlToValidate="txtParentName" ValidationExpression="^[a-zA-Z\s-.]{1,50}$"
                                                    SetFocusOnError="True">
                                                </asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Guardian Occupation</label>
                                                <asp:DropDownList class="form-control" ID="ddlGuardianOccupation" runat="server" TabIndex="18"
                                                    OnSelectedIndexChanged="ddlGuardianOccupation_SelectedIndexChanged" AutoPostBack="true">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="Agriculture Service">Agriculture Service</asp:ListItem>
                                                    <asp:ListItem Value="Business">Business</asp:ListItem>
                                                    <asp:ListItem Value="Defence Service">Defence Service</asp:ListItem>
                                                    <asp:ListItem Value="Engineering Service">Engineering Service</asp:ListItem>
                                                    <asp:ListItem Value="Public / Govt. Service">Public / Govt. Service</asp:ListItem>
                                                    <asp:ListItem Value="Law Practice">Law practice</asp:ListItem>
                                                    <asp:ListItem Value="Medical Service">Medical Service</asp:ListItem>
                                                    <asp:ListItem Value="Private Service">Private Service</asp:ListItem>
                                                    <asp:ListItem Value="Self Employed">Self Employed</asp:ListItem>
                                                    <asp:ListItem Value="Teaching Research">Teaching Research</asp:ListItem>
                                                    <asp:ListItem Value="Working for daily wages">Working for daily Wages</asp:ListItem>
                                                    <asp:ListItem Value="Unemployed">Unemployed</asp:ListItem>
                                                    <asp:ListItem Value="House wife">House Wife</asp:ListItem>
                                                    <asp:ListItem Value="Retired">Retired</asp:ListItem>
                                                    <asp:ListItem Value="Divorced">Divorced</asp:ListItem>
                                                    <asp:ListItem Value="Late">Late</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <div class="form-group col-md-14" id="dvOtherGuardianOccupation" runat="server" visible="false">
                                                    <asp:TextBox class="form-control" ID="txtOtherGuardianOccupation" runat="server" MaxLength="95"
                                                        TabIndex="19"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rvOtherGuardianOccupation" runat="server" ErrorMessage="Please enter other occupation"
                                                        ControlToValidate="txtOtherGuardianOccupation" SetFocusOnError="True" Enabled="false"></asp:RequiredFieldValidator>
                                                </div>
                                            </div>

                                        </ContentTemplate>
                                    </asp:UpdatePanel>
                                </div>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Guardian Designation</label>
                                        <asp:TextBox class="form-control" ID="txtGuardianDesignation" runat="server" MaxLength="100"
                                            TabIndex="20"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator24" runat="server"
                                            ErrorMessage="Special characters not allowed" ControlToValidate="txtGuardianDesignation"
                                            ValidationExpression="^[a-zA-Z0-9\s-.]{1,50}$" SetFocusOnError="True">
                                        </asp:RegularExpressionValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Guardian Organization Name</label>
                                        <asp:TextBox class="form-control" ID="txtGuardianOrganiz" runat="server" MaxLength="100"
                                            TabIndex="21"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator21" runat="server"
                                            ErrorMessage="Special characters not allowed" ControlToValidate="txtMotherOrganiz"
                                            ValidationExpression="^[a-zA-Z0-9\s-.]{1,50}$" SetFocusOnError="True">
                                        </asp:RegularExpressionValidator>
                                    </div>

                                </div>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Father Annual Income<font color="#FF0000">*</font></label>
                                        <asp:DropDownList ID="ddlFatherAnnualIncome" runat="server" CssClass="form-control"
                                            TabIndex="22">
                                            <asp:ListItem Value="0">..Select..</asp:ListItem>
                                            <asp:ListItem Value="00">0</asp:ListItem>
                                            <asp:ListItem Value="1-10000">1-10000</asp:ListItem>
                                            <asp:ListItem Value="10001-20000">10001-20000</asp:ListItem>
                                            <asp:ListItem Value="20001-30000">20001-30000</asp:ListItem>
                                            <asp:ListItem Value="30001-40000">30001-40000</asp:ListItem>
                                            <asp:ListItem Value="40001-50000">40001-50000</asp:ListItem>
                                            <asp:ListItem Value="50001-60000">50001-60000</asp:ListItem>
                                            <asp:ListItem Value="60001-70000">60001-70000</asp:ListItem>
                                            <asp:ListItem Value="70001-80000">70001-80000</asp:ListItem>
                                            <asp:ListItem Value="80001-90000">80001-90000</asp:ListItem>
                                            <asp:ListItem Value="90001-100000">90001-100000</asp:ListItem>
                                            <asp:ListItem Value="100001-300000">100001-300000</asp:ListItem>
                                            <asp:ListItem Value="300001-1000000">300001-1000000</asp:ListItem>
                                        </asp:DropDownList>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator20" runat="server" ErrorMessage="Please select annual income"
                                            ControlToValidate="ddlFatherAnnualIncome" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Mother Annual Income<font color="#FF0000">*</font></label>
                                        <asp:DropDownList ID="ddlMotherAnnualIncome" runat="server" CssClass="form-control"
                                            TabIndex="23">
                                            <asp:ListItem Value="0">..Select..</asp:ListItem>
                                            <asp:ListItem Value="00">0</asp:ListItem>
                                            <asp:ListItem Value="1-10000">1-10000</asp:ListItem>
                                            <asp:ListItem Value="10001-20000">10001-20000</asp:ListItem>
                                            <asp:ListItem Value="20001-30000">20001-30000</asp:ListItem>
                                            <asp:ListItem Value="30001-40000">30001-40000</asp:ListItem>
                                            <asp:ListItem Value="40001-50000">40001-50000</asp:ListItem>
                                            <asp:ListItem Value="50001-60000">50001-60000</asp:ListItem>
                                            <asp:ListItem Value="60001-70000">60001-70000</asp:ListItem>
                                            <asp:ListItem Value="70001-80000">70001-80000</asp:ListItem>
                                            <asp:ListItem Value="80001-90000">80001-90000</asp:ListItem>
                                            <asp:ListItem Value="90001-100000">90001-100000</asp:ListItem>
                                            <asp:ListItem Value="100001-300000">100001-300000</asp:ListItem>
                                            <asp:ListItem Value="300001-1000000">300001-1000000</asp:ListItem>
                                        </asp:DropDownList>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="Please select annual income"
                                            ControlToValidate="ddlMotherAnnualIncome" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Guardian Annual Income</label>
                                        <asp:DropDownList ID="ddlGuardianAnnulIncome" runat="server" CssClass="form-control"
                                            TabIndex="24">
                                            <asp:ListItem Value="0">..Select..</asp:ListItem>
                                            <asp:ListItem Value="00">0</asp:ListItem>
                                            <asp:ListItem Value="1-10000">1-10000</asp:ListItem>
                                            <asp:ListItem Value="10001-20000">10001-20000</asp:ListItem>
                                            <asp:ListItem Value="20001-30000">20001-30000</asp:ListItem>
                                            <asp:ListItem Value="30001-40000">30001-40000</asp:ListItem>
                                            <asp:ListItem Value="40001-50000">40001-50000</asp:ListItem>
                                            <asp:ListItem Value="50001-60000">50001-60000</asp:ListItem>
                                            <asp:ListItem Value="60001-70000">60001-70000</asp:ListItem>
                                            <asp:ListItem Value="70001-80000">70001-80000</asp:ListItem>
                                            <asp:ListItem Value="80001-90000">80001-90000</asp:ListItem>
                                            <asp:ListItem Value="90001-100000">90001-100000</asp:ListItem>
                                            <asp:ListItem Value="100001-300000">100001-300000</asp:ListItem>
                                            <asp:ListItem Value="300001-1000000">300001-1000000</asp:ListItem>
                                        </asp:DropDownList>

                                    </div>
                                </div>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Address Line 1<font color="#FF0000">*</font></label>
                                        <asp:TextBox class="form-control" ID="txtAddressLine1" runat="server" Rows="2" MaxLength="100"
                                            TabIndex="25"></asp:TextBox>
                                        <asp:RequiredFieldValidator SetFocusOnError="True" ID="rfvAddrLine1" ControlToValidate="txtAddressLine1"
                                            Text="Please enter address line1" runat="server" />
                                        <asp:RegularExpressionValidator ID="revAddrLine1" runat="server" SetFocusOnError="True"
                                            ErrorMessage="Enter valid address, Special charectors not allowed" ControlToValidate="txtAddressLine1"
                                            ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                        </asp:RegularExpressionValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Address Line 2</label>
                                        <asp:TextBox class="form-control" ID="txtAddressLine2" runat="server" MaxLength="100"
                                            TabIndex="26"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator23" runat="server"
                                            SetFocusOnError="True" ErrorMessage="Enter valid address, Special charectors not allowed"
                                            ControlToValidate="txtAddressLine2" ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                        </asp:RegularExpressionValidator>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="row">
                                            <div class="form-group col-md-8">
                                                <label for="exampleInputEmail1">
                                                    City<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtCity" runat="server" TabIndex="27" MaxLength="95"></asp:TextBox>
                                                <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator13"
                                                    ControlToValidate="txtCity" Text="Please enter city" runat="server" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator15" runat="server"
                                                    ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtCity"
                                                    ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                                                </asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Pin<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtPin" runat="server" TabIndex="28" MaxLength="6"
                                                    onkeypress="return IsNumeric(event);" ondrop="return false;" onpaste="return false;"></asp:TextBox>
                                                <asp:RequiredFieldValidator SetFocusOnError="True" ID="rfvPostalCode" ControlToValidate="txtPin"
                                                    Text="Please enter postal code" runat="server" />
                                                <%-- <asp:RegularExpressionValidator ID="revPostalCode" SetFocusOnError="True" runat="server"
                                                ControlToValidate="txtPin" ErrorMessage="Enter only numbers" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>--%>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row row-1">
                                    <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                                        <ContentTemplate>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Country<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlCountry" class="form-control" runat="server" AutoPostBack="true"
                                                    TabIndex="29" OnSelectedIndexChanged="ddlCountry_SelectedIndexChanged">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="100">India</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ID="rfvCountry" runat="server" ControlToValidate="ddlCountry"
                                                    ErrorMessage="Please select country" InitialValue="0" SetFocusOnError="true"></asp:RequiredFieldValidator>
                                                <div id="divtxtcountry" runat="server">
                                                    <asp:TextBox CssClass="form-control" ID="txtCountry" runat="server" MaxLength="25"
                                                        TabIndex="30"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="rfvCountrtTxt" runat="server" ControlToValidate="txtCountry"
                                                        SetFocusOnError="True" ErrorMessage="Please enter country"></asp:RequiredFieldValidator>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-4" style="margin-top: 5px">
                                                <div id="DivStatelbl" runat="server">
                                                    State<font color="#FF0000">*</font>
                                                </div>
                                                <div id="divddlstate" runat="server">
                                                    <asp:DropDownList class="form-control" ID="ddlState" runat="server" CssClass="form-control"
                                                        TabIndex="31" AutoPostBack="true" OnSelectedIndexChanged="ddlState_SelectedIndexChanged">
                                                    </asp:DropDownList>
                                                    <asp:RequiredFieldValidator ID="rfvStatedddl" SetFocusOnError="True" runat="server"
                                                        ControlToValidate="ddlState" ErrorMessage="Please select state" InitialValue="0"></asp:RequiredFieldValidator>
                                                </div>
                                                <div id="divtxtstate" runat="server">
                                                    <asp:TextBox CssClass="form-control" ID="txtState" runat="server" MaxLength="25"
                                                        TabIndex="32"></asp:TextBox>&nbsp;
                                                <asp:RequiredFieldValidator ID="rfvStatetxt" SetFocusOnError="True" runat="server"
                                                    ControlToValidate="txtState" ErrorMessage="Please enter state" CssClass="Warning"></asp:RequiredFieldValidator>
                                                </div>
                                            </div>
                                            <div id="trDistrict" runat="server" class="form-group col-md-4" style="margin-top: 5px">
                                                <div id="DivDistrictlbl" runat="server">
                                                    District<font color="#FF0000">*</font>
                                                </div>
                                                <div id="divddlDistrict" runat="server">
                                                    <asp:DropDownList ID="ddlDistrict" runat="server" CssClass="form-control" TabIndex="33">
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
                                                    <asp:RequiredFieldValidator ID="rfvddlDistrict" SetFocusOnError="True" runat="server"
                                                        ControlToValidate="ddlDistrict" ErrorMessage="Select district" InitialValue="0"></asp:RequiredFieldValidator>
                                                </div>
                                                <div id="divtxtDistrict" runat="server">
                                                    <asp:TextBox CssClass="form-control" ID="txtDistrict" runat="server" MaxLength="25"
                                                        TabIndex="34"></asp:TextBox>&nbsp;
                                                <asp:RequiredFieldValidator ID="rfvtxtDistrict" SetFocusOnError="True" runat="server"
                                                    ControlToValidate="txtDistrict" ErrorMessage="Please enter district"></asp:RequiredFieldValidator>
                                                </div>
                                            </div>
                                        </ContentTemplate>
                                    </asp:UpdatePanel>
                                </div>
                            </div>
                            <div class="group-box">
                                <h6 class="cat">Personal Details</h6>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Gender<font color="#FF0000">*</font></label>
                                        <%-- <asp:DropDownList class="form-control" ID="ddlGender" runat="server" TabIndex="27">
                                        <asp:ListItem Value="0">..Select..</asp:ListItem>
                                        <asp:ListItem Value="Male">Male</asp:ListItem>
                                        <asp:ListItem Value="Female">Female</asp:ListItem>
                                    </asp:DropDownList>
                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator10" runat="server" ErrorMessage="Please select gender"
                                        ControlToValidate="ddlGender" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>--%>
                                        <asp:RadioButtonList ID="radGender" runat="server" TabIndex="35">
                                            <asp:ListItem Value="Male">Male</asp:ListItem>
                                            <asp:ListItem Value="Female">Female</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator10" runat="server" ErrorMessage="Please Select Gender"
                                            ControlToValidate="radGender" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Date of Birth<font color="#FF0000">*</font></label>
                                        <asp:TextBox class="form-control" ID="txtDOB" runat="server" MaxLength="15" TabIndex="36"
                                            placeholder="DD/MM/YYYY"></asp:TextBox>
                                        <asp:CalendarExtender ID="txtDate1_CalendarExtender" runat="server" Format="dd/MM/yyyy"
                                            TodaysDateFormat="dd/MM/yyyy" Enabled="True" TargetControlID="txtDOB" OnClientDateSelectionChanged="checkDate">
                                        </asp:CalendarExtender>
                                        <asp:RegularExpressionValidator ID="regtxtBirthDate1" runat="server" ErrorMessage="Enter valid date dd/MM/YYYY"
                                            SetFocusOnError="True" Style="position: relative" ValidationExpression="(((0[1-9]|[12][0-9]|3[01])([/])(0[13578]|10|12)([/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([/])(0[469]|11)([/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([/])(02)([/])(\d{4}))|((29)(\.|-|\/)(02)([/])([02468][048]00))|((29)([/])(02)([/])([13579][26]00))|((29)([/])(02)([/])([0-9][0-9][0][48]))|((29)([/])(02)([/])([0-9][0-9][2468][048]))|((29)([/])(02)([/])([0-9][0-9][13579][26])))"
                                            ControlToValidate="txtDOB"></asp:RegularExpressionValidator>
                                        <asp:RequiredFieldValidator ID="rfvDOB" ControlToValidate="txtDOB" targetcontrolid="txtDOB"
                                            Text="Please enter DOB" runat="server" SetFocusOnError="True" />
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Email ID</label>
                                        <asp:TextBox class="form-control" ID="txtEmailID" runat="server" MaxLength="95" TabIndex="37"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="revEmail" runat="server" ErrorMessage="Enter valid email id"
                                            Style="position: relative" ValidationExpression="^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,3}))$"
                                            ControlToValidate="txtEmailID" SetFocusOnError="True"></asp:RegularExpressionValidator>
                                    </div>
                                </div>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Community<font color="#FF0000">*</font></label>
                                        <asp:DropDownList ID="ddlCoomunity" runat="server" CssClass="form-control" TabIndex="38">
                                            <asp:ListItem Value="0">..Select..</asp:ListItem>
                                            <asp:ListItem Value="OC">OC</asp:ListItem>
                                            <asp:ListItem Value="BC">BC</asp:ListItem>
                                            <asp:ListItem Value="BCM">BCM</asp:ListItem>
                                            <asp:ListItem Value="MBC">MBC</asp:ListItem>
                                            <asp:ListItem Value="SC">SC</asp:ListItem>
                                            <asp:ListItem Value="SCA">SCA</asp:ListItem>
                                            <asp:ListItem Value="ST">ST</asp:ListItem>
                                        </asp:DropDownList>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator15" runat="server" ErrorMessage="Please select community"
                                            ControlToValidate="ddlCoomunity" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Caste</label>
                                        <asp:TextBox class="form-control" ID="txtCaste" runat="server" MaxLength="95" TabIndex="39"></asp:TextBox>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator18" runat="server"
                                            ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtCaste"
                                            ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                                        </asp:RegularExpressionValidator>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Mobile Number (+91)<font color="#FF0000">*</font></label>
                                        <asp:TextBox class="form-control" ID="txtMobile" runat="server" MaxLength="10" TabIndex="40"
                                            onkeypress="return IsNumeric(event);" ondrop="return false;" onpaste="return false;"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator14" ControlToValidate="txtMobile"
                                            targetcontrolid="txtMobile" Text="Please enter mobile no" runat="server" SetFocusOnError="True" />
                                        <%--<span id="error2" style="color: Red; display: none">Enter only Numbers</span>--%>
                                        <%-- <asp:RegularExpressionValidator ID="revMobile" runat="server" ControlToValidate="txtMobile"
                                        ErrorMessage="Enter only numbers" SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>--%>
                                    </div>
                                </div>
                                <div class="row row-1">
                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Photo Upload</label>
                                        <asp:FileUpload ID="fuPhotoUpload" runat="server" TabIndex="41" />
                                        <asp:RegularExpressionValidator ID="rePhotoUpload" runat="server" ControlToValidate="fuPhotoUpload"
                                            ErrorMessage="Enter only .jpg or .png file format" SetFocusOnError="True" ValidationExpression="(.*\.jpe?g|.*\.png|)">
                                        </asp:RegularExpressionValidator>
                                    </div>

                                    <div class="form-group col-md-4">
                                        <label for="exampleInputEmail1">
                                            Applied for any other scholarship<font color="#FF0000">*</font></label>
                                        <asp:RadioButtonList ID="rdoAppliedOtherScholarship" runat="server" TabIndex="42">
                                            <asp:ListItem Value="Yes">Yes</asp:ListItem>
                                            <asp:ListItem Value="No">No</asp:ListItem>
                                        </asp:RadioButtonList>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="Please Select Applied Other Scholarship"
                                            ControlToValidate="rdoAppliedOtherScholarship" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                    </div>

                                </div>
                            </div>
                            <div class="group-box" id="spnEducation" runat="server">
                                <h6 class="cat">Education details</h6>
                                <asp:UpdatePanel runat="server">
                                    <ContentTemplate>
                                        <div class="row row-1">
                                            <div id="Div1" class="form-group col-md-4" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Type of Institution<font color="#FF0000">*</font></label>
                                                <asp:RadioButtonList ID="radTypeofInstitution" runat="server" TabIndex="43">
                                                    <asp:ListItem Value="Government">Govt</asp:ListItem>
                                                    <asp:ListItem Value="Government Aided">Govt aided</asp:ListItem>
                                                    <asp:ListItem Value="Private">Private</asp:ListItem>
                                                </asp:RadioButtonList>
                                                <asp:RequiredFieldValidator ID="reqInstitution" runat="server" ErrorMessage="Please select institution Type"
                                                    ControlToValidate="radTypeofInstitution" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Name of Institution(Now studying)<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtInstitution" runat="server" MaxLength="100"
                                                    TabIndex="44"></asp:TextBox>
                                                <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator18"
                                                    ControlToValidate="txtInstitution" Text="Please enter institution" runat="server" />
                                                <asp:RegularExpressionValidator ID="regEvInstitution" runat="server" ErrorMessage="Numeric,Special characters not allowed and must be no longer than 100 characters"
                                                    ControlToValidate="txtInstitution" ValidationExpression="^[a-zA-Z\s-.]{1,100}$"
                                                    SetFocusOnError="True"></asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4" id="dvUniversity" runat="server">
                                                <label for="exampleInputEmail1">
                                                    University<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtUniversity" runat="server" MaxLength="100"
                                                    TabIndex="45"></asp:TextBox>
                                                <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator19"
                                                    ControlToValidate="txtUniversity" Text="Please enter university" runat="server" />
                                                <asp:RegularExpressionValidator ID="regEvUniversity" runat="server" ErrorMessage="Numeric,Special characters not allowed and must be no longer than 100 characters"
                                                    ControlToValidate="txtUniversity" ValidationExpression="^[a-zA-Z\s-.]{1,100}$"
                                                    SetFocusOnError="True"></asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4" id="dvClassStudying" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Class Studying<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlClassStudying" class="form-control" runat="server" AutoPostBack="true"
                                                    TabIndex="46">
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
                                                    ErrorMessage="Please select class" InitialValue="0" SetFocusOnError="true"></asp:RequiredFieldValidator>
                                            </div>
                                        </div>
                                        <div class="row row-1">
                                            <div class="form-group col-md-4" id="dvBoard" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Board of Studying<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlXIIBoard" runat="server" CssClass="form-control" AutoPostBack="True"
                                                    TabIndex="47" OnSelectedIndexChanged="ddlXIIBoard_SelectedIndexChanged">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="State Board (TN State)">State Board (TN State)</asp:ListItem>
                                                    <asp:ListItem Value="Central Board(CBSC)">Central Board(CBSC)</asp:ListItem>
                                                    <asp:ListItem Value="Matriculation">Matriculation</asp:ListItem>
                                                    <asp:ListItem Value="Intermediate">Intermediate</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ID="rfvXIIBoard" runat="server" ErrorMessage="Select board of study"
                                                    ControlToValidate="ddlXIIBoard" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                <div id="dvBoardOthers" runat="server">
                                                    <asp:TextBox CssClass="form-control" ID="txtBoardOthers" runat="server" MaxLength="25"
                                                        TabIndex="48"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ID="reqBoardOthers" runat="server" ControlToValidate="txtBoardOthers"
                                                        SetFocusOnError="True" ErrorMessage="Pleae select board"></asp:RequiredFieldValidator>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-4" id="dvCourseOfStudying" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Course of Studying<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlCourseofStudying" runat="server" AutoPostBack="True" TabIndex="49"
                                                    OnSelectedIndexChanged="ddlCourseofStudying_SelectedIndexChanged" CssClass="form-control">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="Arts and Science">Arts and Science</asp:ListItem>
                                                    <asp:ListItem Value="Engineering">Engineering</asp:ListItem>
                                                    <asp:ListItem Value="Management">Management</asp:ListItem>
                                                    <asp:ListItem Value="Medical">Medical</asp:ListItem>
                                                    <asp:ListItem Value="Legal">Legal</asp:ListItem>
                                                    <asp:ListItem Value="Diploma">Diploma</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                    <asp:ListItem Value="PreUniversity">PreUniversity</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ID="rfvCourseofStudying" runat="server" ErrorMessage="Please select course"
                                                    ControlToValidate="ddlCourseofStudying" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                            <div class="form-group col-md-4" id="dvUgPgtype" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Degree type<font color="#FF0000">*</font></label>
                                                <asp:RadioButtonList ID="radUgPGType" runat="server" AutoPostBack="true" TabIndex="50"
                                                    OnSelectedIndexChanged="radUgPGType_SelectedIndexChanged">
                                                    <asp:ListItem Selected="True" Value="UG">UG</asp:ListItem>
                                                    <asp:ListItem Value="PG">PG</asp:ListItem>
                                                </asp:RadioButtonList>
                                                <asp:RequiredFieldValidator ID="reqUgPGType" runat="server" ErrorMessage="Select degree type"
                                                    ControlToValidate="radUgPGType" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                            <div class="form-group col-md-4" id="dvDegree" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Degree<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlDegree" runat="server" AutoPostBack="true" CssClass="form-control"
                                                    TabIndex="51" OnSelectedIndexChanged="ddlDegree_SelectedIndexChanged">
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ID="rfvDegree" runat="server" ErrorMessage="Please select degree"
                                                    ControlToValidate="ddlDegree" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                        </div>
                                        <div class="row row-1">
                                            <div class="form-group col-md-4" id="dvOtherDegree" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Other Degree<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtOtherDegree" runat="server" MaxLength="95"
                                                    TabIndex="52"></asp:TextBox>
                                                <asp:RequiredFieldValidator ID="reqOtherdegree" runat="server" ErrorMessage="Please other degree"
                                                    ControlToValidate="txtOtherDegree" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                            <div class="form-group col-md-4" id="dvCurrentYear" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Current Year<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlCurrentYear" runat="server" TabIndex="53" AutoPostBack="True"
                                                    CssClass="form-control">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="1st Year">1st Year</asp:ListItem>
                                                    <asp:ListItem Value="2nd Year">2nd Year</asp:ListItem>
                                                    <asp:ListItem Value="3rd Year">3rd Year</asp:ListItem>
                                                    <asp:ListItem Value="4th Year">4th Year</asp:ListItem>
                                                    <asp:ListItem Value="5th Year">5th Year</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ID="reqCurrentYear" runat="server" ErrorMessage="Select current semester"
                                                    ControlToValidate="ddlCurrentSem" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                            <div class="form-group col-md-4" id="dvCurrentSemester" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Current Semester<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlCurrentSem" runat="server" TabIndex="54" AutoPostBack="True"
                                                    CssClass="form-control">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="Non-Semester">Non-Semester</asp:ListItem>
                                                    <asp:ListItem Value="1st Sem">1st Sem</asp:ListItem>
                                                    <asp:ListItem Value="2nd Sem">2nd Sem</asp:ListItem>
                                                    <asp:ListItem Value="3rd Sem">3rd Sem</asp:ListItem>
                                                    <asp:ListItem Value="4th Sem">4th Sem</asp:ListItem>
                                                    <asp:ListItem Value="5th Sem">5th Sem</asp:ListItem>
                                                    <asp:ListItem Value="6th Sem">6th Sem</asp:ListItem>
                                                    <asp:ListItem Value="7th Sem">7th Sem</asp:ListItem>
                                                    <asp:ListItem Value="8th Sem">8th Sem</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ID="reqCurrentSem" runat="server" ErrorMessage="Select current semester"
                                                    ControlToValidate="ddlCurrentSem" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                        </div>
                                        <div class="row row-1">
                                            <div class="form-group col-md-4" id="dvPhdCources" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Ph.D<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlPhd" runat="server" TabIndex="55" AutoPostBack="True" CssClass="form-control">
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="Pursuing">Pursuing</asp:ListItem>
                                                    <asp:ListItem Value="Synopsis/Thesis Submitted">Synopsis/Thesis Submitted</asp:ListItem>
                                                    <asp:ListItem Value="Completed">Completed</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ID="reqPhdCources" runat="server" ErrorMessage="Please select Ph.D"
                                                    ControlToValidate="ddlPhd" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                            <div class="form-group col-md-4" id="dvSpecialization" runat="server">
                                                <label for="exampleInputEmail1">
                                                    Specialization<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtSpecializhation" runat="server" MaxLength="95"
                                                    TabIndex="56"></asp:TextBox>
                                                <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator11"
                                                    ControlToValidate="txtSpecializhation" Text="Please enter specialization" runat="server" />
                                                <asp:RegularExpressionValidator ID="reqSpecialization" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                                    ControlToValidate="txtSpecializhation" ValidationExpression="^[a-zA-Z\s-.]{1,50}$"
                                                    SetFocusOnError="True">
                                                </asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                    </ContentTemplate>
                                </asp:UpdatePanel>
                            </div>
                            <div class="group-box">
                                <h6 class="cat">Bank details of Applicant(Student)</h6>
                                <div class="row row-1">
                                    <div class="col-md-12">
                                        <div class="row">
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Account Number<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtAccountNo" runat="server" MaxLength="25"
                                                    TabIndex="57"></asp:TextBox>
                                                <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator8" ControlToValidate="txtAccountNo"
                                                    Text="Please enter account no" runat="server" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator12" runat="server"
                                                    SetFocusOnError="True" ErrorMessage="Special charectors not allowed" ControlToValidate="txtAccountNo"
                                                    ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                                </asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Bank Name<font color="#FF0000">*</font></label>
                                                <asp:DropDownList ID="ddlBankName" runat="server" TabIndex="58" CssClass="form-control">
                                                    <asp:ListItem Value="0">Select Bank</asp:ListItem>
                                                    <asp:ListItem Value="Allahabad Bank">Allahabad Bank</asp:ListItem>
                                                    <asp:ListItem Value="Andhra Bank">Andhra Bank</asp:ListItem>
                                                    <asp:ListItem Value="Axis Bank">Axis Bank</asp:ListItem>
                                                    <asp:ListItem Value="Bank of Baroda">Bank of Baroda</asp:ListItem>
                                                    <asp:ListItem Value="Bank of India">Bank of India</asp:ListItem>
                                                    <asp:ListItem Value="Bank of Maharashtra">Bank of Maharashtra</asp:ListItem>
                                                    <asp:ListItem Value="Canara Bank">Canara Bank</asp:ListItem>
                                                    <asp:ListItem Value="Catholic Syrian Bank Ltd">Catholic Syrian Bank Ltd</asp:ListItem>
                                                    <asp:ListItem Value="Central Bank of India">Central Bank of India</asp:ListItem>
                                                    <asp:ListItem Value="City Union Bank">City Union Bank</asp:ListItem>
                                                    <asp:ListItem Value="Corporation Bank">Corporation Bank</asp:ListItem>
                                                    <asp:ListItem Value="Co-operative Bank">Co-operative Bank</asp:ListItem>
                                                    <asp:ListItem Value="Dena Bank">Dena Bank</asp:ListItem>
                                                    <asp:ListItem Value="ICICI Bank">ICICI Bank</asp:ListItem>
                                                    <asp:ListItem Value="IDBI Bank Limited">IDBI Bank Limited</asp:ListItem>
                                                    <asp:ListItem Value="IDBI Bank">IDBI Bank</asp:ListItem>
                                                    <asp:ListItem Value="Indian Bank">Indian Bank</asp:ListItem>
                                                    <asp:ListItem Value="Indian Overseas Bank">Indian Overseas Bank</asp:ListItem>
                                                    <asp:ListItem Value="IndusInd Bank Limited">IndusInd Bank Limited</asp:ListItem>
                                                    <asp:ListItem Value="Industrial Development Bank of India">Industrial Development Bank of India</asp:ListItem>
                                                    <asp:ListItem Value="ING Vysya Bank">ING Vysya Bank</asp:ListItem>
                                                    <asp:ListItem Value="Karnataka Bank">Karnataka Bank</asp:ListItem>
                                                    <asp:ListItem Value="Karur Vysya Bank Limited">Karur Vysya Bank Limited</asp:ListItem>
                                                    <asp:ListItem Value="Kotak Mahindra Bank Limited">Kotak Mahindra Bank Limited</asp:ListItem>
                                                    <asp:ListItem Value="Oriental Bank of Commerce">Oriental Bank of Commerce</asp:ListItem>
                                                    <asp:ListItem Value="Punjab & Sind Bank">Punjab & Sind Bank</asp:ListItem>
                                                    <asp:ListItem Value="Punjab National Bank">Punjab National Bank</asp:ListItem>
                                                       <asp:ListItem Value="South Indian Bank Ltd">South Indian Bank Ltd</asp:ListItem>
                                                    <asp:ListItem Value="State Bank of Bikaner and Jaipur">State Bank of Bikaner and Jaipur</asp:ListItem>
                                                    <asp:ListItem Value="State Bank of Hyderabad">State Bank of Hyderabad</asp:ListItem>
                                                    <asp:ListItem Value="State Bank of India">State Bank of India</asp:ListItem>
                                                    <asp:ListItem Value="State Bank of Mysore">State Bank of Mysore</asp:ListItem>
                                                    <asp:ListItem Value="State Bank of Patiala">State Bank of Patiala</asp:ListItem>
                                                    <asp:ListItem Value="State Bank of Travancore">State Bank of Travancore</asp:ListItem>
                                                    <asp:ListItem Value="Syndicate Bank">Syndicate Bank</asp:ListItem>
                                                    <asp:ListItem Value="Tamilnad Mercantile Bank Ltd">Tamilnad Mercantile Bank Ltd</asp:ListItem>
                                                    <asp:ListItem Value="The Dhanalakshmi Bank Limited">The Dhanalakshmi Bank Limited</asp:ListItem>
                                                    <asp:ListItem Value="The Federal Bank Ltd">The Federal Bank Ltd</asp:ListItem>
                                                    <asp:ListItem Value="The HDFC Bank Ltd">The HDFC Bank Ltd</asp:ListItem>
                                                    <asp:ListItem Value="The Jammu & Kashmir Bank Ltd">The Jammu & Kashmir Bank Ltd</asp:ListItem>
                                                    <asp:ListItem Value="The Lakshmi Vilas Bank Ltd">The Lakshmi Vilas Bank Ltd</asp:ListItem>
                                                    <asp:ListItem Value="The Nainital Bank Ltd">The Nainital Bank Ltd</asp:ListItem>
                                                    <asp:ListItem Value="UCO Bank">UCO Bank</asp:ListItem>
                                                    <asp:ListItem Value="Union Bank of India">Union Bank of India</asp:ListItem>
                                                    <asp:ListItem Value="United Bank Of India">United Bank Of India</asp:ListItem>
                                                    <asp:ListItem Value="Vijaya Bank">Vijaya Bank</asp:ListItem>
                                                    <asp:ListItem Value="Yes Bank">Yes Bank</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" ErrorMessage="Please select bank"
                                                    ControlToValidate="ddlBankName" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">
                                                    Branch<font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtBranch" runat="server" TabIndex="59" MaxLength="95"></asp:TextBox>
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator17" runat="server"
                                                    SetFocusOnError="True" ErrorMessage="Special charectors not allowed" ControlToValidate="txtBranch"
                                                    ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                                </asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1" style="display: block">
                                                    IFSC Code <a href="http://bankifsccode.com" target="_blank" class="link-ifsc">(Lookup
                                                    IFSC Code)</a>
                                                </label>
                                                <asp:TextBox class="form-control" ID="txtIFSCCode" runat="server" TabIndex="60" MaxLength="28"></asp:TextBox>
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator16" runat="server"
                                                    SetFocusOnError="True" ErrorMessage="Special charectors not allowed" ControlToValidate="txtIFSCCode"
                                                    ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                                </asp:RegularExpressionValidator>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1" style="display: block">
                                                    Request Amount <font color="#FF0000">*</font></label>
                                                <asp:TextBox class="form-control" ID="txtRequestAmount" runat="server" TabIndex="61"
                                                    onkeyup="javascript:keyUP(this.value);" MaxLength="9" onkeypress="return IsNumeric(event);"
                                                    ondrop="return false;" onpaste="return false;"></asp:TextBox>
                                                <asp:RequiredFieldValidator ID="RequiredFieldValidator9" runat="server" ErrorMessage="Please enter request amount"
                                                    ControlToValidate="txtRequestAmount" targetcontrolid="txtRequestAmount" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                <asp:Label ID="lbltextAmount" runat="server" Text=""></asp:Label>
                                                <%-- <asp:RegularExpressionValidator ID="reGChequeNo" runat="server" ControlToValidate="txtRequestAmount"
                                                ErrorMessage="Enter only Numbers" SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>--%>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="group-box">
                                <h6 class="cat">Documents to be enclosed ( Any 3 documents are mandatory )</h6>
                                <div class="fileUpload">
                                    <div class="row row-1">
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Birth Certificate (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuBirthCertificate" runat="server" TabIndex="62" EnableTheming="True" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" ControlToValidate="fuBirthCertificate"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Student ID Card (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuStudentIDCard" runat="server" TabIndex="63" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator2" runat="server" ControlToValidate="fuStudentIDCard"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row row-1">
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Ration Card (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuRationCard" runat="server" TabIndex="64" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator3" runat="server" ControlToValidate="fuRationCard"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Voter ID (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuVoter" runat="server" TabIndex="65" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator4" runat="server" ControlToValidate="fuVoter"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row row-1">
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Driving License (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuDrivingLicense" runat="server" TabIndex="66" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator5" runat="server" ControlToValidate="fuDrivingLicense"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Bank Pass Book (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuBankPassBook" runat="server" TabIndex="67" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator6" runat="server" ControlToValidate="fuBankPassBook"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row row-1">
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                AADHAAR ID (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuAadharID" runat="server" TabIndex="68" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator7" runat="server" ControlToValidate="fuAadharID"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                PAN Card (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuPanCard" runat="server" TabIndex="69" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator11" runat="server"
                                                    ControlToValidate="fuPanCard" ErrorMessage="Enter only .jpg or .pdf or .png file format"
                                                    ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row row-1">
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Bonafide (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuBonafideStudent" runat="server" TabIndex="70" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator25" runat="server" ControlToValidate="fuBonafideStudent"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Bonafide (Parent)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuBonafideParent" runat="server" TabIndex="71" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator26" runat="server"
                                                    ControlToValidate="fuBonafideParent" ErrorMessage="Enter only .jpg or .pdf or .png file format"
                                                    ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row row-1">
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Academic Performance (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuAcademicPerformance" runat="server" TabIndex="72" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator27" runat="server" ControlToValidate="fuAcademicPerformance"
                                                    ErrorMessage="Enter only .jpg or .pdf or .png file format" ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6 documentsborder">
                                            <label class="documentslbl" for="exampleInputEmail1">
                                                Letter (Student)</label>
                                            <div class="browse">
                                                <asp:FileUpload ID="fuLetter" runat="server" TabIndex="73" CssClass="Checkupload" />
                                                <asp:RegularExpressionValidator ID="RegularExpressionValidator28" runat="server"
                                                    ControlToValidate="fuLetter" ErrorMessage="Enter only .jpg or .pdf or .png file format"
                                                    ValidationExpression="(.*\.jpe?g|.*\.png|.*\.pdf|.*\.JPE?G|.*\.PNG|.*\.PDF)"></asp:RegularExpressionValidator>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row row-1">
                                    <div class="col-md-12">
                                        <asp:Label ID="lblError" runat="server" Text=""></asp:Label>
                                    </div>
                                </div>
                                <div class="row row-1">
                                    <div id="dvform" runat="server" align="center">
                                        <asp:Label ID="lblValidation" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
                                    </div>
                                </div>
                                <div class="row row-1">
                                    <div class="col-md-3 col-md-offset-5">
                                        <asp:Button ID="btnSave" runat="server" Text="Submit" CssClass="btn btn-default" OnClientClick="return myPrePostValidationFunction()"
                                            TabIndex="74" OnClick="btnSave_Click" />
                                        <asp:Button ID="btnReset" runat="server" Text="Reset" CssClass="btn btn-default"
                                            TabIndex="75" OnClick="btnReset_Click" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <asp:ValidationSummary ID="ValidationSummary1" runat="server" ValidationGroup="check"
                    ShowMessageBox="true" />
            </ContentTemplate>
            <Triggers>
                <asp:PostBackTrigger ControlID="btnSave" />
            </Triggers>
        </asp:UpdatePanel>
    </form>
</asp:Content>
