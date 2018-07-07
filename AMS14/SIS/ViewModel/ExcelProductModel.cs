using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class ExcelProductModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int CurrentUserID { get; set; }

        public List<OutcomeProductModel> ExcelNode { get; set; }
    }
}
