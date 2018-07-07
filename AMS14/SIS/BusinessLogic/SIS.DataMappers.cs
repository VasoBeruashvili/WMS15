using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SIS.DataModel;
using SIS.ViewModel;
using SIS.ViewModel.Filter;

namespace SIS.BusinessLogic
{
    public partial class SIS
    {
        public DataModel.File MapData(FileModel uploaded)
        {
            if (uploaded == null)
                return null;
            else
            {
                return new DataModel.File
                {
                    ID = uploaded.ID,
                    FileContent = uploaded.FileContent,
                    FileName = uploaded.FileName
                };
            }
        }
        public FileModel MapData(DataModel.File dbFile)
        {
            if (dbFile == null)
                return null;
            else
            {
                return new FileModel
                {
                    ID = dbFile.ID,
                    FileContent = dbFile.FileContent,
                    FileName = dbFile.FileName
                };
            }
        }

        public UsersModel MapData(User entity)
        {
            if (entity == null) return null;
            try
            {
                return new UsersModel
                {
                    ID = entity.ID,
                    UserName = entity.UserName,
                    FirstName = entity.FirstName,
                    LastName = entity.LastName,
                    Position = entity.Position,
                    IsActive = entity.IsActive,
                    PersonalID = entity.PersonalID
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public User MapData(UsersModel model)
        {
            if (model == null) return null;
            try
            {
                return new User
                {
                    ID = model.ID,
                    PWD = model.PWD,
                    UserName = model.UserName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Position = model.Position,
                    IsActive = model.IsActive,
                    PersonalID = model.PersonalID
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region tblDataMappers
        public BalanceModel MapData(Balance entity)
        {
            if (entity == null) return null;
            try
            {
                return new BalanceModel
                {
                    ID = entity.ID,
                    Name = entity.Name,
                    OutputPrice = entity.OutputPrice,
                    InputPrice = entity.InputPrice,
                    SizeUnitID = entity.SizeUnitID,
                    Date = entity.Date,
                    CurrentAmount = entity.CurrentAmount,
                    TotalPrice = entity.TotalPrice,
                    SizeUnitName = entity.SizeUnit.Name,
                    RealPrice = entity.RealPrice
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Balance MapData(BalanceModel model)
        {
            if (model == null) return null;
            try
            {
                return new Balance
                {
                    ID = model.ID,
                    Name = model.Name,
                    OutputPrice = model.OutputPrice,
                    InputPrice = model.InputPrice,
                    SizeUnitID = model.SizeUnitID,
                    Date = DateTime.Now.Date,
                    CurrentAmount = model.CurrentAmount,
                    TotalPrice = model.CurrentAmount * model.OutputPrice,
                    RealPrice = model.CurrentAmount * model.InputPrice
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public CustomerModel MapData(Customer entity)
        {
            if (entity == null) return null;
            try
            {
                return new CustomerModel
                {
                    ID = entity.ID,
                    Name = entity.Name,
                    Code = entity.Code,
                    Address = entity.Address,
                    Deleted = entity.Deleted
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Customer MapData(CustomerModel model)
        {
            if (model == null) return null;
            try
            {
                return new Customer
                {
                    ID = model.ID,
                    Name = model.Name,
                    Code = model.Code,
                    Address = model.Address,
                    Deleted = model.Deleted
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public SizeUnitModel MapData(SizeUnit entity)
        {
            if (entity == null) return null;
            try
            {
                return new SizeUnitModel
                {
                    ID = entity.ID,
                    Name = entity.Name
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public SizeUnit MapData(SizeUnitModel model)
        {
            if (model == null) return null;
            try
            {
                return new SizeUnit
                {
                    ID = model.ID,
                    Name = model.Name
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DistributorModel MapData(Distributor entity)
        {
            if (entity == null) return null;
            try
            {
                return new DistributorModel
                {
                    ID = entity.ID,
                    Name = entity.Name,
                    Code = entity.Code,
                    Address = entity.Address,
                    Deleted = entity.Deleted
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Distributor MapData(DistributorModel model)
        {
            if (model == null) return null;
            try
            {
                return new Distributor
                {
                    ID = model.ID,
                    Name = model.Name,
                    Code = model.Code,
                    Address = model.Address,
                    Deleted = model.Deleted
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ProductModel MapData(Product entity)
        {
            if (entity == null) return null;

            try
            {
                return new ProductModel
                {
                    ID = entity.ID,
                    Name = entity.Name,
                    OutputPrice = entity.OutputPrice,
                    Deleted = entity.Deleted,
                    InputPrice = entity.InputPrice,
                    SizeUnitID = entity.SizeUnitID,
                    SizeUnitName = entity.SizeUnit.Name,
                    CurrentAmount = entity.CurrentAmount,
                    TotalPrice = entity.TotalPrice,
                    BalanceID = entity.BalanceID,
                    RealPrice = entity.RealPrice
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Product MapData(ProductModel model)
        {
            if (model == null) return null;

            try
            {
                return new Product
                {
                    ID = model.ID,
                    Name = model.Name,
                    OutputPrice = model.OutputPrice,
                    Deleted = model.Deleted,
                    InputPrice = model.InputPrice,
                    SizeUnitID = model.SizeUnitID,
                    CurrentAmount = model.CurrentAmount,
                    TotalPrice = model.TotalPrice,
                    BalanceID = model.BalanceID,
                    RealPrice = model.RealPrice
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public OperationModel MapData(Operation entity)
        {
            if (entity == null) return null;

            try
            {
                return new OperationModel
                {
                    ID = entity.ID,
                    CustomerID = entity.CustomerID,
                    Date = entity.Date,
                    DistributorID = entity.DistributorID,
                    IO = entity.IO
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Operation MapData(OperationModel model)
        {
            if (model == null) return null;

            try
            {
                return new Operation
                {
                    ID = model.ID,
                    CustomerID = model.CustomerID,
                    Date = DateTime.Now.Date,
                    DistributorID = model.DistributorID,
                    IO = model.IO
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DetailModel MapDataI(Detail entity)
        {
            if (entity == null) return null;

            try
            {
                return new DetailModel
                {
                    ID = entity.ID,
                    InputPrice = entity.InputPrice,
                    InputAmount = entity.InputAmount,
                    OperationID = entity.OperationID,
                    Price = entity.Price,
                    ProductID = entity.ProductID,
                    Date = entity.Operation.Date,
                    IO = entity.Operation.IO,
                    DistributorName = entity.Operation.Distributor.Name,
                    ProductName = entity.Product.Name,
                    DistributorID = entity.Operation.DistributorID,
                    OutputPrice = entity.OutputPrice,
                    SizeUnitName = entity.SizeUnit.Name
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Detail MapDataI(DetailModel model)
        {
            if (model == null) return null;

            try
            {
                return new Detail
                {
                    ID = model.ID,
                    InputPrice = model.InputPrice,
                    InputAmount = model.InputAmount,
                    OperationID = model.OperationID,
                    Price = model.Price,
                    ProductID = model.ProductID,
                    SizeUnitID = model.SizeUnitID,
                    OutputPrice = model.OutputPrice
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DetailModel MapDataO(Detail entity)
        {
            if (entity == null) return null;

            try
            {
                return new DetailModel
                {
                    ID = entity.ID,
                    OperationID = entity.OperationID,
                    OutputAmount = entity.OutputAmount,
                    OutputPrice = entity.OutputPrice,
                    Price = entity.Price,
                    ProductID = entity.ProductID,
                    Date = entity.Operation.Date,
                    CustomerName = entity.Operation.Customer.Name,
                    IO = entity.Operation.IO,
                    ProductName = entity.Product.Name,
                    CustomerID = entity.Operation.CustomerID,
                    SizeUnitName = entity.SizeUnit.Name
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Detail MapDataO(DetailModel model)
        {
            if (model == null) return null;

            try
            {
                return new Detail
                {
                    ID = model.ID,
                    OperationID = model.OperationID,
                    OutputAmount = model.OutputAmount,
                    OutputPrice = model.OutputPrice,
                    Price = model.Price,
                    ProductID = model.ProductID,
                    SizeUnitID = model.SizeUnitID
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region Form & Tree
        public FormModel MapData(Form source)
        {
            if (source == null)
                return null;
            else
                return new FormModel
                {
                    ID = source.ID,
                    ClassName = source.ClassName,
                    Title = source.Title
                };
        }

        public NavTreeModel MapData(MenuItem entity)
        {
            return new NavTreeModel
            {
                id = entity.ID,
                leaf = entity.IsLeaf,
                ParentId = entity.ParentID,
                text = entity.DisplayName,
                FormID = entity.FormID,
                IconUrl = entity.IconUrl,
                Form = MapData(entity.Form),
                indexNumber = entity.IndexNumber,
            };
        }
        #endregion
    }
}
        