<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true"
    CodeBehind="UserCreation.aspx.cs" Inherits="SaiAramFoundation.UserCreation" %>

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
                User Creation</h6>
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
                            User Type<font color="#FF0000">*</font></label>
                        <asp:DropDownList ID="ddlUserType" runat="server" AutoPostBack="true" CssClass="form-control"
                            TabIndex="1">
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfvDegree" runat="server" ErrorMessage="Please select user type"
                            ControlToValidate="ddlUserType" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            Name<font color="#FF0000">*</font></label>
                        <asp:TextBox class="form-control" ID="txtName" runat="server" MaxLength="50" TabIndex="2"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="Please enter name"
                            ControlToValidate="txtName" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <div class="row row-1">
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            User Name<font color="#FF0000">*</font></label>
                        <asp:TextBox class="form-control" ID="txtUserId" runat="server" MaxLength="25" TabIndex="3"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="Please enter user name"
                            ControlToValidate="txtUserId" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            Password<font color="#FF0000">*</font></label>
                        <asp:TextBox class="form-control" ID="txtPassword" runat="server" MaxLength="25"
                            TextMode="Password" TabIndex="4"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="Please enter password name"
                            ControlToValidate="txtPassword" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <div class="row row-1">
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            Mobile no(+91)<font color="#FF0000">*</font></label>
                        <asp:TextBox class="form-control" ID="txtMobile" runat="server" MaxLength="10" TabIndex="5"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator14" ControlToValidate="txtMobile"
                            targetcontrolid="txtMobile" Text="Please enter mobile no" runat="server" SetFocusOnError="True" />
                        <asp:RegularExpressionValidator ID="revMobile" runat="server" ControlToValidate="txtMobile"
                            ErrorMessage="Enter only numbers" SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            Email Id<font color="#FF0000">*</font></label>
                        <asp:TextBox class="form-control" ID="txtEmailID" runat="server" MaxLength="95" TabIndex="6"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator5" ControlToValidate="txtEmailID"
                            targetcontrolid="txtEmailID" Text="Please enter Email" runat="server" SetFocusOnError="True" />
                        <asp:RegularExpressionValidator ID="revEmail" runat="server" ErrorMessage="Enter valid email id"
                            Style="position: relative" ValidationExpression="^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,3}))$"
                            ControlToValidate="txtEmailID" SetFocusOnError="True"></asp:RegularExpressionValidator>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1">
                            Status<font color="#FF0000">*</font></label>
                        <asp:DropDownList ID="ddlActive" runat="server" TabIndex="7" AutoPostBack="True"
                            CssClass="form-control">
                            <asp:ListItem Value="1">Active</asp:ListItem>
                            <asp:ListItem Value="0">InActive</asp:ListItem>
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator4" ControlToValidate="ddlActive"
                            targetcontrolid="ddlActive" Text="Please select status" runat="server" SetFocusOnError="True" />
                    </div>
                </div>
                <div class="row row-1">
                    <div class="form-group col-md-4">
                        <asp:Button ID="btnSave" runat="server" Text="Save" CssClass="btn btn-default" TabIndex="8"
                            OnClick="btnSave_Click" />
                        <asp:Button ID="btnDelete" runat="server" Text="Delete" CssClass="btn btn-default"
                            TabIndex="8" OnClick="btnDelete_Click" CausesValidation="false" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <asp:GridView ID="gvDisplayUserCreation" runat="server" AutoGenerateColumns="False"
                        AllowPaging="False" CssClass="table table-condensed" OnRowDataBound="gvDisplayUserCreation_RowDataBound"
                        OnSelectedIndexChanged="gvDisplayUserCreation_SelectedIndexChanged" Style="cursor: pointer;">
                        <RowStyle />
                        <PagerSettings Position="TopAndBottom" />
                        <Columns>
                            <asp:TemplateField HeaderText="S.No" ItemStyle-HorizontalAlign="Center">
                                <ItemTemplate>
                                    <%#Container.DataItemIndex+1 %>
                                </ItemTemplate>
                                <ItemStyle Width="10px"></ItemStyle>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Name" ItemStyle-HorizontalAlign="Center">
                                <ItemTemplate>
                                    <asp:Label ID="lblUserName" runat="server" Text='<%#Eval("User_Name") %>'></asp:Label>
                                </ItemTemplate>
                                <ItemStyle Width="100px"></ItemStyle>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="User Name" ItemStyle-HorizontalAlign="Center">
                                <ItemTemplate>
                                    <asp:Label ID="lblUserId" runat="server" Text='<%#Eval("User_ID") %>'></asp:Label>
                                </ItemTemplate>
                                <ItemStyle Width="100px"></ItemStyle>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="User Type" ItemStyle-HorizontalAlign="Center">
                                <ItemTemplate>
                                    <asp:Label ID="lblRoleName" runat="server" Text='<%#Eval("Role_Name") %>'></asp:Label>
                                    <asp:Label ID="lblRoleID" runat="server" Visible="false" Text='<%#Eval("Role_Id") %>'></asp:Label>
                                </ItemTemplate>
                                <ItemStyle Width="100px" HorizontalAlign="Left"></ItemStyle>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Mobile Number" ItemStyle-HorizontalAlign="Center">
                                <ItemTemplate>
                                    <asp:Label ID="lblMobile_Number" runat="server" Text='<%#Eval("Mobile_Number") %>'></asp:Label>
                                </ItemTemplate>
                                <ItemStyle Width="100px"></ItemStyle>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Email Id" ItemStyle-HorizontalAlign="Center">
                                <ItemTemplate>
                                    <asp:Label ID="lblEmail" runat="server" Text='<%#Eval("EMail_Id") %>'></asp:Label>
                                </ItemTemplate>
                                <ItemStyle Width="80px"></ItemStyle>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Status" ItemStyle-HorizontalAlign="Center">
                                <ItemTemplate>
                                    <asp:Label ID="lblActiveStatus" runat="server" Text='<%#Eval("ActiveStatus") %>'></asp:Label>
                                </ItemTemplate>
                                <ItemStyle Width="80px"></ItemStyle>
                            </asp:TemplateField>
                        </Columns>
                        <PagerStyle CssClass="pagination" HorizontalAlign="Right" />
                        <HeaderStyle CssClass="gridHeader" />
                        <AlternatingRowStyle CssClass="gridAltContent" />
                    </asp:GridView>
                </div>
                <input type="hidden" id="hdUserId" runat="server" value="" />
            </div>
        </div>
        <div>
        </div>
    </div>
    </form>
</asp:Content>
