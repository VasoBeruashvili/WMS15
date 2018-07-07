using SIS.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SIS.DataModel;
using SIS.ViewModel.Filter;
using SIS.ViewModel.Exceptions;
using System.Data.Entity;

namespace SIS.BusinessLogic
{
    public partial class SIS
    {
        public List<SizeUnitModel> GetAllSizeUnits()
        {
            try
            {
                return SISEntities.SizeUnits.Select(MapData).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
