import { DetectIntentResponse, DialogflowResponse, WeeklyOperatingHours, Slot } from "../utils/types"
import { ERROR_MESSAGE, BOOKING_STATUS } from "../config/constants"
import { findAvailabilityByRestaurantPhoneAndDate, findBookingByCustomerDateAndBookingStatus, findRestaurantByPhone } from "../utils/firebaseFunctions"
import { formatTimeSlots, generateDialogflowResponse, getBookingDateAndtime, isTimeWithinRange } from "../utils/utils"
import { getMessage } from "../utils/dynamicMessages"
import { MessageKeys } from "../utils/messagesKey"

export const checkAvailableTables = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
    console.log('Checking available tables...')
    try {
        const session = detectIntentResponse.sessionInfo.session
        const parameters = detectIntentResponse.sessionInfo.parameters
        console.log(`Parameters: ${JSON.stringify(parameters, null, 2)}`)
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const { restaurantNumber, restaurantId } = parameters
        const partySize = parameters.party_size || parameters.new_party_size
        let day, month, year, hours, minutes = 0
        if (parameters.BOOKING_TYPE === "ALTERNATE") {
            day = parameters.alternative_booking_date.day as number
            month = parameters.alternative_booking_date.month as number
            year = parameters.alternative_booking_date.year as number
            hours = parameters.alternative_booking_time.hours as number
            minutes = parameters.alternative_booking_time.minutes as number
        }
        if (parameters.BOOKING_TYPE === "CHANGED") {
            day = parameters.new_booking_date.day as number
            month = parameters.new_booking_date.month as number
            year = parameters.new_booking_date.year as number
            hours = parameters.new_booking_time.hours as number
            minutes = parameters.new_booking_time.minutes as number
        } else {
            day = parameters.booking_date.day as number
            month = parameters.booking_date.month as number
            year = parameters.booking_date.year as number
            hours = parameters.booking_time.hours as number
            minutes = parameters.booking_time.minutes as number
        }
        if (day === 0) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }

        const { currentDay, bookingDate, bookingTime } = getBookingDateAndtime({ day: day, month: month - 1, year: year, hours: hours, minutes: minutes })
        console.log(`Date: ${bookingDate}, Time: ${bookingTime}, Day: ${currentDay}`)
        const restaurant = await findRestaurantByPhone(restaurantNumber)
        console.log(`Restaurant: ${JSON.stringify(restaurant, null, 2)}`)
        if (restaurant) {
            const { data: restaurantData } = restaurant

            // 1. Check for holiday
            const holiday = restaurantData.holidays.find(holiday => holiday.date === bookingDate)
            if (holiday) {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_HOLIDAY, { holidayReason: holiday.reason })
                    ],
                    {
                        session: session,
                        parameters: {
                            bookingStatus: BOOKING_STATUS.NO_BOOKING
                        }
                    }
                )
            }

            // Find the matching special event
            const specialEvent = restaurantData.specialEvents.find(event =>
                event.date === bookingDate && event.requiresReservation === true
            )
            if (specialEvent) {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_SPECIAL_EVENT, { specialEventName: specialEvent.name, specialEventDescription: specialEvent.description, websiteUrl: restaurantData.websiteUrl })
                    ],
                    {
                        session: session,
                        parameters: {
                            bookingStatus: BOOKING_STATUS.SPECIAL_EVENT
                        }
                    }
                )
            }

            // 3. Check if the restaurant is open on this day
            const operatingHours = restaurantData.operatingHours[currentDay as keyof WeeklyOperatingHours]
            if (!operatingHours) {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_OUT_OF_WORKING_HOURS, { bookingDate: bookingDate, bookingTime: bookingTime })
                    ],
                    {
                        session: session,
                        parameters: {
                            bookingStatus: BOOKING_STATUS.NO_BOOKING
                        }
                    }
                )
            }

            // 4. Get availability for the date
            const availability = await findAvailabilityByRestaurantPhoneAndDate({ restaurantNumber: restaurantNumber, date: bookingDate })
            console.log(`Availability: ${JSON.stringify(availability, null, 2)}`)
            if (!availability) {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_NO_AVAILABILITY, { bookingDate: bookingDate, bookingTime: bookingTime })
                    ],
                    {
                        session: session,
                        parameters: {
                            bookingStatus: BOOKING_STATUS.NO_BOOKING
                        }
                    }
                )
            }
            const { data: availabilityData, id: availabilityId } = availability
            console.log(`Availability id: ${availabilityId}`)
            console.log(`Availability data: ${JSON.stringify(availabilityData, null, 2)}`)

            console.log(`Booking date: ${bookingDate}, Restaurant id: ${restaurantId}, Status: ${parameters.restaurantData.isConfirmationRequired ? "pending" : "confirmed"}`)

            // Get the existing bookings for the booking date
            const existingBookings = await findBookingByCustomerDateAndBookingStatus({ date: bookingDate, restaurantId: restaurantId, status: parameters.restaurantData.isConfirmationRequired ? "pending" : "confirmed" })
            console.log(`Existing bookings: ${JSON.stringify(existingBookings, null, 2)}`)
            let alreadyBookedSeats = 0
            existingBookings?.data.forEach(data => {
                alreadyBookedSeats += data.partySize
            })

            console.log(`Already booked seats: ${alreadyBookedSeats}`)

            // 5. Check all-day reservation if enabled
            const { bookingStartTime, bookingEndTime, availableSeats } = availabilityData.accpetAllDayReservation
            console.log(`Booking start time: ${bookingStartTime}, Booking end time: ${bookingEndTime}, Available seats: ${availableSeats}`)
            console.log(`Accepts all day booking: ${availabilityData.accpetAllDayReservation.status}`)
            if (availabilityData.accpetAllDayReservation.status) {
                if (!isTimeWithinRange(bookingTime, bookingStartTime, bookingEndTime)) {
                    console.log("NO_RESERVATION_OUT_OF_BOOKING_WINDOW")
                    return generateDialogflowResponse(
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_OUT_OF_BOOKING_WINDOW, { bookingDate: bookingDate, bookingTime: bookingTime, bookingEndTime: bookingEndTime, bookingStartTime: bookingStartTime })
                        ],
                        {
                            session: session,
                            parameters: {
                                bookingStatus: BOOKING_STATUS.NO_BOOKING
                            }
                        }
                    )
                }

                if ((availableSeats - alreadyBookedSeats) < partySize) {
                    console.log("NO_RESERVATION_NO_SEAT")
                    return generateDialogflowResponse(
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_NO_SEAT, { bookingDate: bookingDate, bookingTime: bookingTime })
                        ],
                        {
                            session: session,
                            parameters: {
                                bookingStatus: BOOKING_STATUS.NO_BOOKING
                            }
                        }
                    )
                }

                return generateDialogflowResponse(
                    undefined,
                    {
                        session: session,
                        parameters: {
                            bookingStatus: BOOKING_STATUS.YES,
                            duration: availabilityData.accpetAllDayReservation.duration
                        }
                    }
                )
            }

            // 6. Check lunch and dinner slots
            let availableTimeSlots: Slot[] = []
            const lunchData = availabilityData.lunch
            if (lunchData) {
                // Add a small amount of logic to update the availableSeats depending on the alreadyBookedSeats
                const matchingSlots = lunchData.timeSlots.filter(slot => {
                    return isTimeWithinRange(bookingTime, slot.bookingStartTime, slot.bookingEndTime) &&
                        (slot.availableSeats - alreadyBookedSeats) >= partySize
                })
                availableTimeSlots = [...availableTimeSlots, ...matchingSlots]
            }
            const dinnerData = availabilityData.dinner
            if (dinnerData) {
                // Add a small amount of logic to update the availableSeats depending on the alreadyBookedSeats
                const matchingSlots = dinnerData.timeSlots.filter(slot => {
                    return isTimeWithinRange(bookingTime, slot.bookingStartTime, slot.bookingEndTime) &&
                        (slot.availableSeats - alreadyBookedSeats) >= partySize
                })
                availableTimeSlots = [...availableTimeSlots, ...matchingSlots]
            }
            availableTimeSlots.forEach(timeSlot => {
                timeSlot.availableSeats = timeSlot.availableSeats - alreadyBookedSeats
            })

            if (availableTimeSlots.length === 0) {
                const allSlots = availabilityData.lunch.timeSlots.concat(availabilityData.dinner.timeSlots).map(slot => slot)

                const formattedTimeSlotsString = formatTimeSlots({ availability: availabilityData })
                console.log(`Formatted time slots: ${formattedTimeSlotsString}`)

                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_OUT_OF_BOOKING_WINDOW_LUNCH_DINNER, { bookingDate: bookingDate, bookingTime: bookingTime, formattedTimeSlotsString: formattedTimeSlotsString })
                    ],
                    {
                        session: session,
                        parameters: {
                            bookingStatus: BOOKING_STATUS.NO,
                            availableTimeSlots: allSlots
                        }
                    }
                )
            }

            return generateDialogflowResponse(
                undefined,
                {
                    session: session,
                    parameters: {
                        bookingStatus: BOOKING_STATUS.YES,
                        availableTimeSlots: availableTimeSlots,
                        duration: availableTimeSlots[0].duration
                    }
                }
            )

        } else {
            console.error('Restaurant not found in Firestore.')
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.RESTAURANT_CLOSED, {})
                ]
            )
        }
    } catch (error) {
        console.error('Error checking restaurant status:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
