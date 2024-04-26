export enum TicketStatus {
    PENDING = 1,
    ONGOING = 2,
    COMPLETE = 3
}

export enum MessageStatus {
    SENT = 1,
    DELIVERED = 2,
    READ = 3,
    READALL = 4,
    DELETE = 5,
    EDIT = 6,
    REPLY = 7,
}

export enum ConvType {
    USER = 1,
    GROUP = 2,
    BROADCAST = 3,
}

export enum MsgType {
    TEXT = 1,
    IMAGE = 2,
    AUDIO = 3,
    VIDEO = 4,
    LOCATION = 5,
    DOCUMENT = 6,
}