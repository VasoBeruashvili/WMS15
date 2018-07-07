using System;
using SIS.DataModel;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class NavTreeModel
    {
        public int id { get; set; }
        public string text { get; set; }
        public int? ParentId { get; set; }
        public bool? leaf { get; set; }
        public int? FormID { get; set; }
        public int? FormTypeID { get; set; }
        public string IconUrl { get; set; }
        public int? indexNumber { get; set; }
        public FormModel Form { get; set; }
        public List<NavTreeModel> children { get; set; }
    }
}
