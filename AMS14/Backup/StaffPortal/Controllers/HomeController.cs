using System;
using SIS;
using SIS.DataModel;
using SIS.BusinessLogic;
using SIS.ViewModel;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SIS.ViewModel.Filter;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Text;
using System.IO;

using System.Runtime.InteropServices;

using StaffPortal.Accounts;
using System.Web.Security;
using SIS.ViewModel.Exceptions;
using CommonModel.ViewModel.Exceptions;
using System.Data.Entity.Core;

namespace StaffPortal.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {

        // FindWindow import
        [DllImport("user32.dll")]
        public static extern IntPtr FindWindow(string lpClassName,
        string lpWindowName);

        // SHAppBarMessage import
        [DllImport("shell32.dll")]
        public static extern UInt32 SHAppBarMessage(UInt32 dwMessage,
        ref APPBARDATA pData);

        // taskbar messages
        public enum AppBarMessages
        {
            New = 0x00000000,
            Remove = 0x00000001,
            QueryPos = 0x00000002,
            SetPos = 0x00000003,
            GetState = 0x00000004,
            GetTaskBarPos = 0x00000005,
            Activate = 0x00000006,
            GetAutoHideBar = 0x00000007,
            SetAutoHideBar = 0x00000008,
            WindowPosChanged = 0x00000009,
            SetState = 0x0000000a
        }

        // possible taskbar states for AppBarMessages.SetState
        public enum AppBarStates
        {
            AutoHide = 0x00000001,
            AlwaysOnTop = 0x00000002
        }

        // RECT structure
        [StructLayout(LayoutKind.Sequential)]
        public struct RECT
        {
            public UInt32 left;
            public UInt32 top;
            public UInt32 right;
            public UInt32 bottom;
        }

        // APPBARDATA structure
        [StructLayout(LayoutKind.Sequential)]
        public struct APPBARDATA
        {
            public UInt32 cbSize;
            public IntPtr hWnd;
            public UInt32 uCallbackMessage;
            public UInt32 uEdge;
            public RECT rc;
            public Int32 lParam;
        }

        // SetTaskbar helper function
        static public void SetTaskbar(AppBarStates mode)
        {
            APPBARDATA msgData = new APPBARDATA();

            // initialize structure
            msgData.cbSize = (UInt32)Marshal.SizeOf(msgData);
            msgData.hWnd = FindWindow("System_TrayWnd", null);
            msgData.lParam = (Int32)(mode);

            // send message
            SHAppBarMessage((UInt32)AppBarMessages.SetState, ref msgData);
        }

        SIS.BusinessLogic.SIS _busineslogic;

        public SIS.BusinessLogic.SIS BisinesLogic
        {
            get
            {
                return _busineslogic ?? (_busineslogic = new SIS.BusinessLogic.SIS());
            }
        }

        [STAThread]
        public ActionResult Index()
        {
            //SetTaskbar(AppBarStates.AutoHide);
            return View();
        }

        #region TASK BAR
        [STAThread]
        public JsonResult ShowTaskBar()
        {
            SetTaskbar(AppBarStates.AlwaysOnTop);
            return Json(new { success = true, msg = "მოთხოვნა დამუშავდა" }, JsonRequestBehavior.AllowGet);
        }

        [STAThread]
        public JsonResult HideTaskBar()
        {
            SetTaskbar(AppBarStates.AutoHide);
            return Json(new { success = true, msg = "მოთხოვნა დამუშავდა" }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region tbl Controllers

        public JsonResult GetProductByID(int? productID)
        {
            return this.CustomJson(() => BisinesLogic.GetProductByID(productID));
        }

        public JsonResult GetAllCustomers(CustomerFilterModel filter, int? start, int? limit)
        {
            filter.start = start;
            filter.limit = limit;

            return Json(new { success = true, root = BisinesLogic.GetAllCustomers(filter), count = filter.count });
        }

        public JsonResult SaveOperation(OperationModel operationModel)
        {
            return this.CustomJson(() => BisinesLogic.SaveOperation(operationModel));
        }
        public JsonResult SaveDetail(DetailModel detailModel)
        {
            return this.CustomJson(() => BisinesLogic.SaveDetail(detailModel));
        }
        public JsonResult SaveDetailO(DetailModel detailModel)
        {
            return this.CustomJson(() => BisinesLogic.SaveDetailO(detailModel));
        }

        public JsonResult GetAllSizeUnits()
        {
            return this.CustomJson(() => BisinesLogic.GetAllSizeUnits());
        }

        public JsonResult SaveCustomer(CustomerModel customerModel)
        {
            return this.CustomJson(() => BisinesLogic.SaveCustomer(customerModel));
        }

        public JsonResult GetActiveCustomers(CustomerFilterModel filter)
        {
            return this.CustomJson(() => BisinesLogic.GetActiveCustomers(filter));
        }

        public JsonResult GetActiveProducts(ProductFilterModel filter)
        {
            return this.CustomJson(() => BisinesLogic.GetActiveProducts(filter));
        }

        public JsonResult GetActiveDistributors(DistributorFilterModel filter)
        {
            return this.CustomJson(() => BisinesLogic.GetActiveDistributors(filter));
        }

        public JsonResult WorkEnd(CustomerModel model)
        {
            return this.CustomJson(() => BisinesLogic.WorkEnd(model));
        }

        public JsonResult GetAllDistributors(DistributorFilterModel filter, int? start, int? limit)
        {
            filter.start = start;
            filter.limit = limit;

            return Json(new { success = true, root = BisinesLogic.GelAllDistributors(filter), count = filter.count });
        }

        public JsonResult SaveDistributor(DistributorModel distributorModel)
        {
            return this.CustomJson(() => BisinesLogic.SaveDistributor(distributorModel));
        }

        public JsonResult GetAllProducts(ProductFilterModel filter, int? start, int? limit)
        {
            filter.start = start;
            filter.limit = limit;

            return Json(new { success = true, root = BisinesLogic.GetAllProducts(filter), count = filter.count });
        }

        public JsonResult SaveProduct(ProductModel productModel)
        {
            return this.CustomJson(() => BisinesLogic.SaveProduct(productModel));
        }

        public JsonResult GetDetailsByConditions(DetailFilterModel filter, int? start, int? limit)
        {
            filter.start = start.HasValue ? start.Value : 0;

            filter.limit = limit.HasValue ? limit.Value : 20;
            return this.CustomPagingJson(BisinesLogic.GetDetailsByConditions, filter);
        }

        public FileResult GetAttachmentFile()
        {
            try
            {
                var fileName = string.Format("zednadebi_{0}", GetCurrentUserID());
                var res = BisinesLogic.DownloadFile(fileName);
                return File(res.FileContent, "application/vnd.ms-excel", res.FileName);
            }
            catch (Exception)
            {
                throw new Exception("ფაილის ჩამოტვირთვა ვერ მოხერხდა, გაიმეორეთ კიდევ ერთხელ.");
            }
        }

        public int GetCurrentUserID()
        {
            UserProvider userProvider = new UserProvider();

            var currentUser = userProvider.GetUser(User.Identity.Name);

            return currentUser.ID;
        }

        //public JsonResult GetBalanceByDate(BalanceFilterModel filter, int? start, int? limit)
        //{
        //    filter.start = start;
        //    filter.limit = limit;

        //    return Json(new { success = true, root = BisinesLogic.GetBalanceByDate(filter), count = filter.count });
        //}

        public JsonResult GetBalanceByDate(BalanceFilterModel filter)
        {
            return this.CustomJson(() => BisinesLogic.GetBalanceByDate(filter));
        }

        // Excel
        public JsonResult ToExcel(ExcelProductModel model)
        {
            //var currentUserFolder = string.Format("Folder{0}", GetCurrentUserID());
            //var userFolder = Server.MapPath(string.Format("~/App_Data\\{0}", currentUserFolder));
            //System.IO.File.WriteAllBytes(tmpPath, BL.SM.GetFileByID(registeredAssemblyModel.fileID).FileContent);
            //System.IO.File.Delete(tmpPath);
            string currentUserID = GetCurrentUserID().ToString();
            return this.CustomJson(() => BisinesLogic.ToExcel(model, currentUserID));
        }
        //

        #endregion

        public JsonResult GetTree()
        {
            return Json(BisinesLogic.GetTree(), JsonRequestBehavior.AllowGet);            
        }

        public JsonResult GetConfMenu()
        {
            return Json(BisinesLogic.GetTree(), JsonRequestBehavior.AllowGet);
        }

        #region Accounts

        public CustomJsonResult LoadUser()
        {
            if (User.Identity.IsAuthenticated)
            {
                UserProvider userProvider = new UserProvider();

                return this.CustomJson(() => userProvider.GetUser(User.Identity.Name));
            }
            else
            {
                return null;
            }
        }

        #endregion

    }

    public static class ControllerExtensions
    {
        public static CustomJsonResult CustomJson<TResult>(this Controller controller, Func<TResult> callSite)
        {
            var result = new CustomJsonResult();


            try
            {
                TResult data = callSite();

                result.Data = new
                {
                    root = data,
                    success = true
                };
            }
            catch (Exception ex)
            {
                result.Data = new
                {
                    msg = ex.Message,
                    trace = ex.StackTrace,
                    success = false
                };
            }

            return result;
        }

        public static CustomJsonResult CustomPagingJson<TFilter, TResult>(this Controller controller, Func<TFilter, TResult> callSite, TFilter filter) where TFilter : BaseFilterModel
        {
            var result = new CustomJsonResult();

            try
            {
                TResult data = callSite(filter);

                result.Data = new
                {
                    root = data,
                    success = true,
                    start = filter.start,
                    limit = filter.limit,
                    count = filter.count
                };
            }
            catch (CustomValidationException ex)
            {
                result.Data = new
                {
                    msg = ex.Message,
                    trace = ex.StackTrace,
                    success = false
                };

            }
            catch (CustomException ex)
            {
                result.Data = new
                {
                    msg = ex.Message,
                    trace = ex.StackTrace,
                    success = false,
                    errorCode = ex.ErrorType,
                    noDefaultMessage = ex.NoDefaultMessage,
                    reload = ex.reload
                };

            }
            catch (OptimisticConcurrencyException ex)
            {
                result.Data = new
                {
                    msg = ex.Message,
                    trace = ex.StackTrace,
                    success = false
                };

            }
            catch (Exception ex)
            {
                result.Data = new
                {
                    msg = ex.Message,
                    trace = ex.StackTrace,
                    success = false
                };

            }


            return result;


        }
    }

    public class CustomJsonResult : JsonResult
    {
        public override void ExecuteResult(ControllerContext context)
        {
            var response = context.HttpContext.Response;

            response.ContentEncoding = System.Text.Encoding.UTF8;

            response.ContentType = "application/json";

            JsonSerializer serializer = new JsonSerializer();

            serializer.Converters.Add(new JavaScriptDateTimeConverter());

            serializer.NullValueHandling = NullValueHandling.Include;

            var sb = new StringBuilder();

            var textWriter = new StringWriter(sb);


            serializer.Serialize(new JsonTextWriter(textWriter), Data);

            response.Write(sb.ToString());
        }
    }
}