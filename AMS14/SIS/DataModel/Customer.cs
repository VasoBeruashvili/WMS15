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
    
    public partial class Customer : IEntity
    {
        public Customer()
        {
            this.Operations = new HashSet<Operation>();
        }
    
        public int ID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Address { get; set; }
        public bool Deleted { get; set; }
    
        public virtual ICollection<Operation> Operations { get; set; }
    }
}
