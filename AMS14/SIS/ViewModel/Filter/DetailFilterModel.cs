using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ViewModel;

namespace SIS.ViewModel.Filter
{
    public class DetailFilterModel : BaseFilterModel
    {
        public int ID { get; set; }
        public int? OperationID { get; set; }
        public int? ProductID { get; set; }
        public double? InputAmount { get; set; }
        public double? OutputAmount { get; set; }
        public double? Price { get; set; }
        public double? OutputPrice { get; set; }
        public double? Neto { get; set; }
        public double? InputPrice { get; set; }

        public DateRangeModel Date { get; set; }
        public string CustomerName { get; set; }
        public string IO { get; set; }
        public string DistributorName { get; set; }
        public string ProductName { get; set; }

        public int? CustomerID { get; set; }
        public int? DistributorID { get; set; }

        public string query { get; set; }
    }
}
