<%@ Page Language="C#"  AutoEventWireup="true"
    CodeBehind="success.aspx.cs" Inherits="SaiAramFoundation.success" Title="Sai Aram Foundation" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Success Page</title>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600'
        rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="../bcss/bootstrap.min.css" />
    <link href="../bcss/custom.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <!--header area-->
    <div class="header">
        <div class="container">
            <div class="row">
                 <div class="col-md-1">
                    <img src="../images/logo-aram.png" width="80" />
                </div>
                <div class="col-md-10">
                    <h1 class="logo-name">
                        <span>LEO MUTHU Scholarship</span></h1>                 
                </div>
            </div>
        </div>
    </div>
    <!--header area-->
    <div class="container ">
        <div class="form-holder">
            <div class="row">
                <div class="col-md-12">
             
                <h1 class="success-title">Your registration is successful.</h1>
                <hr />                
                <h3 ID="tdClick" runat="server" class="success-link"></h3>
                    <h3 ID="tdNewRegister" runat="server" class="success-link"><a href="ScholarshipRegistration.aspx">Click Here</a> for new registration.</h3>
                <h2 class="success-msg">If you wish to share this information on facebook, please use the below link.</h2>
               <iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fadmission.sairamgroup.in%2F&width=450&layout=standard&action=recommend&show_faces=true&share=true&height=80"
                        scrolling="no" frameborder="0" style="display:block;margin:0px auto;border: none; overflow: hidden; width: 450px;margin-bottom:20px;"
                        height: 80px;" allowtransparency="true"></iframe>
 


                </div>
            </div>
        </div>
    </div>
</body>
</html>












