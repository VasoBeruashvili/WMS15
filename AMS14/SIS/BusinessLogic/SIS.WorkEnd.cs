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
        public CustomerModel WorkEnd(CustomerModel model)
        {
            try
            {
                var products = SISEntities.Products.ToList();

                var balanceDate = SISEntities.Balances.ToList().OrderBy(b => b.ID).Last().Date;
                if (balanceDate == DateTime.Now.Date)
                {
                    products.ForEach(p =>
                    {
                        Balance dbBalance = new Balance()
                        {
                            ID = p.BalanceID,
                            Date = DateTime.Now.Date,
                            Name = p.Name,
                            OutputPrice = p.OutputPrice,
                            InputPrice = p.InputPrice,
                            SizeUnitID = p.SizeUnitID,
                            CurrentAmount = p.CurrentAmount,
                            TotalPrice = p.TotalPrice,
                            RealPrice = p.RealPrice
                        };

                        SISEntities.Save(dbBalance);

                        BalanceModel balance = new BalanceModel()
                        {
                            ID = dbBalance.ID
                        };

                        p.BalanceID = balance.ID;

                        SISEntities.Save(p);
                    });
                }
                else
                {
                    products.ForEach(p =>
                    {
                        Balance dbBalance = new Balance()
                        {
                            ID = 0,
                            Date = DateTime.Now.Date,
                            Name = p.Name,
                            OutputPrice = p.OutputPrice,
                            InputPrice = p.InputPrice,
                            SizeUnitID = p.SizeUnitID,
                            CurrentAmount = p.CurrentAmount,
                            TotalPrice = p.TotalPrice,
                            RealPrice = p.RealPrice
                        };

                        SISEntities.Save(dbBalance);

                        BalanceModel balance = new BalanceModel()
                        {
                            ID = dbBalance.ID
                        };

                        p.BalanceID = balance.ID;

                        SISEntities.Save(p);
                    });
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return new CustomerModel();
        }
    }
}
