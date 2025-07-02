import {Seat, SeatStatus} from "./types.ts";
import {RedisMessage} from "../../../shared/hooks/types.ts";
import {appConfig} from "../../../configuration/appConfig.ts";

export const wsMessageHandler = (
    data: RedisMessage,
    eventId: number,
    venueId: number) : Seat | null => {

    console.log(`[SeatMap] Received message from channel "${data.channel}" with pattern "${data.pattern}":`, data);

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
                lockerId: messagePayload[3],
            };

            console.log(`[wsMessageHandler] Parsed payload:`, seatUpdate);
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
