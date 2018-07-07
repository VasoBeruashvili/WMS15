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
        public List<DetailModel> GetDetailsByConditions(DetailFilterModel filter)
        {
            try
            {
                var details = SISEntities.Details.AsQueryable();

                if (filter.IO != null)
                {
                    details = details.Where(d => d.Operation.IO == filter.IO);
                }

                if (filter.ProductName != null)
                {
                    details = details.Where(d => d.Product.Name.Contains(filter.ProductName));
                }

                if (filter.ProductID != null)
                {
                    details = details.Where(d => d.ProductID == filter.ProductID);
                }

                if (filter.DistributorID != null)
                {
                    details = details.Where(d => d.Operation.DistributorID == filter.DistributorID);
                }

                if (filter.Date != null)
                {
                    details = details.Where(x => (x.Operation.Date >= filter.Date.FromDate.Date) && (x.Operation.Date <= filter.Date.ToDate.Date));
                }

                if (filter.CustomerName != null)
                {
                    details = details.Where(d => d.Operation.Customer.Name.Contains(filter.CustomerName));
                }

                if (filter.CustomerID != null)
                {
                    details = details.Where(d => d.Operation.CustomerID == filter.CustomerID);
                }

                if (filter.DistributorName != null)
                {
                    details = details.Where(d => d.Operation.Distributor.Name.Contains(filter.DistributorName));
                }

                details = details.OrderBy(x => x.ID);
                filter.count = details.Count();
                if (filter.start != null)
                {
                    details = details.Skip(filter.start.Value);
                }

                if (filter.limit != null)
                {
                    details = details.Take(filter.limit.Value);
                }

                if (filter.IO == "miReba")
                {
                    return details.Select(MapDataI).ToList();
                }
                else
                {
                    return details.Select(MapDataO).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DetailModel SaveDetail(DetailModel detailModel)
        {
            DetailModel responseModel = new DetailModel();
            if (detailModel == null) return null;

            if (detailModel.Deleted)
            {
                try
                {
                    var dbOperation = SISEntities.Operations.Single(o => o.ID == detailModel.OperationID);
                    if (dbOperation != null)
                    {
                        var dbDetailToDelete = SISEntities.Details.Single(d => d.OperationID == detailModel.OperationID);

                        SISEntities.Delete(dbOperation);

                        SISEntities.Delete(dbDetailToDelete);
                    }

                    return responseModel;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                try
                {
                    var dbDetailModel = MapDataI(detailModel);
                    SISEntities.Save(dbDetailModel);
                    responseModel.ID = dbDetailModel.ID;

                    return responseModel;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public DetailModel SaveDetailO(DetailModel detailModel)
        {
            DetailModel responseModel = new DetailModel();
            if (detailModel == null) return null;

            if (detailModel.Deleted)
            {
                try
                {
                    var dbOperation = SISEntities.Operations.Single(o => o.ID == detailModel.OperationID);
                    if (dbOperation != null)
                    {
                        var dbDetailToDelete = SISEntities.Details.Single(d => d.OperationID == detailModel.OperationID);

                        SISEntities.Delete(dbOperation);

                        SISEntities.Delete(dbDetailToDelete);
                    }

                    return responseModel;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                try
                {
                    var dbDetailModel = MapDataO(detailModel);
                    SISEntities.Save(dbDetailModel);
                    responseModel.ID = dbDetailModel.ID;

                    return responseModel;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}
