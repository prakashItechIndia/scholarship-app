<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AjaxAdminPanelProcess.aspx.cs"
    Inherits="SaiAramFoundation.AjaxAdminPanelProcess" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        TBODY > TR > TD.cssRegistered
        {
            background-color: #006DCC;
            color: White;
        }
        TBODY > TR > TD.cssAllocated
        {
            background-color: #79389C;
            color: White;
        }
        TBODY > TR > TD.cssCancelled
        {
            background-color: #999999;
            color: White;
        }
        TBODY > TR > TD.cssSelected
        {
            background-color: #5BB75B;
            color: White;
        }
        TBODY > TR > TD.cssRejected
        {
            background-color: #B94A48;
            color: White;
        }
        TBODY > TR > TD.cssWaiting
        {
            background-color: #F89406;
            color: White;
        }
        TBODY > TR > TD.cssEnquired
        {
            background-color: #0E415C;
            color: White;
        }
        </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:Label ID="lblError" runat="server"></asp:Label>
    </div>
    <div id="dvStatusRow" runat="server" visible="false">
        <asp:Label ID="lblCntRegistered" Font-Size="13pt" ForeColor="#006DCC" runat="server"
            Text=""></asp:Label>
        <asp:Label ID="lblCntApproved" Font-Size="13pt" ForeColor="#49AFCD" runat="server"
            Text=""></asp:Label>
        <asp:Label ID="lblCntWaiting" Font-Size="13pt" ForeColor="#F89406" runat="server"
            Text=""></asp:Label>
        <asp:Label ID="lblCntCompleted" Font-Size="13pt" ForeColor="#5BB75B" runat="server"
            Text=""></asp:Label>
        <asp:Label ID="lblCntRejected" Font-Size="13pt" ForeColor="#B94A48" runat="server"
            Text=""></asp:Label>
             <asp:Label ID="lblRejected" Font-Size="13pt" ForeColor="#0E415C" runat="server"
            Text=""></asp:Label>
    </div>
    <div id="gridView">
        <asp:GridView ID="gvDisplayScholarship" runat="server" AutoGenerateColumns="False"
            AllowPaging="False" OnRowDataBound="gvDisplayScholarship_RowDataBound" CssClass="table table-condensed">
            <RowStyle />
            <PagerSettings Position="TopAndBottom" />
            <Columns>
                <asp:TemplateField HeaderText="S.No" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <%#Container.DataItemIndex+1 %>
                    </ItemTemplate>
                    <ItemStyle Width="0px"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Application No." ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:HyperLink ID="lnkApplnNo" CssClass="graylink" NavigateUrl='<%#"Registered_Pdf_ScholerShip/" + Eval("Application_Id") + ".pdf" %>'
                            Target="_blank" runat="server" Text='<%#Eval("Application_Id") %>'></asp:HyperLink>
                    </ItemTemplate>
                    <ItemStyle Width="100px"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Student Name" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lblApplicant_Name" runat="server" Text='<%#Eval("Applicant_Name") %>'></asp:Label>
                        <asp:HiddenField ID="hdAadhaarId" runat="server" Value='<%#Eval("Aadhaar_ID") %>' />
                          <asp:HiddenField ID="hdPanId" runat="server" Value='<%#Eval("Pan_ID") %>' />
                    </ItemTemplate>
                    <ItemStyle Width="150px" HorizontalAlign="Left"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Class Studying" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lbClass_Studying" runat="server" Text='<%#Eval("Class_Studying") %>'></asp:Label>
                    </ItemTemplate>
                    <ItemStyle Width="150px"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Institution Name" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lblInstitution_Name" runat="server" Text='<%#Eval("Institution_Name") %>'></asp:Label>
                    </ItemTemplate>
                    <ItemStyle Width="50px"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Father AnnualIncome" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lblParent_AnnualIncome" runat="server" Text='<%#Eval("Father_AnnualIncome") %>'></asp:Label>
                    </ItemTemplate>
                    <ItemStyle Width="50px"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Mobile Number" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lblMobile_Number" runat="server" Text='<%#Eval("Mobile_Number") %>'></asp:Label>
                    </ItemTemplate>
                    <ItemStyle Width="100px"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Father Occupation" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lblFather_Occupation" runat="server" Text='<%#Eval("Father_Occupation") %>'></asp:Label>
                    </ItemTemplate>
                    <ItemStyle Width="80px"></ItemStyle>
                </asp:TemplateField>
                 <asp:TemplateField HeaderText="Cheque Number" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lblChequeNumber" runat="server" Text='<%#Eval("DDCheque_No") %>'></asp:Label>
                        
                    </ItemTemplate>
                    <ItemStyle></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Status" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lblStatus" runat="server" Text='<%#Eval("Status") %>'></asp:Label>
                        <asp:Label ID="lblScholarReject" runat="server" Text='<%#Eval("Scholar_Reject") %>'></asp:Label>
                    </ItemTemplate>
                    <ItemStyle></ItemStyle>
                </asp:TemplateField>
              
                <asp:TemplateField HeaderText="Process" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:HyperLink ID="lnkSuggest" class="inline1" NavigateUrl='<%#"ScholarshipSuggest.aspx?applnno=" + Eval("Application_Id")+ "&scholarshipId=" +Eval("SuggestScholarshipId") %>'
                            runat="server" Text='<%#Eval("SuggestText") %>' Visible='<%#Convert.ToBoolean(Eval("SuggestLinkEnable")) %>'>
                        </asp:HyperLink>                        

                        <%--   <asp:TextBox ID="txtScholarshipId" Visible="false" runat="server" Value ='<%# Eval("SuggestScholarshipId") %>'></asp:TextBox>--%>

                        <asp:Label ID="lblSuggested" runat="server" Text="Suggested" style="font-weight: bold;color:#d26e3e;font-size: 15px;" Visible='<%#Convert.ToBoolean(Eval("lblSuggested")) %>'></asp:Label>
                        <asp:Label ID="lblReject" runat="server" Text="Rejected" style="font-weight: bold;color:#F80606;font-size: 15px;" Visible='<%#Convert.ToBoolean(Eval("lblReject")) %>'></asp:Label>
                        <asp:Label ID="lblCompleted" runat="server" Text="---" Visible='<%#Convert.ToBoolean(Eval("lblCompleted")) %>'></asp:Label>
                    </ItemTemplate>
                    <ItemStyle Width="80px"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="History" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:HyperLink ID="lnkViewHistory" class="inline1" NavigateUrl='<%#"History.aspx?applnno=" + Eval("Application_Id") %>'
                            runat="server" Text="View History"></asp:HyperLink>
                    </ItemTemplate>
                    <ItemStyle></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="View Docs" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:HyperLink ID="lnkViewDocs" Target="_blank" NavigateUrl='<%#"viewdocs.aspx?applnno=" + Eval("Application_Id") %>'
                            runat="server" Text="View Docs"></asp:HyperLink>
                    </ItemTemplate>
                    <ItemStyle Width="140px"></ItemStyle>
                </asp:TemplateField>
                  <asp:TemplateField HeaderText="Sch" ItemStyle-HorizontalAlign="Center">
                    <ItemTemplate>
                        <asp:Label ID="lblSchId" runat="server" Text='<%#Eval("Scholarship_Id") %>'></asp:Label>
                    </ItemTemplate>
                    <ItemStyle Width="50px"></ItemStyle>
                </asp:TemplateField>
            </Columns>
            <PagerStyle CssClass="pagination" HorizontalAlign="Right" />
            <HeaderStyle CssClass="gridHeader" />
            <AlternatingRowStyle CssClass="gridAltContent" />
        </asp:GridView>

        <div id="dvVerify" runat="server" visible="false">
                <table width="100%" border="0" cellspacing="1" cellpadding="4" style="background: #CCC">
                    <tr bgcolor="#DCDCDC">
                        <td colspan="4" align="center">
                            <span style="font-weight: bold">Previous Scholarship History</span>
                        </td>
                    </tr>
                       <tr bgcolor="#FFF">
                        <td align="right">
                            <span>Application No :</span>
                        </td>
                        <td >
                            <asp:Label ID="lblAppNo" runat="server" Style="font-weight: bold;"></asp:Label>
                        </td>

                            <td align="right">
                            <span>Student Name :</span>
                        </td>
                        <td >
                            <asp:Label ID="lblName" runat="server" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFF">
                        <td colspan="1" align="right">
                            <span>Already Applied :</span>
                        </td>
                        <td colspan="3">
                            <asp:Label ID="lblAlreadyApplied" runat="server" Style="font-weight: bold;"></asp:Label>
                        </td>
                    </tr>
                    <tr bgcolor="#FFF">
                        <td colspan="1" align="right">
                            <span>Already Scholarship Issued :</span>
                        </td>
                        <td colspan="3">
                            <asp:GridView ID="gvDisplayPreviousScholarshipDetails" runat="server" AutoGenerateColumns="False"
                                AllowPaging="False" CssClass="table table-condensed" EmptyDataText="No previous scholarship history available" EmptyDataRowStyle-Font-Italic="true" >
                                <RowStyle />
                                <PagerSettings Position="TopAndBottom" />
                                <Columns>
                                    <asp:TemplateField HeaderText="ScholarshipYear" ItemStyle-HorizontalAlign="Center">
                                        <ItemTemplate>
                                            <asp:Label ID="lblScholarshipYear" runat="server" Text='<%#Eval("ScholarshipYear_Code") %>'></asp:Label>
                                        </ItemTemplate>
                                        <ItemStyle Width="150px"></ItemStyle>
                                    </asp:TemplateField>
                                    <asp:TemplateField HeaderText="Issued Amount" ItemStyle-HorizontalAlign="Center">
                                        <ItemTemplate>
                                            <asp:Label ID="lblIssuedAmount" runat="server" Text='<%#Eval("Scholarship_Issued_Amount") %>'></asp:Label>
                                        </ItemTemplate>
                                        <ItemStyle Width="150px"></ItemStyle>
                                    </asp:TemplateField>
                                </Columns>
                            </asp:GridView>
                        </td>
                    </tr>
                </table>
            </div>

    </div>
    </form>
</body>
</html>
