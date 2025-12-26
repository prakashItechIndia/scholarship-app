<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true"
    CodeBehind="UploadDocument.aspx.cs" Inherits="SaiAramFoundation.UploadDocument" %>

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
                'type': 'iframe'
            });
        });

    </script>

    <script type="text/javascript">

        //       function GetChar(event) {
        //           var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
        //           if (chCode == 0) {
        //               jQuery('#btnsearch').trigger('click');
        //           }
        //       }

        //Bind Grid Function
        $(document).ready(
         function () {

             OnLoadBind();
         });

        function OnLoadBind() {
            debugger;

            var xmlhttp;
            //Academic year filter
            var Acyear = document.getElementById("<% =ddAcyear.ClientID%>")
            var AcyearId = Acyear.options[Acyear.selectedIndex].value;
            var Maincat = document.getElementById("<% =ddlMainCategory.ClientID%>")
            var MaincatText = Maincat.options[Maincat.selectedIndex].text;
            var Key = document.getElementById("<% =txtKey.ClientID%>").value;
            document.getElementById("dvGrid").innerHTML = "<img src='~/../image/AjaxGridLoadImage.gif' />";


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
            xmlhttp.open("GET", "AjaxUploadDocument.aspx?MainCategory=" + MaincatText + "&Key=" + Key + "&AcyearId=" + AcyearId, true);
            xmlhttp.send();

            setTimeout(function () {
                var sel = document.getElementById("<% =ddlMainCategory.ClientID%>");
                sel.selectedIndex = 0;
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


    </script>

</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cntPlacBody" runat="server">
    <form id="Form1" runat="server">
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
            <div class="col-md-2">
            </div>
        </div>
        <div>
            <asp:Panel ID="Panel2" runat="server" DefaultButton="btnSearch">
                <asp:Label ID="Label1" runat="server" Text="Main Category"></asp:Label>
                <asp:DropDownList ID="ddlMainCategory" runat="server">
                    <%--<asp:ListItem Value="--Select--">--Select--</asp:ListItem>--%>
                    <asp:ListItem Selected="True" Value="Application No">Application No</asp:ListItem>
                    <asp:ListItem Value="Aadhaar ID">Aadhaar ID</asp:ListItem>
                    <asp:ListItem Value="Mobile No">Mobile No</asp:ListItem>
                    <asp:ListItem Value="Name">Name</asp:ListItem>
                    <asp:ListItem Value="Student Id">Student Id</asp:ListItem>

                    <%-- <asp:ListItem Value="Process Date">Process Date</asp:ListItem>--%>
                </asp:DropDownList>

                <asp:TextBox ID="txtKey" runat="server" CssClass="txtKey" MaxLength="100"></asp:TextBox>
                <asp:Button ID="btnSearch" runat="server" Text="Search" OnClientClick="OnLoadBind()" />
            </asp:Panel>
        </div>
        <div id="dvGrid" style="width: 100%;">
        </div>
    </form>
</asp:Content>
