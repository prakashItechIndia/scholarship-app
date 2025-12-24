<%@ Page Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true"
    CodeBehind="Report.aspx.cs" Inherits="SaiAramFoundation.Report" %>

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
        //Bind Grid Function
        //$(document).ready(
        // function () {
        //     OnLoadBind();

        // });
        function Reportshow() {
            debugger;
            var xmlhttp;
            document.getElementById("dvCategories").innerHTML = "<img src='~/../image/AjaxGridLoadImage.gif' />";
            document.getElementById("dvCategories").innerHTML = "";

            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    document.getElementById("dvCategories").innerHTML = xmlhttp.responseText;
                }
            }
            xmlhttp.open("GET", "SubReportForCategories.aspx", true);
            xmlhttp.send();
        }


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
    <form id="Form1" runat="server">
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
                <div class="col-md-12">
                    <div style="cursor: pointer" align="center">
                        <table align="center" cellpadding="5" width="50%">
                            <tr>
                                <td align="left">
                                    <img src="~/../images/bullet1.gif" />
                                    <asp:HyperLink ID="hplSubReportForSholarshipIssued" runat="server" NavigateUrl="~/SubReportForCategories.aspx">Categories wise Report</asp:HyperLink>
                                    <br />
                                </td>
                            </tr>
                            <tr>
                                <td align="left">
                                    <img src="~/../images/bullet1.gif" />
                                    <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="~/SubReportForScholarshipIssued.aspx">Report of Scholarship Issued</asp:HyperLink>
                                </td>
                            </tr>
                        </table>
                        <%-- <asp:HyperLink ID="hplSubReportForCategories" runat="server" onclick="Reportshow()">Report For Categories</asp:HyperLink><br />--%>
                    </div>
                </div>
            </div>
        </div>
        <div id="dvCategories" style="width: 100%;">
        </div>
    </form>
</asp:Content>
