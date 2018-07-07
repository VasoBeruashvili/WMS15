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
    partial class SIS
    {
        public OperationModel SaveOperation(OperationModel operationModel)
        {
            OperationModel responseModel = new OperationModel();
            if (operationModel == null) return null;

            try
            {
                var dbOperationModel = MapData(operationModel);
                SISEntities.Save(dbOperationModel);
                responseModel.ID = dbOperationModel.ID;

                return responseModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
