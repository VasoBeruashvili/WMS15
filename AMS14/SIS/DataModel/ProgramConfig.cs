//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SIS.DataModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class ProgramConfig : IEntity
    {
        public ProgramConfig()
        {
            this.ProgramConfigAdditionalOrganizationalUnits = new HashSet<ProgramConfigAdditionalOrganizationalUnit>();
            this.ProgramCourseConfigs = new HashSet<ProgramCourseConfig>();
        }
    
        public int ID { get; set; }
        public System.DateTime CreateDate { get; set; }
        public int OrganizationalUnitID { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public bool IsActive { get; set; }
        public int ProgramID { get; set; }
        public int ProgramConfigStatusID { get; set; }
        public Nullable<System.DateTime> LastModifiedDate { get; set; }
    
        public virtual OrganizationalUnit OrganizationalUnit { get; set; }
        public virtual ProgramConfigStatus ProgramConfigStatus { get; set; }
        public virtual Program Program { get; set; }
        public virtual ICollection<ProgramConfigAdditionalOrganizationalUnit> ProgramConfigAdditionalOrganizationalUnits { get; set; }
        public virtual ICollection<ProgramCourseConfig> ProgramCourseConfigs { get; set; }
    }
}
