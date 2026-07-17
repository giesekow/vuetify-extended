import { sleep } from "./general";

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