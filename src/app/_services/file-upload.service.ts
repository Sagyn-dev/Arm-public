//файл для компонента file-upload.component для работы с камерой
import {BehaviorSubject} from "rxjs";

export class FileUploadService{
	deviceID: BehaviorSubject<string|boolean> = new BehaviorSubject<string|boolean>(null);
	setDeviceId(value:string|boolean){
		console.log('save service',value);
		this.deviceID.next(value);
	}
}

