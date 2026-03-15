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
exports.PrinterBase = void 0;
const ejs_min_js_1 = __importDefault(require("ejs/ejs.min.js"));
const nested_property_1 = __importDefault(require("nested-property"));
const html_to_printer_1 = require("./html-to-printer");
class PrinterBase {
    constructor() {
    }
    getTemplate(tempId, field = "html") {
        return __awaiter(this, void 0, void 0, function* () {
            // this function should return a template field based on the id and should consider the current mode if possible. 
            let data = "";
            return data;
        });
    }
    getTemplateIdByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // This function should return a template id given the name
            return null;
        });
    }
    getTemplateNameById(tempId) {
        return __awaiter(this, void 0, void 0, function* () {
            // This function should return a template name given the id
            return undefined;
        });
    }
    getTemplateByName(name, field = "html") {
        return __awaiter(this, void 0, void 0, function* () {
            // this function should return a template field based on the name and should consider the current mode if possible. 
            let data = "";
            return data;
        });
    }
    getVariables(varnames) {
        return __awaiter(this, void 0, void 0, function* () {
            // this function should return an object with varnames as the key and final variable values as the data. 
            // In case of a variable that needs further processing this should be done here.
            return {};
        });
    }
    getHeader(html, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
    getFooter(html, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
    printFunctions() {
        // Return functions which are available in print and export templates
        return {};
    }
    printHTML(html) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, html_to_printer_1.print)(html);
        });
    }
    compileEJS(html, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolved = yield this.handleIncludes(html, {}, []);
            const footer = yield this.getFooter(html, data);
            const header = yield this.getHeader(html, data);
            const mergedHtml = `${header}${resolved}${footer}`;
            const fn = yield ejs_min_js_1.default.compile(mergedHtml, { client: true, delimiter: "%", openDelimiter: "<", closeDelimiter: ">", async: true });
            const compiled = yield fn(data, null);
            return compiled;
        });
    }
    handleIncludes(html, resolved, heirarchy) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = /#include\([a-zA-Z0-9\-_]+\)/g;
            const tempnames = [];
            html.replace(regex, (match) => {
                const tempname = match.substring(9, match.length - 1);
                tempnames.push(tempname);
                return tempname;
            });
            for (let t = 0; t < tempnames.length; t++) {
                const tempname = tempnames[t];
                let replace = "";
                if (resolved[tempname]) {
                    replace = resolved[tempname];
                }
                else {
                    if (!heirarchy || !heirarchy.includes(tempname)) {
                        const template = yield this.getTemplateByName(tempname, "html");
                        if (template) {
                            let tempHTML = template || "";
                            heirarchy.push(tempname);
                            tempHTML = yield this.handleIncludes(tempHTML, resolved, heirarchy);
                            replace = tempHTML;
                        }
                    }
                }
                html = html.split(`#include(${tempname})`).join(replace);
                resolved[tempname] = replace;
            }
            return html;
        });
    }
    printReport(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let html = yield this.getTemplateByName(name, "html");
            html = yield this.compileEJS(html, data);
            html = yield this.parseVariables(html, data);
            this.printHTML(html);
        });
    }
    parseReport(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let html = yield this.getTemplateByName(name, "html");
            html = yield this.compileEJS(html, data);
            html = yield this.parseVariables(html, data);
            return html;
        });
    }
    printReportById(tempId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let html = yield this.getTemplate(tempId, "html");
            html = yield this.compileEJS(html, data);
            html = yield this.parseVariables(html, data);
            this.printHTML(html);
        });
    }
    parseReportById(tempId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let html = yield this.getTemplate(tempId, "html");
            html = yield this.compileEJS(html, data);
            html = yield this.parseVariables(html, data);
            return html;
        });
    }
    parseHTMLReport(html, data) {
        return __awaiter(this, void 0, void 0, function* () {
            html = yield this.compileEJS(html, data);
            html = yield this.parseVariables(html, data);
            return html;
        });
    }
    parseVariables(html, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const systemvarregex = /\$\$\[([a-zA-Z_]+[a-zA-Z0-9_]*)([.][a-zA-Z0-9_]+)*\]/g;
            const dataregex = /\$\[([a-zA-Z_]+[a-zA-Z0-9_]*)([.][a-zA-Z0-9_]+)*\]/g;
            const dateFields = [];
            const varnames = [];
            html.replace(systemvarregex, (match) => {
                const varname = match.substring(3, match.length - 1);
                varnames.push(varname);
                return varname;
            });
            if (varnames.length > 0) {
                const variables = yield this.getVariables(varnames);
                html = html.replace(systemvarregex, (match) => {
                    const varname = match.substring(3, match.length - 1);
                    const varobject = variables[varname];
                    return varobject || "";
                });
            }
            html = html.replace(dataregex, (match) => {
                const varname = match.substring(2, match.length - 1);
                let value = nested_property_1.default.get(data, varname);
                if (value) {
                    if (dateFields.includes(varname)) {
                        value = (new Date(value)).toLocaleDateString();
                    }
                }
                return value || "";
            });
            return html;
        });
    }
}
exports.PrinterBase = PrinterBase;
