
export interface Attendance {
  id: number;
  idEmployee: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  checkIn?: string;
  checkOut?: string;
  comments: string;
}

export interface AttendanceFilters {
  startDate?: Date;
  endDate?: Date;
  employeeId?: number;
  status?: string;
}
