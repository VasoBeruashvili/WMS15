using System;
using SIS.DataModel;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class FormModel
    {
        public int? ID { get; set; }
        public string ClassName { get; set; }
        public string Title { get; set; }
        public FormModel()
        {
        
        }
        public FormModel(Form source)
        {
            if (source != null)
            {
                ID = source.ID;
                ClassName = source.ClassName;
                Title = source.Title;
            }
        }
    }
}
