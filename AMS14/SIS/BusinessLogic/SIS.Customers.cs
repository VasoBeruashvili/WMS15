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
        public List<CustomerModel> GetAllCustomers(CustomerFilterModel filter)
        {
            try
            {
                var customers = SISEntities.Customers.AsQueryable();

                if (filter.Name != null)
                {
                    customers = customers.Where(c => c.Name.Contains(filter.Name));
                }

                if (filter.query != null)
                {
                    customers = customers.Where(c => c.Name.Contains(filter.query));
                }

                customers = customers.OrderBy(x => x.ID);
                filter.count = customers.Count();
                if (filter.start != null)
                {
                    customers = customers.Skip(filter.start.Value);
                }

                if (filter.limit != null)
                {
                    customers = customers.Take(filter.limit.Value);
                }

                return customers.Select(MapData).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<CustomerModel> GetActiveCustomers(CustomerFilterModel filter)
        {
            try
            {
                var customers = SISEntities.Customers.Where(c => c.Deleted == false).AsQueryable();

                if (filter.query != null)
                {
                    customers = customers.Where(c => c.Name.Contains(filter.query));
                }                

                return customers.Select(MapData).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public CustomerModel SaveCustomer(CustomerModel customerModel)
        {
            if (customerModel == null) return null;

            try
            {
                SISEntities.Save(MapData(customerModel));

                return customerModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
