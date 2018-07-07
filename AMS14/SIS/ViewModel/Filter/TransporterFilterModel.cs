using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel.Filter
{
    public class TransporterFilterModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string DrivingLicense { get; set; }
        public string CarNumber { get; set; }
        public bool Deleted { get; set; }
        public int? TransportTypeID { get; set; }

        public string query { get; set; }

        public int? start { get; set; }
        public int? limit { get; set; }

        public int count { get; set; }
    }
}
