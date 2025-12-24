<%@ Page Title="" Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs"
    Inherits="SaiAramFoundation.Login" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Aram Foundation Login Form</title>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600'
        rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="bcss/bootstrap.min.css" />
    <link href="bcss/custom.css" rel="stylesheet" type="text/css" />
</head>     
<body>
    <!--header area-->
    <div class="header">
        <div class="container">
            <div class="row">
                <div class="col-md-1">
                    <img src="~/../images/logo-aram.png" width="80" />
                </div>
                <div class="col-md-10">
                    <h1 class="logo-name">
                        <span>LEO MUTHU Scholarship</span></h1>
                    <h5 align="right">
                        An Initiative of ARAM Foundation</h5>
                </div>
            </div>
        </div>
    </div>
    <!--header area-->
    <div class="container ">
        <div class="form-holder">
            <form id="Form1" class="form-signin" role="form" runat="server">
            <h2 class="form-signin-heading">
                Login</h2>
            <asp:TextBox ID="txtUserName" runat="server" CssClass="form-control" placeholder="User name">
            </asp:TextBox>
            <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator3" ControlToValidate="txtUserName"
                Text="Enter user name" runat="server" />
            <asp:TextBox ID="txtPassword" runat="server" CssClass="form-control" placeholder="Password"
                TextMode="Password"></asp:TextBox>
            <asp:RequiredFieldValidator SetFocusOnError="True" ID="RequiredFieldValidator4" ControlToValidate="txtPassword"
                Text="Enter password" runat="server" />
            <%--<label class="checkbox">
          <input type="checkbox" value="remember-me"> Remember me
        </label>--%>
            <span>
                <asp:Label ID="lblError" runat="server" Text="" Style="color: Red"></asp:Label>
            </span>
             
            <asp:Button ID="btnSubmit" runat="server" Text="Sign in" OnClick="btnSubmit_Click"
                CssClass="btn btn-lg btn-primary btn-block" />
                
                <asp:HyperLink ID="lnkForget" class="inline1" NavigateUrl="ForgetPassoword.aspx"
                            runat="server" Text="<< Forgot Password ?"></asp:HyperLink> 
            </form> 
        </div>
    </div>
</body>
</html>
