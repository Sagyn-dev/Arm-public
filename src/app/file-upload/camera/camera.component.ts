import {Component, OnInit, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  constructor() { }
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  @Output()
  public photoDone = new EventEmitter<boolean>();
  @Output()
  public flagMultiImage = new EventEmitter<boolean>();
  @Output()
  public srcImage = new EventEmitter<any>();


  get series():boolean{
  	return this.flagSerialImage;
  }
  @Input("series")
  set series(val:boolean){
  	if(this.flagSerialImage != val){
  		this.flagSerialImage = val;
	}
  }
  @ViewChild('camera') camera ?:any;

  mLog:any;

  // toggle webcam on/off
  public showWebcam = true;
  public flagSerialImage:boolean;
  public webcamImage_list:any = [];
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: { min: 1024, ideal: 1280, max: 1920 },
    // height: { min: 776, ideal: 720, max: 1080 }
  };
  public imageQuality: number = 1;
  public errors: WebcamInitError[] = [];
  public cameraBack:boolean = false;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
	flag_photo: boolean = false;
	src_image:WebcamImage;
	width:number;
	height:number;
  public ngOnInit(): void {
	  WebcamUtil.getAvailableVideoInputs()
		  .then((mediaDevices: MediaDeviceInfo[]) => {
			  this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
		  });

  }
  //сделать снимок
  public triggerSnapshot(): void {
  	 this.photoDone.emit(true);
    this.trigger.next();
    this.flag_photo = true;
    //console.log(this.camera);
	 this.height = this.camera.height;
	 this.width = this.camera.width;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  //смена камеры
  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
	//метод получает фото и передает в output директиву чтобы затем получить файл изображения который будет отправлен
	// на сервер и вернет скан ид для вставки в запись в бд
  public handleImage(webcamImage: WebcamImage): void {
    this.src_image = webcamImage;
    this.pictureTaken.emit(webcamImage);
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
	//очистить,переснять фото, крестик
	clear() {
		this.flag_photo = false;
	}
	//для того чтобы делать сериии фото
	multiImage() {
		this.flagSerialImage = !this.flagSerialImage;
		if(this.flagSerialImage)
			this.flagSerialImage = true;
		else this.flagSerialImage = false;

		this.flagMultiImage.emit(this.flagSerialImage);
	}
	//галочка, сохранить файл
	done() {
		//console.log('фото сделано');
		//проверяем если установлен флаг серии, то добавляе фото в список
		if(this.flagSerialImage){
			//console.log(this.src_image);
			if(this.src_image){
				this.webcamImage_list.push(this.src_image);
				this.flag_photo = false;
			}

		}else{
			this.webcamImage_list.push(this.src_image);
			this.flag_photo = false;
		}
		this.srcImage.emit(this.webcamImage_list);
	}
}
