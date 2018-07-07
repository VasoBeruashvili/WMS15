using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class DetailModel
    {
        public int ID { get; set; }
        public int? OperationID { get; set; }
        public int? ProductID { get; set; }
        public double? InputAmount { get; set; }
        public double? OutputAmount { get; set; }
        public double? Price { get; set; }
        public double? OutputPrice { get; set; }
        public double? InputPrice { get; set; }

        public int? CustomerID { get; set; }
        public int? TransporterID { get; set; }
        public int? DistributorID { get; set; }

        public DateTime? Date { get; set; }
        public string CustomerName { get; set; }
        public string TransporterName { get; set; }
        public string IO { get; set; }
        public string DistributorName { get; set; }
        public string ProductName { get; set; }

        public string SizeUnitName { get; set; }
        public int SizeUnitID { get; set; }
        public bool Deleted { get; set; }
    }
}
