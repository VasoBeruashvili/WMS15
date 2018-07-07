using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Security.Cryptography;

namespace SIS.BusinessLogic.Accounts
{
    public class HashHelper
    {
        public static string Calc(string src)
        {
            SHA256Managed m = new SHA256Managed();

            byte[] b = Encoding.UTF8.GetBytes(src);

            byte[] hash = m.ComputeHash(b);

            string r = string.Empty;

            foreach (byte l in hash)
            {
                r += String.Format("{0:x2}", l);
            }

            return r;
        }
    }
}
