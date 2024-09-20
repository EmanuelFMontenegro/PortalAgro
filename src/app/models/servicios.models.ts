



export interface Piloto {
  id?:          number;
  employee?:    Employee;
  dateOfVisit?: null | string;
  hectare?:     number;
  observation?: null | string;
  status?:      Status;
}

export interface Employee {
  id?:        number;
  name?:      string;
  lastname?:  string;
  telephone?: string;
}

export interface Status {
  id?:   number;
  name?: string;
}
