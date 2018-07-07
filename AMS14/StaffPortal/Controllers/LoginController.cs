using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Web.Security;
using StaffPortal.Models;
using SIS.BusinessLogic.Accounts;

using System.Runtime.InteropServices;

using SIS;
using SIS.DataModel;
using SIS.BusinessLogic;
using SIS.ViewModel;
using SIS.ViewModel.Filter;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Text;
using System.IO;


using StaffPortal.Accounts;
using SIS.ViewModel.Exceptions;
using CommonModel.ViewModel.Exceptions;
using System.Data.Entity.Core;

namespace StaffPortal.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
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

        //
        // GET: /Login/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Id()
        {
            return View();
        }
        public ActionResult Bio()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Login()
        {
            ViewBag.message = "";
            return View("Login");
        }

        [HttpPost]
        public ActionResult Login(string username, string password, string returnUrl)
        {
            returnUrl = "/Home/Index";

            if (Membership.ValidateUser(username, password))
            {
                FormsAuthentication.SetAuthCookie(username, false);

                if (!String.IsNullOrEmpty(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                else return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.ValidateUserMessage = "სახელი ან პაროლი არასწორია!";
                return View("Index");
            }
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
        public ActionResult Logout()
        {
            var makeBalance = BisinesLogic.WorkEnd(new CustomerModel());

            FormsAuthentication.SignOut();
            SetTaskbar(AppBarStates.AlwaysOnTop);
            return RedirectToAction("Index", "Login");
        }        
    }
}
