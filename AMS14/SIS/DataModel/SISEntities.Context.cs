﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class SISEntities : DbContext
    {
        public SISEntities()
            : base("name=SISEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<Balance> Balances { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Detail> Details { get; set; }
        public DbSet<Distributor> Distributors { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Form> Forms { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<SizeUnit> SizeUnits { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
