export interface RedisMessage {
    channel: string;
    pattern: string;
    message: string;
}