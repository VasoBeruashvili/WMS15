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
        public List<BalanceModel> GetBalanceByDate(BalanceFilterModel filter)
        {
            try
            {
                if (filter.Date != null)
                {
                    var balances = SISEntities.Balances.AsQueryable();

                    if (filter.Name != null)
                    {
                        balances = balances.Where(b => b.Name == filter.Name);
                    }

                    balances = balances.Where(x => (x.Date >= filter.Date.FromDate.Date) && (x.Date <= filter.Date.ToDate.Date));

                    balances = balances.OrderBy(p => p.ID);
                    filter.count = balances.Count();
                    if (filter.start != null)
                    {
                        balances = balances.Skip(filter.start.Value);
                    }

                    if (filter.limit != null)
                    {
                        balances = balances.Take(filter.limit.Value);
                    }

                    return balances.Select(MapData).ToList();
                }
                else
                {
                    var balances = SISEntities.Balances.AsQueryable();

                    if (filter.Name != null)
                    {
                        balances = balances.Where(b => b.Name == filter.Name);
                    }

                    balances = balances.Where(x => (x.Date >= filter.Date.FromDate.Date) && (x.Date <= filter.Date.ToDate.Date));

                    return balances.Select(MapData).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}