export interface RedisMessage {
    channel: string; // Например, 'seats_seatmap:lock:event:1'
    pattern: string;
    message: string; // Строка JSON, например, "[1, \"A\", \"2\"]"
}