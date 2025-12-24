<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="imagecrop.aspx.cs" Inherits="SaiAramFoundation.imagecrop" %>

<%--<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>

    <script src="../JS/jquery-1.7.1.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        function changeimage(imgname) {
            $(".jcrop-holder div div img").attr("src", "");
            $(".jcrop-holder img").attr("src", "");
            $(".jcrop-holder div div img").attr("src", imgname);
            $(".jcrop-holder img").attr("src", imgname);
        }
    </script>
    <script type="text/javascript">
        function uploadStarted() {
            $get("imgDisplay").style.display = "none";
        }
        function uploadComplete(sender, args) {
            var imgDisplay = $get("imgDisplay");
            var imgCrop = $get("imgCrop");
            imgDisplay.src = "images/loader.gif";
            imgDisplay.style.cssText = "";
            var img = new Image();
            img.onload = function() {
                imgDisplay.style.cssText = "height:100px;width:100px";
                imgDisplay.src = img.src;
                imgCrop.style.cssText = "height:400px;width:400px";
                imgCrop.src = img.src;
            };
            img.src = "tempImage/" + args.get_fileName();
            var filename = "tempImage/" + args.get_fileName();
//       
            changeimage(filename);
        }
        function ChangeCase(elem) {
            elem.value = elem.value.toUpperCase();
        }
    </script>
</head>

<body>
    <form id="form1" runat="server">
     <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </asp:ToolkitScriptManager>
   
    <asp:updatepanel ID="Updatepanel1" runat="server" EnableViewState="true" UpdateMode="Conditional">
    <ContentTemplate>
   <asp:AsyncFileUpload OnClientUploadComplete="uploadComplete" runat="server" ID="afuImage"
                                                                        Width="250px" UploaderStyle="Modern" CompleteBackColor="White" UploadingBackColor="#CCFFFF"
                                                                        ThrobberID="imgLoader" OnUploadedComplete="FileUploadComplete" OnClientUploadStarted="uploadStarted" />
                                                                  
                                                                   
    </div>
    
     <div>
        <h3>Basic example</h3>
        <asp:Image ID="imgDisplay" runat="server" ImageUrl="~/images/no_photo.jpg" /> <br />
    
         
  <br />
        
        <asp:Button ID="Button1" runat="server" Text="Crop" onclick="btnCrop_Click" />

        <h3>The result</h3>

        <asp:Image ID="Result" runat="server" Visible="false"/> 
    </div>
   
    </ContentTemplate>
    <Triggers>
   

    <asp:AsyncPostBackTrigger ControlID="Button1" EventName="click" />
    </Triggers>
    </asp:updatepanel>
    </form>
</body>
</html>--%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head id="Head1" runat="server">

  <title></title>

 <link href="css/jquery.Jcrop.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js"></script>
<script type="text/javascript" src="script/jquery.Jcrop.pack.js"></script>
<script type="text/javascript">

    jQuery(document).ready(function() {

        jQuery('#imgCrop').Jcrop({

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
</head>

<body>

  <form id="form1" runat="server">

  <div>

    <asp:Panel ID="pnlUpload" runat="server">

      <asp:FileUpload ID="Upload" runat="server" />

      <br />

      <asp:Button ID="btnUpload" runat="server" OnClick="btnUpload_Click" Text="Upload" />

      <asp:Label ID="lblError" runat="server" Visible="false" />

    </asp:Panel>

    <asp:Panel ID="pnlCrop" runat="server" Visible="false">

      <asp:Image ID="imgCrop" runat="server" />

      <br />

      <asp:HiddenField ID="X" runat="server" />

      <asp:HiddenField ID="Y" runat="server" />

      <asp:HiddenField ID="W" runat="server" />

      <asp:HiddenField ID="H" runat="server" />

      <asp:Button ID="btnCrop" runat="server" Text="Crop" OnClick="btnCrop_Click" />

    </asp:Panel>

    <asp:Panel ID="pnlCropped" runat="server" Visible="false">

      <asp:Image ID="imgCropped" runat="server" />

    </asp:Panel>

  </div>

  </form>
</body>
</html>
