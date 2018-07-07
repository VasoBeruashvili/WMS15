using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel.Filter
{
    public class ProductFilterModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public double? OutputPrice { get; set; }
        public double? Neto { get; set; }
        public bool Deleted { get; set; }
        public double? InputPrice { get; set; }
        public int? SizeUnitID { get; set; }

        public string query { get; set; }

        public int? start { get; set; }
        public int? limit { get; set; }

        public int count { get; set; }
    }
}
