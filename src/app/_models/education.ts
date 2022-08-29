
 export class EducationRoomModel {
 id: number;
 name: string;
 school_id: number;
 classteacher: string;
 weekwork: string;
 name_class: string;
 school_name: string;
 recessbreakfast: string;
 recessdinner: string;
 recesssnack: string;
 }



 export class EducationStudentModel {
 acc_pu: number;
 id_room: number;
 position: number;
 fname: string;
 lname: string;
 alname: string;
 current_reg: string;
 birthday: Date;
 room_last_name: string;
 foodcanpay: string;
 foodnotcharge: string;
 }

 export class GetAndAssignAbonCardParam {
 acc_cn: string;
 note: string;
 }

 export class GetAndAssignAbonCardResult {
 newpan: string;
 errmsg: string;
 }
