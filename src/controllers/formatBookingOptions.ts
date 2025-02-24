import { Bookings, DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse } from "../utils/utils"
import { ERROR_MESSAGE } from "../config/constants"
import { MessageKeys } from "../utils/messagesKey"
import { getMessage } from "../utils/dynamicMessages"

export const formatBookingOptions = (detectIntentResponse: DetectIntentResponse): DialogflowResponse | null => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        if (parameters.foundBooking === "YES") {
            const bookings = parameters.booking as Bookings[];
            const formattedBookingOptions = bookings.map((booking, index) => {
                return `Option: ${index + 1} Reservation Number: ${booking.reservationNumber}, Name: ${booking.customerName}, Email: ${booking.customerEmail}, Date: ${booking.date}`;
            })
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.FORMAT_BOOKING_CANCELLATION_MODIFICATION, { formattedBookingOptions: formattedBookingOptions.join(", ") }),
                ]
            )
        }
        return null
    } catch (error) {
        console.error('Error at getReservationFromParameter:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
