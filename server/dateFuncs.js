module.exports.getDateNow = function getDateNow() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
  
    if (dd < 10) {
      dd = "0" + dd;
    }
  
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    mm = months[mm - 1];
    today = dd + "/" + mm + "/" + yyyy;
    var today2 = dd + "-" + mm + "-" + yyyy;
    var d = new Date(),
      h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
      m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    var s = (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
    var timenow = h + "-" + m + "-" + s;
    return today2 + "-" + timenow;
  };
  