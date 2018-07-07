using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Web.Security;
using StaffPortal.Models;
using SIS.DataModel;
using SIS.ViewModel;

namespace StaffPortal.Accounts
{
    public class UserProvider
    {
        SISEntities dbcontext = new SISEntities();

        public UserModel GetUser(string UserName)
        {
            if (UserName == null) return null;

            try
            {
                User dbuser = dbcontext.Users.Single(u => u.UserName == UserName);

                var s = dbuser.Position.Split(',');
                
                UserModel user = new UserModel
                {
                    ID = dbuser.ID,
                    UserName = dbuser.UserName,
                    FirstName = dbuser.FirstName,
                    LastName = dbuser.LastName,
                    PersonalID = dbuser.PersonalID,
                    Position = s[1],
                    DepartmentName = s[0]
                };

                return user;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

       
       

    }
}