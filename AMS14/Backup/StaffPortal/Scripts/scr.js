
var monthN = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
monthD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
dayN = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
Year = 2012;
Month = 1;
MonthN = 'Jan';
Day = 1;
Wday = 1;
DayN = 'Mon';
Hour = 0;
Minute = 1;
Second = 30;
function init(sY, sM, sD, sWd, sh, sm, ss, MonthYear, DaySel, NumSel) {
    Year = sY;
    Month = sM - 1;//mod -1 30.01.13
    MonthN = monthN[sM - 1];//-1
    Day = sD;
    DayN = dayN[sWd];//-1
    Wday = sWd;
    Hour = sh;
    Minute = sm;
    Second = ss;
    document.getElementById('monthyear').innerHTML = MonthN + '<br> ' + Year.toString();
    document.getElementById('number').innerHTML = Day.toString();
    document.getElementById('day').innerHTML = DayN;
    setInterval(function () { update(); }, 1000);
}
function updateSec() {
    var n = 1;
    Second++;
    if (Second >= 60) { Minute++; Second = 0; }
    if (Minute >= 60) { Hour++; Minute = 0; }
    if (Hour > 23) { Day++; Wday = (Wday + 1) % 7; DayN = dayN[Wday]; Hour = 0; n++ }
    if (Day > monthD[Month]) { Month++; MonthN = monthN[Month - 1]; Day = 1; n++ }
    if (Month > 12) { Year++; Month = 1; n++ }
    return n;
}
function update() {
    var n = updateSec();
    //console.log(Second);
    document.getElementById('ctime').innerHTML = ((Hour > 9) ? '' : '0') + Hour.toString() + ' : ' + ((Minute > 9) ? '' : '0') + Minute.toString() + ' : ' + ((Second > 9) ? '' : '0') + Second.toString();
    if (n === 2 || n === 3) {
        document.getElementById('monthyear').innerHTML = MonthN + '<br> ' + Year.toString();
        document.getElementById('number').innerHTML = Day.toString();
        document.getElementById('day').innerHTML = DayN;
    }
}
//$(document).ready(function () { init(YEAR, MONTH, DAY, WDAY, HOUR, MINUTE, SECOND, 'sel', 'sel', 'sel'); });
//var id = setInterval(function (){this.update();}, 1000);
//console.log(id);
