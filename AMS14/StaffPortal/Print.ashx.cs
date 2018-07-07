using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Web;

using SIS.DataModel;
using System.Text;

namespace StaffPortal
{
 
    public class Print : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            Dictionary<string, string> dictionary = new Dictionary<string, string>();
            dictionary.Add("ა", "a");
            dictionary.Add("ბ", "b");
            dictionary.Add("გ", "g");
            dictionary.Add("დ", "d");
            dictionary.Add("ე", "e");

            SISEntities db = new SISEntities();
            string reportName = "";
            string reportFileName = "";

            context.Response.ContentType = "application/pdf";

            var reportServerAdress = "";

            reportServerAdress = "http://217.147.232.178/ReportServer";


            string paramName = "";

            var par = context.Request.Params["ProgramID"];

            try
            {

                if (par != null)
                {
                    paramName = "ProgramID";

                    int progID = int.Parse(par);

                }
                else
                {
                    par = context.Request.Params["CourseID"];
                    paramName = "CourseID";

                    int courseID = int.Parse(par);


                }
            }
            catch (Exception ex)
            {
                throw ex;
            }




            reportName = context.Request.Params["ReportName"];




            List<ReportParameter> param = new List<ReportParameter>
            {
                new ReportParameter(paramName, par)
            };

            var r = new ServerReport
            {
                ReportServerCredentials = new ReportServerCredentials(),
                ReportServerUrl = new Uri(reportServerAdress),
                ReportPath = "/" + reportName
            };

            r.SetParameters(param);



            context.Response.Clear();


            string encodedFilename = HttpUtility.UrlPathEncode(reportFileName);

            context.Response.ContentEncoding = Encoding.UTF8;
            context.Response.HeaderEncoding = Encoding.UTF8;
            context.Response.ContentType = "application/pdf";
            context.Response.BinaryWrite(r.Render("pdf"));
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }


    [Serializable]
    public sealed class ReportServerCredentials : IReportServerCredentials
    {
        public WindowsIdentity ImpersonationUser
        {
            get
            {
                return null;
            }
        }

        public ICredentials NetworkCredentials
        {
            get
            {
                string userName = "gdzneladze";

                if (string.IsNullOrEmpty(userName))
                    throw new Exception("Missing user name from web.config file");

                string password = "1qaz!QAZ";

                if (string.IsNullOrEmpty(password))
                    throw new Exception("Missing password from web.config file");

                return new NetworkCredential(userName, password);
            }
        }

        public bool GetFormsCredentials(out Cookie authCookie,
                    out string userName, out string password,
                    out string authority)
        {
            authCookie = null;
            userName = null;
            password = null;
            authority = null;
            return false;
        }
    }
}