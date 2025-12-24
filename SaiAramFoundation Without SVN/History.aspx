<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="History.aspx.cs" Inherits="SaiAramFoundation.History" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Aram Foundation</title>
    <style type="text/css">
        body
        {
            font-family: Verdana;
            font-size: 12px;
        }
        .gridView
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
            width: 1000px;
        }
        .gridHeader
        {
            font-family: verdana, arial, tahoma;
            font-size: 8pt;
            color: #FFFFFF;
            background-color: #1760A5;
            height: 20px;
            padding-left: 12px;
        }
        .gridFooter
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
        }
        .gridContent
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
            vertical-align: baseline;
        }
        .gridAltContent
        {
            font-family: verdana, arial, tahoma;
            font-size: 12px;
            background-color: #CED8F6;
        }
        .graylink
        {
            font-family: Verdana, Tahoma, Arial;
            font-size: 12px;
            font-weight: normal;
            color: #333333;
            text-decoration: none;
        }
        .DetailsHeader
        {
            font-family: verdana, arial, tahoma;
            font-size: 8pt;
            color: #FFFFFF;
            background-color: #333333;
            height: 20px;
            padding-left: 12px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <br />
        <asp:Label ID="lblHeading" runat="server" Text="" ForeColor="Maroon" Font-Bold="true"></asp:Label>
        <br />
        <br />
        <asp:GridView ID="gvHistory" runat="server" AutoGenerateColumns="False" CssClass="gridView"
            Width="90%">
            <RowStyle CssClass="gridContent" />
            <Columns>
                <asp:TemplateField HeaderText="S.No">
                    <ItemTemplate>
                        <%#Container.DataItemIndex + 1 %>
                    </ItemTemplate>
                    <ItemStyle HorizontalAlign="Center" />
                </asp:TemplateField>
                <%--<asp:TemplateField HeaderText="Application No.">
                    <ItemTemplate>
                        <asp:Label ID="lblApplnNo" runat="server" Text='<%#Eval("APPLN_NO") %>'></asp:Label>
                    </ItemTemplate>
                </asp:TemplateField>--%>
                <asp:TemplateField HeaderText="Action">
                    <ItemTemplate>
                        <asp:Label ID="lblAction" runat="server" Text='<%#Eval("ACTION") %>'></asp:Label>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Process Undergone">
                    <ItemTemplate>
                        <asp:Label ID="lblProcess" runat="server" Text='<%#Eval("PROCESS") %>'></asp:Label>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Handled by">
                    <ItemTemplate>
                        <asp:Label ID="lblWorkby" runat="server" Text='<%#Eval("USER_ID") %>'></asp:Label>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Handled Date">
                    <ItemTemplate>
                        <asp:Label ID="lblDate" runat="server" Text='<%#Eval("Data_Date", "{0:dd/MM/yyyy hh:mm:ss tt}") %>'></asp:Label>
                    </ItemTemplate>
                </asp:TemplateField>
            </Columns>
            <HeaderStyle CssClass="gridHeader" />
            <AlternatingRowStyle CssClass="gridAltContent" />
        </asp:GridView>
        <br />
        <asp:Label ID="lblError" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
    </div>
    </form>
</body>
</html>
