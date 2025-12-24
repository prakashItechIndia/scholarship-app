//Script for Home page News

var Mnewstabchange;
var Mtabnewstime;
  function Mtabnews(Mnewstabchange)
  {
	document.getElementById('tabrolls').value=Mnewstabchange;
    var nexttab;
    var tab="Mnewstabs"+Mnewstabchange;
	var content="Mnews"+Mnewstabchange;	
	document.getElementById('Mnewstabs1').className="about1 clsHover";
	document.getElementById('Mnewstabs2').className="about2 clsHover";
	document.getElementById('Mnewstabs3').className="about3 clsHover";
//	document.getElementById('Mnewstabs4').className="about4 clsHover";
//	document.getElementById('Mnewstabs5').className="about5 clsHover";
	document.getElementById(tab).style.top='0px';
   document.getElementById(tab).className="about"+Mnewstabchange+" tabActive"; 
	document.getElementById(tab).style.color="white";
	
	document.getElementById('Mnews1').style.display="none";
   document.getElementById('Mnews2').style.display="none";
	document.getElementById('Mnews3').style.display="none";//
//	document.getElementById('Mnews4').style.display="none";
//	document.getElementById('Mnews5').style.display="none";
	$("#Mnews"+Mnewstabchange).fadeIn(1000);
	<!--document.getElementById(content).style.display="block";-->
	nexttab=parseInt(Mnewstabchange)+1;
	if(nexttab==4)
	nexttab=1;	
	Mtabnewstime=setTimeout("Mtabnews1('"+nexttab+"')",5000);
  }
  var dntab;
 function Mtabnews1(dntab)
  {
    clearTimeout(Mtabnewstime);
	Mtabnews(dntab);
  } 
Mtabnews1(1);

var btabnew1,btabnew2;
function btabnew(btabnew1,btabnew2) {
	var btabnew3=document.getElementById('tabrolls').value;
	if(btabnew1==1) {
		if(btabnew3!=btabnew2)
		$("#Mnewstabs"+btabnew2).animate({top:1},"fast");
	} else {
	$("#Mnewstabs"+btabnew2).animate({top:8},"fast");	
	}
	
}