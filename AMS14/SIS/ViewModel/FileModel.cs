using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.ViewModel
{
    public class FileModel : BaseModel
    {
        public string FileName { get; set; }
        public byte[] FileContent { get; set; }
    }
}
