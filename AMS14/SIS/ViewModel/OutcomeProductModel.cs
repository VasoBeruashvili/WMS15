using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class OutcomeProductModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int Amount { get; set; }
        public double OutputPrice { get; set; }
        public double TotalPrice { get; set; }
        public string SizeUnitName { get; set; }
        public int SizeUnitID { get; set; }
        public int OperationID { get; set; }
        public bool Deleted { get; set; }
        public int ProductID { get; set; }
    }
}
