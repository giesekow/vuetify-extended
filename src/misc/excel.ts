import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const replacements = [
  ["<b>", ""],
  ["</b>", ""],
  ["&emsp;", ""]
]

function writeHeaders(sheet: any, headers: any, row: number, col: number): number {
  let rowCount = 0;
  if (headers) {
    if (Array.isArray(headers)) {
      let hasRow = false;
      for (let h = 0; h < headers.length; h++) {
        const column = headers[h];
        if (!Array.isArray(column)) {
          hasRow = true;
          if (typeof column === "string") {
            const rowItem = sheet.getRow(row);
            rowItem.getCell(col + h).value = column;
          } else {
            const rowItem = sheet.getRow(row);
            rowItem.getCell(col + h).value = column.text || "";
          }
        } else {
          rowCount += writeHeaders(sheet, column, row + h, col)
        }
      }
      if (hasRow) rowCount += 1;
    }
  }
  return rowCount;
}

function writeCellItem(sheet: any, item: any, row: number, col: number, colspan?: number): number {
  let colCnt = 1;
  if (!colspan) colspan = 1;
  if (!item && item !== 0) return colspan;
  
  if (item instanceof Date) {
    const rowItem = sheet.getRow(row)
    rowItem.getCell(col).value = item
  } else if (typeof item === 'object') {
    const rowItem = sheet.getRow(row)
    rowItem.getCell(col).value = item.formula && Object.keys(item).includes('result') ? item : (item.value || '')
  } else {
    const rowItem = sheet.getRow(row)
    if (typeof item === 'string') {
      let itm = item;
      for (const rep of replacements) {
        const re = new RegExp(rep[0], 'gi')
        itm = itm.replace(re, rep[1])
      }
      rowItem.getCell(col).value = itm;
    } else {
      rowItem.getCell(col).value = item;
    }
  }
  
  if (colspan > 1) {
    sheet.mergeCells(row, col, row, col + colspan - 1);
    colCnt = colspan;
  }

  return colCnt;
}

function getField(item: any, key: any): any {
  if (key) {
    const val = key.toString().split(".").reduce((c: any, r: any) => { return c ? c[r] : c }, item);
    return val;
  }
  return null;
}

export const saveWorkBook = async function (filename: string, workbook: Excel.Workbook) {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
  saveAs(blob, filename);
}

export const saveWorkBooks = async function (filename: string, workbooks: Excel.Workbook[], names: string[]) {
  const zip = new JSZip();
  for (let i = 0; i < workbooks.length; i++) {
    const workbook = workbooks[i];
    const name = names[i];
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    zip.file(name, blob, {binary: true});
  }
  
  const content = await zip.generateAsync({type:"blob"});
  saveAs(content, filename);
}

export const readSheetFromFile = async function(file: any, sheetName: string, headers?: any, hasHeaders?: boolean): Promise<any> {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  const worksheet = workbook.getWorksheet(sheetName);
  const data: any[] = [];
  worksheet.eachRow((row: any, index: number) => {
    if (!(hasHeaders && index === 1)) {
      const rowData: any[] = row.values;
      rowData.splice(0, 1)
      if (headers) {
        const obj: any = {}
        for(let i = 0; i < rowData.length; i++) {
          const hd: any = headers[i];
          if (hd) {
            if (typeof hd === "string") {
              obj[hd] = rowData[i];
            } else if (typeof hd === "object"){
              if (hd.value) obj[hd.value] = hd.format ? hd.format(rowData[i], rowData, obj) : rowData[i];
            }
          }
        }
        data.push(obj);
      } else {
        data.push(rowData);
      }
    }
  })
  return data;
}

export const readRowsFromFile = async function(file: any, sheetName: string, start: any, length: any): Promise<any> {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(file);
  const worksheet = workbook.getWorksheet(sheetName);
  const data: any[] = [];
  worksheet.getRows(start, length)?.forEach((row: any) => {
    const rowData: any[] = row.values;
    rowData.splice(0, 1)
    data.push(rowData);
  })
  return data;
}

export const writeData = function(sheetNames: string[], data: any, workbook?: Excel.Workbook): Excel.Workbook {
  if (!workbook) workbook = new Excel.Workbook();
  for(let i = 0; i < sheetNames.length; i++) {
    const sn = sheetNames[i];
    if (data[sn]) {
      const sdata: any = data[sn];
      const sheet: any = workbook.addWorksheet(sn);
      const headers: any = sdata.headers || []
      const items: any[] = sdata.items || []
      const itemHeader: any[] = sdata.itemHeader || [];
      let curRow = 1;
      if (headers.length > 0) {
        curRow += writeHeaders(sheet, headers, curRow, 1)
      }

      for (let ii = 0; ii < items.length; ii++) {
        const item: any = items[ii];
        let curCol = 1;
        if (Array.isArray(item)) {
          for (let c = 0; c < item.length; c++) {
            curCol += writeCellItem(sheet, item[c], curRow, curCol);
          }
        } else if (typeof item === "object") {
          for (let h = 0; h < itemHeader.length; h++) {
            const hd = itemHeader[h];
            if (typeof hd === "string") {
              const val = getField(item, hd)
              curCol += writeCellItem(sheet, val, curRow, curCol);
            } else if (typeof hd === "object") {
              if (hd.key) {
                const val = hd.format ? hd.format(getField(item, hd.key), item) : getField(item, hd.key);
                curCol += writeCellItem(sheet, val, curRow, curCol);
              } else {
                curCol += 1;
              }
            } else {
              curCol += 1;
            }
          }
        } else {
          const rowItem = sheet.getRow(curRow);
          rowItem.getCell(curCol).value = item;
        }
        curRow += 1;
      }
    }
  }
  return workbook;
}

export const writeTables = function(sheetNames: string[], data: any, workbook?: Excel.Workbook): Excel.Workbook {
  if (!workbook) workbook = new Excel.Workbook();
  for (let i = 0; i < sheetNames.length; i++) {
    const sn = sheetNames[i];
    const dt = data[sn];
    if (!dt) continue;
    const pre: any[] = dt.pre || [];
    const post: any[] = dt.post || [];
    const items: any[] = dt.items || [];
    const headers: any[] = dt.headers || [];
    const additionalHeaders: any = dt.additionalHeaders || null;
    const footers: any[] = dt.footers || [];
    const sheet: any = workbook.addWorksheet(sn);
    let curRow = 1;
    let curCol = 1;

    for (let ii = 0; ii < pre.length; ii++) {
      const item: any = pre[ii];
      curCol = 1;
      if (Array.isArray(item)) {
        for (let c = 0; c < item.length; c++) {
          curCol += writeCellItem(sheet, item[c], curRow, curCol);
        }
      } else {
        const rowItem = sheet.getRow(curRow);
        rowItem.getCell(curCol).value = item;
      }
      curRow += 1;
    }

    if (additionalHeaders && additionalHeaders.length > 0) {
      for (let h = 0; h < additionalHeaders.length; h++) {
        const headerRow: any = additionalHeaders[h].columns || [];
        curCol = 1;
        for (let hr = 0; hr < headerRow.length; hr++) {
          const headerRowItem: any = headerRow[hr];
          if (typeof headerRowItem === "string") {
            curCol += writeCellItem(sheet, headerRowItem, curRow, curCol);
          } else if (typeof headerRowItem === "object") {
            curCol += writeCellItem(sheet, headerRowItem.text, curRow, curCol, headerRowItem.colspan || 1);
          }
        }
        curRow += 1;
      }
    } else {
      curCol = 1;
      for (let hr = 0; hr < headers.length; hr++) {
        const headerItem: any = headers[hr];
        if (typeof headerItem === "string") {
          curCol += writeCellItem(sheet, headerItem, curRow, curCol);
        } else if (typeof headerItem === "object") {
          curCol += writeCellItem(sheet, headerItem.title, curRow, curCol, headerItem.colspan || 1);
        }
      }
      curRow += 1;
    }

    for (let i = 0; i < items.length; i++) {
      const item: any = items[i];
      curCol = 1;
      for (let hr = 0; hr < headers.length; hr++) {
        const headerItem: any = headers[hr];
        if (typeof headerItem === "string") {
          const value: any = getField(item, headerItem) || "";
          curCol += writeCellItem(sheet, value, curRow, curCol);
        } else if (typeof headerItem === "object") {
          let value: any = headerItem.key ? getField(item, headerItem.key) : "";
          if (headerItem.exportFormat && typeof headerItem.exportFormat === "function") value = headerItem.exportFormat(value, item);
          else if (headerItem.format && typeof headerItem.format === "function") value = headerItem.format(value, item);
          curCol += writeCellItem(sheet, value, curRow, curCol);
        }
      }
      curRow += 1;
    }

    for (let i = 0; i < footers.length; i++) {
      const item: any = footers[i];
      curCol = 1;
      for (let hr = 0; hr < headers.length; hr++) {
        const headerItem: any = headers[hr];
        if (typeof headerItem === "string") {
          const value: any = item[headerItem] || "";
          curCol += writeCellItem(sheet, value, curRow, curCol);
        } else if (typeof headerItem === "object") {
          let value: any = headerItem.key ? getField(item, headerItem.key) : "";
          if (headerItem.footerExportFormat && typeof headerItem.footerExportFormat === "function") value = headerItem.footerExportFormat(value, item);
           else if (headerItem.footerFormat && typeof headerItem.footerFormat === "function") value = headerItem.footerFormat(value, item);
          curCol += writeCellItem(sheet, value, curRow, curCol);
        }
      }
      curRow += 1;
    }

    for (let ii = 0; ii < post.length; ii++) {
      const item: any = pre[ii];
      curCol = 1;
      if (Array.isArray(item)) {
        for (let c = 0; c < item.length; c++) {
          curCol += writeCellItem(sheet, item[c], curRow, curCol);
        }
      } else {
        const rowItem = sheet.getRow(curRow);
        rowItem.getCell(curCol).value = item;
      }
      curRow += 1;
    }
  }
  return workbook;
}

export const createWorkbook = function(): Excel.Workbook {
  const workbook = new Excel.Workbook();
  return workbook;
}

export const $excel = {
  saveWorkBook,
  saveWorkBooks,
  readSheetFromFile,
  writeData,
  writeTables,
  createWorkbook,
  readRowsFromFile
}