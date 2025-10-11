"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$excel = exports.createWorkbook = exports.writeTables = exports.writeData = exports.readRowsFromFile = exports.readSheetFromFile = exports.saveWorkBooks = exports.saveWorkBook = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const file_saver_1 = require("file-saver");
const jszip_1 = __importDefault(require("jszip"));
const replacements = [
    ["<b>", ""],
    ["</b>", ""],
    ["&emsp;", ""]
];
function writeHeaders(sheet, headers, row, col) {
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
                    }
                    else {
                        const rowItem = sheet.getRow(row);
                        rowItem.getCell(col + h).value = column.text || "";
                    }
                }
                else {
                    rowCount += writeHeaders(sheet, column, row + h, col);
                }
            }
            if (hasRow)
                rowCount += 1;
        }
    }
    return rowCount;
}
function writeCellItem(sheet, item, row, col, colspan) {
    let colCnt = 1;
    if (!colspan)
        colspan = 1;
    if (!item && item !== 0)
        return colspan;
    if (item instanceof Date) {
        const rowItem = sheet.getRow(row);
        rowItem.getCell(col).value = item;
    }
    else if (typeof item === 'object') {
        const rowItem = sheet.getRow(row);
        rowItem.getCell(col).value = item.formula && Object.keys(item).includes('result') ? item : (item.value || '');
    }
    else {
        const rowItem = sheet.getRow(row);
        if (typeof item === 'string') {
            let itm = item;
            for (const rep of replacements) {
                const re = new RegExp(rep[0], 'gi');
                itm = itm.replace(re, rep[1]);
            }
            rowItem.getCell(col).value = itm;
        }
        else {
            rowItem.getCell(col).value = item;
        }
    }
    if (colspan > 1) {
        sheet.mergeCells(row, col, row, col + colspan - 1);
        colCnt = colspan;
    }
    return colCnt;
}
function getField(item, key) {
    if (key) {
        const val = key.toString().split(".").reduce((c, r) => { return c ? c[r] : c; }, item);
        return val;
    }
    return null;
}
const saveWorkBook = function (filename, workbook) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = yield workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        (0, file_saver_1.saveAs)(blob, filename);
    });
};
exports.saveWorkBook = saveWorkBook;
const saveWorkBooks = function (filename, workbooks, names) {
    return __awaiter(this, void 0, void 0, function* () {
        const zip = new jszip_1.default();
        for (let i = 0; i < workbooks.length; i++) {
            const workbook = workbooks[i];
            const name = names[i];
            const buffer = yield workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            zip.file(name, blob, { binary: true });
        }
        const content = yield zip.generateAsync({ type: "blob" });
        (0, file_saver_1.saveAs)(content, filename);
    });
};
exports.saveWorkBooks = saveWorkBooks;
const readSheetFromFile = function (file, sheetName, headers, hasHeaders) {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.default.Workbook();
        yield workbook.xlsx.load(file);
        const worksheet = workbook.getWorksheet(sheetName);
        const data = [];
        worksheet.eachRow((row, index) => {
            if (!(hasHeaders && index === 1)) {
                const rowData = row.values;
                rowData.splice(0, 1);
                if (headers) {
                    const obj = {};
                    for (let i = 0; i < rowData.length; i++) {
                        const hd = headers[i];
                        if (hd) {
                            if (typeof hd === "string") {
                                obj[hd] = rowData[i];
                            }
                            else if (typeof hd === "object") {
                                if (hd.value)
                                    obj[hd.value] = hd.format ? hd.format(rowData[i], rowData, obj) : rowData[i];
                            }
                        }
                    }
                    data.push(obj);
                }
                else {
                    data.push(rowData);
                }
            }
        });
        return data;
    });
};
exports.readSheetFromFile = readSheetFromFile;
const readRowsFromFile = function (file, sheetName, start, length) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.default.Workbook();
        yield workbook.xlsx.load(file);
        const worksheet = workbook.getWorksheet(sheetName);
        const data = [];
        (_a = worksheet.getRows(start, length)) === null || _a === void 0 ? void 0 : _a.forEach((row) => {
            const rowData = row.values;
            rowData.splice(0, 1);
            data.push(rowData);
        });
        return data;
    });
};
exports.readRowsFromFile = readRowsFromFile;
const writeData = function (sheetNames, data, workbook) {
    if (!workbook)
        workbook = new exceljs_1.default.Workbook();
    for (let i = 0; i < sheetNames.length; i++) {
        const sn = sheetNames[i];
        if (data[sn]) {
            const sdata = data[sn];
            const sheet = workbook.addWorksheet(sn);
            const headers = sdata.headers || [];
            const items = sdata.items || [];
            const itemHeader = sdata.itemHeader || [];
            let curRow = 1;
            if (headers.length > 0) {
                curRow += writeHeaders(sheet, headers, curRow, 1);
            }
            for (let ii = 0; ii < items.length; ii++) {
                const item = items[ii];
                let curCol = 1;
                if (Array.isArray(item)) {
                    for (let c = 0; c < item.length; c++) {
                        curCol += writeCellItem(sheet, item[c], curRow, curCol);
                    }
                }
                else if (typeof item === "object") {
                    for (let h = 0; h < itemHeader.length; h++) {
                        const hd = itemHeader[h];
                        if (typeof hd === "string") {
                            const val = getField(item, hd);
                            curCol += writeCellItem(sheet, val, curRow, curCol);
                        }
                        else if (typeof hd === "object") {
                            if (hd.key) {
                                const val = hd.format ? hd.format(getField(item, hd.key), item) : getField(item, hd.key);
                                curCol += writeCellItem(sheet, val, curRow, curCol);
                            }
                            else {
                                curCol += 1;
                            }
                        }
                        else {
                            curCol += 1;
                        }
                    }
                }
                else {
                    const rowItem = sheet.getRow(curRow);
                    rowItem.getCell(curCol).value = item;
                }
                curRow += 1;
            }
        }
    }
    return workbook;
};
exports.writeData = writeData;
const writeTables = function (sheetNames, data, workbook) {
    if (!workbook)
        workbook = new exceljs_1.default.Workbook();
    for (let i = 0; i < sheetNames.length; i++) {
        const sn = sheetNames[i];
        const dt = data[sn];
        if (!dt)
            continue;
        const pre = dt.pre || [];
        const post = dt.post || [];
        const items = dt.items || [];
        const headers = dt.headers || [];
        const additionalHeaders = dt.additionalHeaders || null;
        const footers = dt.footers || [];
        const sheet = workbook.addWorksheet(sn);
        let curRow = 1;
        let curCol = 1;
        for (let ii = 0; ii < pre.length; ii++) {
            const item = pre[ii];
            curCol = 1;
            if (Array.isArray(item)) {
                for (let c = 0; c < item.length; c++) {
                    curCol += writeCellItem(sheet, item[c], curRow, curCol);
                }
            }
            else {
                const rowItem = sheet.getRow(curRow);
                rowItem.getCell(curCol).value = item;
            }
            curRow += 1;
        }
        if (additionalHeaders && additionalHeaders.length > 0) {
            for (let h = 0; h < additionalHeaders.length; h++) {
                const headerRow = additionalHeaders[h].columns || [];
                curCol = 1;
                for (let hr = 0; hr < headerRow.length; hr++) {
                    const headerRowItem = headerRow[hr];
                    if (typeof headerRowItem === "string") {
                        curCol += writeCellItem(sheet, headerRowItem, curRow, curCol);
                    }
                    else if (typeof headerRowItem === "object") {
                        curCol += writeCellItem(sheet, headerRowItem.text, curRow, curCol, headerRowItem.colspan || 1);
                    }
                }
                curRow += 1;
            }
        }
        else {
            curCol = 1;
            for (let hr = 0; hr < headers.length; hr++) {
                const headerItem = headers[hr];
                if (typeof headerItem === "string") {
                    curCol += writeCellItem(sheet, headerItem, curRow, curCol);
                }
                else if (typeof headerItem === "object") {
                    curCol += writeCellItem(sheet, headerItem.title, curRow, curCol, headerItem.colspan || 1);
                }
            }
            curRow += 1;
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            curCol = 1;
            for (let hr = 0; hr < headers.length; hr++) {
                const headerItem = headers[hr];
                if (typeof headerItem === "string") {
                    const value = getField(item, headerItem) || "";
                    curCol += writeCellItem(sheet, value, curRow, curCol);
                }
                else if (typeof headerItem === "object") {
                    let value = headerItem.key ? getField(item, headerItem.key) : "";
                    if (headerItem.exportFormat && typeof headerItem.exportFormat === "function")
                        value = headerItem.exportFormat(value, item);
                    else if (headerItem.format && typeof headerItem.format === "function")
                        value = headerItem.format(value, item);
                    curCol += writeCellItem(sheet, value, curRow, curCol);
                }
            }
            curRow += 1;
        }
        for (let i = 0; i < footers.length; i++) {
            const item = footers[i];
            curCol = 1;
            for (let hr = 0; hr < headers.length; hr++) {
                const headerItem = headers[hr];
                if (typeof headerItem === "string") {
                    const value = item[headerItem] || "";
                    curCol += writeCellItem(sheet, value, curRow, curCol);
                }
                else if (typeof headerItem === "object") {
                    let value = headerItem.key ? getField(item, headerItem.key) : "";
                    if (headerItem.footerExportFormat && typeof headerItem.footerExportFormat === "function")
                        value = headerItem.footerExportFormat(value, item);
                    else if (headerItem.footerFormat && typeof headerItem.footerFormat === "function")
                        value = headerItem.footerFormat(value, item);
                    curCol += writeCellItem(sheet, value, curRow, curCol);
                }
            }
            curRow += 1;
        }
        for (let ii = 0; ii < post.length; ii++) {
            const item = pre[ii];
            curCol = 1;
            if (Array.isArray(item)) {
                for (let c = 0; c < item.length; c++) {
                    curCol += writeCellItem(sheet, item[c], curRow, curCol);
                }
            }
            else {
                const rowItem = sheet.getRow(curRow);
                rowItem.getCell(curCol).value = item;
            }
            curRow += 1;
        }
    }
    return workbook;
};
exports.writeTables = writeTables;
const createWorkbook = function () {
    const workbook = new exceljs_1.default.Workbook();
    return workbook;
};
exports.createWorkbook = createWorkbook;
exports.$excel = {
    saveWorkBook: exports.saveWorkBook,
    saveWorkBooks: exports.saveWorkBooks,
    readSheetFromFile: exports.readSheetFromFile,
    writeData: exports.writeData,
    writeTables: exports.writeTables,
    createWorkbook: exports.createWorkbook,
    readRowsFromFile: exports.readRowsFromFile
};
