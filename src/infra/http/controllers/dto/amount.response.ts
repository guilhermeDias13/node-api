import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export class AmountResponse extends createZodDto(z.object({ amount: z.number() })) {}
