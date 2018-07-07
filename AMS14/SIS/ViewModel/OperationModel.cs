using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class OperationModel
    {
        public int ID { get; set; }
        public DateTime? Date { get; set; }
        public int? CustomerID { get; set; }
        public string IO { get; set; }
        public int? DistributorID { get; set; }
    }
}
