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
        public List<ProductModel> GetAllProducts(ProductFilterModel filter)
        {
            try
            {
                var products = SISEntities.Products.AsQueryable();

                if (filter.Name != null)
                {
                    products = products.Where(p => p.Name.Contains(filter.Name));
                }

                if (filter.query != null)
                {
                    products = products.Where(p => p.Name.Contains(filter.query));
                }

                products = products.OrderBy(p => p.ID);
                filter.count = products.Count();
                if (filter.start != null)
                {
                    products = products.Skip(filter.start.Value);
                }

                if (filter.limit != null)
                {
                    products = products.Take(filter.limit.Value);
                }

                return products.Select(MapData).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<ProductModel> GetActiveProducts(ProductFilterModel filter)
        {
            try
            {
                var products = SISEntities.Products.Where(p => p.Deleted == false).AsQueryable();

                if (filter.query != null)
                {
                    products = products.Where(p => p.Name.Contains(filter.query));
                }                

                return products.Select(MapData).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ProductModel SaveProduct(ProductModel productModel)
        {
            if (productModel == null) return null;

            try
            {
                var dbProduct = SISEntities.Products.SingleOrDefault(p => p.ID == productModel.ID);

                if (dbProduct == null)
                {
                    SISEntities.Save(MapData(productModel));

                    return MapData(dbProduct);
                }
                else
                {
                    if (productModel.ToChange != null)
                    {
                        if (productModel.ToChange == true)
                        {
                            Product dbModel = new Product()
                            {
                                ID = productModel.ID,
                                Name = productModel.Name,
                                OutputPrice = productModel.OutputPrice,
                                Deleted = productModel.Deleted,
                                InputPrice = productModel.InputPrice,
                                SizeUnitID = productModel.SizeUnitID,
                                CurrentAmount = productModel.CurrentAmount,
                                TotalPrice = productModel.TotalPrice,
                                BalanceID = productModel.BalanceID,
                                RealPrice = productModel.RealPrice
                            };

                            var cA = dbProduct.CurrentAmount;
                            dbModel.CurrentAmount = productModel.CurrentAmount + cA;
                            var tP = dbProduct.TotalPrice;
                            dbModel.TotalPrice = productModel.TotalPrice + tP;
                            var rP = dbProduct.RealPrice;
                            dbModel.RealPrice = productModel.RealPrice + rP;

                            SISEntities.Save(dbModel);

                            return productModel;
                        }
                    }

                    if (productModel.ToChangeDown != null)
                    {
                        if (productModel.ToChangeDown == true)
                        {
                            Product dbModel = new Product()
                            {
                                ID = productModel.ID,
                                Name = productModel.Name,
                                OutputPrice = productModel.OutputPrice,
                                Deleted = productModel.Deleted,
                                InputPrice = productModel.InputPrice,
                                SizeUnitID = productModel.SizeUnitID,
                                CurrentAmount = productModel.CurrentAmount,
                                TotalPrice = productModel.TotalPrice,
                                BalanceID = productModel.BalanceID,
                                RealPrice = productModel.RealPrice
                            };

                            var cA = dbProduct.CurrentAmount;
                            dbModel.CurrentAmount = cA - productModel.CurrentAmount;
                            var tP = dbProduct.TotalPrice;
                            dbModel.TotalPrice = tP - productModel.TotalPrice;
                            var rP = dbProduct.RealPrice;
                            dbModel.RealPrice = rP - productModel.RealPrice;

                            SISEntities.Save(dbModel);

                            return productModel;
                        }
                    }

                    SISEntities.Save(MapData(productModel));
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
            

            return productModel;
        }

        public ProductModel GetProductByID(int? productID)
        {
            try
            {
                if (productID == null)
                {
                    return null;
                }
                else
                {
                    var dbProduct = SISEntities.Products.Single(p => p.ID == productID);
                    if (dbProduct != null)
                    {
                        return MapData(dbProduct);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
