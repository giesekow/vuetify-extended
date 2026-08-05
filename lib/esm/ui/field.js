var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nextTick } from "vue";
import { UIBase } from "./base";
import { VAutocomplete, VBtn, VCard, VCheckboxBtn, VCol, VColorInput, VCombobox, VDialog, VFileUpload, VIcon, VOtpInput, VRadio, VRadioGroup, VRow, VSelect, VSwitch, VTextField, VTextarea } from 'vuetify/components';
import { Master } from "../master";
import * as webtex from 'webtex';
import { fileToBase64, selectFile, SimpleDate, SimpleTime, sleep } from "../misc";
import { VDataTable, VDataTableFooter } from "vuetify/components";
import Datepicker from '@vuepic/vue-datepicker';
import { Form } from "./form";
import { $v } from "../misc";
import { buildChartWidget, buildCodeWidget, buildHTMLWidget, buildImageWidget, buildMapWidget, buildMessageBoxWidget } from "./widgets/field-rich-widgets";
import { buildReportTableWidget, buildServerTableWidget, buildTableWidget, buildViewTableWidget } from "./widgets/field-table-widgets";
import '@vuepic/vue-datepicker/dist/main.css';
import { Dialogs } from "./dialogs";
import nestedProperty from "nested-property";
import katex from 'katex';
import 'katex/dist/katex.min.css';
const latexPackages = [
    'amsmath',
    'amsthm',
    'bussproofs',
    'color',
    'xcolor',
    'echo',
    'gensymb',
    'graphics',
    'graphicx',
    'hyperref',
    'latexsym',
    'minted',
    'multicol',
    'stix',
    'textcomp',
    'textgreek',
];
export const fieldTypeOptions = [
    { name: 'Text', _id: 'text', id: 'text' }, { name: 'Select', _id: 'select', id: 'select' }, { name: 'Autocomplete', _id: 'autocomplete', id: 'autocomplete' },
    { name: 'Label', _id: 'label', id: 'label' }, { name: 'Messaging Box', _id: 'messagingbox', id: 'messagingbox' }, { name: 'Chart', _id: 'chart', id: 'chart' },
    { name: 'View Table', _id: 'viewtable', id: 'viewtable' }, { name: 'Map', _id: 'map', id: 'map' }, { name: 'Map Line', _id: 'map-line', id: 'map-line' }, { name: 'Map Circle', _id: 'map-circle', id: 'map-circle' }, { name: 'Map Rectangle', _id: 'map-rectangle', id: 'map-rectangle' }, { name: 'Map Polygon', _id: 'map-polygon', id: 'map-polygon' }, { name: 'Map Heatmap', _id: 'map-heatmap', id: 'map-heatmap' }, { name: 'Map Cluster', _id: 'map-cluster', id: 'map-cluster' }, { name: 'Map GeoJSON', _id: 'map-geojson', id: 'map-geojson' }, { name: 'Code', _id: 'code', id: 'code' },
    { name: 'Color', _id: 'color', id: 'color' }, { name: 'HTML', _id: 'html', id: 'html' }, { name: 'HTML View', _id: 'htmlview', id: 'htmlview' }, { name: 'Time', _id: 'time', id: 'time' },
    { name: 'Date', _id: 'date', id: 'date' }, { name: 'Datetime', _id: 'datetime', id: 'datetime' }, { name: 'Button', _id: 'button', id: 'button' },
    { name: 'Image', _id: 'image', id: 'image' }, { name: 'Document', _id: 'document', id: 'document' }, { name: 'Password', _id: 'password', id: 'password' },
    { name: 'Float', _id: 'float', id: 'float' }, { name: 'Integer', _id: 'integer', id: 'integer' }, { name: 'Decimal', _id: 'decimal', id: 'decimal' },
    { name: 'OTP', _id: 'otp', id: 'otp' }, { name: 'File Upload', _id: 'file-upload', id: 'file-upload' },
    { name: 'Collection', _id: 'collection', id: 'collection' }, { name: 'Textarea', _id: 'textarea', id: 'textarea' }, { name: 'Boolean', _id: 'boolean', id: 'boolean' },
    { name: 'Table', _id: 'table', id: 'table' }, { name: 'Report Table', _id: 'reporttable', id: 'reporttable' }, { name: 'Server Table', _id: 'servertable', id: 'servertable' },
];
export class Field extends UIBase {
    constructor(params, options) {
        super();
        this.modelValue = this.$makeRef();
        this.params = this.$makeRef(Object.assign(Object.assign({}, Field.defaultParams), (params || {})));
        this.changing = false;
        if (options === null || options === void 0 ? void 0 : options.master)
            this.setMaster(options.master);
        this.options = options || {};
        this.selectItems = this.$makeRef([]);
        this.optionLoaded = this.$makeRef(false);
        this.collectionLoaded = this.$makeRef(false);
        this.collectionDialog = this.$makeRef(false);
        this.collectionSelectedItems = this.$makeRef([]);
        this.chartLoaded = this.$makeRef(false);
        this.chartOpts = this.$makeRef();
        this.chartValue = this.$makeRef();
        this.loading = this.$makeRef(false);
        this.tableLoaded = this.$makeRef(false);
        this.tableHeaders = this.$makeRef([]);
        this.tableItems = this.$makeRef([]);
        this.tableItemsPerPage = this.$makeRef(25);
        this.tableTotalItems = this.$makeRef(0);
        this.tablePage = this.$makeRef(1);
        this.currentCollectionItems = [];
        this.currentCollectionFooter = [];
        this.maxWidth = this.$makeRef(null);
        this.isEditting = false;
        this.codePreview = this.$makeRef("");
        this.htmlEditor = undefined;
        this.messageVisibleCount = this.$makeRef(0);
        this.messageContainer = this.$makeRef();
        this.pendingMessageScrollRestore = undefined;
        this.autocompleteSearchText = this.$makeRef('');
        this.autocompleteLoading = this.$makeRef(false);
        this.autocompleteLoadingMore = this.$makeRef(false);
        this.autocompleteLoaded = this.$makeRef(false);
        this.autocompletePage = this.$makeRef(1);
        this.autocompleteTotal = this.$makeRef(undefined);
        this.autocompleteHasMore = this.$makeRef(false);
        this.autocompleteRequestId = this.$makeRef(0);
        this.autocompleteResultItems = this.$makeRef([]);
        this.autocompleteResolvedItems = this.$makeRef([]);
        this.autocompleteCache = new Map();
        this.autocompleteMenuClass = `vef-autocomplete-menu-${Math.random().toString(36).slice(2, 10)}`;
        this.selectedFiles = this.$makeRef([]);
        this.resolvedAssets = this.$makeRef([]);
        this.assetResolveRequestId = this.$makeRef(0);
        this.assetUploadPending = this.$makeRef(false);
        this.assetUploading = this.$makeRef(false);
        this.fileUploadLoading = this.$makeRef(false);
    }
    static setDefault(value, reset) {
        if (reset) {
            Field.defaultParams = value;
        }
        else {
            Field.defaultParams = Object.assign(Object.assign({}, Field.defaultParams), value);
        }
    }
    get $refs() {
        const p = this.$parent;
        if (p)
            return p.$refs || {};
        return {};
    }
    get $ref() {
        return this.params.value.ref;
    }
    setParams(params) {
        this.params.value = Object.assign(Object.assign({}, this.params.value), params);
    }
    get $params() {
        return this.params.value;
    }
    get $readonly() {
        if (this.params.value.readonly === true || this.params.value.readonly === false)
            return this.params.value.readonly;
        if (this.$parent && this.$parent.$readonly)
            return this.$parent.$readonly;
        return this.params.value.readonly;
    }
    get $parentReport() {
        return this.$parent ? this.$parent.$parentReport : undefined;
    }
    get $mode() {
        var _a;
        return (_a = this.$parentReport) === null || _a === void 0 ? void 0 : _a.$params.mode;
    }
    isCreateMode() {
        var _a;
        if (this.params.value.readonly) {
            return false;
        }
        if (this.params.value && this.params.value.mode === 'create') {
            return true;
        }
        let parent = this.$parent;
        while (parent) {
            if (((_a = parent.$params) === null || _a === void 0 ? void 0 : _a.mode) === 'create') {
                return true;
            }
            parent = parent.$parent;
        }
        return this.$mode === 'create';
    }
    get $value() {
        const val = this.postprocess(this.modelValue.value);
        if (this.params.value.type === 'decimal') {
            if ((val === null || val === void 0 ? void 0 : val.$numberDecimal) !== undefined)
                return Number(val.$numberDecimal);
        }
        return val;
    }
    get $options() {
        return this.selectItems.value || [];
    }
    get $collectionForm() {
        return this.collectionForm;
    }
    get $selectedFiles() {
        return [...(this.selectedFiles.value || [])];
    }
    get $resolvedAssets() {
        return [...(this.resolvedAssets.value || [])];
    }
    get $hasPendingUpload() {
        return this.assetUploadPending.value === true;
    }
    props() {
        return [];
    }
    setup(props, context) {
        this.$watch(this.modelValue, () => {
            if (this.isAssetMode()) {
                void this.syncResolvedAssets();
            }
            if (this.isServerAutocomplete()) {
                void this.syncServerAutocompleteSelection();
            }
            if (!this.changing)
                this.valueChanged();
        });
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    modelBinding() {
        return {
            modelValue: this.modelValue.value,
            "onUpdate:modelValue": (value) => {
                this.modelValue.value = value;
            }
        };
    }
    componentOptions() {
        return this.params.value.options || {};
    }
    inputIconProps() {
        return this.params.value.icon ? { prependInnerIcon: this.params.value.icon } : {};
    }
    mediaFieldType() {
        const type = this.params.value.type;
        if (type === 'image' || type === 'document' || type === 'file-upload') {
            return type;
        }
        return undefined;
    }
    isMediaField() {
        return !!this.mediaFieldType();
    }
    isAssetMode() {
        return this.isMediaField() && this.params.value.assetMode === true && !!this.assetAdapter();
    }
    assetAdapter() {
        return this.params.value.assetAdapter || Field.defaultParams.assetAdapter;
    }
    assetIdField() {
        return this.params.value.assetIdField || 'id';
    }
    assetPreviewField() {
        return this.params.value.assetPreviewField || 'previewUrl';
    }
    assetDownloadField() {
        return this.params.value.assetDownloadField || 'downloadUrl';
    }
    assetNameField() {
        return this.params.value.assetNameField || 'name';
    }
    assetMimeTypeField() {
        return this.params.value.assetMimeTypeField || 'mimeType';
    }
    assetSizeField() {
        return this.params.value.assetSizeField || 'size';
    }
    resolvedUploadType() {
        return this.params.value.uploadType || 'base64';
    }
    normalizeFiles(files) {
        if (!files) {
            return [];
        }
        if (Array.isArray(files)) {
            return files.filter((file) => file instanceof File);
        }
        if (files instanceof File) {
            return [files];
        }
        return Array.from(files);
    }
    normalizeStoredAssetIds(value) {
        if (value === undefined || value === null || value === '') {
            return [];
        }
        const values = Array.isArray(value) ? value : [value];
        return values
            .map((item) => item === undefined || item === null ? undefined : String(item))
            .filter((item) => !!item && item !== '');
    }
    assetValueFromRecords(records) {
        const ids = records
            .map((record) => nestedProperty.get(record, this.assetIdField()))
            .filter((value) => value !== undefined && value !== null && value !== '');
        if (this.params.value.multiple) {
            return ids;
        }
        return ids[0];
    }
    buildAssetRecordMetadata(record) {
        const name = nestedProperty.get(record, this.assetNameField()) || this.$uiText('ve.field.assetLabel', 'Asset');
        const mimeType = nestedProperty.get(record, this.assetMimeTypeField()) || '';
        const size = nestedProperty.get(record, this.assetSizeField());
        const previewUrl = nestedProperty.get(record, this.assetPreviewField());
        const downloadUrl = nestedProperty.get(record, this.assetDownloadField());
        return {
            key: String(nestedProperty.get(record, this.assetIdField()) || name),
            label: String(name),
            mimeType: mimeType ? String(mimeType) : '',
            size: typeof size === 'number' ? size : undefined,
            previewUrl: previewUrl ? String(previewUrl) : undefined,
            downloadUrl: downloadUrl ? String(downloadUrl) : (previewUrl ? String(previewUrl) : undefined),
            raw: record,
            uploaded: true,
            pending: false,
        };
    }
    hydrateAssetRecords(records) {
        return __awaiter(this, void 0, void 0, function* () {
            const adapter = this.assetAdapter();
            if (!adapter || records.length === 0) {
                return records;
            }
            return Promise.all(records.map((record) => __awaiter(this, void 0, void 0, function* () {
                const nextRecord = Object.assign({}, record);
                if (adapter.getPreviewUrl && !nestedProperty.get(nextRecord, this.assetPreviewField())) {
                    const previewUrl = yield adapter.getPreviewUrl(record, this);
                    if (previewUrl) {
                        nestedProperty.set(nextRecord, this.assetPreviewField(), previewUrl);
                    }
                }
                if (adapter.getDownloadUrl && !nestedProperty.get(nextRecord, this.assetDownloadField())) {
                    const downloadUrl = yield adapter.getDownloadUrl(record, this);
                    if (downloadUrl) {
                        nestedProperty.set(nextRecord, this.assetDownloadField(), downloadUrl);
                    }
                }
                return nextRecord;
            })));
        });
    }
    buildSelectedFileMetadata(file, index) {
        const name = (file === null || file === void 0 ? void 0 : file.name) || `File ${index + 1}`;
        return {
            key: `${name}-${index}`,
            label: name,
            mimeType: (file === null || file === void 0 ? void 0 : file.type) || '',
            size: file === null || file === void 0 ? void 0 : file.size,
            previewUrl: undefined,
            downloadUrl: undefined,
            raw: file,
            uploaded: false,
            pending: true,
        };
    }
    directStoredMediaItems() {
        const value = this.modelValue.value;
        if (value === undefined || value === null || value === '') {
            return [];
        }
        const values = Array.isArray(value) ? value : [value];
        return values.map((item, index) => {
            if (item instanceof File) {
                return this.buildSelectedFileMetadata(item, index);
            }
            if (item && typeof item === 'object' && typeof item.name === 'string') {
                return {
                    key: `${item.name}-${index}`,
                    label: item.name,
                    mimeType: item.type || item.mimeType || '',
                    size: item.size,
                    previewUrl: undefined,
                    downloadUrl: undefined,
                    raw: item,
                    uploaded: false,
                    pending: false,
                };
            }
            const str = String(item || '');
            const isImage = str.includes('image');
            return {
                key: `${index}-${str.slice(0, 24)}`,
                label: values.length > 1 ? this.$uiText('ve.field.fileIndexedLabel', `File ${index + 1}`, { index: index + 1 }) : (this.resolvedLabel() || this.$uiText('ve.field.fileLabel', 'File')),
                mimeType: isImage ? 'image/*' : '',
                size: undefined,
                previewUrl: str,
                downloadUrl: str,
                raw: item,
                uploaded: true,
                pending: false,
            };
        });
    }
    mediaItems() {
        if (this.isAssetMode()) {
            if (this.selectedFiles.value.length > 0 && this.assetUploadPending.value) {
                if (this.params.value.multiple) {
                    return [
                        ...this.resolvedAssets.value.map((record) => this.buildAssetRecordMetadata(record)),
                        ...this.selectedFiles.value.map((file, index) => this.buildSelectedFileMetadata(file, index)),
                    ];
                }
                return this.selectedFiles.value.map((file, index) => this.buildSelectedFileMetadata(file, index));
            }
            return this.resolvedAssets.value.map((record) => this.buildAssetRecordMetadata(record));
        }
        return this.directStoredMediaItems();
    }
    setSelectedFiles(files) {
        this.selectedFiles.value = this.normalizeFiles(files);
    }
    mergeDirectMediaValues(nextValue) {
        if (!this.params.value.multiple) {
            return nextValue;
        }
        const current = this.modelValue.value;
        const currentItems = current === undefined || current === null || current === ''
            ? []
            : (Array.isArray(current) ? [...current] : [current]);
        const nextItems = nextValue === undefined || nextValue === null || nextValue === ''
            ? []
            : (Array.isArray(nextValue) ? nextValue : [nextValue]);
        return currentItems.concat(nextItems);
    }
    $clearSelectedFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearSelectedFiles();
        });
    }
    clearSelectedFiles() {
        this.selectedFiles.value = [];
        this.assetUploadPending.value = false;
    }
    emitFileSelected(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedFiles = files ? this.normalizeFiles(files) : this.$selectedFiles;
            const payload = {
                files: normalizedFiles,
                file: normalizedFiles[0],
                multiple: !!this.params.value.multiple,
                uploadType: this.resolvedUploadType(),
            };
            if (this.options.fileSelected) {
                yield this.options.fileSelected(this, payload);
            }
            this.handleOn('fileSelected', payload);
        });
    }
    emitAssetUploaded(records) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.assetUploaded) {
                yield this.options.assetUploaded(this, records);
            }
            this.handleOn('assetUploaded', records);
        });
    }
    emitAssetsResolved(records) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.assetsResolved) {
                yield this.options.assetsResolved(this, records);
            }
            this.handleOn('assetsResolved', records);
        });
    }
    emitAssetRemoved(records) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.assetRemoved) {
                yield this.options.assetRemoved(this, records);
            }
            this.handleOn('assetRemoved', records);
        });
    }
    removeAssets(records) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!records.length || !this.isAssetMode() || this.params.value.removeAssetOnClear !== true) {
                return;
            }
            const adapter = this.assetAdapter();
            if (!(adapter === null || adapter === void 0 ? void 0 : adapter.remove)) {
                return;
            }
            yield adapter.remove(records, this);
            yield this.emitAssetRemoved(records);
        });
    }
    buildFileMetadata(file) {
        const fileName = (file === null || file === void 0 ? void 0 : file.name) || '';
        const parts = fileName.split('.');
        const extension = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : undefined;
        return {
            name: fileName,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            extension,
        };
    }
    normalizeFilesInput(value) {
        return this.normalizeFiles(value).filter((item) => item instanceof File);
    }
    validateSelectedFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const validFiles = [];
            const maxSize = Number(this.params.value.fileMaxSize || 0);
            for (const file of files) {
                if (maxSize > 0 && file.size > (maxSize * 1024)) {
                    Dialogs.$error(`${file.name} exceeds the maximum allowed size of ${maxSize} KB.`);
                    continue;
                }
                validFiles.push(file);
            }
            return validFiles;
        });
    }
    createDirectUploadValue(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaType = this.mediaFieldType();
            if (mediaType === 'image' || mediaType === 'document') {
                const data = [];
                for (const file of files) {
                    data.push(yield fileToBase64(file, this.params.value.fileMaxSize || 500));
                }
                return this.params.value.multiple ? data : data[0];
            }
            if (this.resolvedUploadType() === 'file') {
                return this.params.value.multiple ? files : files[0];
            }
            if (this.resolvedUploadType() === 'metadata') {
                const metadata = files.map((file) => this.buildFileMetadata(file));
                return this.params.value.multiple ? metadata : metadata[0];
            }
            const encoded = [];
            for (const file of files) {
                encoded.push(yield fileToBase64(file, this.params.value.fileMaxSize || 500));
            }
            return this.params.value.multiple ? encoded : encoded[0];
        });
    }
    $uploadAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAssetMode()) {
                return [];
            }
            const adapter = this.assetAdapter();
            const files = this.$selectedFiles;
            const fieldType = this.mediaFieldType();
            if (!adapter || !fieldType || files.length === 0) {
                return [];
            }
            this.assetUploading.value = true;
            try {
                const existingRecords = this.params.value.multiple ? [...this.resolvedAssets.value] : [];
                const records = yield adapter.upload({
                    files,
                    file: files[0],
                    multiple: !!this.params.value.multiple,
                    fieldType,
                }, this);
                const safeRecords = yield this.hydrateAssetRecords(Array.isArray(records) ? records : []);
                const nextRecords = this.params.value.multiple ? existingRecords.concat(safeRecords) : safeRecords;
                this.resolvedAssets.value = nextRecords;
                this.modelValue.value = this.assetValueFromRecords(nextRecords);
                this.clearSelectedFiles();
                yield this.emitAssetUploaded(safeRecords);
                return safeRecords;
            }
            catch (error) {
                Dialogs.$error((error === null || error === void 0 ? void 0 : error.message) || this.$uiText('ve.field.assetUploadFailed', 'Failed to upload asset files.'));
                throw error;
            }
            finally {
                this.assetUploading.value = false;
            }
        });
    }
    handleSelectedFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalized = yield this.validateSelectedFiles(this.normalizeFiles(files));
            if (normalized.length === 0) {
                if (this.isAssetMode()) {
                    yield this.$clearSelectedFiles();
                }
                else {
                    this.clearSelectedFiles();
                    this.modelValue.value = this.params.value.multiple ? [] : null;
                }
                return;
            }
            if (this.isAssetMode()) {
                const mergedFiles = this.params.value.multiple && this.assetUploadPending.value
                    ? [...this.selectedFiles.value, ...normalized]
                    : normalized;
                this.setSelectedFiles(mergedFiles);
                this.assetUploadPending.value = true;
                yield this.emitFileSelected(mergedFiles);
                if (this.params.value.autoUpload !== false) {
                    yield this.$uploadAssets();
                }
                return;
            }
            try {
                const nextValue = yield this.createDirectUploadValue(normalized);
                this.setSelectedFiles(normalized);
                this.modelValue.value = this.mergeDirectMediaValues(nextValue);
                yield this.emitFileSelected(normalized);
            }
            catch (error) {
                Dialogs.$error((error === null || error === void 0 ? void 0 : error.message) || this.$uiText('ve.field.fileProcessFailed', 'Failed to process selected files.'));
            }
        });
    }
    syncResolvedAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAssetMode()) {
                return;
            }
            const adapter = this.assetAdapter();
            const ids = this.normalizeStoredAssetIds(this.modelValue.value);
            const fieldType = this.mediaFieldType();
            if (!adapter || !fieldType) {
                this.resolvedAssets.value = [];
                return;
            }
            if (ids.length === 0) {
                this.resolvedAssets.value = [];
                return;
            }
            const requestId = this.assetResolveRequestId.value + 1;
            this.assetResolveRequestId.value = requestId;
            try {
                const records = yield adapter.resolve({
                    ids,
                    multiple: !!this.params.value.multiple,
                    fieldType,
                }, this);
                if (requestId !== this.assetResolveRequestId.value) {
                    return;
                }
                this.resolvedAssets.value = yield this.hydrateAssetRecords(Array.isArray(records) ? records : []);
                yield this.emitAssetsResolved(this.resolvedAssets.value);
            }
            catch (error) {
                if (requestId === this.assetResolveRequestId.value) {
                    this.resolvedAssets.value = [];
                }
                Dialogs.$error((error === null || error === void 0 ? void 0 : error.message) || this.$uiText('ve.field.assetResolveFailed', 'Failed to resolve asset references.'));
            }
        });
    }
    clearMediaValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const resolved = this.$resolvedAssets;
            this.modelValue.value = this.params.value.multiple ? [] : null;
            this.resolvedAssets.value = [];
            yield this.$clearSelectedFiles();
            yield this.removeAssets(resolved);
        });
    }
    clearMediaItem(index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isAssetMode()) {
                if (this.assetUploadPending.value && this.selectedFiles.value.length > 0) {
                    if (this.params.value.multiple && this.resolvedAssets.value.length > 0) {
                        if (index < this.resolvedAssets.value.length) {
                            const records = [...this.resolvedAssets.value];
                            const [removed] = records.splice(index, 1);
                            this.resolvedAssets.value = records;
                            this.modelValue.value = this.assetValueFromRecords(records);
                            if (removed) {
                                yield this.removeAssets([removed]);
                            }
                            return;
                        }
                        const pendingIndex = index - this.resolvedAssets.value.length;
                        const files = [...this.selectedFiles.value];
                        files.splice(pendingIndex, 1);
                        this.setSelectedFiles(files);
                        this.assetUploadPending.value = files.length > 0;
                        return;
                    }
                    const files = [...this.selectedFiles.value];
                    files.splice(index, 1);
                    this.setSelectedFiles(files);
                    this.assetUploadPending.value = files.length > 0;
                    return;
                }
                const records = [...this.resolvedAssets.value];
                const [removed] = records.splice(index, 1);
                this.resolvedAssets.value = records;
                this.modelValue.value = this.assetValueFromRecords(records);
                if (removed) {
                    yield this.removeAssets([removed]);
                }
                return;
            }
            if (this.params.value.multiple) {
                const items = Array.isArray(this.modelValue.value) ? [...this.modelValue.value] : [];
                items.splice(index, 1);
                this.modelValue.value = items;
            }
            else {
                this.modelValue.value = null;
            }
        });
    }
    openMediaItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item) {
                return;
            }
            if (item.previewUrl || item.downloadUrl) {
                this.showFullscreen(item.previewUrl || item.downloadUrl);
                return;
            }
            if (typeof item.raw === 'string') {
                this.showFullscreen(item.raw);
                return;
            }
            if (item.raw instanceof File) {
                const objectUrl = URL.createObjectURL(item.raw);
                if (item.raw.type.startsWith('image/')) {
                    void Dialogs.$imagePreview(objectUrl, {
                        title: item.label || this.params.value.label,
                        fullscreen: this.params.value.previewFullscreen !== false,
                    });
                    return;
                }
                if (item.raw.type === 'application/pdf') {
                    void Dialogs.$documentPreview(objectUrl, {
                        title: item.label || this.params.value.label,
                        fullscreen: this.params.value.previewFullscreen !== false,
                    });
                    return;
                }
                void Dialogs.$iframe({
                    src: objectUrl,
                    title: item.label || this.params.value.label,
                    fullscreen: this.params.value.previewFullscreen !== false,
                    downloadUrl: objectUrl,
                });
            }
        });
    }
    onOtpFinished(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.finished) {
                yield this.options.finished(this, value);
            }
            this.handleOn('finish', value);
        });
    }
    onFileUploadChanged(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = this.normalizeFilesInput(value);
            if (this.isAssetMode()) {
                yield this.handleSelectedFiles(files);
                return;
            }
            this.fileUploadLoading.value = true;
            try {
                yield this.handleSelectedFiles(files);
            }
            finally {
                this.fileUploadLoading.value = false;
            }
        });
    }
    valueChanged(newValue) {
        if (this.changing) {
            return;
        }
        this.changing = true;
        const value = this.postprocess(newValue !== undefined ? newValue : this.modelValue.value);
        this.renderLatex(value);
        if (this.$master && this.params.value.storage) {
            this.$master.$set(this.params.value.storage, value);
        }
        if (this.options.modifies) {
            this.options.modifies.value = value;
        }
        if (this.options.changed)
            this.options.changed(this);
        this.handleOn('changed', value);
        this.changing = false;
    }
    attachEventListeners() {
        if (this.$master) {
            this.$master.on('changed', () => this.updateValue(), this.$id);
            this.$master.on('loaded', () => this.updateValue(), this.$id);
            this.$master.on('reset', () => this.updateValue(), this.$id);
        }
    }
    removeEventListeners() {
        if (this.$master) {
            this.$master.clearListeners(this.$id);
        }
    }
    updateValue() {
        if (!this.changing) {
            this.changing = true;
            if (this.$master && this.params.value.storage) {
                const defval = this.params.value.default !== undefined ? this.params.value.default : (this.options.default ? this.options.default(this) : undefined);
                let value = this.preprocess(this.$master.$get(this.params.value.storage, defval));
                if (this.params.value.type === 'collection' && value) {
                    value = this.attachIndex(value || []);
                    this.$master.$set(this.params.value.storage, value);
                }
                if (this.isEqual(this.modelValue.value, value)) {
                    this.changing = false;
                    return;
                }
                this.modelValue.value = value;
                if (this.isMediaField()) {
                    this.clearSelectedFiles();
                }
                if (this.options.modifies) {
                    this.options.modifies.value = value;
                }
            }
            else if (this.params.value.default !== undefined || this.options.default) {
                if (this.modelValue.value === undefined) {
                    const defval = this.params.value.default !== undefined ? this.params.value.default : (this.options.default ? this.options.default(this) : undefined);
                    const value = this.preprocess(defval);
                    if (this.isEqual(this.modelValue.value, value)) {
                        this.changing = false;
                        return;
                    }
                    this.modelValue.value = value;
                    if (this.isMediaField()) {
                        this.clearSelectedFiles();
                    }
                    if (this.options.modifies) {
                        this.options.modifies.value = value;
                    }
                }
            }
            this.changing = false;
        }
    }
    renderMathInHtml(html, output = 'htmlAndMathml') {
        // Render display math first ($$...$$)
        if (!html)
            return html;
        html = html.replace(/<(p|div)>\s*\$\$\s*<\/\1>([\s\S]*?)<(p|div)>\s*\$\$\s*<\/\3>/gi, (_match, _startTag, math) => {
            const normalizedMath = String(math)
                .replace(/<\/(p|div)>\s*<(p|div)>/gi, '\n')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/?(p|div)>/gi, '')
                .replace(/&nbsp;/gi, ' ')
                .trim();
            return `$$${normalizedMath}$$`;
        });
        html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
            try {
                return katex.renderToString(math, { displayMode: true, output });
            }
            catch (err) {
                return `<span class="katex-error">${math}</span>`;
            }
        });
        // Render inline math ($...$)
        html = html.replace(/\$([^\$]+?)\$/g, (_, math) => {
            try {
                return katex.renderToString(math, { displayMode: false, output });
            }
            catch (err) {
                return `<span class="katex-error">${math}</span>`;
            }
        });
        return html;
    }
    renderLatex(value) {
        if (this.params.value.type === 'code' && this.params.value.lang === 'latex') {
            try {
                let fulltext = value || '';
                fulltext = fulltext.trim();
                const hasClass = fulltext.includes('\\documentclass');
                const hasBegin = fulltext.includes('\\begin{document}');
                const hasEnd = fulltext.includes('\\end{document}');
                if (!hasClass) {
                    if (!hasBegin) {
                        fulltext = `\\begin{document}\n${fulltext}`;
                    }
                    fulltext = `\\documentclass{article}\n${latexPackages.map((p) => '\\usepackage{' + p + '}').join('\n')}\n${fulltext}`;
                    if (!hasEnd) {
                        fulltext = `${fulltext}\n\\end{document}`;
                    }
                }
                const generator = new webtex.HtmlGenerator({ hyphenate: false });
                const doc = webtex.parse(value, { generator }).htmlDocument();
                this.codePreview.value = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
            }
            catch (err) {
                this.codePreview.value = `<!DOCTYPE html><html><body><span style="color:red">${err.message}</span></body></html>`;
            }
        }
    }
    showPreviewFullscreen(html) {
        void Dialogs.$iframe({
            srcdoc: html,
            title: this.$text(this.params.value.label, this.$uiText('ve.field.preview', 'Preview')),
            fullscreen: true,
        });
    }
    isEqual(value1, value2) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            if (value1.length !== value2.length)
                return false;
            for (let i = 0; i < value1.length; i++) {
                if (value1[i] !== value2[i])
                    return false;
            }
            return true;
        }
        else {
            return value1 === value2;
        }
    }
    preprocess(value) {
        if (value === undefined || value === null)
            return value;
        if (this.params.value.type === "date") {
            if (Array.isArray(value)) {
                return value.map((v) => this.preprocessDateValue(v));
            }
            return this.preprocessDateValue(value);
        }
        if (this.params.value.type === "time") {
            if (Array.isArray(value)) {
                return value.map((v) => this.preprocessTimeValue(v));
            }
            return this.preprocessTimeValue(value);
        }
        if (this.params.value.type === 'decimal') {
            const dp = this.params.value.decimalPlaces || 2;
            if (value.$numberDecimal !== undefined) {
                return Number(value.$numberDecimal).toFixed(dp);
            }
            else {
                try {
                    const dvalue = Number(value).toFixed(dp);
                    return dvalue;
                }
                catch (error) {
                }
            }
        }
        return value;
    }
    postprocess(value) {
        if (value === undefined || value === null)
            return value;
        if (this.params.value.type === "date") {
            if (Array.isArray(value)) {
                return value.map((v) => this.postprocessDateValue(v));
            }
            return this.postprocessDateValue(value);
        }
        if (this.params.value.type === "time") {
            if (Array.isArray(value)) {
                return value.map((v) => this.postprocessTimeValue(v));
            }
            return this.postprocessTimeValue(value);
        }
        if (this.params.value.type === 'decimal') {
            if (value.$numberDecimal === undefined && value !== undefined && value !== null) {
                const dp = this.params.value.decimalPlaces || 2;
                return { $numberDecimal: Number(value || 0).toFixed(dp) };
            }
        }
        if (this.params.value.type === 'float') {
            return Number(value || 0);
        }
        if (this.params.value.type === 'integer') {
            return Number(value || 0);
        }
        return value;
    }
    resolvedDateFormat() {
        return this.params.value.dateFormat || 'timestamp';
    }
    resolvedTimeFormat() {
        return this.params.value.timeFormat || 'timestamp';
    }
    parseCompactDateValue(value) {
        const compact = String(value !== null && value !== void 0 ? value : '').trim();
        if (!/^\d{8}$/.test(compact)) {
            return new SimpleDate(value);
        }
        const year = Number(compact.slice(0, 4));
        const month = Number(compact.slice(4, 6));
        const day = Number(compact.slice(6, 8));
        return new SimpleDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
    preprocessDateValue(value) {
        if (value === undefined || value === null || value === '') {
            return value;
        }
        if (this.resolvedDateFormat() === 'YYYYMMDD') {
            return this.parseCompactDateValue(value).toString();
        }
        return new SimpleDate(value).toString();
    }
    preprocessTimeValue(value) {
        if (value === undefined || value === null || value === '') {
            return value;
        }
        if (this.resolvedTimeFormat() === 'HHMM') {
            const compact = String(value !== null && value !== void 0 ? value : '').trim();
            if (/^\d{3,4}$/.test(compact)) {
                const padded = compact.padStart(4, '0');
                return new SimpleTime(`${padded.slice(0, 2)}:${padded.slice(2, 4)}`).toString();
            }
        }
        return new SimpleTime(value).toString();
    }
    postprocessDateValue(value) {
        if (value === undefined || value === null || value === '') {
            return value;
        }
        const date = new SimpleDate(value);
        switch (this.resolvedDateFormat()) {
            case 'YYYY-MM-DD':
                return date.toString();
            case 'YYYYMMDD':
                return date.toCompactNumber();
            case 'timestamp':
                return date.toNumber();
            default:
                return date.toString();
        }
    }
    postprocessTimeValue(value) {
        if (value === undefined || value === null || value === '') {
            return value;
        }
        const time = new SimpleTime(value);
        switch (this.resolvedTimeFormat()) {
            case 'HH:mm':
                return time.toString();
            case 'HHMM':
                return time.toCompactNumber();
            case 'timestamp':
                return time.toNumber();
            default:
                return time.toNumber();
        }
    }
    selectOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.selectOptions)
                return yield this.options.selectOptions(this);
            return [];
        });
    }
    button() {
        if (this.options.button)
            return this.options.button(this);
        return undefined;
    }
    form() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.form)
                return yield this.options.form(this);
            return undefined;
        });
    }
    headers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.headers)
                return yield this.options.headers(this);
        });
    }
    makeHTMLColumns(headers) {
        const slots = {};
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            if (header.isHTML) {
                slots[`item.${header.key}`] = (options) => {
                    var _a, _b, _c;
                    return this.$h(header.tag || 'div', {
                        innerHTML: ((_a = options.value) === null || _a === void 0 ? void 0 : _a.html) ? options.value.html : options.value,
                        class: ((_b = options.value) === null || _b === void 0 ? void 0 : _b.class) || [],
                        style: ((_c = options.value) === null || _c === void 0 ? void 0 : _c.style) || {}
                    });
                };
            }
        }
        return slots;
    }
    items(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.items)
                return yield this.options.items(this, options);
        });
    }
    chartOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.chartOptions)
                return yield this.options.chartOptions(this);
        });
    }
    chartData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.chartData)
                return yield this.options.chartData(this);
        });
    }
    loadChart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.chartOpts.value = yield this.chartOptions();
            this.chartValue.value = yield this.chartData();
            this.chartLoaded.value = true;
        });
    }
    loadOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.selectOptions();
            if (options) {
                this.selectItems.value = options;
            }
            else {
                this.selectItems.value = [];
            }
        });
    }
    isServerAutocomplete() {
        return this.params.value.type === 'autocomplete' &&
            this.params.value.serverSearch === true &&
            !!this.options.autocompleteSearch;
    }
    autocompleteMinSearchChars() {
        return typeof this.params.value.minSearchChars === 'number' ? this.params.value.minSearchChars : 2;
    }
    autocompleteDebounceMs() {
        return typeof this.params.value.searchDebounceMs === 'number' ? this.params.value.searchDebounceMs : 300;
    }
    autocompleteLoadMoreMode() {
        return this.params.value.autocompleteLoadMore === 'button' ? 'button' : 'scroll';
    }
    autocompletePageSize() {
        return typeof this.params.value.searchPageSize === 'number' ? this.params.value.searchPageSize : 25;
    }
    autocompleteMinScrollableItems() {
        return Math.max(this.autocompletePageSize(), 20);
    }
    findAutocompleteListElement() {
        if (typeof document === 'undefined') {
            return undefined;
        }
        return document.querySelector(`.${this.autocompleteMenuClass} .v-list`);
    }
    shouldCacheAutocompleteResults() {
        return this.params.value.cacheSearchResults !== false;
    }
    shouldKeepSelectedAutocompleteItems() {
        return this.params.value.keepSelectedItemsInOptions !== false;
    }
    resolveAutocompleteHasMore(normalized, page) {
        const resolvedPage = normalized.page || page;
        if (normalized.hasMore === true) {
            return true;
        }
        if (normalized.hasMore === false) {
            return false;
        }
        return ((typeof normalized.total === 'number' && ((resolvedPage * this.autocompletePageSize()) < normalized.total))
            || ((normalized.items || []).length >= this.autocompletePageSize()));
    }
    normalizeAutocompleteItems(value) {
        if (value === undefined || value === null)
            return [];
        return Array.isArray(value) ? value.filter((item) => item !== undefined && item !== null) : [value];
    }
    normalizeAutocompleteSearchResult(result) {
        if (Array.isArray(result)) {
            return { items: result };
        }
        if ((result === null || result === void 0 ? void 0 : result.data) && Array.isArray(result === null || result === void 0 ? void 0 : result.data)) {
            return {
                items: result.data,
                total: result.total,
                page: result.page,
                hasMore: result.hasMore,
            };
        }
        if ((result === null || result === void 0 ? void 0 : result.items) && Array.isArray(result === null || result === void 0 ? void 0 : result.items)) {
            return {
                items: result.items,
                total: result.total,
                page: result.page,
                hasMore: result.hasMore,
            };
        }
        return { items: [] };
    }
    autocompleteItemKey(item, index) {
        if (item && typeof item === 'object') {
            const itemId = Master.getItemId(item, this.params.value.itemValue || this.params.value.idField);
            if (itemId || itemId === 0) {
                return `id:${itemId.toString()}`;
            }
        }
        if (item || item === 0 || item === '') {
            return `value:${String(item)}`;
        }
        return `index:${index}`;
    }
    mergeAutocompleteItems(baseItems, extraItems) {
        const merged = [];
        const seen = new Set();
        [...(baseItems || []), ...(extraItems || [])].forEach((item, index) => {
            if (item === undefined || item === null) {
                return;
            }
            const key = this.autocompleteItemKey(item, index);
            if (seen.has(key)) {
                return;
            }
            seen.add(key);
            merged.push(item);
        });
        return merged;
    }
    selectedAutocompleteObjects() {
        if (!this.params.value.returnObject) {
            return [];
        }
        return this.normalizeAutocompleteItems(this.modelValue.value).filter((item) => item && typeof item === 'object');
    }
    selectedAutocompleteIds() {
        if (this.params.value.returnObject) {
            return [];
        }
        return this.normalizeAutocompleteItems(this.modelValue.value).filter((item) => item || item === 0 || item === '');
    }
    autocompleteItemMatchesValue(item, value) {
        if (item && typeof item === 'object') {
            return Master.matchesItemId(item, value, this.params.value.itemValue || this.params.value.idField);
        }
        return String(item) === String(value);
    }
    filterAutocompleteItemsByValues(items, values) {
        if (!Array.isArray(items) || values.length === 0) {
            return [];
        }
        return items.filter((item) => values.some((value) => this.autocompleteItemMatchesValue(item, value)));
    }
    hydratedAutocompleteSelection() {
        if (this.params.value.returnObject) {
            return this.selectedAutocompleteObjects();
        }
        const ids = this.selectedAutocompleteIds();
        if (ids.length === 0) {
            return [];
        }
        return this.filterAutocompleteItemsByValues(this.autocompleteResolvedItems.value || [], ids);
    }
    retainSelectedAutocompleteItems(items) {
        if (!this.shouldKeepSelectedAutocompleteItems()) {
            return items;
        }
        return this.mergeAutocompleteItems(items, this.hydratedAutocompleteSelection());
    }
    refreshAutocompleteDisplayItems(items) {
        this.selectItems.value = this.retainSelectedAutocompleteItems(items || this.autocompleteResultItems.value || []);
    }
    updateResolvedAutocompleteItems(items) {
        this.autocompleteResolvedItems.value = this.mergeAutocompleteItems([], items || []);
    }
    autocompleteDisplayItemForValue(value) {
        if (value && typeof value === 'object') {
            return value;
        }
        const candidates = [
            ...(this.autocompleteResolvedItems.value || []),
            ...(this.autocompleteResultItems.value || []),
            ...(this.selectItems.value || []),
        ];
        return candidates.find((item) => this.autocompleteItemMatchesValue(item, value));
    }
    normalizeAutocompleteComparisonValue(value) {
        if (value && typeof value === 'object') {
            if ('raw' in value && value.raw !== undefined) {
                return value.raw;
            }
            if ('value' in value && value.value !== undefined) {
                return value.value;
            }
        }
        return value;
    }
    autocompleteValuesEqual(left, right) {
        const normalizedLeft = this.normalizeAutocompleteComparisonValue(left);
        const normalizedRight = this.normalizeAutocompleteComparisonValue(right);
        if (normalizedLeft === normalizedRight) {
            return true;
        }
        const itemField = this.params.value.itemValue || this.params.value.idField;
        const leftId = normalizedLeft && typeof normalizedLeft === 'object'
            ? Master.getItemId(normalizedLeft, itemField)
            : normalizedLeft;
        const rightId = normalizedRight && typeof normalizedRight === 'object'
            ? Master.getItemId(normalizedRight, itemField)
            : normalizedRight;
        if ((leftId || leftId === 0) && (rightId || rightId === 0)) {
            return String(leftId) === String(rightId);
        }
        return false;
    }
    autocompleteDisplayTitle(item) {
        var _a, _b, _c, _d, _e, _f, _g;
        const fallback = (_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.title) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.value) !== null && _b !== void 0 ? _b : item === null || item === void 0 ? void 0 : item.raw) !== null && _c !== void 0 ? _c : '';
        const resolvedItem = this.autocompleteDisplayItemForValue((_e = (_d = item === null || item === void 0 ? void 0 : item.raw) !== null && _d !== void 0 ? _d : item === null || item === void 0 ? void 0 : item.value) !== null && _e !== void 0 ? _e : item);
        if (!resolvedItem || typeof resolvedItem !== 'object') {
            return String((_f = resolvedItem !== null && resolvedItem !== void 0 ? resolvedItem : fallback) !== null && _f !== void 0 ? _f : '');
        }
        const titleField = this.params.value.itemTitle || 'name';
        const title = nestedProperty.get(resolvedItem, titleField);
        return String((_g = title !== null && title !== void 0 ? title : fallback) !== null && _g !== void 0 ? _g : '');
    }
    autocompleteCacheKey(search, page) {
        return `${page}:${(search || '').trim().toLocaleLowerCase()}`;
    }
    fetchAutocompleteSearchPage(trimmedSearch, page) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = this.autocompleteCacheKey(trimmedSearch, page);
            if (this.shouldCacheAutocompleteResults() && this.autocompleteCache.has(cacheKey)) {
                return this.autocompleteCache.get(cacheKey);
            }
            const result = yield ((_b = (_a = this.options).autocompleteSearch) === null || _b === void 0 ? void 0 : _b.call(_a, this, trimmedSearch, {
                page,
                limit: this.autocompletePageSize(),
                signal: (_c = this.autocompleteAbortController) === null || _c === void 0 ? void 0 : _c.signal,
            }));
            const normalized = this.normalizeAutocompleteSearchResult(result);
            if (this.shouldCacheAutocompleteResults()) {
                this.autocompleteCache.set(cacheKey, normalized);
            }
            return normalized;
        });
    }
    syncServerAutocompleteSelection() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isServerAutocomplete()) {
                return;
            }
            const selectedObjects = this.selectedAutocompleteObjects();
            if (selectedObjects.length > 0) {
                this.updateResolvedAutocompleteItems(selectedObjects);
                if (this.shouldKeepSelectedAutocompleteItems()) {
                    this.refreshAutocompleteDisplayItems();
                }
                return;
            }
            const ids = this.selectedAutocompleteIds();
            if (ids.length === 0) {
                this.updateResolvedAutocompleteItems([]);
                if (this.shouldKeepSelectedAutocompleteItems()) {
                    this.refreshAutocompleteDisplayItems();
                }
                return;
            }
            const fromResults = this.filterAutocompleteItemsByValues(this.autocompleteResultItems.value || [], ids);
            const existingResolved = this.filterAutocompleteItemsByValues(this.autocompleteResolvedItems.value || [], ids);
            const mergedResolved = this.mergeAutocompleteItems(existingResolved, fromResults);
            if (mergedResolved.length >= ids.length) {
                this.updateResolvedAutocompleteItems(mergedResolved);
                if (this.shouldKeepSelectedAutocompleteItems()) {
                    this.refreshAutocompleteDisplayItems();
                }
                return;
            }
            if (!this.options.autocompleteResolveValue) {
                this.updateResolvedAutocompleteItems(mergedResolved);
                if (this.shouldKeepSelectedAutocompleteItems()) {
                    this.refreshAutocompleteDisplayItems();
                }
                return;
            }
            try {
                const resolved = yield this.options.autocompleteResolveValue(this, this.params.value.multiple ? ids : ids[0], {
                    signal: (_a = this.autocompleteAbortController) === null || _a === void 0 ? void 0 : _a.signal,
                });
                const resolvedItems = this.normalizeAutocompleteItems(resolved);
                this.updateResolvedAutocompleteItems(this.mergeAutocompleteItems(mergedResolved, resolvedItems));
                if (this.shouldKeepSelectedAutocompleteItems()) {
                    this.refreshAutocompleteDisplayItems();
                }
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.name) === 'AbortError') {
                    return;
                }
            }
        });
    }
    applyServerAutocompleteSearch(search, page = 1, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isServerAutocomplete() || !this.options.autocompleteSearch) {
                return;
            }
            const trimmedSearch = (search || '').trim();
            const minChars = this.autocompleteMinSearchChars();
            if (!(options === null || options === void 0 ? void 0 : options.bypassMinChars) && trimmedSearch.length < minChars) {
                this.autocompleteLoaded.value = false;
                this.autocompleteTotal.value = undefined;
                this.autocompleteHasMore.value = false;
                this.autocompletePage.value = 1;
                this.autocompleteResultItems.value = [];
                this.refreshAutocompleteDisplayItems([]);
                return;
            }
            const requestId = this.autocompleteRequestId.value + 1;
            this.autocompleteRequestId.value = requestId;
            const isAppend = (options === null || options === void 0 ? void 0 : options.append) === true;
            if (isAppend) {
                this.autocompleteLoadingMore.value = true;
            }
            else {
                this.autocompleteLoading.value = true;
                this.autocompletePage.value = page;
            }
            if (this.autocompleteAbortController) {
                this.autocompleteAbortController.abort();
            }
            this.autocompleteAbortController = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
            try {
                const previousCount = (this.autocompleteResultItems.value || []).length;
                let normalized = yield this.fetchAutocompleteSearchPage(trimmedSearch, page);
                if (!isAppend && this.autocompleteLoadMoreMode() === 'scroll') {
                    let collectedItems = this.mergeAutocompleteItems([], normalized.items || []);
                    let currentPage = normalized.page || page;
                    let hasMore = this.resolveAutocompleteHasMore(normalized, currentPage);
                    while (hasMore && collectedItems.length < this.autocompleteMinScrollableItems()) {
                        const nextPage = currentPage + 1;
                        const nextNormalized = yield this.fetchAutocompleteSearchPage(trimmedSearch, nextPage);
                        if (requestId !== this.autocompleteRequestId.value) {
                            return;
                        }
                        collectedItems = this.mergeAutocompleteItems(collectedItems, nextNormalized.items || []);
                        normalized = {
                            items: collectedItems,
                            total: (_a = nextNormalized.total) !== null && _a !== void 0 ? _a : normalized.total,
                            page: nextNormalized.page || nextPage,
                            hasMore: nextNormalized.hasMore,
                        };
                        currentPage = normalized.page || nextPage;
                        hasMore = this.resolveAutocompleteHasMore(nextNormalized, currentPage);
                    }
                }
                if (requestId !== this.autocompleteRequestId.value) {
                    return;
                }
                const normalizedItems = this.mergeAutocompleteItems([], normalized.items || []);
                this.autocompleteLoaded.value = true;
                this.autocompleteTotal.value = normalized.total;
                this.autocompletePage.value = normalized.page || page;
                this.autocompleteHasMore.value = this.resolveAutocompleteHasMore(normalized, this.autocompletePage.value);
                this.autocompleteResultItems.value = isAppend
                    ? this.mergeAutocompleteItems(this.autocompleteResultItems.value, normalizedItems)
                    : normalizedItems;
                this.refreshAutocompleteDisplayItems(this.autocompleteResultItems.value);
                yield this.syncServerAutocompleteSelection();
                yield this.maybePrimeScrollableAutocompleteResults(previousCount, { append: isAppend });
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.name) === 'AbortError') {
                    return;
                }
                if (requestId !== this.autocompleteRequestId.value) {
                    return;
                }
                this.autocompleteLoaded.value = true;
                this.autocompleteTotal.value = 0;
                this.autocompleteHasMore.value = false;
                if (!isAppend) {
                    this.autocompleteResultItems.value = [];
                }
                this.refreshAutocompleteDisplayItems(this.autocompleteResultItems.value);
            }
            finally {
                if (requestId === this.autocompleteRequestId.value) {
                    if (isAppend) {
                        this.autocompleteLoadingMore.value = false;
                    }
                    else {
                        this.autocompleteLoading.value = false;
                    }
                }
            }
        });
    }
    scheduleServerAutocompleteSearch(search, options) {
        this.autocompleteSearchText.value = search || '';
        if (this.autocompleteDebounceTimer) {
            clearTimeout(this.autocompleteDebounceTimer);
            this.autocompleteDebounceTimer = undefined;
        }
        if (options === null || options === void 0 ? void 0 : options.immediate) {
            void this.applyServerAutocompleteSearch(this.autocompleteSearchText.value, 1, {
                bypassMinChars: options.bypassMinChars,
            });
            return;
        }
        this.autocompleteDebounceTimer = setTimeout(() => {
            this.autocompleteDebounceTimer = undefined;
            void this.applyServerAutocompleteSearch(this.autocompleteSearchText.value, 1, {
                bypassMinChars: options === null || options === void 0 ? void 0 : options.bypassMinChars,
            });
        }, this.autocompleteDebounceMs());
    }
    canLoadMoreAutocompleteResults() {
        return this.isServerAutocomplete()
            && this.autocompleteHasMore.value
            && !this.autocompleteLoading.value
            && !this.autocompleteLoadingMore.value;
    }
    loadMoreAutocompleteResults() {
        if (!this.canLoadMoreAutocompleteResults()) {
            return;
        }
        void this.applyServerAutocompleteSearch(this.autocompleteSearchText.value, this.autocompletePage.value + 1, {
            bypassMinChars: true,
            append: true,
        });
    }
    queueLoadMoreAutocompleteResults() {
        setTimeout(() => {
            this.loadMoreAutocompleteResults();
        }, 0);
    }
    maybePrimeScrollableAutocompleteResults(previousCount, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isServerAutocomplete() || this.autocompleteLoadMoreMode() !== 'scroll') {
                return;
            }
            const currentCount = (this.autocompleteResultItems.value || []).length;
            const targetCount = this.autocompleteMinScrollableItems();
            if (!this.autocompleteHasMore.value) {
                return;
            }
            if ((options === null || options === void 0 ? void 0 : options.append) && currentCount <= previousCount) {
                return;
            }
            if (currentCount < targetCount) {
                this.queueLoadMoreAutocompleteResults();
                return;
            }
            yield nextTick();
            const list = this.findAutocompleteListElement();
            if (list && list.clientHeight > 0) {
                if (list.scrollHeight <= list.clientHeight + 1) {
                    this.queueLoadMoreAutocompleteResults();
                }
                return;
            }
            this.queueLoadMoreAutocompleteResults();
        });
    }
    onAutocompleteListScroll(ev) {
        if (!this.isServerAutocomplete() || this.autocompleteLoadMoreMode() !== 'scroll') {
            return;
        }
        const target = ev.target;
        if (!target) {
            return;
        }
        const remaining = target.scrollHeight - (target.scrollTop + target.clientHeight);
        if (remaining <= 32) {
            this.loadMoreAutocompleteResults();
        }
    }
    autocompleteNoDataText() {
        const search = (this.autocompleteSearchText.value || '').trim();
        if (!this.isServerAutocomplete()) {
            return undefined;
        }
        if (search.length < this.autocompleteMinSearchChars()) {
            if (this.options.autocompleteNoSearchText) {
                return this.options.autocompleteNoSearchText(this);
            }
            return this.$uiText('ve.field.autocomplete.typeMinChars', `Type at least ${this.autocompleteMinSearchChars()} character(s) to search`, { count: this.autocompleteMinSearchChars() });
        }
        if (this.options.autocompleteNoDataText) {
            return this.options.autocompleteNoDataText(this, search) || this.$uiText('ve.field.autocomplete.noMatches', 'No matching records found');
        }
        return this.$uiText('ve.field.autocomplete.noMatches', 'No matching records found');
    }
    autocompleteLoadMoreText() {
        return this.$text(this.params.value.autocompleteLoadMoreText, this.$uiText('ve.field.autocomplete.loadMore', 'Load more...'));
    }
    autocompleteLoadingMoreText() {
        return this.$text(this.params.value.autocompleteLoadingMoreText, this.$uiText('ve.field.autocomplete.loadingMore', 'Loading more...'));
    }
    resolvedLabel() {
        return this.$text(this.params.value.label);
    }
    resolvedHint() {
        return this.$text(this.params.value.hint);
    }
    resolvedPlaceholder() {
        return this.$text(this.params.value.placeholder);
    }
    messageFormat(data) {
        if (this.options.messageFormat)
            return this.options.messageFormat(this, data) || [];
        return data;
    }
    $reload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading.value = true;
            yield sleep(100);
            this.loading.value = false;
        });
    }
    render(props, context) {
        const h = this.$h;
        if (this.params.value.invisible) {
            return;
        }
        if (this.loading.value) {
            return;
        }
        return h(VCol, {
            cols: this.params.value.cols || 12,
            lg: this.params.value.lg,
            xs: this.params.value.xs,
            md: this.params.value.md,
            xl: this.params.value.xl,
            xxl: this.params.value.xxl,
            sm: this.params.value.sm,
            onVnodeMounted: (props) => {
                if (props.el) {
                    const el = props.el;
                    this.maxWidth.value = el.offsetWidth - 20;
                }
            }
        }, () => this.build(props, context));
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.value.invisible)
                return undefined;
            if (this.options.validate)
                return yield this.options.validate(this);
        });
    }
    rules() {
        if (this.options.rules)
            return this.options.rules(this);
        const items = [];
        if (this.params.value.required) {
            items.push($v.isRequired());
        }
        if (this.params.value.validation) {
            const v = this.params.value.validation;
            let converter = undefined;
            if (this.params.value.type === 'date')
                converter = (v) => (new SimpleDate(v)).toNumber();
            if (this.params.value.type === 'datetime')
                converter = (v) => new Date(v);
            if (this.params.value.type === 'float')
                converter = Number;
            if (this.params.value.type === 'integer')
                converter = Number;
            if (this.params.value.type === 'time')
                converter = (v) => (new SimpleTime(v)).toNumber();
            if (v.range)
                items.push($v.range(v.range.from, v.range.to, v.range.converter || converter));
            if (v.max)
                items.push($v.max(v.max.value, v.max.converter || converter));
            if (v.min)
                items.push($v.min(v.min.value, v.min.converter || converter));
            if (v.gt)
                items.push($v.gt(v.gt.value, v.gt.converter || converter));
            if (v.lt)
                items.push($v.lt(v.lt.value, v.lt.converter || converter));
            if (v.gte)
                items.push($v.gte(v.gte.value, v.gte.converter || converter));
            if (v.lte)
                items.push($v.lte(v.lte.value, v.lte.converter || converter));
            if (v.neq)
                items.push($v.neq(v.neq.value, v.neq.converter || converter));
            if (v.eq)
                items.push($v.eq(v.eq.value, v.eq.converter || converter));
            if (v.in)
                items.push($v.in(v.in));
            if (v.nin)
                items.push($v.nin(v.nin));
            if (v.includes !== undefined)
                items.push($v.includes(v.includes));
            if (v.excludes !== undefined)
                items.push($v.excludes(v.excludes));
            if (v.maxLen || v.maxLen === 0)
                items.push($v.maxLen(v.maxLen));
            if (v.minLen || v.minLen === 0)
                items.push($v.minLen(v.minLen));
            if (v.regex)
                items.push($v.regex(v.regex));
        }
        return items;
    }
    build(props, context) {
        const ftype = this.params.value.type || 'text';
        switch (ftype) {
            case 'text':
            case 'password':
                return this.buildText(props, context, ftype);
            case 'select':
            case 'autocomplete':
                {
                    if (!this.optionLoaded.value && !(ftype === 'autocomplete' && this.isServerAutocomplete())) {
                        this.optionLoaded.value = true;
                        this.loadOptions();
                    }
                    return ftype === 'autocomplete' ? this.buildAutocomplete(props, context) : this.buildSelect(props, context);
                }
            case 'label':
                return this.buildLabel(props, context);
            case 'boolean':
                return this.buildBoolean(props, context);
            case 'button':
                return this.buildButton(props, context);
            case 'chart':
                return this.buildChart(props, context);
            case 'code':
                return this.buildCode(props, context);
            case 'collection':
                return this.buildCollection(props, context);
            case 'color':
                return this.buildColor(props, context);
            case 'otp':
                return this.buildOtp(props, context);
            case 'date':
                return this.buildDate(props, context);
            case 'datetime':
                return this.buildDatetime(props, context);
            case 'document':
                {
                    if (!this.params.value.fileAccepts) {
                        this.params.value.fileAccepts = 'application/pdf, *.pdf';
                    }
                    return this.buildImage(props, context);
                }
            case 'file-upload':
                return this.buildFileUpload(props, context);
            case 'float':
            case 'decimal':
                return this.buildText(props, context, 'number');
            case 'map':
            case 'map-line':
            case 'map-circle':
            case 'map-rectangle':
            case 'map-polygon':
            case 'map-heatmap':
            case 'map-cluster':
            case 'map-geojson':
                return this.buildMap(props, context);
            case 'html':
                return this.buildHTML(props, context);
            case 'htmlview':
                return this.buildHTMLView(props, context);
            case 'image':
                {
                    if (!this.params.value.fileAccepts) {
                        this.params.value.fileAccepts = 'image/*';
                    }
                    return this.buildImage(props, context);
                }
            case 'integer':
                return this.buildInteger(props, context);
            case 'messagingbox':
                return this.buildMessageBox(props, context);
            case 'table':
                return this.buildTable(props, context);
            case 'textarea':
                return this.buildTextArea(props, context);
            case 'viewtable':
                return this.buildViewTable(props, context);
            case 'servertable':
                return this.buildServerTable(props, context);
            case 'reporttable':
                return this.buildReportTable(props, context);
            case 'time':
                return this.buildTime(props, context);
            case 'listselect':
                {
                    if (!this.optionLoaded.value) {
                        this.optionLoaded.value = true;
                        this.loadOptions();
                    }
                    return this.params.value.multiple ? this.buildCheckboxSelect(props, context) : this.buildRadioSelect(props, context);
                }
        }
        return this.$h('div');
    }
    buildText(props, context, type) {
        var _a, _b;
        const h = this.$h;
        if (this.params.value.multiple) {
            return h(VCombobox, Object.assign(Object.assign(Object.assign({}, this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, multiple: true, type, chips: true, items: [], class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
        else {
            return h(VTextField, Object.assign(Object.assign(Object.assign({}, this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_b = Field.defaultParams) === null || _b === void 0 ? void 0 : _b.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), type, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
    }
    buildLabel(props, context) {
        const h = this.$h;
        return h('div', {
            class: this.params.value.class || ['text-subtitle-2'],
            style: this.params.value.style || {},
            innerHTML: this.resolvedLabel()
        });
    }
    buildHTMLView(props, context) {
        const h = this.$h;
        return h('div', {
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            innerHTML: this.params.value.resolveFormulas ? this.renderMathInHtml(this.modelValue.value) : this.modelValue.value
        });
    }
    buildSelect(props, context) {
        var _a;
        const h = this.$h;
        return h(VSelect, Object.assign(Object.assign(Object.assign({}, this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), itemTitle: this.params.value.itemTitle || 'name', itemValue: Master.resolveItemValueField(this.selectItems.value, this.params.value.itemValue || this.params.value.idField), readonly: this.$readonly, items: this.selectItems.value, multiple: this.params.value.multiple, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    buildRadioSelect(props, context) {
        var _a;
        const h = this.$h;
        return [
            h('div', {
                class: ['ml-4', 'mb-4'],
                innerHTML: this.resolvedLabel()
            }),
            h(VRadioGroup, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: ['vef-radio-select'].concat(this.params.value.class || []), style: this.params.value.style || {}, rules: this.rules(), inline: this.params.value.inline, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }), () => (this.selectItems.value || []).map((item) => h(VRadio, {
                value: Master.getItemId(item, this.params.value.itemValue || this.params.value.idField),
                inline: this.params.value.inline
            }, {
                label: () => h('div', Object.assign(Object.assign({}, (item.props || {})), { innerHTML: item[this.params.value.itemTitle || 'name'] }))
            })))
        ];
    }
    buildCheckboxSelect(props, context) {
        var _a;
        const h = this.$h;
        if (this.params.value.multiple) {
            if (!this.modelValue.value) {
                const curValue = (_a = this.$master) === null || _a === void 0 ? void 0 : _a.$get(this.params.value.storage || '');
                if (!curValue)
                    this.modelValue.value = [];
                else
                    this.modelValue.value = curValue;
            }
        }
        return [
            h('div', {
                class: ['ml-4', 'mb-4'],
                innerHTML: this.resolvedLabel()
            }),
            ...(this.selectItems.value || []).map((item) => h(VCheckboxBtn, Object.assign(Object.assign({ value: Master.getItemId(item, this.params.value.itemValue || this.params.value.idField) }, this.modelBinding()), { readonly: this.$readonly, class: ['vef-check-select'].concat(this.params.value.class || []), style: this.params.value.style || {}, color: this.params.value.color || "primary", hint: this.resolvedHint(), multiple: this.params.value.multiple, persistentHint: !!this.params.value.hint, inline: this.params.value.inline }), {
                label: () => h('div', Object.assign(Object.assign({}, (item.props || {})), { innerHTML: item[this.params.value.itemTitle || 'name'] }))
            }))
        ];
    }
    buildAutocomplete(props, context) {
        var _a;
        const h = this.$h;
        const loadMoreMode = this.autocompleteLoadMoreMode();
        const serverAutocompleteProps = this.isServerAutocomplete()
            ? {
                search: this.autocompleteSearchText.value,
                noFilter: true,
                noDataText: this.autocompleteNoDataText(),
                menuProps: {
                    contentClass: this.autocompleteMenuClass,
                },
                listProps: loadMoreMode === 'scroll'
                    ? {
                        onScrollPassive: (ev) => this.onAutocompleteListScroll(ev),
                    }
                    : undefined,
                "onUpdate:search": (value) => this.scheduleServerAutocompleteSearch(value || ''),
            }
            : {};
        const autocompleteSlots = this.isServerAutocomplete() ? {
            selection: ({ item, index }) => h('span', {
                class: 'v-autocomplete__selection-text',
            }, [
                this.autocompleteDisplayTitle(item),
                this.params.value.multiple && index < ((this.modelValue.value || []).length - 1)
                    ? h('span', {
                        class: 'v-autocomplete__selection-comma',
                    }, ',')
                    : undefined,
            ]),
        } : undefined;
        if (this.isServerAutocomplete() && autocompleteSlots) {
            autocompleteSlots['append-item'] = () => {
                if (loadMoreMode === 'button' && (this.autocompleteHasMore.value || this.autocompleteLoadingMore.value)) {
                    return h('div', {
                        style: {
                            padding: '8px 12px 12px 12px',
                            borderTop: '1px solid rgba(128,128,128,0.18)',
                            display: 'flex',
                            justifyContent: 'center',
                        },
                    }, [
                        h(VBtn, {
                            variant: 'text',
                            color: this.params.value.color || 'primary',
                            disabled: this.autocompleteLoadingMore.value,
                            prependIcon: this.autocompleteLoadingMore.value ? 'mdi-loading mdi-spin' : 'mdi-chevron-down',
                            onClick: () => this.loadMoreAutocompleteResults(),
                        }, () => this.autocompleteLoadingMore.value ? this.autocompleteLoadingMoreText() : this.autocompleteLoadMoreText()),
                    ]);
                }
                if (loadMoreMode === 'scroll' && this.autocompleteLoadingMore.value) {
                    return h('div', {
                        style: {
                            padding: '8px 12px 12px 12px',
                            borderTop: '1px solid rgba(128,128,128,0.18)',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            opacity: 0.82,
                        },
                    }, this.autocompleteLoadingMoreText());
                }
                return undefined;
            };
        }
        return h(VAutocomplete, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), itemTitle: this.params.value.itemTitle || 'name', itemValue: Master.resolveItemValueField(this.selectItems.value, this.params.value.itemValue || this.params.value.idField), readonly: this.$readonly, items: this.selectItems.value, loading: this.autocompleteLoading.value, autoSelectFirst: true, returnObject: this.params.value.returnObject, valueComparator: (left, right) => this.autocompleteValuesEqual(left, right), multiple: this.params.value.multiple }), serverAutocompleteProps), { class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }), autocompleteSlots);
    }
    richWidgetContext() {
        return {
            $h: this.$h,
            $text: (value, fallback) => this.$text(value, fallback),
            $readonly: this.$readonly,
            params: this.params,
            modelValue: this.modelValue,
            maxWidth: this.maxWidth,
            $makeRef: this.$makeRef,
            $watch: this.$watch,
            getState: (key, init) => {
                const existing = this.$get(key);
                if (existing !== null && existing !== undefined) {
                    return existing;
                }
                const value = init();
                this.$set(key, value);
                return value;
            },
            isCreateMode: () => this.isCreateMode(),
            codePreview: this.codePreview,
            chartLoaded: this.chartLoaded,
            chartOpts: this.chartOpts,
            chartValue: this.chartValue,
            renderMathInHtml: (html, output) => this.renderMathInHtml(html, output),
            showPreviewFullscreen: (html) => this.showPreviewFullscreen(html),
            registerHtmlEditor: (editor) => this.registerHtmlEditor(editor),
            onHtmlEditorReady: (editor) => {
                this.htmlEditor = editor;
                if (this.params.value.autofocus) {
                    this.focusHtmlEditor();
                }
            },
            renderLatex: (value) => this.renderLatex(value),
            loadChart: () => this.loadChart(),
            messageFormat: (data) => this.messageFormat(data),
            showMediaFullscreen: (data) => this.showFullscreen(data),
            mediaItems: () => this.mediaItems(),
            selectMediaFiles: () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const files = yield selectFile(this.params.value.fileAccepts, !!this.params.value.multiple);
                    yield this.handleSelectedFiles(files);
                }
                catch (error) {
                    if ((error === null || error === void 0 ? void 0 : error.message) !== 'No File Selected!') {
                        Dialogs.$error((error === null || error === void 0 ? void 0 : error.message) || this.$uiText('ve.field.fileSelectFailed', 'Failed to select files.'));
                    }
                }
            }),
            clearMediaItem: (index) => __awaiter(this, void 0, void 0, function* () {
                yield this.clearMediaItem(index);
            }),
            clearMediaItems: () => __awaiter(this, void 0, void 0, function* () {
                yield this.clearMediaValue();
            }),
            openMediaItem: (item) => __awaiter(this, void 0, void 0, function* () {
                yield this.openMediaItem(item);
            }),
            isAssetMode: () => this.isAssetMode(),
            hasPendingUpload: () => this.$hasPendingUpload,
            uploadAssets: () => __awaiter(this, void 0, void 0, function* () { return this.$uploadAssets(); }),
            clearSelectedFiles: () => __awaiter(this, void 0, void 0, function* () { return this.$clearSelectedFiles(); }),
            getMessageWindow: (items) => this.getMessageWindow(items),
            loadEarlierMessages: (total) => this.loadEarlierMessages(total),
            setMessageScrollContainer: (el) => this.setMessageScrollContainer(el),
        };
    }
    tableWidgetContext() {
        return {
            $h: this.$h,
            $readonly: this.$readonly,
            params: this.params,
            modelValue: this.modelValue,
            maxWidth: this.maxWidth,
            tableHeaders: this.tableHeaders,
            tableItems: this.tableItems,
            tableLoaded: this.tableLoaded,
            tableItemsPerPage: this.tableItemsPerPage,
            tableTotalItems: this.tableTotalItems,
            tablePage: this.tablePage,
            getCurrentCollectionItems: () => this.currentCollectionItems,
            setCurrentCollectionItems: (items) => { this.currentCollectionItems = items; },
            getCurrentCollectionFooter: () => this.currentCollectionFooter,
            setCurrentCollectionFooter: (items) => { this.currentCollectionFooter = items; },
            loadTableInformation: (options) => this.loadTableInformation(options),
            formatTableItems: (items) => this.format(items),
            buildTableFooter: (items) => this.footer(items),
            makeHTMLColumns: (headers) => this.makeHTMLColumns(headers),
            handleOn: (event, data) => this.handleOn(event, data),
        };
    }
    getMessageWindow(items) {
        const total = Array.isArray(items) ? items.length : 0;
        if (total === 0) {
            this.messageVisibleCount.value = 0;
            return { items: [], hasEarlier: false, earlierCount: 0, pageSize: this.messagePageSize() };
        }
        const initialCount = this.messageInitialRenderCount(total);
        if (this.messageVisibleCount.value <= 0) {
            this.messageVisibleCount.value = initialCount;
        }
        else if (this.messageVisibleCount.value > total) {
            this.messageVisibleCount.value = total;
        }
        else if (total <= initialCount) {
            this.messageVisibleCount.value = total;
        }
        const visibleCount = Math.min(total, this.messageVisibleCount.value || total);
        const earlierCount = Math.max(0, total - visibleCount);
        return {
            items: items.slice(total - visibleCount),
            hasEarlier: earlierCount > 0,
            earlierCount,
            pageSize: this.messagePageSize(),
        };
    }
    messageInitialRenderCount(total) {
        const configured = this.params.value.messageInitialCount;
        if (typeof configured === 'number' && configured > 0) {
            return Math.min(total, configured);
        }
        if (total > 50) {
            return Math.min(total, 50);
        }
        return total;
    }
    messagePageSize() {
        const configured = this.params.value.messagePageSize;
        if (typeof configured === 'number' && configured > 0) {
            return configured;
        }
        return 50;
    }
    loadEarlierMessages(total) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.messageContainer.value;
            if (container) {
                this.pendingMessageScrollRestore = {
                    scrollTop: container.scrollTop,
                    scrollHeight: container.scrollHeight,
                };
            }
            this.messageVisibleCount.value = Math.min(total, (this.messageVisibleCount.value || 0) + this.messagePageSize());
            yield nextTick();
            this.restoreMessageScrollPosition();
        });
    }
    setMessageScrollContainer(el) {
        if (el instanceof HTMLElement) {
            this.messageContainer.value = el;
        }
        else {
            const root = el === null || el === void 0 ? void 0 : el.$el;
            this.messageContainer.value = root instanceof HTMLElement ? root : undefined;
        }
        this.restoreMessageScrollPosition();
    }
    restoreMessageScrollPosition() {
        if (!this.pendingMessageScrollRestore || !this.messageContainer.value) {
            return;
        }
        const delta = this.messageContainer.value.scrollHeight - this.pendingMessageScrollRestore.scrollHeight;
        this.messageContainer.value.scrollTop = this.pendingMessageScrollRestore.scrollTop + delta;
        this.pendingMessageScrollRestore = undefined;
    }
    buildHTML(props, context) {
        return buildHTMLWidget(this.richWidgetContext());
    }
    registerHtmlEditor(editor) {
        this.htmlEditor = editor;
        const onInit = () => {
            if (this.params.value.autofocus) {
                this.focusHtmlEditor();
            }
        };
        if (typeof (editor === null || editor === void 0 ? void 0 : editor.on) === 'function') {
            editor.on('init', onInit);
            editor.on('keydown', (ev) => {
                this.onHtmlEditorKeydown(ev);
            });
            return;
        }
        if (editor === null || editor === void 0 ? void 0 : editor.isReady) {
            onInit();
        }
    }
    onHtmlEditorKeydown(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = this.parentForm();
            if (!form || Dialogs.hasBlockingDialog()) {
                return;
            }
            if (!ev.altKey && !ev.shiftKey && (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') {
                ev.preventDefault();
                yield form.$handleSaveShortcut();
                return;
            }
            if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
                ev.preventDefault();
                yield form.$handleEscapeShortcut();
            }
        });
    }
    focusHtmlEditor() {
        const editor = this.htmlEditor;
        if (!editor || typeof window === 'undefined') {
            return;
        }
        setTimeout(() => {
            var _a, _b, _c, _d, _e;
            (_a = editor.focus) === null || _a === void 0 ? void 0 : _a.call(editor);
            const body = (_b = editor.getBody) === null || _b === void 0 ? void 0 : _b.call(editor);
            if (body && typeof ((_c = editor.selection) === null || _c === void 0 ? void 0 : _c.select) === 'function' && typeof ((_d = editor.selection) === null || _d === void 0 ? void 0 : _d.collapse) === 'function') {
                (_e = body.focus) === null || _e === void 0 ? void 0 : _e.call(body);
                editor.selection.select(body, true);
                editor.selection.collapse(true);
            }
        }, 50);
    }
    parentForm() {
        let parent = this.$parent;
        while (parent) {
            if (parent instanceof Form) {
                return parent;
            }
            parent = parent.$parent;
        }
        return undefined;
    }
    focusPrimaryInput() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$readonly || this.params.value.invisible) {
                return false;
            }
            if (this.params.value.type === 'html') {
                this.focusHtmlEditor();
                return true;
            }
            return false;
        });
    }
    buildButton(props, context) {
        const h = this.$h;
        const btn = this.button();
        if (btn) {
            btn.setParent(this);
            return h(btn.component);
        }
        return undefined;
    }
    buildCode(props, context) {
        return buildCodeWidget(this.richWidgetContext());
    }
    buildColor(props, context) {
        var _a;
        const h = this.$h;
        return h(VColorInput, Object.assign(Object.assign(Object.assign(Object.assign({}, this.componentOptions()), this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), mode: 'hexa', "onUpdate:modelValue": (value) => {
                if (typeof value === 'string') {
                    this.modelValue.value = value;
                    return;
                }
                this.modelValue.value = (value === null || value === void 0 ? void 0 : value.hexa) || (value === null || value === void 0 ? void 0 : value.hex) || '';
            }, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    buildOtp(props, context) {
        var _a;
        const h = this.$h;
        return h(VOtpInput, Object.assign(Object.assign(Object.assign(Object.assign({}, this.componentOptions()), this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), placeholder: this.resolvedPlaceholder(), color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant) || 'outlined', readonly: this.$readonly, disabled: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, length: this.params.value.length || 6, type: this.params.value.otpType || 'number', "onUpdate:focused": (ev) => this.onFocusChanged(ev), onFinish: (value) => {
                void this.onOtpFinished(value);
            } }));
    }
    buildTime(props, context) {
        var _a, _b;
        const h = this.$h;
        if (this.params.value.multiple) {
            return h(VCombobox, Object.assign(Object.assign(Object.assign({}, this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, multiple: true, type: "time", chips: true, items: [], class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
        else {
            return h(VTextField, Object.assign(Object.assign(Object.assign({}, this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_b = Field.defaultParams) === null || _b === void 0 ? void 0 : _b.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), type: "time", "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
    }
    buildDate(props, context) {
        var _a, _b;
        const h = this.$h;
        if (this.params.value.multiple) {
            return h(VCombobox, Object.assign(Object.assign({ modelValue: this.modelValue.value }, this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, multiple: true, type: "date", chips: true, items: [], class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:modelValue": (value) => {
                    this.modelValue.value = value;
                }, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
        else {
            return h(VTextField, Object.assign(Object.assign({ modelValue: this.modelValue.value }, this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_b = Field.defaultParams) === null || _b === void 0 ? void 0 : _b.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), type: "date", "onUpdate:modelValue": (value) => {
                    this.modelValue.value = value;
                }, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
    }
    buildDatetime(props, context) {
        var _a;
        const h = this.$h;
        const updateValue = (value) => {
            this.modelValue.value = value;
        };
        return [
            h('div', {
                class: ['mb-2', 'ml-4'],
                innerHTML: this.resolvedLabel()
            }),
            h(Datepicker, Object.assign(Object.assign({ modelValue: this.modelValue.value, 'model-value': this.modelValue.value, autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), teleport: true, autoPosition: true }, (this.options.datetimeOptions || {})), { "onUpdate:modelValue": updateValue, "onUpdate:model-value": updateValue, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }))
        ];
    }
    buildPassword(props, context) {
        var _a;
        const h = this.$h;
        return h(VTextField, Object.assign(Object.assign(Object.assign({}, this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, type: 'password', rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    buildFloat(props, context) {
        var _a;
        const h = this.$h;
        return h(VTextField, Object.assign(Object.assign(Object.assign({}, this.modelBinding()), this.inputIconProps()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, type: 'number', class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    buildInteger(props, context) {
        var _a;
        const h = this.$h;
        return h(VTextField, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, type: 'number', "onBeforeinput": (v) => {
                if (v.inputType === 'insertText' && v.data) {
                    if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'].includes(v.data)) {
                        v.preventDefault();
                    }
                }
            }, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    buildCollection(props, context) {
        const h = this.$h;
        if (!this.collectionLoaded.value) {
            this.loadCollectionInformation();
        }
        else {
            let items = this.modelValue.value || [];
            items = items.slice(this.params.value.collectionStart, this.params.value.collectionEnd);
            this.currentCollectionItems = this.format(items);
            if (this.params.value.hasFooter)
                this.currentCollectionFooter = this.footer(this.currentCollectionItems);
        }
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12,
                md: 9,
                class: ['py-0', 'pl-6']
            }, () => [
                h('div', {}, this.$text(this.params.value.label))
            ]),
            h(VCol, {
                cols: 12,
                md: 3,
                align: "end",
                class: ['my-0', 'py-0', 'text-right']
            }, () => [
                ...(this.collectionSelectedItems.value.length > 0 && !this.$readonly && !this.params.value.collectionDisableRemove ? [
                    h(VBtn, {
                        color: 'error',
                        size: 28,
                        icon: true,
                        class: ['mr-4'],
                        onClick: () => {
                            this.onCollectionItemRemoved();
                        }
                    }, () => [
                        h(VIcon, { size: 24 }, () => 'mdi-delete'),
                    ])
                ] : []),
                ...(this.$readonly || this.params.value.collectionDisableAdd || (this.params.value.collectionEnd !== undefined && this.params.value.collectionEnd <= (this.modelValue.value || []).length) ? [] : [
                    h(VBtn, {
                        color: 'primary',
                        size: 28,
                        icon: true,
                        onClick: () => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            yield this.createCollectionForm();
                            if (this.collectionForm) {
                                this.collectionForm.$params.mode = 'create';
                                this.collectionForm.setParent(this);
                                (_a = this.collectionFormMaster) === null || _a === void 0 ? void 0 : _a.$reset({});
                            }
                            this.collectionDialog.value = true;
                        })
                    }, () => [
                        h(VIcon, { size: 24 }, () => 'mdi-plus'),
                    ])
                ])
            ]),
            h(VCol, {
                cols: 12,
                class: ['my-0', 'py-0'],
            }, () => h(VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(VDataTable, {
                headers: this.collectionHeaders || [],
                items: this.currentCollectionItems,
                density: 'compact',
                showSelect: !this.$readonly,
                itemValue: '__index',
                itemsPerPage: this.params.value.itemsPerPage || 10,
                returnObject: true,
                fixedHeader: true,
                fixedFooter: true,
                height: this.params.value.height || 200,
                modelValue: this.collectionSelectedItems.value,
                "onUpdate:modelValue": (value) => {
                    this.collectionSelectedItems.value = value;
                },
                "onClick:row": (_, { item }) => {
                    this.onCollectionItemClicked(item);
                }
            }, Object.assign({}, (this.params.value.hasFooter ? {
                bottom: (options) => [
                    h(VDataTable, {
                        headers: options.headers[0],
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(VDataTableFooter, {})
                ]
            } : {}))))),
            ...(this.collectionLoaded.value ? [
                h(VCol, {
                    align: 'center',
                    cols: 12
                }, () => h(VDialog, {
                    modelValue: this.collectionDialog.value,
                    persistent: true,
                    scrollable: true,
                    "onUpdate:modelValue": (v) => {
                        this.collectionDialog.value = v;
                    }
                }, () => this.collectionForm ? h(this.collectionForm.component, { class: ['mx-auto'] }) : undefined))
            ] : [])
        ]);
    }
    buildMessageBox(props, context) {
        return buildMessageBoxWidget(this.richWidgetContext());
    }
    buildChart(props, context) {
        return buildChartWidget(this.richWidgetContext());
    }
    buildMap(props, context) {
        return buildMapWidget(this.richWidgetContext());
    }
    buildImage(props, context) {
        return buildImageWidget(this.richWidgetContext());
    }
    buildFileUpload(props, context) {
        const h = this.$h;
        const items = this.mediaItems();
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12,
            }, () => h(VFileUpload, Object.assign(Object.assign({}, this.componentOptions()), { modelValue: this.selectedFiles.value, title: this.resolvedLabel(), subtitle: this.resolvedHint() || this.resolvedPlaceholder(), autofocus: this.params.value.autofocus, clearable: this.params.value.clearable !== false, disabled: this.$readonly, readonly: this.$readonly, multiple: this.params.value.multiple, filterByType: this.params.value.fileAccepts, color: this.params.value.color || "primary", class: this.params.value.class || [], style: this.params.value.style || {}, loading: this.assetUploading.value || this.fileUploadLoading.value, showSize: true, "onUpdate:modelValue": (value) => {
                    void this.onFileUploadChanged(value);
                }, onRejected: (files) => {
                    if (files === null || files === void 0 ? void 0 : files.length) {
                        Dialogs.$error(this.$uiText('ve.field.fileUpload.unsupportedType', `Unsupported file type: ${files.map((file) => file.name).join(', ')}`, {
                            files: files.map((file) => file.name).join(', '),
                        }));
                    }
                }, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }))),
            ...(items.length > 0 ? [
                h(VCol, {
                    cols: 12,
                }, () => items.map((item, index) => h(VCard, {
                    key: item.key,
                    class: ['mb-2'],
                    variant: 'outlined',
                }, () => h('div', {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '12px 16px',
                    },
                }, [
                    h('div', {
                        style: {
                            minWidth: 0,
                            flex: '1 1 auto',
                        },
                    }, [
                        h('div', { style: { fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.label),
                        h('div', { style: { fontSize: '0.85rem', opacity: 0.72 } }, [
                            item.mimeType || 'file',
                            item.size ? ` • ${Math.max(1, Math.round(item.size / 1024))} KB` : '',
                            item.pending ? ' • pending upload' : '',
                        ].join('')),
                    ]),
                    h('div', {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        },
                    }, [
                        ...((item.previewUrl || item.downloadUrl || typeof item.raw === 'string' || item.raw instanceof File) ? [
                            h(VBtn, {
                                color: 'success',
                                icon: true,
                                size: 'small',
                                onClick: () => {
                                    void this.openMediaItem(item);
                                },
                            }, () => h(VIcon, {}, () => 'mdi-eye')),
                        ] : []),
                        ...(!this.$readonly ? [
                            h(VBtn, {
                                color: 'error',
                                icon: true,
                                size: 'small',
                                onClick: () => {
                                    void this.clearMediaItem(index);
                                },
                            }, () => h(VIcon, {}, () => 'mdi-delete')),
                        ] : []),
                    ]),
                ])))),
            ] : []),
            ...(!this.$readonly && this.isAssetMode() && this.$hasPendingUpload ? [
                h(VCol, {
                    cols: 12,
                    class: ['d-flex', 'justify-center', 'ga-3'],
                }, () => [
                    h(VBtn, {
                        color: 'primary',
                        onClick: () => {
                            void this.$uploadAssets();
                        },
                    }, () => this.$uiText('ve.field.fileUpload.uploadSelected', 'Upload Selected Files')),
                    h(VBtn, {
                        color: 'error',
                        variant: 'outlined',
                        onClick: () => {
                            void this.$clearSelectedFiles();
                        },
                    }, () => this.$uiText('ve.field.fileUpload.clearSelected', 'Clear Selected Files')),
                ]),
            ] : []),
        ]);
    }
    showFullscreen(data) {
        const isImageData = typeof data === 'string' && (data.startsWith('data:image/')
            || /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(data));
        const isPdfData = typeof data === 'string' && (data.startsWith('data:application/pdf')
            || /\.pdf(\?.*)?$/i.test(data));
        if (isImageData) {
            void Dialogs.$imagePreview(data, {
                title: this.$text(this.params.value.label),
                fullscreen: this.params.value.previewFullscreen !== false,
            });
            return;
        }
        if (isPdfData) {
            void Dialogs.$documentPreview(data, {
                title: this.$text(this.params.value.label),
                fullscreen: this.params.value.previewFullscreen !== false,
            });
            return;
        }
        void Dialogs.$iframe({
            src: data,
            title: this.$text(this.params.value.label),
            fullscreen: this.params.value.previewFullscreen !== false,
            downloadUrl: data,
        });
    }
    loadCollectionInformation() {
        return __awaiter(this, void 0, void 0, function* () {
            this.collectionHeaders = yield this.headers();
            this.collectionLoaded.value = true;
        });
    }
    forceLoadCollectionInfo() {
        this.collectionLoaded.value = false;
    }
    createCollectionForm() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.collectionForm) {
                this.collectionForm.clearListeners(this.$id);
            }
            this.collectionForm = yield this.form();
            if (this.collectionForm) {
                this.collectionForm.$params.auto = true;
                this.collectionFormMaster = new Master();
                this.collectionForm.setMaster(this.collectionFormMaster);
                this.collectionForm.on('saved', (fm) => {
                    this.onCollectionFormSaved(fm);
                }, this.$id);
                this.collectionForm.on('cancel', () => {
                    this.onCollectionFormCancel();
                }, this.$id);
            }
        });
    }
    onCollectionFormSaved(fm) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const value = ((_a = this.collectionFormMaster) === null || _a === void 0 ? void 0 : _a.$data) || {};
            if (this.$master && this.params.value.storage) {
                if (fm.$params.mode === 'create')
                    this.$master.$addCollectionObject(this.params.value.storage, value);
                if (fm.$params.mode === 'edit') {
                    const valueId = Master.getItemId(value, this.params.value.idField);
                    this.$master.$setCollectionObject(this.params.value.storage, (valueId || valueId === 0) ? valueId : (_b = value.__index) === null || _b === void 0 ? void 0 : _b.toString(), value, (valueId || valueId === 0) ? Master.resolveItemValueField([value], this.params.value.idField) : '__index');
                }
                this.updateValue();
            }
            this.handleOn('form-saved', this);
            if (this.collectionFormMaster && fm.$params.mode === 'create') {
                this.collectionFormMaster.$reset({});
            }
            else {
                this.collectionDialog.value = false;
            }
        });
    }
    onCollectionFormCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.collectionDialog.value = false;
            this.handleOn('form-cancel', this);
        });
    }
    onCollectionItemRemoved() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$master && this.params.value.storage) {
                const items = this.collectionSelectedItems.value || [];
                items.sort((a, b) => {
                    if (a.__index > b.__index)
                        return -1;
                    if (a.__index < b.__index)
                        return 1;
                    return 0;
                });
                for (let i = 0; i < items.length; i++) {
                    let canRemove = true;
                    if (this.options.canRemoveItem) {
                        canRemove = yield this.options.canRemoveItem(this, items[i]);
                    }
                    if (canRemove) {
                        const itemId = Master.getItemId(items[i], this.params.value.idField);
                        this.$master.$removeCollectionObject(this.params.value.storage, (itemId || itemId === 0) ? itemId : (items[i].__index || items[i].__index === 0 ? items[i].__index.toString() : items[i].toString()), (itemId || itemId === 0) ? Master.resolveItemValueField([items[i]], this.params.value.idField) : '__index');
                    }
                }
                this.handleOn('item-removed', this);
                this.collectionSelectedItems.value = [];
            }
            this.updateValue();
        });
    }
    onCollectionItemClicked(item) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let canEdit = true;
            if (this.options.canEditItem)
                canEdit = yield this.options.canEditItem(this, item);
            if (!canEdit)
                return;
            yield this.createCollectionForm();
            const itemId = Master.getItemId(item, this.params.value.idField);
            const value = this.currentCollectionItems.filter((i) => Master.matchesItemId(i, itemId, this.params.value.idField) || i.__index === item.__index)[0];
            yield ((_a = this.collectionFormMaster) === null || _a === void 0 ? void 0 : _a.$reset(Object.assign({}, value || {})));
            if (this.collectionForm) {
                this.collectionForm.$params.mode = this.$readonly ? 'display' : 'edit';
                this.collectionForm.setParent(this);
            }
            this.handleOn('item-clicked', this);
            this.collectionDialog.value = true;
        });
    }
    format(items) {
        if (this.options.format) {
            const data = this.options.format(this, JSON.parse(JSON.stringify(items)));
            if (data && Array.isArray(data))
                return data;
        }
        return items;
    }
    attachIndex(data) {
        if (!data)
            return [];
        if (!Array.isArray(data))
            data = [data];
        data = data.filter((d) => d);
        data.forEach((item, index) => {
            item.__index = index;
        });
        return data;
    }
    footer(items) {
        let data = [];
        if (this.options.footer)
            data = this.options.footer(this, items) || [];
        return data;
    }
    buildTextArea(props, context) {
        var _a;
        const h = this.$h;
        return h(VTextarea, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules() }));
    }
    buildBoolean(props, context) {
        var _a;
        const h = this.$h;
        return h(this.params.value.checkbox ? VCheckboxBtn : VSwitch, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.resolvedLabel(), hint: this.resolvedHint(), persistentHint: !!this.params.value.hint, placeholder: this.resolvedPlaceholder(), clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), inline: this.params.value.inline }));
    }
    buildTable(props, context) {
        return buildTableWidget(this.tableWidgetContext());
    }
    forceLoadTableInfo() {
        this.tableLoaded.value = false;
    }
    clearTableSelection() {
        this.modelValue.value = [];
    }
    buildServerTable(props, context) {
        return buildServerTableWidget(this.tableWidgetContext());
    }
    buildViewTable(props, context) {
        return buildViewTableWidget(this.tableWidgetContext());
    }
    buildReportTable(props, context) {
        return buildReportTableWidget(this.tableWidgetContext());
    }
    loadTableInformation(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableHeaders.value = (yield this.headers()) || [];
            const data = yield this.items(options);
            if (Array.isArray(data)) {
                this.tableItems.value = this.format(data);
                this.tableTotalItems.value = data.length;
                this.tableItemsPerPage.value = -1;
                this.tablePage.value = 1;
            }
            else if (data) {
                this.tableItems.value = this.format(data.data || []);
                this.tableTotalItems.value = data.total || 0;
                this.tableItemsPerPage.value = data.limit;
                this.tablePage.value = options.page || 1;
            }
            else {
                this.tableItems.value = this.format([]);
                this.tableTotalItems.value = 0;
                this.tableItemsPerPage.value = -1;
                this.tablePage.value = 1;
            }
            this.tableLoaded.value = true;
        });
    }
    handleOn(event, data) {
        if (this.options.on) {
            const events = this.options.on(this);
            if (events[event]) {
                events[event](data);
            }
        }
        this.emit(event, data);
    }
    onFocusChanged(focused) {
        var _a;
        if (this.isEditting && !focused) {
            if (this.params.value.type === 'decimal' && this.modelValue.value) {
                this.changing = true;
                const dp = this.params.value.decimalPlaces || 2;
                const dvalue = Array.isArray(this.modelValue.value) ? this.modelValue.value.map((v) => Number(v).toFixed(dp)) : Number(this.modelValue.value).toFixed(dp);
                this.modelValue.value = dvalue;
                this.changing = false;
            }
        }
        this.isEditting = focused;
        this.handleOn('focus-changed', focused);
        if (focused)
            this.handleOn('focus-gained');
        else
            this.handleOn('focus-lost');
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.focusChanged)
            this.options.focusChanged(this, focused);
        if (focused && this.isServerAutocomplete()) {
            void this.syncServerAutocompleteSelection();
            if (this.params.value.searchOnFocus) {
                this.scheduleServerAutocompleteSearch(this.autocompleteSearchText.value || '', {
                    immediate: true,
                    bypassMinChars: true,
                });
            }
        }
    }
    mounted() {
        this.updateValue();
        if (this.isAssetMode()) {
            void this.syncResolvedAssets();
        }
        if (this.isServerAutocomplete()) {
            void this.syncServerAutocompleteSelection();
        }
    }
    destructor() {
        if (this.autocompleteDebounceTimer) {
            clearTimeout(this.autocompleteDebounceTimer);
            this.autocompleteDebounceTimer = undefined;
        }
        if (this.autocompleteAbortController) {
            this.autocompleteAbortController.abort();
            this.autocompleteAbortController = undefined;
        }
    }
}
Field.defaultParams = {};
const FD = (params, options) => new Field(params, options);
FD.setDefault = Field.setDefault;
export const $FD = FD;
