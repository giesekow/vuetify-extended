import { sleep } from "./general";

const PRINT_ELEMENT_ID = 'print-area'
const STYLE_ELEMENT_ID = 'print-area-css'
const PRINT_CSS = `
  @media screen {
    #print-area {
      display: none;
    }
  }
  @media print {
    body * {
      visibility: hidden;
    }
    #print-area, #print-area * {
      visibility: visible;
    }
    #print-area {
      left: 0;
      top: 0;
      width: 100%;
    }
    .break-page {page-break-after: always;}
  }
`
export async function print(html: string) {
  const width=Math.min(screen.availWidth, 1200);
  const height=screen.availHeight;
  const left = (screen.availWidth - width) / 2;

  const pdfWindow = window.open(undefined,'popUpWindow',`height=${height},width=${width},left=${left},top=0,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`);

  if (pdfWindow) {
    pdfWindow.document.open();
    pdfWindow.document.write(html);
    pdfWindow.document.close();
    await sleep(2000);
    pdfWindow.print();
    setTimeout(() => {
      pdfWindow.close();
    }, 100)
  }

}