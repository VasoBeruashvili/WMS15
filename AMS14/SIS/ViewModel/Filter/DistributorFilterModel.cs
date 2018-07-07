﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel.Filter
{
    public class DistributorFilterModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Address { get; set; }
        public bool Deleted { get; set; }

        public string query { get; set; }

        public int? start { get; set; }
        public int? limit { get; set; }

        public int count { get; set; }
    }
}