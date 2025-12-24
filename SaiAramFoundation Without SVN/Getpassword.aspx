<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true"
    CodeBehind="Getpassword.aspx.cs" Inherits="SaiAramFoundation.Getpassword" %>

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
        <div class="col-md-12">
            <h6 class="cat" style="margin-left: 0%;">
                Get Password</h6>
            <div class="col-md-1">
            </div>
            <div class="col-md-10">
                <div class="row row-1">
                 <div class="form-group col-md-2">
                  <label for="exampleInputEmail1">
                            User Name<font color="#FF0000">*</font></label>
                 </div>
                    <div class="form-group col-md-4">
                       
                        <asp:DropDownList ID="ddlUserName" runat="server" AutoPostBack="true" CssClass="form-control"
                            TabIndex="1" OnSelectedIndexChanged="ddlUserName_SelectedIndexChanged">
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfvDegree" runat="server" ErrorMessage="Please select user name"
                            ControlToValidate="ddlUserName" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <div class="row row-1">
                 <div class="form-group col-md-2">
                        <label for="exampleInputEmail1">
                            Password</label> 
                    </div>
                    <div class="form-group col-md-4">
                        <asp:Label ID="lblPassword" runat="server"></asp:Label>
                    </div>
                </div>
            </div>
        </div>
        <div>
        </div>
    </div>
    </form>
</asp:Content>
