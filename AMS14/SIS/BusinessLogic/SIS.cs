using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SIS.DataModel;
using SIS.ViewModel;
using SIS.ViewModel.Filter;

using System.Data.Entity;

using System.Data;
using System.Data.SqlClient;
using System.Data.Entity.Infrastructure;
using CommonModel.ViewModel.Exceptions;

namespace SIS.BusinessLogic
{
    public partial class SIS : IDisposable
    {
        SISEntities _sisEntities;

        TransactionHandler _transactionHnadler;

        DBSequenceGenerator _IDGenerator;

        public DBSequenceGenerator IDGenerator 
        {
            get
            {
                return _IDGenerator ?? (_IDGenerator= new DBSequenceGenerator());
            }
        }

        BatchSave _batchSave;

        public BatchSave BatchSave
        {
            get
            {
                return _batchSave ?? (_batchSave = new BatchSave
                {
                    contxt = SISEntities,
                    Transaction = Transaction,
                    Items = new Dictionary<int,List<BatchItem>>()
                });
            }
        }

        public SISEntities SISEntities
        {
            get
            {
                return _sisEntities ?? (_sisEntities = new SISEntities());
            }
        }

        public TransactionHandler Transaction
        {
            get
            {
                return _transactionHnadler ?? (_transactionHnadler = new TransactionHandler());
            }
        }

        public SIS()
        {
            TrackedModels = new Dictionary<int, IEntity>();
        }

        private Dictionary<int, IEntity> TrackedModels { get; set; }

        private IEntity GetTrackedObject(int tmpkey)
        {
            if(TrackedModels.ContainsKey(tmpkey))
            {
                return TrackedModels[tmpkey];
            }

            return null;
        }

        public FileModel DownloadFile(string fileName)
        {
            return GetFile(fileName);
        }

        public FileModel GetFile(string fileName)
        {
            var src = SISEntities.Files.AsQueryable();
            var file = src.SingleOrDefault(p => p.FileName == fileName);
            var model = MapData(file);
            return model;
        }

        public void DeleteUploadedFile(File file)
        {
            SISEntities.Delete(file);
        }

        public FileModel UploadFile(FileModel fileModel)
        {
            try
            {
                var dbTempFile = MapData(fileModel);
                var fileExist = SISEntities.Files.FirstOrDefault(f => f.FileName == dbTempFile.FileName);

                if (fileExist != null)
                {
                    DeleteUploadedFile(fileExist);
                    var entityToSave = new File()
                    {
                        ID = fileModel.ID,
                        FileContent = fileModel.FileContent,
                        FileName = fileModel.FileName
                    };
                    SISEntities.Save(entityToSave);
                    fileModel.ID = fileExist.ID;
                }
                else
                {
                    SISEntities.Save(dbTempFile);
                    fileModel.ID = dbTempFile.ID;
                }

                return fileModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int GetTrackedEntityID(int tempID)
        {
            var trackedEntity = GetTrackedObject(tempID);

            if (trackedEntity == null)
                throw new Exception("you must save tracked entity beofore getting its id");
            return trackedEntity.ID;
        }

        public TEntity MapDataTracking<TEntity, TModel>(TModel model)
            where TModel : BaseModel
            where TEntity : IEntity
        {

            var trackedEntity = GetTrackedObject(model.ID) ?? MapData((dynamic)model);

            TrackedModels[model.ID] = trackedEntity;

            return trackedEntity;

        }

        public List<NavTreeModel> GetTree()
        {
            try
            {
                var MenuItems = SISEntities.MenuItems.Select(MapData).ToList();

                var Parents = MenuItems.Where(p => p.ParentId == null).ToList();

                var Children = MenuItems.Where(p => p.ParentId != null).ToList();

                Func<NavTreeModel, NavTreeModel> FillChildren = null;
                FillChildren = (NavTreeModel Item) =>
                {
                    Item.children = Children.Where(u => u.ParentId == Item.id).ToList();

                    Item.children.ForEach(uu => FillChildren(uu));

                    return Item;
                };
                Parents.ForEach(p => FillChildren(p));

                return Parents;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void Dispose()
        {
            if (_sisEntities != null)
            {
                SISEntities.Dispose();
            }

            if (_transactionHnadler != null)
            {
                Transaction.Dispose();
            }
        }
    }

    public class ParentModel : BaseModel
    {
        public List<ChildModel> Children { get; set; }
    }

    public class ChildModel : BaseModel
    {
        public int ParentID { get; set; }
    }
}
