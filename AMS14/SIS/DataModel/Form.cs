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
    
    public partial class Form : IEntity
    {
        public Form()
        {
            this.MenuItems = new HashSet<MenuItem>();
        }
    
        public int ID { get; set; }
        public string ClassName { get; set; }
        public string Title { get; set; }
    
        public virtual ICollection<MenuItem> MenuItems { get; set; }
    }
}
