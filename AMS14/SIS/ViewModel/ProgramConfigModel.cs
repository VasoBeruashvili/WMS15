using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class ProgramConfigModel:BaseModel
    {
        //TODO: int?
        public int OrganizationalUnitID { get; set; }
        public string OrganizationalUnitName{get;set;}
        public DateTime CreateDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
        public int ProgramID { get; set; }
        public string ProgramName{ get; set;}
        public int ProgramConfigStatusID { get; set; }
        public string ProgramConfigStatusName { get; set; }
        public List<OrganizationalUnitModel> AdditionalOrganizationalUnits { get; set; }
        public List<ProgramCourseConfigModel> ProgramCourseConfigs { get; set; }
    }
}
