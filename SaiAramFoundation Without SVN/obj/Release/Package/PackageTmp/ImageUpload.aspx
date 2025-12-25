<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ImageUpload.aspx.cs" Inherits="SaiAramFoundation.ImageUpload"
    EnableEventValidation="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Image upload</title>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    <link rel="stylesheet" type="text/css" href="CSS/SaiGroup.css" />
    <link href="CSS/Registration.css" rel="stylesheet" type="text/css" />
    <link href="Jcrop/jquery.Jcrop.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js"></script>

    <script src="Jcrop/jquery.Jcrop.js" type="text/javascript"></script>

    <script type="text/javascript">

        jQuery(document).ready(function() {

            jQuery('#imgCrop').Jcrop({
                setSelect: [0, 0, 276, 354],
                onSelect: storeCoords

            });

        });



        function storeCoords(c) {

            jQuery('#X').val(c.x);

            jQuery('#Y').val(c.y);

            jQuery('#W').val(c.w);

            jQuery('#H').val(c.h);

        };

 

    </script>

    <script type="text/javascript">
        function undo() {

            var JcropAPI = $('#imgCrop').data('Jcrop');
            JcropAPI.destroy();
        }
        function Button1_onclick() {

        }

    </script>

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
            filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#00c6ff', EndColorStr='#018eb6');
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
            filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#f3f3f3', EndColorStr='#dddddd');
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
        #image_upload
        {
            width: 980px;
            margin: 0 auto;
            min-height: 500px;
            padding: 10px;
            border: 1px solid #ccc;
            box-shadow: 1px 1px 5px navy;
            margin-top: 10px;
        }
        #imgCrop
        {
            max-width: 100%;
            max-height: 100%;
        }
    </style>
    <style type="text/css">
        #informationbar
        {
            background: url("/images/notifications.png") no-repeat scroll 0 -160px #D1E4F3;
            position: relative;
            left: 0;
            width: 100%;
            line-height: 30px;
            height: 30px;
            text-indent: 5px;
            padding: 5px 0;
            padding-left: 50px;
            font: 12px Tahoma;
            color: red;
        }
        * html #informationbar
        {
            /*IE6 hack*/
            position: absolute;
            width: expression(document.compatMode=="CSS1Compat"? document.documentElement.clientWidth+"px" : body.clientWidth+"px");
        }
        .skip a
        {
            font-size: 13px;
            font-weight: bold;
            text-decoration: underline;
            color: #003399;
        }
        .skip a:hover
        {
            color: #CC0000 !important;
        }
        .skip a:visited
        {
            color: #003399;
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
            infobar.setContent('Dear Visitor,Please use Mozilla Firefox for better user experiance. To download the latest Mozilla Firefox. <a href="javascript:sendRequest(\'http://www.mozilla.org/en-US/firefox/new\',\'Mozilla Firefox\')">click here</a>...');
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

    <%--  <div  id="informationbar" ><div style="width: 14px;  height: 14px; float: right; border: 0; margin-right: 5px"></div></div>--%>
    <form id="form1" runat="server">
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
    <div id="image_upload">
        <div id="Brudcurms" class="Brud">
            <a href="http://www.sairamgroup.in/index.html">Home</a> » Sai Aram Foundation - Online Registration 
            <%=Session["AdYearCode"]%>
        </div>
        <div id="Tittle" class="Tittle">
            <span style="color: #003399; font-size: 12pt; font-weight: bold;" id="lblUserName">Welcome
                to Sairam Group..</span>
        </div>
        <div align="center">
            <span class="Tittle">Sai Aram Foundation - Online Registration 
                <%=Session["AdYearName"]%>)</span>
            <div>
                Image Upload</div>
        </div>
        <%-- <div>
                <div>Admissions 2013 </div>
                <div>Image Upload</div>
                </div>--%>
        <div>
            <font color="#FF0000">* </font>Upload your Photo
            <div align="left" style="height: auto;" class="notibar msginfo">
                <p>
                    <span>Image upload instructions</span>
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
                    4) Click crop button to crop the selected area.
                    <br />
                    5) If you want to re-crop the image click Reset button.
                </p>
            </div>
        </div>
        <asp:panel id="pnlUpload" runat="server">
            <asp:fileupload id="Upload" runat="server" />
            <br />
            <asp:button id="btnUpload" runat="server" onclick="btnUpload_Click" text="Upload" />
            <%--<div><input type="button" value="Reset" onclick="window.location.href=window.location.href" /></div>--%>
            <asp:label id="lblError" runat="server" visible="false" />
        </asp:panel>
        <asp:panel id="pnlCrop" runat="server" visible="false">
            <asp:image id="imgCrop" runat="server" />
            <br />
            <asp:hiddenfield id="X" runat="server" />
            <asp:hiddenfield id="Y" runat="server" />
            <asp:hiddenfield id="W" runat="server" />
            <asp:hiddenfield id="H" runat="server" />
            <asp:button id="btnCrop" runat="server" text="Crop" onclick="btnCrop_Click" />
        </asp:panel>
        <asp:panel id="pnlCropped" runat="server" visible="false">
            <asp:image id="imgCropped" runat="server" height="354px" width="247px" />
        </asp:panel>
        <asp:panel id="pnlProceed" runat="server" visible="false">
            <asp:button id="btnContinue" runat="server" onclick="btnContinue_Click" text="Proceed to Registration" />
        </asp:panel>
        <div>
            <input type="button" value="Reset" onclick="window.location.href=window.location.href" />
        </div>
        <!--          <div class="skip"> if you find any difficulties in uploading image you can  <asp:HyperLink ID="hl" runat="server" NavigateUrl="~/Admission13/RG_Admission_New.aspx?s=skp">skip</asp:HyperLink></div> -->
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
                    <a href="http://www.sairamgroup.in" title="Home">Home</a> | <a href="http://www.sairamgroup.in/About.html"
                        title="About us">About us</a> | <a href="http://www.sairamgroup.in/Groups.html" title="Institutions">
                            Institutions</a> | <a href="http://www.sairamgroup.in/Admission.html" title="Admission">
                                Admission</a> | <a href="#">Gallery</a> | <a href="http://www.sairamgroup.in/Companies.html"
                                    title="Companies">Companies</a> | <a href="http://www.sairamgroup.in/Contact.html"
                                        title="Contact Us">Contact Us</a></div>
                <div align="right" style="float: left; margin-top: 5px; width: 20%;">
                    <a href="http://www.itech-india.com" target="_blank">
                        <img src="images/iTechLogo.jpg" title="iTech India Private Limited" alt="iTech India Private Limited"
                            width="77" height="35" border="0" /></a></div>
            </div>
            <!-- End of id="BtmLink" -->
        </div>
        <!-- End of id="Footer" -->
    </div>
    </form>
</body>
</html>
