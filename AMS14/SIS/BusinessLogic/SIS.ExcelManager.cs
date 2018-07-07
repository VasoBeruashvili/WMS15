using SIS.ViewModel;
using Spire.Xls;
using System;
using System.Linq;

namespace SIS.BusinessLogic
{
    public partial class SIS
    {
        public ExcelProductModel ToExcel(ExcelProductModel model, string currentUserID)
        {
            try
            {
                if (currentUserID != string.Empty)
                {
                    Workbook workbook = new Workbook();

                    //Load workbook from disk.
                    string file = string.Format(@"E:\My Projects\Development\WMS15 Final Beta v1.0\Excel_xls\waybill_goods_{0}.xls", currentUserID);
                    workbook.LoadFromFile(file);
                    //Initialize worksheet
                    Worksheet worksheet = workbook.Worksheets[0];

                    worksheet.Range["A2:A700"].ClearContents();
                    worksheet.Range["B2:B700"].ClearContents();
                    worksheet.Range["D2:D700"].ClearContents();
                    worksheet.Range["E2:E700"].ClearContents();
                    worksheet.Range["F2:F700"].ClearContents();
                    worksheet.Range["G2:G700"].ClearContents();
                    worksheet.Range["H2:H700"].ClearContents();

                    for (int i = 0, j = 2; i < model.ExcelNode.Count() && j < model.ExcelNode.Count() + 2; i++, j++)
                    {
                        worksheet.Range[j, 1].Value = model.ExcelNode[i].Name;
                        worksheet.Range[j, 2].Value = model.ExcelNode[i].ProductID.ToString();
                        worksheet.Range["D" + j].Value = model.ExcelNode[i].SizeUnitName;
                        worksheet.Range[j, 6].Value = model.ExcelNode[i].Amount.ToString();
                        worksheet.Range[j, 7].Value = model.ExcelNode[i].OutputPrice.ToString();
                        worksheet.Range[j, 8].Value = model.ExcelNode[i].TotalPrice.ToString();
                    }

                    workbook.Save();



                    var currentFileContent = System.IO.File.ReadAllBytes(file);
                    var currentFileName = string.Format("zednadebi_{0}.xls", currentUserID);
                    var currentFile = new FileModel
                    {
                        FileContent = currentFileContent,
                        FileName = currentFileName
                    };

                    UploadFile(currentFile);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
