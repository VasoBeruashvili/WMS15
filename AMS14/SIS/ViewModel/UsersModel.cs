using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class UsersModel : BaseModel
    {
        public new int ID { get; set; }
        public int GroupID { get; set; }
        public string PWD { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Position { get; set; }
        public bool IsActive { get; set; }
        public string PersonalID { get; set; }
        public List<UsersModel> children { get; set; }
        public string Gender { get; set; }
    }
}
