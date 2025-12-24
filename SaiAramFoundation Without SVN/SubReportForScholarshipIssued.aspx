<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SubReportForScholarshipIssued.aspx.cs"
    MasterPageFile="~/HomeMaster.Master" Inherits="SaiAramFoundation.SubReportForScholarshipIssued" %>

<%@ Register TagPrefix="Anders" Assembly="Anders.Web.Controls" Namespace="Anders.Web.Controls" %>
<%@ Register Assembly="System.Web.Entity, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
    Namespace="System.Web.UI.WebControls" TagPrefix="asp" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>


<asp:Content ID="Content2" ContentPlaceHolderID="cntPnlHead" runat="server">

    <script src="fancyboxJs/jquery-1.9.0.min.js" type="text/javascript"></script>

    <script src="fancyboxJs/jquery.fancybox.js" type="text/javascript"></script>

    <link href="fancyboCss/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <link href="bcss/bs-table.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        jQuery(document).ready(function () {
            jQuery("a.inline1").fancybox({
                'transitionIn': 'elastic',
                'transitionOut': 'none',
                'type': 'iframe',
                'height': 750,
                'width': 1000,
            });
        });

    </script>
    <style type="text/css">
        .warning_txt {
            margin-left: 96px;
            padding: 5px;
        }
    </style>

    <script type="text/javascript">
        //Export Functios
        //function calExportExcel() {
        //    var myExcelWindow = window.open('ExportExcel.aspx?key=Excel', 'name', 'height=0,width=0');
        //}
        //function calExportWord() {
        //    var myWordWindow = window.open('ExportExcel.aspx?key=Word', 'name', 'height=0,width=0');
        //}

        //Print Function
        function CallPrint(strid) {
            var prtContent = document.getElementById(strid);
            var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=500,toolbar=0,scrollbars=0,status=0');
            WinPrint.document.write(prtContent.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
            prtContent.innerHTML = strOldOne;
        }

    </script>

</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="cntPlacBody" runat="server">
    <form id="form1" runat="server">
        <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </asp:ToolkitScriptManager>
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
                            <asp:Label ID="Label2" runat="server" Text=" Report of Scholarship Issued " Style="font-weight: bold; margin-right: 580px;"></asp:Label>
                            <asp:Label ID="lblUser" runat="server" Text=""></asp:Label></a>
                        </li>
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
            <%--<div class="col-md-2">
    <input type="button" id="btnExportWord" value="Word"  class="btn btn-default" onclick="calExportWord()" />
     <input type="button" id="btnExportExcel" value="Excel" class="btn btn-default" onclick="calExportExcel()" />
    
    </div>--%>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="col-md-4">
                    <div>
                        <asp:Label ID="Label1" runat="server" Text="Main Category"></asp:Label>
                        <asp:DropDownList ID="ddlMainCategory" runat="server" Width="150px" OnSelectedIndexChanged="ddlMainCategory_OnSelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Selected="True" Value="0">--Select--</asp:ListItem>
                            <asp:ListItem Value="Issued By">Issued By</asp:ListItem>
                            <asp:ListItem Value="Issued Date">Issued Date</asp:ListItem>
                        </asp:DropDownList>
                    </div>
                </div>
                <div class="col-md-8">
                    <div id="divDate" runat="server">
                        <asp:Label ID="lblIssuedBy" runat="server" Text="Issued By"></asp:Label>
                        <asp:DropDownList ID="ddlIssuedBy" Width="150px" runat="server" AutoPostBack="true">
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredIssuedByValues" ControlToValidate="ddlIssuedBy"
                            targetcontrolid="ddlIssuedBy" Text="Please select Issued by" runat="server" InitialValue="--Select--"
                            SetFocusOnError="True" />
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="padding: 10px;">
            <div class="col-md-12">
                <div class="col-md-4">
                </div>
                <div class="col-md-8">
                    <asp:Label ID="lblFromDate" runat="server" Text="From"></asp:Label>
                    <asp:TextBox ID="txtFromDate" Width="120px" runat="server" MaxLength="10" placeholder="DD/MM/YYYY"></asp:TextBox>
                    <%--<asp:Image ID="imgCal" runat="server" ImageUrl="~/images/Calendar.png" />--%>
                    <asp:CalendarExtender ID="cetxtfrom" runat="server" Format="dd/MM/yyyy" TargetControlID="txtFromDate">
                    </asp:CalendarExtender>
                    <asp:Label ID="lblToDate" runat="server" Text="To"></asp:Label>
                    <asp:TextBox ID="txtToDate" Width="120px" runat="server" MaxLength="10" placeholder="DD/MM/YYYY"></asp:TextBox>
                    <%--<asp:Image ID="imgCalander" runat="server" ImageUrl="~/images/Calendar.png"  /> --%>
                    <asp:CalendarExtender ID="CalendarExtender1" runat="server" Format="dd/MM/yyyy" TargetControlID="txtToDate">
                    </asp:CalendarExtender>
                </div>
            </div>
        </div>

        <div class="row" style="padding-bottom: 10px;">
            <div class="col-md-12">
                <div class="col-md-4">
                </div>
                <div class="col-md-8">
                    <asp:Label ID="lblChequeInFavorType" runat="server" Text="Type"></asp:Label>
                    <asp:DropDownList ID="ddChequeInFavorType" runat="server" Width="150px" OnSelectedIndexChanged="ddChequeInFavorType_OnSelectedIndexChanged" AutoPostBack="true">
                        <asp:ListItem Selected="True" Text="All" Value="All"></asp:ListItem>
                        <asp:ListItem Text="Individual" Value="Individual"></asp:ListItem>
                        <asp:ListItem Text="Institution" Value="Institution"></asp:ListItem>
                        <asp:ListItem Text="Concession" Value="Concession"></asp:ListItem>
                    </asp:DropDownList>
                    <asp:Label ID="lblIssuedInstitution" runat="server" Text="In Favor of"></asp:Label>
                    <asp:DropDownList ID="ddlIssuedInstitution" runat="server" Width="150px" AutoPostBack="true">
                    </asp:DropDownList>
                    <asp:RequiredFieldValidator ID="RequiredIssuedBy" ControlToValidate="ddlIssuedInstitution"
                        targetcontrolid="ddlIssuedInstitution" Text="Please select Institution" runat="server" InitialValue="--Select--"
                        SetFocusOnError="True" />
                </div>
            </div>
        </div>


        <div class="row warning_txt">
            <div class="col-md-12" id="Div2">
                <asp:RequiredFieldValidator ID="reQApprovedAmount" ControlToValidate="ddlMainCategory"
                    targetcontrolid="ddlMainCategory" Text="select any Main Category" runat="server"
                    SetFocusOnError="True" InitialValue="0" />
            </div>
        </div>
        <div class="row warning_txt">
            <div class="col-md-12" id="Div1">
                <%-- <input type="button" id="btnReport" value="Get Report" CssClass="btn btn-default" onclick="gridshow()" />--%>
                <asp:Button ID="btnSearch" runat="server" Text="Get Report to PDF" OnClick="btnSearch_Click" />
                <asp:Button ID="btnExcelExport" runat="server" Text="Get Report to Excel" OnClick="btnExcelExport_Click" />
            </div>
        </div>
        <div class="row" style="height: 150px">
        </div>
    </form>
</asp:Content>
