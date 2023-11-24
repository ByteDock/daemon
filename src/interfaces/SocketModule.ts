import { z } from "zod";

export interface SocketModule {
    EventName: string;
    EventSchema: z.ZodTypeAny;
    EventHandler: (args: z.ZodTypeAny) => void;
}