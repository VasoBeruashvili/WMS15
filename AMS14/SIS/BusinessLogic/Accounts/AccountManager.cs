using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SIS.DataModel;

using System.Security.Cryptography;

namespace SIS.BusinessLogic.Accounts
{
    public static class AccountManager
    {
        private static SISEntities db = new SISEntities();
        private static SHA256 cryptoEngine = SHA256.Create();

        public static bool Login(string UserName, string Password)
        {
            byte[] buffer = Encoding.Unicode.GetBytes(Password);
            string PWD = BitConverter.ToString(cryptoEngine.ComputeHash(buffer));

            User user = db.Users.FirstOrDefault(u => u.UserName == UserName);

            if(user == null)
            {
                throw new Exception("მომხმარებელი ვერ მოიძებნა");
            }

            return (user.UserName == UserName && user.PWD == PWD);
        }
    }
}
