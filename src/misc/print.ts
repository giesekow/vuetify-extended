import ejs from "ejs";
import nestedProperty from "nested-property";
import { print } from "./html-to-printer";

export class PrinterBase {

  constructor() {
  }

  async getTemplate(tempId: any, field = "html"): Promise<string> {
    // this function should return a template field based on the id and should consider the current mode if possible. 
    let data = "";
    return data;
  }

  async getTemplateIdByName(name: string|undefined): Promise<any> {
    // This function should return a template id given the name
    return null;
  }

  async getTemplateNameById(tempId: any): Promise<string|undefined> {
    // This function should return a template name given the id
    return undefined;
  }

  async getTemplateByName(name: any, field = "html"): Promise<string> {
    // this function should return a template field based on the name and should consider the current mode if possible. 
    let data = "";
    return data;
  }

  async getVariables(varnames: any[]): Promise<any> {
    // this function should return an object with varnames as the key and final variable values as the data. 
    // In case of a variable that needs further processing this should be done here.
    return {}
  }

  async getHeader(html: string, data: any) {
    return ''
  }

  async getFooter(html: string, data: any) {
    return ''
  }

  printFunctions() {
    // Return functions which are available in print and export templates
    return {}
  }

  async printHTML (html: string) {
    await print(html);
  }

  async compileEJS(html: string, data: any): Promise<string> {
    const resolved: any = await this.handleIncludes(html, {}, []);
    const footer = await this.getFooter(html, data);
    const header = await this.getHeader(html, data);
    const mergedHtml = `${header}${resolved}${footer}`;
    const fn: any = await ejs.compile(mergedHtml, {client: true, delimiter: "%", openDelimiter: "<", closeDelimiter: ">", async: true});
    const compiled: string = await fn(data, null);
    return compiled;
  }

  async handleIncludes(html: string, resolved: any, heirarchy: string[]) {
    const regex = /#include\([a-zA-Z0-9\-_]+\)/g
    const tempnames: string[] = [];
    html.replace(regex, (match: string) => {
      const tempname = match.substring(9, match.length - 1);
      tempnames.push(tempname);
      return tempname;
    })
    
    for(let t = 0; t < tempnames.length; t++) {
      const tempname = tempnames[t];
      let replace: any = "";
      if (resolved[tempname]) {
        replace = resolved[tempname];
      } else {
        if (!heirarchy || !heirarchy.includes(tempname)) {
          const template: any = await this.getTemplateByName(tempname, "html");
          if (template) {
            let tempHTML = template || "";
            heirarchy.push(tempname);
            tempHTML = await this.handleIncludes(tempHTML, resolved, heirarchy);
            replace = tempHTML;
          }
        }
      }
      html = html.split(`#include(${tempname})`).join(replace);
      resolved[tempname] = replace;
    }

    return html;
  }

  async printReport(name: string, data: any) {
    let html = await this.getTemplateByName(name, "html");
    html = await this.compileEJS(html, data)
    html = await this.parseVariables(html, data);
    this.printHTML(html);
  }

  async parseReport(name: string, data: any) {
    let html = await this.getTemplateByName(name, "html");
    html = await this.compileEJS(html, data)
    html = await this.parseVariables(html, data);
    return html;
  }

  async printReportById(tempId: any, data: any) {
    let html = await this.getTemplate(tempId, "html");
    html = await this.compileEJS(html, data)
    html = await this.parseVariables(html, data);
    this.printHTML(html);
  }

  async parseReportById(tempId: any, data: any) {
    let html = await this.getTemplate(tempId, "html");
    html = await this.compileEJS(html, data)
    html = await this.parseVariables(html, data);
    return html;
  }

  async parseHTMLReport(html: string, data: any) {
    html = await this.compileEJS(html, data)
    html = await this.parseVariables(html, data);
    return html;
  }

  async parseVariables(html: string, data: any): Promise<any> {
    const systemvarregex = /\$\$\[([a-zA-Z_]+[a-zA-Z0-9_]*)([.][a-zA-Z0-9_]+)*\]/g;
    const dataregex = /\$\[([a-zA-Z_]+[a-zA-Z0-9_]*)([.][a-zA-Z0-9_]+)*\]/g;
    const dateFields: string[] = []

    const varnames: string[] = [];

    html.replace(systemvarregex, (match: string) => {
      const varname = match.substring(3, match.length - 1);
      varnames.push(varname);
      return varname;
    })

    if (varnames.length > 0) {
      const variables = await this.getVariables(varnames)
      html = html.replace(systemvarregex, (match: string) => {
        const varname = match.substring(3, match.length - 1);
        const varobject = variables[varname];
        return varobject || "";
      })
    }

    html = html.replace(dataregex, (match: string) => {
      const varname: string = match.substring(2, match.length - 1);
      let value: any = nestedProperty.get(data, varname);
      if (value) {
        if (dateFields.includes(varname)) {
          value = (new Date(value)).toLocaleDateString();
        }
      }
      return value || "";
    })

    return html;
  }
}