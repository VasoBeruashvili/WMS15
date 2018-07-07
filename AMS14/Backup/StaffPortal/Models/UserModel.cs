using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SIS.ViewModel;

namespace StaffPortal.Models
{
    public class UserModel
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Position { get; set; }
        public string DepartmentName { get; set; }
        public string PersonalID { get; set; }

        public List<UserActionModel> UserActions { get; set; }
    }
}