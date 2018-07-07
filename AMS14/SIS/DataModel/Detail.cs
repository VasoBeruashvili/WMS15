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
    
    public partial class Detail : IEntity
    {
        public int ID { get; set; }
        public Nullable<int> OperationID { get; set; }
        public Nullable<int> ProductID { get; set; }
        public Nullable<double> InputAmount { get; set; }
        public Nullable<double> OutputAmount { get; set; }
        public Nullable<double> Price { get; set; }
        public Nullable<double> OutputPrice { get; set; }
        public Nullable<double> InputPrice { get; set; }
        public int SizeUnitID { get; set; }
    
        public virtual SizeUnit SizeUnit { get; set; }
        public virtual Operation Operation { get; set; }
        public virtual Product Product { get; set; }
    }
}