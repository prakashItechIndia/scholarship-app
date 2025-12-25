function checkSpecialKeys(e) {
    if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)
        return false;
    else
        return true;
}


function NameValidate(evt) {
   
    var charCode = (evt.which) ? evt.which : event.keyCode
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 122) || (charCode == 46) || (charCode == 8) || (charCode == 73) || (charCode == 13) || (charCode == 27) || (charCode == 32))
        return true;
    return false;

}


function AddressValidate(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode > 42 && charCode < 59) || (charCode == 46) || (charCode == 8) || (charCode == 73) || (charCode == 95) || (charCode == 13) || (charCode == 27) || (charCode == 32) || (charCode == 35))
        return true;

    return false;

}


function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}


function textLimit(field, maxlen) {

    if (field.value.length > maxlen + 1)
        alert('Your Text Limit  is Maximum!');
    if (field.value.length > maxlen)
        field.value = field.value.substring(0, maxlen);
}