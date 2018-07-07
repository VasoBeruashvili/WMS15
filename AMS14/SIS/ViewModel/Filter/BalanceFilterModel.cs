using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModel;

namespace SIS.ViewModel.Filter
{
    public class BalanceFilterModel : BaseFilterModel
    {
        public DateRangeModel Date { get; set; }
        public string Name { get; set; }

        public int? start { get; set; }
        public int? limit { get; set; }

        public int count { get; set; }
    }
}
