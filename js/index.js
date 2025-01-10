const conn_token = "90934336|-31949200795312931|90957453"
const jpdpBaseUrl = "http://api.login2explore.com:5577"
const jpdbIml = "/api/iml"
const jpdbIrl = "/api/irl"
const db_name = "SCHOOL-DB "
const db_rel = "STUDENT-TABLE"

$("#rollno").focus();
function validate() {
    var rollNo, studName, std, birth, stud_add, enroll_dt
    rollNo = $("#rollno").val()
    studName = $('#name').val();
    std = $('#class').val();
    birth = $('#birth_date').val();
    stud_add = $('#address').val();
    enroll_dt = $('#enroll_date').val();

    if (rollNo == "") {
        alert("Roll No is Missing");
        $('#rollno').focus();
        return "";
    }

    if (studName == "") {
        alert("Student Name is Missing");
        $('#name').focus();
        return "";
    }

    if (std == "") {
        alert("Class Name is Missing");
        $('#class').focus();
        return "";
    }

    if (birth == "") {
        alert("Birth Date is Missing");
        $('#birth_date').focus();
        return "";
    }

    if (stud_add == "") {
        alert("Student Address is Missing");
        $('#address').focus();
        return "";
    }

    if (enroll_dt == "") {
        alert("Enrollment Date is Missing");
        $('#enroll_date').focus();
        return "";
    }

    var jsnStrobj = {
        id: rollNo,
        name: studName,
        class: std,
        bt_dt: birth,
        add: stud_add,
        enrol_dt: enroll_dt
    }

    return JSON.stringify(jsnStrobj)
}

function savedata() {
    var jsonStrObj = validate();
    if (jsonStrObj == '') {
        return ''
    }

    var createPut = createPUTRequest(conn_token, jsonStrObj, db_name, db_rel);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(createPut, jpdpBaseUrl, jpdbIml);
    jQuery.ajaxSetup({ async: true });
    Reset();
    $("#rollno").focus();
}

function getStudentId() {
    var stud_id = $("#rollno").val();
    if (stud_id == '') {
        return ''
    }

    var jsonStr = {
        id: stud_id
    }

    return JSON.stringify(jsonStr)
}

function getStudent() {
    var getStud_Id = getStudentId()
    var createget = createGET_BY_KEYRequest(conn_token, db_name, db_rel, getStud_Id);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(createget, jpdpBaseUrl, jpdbIrl);
    jQuery.ajaxSetup({ async: true });
    if (resultObj.status == 400) {
        alert("Roll Id not present. Enter All Details");
        $("#save").prop('disabled', false)
        $("#reset").prop('disabled', false)
        $("#rollno").focus()
    } else if (resultObj.status == 200) {
        $("#rollno").prop('disabled', true)
        fillData(resultObj)
        $("#change").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#name").focus()
    }
}

function fillData(jsonObj) {
    saveRecNo2Ls(jsonObj)
    var record = JSON.parse(jsonObj.data).record;
    $('#name').val(record.name);
    $('#class').val(record.class);
    $('#birth_date').val(record.bt_dt);
    $('#address').val(record.add);
    $('#enroll_date').val(record.enrol_dt);
}

function saveRecNo2Ls(jsonObj) {
    var lsData = JSON.parse(jsonObj.data)
    localStorage.setItem('recno', lsData.rec_no)
}
function Reset() {
    $('#rollno').val('');
    $('#name').val('');
    $('#class').val('');
    $('#birth_date').val('');
    $('#address').val('');
    $('#enroll_date').val('');
    $('#rollno').prop('disabled', false);
    $('#save').prop('disabled', true);
    $('#rollno').focus();
}

function changedata() {
    $('#change').prop('disabled', true);
    var getChangedata = validate()
    var updateChange = createUPDATERecordRequest(conn_token, getChangedata, db_name, db_rel, localStorage.getItem('recno'))
    jQuery.ajaxSetup({async:false})
    var resultChg = executeCommandAtGivenBaseUrl(updateChange, jpdpBaseUrl, jpdbIml);
    jQuery.ajaxSetup({async:true})
    Reset();
    $('#rollno')
}