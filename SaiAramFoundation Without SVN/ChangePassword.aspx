<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true"
    CodeBehind="ChangePassword.aspx.cs" Inherits="SaiAramFoundation.ChangePassword" %>

<%@ Register TagPrefix="Anders" Assembly="Anders.Web.Controls" Namespace="Anders.Web.Controls" %>
<%@ Register Assembly="System.Web.Entity, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
    Namespace="System.Web.UI.WebControls" TagPrefix="asp" %>
<%@ Register TagPrefix="telerik" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cntPnlHead" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cntPlacBody" runat="server">
    <form id="Form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div class="navbar navbar-default" role="navigation">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span><span
                        class="icon-bar"></span><span class="icon-bar"></span>
                </button>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li class="pull-right"><a href="">
                        <asp:Label ID="lblUser" runat="server" Text=""></asp:Label></a></li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container-fluid -->
    </div>
    <div class="row">
        <div class="col-md-10">
            <asp:Label ID="lblError" runat="server"></asp:Label>
        </div>
        <div class="col-md-2">
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h6 class="cat" style="margin-left: 0%;">
                Change Password</h6>
            <div class="col-md-1">
            </div>
            <div class="col-md-10">
                <div class="row row-1">
                    <div runat="server" id="dvSuccess" visible="false">
                        <asp:Label ID="lblSuccess" runat="server" Text="" Style="color: Green"></asp:Label>
                    </div>
                </div>
                <div class="row row-1">
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            Current Password<font color="#FF0000">*</font></label>
                        <asp:TextBox class="form-control" ID="txtCurrentPassword" runat="server" MaxLength="25"
                            TextMode="Password" TabIndex="1"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvDegree" runat="server" ErrorMessage="Please enter current password"
                            ControlToValidate="txtCurrentPassword" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <div class="row row-1">
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            New Password<font color="#FF0000">*</font></label>
                        <asp:TextBox class="form-control" ID="txtNewPassword" runat="server" MaxLength="25"
                            TextMode="Password" TabIndex="2"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="Please enter New password"
                            ControlToValidate="txtNewPassword" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <div class="row row-1">
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            Confirm Password<font color="#FF0000">*</font></label>
                        <asp:TextBox class="form-control" ID="txtConfirmPassword" runat="server" MaxLength="25"
                            TextMode="Password" TabIndex="3"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator14" ControlToValidate="txtConfirmPassword"
                            targetcontrolid="txtConfirmPassword" Text="Please enter confirm password" runat="server" SetFocusOnError="True" /><br />
                        <asp:CompareValidator runat="server" ID="cmpNumbers" ControlToValidate="txtNewPassword"
                         ControlToCompare="txtConfirmPassword" Operator="Equal" ErrorMessage="Confirm password must be same in New password" />
                    </div>
                </div>
                <div class="row row-1">
                    <div class="form-group col-md-4">
                        <asp:Button ID="btnChange" runat="server" Text="Change" CssClass="btn btn-default" TabIndex="4"
                            OnClick="btnChange_Click" />
                    </div>
                </div>
            </div>
        </div>
        <div>
        </div>
    </div>
    </form>
</asp:Content>
