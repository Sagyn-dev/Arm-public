import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {WebcamImage} from 'ngx-webcam';
import {Field, FileConfiguration, FileDirectum} from '@app/_models/schemas';
import {ControlContainer, FormControl, FormGroup, NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {Guid} from "guid-typescript";
import {FormService} from "@app/_services/form.service";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

//@author Beshekenov S.K. компонент для загрузки файлов на сервер 18.02.21
@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css'],
	providers: [MessageService],
	viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FileUploadComponent implements OnInit {

	@Input('required') isRequired: boolean;

	constructor(private http: HttpClient, private messageService: MessageService,
					private primengConfig: PrimeNGConfig, private dialog: MatDialog,
					private sanitizer: DomSanitizer,
					private formService: FormService) {
	}

	// отправка данных из дочернего компонента в родительский, точнее будет отправлен scan_id
	@Output() public onUploadFinished = new EventEmitter();
	@ViewChild('fileInput') fileInput: any;
	@Output() public onUploadValid = new EventEmitter();


	//установка параметров
	get fileConfiguration(): FileConfiguration {
		return this.fileConfig;
	}

	@Input("config")
	set fileConfiguration(val: FileConfiguration) {
		if (this.fileConfig != val) {
			this.fileConfig = val;
		}
	}

	//получение scan_id и установка
	get scan(): number {
		return this.scan_id;
	}

	@Input("scan")
	set scan(val) {
		if (this.scan_id != val) {
			this.scan_id = val;
			if (this.scan_id == null) {
				this.deleteFile();
			}
		}
	}

	@Output()
	scanChange = new EventEmitter<number>();

	@Input("name")
	set name(val: string) {
		if (this.name_atr != val) {
			this.name_atr = val;
		}
	}

	formUpd: any;
	fileToUpload: File;
	fileInfo: string;
	uploading: boolean;
	resultUpload: any;
	scan_id: number;
	name_atr: string;
	message: string;
	image: WebcamImage;
	image_list: any;
	fileToUploadPdf: any;
	//настройки для отображения кнопок
	fileConfig: FileConfiguration = new FileConfiguration(true, true, true, true, true);
	//для седа
	display: boolean = false;
	linkDoc: string;
	loadLink: boolean;
	fsed: FileDirectum;

	ngOnInit(): void {
		this.primengConfig.ripple = true;
		this.formUpd = new FormGroup({
			fileUpload: new FormControl()
		});

	}

	//получение размера файла
	formatBytes(bytes: number): string {
		const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const factor = 1024;
		let index = 0;

		while (bytes >= factor) {
			bytes /= factor;
			index++;
		}
		return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
	}

	//выбор файла
	fileBrowser() {
		let file_list = [];
		let file: File;
		//если 1 файл
		if (this.fileInput.nativeElement.files.length == 1) {
			file = this.fileInput.nativeElement.files[0];
			this.fileInfo = `${file.name} (${this.formatBytes(file.size)})`;
			this.fileUploading(file);
			this.fileToUploadPdf = null;
			//если файл типа пдф
			if (file.type == 'application/pdf') {
				if (typeof (FileReader) !== 'undefined') {
					let reader = new FileReader();
					reader.onload = (e: any) => {
						//получаем массив byte
						this.fileToUploadPdf = e.target.result;
					};
					reader.readAsArrayBuffer(file);
				}
			}
		} else {

			for (let file of this.fileInput.nativeElement.files) {
				//если тип изображение
				if (file.type.toString().split('/')[0] == 'image') {
					if (typeof (FileReader) !== 'undefined') {
						let reader = new FileReader();
						reader.onload = (e) => {
							//получаем массив byte
							file_list.push(reader.result);
						};
						reader.readAsDataURL(file);
					}
					//передаем список изображений для создания документа пдф
				} else {
					//если другие файлы
					this.fileUploading(file);
					//this.fileToUploadPdf = null;
				}
			}
			//ожидание для заполенния пдф
			setTimeout(() => {
				if (file_list.length != 0) {
					this.createPDF(file_list);
				}
			}, 1000)
		}
	}

	//загрузка файла и получение scan_id
	fileUploading(file: File) {
		this.fileToUpload = file;
		this.uploading = true;
		if (file) {
			this.fileInfo = `${file.name} (${this.formatBytes(file.size)})`;	//		- перенес в файл выбора
			let formData = new FormData();
			formData.append('UploadedFile', file, file.name);
			this.http.post(`${environment.apiUrl}/api/UploadFile/uploadFile`, formData,
				{reportProgress: true, observe: 'events', responseType: 'json'}).subscribe(event => {
					if (event.type === HttpEventType.UploadProgress) {
						//console.log('Загрузка на сервер завершена. Начинается загрузка файла в базу данных.');
					} else if (event.type === HttpEventType.Response) {
						//console.log("Загрузка завершена.");
						if (event.body) {
							this.uploading = false;
							this.resultUpload = event.body;
							this.message = "Загрузка завершена."
							this.showInfo();
							this.scan_id = this.resultUpload;
							this.scanChange.emit(this.scan_id);
							this.onUploadFinished.emit(this.scan_id);
						}
					} else if (event.type === HttpEventType.Sent) {
						//console.log("Файл отправлен на сервер")
					}
				},
				error => {
					this.uploading = false;
					this.message = error.error.message;
					this.showError();
				})
		}
	}

	showInfo() {
		this.messageService.add({severity: 'info', summary: 'Информация', detail: this.message});
	}

	showError() {
		this.messageService.add({severity: 'error', summary: 'Ошибка', detail: this.message});
	}

	//конвверт из base64 в blob
	dataURItoBlob(dataURI, type): Blob {
		// convert base64 to raw binary data held in a string
		let byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		// write the bytes of the string to an ArrayBuffer
		let ab = new ArrayBuffer(byteString.length);
		let ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		let bb = new Blob([ab], {type: type});
		return bb;
	}

	linkSed() {
		this.display = true;
		this.linkDoc = null;
		this.loadLink = false;

	}

	cancelLink(form: NgForm) {
		this.linkDoc = null;
		this.loadLink = false;
		this.display = false;
		form.onReset();
	}

	//предпросмотр документа, добавить возможность просмотра пдф
	preview() {
		if (this.fileToUpload || this.fileToUploadPdf) {
			this.dialog.open(PreviewDialog, {
				minWidth: '640px',
				width: 'auto',
				height: 'auto',
				data: {
					image: this.fileToUpload,//поменял тут
					pdf: this.fileToUploadPdf
				}

			});
		} else {
			this.message = "Изображение не загружено"
			this.showInfo();
		}
	}

	deleteFile() {
		if (this.fileInput) {
			this.fileInput.nativeElement.value = null;
		}
		this.fileToUpload = null;
		this.fileInfo = '';
		this.uploading = false;
		this.scan_id = null;
		this.scanChange.emit(this.scan_id);
		this.fileToUploadPdf = null;
	}

	//открытия диалога камеры
	camera() {
		const dialogRef = this.dialog.open(CameraDialog, {
			minWidth: '640px',
			width: 'auto',
			height: 'auto',
			data: {}
		});

		dialogRef.afterClosed().subscribe(result => {
				let file_list: any = [];
				if (result.length != 0) {
					//добавить проверку флага списка, не просто создать массив webcamov и присваивать изображению
					if (result.length > 1) {
						//блок для загрузки пдф
						this.image_list = result;
						for (let item of this.image_list) {
							this.image = item;
							file_list.push(this.image.imageAsDataUrl);
						}
						//передаем список изображений для создания документа пдф
						this.createPDF(file_list);
					} else {
						//блок для загрузки 1 изображения
						this.fileToUploadPdf = null;
						this.image = result[0];

						//let date = new Date().toLocaleString();

						let imageBlob = this.dataURItoBlob(this.image.imageAsDataUrl, 'image/jpg');
						const imageFile: File = new File([imageBlob], Guid.create().toString().concat('.jpg'));
						this.fileToUpload = imageFile;
						this.fileUploading(this.fileToUpload);
					}
				}
			},
			error => {
				console.log(error);
				this.message = error.error.message;
			});
	}

	//создание пдф
	createPDF(data) {
		let docDefinition = {
			pageSize: 'A4',
			pageMargins: [10, 10, 10, 10],
			defaultStyle: {
				fontSize: 8,
				alignment: 'center'
			},
			content: data.map(function (item) {
				return {image: item, fit: [600, 600], pageBreakBefore: true}
			})
		};
		//pdfMake.createPdf(docDefinition).open();
		const pdfDocGenerator = pdfMake.createPdf(docDefinition);
		//создаем файл
		pdfDocGenerator.getBlob((blob) => {
			const pdfFile: File = new File([blob], Guid.create().toString().concat('.pdf'), {type: 'application/pdf'});
			this.fileToUpload = pdfFile;
			this.fileUploading(this.fileToUpload);
		});
		//получаем url для отображения
		pdfDocGenerator.getDataUrl((dataUrl) => {
			this.fileToUploadPdf = dataUrl;
		});
	}

	base64ArrayBuffer(arrayBuffer) {
		var base64 = ''
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

		var bytes = new Uint8Array(arrayBuffer)
		var byteLength = bytes.byteLength
		var byteRemainder = byteLength % 3
		var mainLength = byteLength - byteRemainder

		var a, b, c, d
		var chunk

		// Main loop deals with bytes in chunks of 3
		for (var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

			// Use bitmasks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
			c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
			d = chunk & 63               // 63       = 2^6 - 1

			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
		}

		// Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength]

			a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

			// Set the 4 least significant bits to zero
			b = (chunk & 3) << 4 // 3   = 2^2 - 1

			base64 += encodings[a] + encodings[b] + '=='
		} else if (byteRemainder == 2) {
			chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

			a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
			b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

			// Set the 2 least significant bits to zero
			c = (chunk & 15) << 2 // 15    = 2^4 - 1

			base64 += encodings[a] + encodings[b] + encodings[c] + '='
		}

		return base64
	}

	// получение ид по ссылки из сэда
	postLink(form: NgForm) {
		if (form.valid) {
			setTimeout(() => {
				this.loadLink = true;

				this.formService.directumLink(this.linkDoc.concat()).subscribe((data: FileDirectum) => {
					if (data) {

						this.fsed = data;
						this.fileInfo = this.linkDoc;

						if (this.fsed.ext == "PDF") {
							this.fileToUpload = null;
							const blob = b64toBlob(this.fsed.file, 'application/pdf');
							const pdfFile: File = new File([blob], this.fsed.filename.concat('.').concat(this.fsed.ext), {type: 'application/pdf'});

							if (pdfFile.type == 'application/pdf') {
								if (typeof (FileReader) !== 'undefined') {
									let reader = new FileReader();
									reader.onload = (e: any) => {
										//получаем массив byte
										this.fileToUploadPdf = e.target.result;
									};
									reader.readAsArrayBuffer(pdfFile);
								}
							}
							this.fileUploading(pdfFile);
						} else {
							this.fileToUploadPdf = null;
							const blob = b64toBlob(this.fsed.file, 'application/octet-stream');
							const otherFile: File = new File([blob], this.fsed.filename.concat('.').concat(this.fsed.ext));
							this.fileToUpload = otherFile;
							this.fileUploading(this.fileToUpload);
						}

						this.display = false;
						this.loadLink = false;
					}
				}, error => {
					this.loadLink = false;
					this.message = error.error.toString().split("\n");
					this.showError();

				})
			})
		}
	}
}

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, {type: contentType});
	return blob;
}

//компонет для открытия диалога с камерой
@Component({
	selector: 'dialog-camera',
	templateUrl: 'dialog-camera.component.html',
	styleUrls: ['dialog-camera.component.css']
})
export class CameraDialog implements OnInit {
	constructor(private dialog: MatDialogRef<CameraDialog>) {
		//после закрытия диалога отправляется объект изображения
		this.dialog.beforeClosed().subscribe(() => {
			dialog.close(this.webcamImage_list);
		})
	}

	//объект для создания списка фото
	webcamImage_list: any = [];

	ngOnInit(): void {
	}

	//получение фото или список фоток из компонента камеры
	setImage($event: any) {
		this.webcamImage_list = $event;
	}

	onClose() {
		this.dialog.close(this.webcamImage_list);
	}
}

//компонент для просмотра изображения
@Component({
	selector: 'dialog-preview',
	templateUrl: 'dialog-preview.component.html',
	styleUrls: ['dialog-preview.component.css']
})
export class PreviewDialog implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer, private dialog: MatDialogRef<PreviewDialog>) {

	}

	webcamImage: any;
	pdfImage: string;
	pdf_load: boolean = false;

	ngOnInit(): void {
		console.log(this.data);
		if (this.data.pdf) {
			this.pdf_load = true;
			this.pdfImage = this.data.pdf;
		} else {
			this.pdf_load = false;
			//let blob = new Blob([this.data.image])
			this.webcamImage = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.data.image));
		}
	}

	onClose() {
		this.dialog.close();
	}
}

