using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class BaseModel
    {
        public int ID { get; set; }
        public bool Deleted { get; set; }


        public DateTime? LoadDate { get; set; }


        //TODO es droebitia
        public string Name { get; set; }



        //TODO gadasaxedia

        //public int ModelStateID { get; set; }

        //public int tempkey { get; set; }
    }


    //public enum ModelState
    //{
    //    Loaded=1,
    //    Modified=2,
    //    Added=3,
    //    Deleted=4
    //}




}
