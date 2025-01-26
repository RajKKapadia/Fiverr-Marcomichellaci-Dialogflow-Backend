export enum MessageKeys {
    WELCOME_MESSAGE = "WELCOME_MESSAGE",
    BOOKING_SAVED = "BOOKING_SAVED",
    BOOKING_NOT_SAVED = "BOOKING_NOT_SAVED",
    CALLBACK_SAVED = "CALLBACK_SAVED",
    CALLBACK_NOT_SAVED = "CALLBACK_NOT_SAVED",
    WAITING_LIST_SAVED = "WAITING_LIST_SAVED",
    WAITING_LIST_NOT_SAVED = "WAITING_LIST_NOT_SAVED",
    BOOKING_CANCELLED = "BOOKING_CANCELLED",
    BOOKING_NOT_CANCELLED = "BOOKING_NOT_CANCELLED",
    NO_RESERVATION_HOLIDAY = "NO_RESERVATION_HOLIDAY",
    NO_RESERVATION_SPECIAL_EVENT = "NO_RESERVATION_SPECIAL_EVENT",
    NO_RESERVATION_OUT_OF_WORKING_HOURS = "NO_RESERVATION_OUT_OF_WORKING_HOURS",
    NO_RESERVATION_NO_AVAILABILITY = "NO_RESERVATION_NO_AVAILABILITY",
    NO_RESERVATION_OUT_OF_BOOKING_WINDOW = "NO_RESERVATION_OUT_OF_BOOKING_WINDOW",
    NO_RESERVATION_OUT_OF_BOOKING_WINDOW_LUNCH_DINNER = "NO_RESERVATION_OUT_OF_BOOKING_WINDOW_LUNCH_DINNER",
    NO_RESERVATION_NO_SEAT = "NO_RESERVATION_NO_SEAT",
    RESTAURANT_CLOSED = "RESTAURANT_CLOSED",
    RESTAURANT_OPEN = "RESTAURANT_OPEN",
    RESTAURANT_CLOSED_W_INFO = "RESTAURANT_CLOSED_W_INFO",
    FORMAT_EXISTING_BOOKINGS = "FORMAT_EXISTING_BOOKINGS",
    BOOKING_UPDATED = "BOOKING_UPDATED",
    BOOKING_NOT_UPDATED = "BOOKING_NOT_UPDATED",
    INVALIDATE_BOOKING_DATE = "INVALIDATE_BOOKING_DATE",
    NO_HOLIDAY = "NO_HOLIDAY",
    FORMAT_HOLIDAY = "FORMAT_HOLIDAY",
    BOOKING_FOUND_W_PHONE = "BOOKING_FOUND_W_PHONE",
    BOOKING_NOT_FOUND_W_PHONE = "BOOKING_NOT_FOUND_W_PHONE",
    BOOKING_FOUND_W_RESERVATION_NUMBER = "BOOKING_FOUND_W_RESERVATION_NUMBER",
    BOOKING_NOT_FOUND_W_RESERVATION_NUMBER = "BOOKING_NOT_FOUND_W_RESERVATION_NUMBER",
    BOOKING_FOUND_W_DATE = "BOOKING_FOUND_W_DATE",
    BOOKING_NOT_FOUND_W_DATE = "BOOKING_NOT_FOUND_W_DATE",
    BOOKING_FOUND_W_EMAIL = "BOOKING_FOUND_W_EMAIL",
    BOOKING_NOT_FOUND_W_EMAIL = "BOOKING_NOT_FOUND_W_EMAIL",
    BOOKING_FOUND_W_NAME = "BOOKING_FOUND_W_NAME",
    BOOKING_NOT_FOUND_W_NAME = "BOOKING_NOT_FOUND_W_NAME",
    FORMAT_BOOKING_CANCELLATION_MODIFICATION = "FORMAT_BOOKING_CANCELLATION_MODIFICATION",
    CANCELLATION_CONFIRMATION = "CANCELLATION_CONFIRMATION"
}

export const messageVariableMap: Record<MessageKeys, string[]> = {
    [MessageKeys.WELCOME_MESSAGE]: ["restaurantName"],
    [MessageKeys.BOOKING_SAVED]: ["reservationNumber"],
    [MessageKeys.BOOKING_NOT_SAVED]: ["errorReason"],
    [MessageKeys.CALLBACK_SAVED]: [],
    [MessageKeys.CALLBACK_NOT_SAVED]: ["errorReason"],
    [MessageKeys.WAITING_LIST_SAVED]: [],
    [MessageKeys.WAITING_LIST_NOT_SAVED]: ["errorReason"],
    [MessageKeys.BOOKING_CANCELLED]: [],
    [MessageKeys.BOOKING_NOT_CANCELLED]: ["errorReason"],
    [MessageKeys.NO_RESERVATION_HOLIDAY]: ["holidayReason"],
    [MessageKeys.NO_RESERVATION_SPECIAL_EVENT]: ["specialEventName", "specialEventDescription", "websiteUrl"],
    [MessageKeys.NO_RESERVATION_OUT_OF_WORKING_HOURS]: ["bookingTime", "bookingDate"],
    [MessageKeys.NO_RESERVATION_NO_AVAILABILITY]: ["bookingTime", "bookingDate"],
    [MessageKeys.NO_RESERVATION_OUT_OF_BOOKING_WINDOW]: ["bookingTime", "bookingDate", "bookingStartTime", "bookingEndTime"],
    [MessageKeys.NO_RESERVATION_OUT_OF_BOOKING_WINDOW_LUNCH_DINNER]: ["bookingTime", "bookingDate", "formattedTimeSlotsString"],
    [MessageKeys.NO_RESERVATION_NO_SEAT]: ["bookingTime", "bookingDate"],
    [MessageKeys.RESTAURANT_CLOSED]: [],
    [MessageKeys.RESTAURANT_OPEN]: [],
    [MessageKeys.RESTAURANT_CLOSED_W_INFO]: ["lunchOpen", "lunchClose", "dinnerOpen", "dinnerClose"],
    [MessageKeys.FORMAT_EXISTING_BOOKINGS]: [],
    [MessageKeys.BOOKING_UPDATED]: [],
    [MessageKeys.BOOKING_NOT_UPDATED]: [],
    [MessageKeys.INVALIDATE_BOOKING_DATE]: [],
    [MessageKeys.NO_HOLIDAY]: [],
    [MessageKeys.FORMAT_HOLIDAY]: [],
    [MessageKeys.BOOKING_FOUND_W_PHONE]: ["customerPhone"],
    [MessageKeys.BOOKING_NOT_FOUND_W_PHONE]: ["customerPhone"],
    [MessageKeys.BOOKING_FOUND_W_RESERVATION_NUMBER]: ["reservationNumber"],
    [MessageKeys.BOOKING_NOT_FOUND_W_RESERVATION_NUMBER]: ["reservationNumber"],
    [MessageKeys.BOOKING_FOUND_W_DATE]: ["bookingDate"],
    [MessageKeys.BOOKING_NOT_FOUND_W_DATE]: ["bookingDate"],
    [MessageKeys.BOOKING_FOUND_W_EMAIL]: ["bookingEmail"],
    [MessageKeys.BOOKING_NOT_FOUND_W_EMAIL]: ["bookingEmail"],
    [MessageKeys.BOOKING_FOUND_W_NAME]: ["bookingName"],
    [MessageKeys.BOOKING_NOT_FOUND_W_NAME]: ["bookingName"],
    [MessageKeys.FORMAT_BOOKING_CANCELLATION_MODIFICATION]: ["formattedBookingOptions"],
    [MessageKeys.CANCELLATION_CONFIRMATION]: ["partySize", "bookingDate", "startTime"]
}

export type MessageVariables = {
    [MessageKeys.WELCOME_MESSAGE]: { restaurantName: string }
    [MessageKeys.BOOKING_SAVED]: { reservationNumber: number }
    [MessageKeys.BOOKING_NOT_SAVED]: { errorReason: string }
    [MessageKeys.CALLBACK_SAVED]: {},
    [MessageKeys.CALLBACK_NOT_SAVED]: { errorReason: string },
    [MessageKeys.WAITING_LIST_SAVED]: {},
    [MessageKeys.WAITING_LIST_NOT_SAVED]: { errorReason: string },
    [MessageKeys.BOOKING_CANCELLED]: {},
    [MessageKeys.BOOKING_NOT_CANCELLED]: { errorReason: string },
    [MessageKeys.NO_RESERVATION_HOLIDAY]: { holidayReason: string },
    [MessageKeys.NO_RESERVATION_SPECIAL_EVENT]: { specialEventName: string, specialEventDescription: string, websiteUrl: string },
    [MessageKeys.NO_RESERVATION_OUT_OF_WORKING_HOURS]: { bookingTime: string, bookingDate: string },
    [MessageKeys.NO_RESERVATION_NO_AVAILABILITY]: { bookingTime: string, bookingDate: string },
    [MessageKeys.NO_RESERVATION_OUT_OF_BOOKING_WINDOW]: { bookingTime: string, bookingDate: string, bookingStartTime: string, bookingEndTime: string },
    [MessageKeys.NO_RESERVATION_OUT_OF_BOOKING_WINDOW_LUNCH_DINNER]: { bookingTime: string, bookingDate: string, formattedTimeSlotsString: string },
    [MessageKeys.NO_RESERVATION_NO_SEAT]: { bookingTime: string, bookingDate: string },
    [MessageKeys.RESTAURANT_CLOSED]: {},
    [MessageKeys.RESTAURANT_OPEN]: {},
    [MessageKeys.RESTAURANT_CLOSED_W_INFO]: { lunchOpen: string, lunchClose: string, dinnerOpen: string, dinnerClose: string },
    [MessageKeys.FORMAT_EXISTING_BOOKINGS]: {},
    [MessageKeys.BOOKING_UPDATED]: {},
    [MessageKeys.BOOKING_NOT_UPDATED]: {},
    [MessageKeys.INVALIDATE_BOOKING_DATE]: {},
    [MessageKeys.NO_HOLIDAY]: {},
    [MessageKeys.FORMAT_HOLIDAY]: {},
    [MessageKeys.BOOKING_FOUND_W_PHONE]: { customerPhone: number },
    [MessageKeys.BOOKING_NOT_FOUND_W_PHONE]: { customerPhone: number },
    [MessageKeys.BOOKING_FOUND_W_RESERVATION_NUMBER]: { reservationNumber: number },
    [MessageKeys.BOOKING_NOT_FOUND_W_RESERVATION_NUMBER]: { reservationNumber: number },
    [MessageKeys.BOOKING_FOUND_W_DATE]: { bookingDate: string },
    [MessageKeys.BOOKING_NOT_FOUND_W_DATE]: { bookingDate: string },
    [MessageKeys.BOOKING_FOUND_W_EMAIL]: { bookingEmail: string }
    [MessageKeys.BOOKING_NOT_FOUND_W_EMAIL]: { bookingEmail: string },
    [MessageKeys.BOOKING_FOUND_W_NAME]: { bookingName: string },
    [MessageKeys.BOOKING_NOT_FOUND_W_NAME]: { bookingName: string },
    [MessageKeys.FORMAT_BOOKING_CANCELLATION_MODIFICATION]: { formattedBookingOptions: string },
    [MessageKeys.CANCELLATION_CONFIRMATION]: { partySize: number, bookingDate: string, startTime: string }
}
