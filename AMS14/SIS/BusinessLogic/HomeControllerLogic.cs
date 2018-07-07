using System;
using SIS.DataModel;
using SIS.ViewModel;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIS.BusinessLogic
{
    public class HomeControllerLogic
    {
        private SISEntities _db;
        public SISEntities db
        {
            get 
            {
                return _db ?? (_db = new SISEntities());
            }
        }
        public List<NavTreeModel> GetTree(NavTreeModel parent=null,List<NavTreeModel> pool=null)
        {
            List<NavTreeModel> FullList;
            List<NavTreeModel> templist;
            if (parent == null)
            {
                FullList = db.MenuItems.ToList().Select(p => new NavTreeModel(p)).ToList();
                templist = FullList.Where(p => p.ParentId == null).Select(q => new NavTreeModel(q) { children = GetTree(q, FullList) }).ToList();
            }
            else
            {
                templist = pool.Where(p => p.ParentId == parent.id).Select(q => new NavTreeModel(q) { children = GetTree(q, pool) }).ToList();
            }
            return templist;
        }
    }
}
