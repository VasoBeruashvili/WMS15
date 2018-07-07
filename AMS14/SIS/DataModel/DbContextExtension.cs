using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.Core.Objects.DataClasses;
using System.Transactions;
using col = System.Collections;
using objcol = System.Collections;

namespace SIS.DataModel
{
    public interface IEntity
    {
        int ID { get; set; }
    }

    public interface IEntity1111
    {

        string Code { get; set; }
    }

    public class TransactionHandler : IDisposable
    {

        public TransactionHandler()
        {
        }

        private TransactionScope _activeTransaction;
        private int counter = 0;
        public void Open(IsolationLevel level = IsolationLevel.ReadCommitted)
        {
            if (counter == 0)
            {
                _activeTransaction = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = level, Timeout = new TimeSpan(0, 90, 0) });//new TimeSpan(0, 10, 0)
            }

            counter++;
        }


        public void Commit()
        {
            if (counter == 0)
                throw new Exception("negative counter in transaction");

            if (counter == 1)
            {
                _activeTransaction.Complete();
                _activeTransaction.Dispose();
            }

            counter--;
        }

        public void RollBack()
        {
            if (counter == 1)
            {
                System.Transactions.Transaction.Current.Rollback();
                _activeTransaction.Dispose();
            }

            counter--;
        }



        public void Dispose()
        {
            if (counter > 0)
            {
                System.Transactions.Transaction.Current.Rollback();
                throw new Exception("Opened transaction left");
            }
        }
    }

    public static class DbContextExtension
    {
        public static void SaveOld<TEntity>(this SISEntities context, TEntity entity) where TEntity : class, IEntity
        {
            var set = context.Set<TEntity>();

            var dbentity = set.Find(entity.ID);

            if (dbentity != null)
            {
                var entry = context.Entry<TEntity>(dbentity);

                entry.CurrentValues.SetValues(entity);
            }
            else
            {
                set.Add(entity);
            }

            context.SaveChanges();

            //entity.ID = dbentity.ID;

        }



        public static void Save<TEntity>(this SISEntities context, TEntity entity) where TEntity : class, IEntity
        {
            var set = context.Set<TEntity>();
            //ppc 

            if (entity.ID > 0)
            {
                //update

                if (!context.Set<TEntity>().Local.Any(t => t == entity || t.ID == entity.ID))
                {

                    set.Attach(entity);

                    context.Entry(entity).State = EntityState.Modified;
                }
                else
                {
                    var existingEntity = context.Set<TEntity>().Local.Single(t => t == entity || t.ID == entity.ID);

                    context.Entry<TEntity>(existingEntity).CurrentValues.SetValues(entity);

                    context.Entry<TEntity>(existingEntity).State = EntityState.Modified;
                }

            }
            else
            {
                //add
                set.Add(entity);
            }

            context.SaveChanges();

            //entity.ID = dbentity.ID;

        }






        public static void SaveQuery<TEntity>(this SISEntities context, TEntity entity) where TEntity : class, IEntity
        {

            //var set = context.Set(entity.GetType());

            //var dbentity = set.Find(entity.ID);

            //if (dbentity != null)
            //{
            //    var entry = context.Entry(dbentity);

            //    entry.CurrentValues.SetValues(entity);
            //}
            //else
            //{
            //    set.Add(entity);
            //}

            var set = context.Set(entity.GetType());
            //ppc 

            if (entity.ID > 0)
            {
                //update

                if (!set.Local.Any(t =>
                        {
                            IEntity p = (IEntity)t;
                            var r = (p == entity || p.ID == entity.ID);
                            return r;
                        }
                    ))
                {

                    set.Attach(entity);

                    context.Entry(entity).State = EntityState.Modified;
                }
                else
                {
                    var existingEntity = set.Local.Single(t =>
                    {
                        IEntity p = (IEntity)t;
                        var r = (p == entity || p.ID == entity.ID);
                        return r;
                    });

                    context.Entry(existingEntity).CurrentValues.SetValues(entity);

                    context.Entry(existingEntity).State = EntityState.Modified;
                }

            }
            else
            {
                //add
                set.Add(entity);
            }




            //context.SaveChanges();

            //entity.ID = dbentity.ID;

        }



        public static void Delete<TEntity>(this SISEntities context, TEntity entity) where TEntity : class, IEntity
        {
            var set = context.Set<TEntity>();

            var dbentity = set.Find(entity.ID);

            if (dbentity != null)
            {
                set.Remove(dbentity);

                context.SaveChanges();
            }
        }


        public static void DeleteWithRelatedObjects<TEntity>(this SISEntities context, TEntity entity, bool root = true) where TEntity : class, IEntity
        {
            //var set = context.Set<TEntity>();

            if (entity == null)
                return;

            var set = context.Set(entity.GetType());

            var dbentity = set.Find(entity.ID);

            var entry = context.Entry(dbentity);

            var children = dbentity.GetType().GetProperties()
               .Where(p => p.PropertyType.IsGenericType && p.PropertyType.GetGenericTypeDefinition() == typeof(ICollection<>)).ToList();

            foreach (var child in children)
            {
                var collection = (col.IEnumerable)child.GetValue(dbentity, null);

                List<object> relatedItems = new List<object>();

                foreach (var item in collection)
                {
                    relatedItems.Add(item);
                }

                foreach (var relatedEntity in relatedItems.ToList())
                {
                    context.DeleteWithRelatedObjects((IEntity)relatedEntity, false);

                    var relatedEntitySet = context.Set(relatedEntity.GetType());

                    //if (relatedEntitySet != null)
                    //    relatedEntitySet.Remove(relatedEntity);


                }


            }



            set.Remove(dbentity);
            context.SaveChanges();
        }
    }






    //public class BatchSave
    //{
    //    public List<BatchLevel> Levels;
    //}


    //public class BatchLevel
    //{
    //    public BatchLevel ChildLevel;

    //    public List<BatchItem> Items;


    //}


    public delegate void mydelegate();

    public class BatchSave
    {
        public SISEntities contxt;
        public TransactionHandler Transaction;


        public Dictionary<int, List<BatchItem>> Items { get; set; }
        public BatchItem SaveQuery(BatchItem item, int order)
        {
            if (!Items.ContainsKey(order))
                Items[order] = new List<BatchItem>();
            Items[order].Add(item);

            return item;
        }



        public void Process(int order)
        {

            if (order != 0)
                throw new Exception("Call Process method from root parent save method");

            Items.OrderBy(t => t.Key);


            contxt.Configuration.AutoDetectChangesEnabled = false;

            foreach (var batchitems in Items)
            {

                //int i = 0;
                foreach (var batchItem in batchitems.Value)
                {
                    //i++;
                    batchItem.Preprocess();
                    contxt.SaveQuery(batchItem.entity);

                    //contxt.SaveChanges();

                    //if (i % 1000 == 0)
                    //{
                    //    contxt.SaveChanges();
                    //    contxt.Dispose();
                    //    contxt = new SISEntities();
                    //}

                }

                contxt.SaveChanges();


                foreach (var batchItem in batchitems.Value)
                {
                    batchItem.PostProcess();
                }


            }


        }



    }

    public static class NonGenericLinq
    {
        public static bool Any(this objcol.IList col, Func<object, bool> predicate)
        {
            bool result = false;
            foreach (object obj in col)
            {
                result = result || predicate(obj);
            }

            return result;
        }


        public static object Single(this objcol.IList col, Func<object, bool> predicate)
        {
            object item = null;
            int count = 0;
            foreach (object obj in col)
            {
                if (predicate(obj))
                {
                    item = obj;
                    count++;
                }
            }

            if (count > 1)
            {
                throw new Exception("Sequence containse more than one element");
            }
            else if (count < 1)
            {
                throw new Exception("Sequence containse no element");
            }

            return item;
        }

    }


    //mydelegate x = () => dbProgramBlock.ProgramID = GetTrackedEntityID(dbProgramBlock.ProgramID);

    public class BatchItem
    {
        public IEntity entity;
        public mydelegate preprocess;
        public mydelegate postprocess;

        public void Preprocess()
        {
            if (preprocess != null)
                preprocess();
        }

        public void PostProcess()
        {
            if (postprocess != null)
                postprocess();
        }


    }
}
