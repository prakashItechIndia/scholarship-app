<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/HomeMaster.Master" CodeBehind="SubReportForCategories.aspx.cs"
    Inherits="SaiAramFoundation.SubReportForCategories" %>

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
                'type': 'iframe'
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
                            <asp:Label ID="Label2" runat="server" Text=" Categories wise Report " Style="font-weight: bold; margin-right: 580px;"></asp:Label>
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
            <%--<div class="col-md-2">
    <input type="button" id="btnExportWord" value="Word"  class="btn btn-default" onclick="calExportWord()" />
     <input type="button" id="btnExportExcel" value="Excel" class="btn btn-default" onclick="calExportExcel()" />
    
    </div>--%>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="col-md-4">
                    <div class="col-md-5">
                        <asp:Label ID="lblAcYear" runat="server" Text="Academic Year"></asp:Label>
                    </div>
                    <div class="col-md-7">
                        <asp:DropDownList ID="ddAcYear" runat="server"></asp:DropDownList>

                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">

                <div class="col-md-4">

                    <div>
                        <div class="col-md-5">
                            <asp:Label ID="Label1" runat="server" Text="Main Category"></asp:Label>
                        </div>
                        <div class="col-md-7">
                            <asp:DropDownList ID="ddlMainCategory" runat="server" AutoPostBack="true" OnSelectedIndexChanged="ddlMainCategory_OnSelectedIndexChanged">
                                <asp:ListItem Selected="True" Value="0">--Select--</asp:ListItem>
                                <asp:ListItem Value="Applied Date">Applied Date</asp:ListItem>
                                <asp:ListItem Value="Amount">Amount</asp:ListItem>
                                <asp:ListItem Value="Gender">Gender</asp:ListItem>
                                <asp:ListItem Value="Issued to">Issued to</asp:ListItem>
                                <asp:ListItem Value="Processed Date">Processed Date</asp:ListItem>
                                <asp:ListItem Value="Status">Status</asp:ListItem>
                                <asp:ListItem Value="Sairam Group">Sairam Group</asp:ListItem>
                                <asp:ListItem Value="Parent Office">Parent Office</asp:ListItem>
                                <asp:ListItem Value="Favour Type">Favour Type</asp:ListItem>
                            </asp:DropDownList>
                        </div>
                    </div>

                    <div id="divFavour" runat="server" visible="false">
                        <div class="col-md-5">
                            <asp:Label ID="Label3" runat="server" Text="Favour Category"></asp:Label>
                        </div>
                        <div class="col-md-7">
                            <asp:DropDownList ID="ddlSelectedFavour" runat="server">

                                <asp:ListItem Value="All">All</asp:ListItem>
                                <asp:ListItem Value="Individual">Cheque</asp:ListItem>
                                <asp:ListItem Value="Concession">Concession</asp:ListItem>
                                <asp:ListItem Value="Institution">Institution</asp:ListItem>
                            </asp:DropDownList>
                        </div>
                    </div>

                    <div id="divFavourGroup" runat="server" visible="false">
                        <div class="col-md-5">
                            <asp:Label ID="Label4" runat="server" Text="Favour Group"></asp:Label>
                        </div>
                        <div class="col-md-7">
                            <asp:DropDownList ID="ddlSelectedFavourGroup" runat="server" AutoPostBack="true" OnSelectedIndexChanged="ddlFavourSairamgroup_OnSelectedIndexCahnged">
                                <asp:ListItem Value="All">All</asp:ListItem>
                                <asp:ListItem Value="Sairam Group">Sairam Group</asp:ListItem>
                                <asp:ListItem Value="Out Of Sairam Group">Out Of Sairam Group</asp:ListItem>
                            </asp:DropDownList>
                        </div>
                    </div>
                </div>

                <div class="col-md-8">

                    <div id="divDate" runat="server" visible="false">
                        <asp:TextBox ID="txtFromDate" Width="120px" runat="server" MaxLength="10" placeholder="DD/MM/YYYY"></asp:TextBox>
                        <%--<asp:Image ID="imgCal" runat="server" ImageUrl="~/images/Calendar.png" />--%>
                        <asp:CalendarExtender ID="cetxtfrom" runat="server" Format="dd/MM/yyyy" TargetControlID="txtFromDate">
                        </asp:CalendarExtender>
                        <asp:TextBox ID="txtToDate" Width="120px" runat="server" MaxLength="10" placeholder="DD/MM/YYYY"></asp:TextBox>
                        <%--<asp:Image ID="imgCalander" runat="server" ImageUrl="~/images/Calendar.png"  /> --%>
                        <asp:CalendarExtender ID="CalendarExtender1" runat="server" Format="dd/MM/yyyy" TargetControlID="txtToDate">
                        </asp:CalendarExtender>
                    </div>

                    <div id="divParentOffice" runat="server" visible="false">

                        <asp:TextBox ID="txtParentOffice" runat="server"></asp:TextBox>

                    </div>

                    <div id="divGender" runat="server" visible="false">
                        <asp:DropDownList ID="ddlSelectedGender" runat="server">
                            <asp:ListItem Value=" ">--Select--</asp:ListItem>
                            <asp:ListItem Value="All">All</asp:ListItem>
                            <asp:ListItem Value="Female">Female</asp:ListItem>
                            <asp:ListItem Value="Male">Male</asp:ListItem>
                        </asp:DropDownList>
                    </div>

                    <div id="divIssuedTo" runat="server" visible="false">
                        <asp:DropDownList ID="ddlSelectedIssued" runat="server">
                            <asp:ListItem Value=" ">--Select--</asp:ListItem>
                            <asp:ListItem Value="All">All</asp:ListItem>
                            <asp:ListItem Value="College">College</asp:ListItem>
                            <asp:ListItem Value="Research">Research</asp:ListItem>
                            <asp:ListItem Value="School">School</asp:ListItem>
                        </asp:DropDownList>
                    </div>

                    <div id="divAmount" runat="server" visible="false">
                        <asp:DropDownList ID="ddlSelectedAmount" runat="server">
                            <asp:ListItem Value=" ">--Select--</asp:ListItem>
                            <asp:ListItem Value="Below 5000">Below 5000</asp:ListItem>
                            <asp:ListItem Value="5000-10000">5000-10000</asp:ListItem>
                            <asp:ListItem Value="10000-20000">10000-20000</asp:ListItem>
                            <asp:ListItem Value="20000-50000">20000-50000</asp:ListItem>
                            <asp:ListItem Value="Above 50000">Above 50000</asp:ListItem>
                        </asp:DropDownList>
                    </div>


                    <div id="divStatus" runat="server" visible="false">
                        <asp:DropDownList ID="ddlSelectedStatus" runat="server">
                            <asp:ListItem Value=" ">--Select--</asp:ListItem>
                            <asp:ListItem Value="All">All</asp:ListItem>
                            <asp:ListItem Value="Approved">Approved</asp:ListItem>
                            <asp:ListItem Value="Completed">Completed</asp:ListItem>
                            <asp:ListItem Value="Registered">Registered</asp:ListItem>
                            <asp:ListItem Value="Rejected">Rejected</asp:ListItem>
                            <asp:ListItem Value="Waiting">Waiting</asp:ListItem>
                        </asp:DropDownList>
                    </div>


                    <div id="divSairamgroup" runat="server" visible="false">
                        <asp:DropDownList ID="ddlSairamgroup" runat="server" AutoPostBack="true" OnSelectedIndexChanged="ddlSairamgroup_OnSelectedIndexChanged">

                            <asp:ListItem Value="All" Selected="True">All</asp:ListItem>
                            <asp:ListItem Value="College">College</asp:ListItem>
                            <asp:ListItem Value="School">School</asp:ListItem>
                            <asp:ListItem Value="Polytechnic">Polytechnic</asp:ListItem>
                            <asp:ListItem Value="Medical">Medical</asp:ListItem>

                        </asp:DropDownList>
                    </div>

                    <div id="divSairamCollege" runat="server" visible="false">
                        <asp:DropDownList ID="ddSairamCollege" runat="server">

                            <asp:ListItem Value="All">All</asp:ListItem>
                            <asp:ListItem Value="Sri Sai Ram Engineering College">Sri Sai Ram Engineering College</asp:ListItem>
                            <asp:ListItem Value="Sri Sai Ram Institute Of Technology">Sri Sai Ram Institute Of Technology</asp:ListItem>
                            <asp:ListItem Value="Sri Sairam College Of Engineering">Sri Sairam College Of Engineering</asp:ListItem>

                        </asp:DropDownList>
                    </div>

                    <div id="divSairamSchool" runat="server" visible="false">
                        <asp:DropDownList ID="ddSairamSchool" runat="server">

                            <asp:ListItem Value="All">All</asp:ListItem>
                            <asp:ListItem Value="Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai">Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai</asp:ListItem>
                            <asp:ListItem Value="Sai Matriculation Hr Sec School,Madipakkam">Sai Matriculation Hr Sec School,Madipakkam</asp:ListItem>
                            <asp:ListItem Value="Sai Ram Vidyalaya,Madipakkam,Chennai">Sai Ram Vidyalaya,Madipakkam,Chennai</asp:ListItem>
                            <asp:ListItem Value="Sai Ram Vidyalaya,Ullavaikal,Pondicherry">Sai Ram Vidyalaya,Ullavaikal,Pondicherry</asp:ListItem>
                            <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Thiruthuripoondi">Sai Ram Matriculation Hr Sec School,Thiruthuripoondi</asp:ListItem>
                            <asp:ListItem Value="Sai Ram Matriculation School,Thiruvarur">Sai Ram Matriculation School,Thiruvarur</asp:ListItem>
                            <asp:ListItem Value="Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai">Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai</asp:ListItem>

                        </asp:DropDownList>
                    </div>

                    <div id="divSairamPolytechnic" runat="server" visible="false">
                        <asp:DropDownList ID="ddSairamPolytechnic" runat="server">

                            <asp:ListItem Value="All">All</asp:ListItem>
                            <asp:ListItem Value="Sri Sai Ram Polytechnic College,West Tambaram,Chennai">Sri Sai Ram Polytechnic College,West Tambaram,Chennai</asp:ListItem>
                            <asp:ListItem Value="Sai Jothi Polytechnic College,Ellayarpathi,Madurai">Sai Jothi Polytechnic College,Ellayarpathi,Madurai</asp:ListItem>
                        </asp:DropDownList>
                    </div>

                    <div id="divSairamMedical" runat="server" visible="false">
                        <asp:DropDownList ID="ddSairamMedical" runat="server">

                            <asp:ListItem Value="All">All</asp:ListItem>
                            <asp:ListItem Value="Sri Sai Ram Siddha,West Tambaram,Chennai">Sri Sai Ram Siddha,West Tambaram,Chennai</asp:ListItem>
                            <asp:ListItem Value="Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai">Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai</asp:ListItem>
                            <asp:ListItem Value="Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai">Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai</asp:ListItem>

                        </asp:DropDownList>
                    </div>

                </div>

            </div>
        </div>

        <div class="row warning_txt">
            <div class="col-md-12" id="Div2">
                <asp:RequiredFieldValidator ID="reQApprovedAmount" ControlToValidate="ddlMainCategory"
                    targetcontrolid="ddlMainCategory" Text="Select any Main Category" runat="server"
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
