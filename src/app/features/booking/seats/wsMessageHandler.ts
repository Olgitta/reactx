import {Seat, SeatStatus} from '../types';
import {RedisMessage} from '../../../shared/hooks/types.ts';
import {appConfig} from '../../../configuration/appConfig.ts';

/**
 *
 * @param data - The data payload containing WS channel, pattern, and message details.
 * @param data.channel - The channel name "seat_events", representing "seat_events:<eventId>_<venueId>".
 * @param data.pattern - The pattern "seat:events:*_*" where "seat_events:<eventId>_<venueId>".
 * @param data.message - An array representing the seat status update.
 * @param data.message[0] - The `statusId` of the seat (e.g., `SeatStatus.Available`).
 * @param data.message[1] - The `rowNumber` of the seat.
 * @param data.message[2] - The `seatNumber` of the seat.
 * @param data.message[3] - The `id` associated with the seat.
 * @param eventId - The unique identifier for the event.
 * @param venueId - The unique identifier for the venue.
 */
export const wsMessageHandler = (
    data: RedisMessage,
    eventId: number,
    venueId: number) : Seat | null => {

    console.log(`[wsMessageHandler] Received message from channel "${data.channel}" with pattern "${data.pattern}":`, data);

    try {
        const channelParts = data.channel.split(':');
        if (data.pattern === appConfig.ws.channels.seatsEventsMessagePattern && channelParts.length >= 3) {
            const [receivedEventId, receivedVenueId] = channelParts[2].split('_').map(Number);

            if (receivedEventId !== eventId || receivedVenueId !== venueId) {
                console.log(`[wsMessageHandler] Ignoring message. Expected eventId: ${eventId}, venueId: ${venueId}. Received: ${receivedEventId}_${receivedVenueId}.`);
                return null;
            }

            const messagePayload: [SeatStatus, string, string, string] = JSON.parse(data.message);
            const seatUpdate: Seat = {
                statusId: messagePayload[0],
                rowNumber: messagePayload[1],
                seatNumber: messagePayload[2],
                guestId: messagePayload[3],
            };

            console.log('[wsMessageHandler] Parsed payload:', seatUpdate);
            return seatUpdate;
        } else {
            console.log(`[wsMessageHandler] Ignoring message with pattern "${data.pattern}" or invalid channel format.`);
            return null;
        }
    } catch (e) {
        console.error('[wsMessageHandler] Error parsing WebSocket message or updating seat:', e);
        return null;
    }

}
