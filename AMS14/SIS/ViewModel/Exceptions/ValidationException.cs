using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel.Exceptions
{
    public class CustomValidationException: Exception
    {
        public CustomValidationException() 
            : base() 
        {

        }
        public CustomValidationException(string Message)
            : base(Message)
        { 
            
        }
        public CustomValidationException(string Message, Exception e) : base(Message, e) 
        {
        
        }
    }
}
