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
        public List<DistributorModel> GelAllDistributors(DistributorFilterModel filter)
        {
            try
            {
                var distributors = SISEntities.Distributors.AsQueryable();

                if (filter.Name != null)
                {
                    distributors = distributors.Where(d => d.Name.Contains(filter.Name));
                }

                if (filter.query != null)
                {
                    distributors = distributors.Where(d => d.Name.Contains(filter.query));
                }

                distributors = distributors.OrderBy(d => d.ID);
                filter.count = distributors.Count();
                if (filter.start != null)
                {
                    distributors = distributors.Skip(filter.start.Value);
                }

                if (filter.limit != null)
                {
                    distributors = distributors.Take(filter.limit.Value);
                }

                return distributors.Select(MapData).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DistributorModel> GetActiveDistributors(DistributorFilterModel filter)
        {
            try
            {
                var distributors = SISEntities.Distributors.Where(d => d.Deleted == false).AsQueryable();

                if (filter.query != null)
                {
                    distributors = distributors.Where(d => d.Name.Contains(filter.query));
                }                

                return distributors.Select(MapData).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DistributorModel SaveDistributor(DistributorModel distributorModel)
        {
            if (distributorModel == null) return null;

            try
            {
                SISEntities.Save(MapData(distributorModel));

                return distributorModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
