import type { BookingStatus } from "../../../generated/prisma/enums";

export interface IBooking {
  serviceId: string;
  bookingDate: Date;
  address: string;
  note?: string;
}
export interface IUpdateBooking {
  serviceId?: string;
  bookingDate?: Date;
  address?: string;
  note?: string;
  status?: BookingStatus;
}
