using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel.Filter
{
    public class BaseFilterModel
    {
        public int? start { get; set; }
        public int? limit { get; set; }
        public int count { get; set; }
    }
}
