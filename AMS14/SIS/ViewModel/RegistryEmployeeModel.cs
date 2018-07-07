using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StaffPortal.ViewModel
{
    public class RegistryEmployeeModel
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PersonalNumber { get; set; }
        public string PassportNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime BirthDate { get; set; }
        public int EmployeeStatusID { get; set; }
        public int EmployeePositionID { get; set; }
        public int GenderID { get; set; }
        public string StatusName { get; set; }
        public string PositionName { get; set; }
        public string GenderName { get; set; }
    }
}