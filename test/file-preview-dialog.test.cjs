const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dialogs = fs.readFileSync(path.join(root, 'src/ui/dialogs.ts'), 'utf8');
const field = fs.readFileSync(path.join(root, 'src/ui/field.ts'), 'utf8');
const widgets = fs.readFileSync(path.join(root, 'src/ui/widgets/field-rich-widgets.ts'), 'utf8');
const setup = fs.readFileSync(path.join(root, 'src/setup/index.ts'), 'utf8');

assert.match(dialogs, /export type FilePreviewSource = string\|Blob\|File/);
assert.match(dialogs, /export interface FilePreviewParams extends DocumentPreviewParams/);
assert.match(dialogs, /export interface FilePreviewOptions/);
assert.match(dialogs, /static setFilePreviewDefault\(/);
assert.match(dialogs, /static async \$previewFile\(source: FilePreviewSource, params\?: FilePreviewParams, options\?: FilePreviewOptions\)/);
assert.match(dialogs, /interface ImagePreviewParams extends DialogSizeParams \{[\s\S]*?skin\?: IframeSkin/);

const previewMethod = dialogs.slice(
  dialogs.indexOf('static async $previewFile'),
  dialogs.indexOf('static async $prompt'),
);
assert.match(previewMethod, /previewKind === 'image'/, 'file previews must retain the zoomable image viewer');
assert.match(previewMethod, /previewKind === 'pdf'/, 'PDF files must use the browser document viewer');
assert.match(previewMethod, /\{\.\.\.Dialogs\.documentPreviewDefaults, \.\.\.iframeParams\}/, 'PDF files must retain document-preview defaults');
assert.match(previewMethod, /documentPreviewFileInfo\.value = \{/, 'unsupported files must use the fallback panel');
assert.match(previewMethod, /options\?\.unsupported === 'download'/, 'unsupported files must support direct download');
for (const extension of ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'zip']) {
  assert.match(dialogs, new RegExp(`${extension}: 'application/`), `${extension} URLs must resolve to an unsupported MIME type`);
}

assert.match(dialogs, /private static releaseFilePreviewObjectUrl\(\)/);
assert.match(dialogs, /Dialogs\.releaseFilePreviewObjectUrl\(\)/);
assert.match(dialogs, /private static filePreviewRequest = 0/);
assert.match(dialogs, /const request = \+\+Dialogs\.filePreviewRequest/);
assert.match(dialogs, /expectedRequest !== Dialogs\.filePreviewRequest/);
assert.match(dialogs, /Dialogs\.revokeObjectUrl\(sourceInfo\.objectUrl\)/);
assert.match(dialogs, /openImagePreview[\s\S]*?Dialogs\.documentPreviewDialog\.value = false/);
assert.match(dialogs, /openIframe[\s\S]*?Dialogs\.imagePreviewDialog\.value = false/);
assert.doesNotMatch(
  dialogs.match(/private static resolveFilePreviewSource[\s\S]*?private static resolveFilePreviewKind/)?.[0] || '',
  /releaseFilePreviewObjectUrl/,
  'preparing a replacement preview must not revoke the currently displayed Blob URL',
);
assert.match(dialogs, /Dialogs\.releaseDocumentPreviewObjectUrl\(\)/);
assert.match(dialogs, /ve\.dialog\.preview\.unavailableDescription/);
assert.match(dialogs, /ve\.dialog\.preview\.imageTitle/);
assert.match(dialogs, /ve\.dialog\.preview\.imageAlt/);

const imageComponent = dialogs.slice(
  dialogs.indexOf('static imagePreviewComponent'),
  dialogs.indexOf('static iframeComponent'),
);
const iframeComponent = dialogs.slice(
  dialogs.indexOf('static iframeComponent'),
  dialogs.indexOf('static successComponent'),
);
for (const token of ['surface', 'background', 'on-surface']) {
  assert.match(dialogs, new RegExp(`--v-theme-${token}`), `preview dialogs must use Vuetify's ${token} theme token`);
}
assert.match(imageComponent, /resolvePreviewTheme\(Dialogs\.imagePreviewParams\.value\)/);
assert.doesNotMatch(imageComponent, /background: '#0f172a'/, 'image preview must not force a dark background');
assert.doesNotMatch(imageComponent, /color: 'white'/, 'image preview controls must inherit theme colors');
assert.doesNotMatch(imageComponent, /button\.setParams/, 'rendering image actions must not mutate caller-owned buttons');
assert.match(iframeComponent, /resolveDocumentPreviewTheme\(\)/);
assert.doesNotMatch(iframeComponent, /background: 'white'/, 'iframe shell must not force a light background');
assert.doesNotMatch(iframeComponent, /button\.setParams/, 'rendering iframe actions must not mutate caller-owned buttons');
assert.match(dialogs, /color: buttonParams\.color \|\| theme\.actionColor \|\| undefined/);

const openMediaMethod = field.slice(
  field.indexOf('private async openMediaItem'),
  field.indexOf('private async onOtpFinished'),
);
assert.match(openMediaMethod, /Dialogs\.\$previewFile\(source/);
assert.doesNotMatch(openMediaMethod, /URL\.createObjectURL/);
assert.doesNotMatch(openMediaMethod, /Dialogs\.\$(?:imagePreview|documentPreview|iframe)/);

const fullscreenMethod = field.slice(
  field.indexOf('private showFullscreen'),
  field.indexOf('private async loadCollectionInformation'),
);
assert.match(fullscreenMethod, /Dialogs\.\$previewFile\(data/);

assert.match(setup, /filePreview\?: FilePreviewParams/);
assert.match(setup, /Dialogs\.setFilePreviewDefault\(defaults\.filePreview, reset\)/);
assert.match(widgets, /ve\.field\.fileUpload\.pending/);
assert.match(widgets, /ve\.field\.fileTypeFallback/);

console.log('File preview dialog tests passed.');
