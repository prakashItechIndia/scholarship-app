<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RG_Admission_New.aspx.cs"
    MaintainScrollPositionOnPostback="true" Inherits="SaiAramFoundation.RG_Admission_New"
    EnableViewStateMac="false" EnableSessionState="True" EnableEventValidation="false"
    ValidateRequest="false" ViewStateEncryptionMode="Never" %>

<%@ Register TagPrefix="Anders" Assembly="Anders.Web.Controls" Namespace="Anders.Web.Controls" %>
<%@ Register Assembly="System.Web.Entity, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
    Namespace="System.Web.UI.WebControls" TagPrefix="asp" %>
<%@ Register TagPrefix="telerik" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Sai Ram Group of Institutions - Admissions
        <%=Session["AdYearCode"]%></title>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    <link rel="stylesheet" type="text/css" href="CSS/SaiGroup.css" />
    <link href="CSS/Registration.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        body
        {
            margin: 0 auto;
        }
        a
        {
            text-decoration: none;
            color: #00c6ff;
        }
        h1
        {
            font: 4em normal Arial, Helvetica, sans-serif;
            padding: 20px;
            margin: 0;
            text-align: center;
        }
        h1 small
        {
            font: 0.2em normal Arial, Helvetica, sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            line-height: 5em;
            display: block;
        }
        h2
        {
            color: #bbb;
            font-size: 3em;
            text-align: center;
            text-shadow: 0 1px 3px #161616;
        }
        .container
        {
            width: 960px;
            margin: 0 auto;
            overflow: hidden;
        }
        #content
        {
            float: left;
            width: 100%;
        }
        .post
        {
            margin: 0 auto;
            padding-bottom: 50px;
            float: left;
            width: 960px;
        }
        .btn-sign
        {
            width: 460px;
            margin-bottom: 20px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 5px;
            background: -moz-linear-gradient(center top, #00c6ff, #018eb6);
            background: -webkit-gradient(linear, left top, left bottom, from(#00c6ff), to(#018eb6));
            background: -o-linear-gradient(top, #00c6ff, #018eb6);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=         '#00c6ff' , EndColorStr= '#018eb6' );
            text-align: center;
            font-size: 36px;
            color: #fff;
            text-transform: uppercase;
        }
        .btn-sign a
        {
            color: #fff;
            text-shadow: 0 1px 2px #161616;
        }
        #mask
        {
            display: none;
            background: #000;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 10;
            width: 100%;
            height: 100%;
            opacity: 0.8;
            z-index: 999;
        }
        .login-popup
        {
            display: none;
            background: #333;
            padding: 10px;
            border: 2px solid #ddd;
            float: left;
            font-size: 1.2em;
            position: fixed;
            top: 50%;
            left: 50%;
            z-index: 99999;
            box-shadow: 0px 0px 20px #999;
            -moz-box-shadow: 0px 0px 20px #999; /* Firefox */
            -webkit-box-shadow: 0px 0px 20px #999; /* Safari, Chrome */
            border-radius: 3px 3px 3px 3px;
            -moz-border-radius: 3px; /* Firefox */
            -webkit-border-radius: 3px; /* Safari, Chrome */
        }
        img.btn_close
        {
            float: right;
            margin: -28px -28px 0 0;
        }
        fieldset
        {
            border: none;
        }
        form.signin .textbox label
        {
            display: block;
            padding-bottom: 7px;
        }
        form.signin .textbox span
        {
            display: block;
        }
        form.signin p, form.signin span
        {
            color: #999;
            font-size: 11px;
            line-height: 18px;
        }
        form.signin .textbox input
        {
            background: #666666;
            border-bottom: 1px solid #333;
            border-left: 1px solid #000;
            border-right: 1px solid #333;
            border-top: 1px solid #000;
            color: #fff;
            border-radius: 3px 3px 3px 3px;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            font: 13px Arial, Helvetica, sans-serif;
            padding: 6px 6px 4px;
            width: 200px;
        }
        form.signin input:-moz-placeholder
        {
            color: #bbb;
            text-shadow: 0 0 2px #000;
        }
        form.signin input::-webkit-input-placeholder
        {
            color: #bbb;
            text-shadow: 0 0 2px #000;
        }
        .button
        {
            background: -moz-linear-gradient(center top, #f3f3f3, #dddddd);
            background: -webkit-gradient(linear, left top, left bottom, from(#f3f3f3), to(#dddddd));
            background: -o-linear-gradient(top, #f3f3f3, #dddddd);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=         '#f3f3f3' , EndColorStr= '#dddddd' );
            border-color: #000;
            border-width: 1px;
            border-radius: 4px 4px 4px 4px;
            -moz-border-radius: 4px;
            -webkit-border-radius: 4px;
            color: #333;
            cursor: pointer;
            display: inline-block;
            padding: 6px 6px 4px;
            margin-top: 10px;
            font: 12px;
            width: 214px;
        }
        .button:hover
        {
            background: #ddd;
        }
        .jcropper-holder
        {
            border: 1px black solid;
        }
        #outer
        {
            text-align: center;
        }
        .jcExample
        {
            text-align: left;
            background: white;
            width: 700px;
            font-size: 80%;
            margin: 1.5em auto 2em auto;
            border: 1px #999 solid;
            padding: 1em 2em 2em;
        }
        .jcExample .article
        {
            width: 565px;
        }
        form
        {
            margin: 1.5em 0;
        }
        form.coords label
        {
            margin-right: 1em;
            font-weight: bold;
            color: #900;
        }
        form.coords input
        {
            width: 3em;
        }
        .ui-button
        {
            font-size: 10pt;
        }
        .ui-dialog
        {
            font-size: 9pt;
        }
        .ui-state-default
        {
            font-size: 9pt;
        }
        .ui-widget-overlay
        {
            opacity: 0.80;
            filter: Alpha(opacity=70);
        }
        .jc-dialog
        {
            padding-top: 1em;
        }
        .ui-dialog p tt
        {
            color: yellow;
        }
        li small
        {
            font-style: normal;
            color: #CF4429;
            font-size: 11px;
        }
        .jcrop-light .jcrop-selection
        {
            -moz-box-shadow: 0px 0px 15px #999; /* Firefox */
            -webkit-box-shadow: 0px 0px 15px #999; /* Safari, Chrome */
            box-shadow: 0px 0px 15px #999; /* CSS3 */
        }
        .jcrop-dark .jcrop-selection
        {
            -moz-box-shadow: 0px 0px 15px #000; /* Firefox */
            -webkit-box-shadow: 0px 0px 15px #000; /* Safari, Chrome */
            box-shadow: 0px 0px 15px #000; /* CSS3 */
        }
        .jcrop-fancy .jcrop-handle.ord-e
        {
            -webkit-border-top-left-radius: 0px;
            -webkit-border-bottom-left-radius: 0px;
        }
        .jcrop-fancy .jcrop-handle.ord-w
        {
            -webkit-border-top-right-radius: 0px;
            -webkit-border-bottom-right-radius: 0px;
        }
        .jcrop-fancy .jcrop-handle.ord-nw
        {
            -webkit-border-bottom-right-radius: 0px;
        }
        .jcrop-fancy .jcrop-handle.ord-ne
        {
            -webkit-border-bottom-left-radius: 0px;
        }
        .jcrop-fancy .jcrop-handle.ord-sw
        {
            -webkit-border-top-right-radius: 0px;
        }
        .jcrop-fancy .jcrop-handle.ord-se
        {
            -webkit-border-top-left-radius: 0px;
        }
        .jcrop-fancy .jcrop-handle.ord-s
        {
            -webkit-border-top-left-radius: 0px;
            -webkit-border-top-right-radius: 0px;
        }
        .jcrop-fancy .jcrop-handle.ord-n
        {
            -webkit-border-bottom-left-radius: 0px;
            -webkit-border-bottom-right-radius: 0px;
        }
        .uppercase
        {
            text-transform: uppercase;
        }
        .marginTop
        {
            margin-top: 8px;
        }
        .checkAds
        {
            width: 500px !important;
        }
        .checkAds tr td
        {
            width: 20%;
        }
        .Display_None
        {
            display: none;
        }
        .Display_Block
        {
            display: block;
        }
        #Rg_Registration_2013
        {
            width: 1000px;
            margin: 0 auto;
        }
    </style>
    <%--<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.1/themes/base/jquery-ui.css" />
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script src="http://code.jquery.com/ui/1.10.1/jquery-ui.js"></script>
<link rel="stylesheet" href="/resources/demos/style.css" />
<script>
    $(function() {
    $("#txtDOB").datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat:"dd/mm/yyyy"
        });
    });
</script>--%>

    <script type="text/javascript">
        function setDate(sender, args) {
            var d = new Date(); //Today
            d.setYear(d.getFullYear() - 18); //18 years ago
            $find("myDate").set_selectedDate(d);
        }
        function ValidateReg1() {

            var xmlhttp;
            var strDOB = document.getElementById("txtDOB").value;
            var strRegNo = document.getElementById("txtRegNo").value;
            if (strRegNo.length == 0 && strDOB.length != 10) {
                document.getElementById("divAlert").innerHTML = "";
                return;
            }
            else {
                if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp = new XMLHttpRequest();
                }
                else {// code for IE6, IE5
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("divAlert").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.open("GET", "Validate_Reg_Data.aspx?q=Reg&RegNo=" + strRegNo + "&DOB=" + strDOB, true);
                xmlhttp.send();
            }
        }
    </script>

    <style type="text/css">
        #informationbar
        {
            background: url(         "/images/notifications.png" ) no-repeat scroll 0 -160px #D1E4F3;
            position: relative;
            left: 0;
            width: 100%;
            line-height: 30px;
            height: 30px;
            text-indent: 5px;
            padding: 5px 0;
            font: 12px Tahoma;
            color: red;
        }
        * html #informationbar
        {
            /*IE6 hack*/
            position: absolute;
            /*width: expression(document.compatMode==         "CSS1Compat" ? document.documentElement.clientWidth+ "px" : body.clientWidth+ "px" );*/
        }
    </style>
</head>
<body>

    <script type="text/javascript">



        function informationbar() {
            this.displayfreq = "always"
            this.content = '<div style="width: 14px;  height: 14px; float: right; border: 0; margin-right: 5px"></div>'
        }

        informationbar.prototype.setContent = function(data) {
            this.content = this.content + data
            document.write('<div id="informationbar" style="top: -500px">' + this.content + '</div>')
        }

        informationbar.prototype.animatetoview = function() {
            var barinstance = this
            if (parseInt(this.barref.style.top) < 0) {
                this.barref.style.top = parseInt(this.barref.style.top) + 5 + "px"
                setTimeout(function() { barinstance.animatetoview() }, 50)
            }
            else {
                if (document.all && !window.XMLHttpRequest)
                    this.barref.style.setExpression("top", 'document.compatMode=="CSS1Compat"? document.documentElement.scrollTop+"px" : body.scrollTop+"px"')
                else
                    this.barref.style.top = 0
            }
        }

        informationbar.close = function() {
            document.getElementById("informationbar").style.display = "none"
            if (this.displayfreq == "session")
                document.cookie = "infobarshown=1;path=/"
        }

        informationbar.prototype.setfrequency = function(type) {
            this.displayfreq = type
        }

        informationbar.prototype.initialize = function() {
            if (this.displayfreq == "session" && document.cookie.indexOf("infobarshown") == -1 || this.displayfreq == "always") {
                this.barref = document.getElementById("informationbar")
                this.barheight = parseInt(this.barref.offsetHeight)
                this.barref.style.top = this.barheight * (-1) + "px"
                this.animatetoview()
            }
        }

        window.onunload = function() {
            this.barref = null
        }

    </script>

    <script language="JavaScript">

        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browserName = "Microsoft Internet Explorer";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome, the true version is after "Chrome" 
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "Google Chrome";
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari, the true version is after "Safari" or after "Version" 
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox, the true version is after "Firefox" 
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browserName = "Mozilla Firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent 
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browserName = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(';')) != -1) fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(' ')) != -1) fullVersion = fullVersion.substring(0, ix);

        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }


        // using browserdetection.js

        if (browserName == 'Mozilla Firefox' && majorVersion < 11) {
            var infobar = new informationbar();
            infobar.setContent('Dear Visitor,Your browser seems to be out dated which may result in security risk and performance issues. Sairam recommends to update your browser to the latest version. <a href="javascript:sendRequest(\'http://www.mozilla.org/en-US/firefox/new\',\'Mozilla Firefox\')">click here</a> to upgrade...');
            infobar.initialize();
            /* if(window.stop !== undefined)
            {
            window.stop();
            }
            else if(document.execCommand !== undefined)
            {
            document.execCommand("Stop", false);
            } */

        }
        /*else if(browserName == 'Google Chrome' && majorVersion < 17)*/
        else if (browserName == 'Google Chrome') {
            var infobar = new informationbar();
            infobar.setContent('Dear Visitor,Please use Mozilla Firefox for better user experience. To download the latest Mozilla Firefox. <a href="javascript:sendRequest(\'http://www.mozilla.org/en-US/firefox/new\',\'Mozilla Firefox\')">click here</a>...');
            infobar.initialize();


            /* if(window.stop !== undefined)
            {
            window.stop();
            }
            else if(document.execCommand !== undefined)
            {
            document.execCommand("Stop", false);
            } */

        }
        //else if(browserName == 'Microsoft Internet Explorer' && majorVersion < 9)
        else if (browserName == 'Microsoft Internet Explorer') {
            var infobar = new informationbar();
            infobar.setContent('Dear Visitor,Please use Mozilla Firefox for better user experience. To download the latest Mozilla Firefox. <a href="javascript:sendRequest(\'http://www.mozilla.org/en-US/firefox/new\',\'Mozilla Firefox\')">click here</a>...');
            infobar.initialize();

            /* if(window.stop !== undefined)
            {
            window.stop();
            }
            else if(document.execCommand !== undefined)
            {
            document.execCommand("Stop", false);
            }	 */
        }


        var http = createRequestObject();

        function sendRequest(url, browserName) {
            window.open(url);
        }
    </script>

    <%--<div style="top: 0pt;" id="informationbar" class="notibar msginfo"><div style="width: 14px;  height: 14px; float: right; border: 0; margin-right: 5px"></div></div>--%>

    <script type="text/javascript">
        function calcPercentage(a, id) {
        
            document.getElementById("<%=txt10Percentage.ClientID %>").value = "";
            debugger;
          

            if (id == "txtMarks") {
                var brd = document.getElementById("<%=ddlXIIBoard.ClientID %>").value;
                if (brd == "State Board (TN State)") {
                    var per = a / 5;
                    var valu = per.toFixed(parseInt(2));
                    document.getElementById("<%=txt10Percentage.ClientID %>").value = valu;
                }
                else if (brd == "Central Board") {
                    var per = a * 9.5;
                    var valu = per.toFixed(parseInt(2));
                    document.getElementById("<%=txt10Percentage.ClientID %>").value = valu;
                }
                else if (brd == "Intermediate (AP State)" || brd == "Others") {
                    var MaximumMark = document.getElementById("<%=txtMarksMax.ClientID %>").value;
                    if (a != '' && MaximumMark != '') {
                        var per = (a * 100) / MaximumMark;
                        var valu = per.toFixed(parseInt(2));
                        document.getElementById("<%=txt10Percentage.ClientID %>").value = valu;
                    }
                }
            }
            else if (id == "txtMarksMax") {
                var obtainedMark = document.getElementById("<%=txtMarks.ClientID %>").value;
                if (a != '' && obtainedMark != '') {
                    var per = (obtainedMark * 100) / a;
                    var valu = per.toFixed(parseInt(2));
                    document.getElementById("<%=txt10Percentage.ClientID %>").value = valu;
                }
            }
            
           
        }
        
        function calculatePercentage()
        {debugger;
        var totalMarks=document.getElementById("<%=txtMarks.ClientID %>").value;
        var maxMarks=document.getElementById("<%=txtMarksMax.ClientID %>").value;

        if (parseInt(totalMarks) <= parseInt(maxMarks))
        {
            var percentage = (totalMarks / maxMarks) * 100;
            document.getElementById("<%=txt10Percentage.ClientID%>").value=percentage.toFixed(parseInt(2));
        }
        else{
        document.getElementById("<%=txt10Percentage.ClientID%>").value="";
        }
        }

        function marks10th(value, id, min, max) {
            if (id == "txtMarks") {
                var brd = document.getElementById("<%=ddlXIIBoard.ClientID %>").value;
                if (brd == "State Board (TN State)") {
                    if (parseInt(value) < 0 || isNaN(value))
                        return 0;
                    else if (parseInt(value) > 500)
                        return 500;
                    else return value;
                }
                else if (brd == "Central Board") {
                    if (parseInt(value) < 0 || isNaN(value))
                        return 0;
                    else if (parseInt(value) > 9.50)
                        return 9.5;
                    else return value;
                }
                else {
                    if (parseInt(value) < 0 || isNaN(value))
                        return 0;
                    else if (parseInt(value) > 1200)
                        return 1200;
                    else return value;
                }
            }
            else if (id == "txtMarksMax") {
                if (parseInt(value) < 0 || isNaN(value))
                    return 0;
                else if (parseInt(value) > 1200)
                    return 1200;
                else return value;
            }
        }

        function uploadStarted() {
            $get("imgDisplay").src = "";
            // $get("imgDisplay").style.display = "none";
        }
        function uploadComplete(sender, args) {


            var filename = args.get_fileName();
            var ext = filename.substring(filename.lastIndexOf(".") + 1);
            if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {

            }
            else {
                throw {
                    name: "Invalid File Type",
                    level: "Error",
                    message: "Invalid File Type (Only png,jpg,jpeg)",
                    htmlMessage: "Invalid File Type (Only png,jpg,jpeg)"

                }
                return false;

            }




            var imgDisplay = $get("imgDisplay");
            // var imgCrop = $get("imgCrop");
            //   imgDisplay.src = "images/loader.gif";
            //   imgDisplay.style.cssText = "";
            var img = new Image();
            img.src = "tempImage/" + args.get_fileName();
            var strdate = '<%=strDate %>';
            img.onload = function() {
                imgDisplay.style.cssText = "height:100px;width:100px";
                imgDisplay.src = img.src;
                imgCrop.style.cssText = "height:400px;width:400px";
                imgCrop.src = img.src;
            };


            document.getElementById("txtimagepath").value = img.src
        }
        function ChangeCase(elem) {
            elem.value = elem.value.toUpperCase();
        }
    </script>

    <script type="text/javascript">
        function ValidateCheckBox(source, args) {

            var chklist = document.getElementById('<%=ddlAd.ClientID %>');
            var chklistinputs = chklist.getElementsByTagName("input");
            for (var i = 0; i < chklistinputs.length; i++) {
                if (chklistinputs[i].checked) {
                    args.IsValid = true;
                    return;
                }
            }
            args.IsValid = false;
        }
    </script>

    <script type="text/javascript">
        function fncCalculateCutoff(id) {
            debugger;
            var phy = 0, che = 0, math = 0, total = 0;
            var txtphy = document.getElementById("<%=txtPhysics.ClientID %>").value;
            var txtChe = document.getElementById("<%=txtChemistry.ClientID %>").value;
            var txtMath = document.getElementById("<%=txtMaths.ClientID %>").value;
            var txtTotal = document.getElementById("<%=txtTotalSub.ClientID %>").value;
            var txtSCM = document.getElementById("<%=txtPCMMark.ClientID %>");
            var txtTolPer = document.getElementById("<%=txtTotalPercent.ClientID %>");
            //Marks        
            if (txtphy != "")
                phy = parseInt(txtphy);
            else
                phy = parseInt("0");
            if (txtChe != "")
                che = parseInt(txtChe);
            else
                che = parseInt("0");
            if (txtMath != "")
                math = parseInt(txtMath);
            else
                math = parseInt("0");
            //Total
            if (txtTotal != "")
                total = parseInt(txtTotal);
            else
                total = parseInt("0");


            var ddlBoard = document.getElementById("<%=ddlXIIBoard.ClientID %>").value;
            //Check Central Board
            if (ddlBoard == "Central Board") {
                if (parseInt(phy) <= 100 && parseInt(che) <= 100 && parseInt(math) <= 100) {
                    txtSCM.value = (parseFloat((parseInt(phy) + parseInt(che) + parseInt(math)) / 3)).toFixed(2);
                    //txtSCM.value = parseInt(total);
                }
                else {
                    if (id == "txtPhysics") {
                        document.getElementById("<%=txtPhysics.ClientID %>").value = "";
                    }
                    else if (id == "txtChemistry") {
                        document.getElementById("<%=txtChemistry.ClientID %>").value = "";
                    }
                    else if (id == "txtMaths") {
                        document.getElementById("<%=txtMaths.ClientID %>").value = "";
                    }
                }
                //Calculate Total
                if (parseInt(total) <= 500) {
                    txtTolPer.value = (parseFloat(parseInt(total) / 5)).toFixed(2);
                }
                else {
                    document.getElementById("<%=txtTotalPercent.ClientID %>").value = "";
                    document.getElementById("<%=txtTotalSub.ClientID %>").value = "";
                }

            }

            //Check State Board
            else if (ddlBoard == "State Board (TN State)") {
                if (parseInt(phy) <= 200 && parseInt(che) <= 200 && parseInt(math) <= 200) {
                    txtSCM.value = (parseFloat((parseInt(phy) + parseInt(che) + parseInt(math)) / 6)).toFixed(2);
                    //txtSCM.value = parseInt(total);                 
                }
                else {
                    if (id == "txtPhysics") {
                        document.getElementById("<%=txtPhysics.ClientID %>").value = "";
                    }
                    else if (id == "txtChemistry") {
                        document.getElementById("<%=txtChemistry.ClientID %>").value = "";
                    }
                    else if (id == "txtMaths") {
                        document.getElementById("<%=txtMaths.ClientID %>").value = "";
                    }
                }
                //Calculate Total
                if (parseInt(total) <= 1200) {
                    txtTolPer.value = (parseFloat(parseInt(total) / 12)).toFixed(2);
                }
                else {
                    document.getElementById("<%=txtTotalPercent.ClientID %>").value = "";
                    document.getElementById("<%=txtTotalSub.ClientID %>").value = "";
                }
            }
            //alert(id);


        }
    </script>

    <form id="form1" runat="server" enctype="multipart/form-data">
    <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </asp:ToolkitScriptManager>
    <%--  <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>--%>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server" ChildrenAsTriggers="true" UpdateMode="Conditional">
        <ContentTemplate>
            <div id="Rg_Registration_2013">
                <div id="Header">
                    <div id="LogoArea">
                        <div id="Search">
                            <div style="margin-top: 45px;" align="center">
                            </div>
                        </div>
                        <!-- End of id="Search" -->
                        <div id="Logo">
                            <a href="http://admission.sairamgroup.in/" title="Sai Ram Group of Institutions"
                                style="margin-left: 90px; border: 0px; display: block; width: 250px; min-height: 15px;
                                border: 0px; height: 75px;"></a>
                        </div>
                        <!-- End of id="Logo" -->
                        <div id="HeaderLinks">
                            <div style="margin-top: 45px;" align="center">
                            </div>
                        </div>
                        <!-- End of id="Logo" -->
                    </div>
                    <!-- End of id="LogoArea" -->
                </div>
                <!-- End of id="Header" -->
                <div class="Clr">
                </div>
                <div class="Brud" id="Brudcurms">
                    <a href="http://www.sairamgroup.in/index.html">Home</a> » Online Registration
                    <%=Session["AdYearCode"]%>
                </div>
                <div class="Clr">
                </div>
                <div class="Tittle" id="Tittle">
                    <asp:Label ID="lblUserName" runat="server" ForeColor="#003399" Font-Bold="True" Font-Size="12">
                    </asp:Label>
                </div>
                <%-- <div>
                    <asp:ValidationSummary ID="ValidationSummary1" runat="server" ValidationGroup="vg" />
                </div>--%>
                <div>
                    <table width="1000px" border="0" bgcolor="#FFFFFF" cellpadding="3" cellspacing="1">
                        <tr>
                            <td bgcolor="#FFFFFF" align="center">
                                <span class="Tittle">Online Registration - (B.E / B.Tech. Degree Programmes
                                    <%=Session["AdYearName"]%>)</span>
                                <br />
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#FFFFFF" align="center">
                                <asp:Label Width="100%" ID="lblResult" runat="server" Font-Bold="True" ForeColor="Green">
                                </asp:Label>
                                <asp:ValidationSummary ID="vsRegistration" runat="server" EnableClientScript="true"
                                    HeaderText="Fields indicated by (*) are mandatory. " ShowMessageBox="false" ShowSummary="false" />
                            </td>
                        </tr>
                        <tr>
                            <td align="left">
                                Fields indicated by (<span style="color: Red; font-weight: bold;"> * </span>) are
                                Mandatory.
                            </td>
                        </tr>
                        <tr id="trCourseDetails">
                            <td bgcolor="#FFFFFF" align="left">
                                <table width="98%" cellpadding="4" cellspacing="1" border="0">
                                    <tr>
                                        <td>
                                            <span class="BlueHead">Board of Study</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div id="divBoard" style="border: solid 1px #7db9e8; width: 99%; padding: 10px;">
                                                <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                                    <tr>
                                                        <td width="10%" align="left">
                                                            Board of Study
                                                        </td>
                                                        <td width="17%" align="left">
                                                            <asp:DropDownList ID="ddlXIIBoard" runat="server" Width="150" CssClass="TextStyle2013"
                                                                AutoPostBack="True" OnSelectedIndexChanged="ddlXIIBoard_SelectedIndexChanged">
                                                                <asp:ListItem Value="0">...</asp:ListItem>
                                                                <%--  <asp:ListItem Value="Not Applicable">Not Applicable</asp:ListItem>--%>
                                                                <asp:ListItem Value="Central Board">Central Board</asp:ListItem>
                                                                <asp:ListItem Value="State Board (TN State)">State Board (TN State)</asp:ListItem>
                                                                <asp:ListItem Value="Intermediate (AP State)">Intermediate (AP State)</asp:ListItem>
                                                                <asp:ListItem Value="Others">Others</asp:ListItem>
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvXIIBoard" Display="Dynamic"
                                                                runat="server" ErrorMessage="Select Board of Study" ControlToValidate="ddlXIIBoard"
                                                                InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                        </td>
                                                        <td>
                                                            <div id="trXIIBoardOthers">
                                                                <asp:TextBox ID="txtXIIBoard" runat="server" Width="150" CssClass="TextStyle2013"
                                                                    MaxLength="25" TabIndex="1"></asp:TextBox>
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvtxtXIIBoard" Display="Dynamic"
                                                                    runat="server" ErrorMessage="Enter Board of Study" ControlToValidate="txtXIIBoard"
                                                                    SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="BlueHead">Course Preference</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div id="divPreference" style="border: solid 1px #7db9e8; width: 99%; padding: 10px;">
                                                <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                                    <tr>
                                                        <td>
                                                            I<sup>st</sup> Preference
                                                        </td>
                                                        <td>
                                                            <asp:DropDownList ID="ddlPreference1" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ddlPreference1_SelectedIndexChanged"
                                                                Width="100px" CssClass="TextStyle2013" TabIndex="2">
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvPreference1" runat="server"
                                                                ErrorMessage="Preference I" ControlToValidate="ddlPreference1" SetFocusOnError="True"
                                                                InitialValue="--Select--"></asp:RequiredFieldValidator>
                                                        </td>
                                                        <td>
                                                            II<sup>nd</sup> Preference
                                                        </td>
                                                        <td>
                                                            <asp:DropDownList ID="ddlPreference2" runat="server" AutoPostBack="True" Enabled="False"
                                                                OnSelectedIndexChanged="ddlPreference2_SelectedIndexChanged" Width="100px" CssClass="TextStyle2013"
                                                                TabIndex="3">
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvPreference2" SetFocusOnError="True"
                                                                runat="server" ErrorMessage="Preference II" ControlToValidate="ddlPreference2"
                                                                InitialValue="--Select--"></asp:RequiredFieldValidator>
                                                        </td>
                                                        <td>
                                                            III<sup>rd</sup> Preference
                                                        </td>
                                                        <td>
                                                            <asp:DropDownList ID="ddlPreference3" runat="server" Enabled="False" Width="100px"
                                                                CssClass="TextStyle2013" TabIndex="3">
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvPreference3" SetFocusOnError="True"
                                                                runat="server" ErrorMessage="Preference III" ControlToValidate="ddlPreference3"
                                                                InitialValue="--Select--"></asp:RequiredFieldValidator>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div id="divPersonalInformation" style="border: solid 1px #7db9e8; width: 49%; padding: 0px;
                                    height: auto; overflow: auto; float: left; margin: 5px; margin-bottom: 10px;">
                                    <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                        <tr>
                                            <td colspan="2">
                                                <span class="BlueHead">Personal Information</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            </td>
                                            <td>
                                                Name as Per SSLC Certificate
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="22%" align="right" valign="top">
                                                <font color="#FF0000">* </font>First Name
                                            </td>
                                            <td width="78%" align="left">
                                                <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtFullName" runat="server" Width="150px"
                                                    onblur="ChangeCase(this);" MaxLength="50" TabIndex="5"></asp:TextBox>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvName"
                                                    ControlToValidate="txtFullName" Text="Enter First name" Display="Dynamic" runat="server"
                                                    SetFocusOnError="True" />
                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revName" runat="server"
                                                    ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtFullName"
                                                    ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                                                </asp:RegularExpressionValidator>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>Last Name
                                            </td>
                                            <td align="left">
                                                <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtLastName" runat="server" Width="150px"
                                                    onblur="ChangeCase(this);" MaxLength="50" TabIndex="6"></asp:TextBox>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvLastName"
                                                    ControlToValidate="txtLastName" Text="Enter Last name" Display="Dynamic" runat="server"
                                                    SetFocusOnError="True" />
                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revLastName" runat="server"
                                                    ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtLastName"
                                                    ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                                                </asp:RegularExpressionValidator>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>Date of birth
                                                <br />
                                                <i>( DD/MM/YYYY )</i>
                                            </td>
                                            <td align="left">
                                                <asp:TextBox ID="txtDOB" runat="server" Width="150px" CssClass="TextStyle2013" onblur="ValidateReg();"
                                                    placeholder="DD/MM/YYYY" TabIndex="7"></asp:TextBox>
                                                <asp:CalendarExtender ID="ceDOB" runat="server" TargetControlID="txtDOB" Format="dd/MM/yyyy"
                                                    TodaysDateFormat="dd/MM/yyyy" CssClass="cal_Theme1" OnClientShowing="setDate"
                                                    BehaviorID="myDate">
                                                </asp:CalendarExtender>
                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="regtxtBirthDate1" runat="server"
                                                    ErrorMessage="Enter valid Date dd/MM/YYYY" SetFocusOnError="True" Style="position: relative"
                                                    ValidationExpression="(((0[1-9]|[12][0-9]|3[01])([/])(0[13578]|10|12)([/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([/])(0[469]|11)([/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([/])(02)([/])(\d{4}))|((29)(\.|-|\/)(02)([/])([02468][048]00))|((29)([/])(02)([/])([13579][26]00))|((29)([/])(02)([/])([0-9][0-9][0][48]))|((29)([/])(02)([/])([0-9][0-9][2468][048]))|((29)([/])(02)([/])([0-9][0-9][13579][26])))"
                                                    ControlToValidate="txtDOB" Display="Dynamic"></asp:RegularExpressionValidator>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvDOB" ControlToValidate="txtDOB"
                                                    targetcontrolid="txtDOB" Text="Enter DOB" Display="Dynamic" runat="server" SetFocusOnError="True" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>Gender
                                            </td>
                                            <td align="left">
                                                <asp:RadioButton CssClass="LabelText" runat="server" ID="optMale" Text="Male" GroupName="optSex"
                                                    Checked="true" TabIndex="8" />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <asp:RadioButton CssClass="LabelText" runat="server" ID="optFemale" Text="Female"
                                                    GroupName="optSex" TabIndex="9" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>Religion
                                            </td>
                                            <td align="left">
                                                <asp:DropDownList ID="ddlReligion" runat="server" Width="150" CssClass="TextStyle2013"
                                                    TabIndex="10" AutoPostBack="true" OnSelectedIndexChanged="ddlReligion_SelectedIndexChanged">
                                                    <asp:ListItem Value="0">...</asp:ListItem>
                                                    <asp:ListItem Value="Hindu">Hindu</asp:ListItem>
                                                    <asp:ListItem Value="Christian">Christian</asp:ListItem>
                                                    <asp:ListItem Value="Muslim">Muslim</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvReligion" SetFocusOnError="True"
                                                    Display="Dynamic" runat="server" ErrorMessage="Select Religion" ControlToValidate="ddlReligion"
                                                    InitialValue="0"></asp:RequiredFieldValidator>
                                                <div id="otherrel" runat="server">
                                                    <asp:TextBox ID="txtReligion" runat="server" Width="150" CssClass="TextStyle2013 marginTop"
                                                        MaxLength="25" TabIndex="11"></asp:TextBox>
                                                    <div style="float: right; width: 215px; margin-top: -18px">
                                                        <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvtxtReligion" SetFocusOnError="True"
                                                            runat="server" ErrorMessage="Enter Religion" Display="Dynamic" ControlToValidate="txtReligion"></asp:RequiredFieldValidator>
                                                        <asp:RegularExpressionValidator ValidationGroup="vg" ID="reReligion" SetFocusOnError="True"
                                                            runat="server" ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtReligion"
                                                            ValidationExpression="^[a-zA-Z\s-.]{1,50}$">
                                                        </asp:RegularExpressionValidator>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>Community
                                            </td>
                                            <td align="left">
                                                <asp:DropDownList CssClass="TextStyle2013" ID="ddlCommunity" runat="server" Width="150px"
                                                    TabIndex="12">
                                                    <asp:ListItem Value="0">...</asp:ListItem>
                                                    <asp:ListItem Value="OC">OC</asp:ListItem>
                                                    <asp:ListItem Value="BC">BC</asp:ListItem>
                                                    <asp:ListItem Value="BCM">BCM</asp:ListItem>
                                                    <asp:ListItem Value="MBC">MBC</asp:ListItem>
                                                    <asp:ListItem Value="SC">SC</asp:ListItem>
                                                    <asp:ListItem Value="ST">ST</asp:ListItem>
                                                    <asp:ListItem Value="SCA">SCA</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" SetFocusOnError="True"
                                                    ID="rfvCommunity" ControlToValidate="ddlCommunity" InitialValue="0" Text="Select community"
                                                    Display="Dynamic" runat="server" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>Mother Tongue
                                            </td>
                                            <td align="left">
                                                <asp:DropDownList CssClass="TextStyle2013" ID="ddlMTongue" runat="server" Width="150px"
                                                    AutoPostBack="true" TabIndex="13" OnSelectedIndexChanged="ddlMTongue_SelectedIndexChanged">
                                                    <asp:ListItem Value="0">...</asp:ListItem>
                                                    <asp:ListItem Value="Tamil">Tamil</asp:ListItem>
                                                    <asp:ListItem Value="Telugu">Telugu</asp:ListItem>
                                                    <asp:ListItem Value="Malayalam">Malayalam</asp:ListItem>
                                                    <asp:ListItem Value="kannada"> kannada</asp:ListItem>
                                                    <asp:ListItem Value="Hindi">Hindi</asp:ListItem>
                                                    <asp:ListItem Value="Punjabi">Punjabi</asp:ListItem>
                                                    <asp:ListItem Value="Gujarati">Gujarati</asp:ListItem>
                                                    <asp:ListItem Value="Bengali">Bengali</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvMotherTongue"
                                                    ControlToValidate="ddlMTongue" Text="Select mother tongue" Display="Dynamic"
                                                    runat="server" InitialValue="0" SetFocusOnError="true" />
                                                <div id="divMother" style="float: left;" runat="server">
                                                    <asp:TextBox ID="txtMotherTongue" Display="Dynamic" runat="server" Width="150" CssClass="TextStyle2013 marginTop"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvtxtMotherTongue" SetFocusOnError="True"
                                                        runat="server" ErrorMessage="Enter Mother Tongue" ControlToValidate="txtMotherTongue"></asp:RequiredFieldValidator>
                                                    <asp:RegularExpressionValidator ValidationGroup="vg" Display="Dynamic" ID="reMotherTongue"
                                                        SetFocusOnError="True" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                                        ControlToValidate="txtMotherTongue" ValidationExpression="^[a-zA-Z\s-.]{1,50}$">
                                                    </asp:RegularExpressionValidator>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div id="divParentDetails" style="border: solid 1px #7db9e8; width: 48%; padding: 0px;
                                    height: auto; overflow: auto; margin-bottom: 10px; float: left; margin: 5px;">
                                    <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                        <tr>
                                            <td colspan="2">
                                                <span class="BlueHead">Parent Details</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="32%" align="right" valign="top">
                                                <font color="#FF0000">* </font>Father Name
                                            </td>
                                            <td width="68%" align="left">
                                                <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtFatherName" MaxLength="50"
                                                    runat="server" Width="150px" onblur="ChangeCase(this);" TabIndex="14"></asp:TextBox>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvtxtFatherName"
                                                    SetFocusOnError="True" ControlToValidate="txtFatherName" Text="Enter Father Name"
                                                    Display="Dynamic" runat="server" />
                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revtxtFatherName" SetFocusOnError="True"
                                                    runat="server" ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtFatherName"
                                                    ValidationExpression="^[a-zA-Z\s-.]{1,50}$"></asp:RegularExpressionValidator>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="32%" align="right" valign="top">
                                                <font color="#FF0000">* </font>Mother Name
                                            </td>
                                            <td width="68%" align="left">
                                                <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtMotherName" MaxLength="50"
                                                    runat="server" Width="150px" onblur="ChangeCase(this);" TabIndex="14"></asp:TextBox>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvtxtMotherName"
                                                    SetFocusOnError="True" ControlToValidate="txtMotherName" Text="Enter Mother Name"
                                                    Display="Dynamic" runat="server" />
                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revtxtMotherName" SetFocusOnError="True"
                                                    runat="server" ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtMotherName"
                                                    ValidationExpression="^[a-zA-Z\s-.]{1,50}$"></asp:RegularExpressionValidator>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="32%" align="right" valign="top">
                                                <%--<font color="#FF0000">* </font>--%>Name of the Guardian
                                                <br />
                                                <i>( If applicable )</i>
                                            </td>
                                            <td width="68%" align="left">
                                                <asp:TextBox CssClass="TextStyleNoBG2013 uppercase" ID="txtParentName" MaxLength="50"
                                                    runat="server" Width="150px" onblur="ChangeCase(this);" TabIndex="14"></asp:TextBox>
                                                <%--  <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvParentName" SetFocusOnError="True"
                                                    ControlToValidate="txtParentName" Text="Enter Guardian Name" Display="Dynamic"
                                                    runat="server" />--%>
                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revParentName" SetFocusOnError="True"
                                                    runat="server" ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtParentName"
                                                    ValidationExpression="^[a-zA-Z\s-.]{1,50}$"></asp:RegularExpressionValidator>
                                            </td>
                                        </tr>
                                        <tr style="display: none;">
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>Relationship with the Candidate
                                            </td>
                                            <td align="left">
                                                <asp:DropDownList CssClass="TextStyle2013" ID="ddlReltoCandiate" runat="server" Width="150px"
                                                    TabIndex="15">
                                                    <asp:ListItem Value="0">...</asp:ListItem>
                                                    <asp:ListItem Value="Father">Father</asp:ListItem>
                                                    <asp:ListItem Value="Mother">Mother</asp:ListItem>
                                                    <asp:ListItem Value="Guardian">Guardian</asp:ListItem>
                                                </asp:DropDownList>
                                                <div style="float: right; width: 160px;">
                                                    <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvReltoCandiate" SetFocusOnError="True"
                                                        ControlToValidate="ddlReltoCandiate" InitialValue="0" Text="Select relationship with candidate"
                                                        Display="Dynamic" Enabled="false" CssClass="Warning" runat="server" />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                Contact No. of the Parent/Guardian
                                            </td>
                                            <td align="left">
                                                <asp:TextBox CssClass="TextStyleNoBG2013" ID="txtParentNumber" MaxLength="15" runat="server"
                                                    Width="150px" TabIndex="16"></asp:TextBox>
                                                <asp:RegularExpressionValidator ValidationGroup="vg" CssClass="Warning" SetFocusOnError="True"
                                                    ID="revParentNumber" Display="Dynamic" runat="server" ControlToValidate="txtParentNumber"
                                                    ErrorMessage="Enter only Numbers" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                                                <br />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>Parent's/Guardian's Occupation
                                            </td>
                                            <td align="left">
                                                <asp:DropDownList ID="txtParentOccuptn" runat="server" Width="150px" CssClass="TextStyle2013"
                                                    TabIndex="17">
                                                    <%--   <asp:ListItem Value="0">...</asp:ListItem>
                                                    <asp:ListItem Value="State Govt">State Govt</asp:ListItem>
                                                    <asp:ListItem Value="Central Govt">Central Govt</asp:ListItem>
                                                    <asp:ListItem Value="Business/ Self-employed ">Business/ Self-employed </asp:ListItem>--%>
                                                    <asp:ListItem Value="0">..Select..</asp:ListItem>
                                                    <asp:ListItem Value="Agriculture Serives">Agriculture Serives</asp:ListItem>
                                                    <asp:ListItem Value="Business">Business</asp:ListItem>
                                                    <asp:ListItem Value="Defence Service">Defence Service</asp:ListItem>
                                                    <asp:ListItem Value="Engineering Service">Engineering Service</asp:ListItem>
                                                    <asp:ListItem Value="Public / Govt. Service">Public / Govt. Service</asp:ListItem>
                                                    <asp:ListItem Value="Law Practice">Law Practice</asp:ListItem>
                                                    <asp:ListItem Value="Medical Service">Medical Service</asp:ListItem>
                                                    <asp:ListItem Value="Private Service">Private Service</asp:ListItem>
                                                    <asp:ListItem Value="Self Employed">Self Employed</asp:ListItem>
                                                    <asp:ListItem Value="Teaching Research">Teaching Research</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" SetFocusOnError="True"
                                                    ID="rfvOccupation" ControlToValidate="txtParentOccuptn" Text="Enter occupation"
                                                    Display="Dynamic" runat="server" InitialValue="0" />
                                                <br />
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table width="97%" cellpadding="0" cellspacing="1" border="0">
                                    <tr>
                                        <div id="divCommunicationAddressHeading">
                                            <td>
                                                <span class="BlueHead">Communication Address</span>
                                            </td>
                                        </div>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div id="divCommunicationAddress" style="border: solid 1px #7db9e8; width: 100%;
                                                padding: 10px; min-height: 100px; height: auto; float: left;">
                                                <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                                    <tr>
                                                        <td width="12%" align="right" valign="top">
                                                            <font color="#FF0000">* </font>Address Line 1
                                                        </td>
                                                        <td width="33%" align="left">
                                                            <asp:TextBox ID="txtAddressLine1" CssClass="TextStyle2013 uppercase" runat="server"
                                                                Width="150px" MaxLength="100" TabIndex="18"></asp:TextBox>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" SetFocusOnError="True"
                                                                ID="rfvAddrLine1" ControlToValidate="txtAddressLine1" Text="Enter Address Line 1"
                                                                Display="Dynamic" runat="server" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revAddrLine1" runat="server"
                                                                SetFocusOnError="True" ErrorMessage="Enter valid address , Special charectors not allowed"
                                                                ControlToValidate="txtAddressLine1" ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                                            </asp:RegularExpressionValidator>
                                                        </td>
                                                        <td width="12%" align="right">
                                                            <font color="#FF0000">* </font>Postal Code
                                                        </td>
                                                        <td width="33%" align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtPostalCode" runat="server" MaxLength="6"
                                                                Width="150px" TabIndex="26"></asp:TextBox>&nbsp;
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" SetFocusOnError="True"
                                                                ID="rfvPostalCode" ControlToValidate="txtPostalCode" Text="Enter postal code"
                                                                Display="Dynamic" runat="server" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revPostalCode" SetFocusOnError="True"
                                                                CssClass="Warning" runat="server" Display="Dynamic" ControlToValidate="txtPostalCode"
                                                                ErrorMessage="Enter only Numbers" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right" valign="top">
                                                            <font color="#FF0000"></font>Address Line 2
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtAddressLine2" runat="server"
                                                                Width="150px" MaxLength="100" TabIndex="19"></asp:TextBox>
                                                            <%--  <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvAddrLine2" SetFocusOnError="True"
                                                                ControlToValidate="txtAddressLine2" Text="Enter Address Line 2" Display="Dynamic"
                                                                runat="server" />--%>
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revAddrLine2" SetFocusOnError="True"
                                                                runat="server" ErrorMessage="Enter valid address , Special charectors not allowed"
                                                                ControlToValidate="txtAddressLine2" ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                                            </asp:RegularExpressionValidator>
                                                        </td>
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>Mobile No. (+91)
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtMobile" runat="server" MaxLength="10"
                                                                Width="150px" TabIndex="27"></asp:TextBox>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" SetFocusOnError="True"
                                                                ID="rfvMobile" ControlToValidate="txtMobile" Text="Enter mobile no" Display="Dynamic"
                                                                runat="server" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revMobile" CssClass="Warning"
                                                                Display="Dynamic" runat="server" ControlToValidate="txtMobile" ErrorMessage="Enter only Numbers"
                                                                SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right" valign="top">
                                                            <font color="#FF0000">* </font>City
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtCity" runat="server" MaxLength="25"
                                                                Width="150px" TabIndex="20"></asp:TextBox>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvCity"
                                                                ControlToValidate="txtCity" Text="Enter city" Display="Dynamic" runat="server"
                                                                SetFocusOnError="True" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revCity" runat="server"
                                                                ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtCity"
                                                                ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True"></asp:RegularExpressionValidator>
                                                        </td>
                                                        <td align="right">
                                                            Phone No.
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyleNoBG2013" ID="txtLandline" runat="server" MaxLength="11"
                                                                Width="150px" TabIndex="28"></asp:TextBox>
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" CssClass="Warning" ID="rfvLandline"
                                                                Display="Dynamic" runat="server" ControlToValidate="txtLandline" ErrorMessage="Enter only Numbers"
                                                                SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right" valign="top">
                                                            <font color="#FF0000">* </font>Country
                                                        </td>
                                                        <td align="left">
                                                            <asp:DropDownList ID="ddlCountry" runat="server" Width="150px" AutoPostBack="true"
                                                                CssClass="TextStyle2013" TabIndex="21" OnSelectedIndexChanged="ddlCountry_SelectedIndexChanged">
                                                                <asp:ListItem Value="0">--Select--</asp:ListItem>
                                                                <asp:ListItem Value="100">India</asp:ListItem>
                                                                <asp:ListItem Value="Others">Others</asp:ListItem>
                                                            </asp:DropDownList>
                                                            <%-- <asp:DropDownList ID="ddlCountry_New" runat="server" Width="150px" AutoPostBack="true"
                                                                CssClass="TextStyle2013" TabIndex="21" OnSelectedIndexChanged="ddlCountry_SelectedIndexChanged">
                                                                <asp:ListItem Value="0">--Select--</asp:ListItem>
                                                                <asp:ListItem Value="100">India</asp:ListItem>
                                                                <asp:ListItem Value="Others">Others</asp:ListItem>
                                                            </asp:DropDownList>--%>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvCountry" runat="server" ControlToValidate="ddlCountry"
                                                                ErrorMessage="Select Country" InitialValue="0" SetFocusOnError="true"></asp:RequiredFieldValidator>
                                                            <div id="divtxtcountry" runat="server">
                                                                <asp:TextBox ID="txtCountry" runat="server" MaxLength="25" Width="150px" CssClass="TextStyle2013 uppercase marginTop"
                                                                    TabIndex="22"></asp:TextBox>
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvCountrtTxt" runat="server"
                                                                    ControlToValidate="txtCountry" SetFocusOnError="True" ErrorMessage="Enter Country Communication Address"></asp:RequiredFieldValidator>
                                                            </div>
                                                        </td>
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>Email ID
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtEmail" MaxLength="100" runat="server"
                                                                Width="150px" oncopy="return false" oncut="return false" onpaste="return false"
                                                                TabIndex="29" />
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvEmail" ControlToValidate="txtEmail"
                                                                Text="Enter email" SetFocusOnError="True" Display="Dynamic" CssClass="Warning"
                                                                runat="server" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revEmail" CssClass="Warning"
                                                                runat="server" ErrorMessage="Enter valid email ID" Style="position: relative"
                                                                ValidationExpression="^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,3}))$"
                                                                ControlToValidate="txtEmail" Display="Dynamic" SetFocusOnError="True"></asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right" valign="top" id="state">
                                                            <div id="DivStatelbl" runat="server">
                                                                State <font color="#FF0000">*</font></div>
                                                        </td>
                                                        <td align="left">
                                                            <div id="divddlstate" runat="server">
                                                                <asp:DropDownList ID="ddlState" runat="server" Width="150px" CssClass="TextStyle2013"
                                                                    TabIndex="23" AutoPostBack="true" OnSelectedIndexChanged="ddlState_SelectedIndexChanged">
                                                                </asp:DropDownList>
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvStatedddl" SetFocusOnError="True"
                                                                    runat="server" ControlToValidate="ddlState" ErrorMessage="Select State" InitialValue="0"></asp:RequiredFieldValidator>
                                                            </div>
                                                            <div id="divtxtstate" runat="server">
                                                                <asp:TextBox ID="txtState" runat="server" MaxLength="25" Width="150px" CssClass="TextStyle2013 uppercase marginTop"
                                                                    TabIndex="24"></asp:TextBox>&nbsp;
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvStatetxt" SetFocusOnError="True"
                                                                    runat="server" ControlToValidate="txtState" ErrorMessage="Enter State" CssClass="Warning"></asp:RequiredFieldValidator>
                                                            </div>
                                                        </td>
                                                        <td align="left">
                                                            &nbsp;
                                                        </td>
                                                        <td align="left">
                                                            &nbsp;
                                                        </td>
                                                    </tr>
                                                    <div id="trDistrict" runat="server">
                                                        <tr id="Tr1" runat="server">
                                                            <td align="right" valign="top" id="Td1">
                                                                <div id="DivDistrictlbl" runat="server">
                                                                    District <font color="#FF0000">*</font></div>
                                                            </td>
                                                            <td align="left">
                                                                <div id="divddlDistrict" runat="server">
                                                                    <asp:DropDownList ID="ddlDistrict" runat="server" Width="150px" CssClass="TextStyle2013"
                                                                        TabIndex="23">
                                                                        <asp:ListItem Value="0">--Select--</asp:ListItem>
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
                                                                    <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvddlDistrict" SetFocusOnError="True"
                                                                        runat="server" ControlToValidate="ddlDistrict" ErrorMessage="Select District"
                                                                        InitialValue="0"></asp:RequiredFieldValidator>
                                                                </div>
                                                                <div id="divtxtDistrict" runat="server">
                                                                    <asp:TextBox ID="txtDistrict" runat="server" MaxLength="25" Width="150px" CssClass="TextStyle2013 uppercase marginTop"
                                                                        TabIndex="24"></asp:TextBox>&nbsp;
                                                                    <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvtxtDistrict" SetFocusOnError="True"
                                                                        runat="server" ControlToValidate="txtDistrict" ErrorMessage="Enter District"
                                                                        CssClass="Warning"></asp:RequiredFieldValidator>
                                                                </div>
                                                            </td>
                                                            <td align="left">
                                                                &nbsp;
                                                            </td>
                                                            <td align="left">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                    </div>
                                                    <tr>
                                                        <td width="12%" align="right" valign="top">
                                                            <font color="#FF0000">* </font>Nationality
                                                        </td>
                                                        <td width="33%" align="left">
                                                            <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtNationality" runat="server"
                                                                Width="150px" MaxLength="25" TabIndex="25"></asp:TextBox>
                                                            <%--<br />--%>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvtxtNationality"
                                                                SetFocusOnError="True" ControlToValidate="txtNationality" Text="Enter Nationality"
                                                                Display="Dynamic" runat="server" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="retxtNationality" SetFocusOnError="True"
                                                                runat="server" ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtNationality"
                                                                ValidationExpression="^[a-zA-Z\s-.]{1,25}$">
                                                            </asp:RegularExpressionValidator>
                                                        </td>
                                                        <td align="right" valign="top">
                                                            <font color="#FF0000">* </font>Confirm Email ID
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtConfirmEmailID" MaxLength="50" runat="server"
                                                                oncopy="return false" oncut="return false" onpaste="return false" Width="150px"
                                                                TabIndex="30" /><%--<br />--%>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvConfirmEmailID"
                                                                SetFocusOnError="True" ControlToValidate="txtConfirmEmailID" Text="Enter confirm Email"
                                                                Display="Dynamic" runat="server" /><br />
                                                            <asp:CompareValidator ID="cvEmail" runat="server" ControlToCompare="txtEmail" ControlToValidate="txtConfirmEmailID"
                                                                Display="Dynamic" ErrorMessage="Email ID doesnot match"></asp:CompareValidator>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div id="PermanentAddress1" style="width: 100%; padding: 5px; min-height: 50px; height: auto;
                                                float: left;">
                                                <table cellpadding="4" cellspacing="1" border="0" bgcolor="#E6F8FD" height="20">
                                                    <tr valign="middle">
                                                        <td>
                                                            Permanent Address Same as Communication Address?
                                                        </td>
                                                        <td>
                                                            <asp:RadioButtonList ID="rdoSame" runat="server" RepeatDirection="Horizontal" TabIndex="31"
                                                                OnSelectedIndexChanged="rdoSame_SelectedIndexChanged" AutoPostBack="true">
                                                                <asp:ListItem Value="Yes">Yes</asp:ListItem>
                                                                <asp:ListItem Value="No">No</asp:ListItem>
                                                            </asp:RadioButtonList>
                                                        </td>
                                                        <td>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvrdoSame" runat="server" SetFocusOnError="True"
                                                                ControlToValidate="rdoSame" ErrorMessage="* Required"></asp:RequiredFieldValidator>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <div runat="server" id="divPaddress">
                                    <table width="97%" cellpadding="0" cellspacing="1" border="0">
                                        <tr id="traddress" runat="server">
                                            <td>
                                                <span class="BlueHead">Permanent Address</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div id="divAddress" runat="server" style="border: solid 1px #7db9e8; width: 100%;
                                                    padding: 10px; min-height: 100px; height: auto; float: left;">
                                                    <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                                        <tr>
                                                            <td width="12%" align="right" valign="top">
                                                                <font color="#FF0000">* </font>Address Line 1
                                                            </td>
                                                            <td width="33%" align="left">
                                                                <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtPaddress1" runat="server"
                                                                    Width="150px" MaxLength="100" TabIndex="32"></asp:TextBox>
                                                                <%-- <br />--%>
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvPaddress1"
                                                                    SetFocusOnError="True" ControlToValidate="txtPaddress1" Text="Enter Address Line 1"
                                                                    Display="Dynamic" runat="server" />
                                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revPaddress1" runat="server"
                                                                    ErrorMessage="Enter valid address , Special charectors not allowed" Display="Dynamic"
                                                                    SetFocusOnError="True" ControlToValidate="txtPaddress1" ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                                                </asp:RegularExpressionValidator>
                                                            </td>
                                                            <td width="12%" align="right">
                                                            </td>
                                                            <td width="33%" align="left">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <font color="#FF0000">&nbsp;</font>Address Line 2
                                                            </td>
                                                            <td align="left">
                                                                <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtPaddress2" runat="server"
                                                                    Width="150px" MaxLength="100" TabIndex="33"></asp:TextBox>
                                                                <%--  <br />--%>
                                                                <%--  <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvPaddress2" ControlToValidate="txtPaddress2"
                                                                    SetFocusOnError="True" Text="Enter Address Line 2" Display="Dynamic" runat="server" />--%>
                                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revPaddress2" runat="server"
                                                                    Display="Dynamic" ErrorMessage="Enter valid address , Special charectors not allowed"
                                                                    SetFocusOnError="True" ControlToValidate="txtPaddress2" ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$">
                                                                </asp:RegularExpressionValidator>
                                                            </td>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <font color="#FF0000">* </font>City
                                                            </td>
                                                            <td align="left">
                                                                <asp:TextBox CssClass="TextStyle2013 uppercase" ID="txtPermcity" runat="server" MaxLength="25"
                                                                    Width="150px" TabIndex="34"></asp:TextBox>
                                                                <%-- <br />--%>
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvPcity"
                                                                    ControlToValidate="txtPermcity" Text="Enter city" Display="Dynamic" runat="server"
                                                                    SetFocusOnError="True" />
                                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revPcity" runat="server"
                                                                    Display="Dynamic" ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtPermcity"
                                                                    ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True"></asp:RegularExpressionValidator>
                                                            </td>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <font color="#FF0000">* </font>Country
                                                            </td>
                                                            <td align="left">
                                                                <div id="divPcountry">
                                                                    <asp:DropDownList ID="ddlPCountry" runat="server" Width="150px" CssClass="TextStyle2013"
                                                                        AutoPostBack="true" TabIndex="35" OnSelectedIndexChanged="ddlPCountry_SelectedIndexChanged">
                                                                        <asp:ListItem Value="0">--Select--</asp:ListItem>
                                                                        <asp:ListItem Value="100">India</asp:ListItem>
                                                                        <asp:ListItem Value="Others">Others</asp:ListItem>
                                                                    </asp:DropDownList>
                                                                    <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvPcountry" Display="Dynamic"
                                                                        runat="server" ControlToValidate="ddlPCountry" ErrorMessage="Select Country "
                                                                        InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                                </div>
                                                                <div id="divPtxtcountry" runat="server">
                                                                    <asp:TextBox ID="txtPcountry" runat="server" Display="Dynamic" MaxLength="25" Width="150px"
                                                                        CssClass="TextStyle2013 uppercase marginTop" TabIndex="36"></asp:TextBox>
                                                                    <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvtxtPcountry" runat="server"
                                                                        Display="Dynamic" ControlToValidate="txtPcountry" ErrorMessage="Enter Country Permanent Address"
                                                                        SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                                </div>
                                                            </td>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" valign="top" id="perstate">
                                                                <div runat="server" id="divplable">
                                                                    State <font color="#FF0000">*</font>
                                                                </div>
                                                            </td>
                                                            <td align="left">
                                                                <div id="DivPddlstate" runat="server">
                                                                    <asp:DropDownList ID="ddlPstate" runat="server" Width="150px" CssClass="TextStyle2013"
                                                                        AutoPostBack="true" TabIndex="37" OnSelectedIndexChanged="ddlPstate_SelectedIndexChanged">
                                                                    </asp:DropDownList>
                                                                    <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvddlPstate" Display="Dynamic"
                                                                        runat="server" ControlToValidate="ddlPstate" ErrorMessage="Select State" InitialValue="0"
                                                                        SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                                </div>
                                                                <div id="divPtxtstate" runat="server">
                                                                    <asp:TextBox ID="txtPstate" runat="server" MaxLength="25" Width="150px" CssClass="TextStyle2013 uppercase marginTop"
                                                                        TabIndex="39"></asp:TextBox>&nbsp;
                                                                    <%-- <br />--%>
                                                                    <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvtxtPstate" Display="Dynamic"
                                                                        runat="server" ControlToValidate="txtPstate" ErrorMessage="Enter State" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                                </div>
                                                            </td>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                        <div id="trpDistrict" runat="server">
                                                            <tr id="Tr2" runat="server">
                                                                <td align="right" valign="top" id="Td2" style="width: 100px;">
                                                                    <div id="DivpDistrictlbl" runat="server">
                                                                        District <font color="#FF0000">*</font></div>
                                                                </td>
                                                                <td align="left">
                                                                    <div id="divddlpDistrict" runat="server">
                                                                        <asp:DropDownList ID="ddlpDistrict" runat="server" Width="150px" CssClass="TextStyle2013"
                                                                            TabIndex="23">
                                                                            <asp:ListItem Value="0">--Select--</asp:ListItem>
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
                                                                        <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvpddlDistrict" SetFocusOnError="True"
                                                                            runat="server" ControlToValidate="ddlpDistrict" ErrorMessage="Select District"
                                                                            InitialValue="0"></asp:RequiredFieldValidator>
                                                                    </div>
                                                                    <div id="divtxtpDistrict" runat="server">
                                                                        <asp:TextBox ID="txtpDistrict" runat="server" MaxLength="25" Width="150px" CssClass="TextStyle2013 uppercase marginTop"
                                                                            TabIndex="24"></asp:TextBox>&nbsp;
                                                                        <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvtxtpDistrict" SetFocusOnError="True"
                                                                            runat="server" ControlToValidate="txtpDistrict" ErrorMessage="Enter District"
                                                                            CssClass="Warning"></asp:RequiredFieldValidator>
                                                                    </div>
                                                                </td>
                                                                <td align="left">
                                                                    &nbsp;
                                                                </td>
                                                                <td align="left">
                                                                    &nbsp;
                                                                </td>
                                                            </tr>
                                                        </div>
                                                        <tr>
                                                            <td align="right">
                                                                <font color="#FF0000">* </font>Postal Code
                                                            </td>
                                                            <td align="left">
                                                                <asp:TextBox CssClass="TextStyle2013" ID="txtPpostalCode" runat="server" MaxLength="6"
                                                                    Width="150px" TabIndex="40"></asp:TextBox>&nbsp;
                                                                <br />
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvPpostalCode"
                                                                    ControlToValidate="txtPpostalCode" Text="Enter postal code" Display="Dynamic"
                                                                    runat="server" SetFocusOnError="True" />
                                                                <asp:RegularExpressionValidator ValidationGroup="vg" ID="revPpostalCode" CssClass="Warning"
                                                                    runat="server" Display="Dynamic" ControlToValidate="txtPpostalCode" ErrorMessage="Enter only Numbers"
                                                                    ValidationExpression="[0-9]*" SetFocusOnError="True"></asp:RegularExpressionValidator>
                                                            </td>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <table>
                                    <tr id="trEducation">
                                        <td>
                                            <span class="BlueHead">Education Details</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div id="DivEducationDetails" style="border: solid 1px #7db9e8; width: 100%; padding: 10px;
                                                min-height: 100px; height: auto; float: left;">
                                                <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                                    <tr>
                                                        <td colspan="2" align="left">
                                                            <span class="BlueHead">SSLC/10<sup>th</sup> Exam Details</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="32%" align="right">
                                                            <font color="#FF0000">* </font>10<sup>th</sup> Registration No.
                                                        </td>
                                                        <td width="68%" align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txt10RegNo" MaxLength="15" runat="server"
                                                                Width="150px" oncopy="return false" oncut="return false" onpaste="return false"
                                                                TabIndex="41" onblur="ValidateReg();"></asp:TextBox>
                                                            <div id="div10Alert">
                                                            </div>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfv10RegNo"
                                                                ControlToValidate="txt10RegNo" Text="Enter registration number" Display="Dynamic"
                                                                runat="server" SetFocusOnError="True" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="rev10RegNo" Display="Dynamic"
                                                                CssClass="Warning" runat="server" ControlToValidate="txt10RegNo" ErrorMessage="Enter only Numbers"
                                                                SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="32%" align="right">
                                                            <font color="#FF0000">* </font>10<sup>th</sup> School Name
                                                        </td>
                                                        <td width="68%">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtSchoolName" MaxLength="250" runat="server"
                                                                Width="200px" onblur="ChangeCase(this);" TabIndex="42"></asp:TextBox>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvSchoolName"
                                                                ControlToValidate="txtSchoolName" Text="Enter school name" Display="Dynamic"
                                                                runat="server" SetFocusOnError="True" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="reSchoolName" runat="server"
                                                                ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtSchoolName"
                                                                ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                                                            </asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr id="tr10Marks" runat="server">
                                                        <td width="32%" align="right">
                                                            <font color="#FF0000">* </font>10<sup>th</sup> Marks Obtained <span id="spnMarksTitle" runat="server">
                                                            </span>
                                                        </td>
                                                        <td width="68%">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtMarks" MaxLength="5" runat="server"
                                                                Width="70px" TabIndex="43" onchange="calculatePercentage()" ></asp:TextBox>
                                                            <span id="spnMarksMax" runat="server"></span><span id="spnMarksMaxOthers" runat="server">
                                                                <font color="#FF0000">* </font>Maximum Marks</span>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvMarks" ControlToValidate="txtMarks"
                                                                ErrorMessage="Enter 10th std Total Marks" Display="Dynamic" CssClass="Warning"
                                                                runat="server" SetFocusOnError="true" />
                                                            <%--<asp:RegularExpressionValidator ValidationGroup="vg" ID="rfv3rdSem3" runat="server" ControlToValidate="txtMarks"
                                                                                ErrorMessage="Invalid Marks" ValidationExpression="^0*(499|[0-9][0-9]?(\.[0-9]?[0-9])?)$"></asp:RegularExpressionValidator>--%>
                                                            <%-- <asp:RangeValidator ID="rvtxtMarks" runat="server" ErrorMessage="Invalid %" ControlToValidate="txtMarks" MaximumValue="100" MinimumValue="0"></asp:RangeValidator>--%>
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtMarksMax" MaxLength="5" runat="server"
                                                                Width="70px" TabIndex="43" onchange="calculatePercentage()" ></asp:TextBox>
                                                            <span id="spnMarksExample" runat="server">(Ex: Marks:450/500 or CGPA:9.5/10)</span>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvMarksMax" ControlToValidate="txtMarksMax"
                                                                ErrorMessage="Enter 10th std Max Marks" Display="Dynamic" CssClass="Warning"
                                                                runat="server" SetFocusOnError="true" />
                                                            <asp:CompareValidator ID="cvMarksMax" Operator="GreaterThanEqual" Type="Currency"
                                                                ControlToValidate="txtMarksMax" ControlToCompare="txtMarks" ErrorMessage="Obtained Marks Exceeds the Maximum Marks"
                                                                runat="server" />
                                                        </td>
                                                    </tr>
                                                    <tr id="tr10Percentage" runat="server">
                                                        <td width="32%" align="right">
                                                            <font color="#FF0000"></font>10<sup>th</sup> Percentage
                                                        </td>
                                                        <td width="68%">
                                                            <asp:TextBox Style="border: 0; background-color: #FFFFFF;" ID="txt10Percentage" MaxLength="5"
                                                                runat="server" Width="70px" TabIndex="44"></asp:TextBox>
                                                            <%--<asp:RequiredFieldValidator ValidationGroup="vg" ID="rfv10Percentage" ControlToValidate="txt10Percentage"
                                                                ErrorMessage="" Display="Dynamic" CssClass="Warning" runat="server" SetFocusOnError="true" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="rev10Percentage" runat="server" ControlToValidate="txt10Percentage"
                                                                                ErrorMessage="Invalid %" ValidationExpression="^0*(99|[0-9][0-9]?(\.[0-9]?[0-9])?)$"></asp:RegularExpressionValidator>--%>
                                                            <%-- <asp:RangeValidator ID="rvtxtMarks" runat="server" ErrorMessage="Invalid %" ControlToValidate="txtMarks" MaximumValue="100" MinimumValue="0"></asp:RangeValidator>--%>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2" align="left">
                                                            <span class="BlueHead">HSC/12<sup>th</sup> Exam Details</span>
                                                        </td>
                                                    </tr>
                                                    <tr id="trQualification" runat="server" visible="false">
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>12<sup>th</sup> Qualification
                                                        </td>
                                                        <td align="left">
                                                            <asp:DropDownList ID="ddl12Qualification" runat="server" Width="150" CssClass="TextStyle2013"
                                                                TabIndex="45">
                                                                <asp:ListItem Value="0">...</asp:ListItem>
                                                                <asp:ListItem Value="HSC(A) Academic">HSC(A) Academic</asp:ListItem>
                                                                <asp:ListItem Value="HSC(V) Vocational">HSC(V) Vocational</asp:ListItem>
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvQualification"
                                                                ControlToValidate="ddl12Qualification" InitialValue="0" Text="Select Qualification"
                                                                Display="Dynamic" runat="server" SetFocusOnError="true" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="32%" align="right">
                                                            <font color="#FF0000">* </font>12<sup>th</sup> Registration No.
                                                        </td>
                                                        <td width="68%" align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtRegNo" MaxLength="15" runat="server"
                                                                Width="150px" oncopy="return false" oncut="return false" onpaste="return false"
                                                                TabIndex="46" onblur="ValidateReg();"></asp:TextBox>
                                                            <div id="divAlert">
                                                            </div>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvRegNo"
                                                                ControlToValidate="txtRegNo" Text="Enter registration number" Display="Dynamic"
                                                                runat="server" SetFocusOnError="True" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revRegNo" Display="Dynamic"
                                                                CssClass="Warning" runat="server" ControlToValidate="txtRegNo" ErrorMessage="Enter only Numbers"
                                                                SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>Confirm 12<sup>th</sup> Registration No.
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtConfirm12RegNo" MaxLength="15" runat="server"
                                                                Width="150px" oncopy="return false" oncut="return false" onpaste="return false"
                                                                TabIndex="47"></asp:TextBox>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvConfirm12RegNo"
                                                                ControlToValidate="txtConfirm12RegNo" Text="Enter registration number" Display="Dynamic"
                                                                runat="server" SetFocusOnError="True" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revConfirm12RegNo" Display="Dynamic"
                                                                CssClass="Warning" runat="server" ControlToValidate="txtConfirm12RegNo" ErrorMessage="Enter only Numbers"
                                                                SetFocusOnError="True" ValidationExpression="[0-9]*"></asp:RegularExpressionValidator>
                                                            <asp:CompareValidator ID="cv12RegNo" runat="server" ControlToCompare="txtRegNo" ControlToValidate="txtConfirm12RegNo"
                                                                Display="Dynamic" ErrorMessage="12th Reg No. doesnot match"></asp:CompareValidator>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>12<sup>th</sup> Group
                                                        </td>
                                                        <td align="left">
                                                            <asp:RadioButton CssClass="LabelText" runat="server" ID="optGeneral" Text="General"
                                                                GroupName="optGroup" Checked="true" TabIndex="48" />
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <asp:RadioButton CssClass="LabelText" runat="server" ID="optVocational" Text="Vocational"
                                                                GroupName="optGroup" TabIndex="49" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>12<sup>th</sup> School Name
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txt12thSchoolName" runat="server" Width="150px"
                                                                MaxLength="50" onblur="ChangeCase(this);" TabIndex="50" />
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfv12SchoolName"
                                                                ControlToValidate="txt12thSchoolName" Text="Enter 12th School name" Display="Dynamic"
                                                                runat="server" SetFocusOnError="True" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="rev12thSchoolName" runat="server"
                                                                ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txt12thSchoolName"
                                                                ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True"></asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr valign="bottom">
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>Address of the School
                                                        </td>
                                                        <td align="left">
                                                            <asp:TextBox CssClass="TextStyle2013" ID="txtNameAddress" Rows="4" TextMode="multiline"
                                                                runat="server" Width="250px" MaxLength="200" onblur="ChangeCase(this);" TabIndex="51" />
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvNameAddress"
                                                                ControlToValidate="txtNameAddress" Text="Enter Address" Display="Dynamic" runat="server"
                                                                SetFocusOnError="True" />
                                                            <asp:RegularExpressionValidator ValidationGroup="vg" ID="revNameAddress" runat="server"
                                                                ErrorMessage="Special characters not allowed" ControlToValidate="txtNameAddress"
                                                                ValidationExpression="^[a-zA-Z0-9\s-_,/\\#&().]{1,100}$" SetFocusOnError="True"></asp:RegularExpressionValidator>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>District Of School
                                                        </td>
                                                        <td align="left">
                                                            <div id="divddl12District" runat="server">
                                                                <asp:DropDownList ID="ddl12District" runat="server" Width="150px" CssClass="TextStyle2013"
                                                                    AutoPostBack="true" OnSelectedIndexChanged="ddl12District_SelectedIndexChanged"
                                                                    TabIndex="52">
                                                                    <asp:ListItem Value="0">--Select--</asp:ListItem>
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
                                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                                </asp:DropDownList>
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvddl12District" SetFocusOnError="True"
                                                                    runat="server" ControlToValidate="ddl12District" ErrorMessage="Select District"
                                                                    InitialValue="0"></asp:RequiredFieldValidator>
                                                            </div>
                                                            <div id="divtxt12District" runat="server" visible="false">
                                                                <asp:TextBox ID="txt12District" runat="server" MaxLength="25" Width="150px" CssClass="TextStyle2013 uppercase marginTop"
                                                                    TabIndex="53"></asp:TextBox>&nbsp;
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfv12District" SetFocusOnError="True"
                                                                    runat="server" ControlToValidate="txt12District" ErrorMessage="Enter District"
                                                                    CssClass="Warning"></asp:RequiredFieldValidator>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>Month and Year of passing/passed in +2
                                                        </td>
                                                        <td align="left">
                                                            <asp:DropDownList CssClass="TextStyle2013" ID="ddlMonth1" runat="server" Width="50px"
                                                                TabIndex="54">
                                                                <%--<asp:ListItem Value="0">...</asp:ListItem>
                                                                    <asp:ListItem Value="Jan">Jan</asp:ListItem>
                                                                    <asp:ListItem Value="Feb">Feb</asp:ListItem>
                                                                    <asp:ListItem Value="Mar">Mar</asp:ListItem>
                                                                    <asp:ListItem Value="Apr">Apr</asp:ListItem>--%>
                                                                <asp:ListItem Value="May">May</asp:ListItem>
                                                                <%-- <asp:ListItem Value="Jun">Jun</asp:ListItem>
                                                                    <asp:ListItem Value="Jul">Jul</asp:ListItem>
                                                                    <asp:ListItem Value="Aug">Aug</asp:ListItem>
                                                                    <asp:ListItem Value="Sep">Sep</asp:ListItem>
                                                                    <asp:ListItem Value="Oct">Oct</asp:ListItem>
                                                                    <asp:ListItem Value="Nov">Nov</asp:ListItem>
                                                                    <asp:ListItem Value="Dec">Dec</asp:ListItem>--%>
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvMonth1"
                                                                ControlToValidate="ddlMonth1" InitialValue="0" Text="Select month" Display="Dynamic"
                                                                runat="server" />
                                                            <asp:DropDownList CssClass="TextStyle2013" ID="ddlYear1" runat="server" Width="60px"
                                                                TabIndex="55">
                                                                <%--<asp:ListItem Value="0">...</asp:ListItem>--%>
                                                                <asp:ListItem Value="2014">2014</asp:ListItem>
                                                                <%--  <asp:ListItem Value="2012">2012</asp:ListItem>
                                                                    <asp:ListItem Value="2011">2011</asp:ListItem>
                                                                    <asp:ListItem Value="2010">2010</asp:ListItem>
                                                                    <asp:ListItem Value="2009">2009</asp:ListItem>--%>
                                                                <%--  <asp:ListItem Value="2008">2008</asp:ListItem>
                                                                           <asp:ListItem Value="2007">2007</asp:ListItem>
                                                                            <asp:ListItem Value="2006">2006</asp:ListItem>
                                                                               <asp:ListItem Value="2005">2005</asp:ListItem>
                                                                                  <asp:ListItem Value="2004">2004</asp:ListItem>
                                                                                    <asp:ListItem Value="2003">2003</asp:ListItem>
                                                                                      <asp:ListItem Value="2002">2002</asp:ListItem>
                                                                                        <asp:ListItem Value="2001">2001</asp:ListItem>
                                                                                             <asp:ListItem Value="2000">2000</asp:ListItem>--%>
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvYear1"
                                                                ControlToValidate="ddlYear1" InitialValue="0" Text="Select year" Display="Dynamic"
                                                                runat="server" />
                                                        </td>
                                                    </tr>
                                                    <tr id="trMarks" runat="server" visible="false">
                                                        <td align="right" valign="top">
                                                            <asp:Label CssClass="LabelText" ID="lblMarks" Text="Academic year (2014-2015 or Before), Enter 12th Marks"
                                                                runat="server" Font-Bold="True"></asp:Label>
                                                        </td>
                                                        <td align="left" valign="middle">
                                                            <table width="100%" border="0" cellpadding="4" cellspacing="1" border="0" id="tblAppearing">
                                                                <tr valign="middle">
                                                                    <td width="25%">
                                                                        <asp:TextBox CssClass="TextStyle2013" ID="txtPhysics" onchange="fncCalculateCutoff(this.id)"
                                                                            MaxLength="3" runat="server" Width="50px" TabIndex="56"></asp:TextBox>
                                                                    </td>
                                                                    <td width="25%">
                                                                        <asp:TextBox CssClass="TextStyle2013" ID="txtChemistry" MaxLength="3" runat="server"
                                                                            onchange="fncCalculateCutoff(this.id)" Width="50px" TabIndex="57"></asp:TextBox>
                                                                    </td>
                                                                    <td width="25%">
                                                                        <asp:TextBox CssClass="TextStyle2013" ID="txtMaths" MaxLength="3" runat="server"
                                                                            onchange="fncCalculateCutoff(this.id)" Width="50px" TabIndex="58"></asp:TextBox>
                                                                    </td>
                                                                    <td width="25%" valign="top">
                                                                        <asp:TextBox CssClass="TextStyle2013" ID="txtTotalSub" MaxLength="4" runat="server"
                                                                            onchange="fncCalculateCutoff(this.id)" Width="50px" TabIndex="59" OnTextChanged="txtTotalSub_TextChanged"></asp:TextBox>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="LabelText">
                                                                        <asp:Label ID="lblPhysicsMarks" Text="" runat="server"></asp:Label>
                                                                    </td>
                                                                    <td class="LabelText">
                                                                        <asp:Label ID="lblChemistryMarks" Text="" runat="server"></asp:Label>
                                                                    </td>
                                                                    <td class="LabelText">
                                                                        <asp:Label ID="lblMathsMarks" Text="" runat="server"></asp:Label>
                                                                    </td>
                                                                    <td>
                                                                        <asp:Label ID="lblTotal" Text="" runat="server"></asp:Label>
                                                                    </td>
                                                                </tr>
                                                                <tr valign="middle">
                                                                    <td align="left">
                                                                        <asp:RangeValidator ID="rvPhysics" runat="server" MaximumValue="200" MinimumValue="0"
                                                                            Type="Integer" ControlToValidate="txtPhysics" ErrorMessage="Enter correct marks"
                                                                            CssClass="Warning" SetFocusOnError="True"></asp:RangeValidator><br />
                                                                        <asp:RegularExpressionValidator ID="revPhysics" ControlToValidate="txtPhysics" ErrorMessage="Enter number only"
                                                                            runat="server" ValidationExpression="[0-9]*" CssClass="Warning" SetFocusOnError="True"></asp:RegularExpressionValidator><br />
                                                                        <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="ReqtxtPhysics"
                                                                            ControlToValidate="txtPhysics" Text="Enter Physics Mark" Display="Dynamic" runat="server"
                                                                            SetFocusOnError="True" />
                                                                    </td>
                                                                    <td>
                                                                        <asp:RangeValidator ID="rvChemistry" runat="server" MaximumValue="200" MinimumValue="0"
                                                                            Type="Integer" ControlToValidate="txtChemistry" ErrorMessage="Enter correct marks"
                                                                            CssClass="Warning" SetFocusOnError="True"></asp:RangeValidator><br />
                                                                        <asp:RegularExpressionValidator ID="revChemistry" ControlToValidate="txtChemistry"
                                                                            ErrorMessage="Enter number only" runat="server" ValidationExpression="[0-9]*"
                                                                            CssClass="Warning" SetFocusOnError="True"></asp:RegularExpressionValidator><br />
                                                                        <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="ReqtxtChemistry"
                                                                            ControlToValidate="txtChemistry" Text="Enter Chemistry Mark" Display="Dynamic"
                                                                            runat="server" SetFocusOnError="True" />
                                                                    </td>
                                                                    <td>
                                                                        <asp:RangeValidator ID="rvMaths" runat="server" MaximumValue="200" MinimumValue="0"
                                                                            Type="Integer" ControlToValidate="txtMaths" ErrorMessage="Enter correct marks"
                                                                            CssClass="Warning" SetFocusOnError="True"></asp:RangeValidator><br />
                                                                        <asp:RegularExpressionValidator ID="revMaths" ControlToValidate="txtMaths" ErrorMessage="Enter number only"
                                                                            runat="server" ValidationExpression="[0-9]*" CssClass="Warning" SetFocusOnError="True"></asp:RegularExpressionValidator><br />
                                                                        <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="ReqtxtMaths"
                                                                            ControlToValidate="txtMaths" Text="Enter Maths Mark" Display="Dynamic" runat="server"
                                                                            SetFocusOnError="True" />
                                                                    </td>
                                                                    <td valign="top">
                                                                        <asp:RangeValidator ID="RantxtTotalSub" runat="server" MaximumValue="1200" MinimumValue="0"
                                                                            Type="Integer" ControlToValidate="txtTotalSub" ErrorMessage="Enter correct marks"
                                                                            CssClass="Warning" SetFocusOnError="True"></asp:RangeValidator><br />
                                                                        <asp:RegularExpressionValidator ID="RegtxtTotalSub" ControlToValidate="txtTotalSub"
                                                                            ErrorMessage="Enter number only" runat="server" ValidationExpression="[0-9]*"
                                                                            CssClass="Warning" SetFocusOnError="True"></asp:RegularExpressionValidator><br />
                                                                        <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="ReqtxtTotalSub"
                                                                            ControlToValidate="txtTotalSub" Text="Enter Total Mark" Display="Dynamic" runat="server"
                                                                            SetFocusOnError="True" />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr id="trPcm" runat="server" visible="false">
                                                        <td align="right" valign="top">
                                                        </td>
                                                        <td align="left" valign="middle">
                                                            <table width="70%">
                                                                <tr>
                                                                    <td width="10%">
                                                                        <span>PCM (%)</span>
                                                                    </td>
                                                                    <td width="20%">
                                                                        <asp:TextBox ID="txtPCMMark" runat="server" Enabled="false" CssClass="TextStyle2013"
                                                                            Width="50px">
                                                        
                                                                        </asp:TextBox>
                                                                    </td>
                                                                    <td width="10%">
                                                                        <span>Over All (%) </span>
                                                                    </td>
                                                                    <td width="20%">
                                                                        <asp:TextBox ID="txtTotalPercent" runat="server" Enabled="false" CssClass="TextStyle2013"
                                                                            Width="50px"></asp:TextBox>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right">
                                                            <font color="#FF0000">* </font>Medium of Instruction
                                                        </td>
                                                        <td align="left" width="43%">
                                                            <asp:DropDownList ID="ddlMedium" runat="server" Width="150" AutoPostBack="true" CssClass="TextStyle2013"
                                                                TabIndex="60" OnSelectedIndexChanged="ddlMedium_SelectedIndexChanged">
                                                                <asp:ListItem Value="0">...</asp:ListItem>
                                                                <asp:ListItem Value="English">English</asp:ListItem>
                                                                <asp:ListItem Value="Tamil">Tamil</asp:ListItem>
                                                                <asp:ListItem Value="Hindi">Hindi</asp:ListItem>
                                                                <asp:ListItem Value="Others">Others</asp:ListItem>
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvMedium" runat="server" ErrorMessage="Select Medium"
                                                                ControlToValidate="ddlMedium" Display="Dynamic" InitialValue="0" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                            <div id="divMedium" runat="server">
                                                                <asp:TextBox ID="txtMediumOthers" runat="server" CssClass="TextStyle2013 marginTop"
                                                                    MaxLength="50" TabIndex="61"></asp:TextBox>
                                                                <asp:RequiredFieldValidator ValidationGroup="vg" ID="rfvMediumOthers" Display="Dynamic"
                                                                    runat="server" ErrorMessage="Enter Medium" ControlToValidate="txtMediumOthers"
                                                                    SetFocusOnError="True"></asp:RequiredFieldValidator>
                                                            </div>
                                                        </td>
                                                    </tr>
                                        </td>
                                    </tr>
                                </table>
                                <%--</div>--%>
                            </td>
                        </tr>
                        <tr id="trOtherDetails">
                            <td>
                                <span class="BlueHead">Other Details</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div id="DivOtherDetails" style="border: solid 1px #7db9e8; width: 100%; padding: 10px;
                                    min-height: 100px; height: auto; float: left;">
                                    <table width="100%" cellpadding="4" cellspacing="1" border="0">
                                        <tr>
                                            <td width="32%" align="right">
                                                <font color="#FF0000">* </font>Have you applied for AIEEE/JEE?
                                            </td>
                                            <td width="68%" align="left">
                                                <asp:DropDownList CssClass="TextStyle2013" ID="ddlAIEE" runat="server" Width="150px"
                                                    TabIndex="62">
                                                    <asp:ListItem Value="0">...</asp:ListItem>
                                                    <asp:ListItem Value="Yes">Yes</asp:ListItem>
                                                    <asp:ListItem Value="No">No</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvAIEE"
                                                    ControlToValidate="ddlAIEE" SetFocusOnError="True" InitialValue="0" Text="Select Whether apply for AIEE"
                                                    Display="Dynamic" runat="server" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right">
                                                <font color="#FF0000">* </font>Extra Curricular Activities if any
                                            </td>
                                            <td align="left">
                                                <asp:DropDownList CssClass="TextStyle2013" ID="ddlCurricular" runat="server" Width="150px"
                                                    AutoPostBack="true" TabIndex="63" OnSelectedIndexChanged="ddlCurricular_SelectedIndexChanged">
                                                    <asp:ListItem Value="0">...</asp:ListItem>
                                                    <asp:ListItem Value="Sports">Sports</asp:ListItem>
                                                    <asp:ListItem Value="NCC/NSS">NCC/NSS</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvCurricular"
                                                    ControlToValidate="ddlCurricular" InitialValue="0" Text="Select Curricular" Display="Dynamic"
                                                    runat="server" SetFocusOnError="True" />
                                                <div id="Divcurricular" runat="server">
                                                    <asp:TextBox ID="txtCurricular" runat="server" CssClass="TextStyle2013 marginTop"
                                                        TabIndex="64"></asp:TextBox>
                                                    <asp:RegularExpressionValidator ValidationGroup="vg" ID="reotherCurricular" runat="server"
                                                        Display="Dynamic" ErrorMessage="Numeric,Special characters not allowed" ControlToValidate="txtCurricular"
                                                        ValidationExpression="^[a-zA-Z\s-.]{1,50}$" SetFocusOnError="True">
                                                    </asp:RegularExpressionValidator>
                                                    <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvCurricularOthers"
                                                        ControlToValidate="txtCurricular" Text="Enter Curricular" Display="Dynamic" runat="server"
                                                        SetFocusOnError="True" />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right">
                                                <font color="#FF0000">* </font>Any Siblings Studing in Sai Ram Group of Institution.
                                                only Blood Brothers/Sisters
                                            </td>
                                            <td align="left">
                                                <asp:DropDownList CssClass="TextStyle2013" ID="ddlBloodRel" runat="server" Width="150px"
                                                    TabIndex="65">
                                                    <asp:ListItem Value="0">...</asp:ListItem>
                                                    <asp:ListItem Value="Yes">Yes</asp:ListItem>
                                                    <asp:ListItem Value="No">No</asp:ListItem>
                                                </asp:DropDownList>
                                                <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvBloodRel"
                                                    ControlToValidate="ddlBloodRel" InitialValue="0" Text="Select Blood Relation"
                                                    Display="Dynamic" runat="server" SetFocusOnError="True" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right" valign="top">
                                                <font color="#FF0000">* </font>How you came to know about us?
                                            </td>
                                            <td align="left">
                                                <asp:CheckBoxList ID="ddlAd" runat="server" AutoPostBack="true" TabIndex="66" RepeatDirection="Horizontal"
                                                    RepeatLayout="Table" CssClass="checkAds" OnSelectedIndexChanged="ddlAd_SelectedIndexChanged">
                                                    <asp:ListItem Value="Website">Website</asp:ListItem>
                                                    <asp:ListItem Value="News Paper">News Paper</asp:ListItem>
                                                    <asp:ListItem Value="Word of Mouth">Word of Mouth</asp:ListItem>
                                                    <asp:ListItem Value="Others">Others</asp:ListItem>
                                                </asp:CheckBoxList>
                                                <asp:CustomValidator ID="cvddlAd" runat="server" ErrorMessage="select How you came to know about us"
                                                    ClientValidationFunction="ValidateCheckBox" SetFocusOnError="true" Display="Dynamic"
                                                    OnServerValidate="cvddlAd_ServerValidate"></asp:CustomValidator><br />
                                                <div id="DivAd" runat="server">
                                                    <asp:TextBox ID="txtAd" runat="server" sCssClass="TextStyle2013" MaxLength="50" TabIndex="67"></asp:TextBox>
                                                    <asp:RequiredFieldValidator ValidationGroup="vg" CssClass="Warning" ID="rfvAdOthers"
                                                        ControlToValidate="txtAd" Text="Enter Ad" Display="Dynamic" runat="server" SetFocusOnError="True" />
                                                    <asp:RegularExpressionValidator ValidationGroup="vg" ID="reAd" runat="server" ErrorMessage="Numeric,Special characters not allowed"
                                                        ControlToValidate="txtAd" ValidationExpression="^[a-zA-Z\s-.]{1,50}$" Display="Dynamic"
                                                        SetFocusOnError="True">
                                                    </asp:RegularExpressionValidator>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="float: right;">
                                                Photo :
                                            </td>
                                            <td>
                                                <div class="marginTop">
                                                    <img id="imgDisplay" alt="Photo" src="/Engineering_UG/image/white.png" runat="server"
                                                        style="height: 354px; height: 247px;" />
                                                </div>
                                            </td>
                                        </tr>
                                        <%-- <asp:UpdatePanel runat="server" ID="upupload">
                                            <ContentTemplate>
                                                <tr>
                                                    <td valign="top">
                                                        <font color="#FF0000">* </font>Upload your Photo 
                                                 <div class="notibar msginfo" style="height:auto;">
                                                <p> <span>Image upload instructions</span>
                                                <br />
                                                 # Image Size should be 3.5 X 4.5 cms
                                                 <br />
                                                 # Only png,jpg and jpeg images are allowed
                                                <br />
                                                1) Browse file. 
                                                 <br />
                                                2) Upload the file using "upload" button.
                                                 <br />
                                                3) Select area on the image using mouse.
                                                 <br />
                                                4) Click crop button to crop the selected area. <br />
                                                5) If you want to re-crop the image click undo crop. 
                                                </p>
                                               
                                                  </div>
                                                    </td>
                                                    <td>
                                                        <asp:Label runat="server" ID="lblImageError" Style="color: Red"></asp:Label>
                                                  
                                                       
                                                        <Anders:ImageCropper ID="crop" MaintainAspectRatio="false" CaptureKeys="false" CropEnabled="true"
                                                            CroppedImageHeight="276" CroppedImageWidth="354" JpegQuality="100" AlternateText="Crop image"
                                                            runat="server" />
                                                        <div>
                                                           <asp:Button ID="btnUpload" Text="Upload" OnClick="UploadClick" runat="server" CausesValidation="false" />
                                                            <asp:Button ID="btnCrop" Text="Crop" OnClick="CropClick" runat="server" CausesValidation="false" />
                                                            <asp:Button ID="btnUndo" Text="Undo Crop" OnClick="UndoClick" runat="server" CausesValidation="false" />
                                                           
                                                        </div>
                                                   
                                            </ContentTemplate>
                                            <Triggers>
                                                <asp:PostBackTrigger ControlID="btnUpload" />
                                                <asp:PostBackTrigger ControlID="btnCrop" />
                                                <asp:PostBackTrigger ControlID="btnUndo" />
                                               
                                            </Triggers>
                                        </asp:UpdatePanel>--%>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" colspan="2">
                                <asp:Button CssClass="RegBtn" ID="btnSubmit" runat="server" Text="Submit & Proceed to Print"
                                    CausesValidation="true" ValidationGroup="vg" OnClick="btnSubmit_Click" TabIndex="68" />
                                <asp:Button CssClass="RegBtn" ID="btnReset" Text="Reset" CausesValidation="false"
                                    runat="server" OnClick="btnReset_Click" OnClientClick="window.location.href=window.location.href"
                                    TabIndex="69" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="Clr">
            </div>
            <div id="FooterArea">
                <div id="Footer">
                    <div id="LftBtm">
                    </div>
                    <div id="BtmCurve">
                    </div>
                    <div id="RgtBtm">
                    </div>
                    <div class="Clr">
                    </div>
                    <div id="BtmLink">
                        <div class="Btm" style="float: left; margin-top: 15px; width: 30%;">
                            ©
                            <%=Session["AdYearCode"]%>
                            Sai Ram Group. All Rights Reserved.</div>
                        <div class="Btm" style="float: left; margin-top: 14px; width: 50%;">
                            <a href="../index.html" title="Home">Home</a> | <a href="http://www.sairamgroup.in/About.html"
                                title="About us">About us</a> | <a href="../Groups.html" title="Institutions">Institutions</a>
                            | <a href="http://www.sairamgroup.in/Admission.html" title="Admission">Admission</a>
                            | <a href="#">Gallery</a> | <a href="http://www.sairamgroup.in/Companies.html" title="Companies">
                                Companies</a> | <a href="http://www.sairamgroup.in/Contact.html" title="Contact Us">
                                    Contact Us</a></div>
                        <div align="right" style="float: left; margin-top: 5px; width: 20%;">
                            <a href="http://www.itech-india.com" target="_blank">
                                <img src="image/iTechLogo.jpg" title="iTech India Private Limited" alt="iTech India Private Limited"
                                    width="77" height="35" border="0" /></a></div>
                    </div>
                    <!-- End of id="BtmLink" -->
                </div>
                <!-- End of id="Footer" -->
            </div>
        </ContentTemplate>
        <Triggers>
            <asp:PostBackTrigger ControlID="btnSubmit" />
        </Triggers>
    </asp:UpdatePanel>
    </form>
</body>
</html>
