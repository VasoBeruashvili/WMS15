using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class ProductModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public double? OutputPrice { get; set; }
        public bool Deleted { get; set; }
        public double? InputPrice { get; set; }
        public int? SizeUnitID { get; set; }

        public string SizeUnitName { get; set; }

        public int? CurrentAmount { get; set; }
        public bool? ToChange { get; set; }
        public double? TotalPrice { get; set; }
        public bool? ToChangeDown { get; set; }

        public int BalanceID { get; set; }

        public double? RealPrice { get; set; }
    }
}
