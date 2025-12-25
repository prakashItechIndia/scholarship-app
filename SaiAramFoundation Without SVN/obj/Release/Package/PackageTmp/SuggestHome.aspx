<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true"
    CodeBehind="SuggestHome.aspx.cs" Inherits="SaiAramFoundation.SuggestHome" %>

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

    <script type="text/javascript">

        //        function GetChar(event) {
        //            var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
        //            if (chCode == 0) {
        //                jQuery('#btnsearch').trigger('click');
        //            }
        //        }

        //Bind Grid Function
        $(document).ready(
         function () {
             OnLoadBind();
             $(".txtfromDate").hide();
             $(".txttoDate").hide();
             document.getElementById('<%= ddlSelectedStatus.ClientID %>').style.visibility = 'hidden';
         });
         function OnLoadBind() {
             debugger;
             var xmlhttp;

             //Academic year filter
             var Acyear = document.getElementById("<% =ddAcyear.ClientID%>")
             var AcyearId = Acyear.options[Acyear.selectedIndex].value;
             //Main Category
             var Maincat = document.getElementById("<% =ddlMainCategory.ClientID%>")
             var MaincatText = Maincat.options[Maincat.selectedIndex].text;
             var Key = document.getElementById("<% =txtKey.ClientID%>").value;
             var fromdate = document.getElementById("<% =txtfromDate.ClientID%>").value;
             var todate = document.getElementById("<% =txttoDate.ClientID%>").value;
             var SelectedStatus = document.getElementById("<% =ddlSelectedStatus.ClientID%>")
             var SelectedStatusText = SelectedStatus.options[SelectedStatus.selectedIndex].text;

             document.getElementById("dvGrid").innerHTML = "<img src='~/../image/AjaxGridLoadImage.gif' />";

             if (MaincatText == "--Select--" && Key == "") {
                 document.getElementById("dvGrid").innerHTML = "";
                 return;
             }
             if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
                 xmlhttp = new XMLHttpRequest();
             }
             else {// code for IE6, IE5
                 xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
             }
             xmlhttp.onreadystatechange = function () {
                 if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                     document.getElementById("dvGrid").innerHTML = xmlhttp.responseText;
                 }
             }
             xmlhttp.open("GET", "AjaxSuggestHome.aspx?MainCategory=" + MaincatText + "&Key=" + Key + "&SelectedStatusText=" +
              SelectedStatusText + "&fromdate=" + fromdate + "&todate=" + todate + "&AcyearId=" + AcyearId, true);
             xmlhttp.send();

             var sel = document.getElementById("<% =ddlMainCategory.ClientID%>");
             sel.selectedIndex = 0;
             $(".txtKey").show();

             setTimeout(function () {
                 document.getElementById("ctl00_cntPlacBody_txtKey").value = "";
             }, 750);

             document.getElementById('<%= ddlSelectedStatus.ClientID %>').style.visibility = 'hidden';

         }


         function gridshow() {
             debugger;
             var xmlhttp;
             //Academic year filter
             var Acyear = document.getElementById("<% =ddAcyear.ClientID%>")
             var AcyearId = Acyear.options[Acyear.selectedIndex].value;
             //Main Category
             var Maincat = document.getElementById("<% =ddlMainCategory.ClientID%>")
             var MaincatText = Maincat.options[Maincat.selectedIndex].text;
             var Key = document.getElementById("<% =txtKey.ClientID%>").value;
            var fromdate = document.getElementById("<% =txtfromDate.ClientID%>").value;
             var todate = document.getElementById("<% =txttoDate.ClientID%>").value;
             var SelectedStatus = document.getElementById("<% =ddlSelectedStatus.ClientID%>")
             var SelectedStatusText = SelectedStatus.options[SelectedStatus.selectedIndex].text;

             document.getElementById("dvGrid").innerHTML = "<img src='~/../image/AjaxGridLoadImage.gif' />";

             if (MaincatText == "--Select--" && Key == "") {
                 document.getElementById("dvGrid").innerHTML = "";
                 return;
             }
             if (MaincatText == '--Select--') {
                 document.getElementById("txtKey").value = "";
             }
             if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                 xmlhttp = new XMLHttpRequest();
             }
             else {// code for IE6, IE5
                 xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
             }
             xmlhttp.onreadystatechange = function () {
                 if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                     document.getElementById("dvGrid").innerHTML = xmlhttp.responseText;
                 }
             }
             xmlhttp.open("GET", "AjaxSuggestHome.aspx?MainCategory=" + MaincatText + "&Key=" + Key + "&SelectedStatusText=" + SelectedStatusText + "&fromdate=" + fromdate + "&todate=" + todate + "&AcyearId=" + AcyearId, true);
             xmlhttp.send();

             setTimeout(function () {
                 document.getElementById("ctl00_cntPlacBody_txtKey").value = "";
             }, 750);
         }

         //Export Functios
         function calExportExcel() {
             var myExcelWindow = window.open('ExportExcel.aspx?key=Excel', 'name', 'height=0,width=0');
         }
         function calExportWord() {
             var myWordWindow = window.open('ExportExcel.aspx?key=Word', 'name', 'height=0,width=0');
         }

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
         function Button2_onclick() {

         }

         function DisplayBySearchKey() {

             debugger;

             var SearchKey = document.getElementById("<% =ddlMainCategory.ClientID%>");
            var KeyText = SearchKey.options[SearchKey.selectedIndex].text;

            if (KeyText == '--Select--') {

                $(".txtKey").hide();
                $(".txtfromDate").hide();
                $(".txttoDate").hide();
                document.getElementById('<%= ddlSelectedStatus.ClientID %>').style.visibility = 'hidden';
                document.getElementById("txtKey").value = "";
            }
            else if (KeyText == 'Action Date') {
                $(".txtKey").hide();
                $(".txtfromDate").show();
                $(".txttoDate").show();
                document.getElementById('<%= ddlSelectedStatus.ClientID %>').style.visibility = 'visible';
            }
            else if (KeyText == 'Status') {
                $(".txtKey").hide();
                $(".txtfromDate").hide();
                $(".txttoDate").hide();
                document.getElementById('<%= ddlSelectedStatus.ClientID %>').style.visibility = 'visible';
            }
            else {
                $(".txtKey").show();
                $(".txtfromDate").hide();
                $(".txttoDate").hide();
                document.getElementById('<%= ddlSelectedStatus.ClientID %>').style.visibility = 'hidden';
            }
}


    </script>

</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cntPlacBody" runat="server">
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
                    <asp:Label ID="Label2" runat="server" Text="Academic year"></asp:Label>
                    <asp:DropDownList ID="ddAcyear" runat="server" onchange="OnLoadBind()" Style="margin-right: 580px;">
                    </asp:DropDownList>
                </div>
                <!-- /.navbar-collapse -->
            </div>
            <!-- /.container-fluid -->
        </div>
        <div class="row">
            <div class="col-md-10">
                <asp:Label ID="lblError" runat="server"></asp:Label>
            </div>
            <%-- <div class="col-md-2">
            <input type="button" id="btnExportWord" value="Word" class="btn btn-default" onclick="calExportWord()" />
            <input type="button" id="btnExportExcel" value="Excel" class="btn btn-default" onclick="calExportExcel()" />
        </div>--%>
        </div>
        <div>
            <asp:Panel ID="Panel1" runat="server" DefaultButton="btnSearch">
                <asp:Label ID="Label1" runat="server" Text="Main Category"></asp:Label>
                <asp:DropDownList ID="ddlMainCategory" runat="server" onchange="DisplayBySearchKey()">
                    <%-- <asp:ListItem Value="--Select--">--Select--</asp:ListItem>--%>
                    <asp:ListItem Selected="True" Value="Application No">Application No</asp:ListItem>
                    <asp:ListItem Value="Aadhaar ID">Aadhaar ID</asp:ListItem>
                    <asp:ListItem Value="Action Date">Action Date</asp:ListItem>
                    <asp:ListItem Value="Mobile No">Mobile No</asp:ListItem>
                    <asp:ListItem Value="Name">Name</asp:ListItem>
                    <asp:ListItem Value="Scholarship No">Scholarship No</asp:ListItem>
                    <asp:ListItem Value="Cheque No">Cheque No</asp:ListItem>
                    <asp:ListItem Value="Status">Status</asp:ListItem>
                    <asp:ListItem Value="Student Id">Student Id</asp:ListItem>

                </asp:DropDownList>
                <asp:TextBox ID="txtKey" runat="server" CssClass="txtKey" MaxLength="100"></asp:TextBox>
                <telerik:RadDatePicker ID="txtfromDate" CssClass="button txtfromDate hideControl"
                    DateInput-DateFormat="dd/MM/yyyy" runat="server" Width="140px" DateInput-EmptyMessage="From Date"
                    Calendar-EnableMultiSelect="true" MinDate="01/01/1000" MaxDate="01/01/3000" Style="margin-top: -6px;">
                    <Calendar>
                        <SpecialDays>
                            <telerik:RadCalendarDay Repeatable="Today" ItemStyle-CssClass="rcToday">
                            </telerik:RadCalendarDay>
                        </SpecialDays>
                    </Calendar>
                </telerik:RadDatePicker>
                <telerik:RadDatePicker ID="txttoDate" CssClass="button txttoDate hideControl" DateInput-DateFormat="dd/MM/yyyy"
                    runat="server" Width="140px" DateInput-EmptyMessage="To Date" Calendar-EnableMultiSelect="true"
                    MinDate="01/01/1000" MaxDate="01/01/3000" Style="margin-top: -6px;">
                    <Calendar>
                        <SpecialDays>
                            <telerik:RadCalendarDay Repeatable="Today" ItemStyle-CssClass="rcToday">
                            </telerik:RadCalendarDay>
                        </SpecialDays>
                    </Calendar>
                </telerik:RadDatePicker>
                <asp:DropDownList ID="ddlSelectedStatus" runat="server" onchange="gridshow()">
                    <asp:ListItem Value="--Select--">--Select--</asp:ListItem>
                    <asp:ListItem Value="Approved">Approved</asp:ListItem>
                    <asp:ListItem Value="Completed">Completed</asp:ListItem>
                    <asp:ListItem Selected="True" Value="Registered">Registered</asp:ListItem>
                    <asp:ListItem Value="Rejected">Rejected</asp:ListItem>
                    <asp:ListItem Value="Waiting">Waiting</asp:ListItem>
                </asp:DropDownList>

                <%-- <asp:TextBox ID="TextBox1" runat="server" CssClass="txtKey" MaxLength="100"></asp:TextBox>--%>
                <asp:Button ID="btnSearch" runat="server" Text="Search" OnClientClick="gridshow()" />
            </asp:Panel>
        </div>
        <div class="row">
            <div class="col-md-12" id="dvGrid">
            </div>
        </div>
    </form>
</asp:Content>
