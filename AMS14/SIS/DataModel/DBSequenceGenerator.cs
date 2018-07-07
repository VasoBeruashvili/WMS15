using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS
{
    public class DBSequenceGenerator
    {
        private int _LastID = 0;
        public int NextID {
            get
            {
                _LastID--;
                return _LastID;
            }
        }
        public int CurrentID
        {
            get
            {
                return _LastID;
            }
        }
    }
}
