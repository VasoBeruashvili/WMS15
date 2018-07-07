using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class ProgramTemplateBlockRequiredCourseModel : BaseModel
    {
        public int CourseID { get; set; }
        public int ProgramTemplateBlockID { get; set; }
        public string CourseName { get; set; }
        public int CreditCount { get; set; }
    }
}
