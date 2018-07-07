using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class BalanceModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public double? OutputPrice { get; set; }
        public double? InputPrice { get; set; }
        public int? SizeUnitID { get; set; }
        public DateTime? Date { get; set; }
        public double? CurrentAmount { get; set; }
        public double? TotalPrice { get; set; }

        public string SizeUnitName { get; set; }
        public float TotalPriceSum { get; set; }

        public double? RealPrice { get; set; }
    }
}
