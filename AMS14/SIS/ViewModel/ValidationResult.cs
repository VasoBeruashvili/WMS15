using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<String> Messages { get; set; }
    }
}
