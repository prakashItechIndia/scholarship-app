<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true"
    CodeBehind="Reception.aspx.cs" Inherits="SaiAramFoundation.Reception" %>

<%@ Register TagPrefix="Anders" Assembly="Anders.Web.Controls" Namespace="Anders.Web.Controls" %>
<%@ Register Assembly="System.Web.Entity, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
    Namespace="System.Web.UI.WebControls" TagPrefix="asp" %>
<%@ Register TagPrefix="telerik" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<asp:Content ID="Content2" ContentPlaceHolderID="cntPnlHead" runat="server">

    <script src="fancyboxJs/jquery-1.9.0.min.js" type="text/javascript"></script>

    <script src="fancyboxJs/jquery.fancybox.js" type="text/javascript"></script>

    <link href="fancyboCss/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <link href="bcss/bs-table.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        jQuery(document).ready(function() {
            jQuery("a.inline1").fancybox({
                'transitionIn': 'elastic',
                'transitionOut': 'none',
                'type': 'iframe'
            });
        });
           
    </script>

    <style>
        TBODY > TR > TD.cssRegistered
        {
            background-color: #006DCC;
            color: White;
        }
        TBODY > TR > TD.cssAllocated
        {
            background-color: #79389C;
            color: White;
        }
        TBODY > TR > TD.cssCancelled
        {
            background-color: #999999;
            color: White;
        }
        TBODY > TR > TD.cssSelected
        {
            background-color: #5BB75B;
            color: White;
        }
        TBODY > TR > TD.cssRejected
        {
            background-color: #B94A48;
            color: White;
        }
        TBODY > TR > TD.cssWaiting
        {
            background-color: #F89406;
            color: White;
        }
        </style>

</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cntPlacBody" runat="server">
    <form id="Form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
     <div id="dvStatusRow" runat="server" visible="false">
        <asp:Label ID="lblCntRegistered" Font-Size="13pt" ForeColor="#006DCC" runat="server"
            Text=""></asp:Label>
        <asp:Label ID="lblCntApproved" Font-Size="13pt" ForeColor="#49AFCD" runat="server"
            Text=""></asp:Label>
        <asp:Label ID="lblCntWaiting" Font-Size="13pt" ForeColor="#F89406" runat="server"
            Text=""></asp:Label>
        <asp:Label ID="lblCntCompleted" Font-Size="13pt" ForeColor="#5BB75B" runat="server"
            Text=""></asp:Label>
        <asp:Label ID="lblCntRejected" Font-Size="13pt" ForeColor="#B94A48" runat="server"
            Text=""></asp:Label>
    </div>
    
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
    <div>
        <asp:Panel ID="Panel1" runat="server" DefaultButton="btnSearch">
            <asp:Label ID="Label1" runat="server" Text="Application Number :"></asp:Label>
            <asp:TextBox ID="txtKey" runat="server" MaxLength="9"></asp:TextBox>
            <asp:Button ID="btnSearch" runat="server" Text="Search" OnClick="btnSearch_Click" />
        </asp:Panel>
    </div>
    <br />
    <br />
    <div id="dvform" runat="server">
        <div id="divPrint">
            <link href="CSS/print.css" rel="stylesheet" type="text/css" />
            <table id="tblContent" width="60%" border="0" cellspacing="1" cellpadding="2" style="background: #CCC">
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Application Number</span>
                    </td>
                    <td>
                        <asp:Label ID="lblAppNo" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td width="40%">
                        <span>Name </span>
                    </td>
                    <td>
                        <asp:Label ID="lblName" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF" style="display: none;">
                    <td>
                        <span>Father's Name </span>
                    </td>
                    <td>
                        <asp:Label ID="lblFatherName" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>AADHAAR ID </span>
                    </td>
                    <td>
                        <asp:Label ID="lblAadhaarId" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Mobile number </span>
                    </td>
                    <td>
                        <asp:Label ID="lblMobileNumber" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr id="Tr1" bgcolor="#FFFFFF" runat="server">
                    <td>
                        <span>Class Studying </span>
                    </td>
                    <td>
                        <asp:Label ID="lblClassStudying" Style="font-weight: bold;" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Institution Name </span>
                    </td>
                    <td>
                        <asp:Label ID="lblInstitutionname" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Scholarship Applied For </span>
                    </td>
                    <td>
                        <asp:Label ID="lblScholarshipFor" runat="server" Style="font-weight: bold;" Text=""></asp:Label>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <span>Current Status </span>
                    </td>
                    <td id="tdStatus" runat="server">
                        <asp:Label ID="lblVerifyStatus" runat="server" Style="font-weight: bold;" Text=""></asp:Label> /
                    </td>
                </tr>
            </table>
            <asp:Label ID="Label2" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
        </div>
    </div>
    </form>
</asp:Content>
