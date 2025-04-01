import { z } from 'zod'
 
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long.' })
    .trim(),
    sname: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long.' })
    .trim(),
    stdno: z
    .string()
    .min(8, { message: 'Student number is 8 characters long' })
    .trim(),
    dept: z
    .string()
    .nonempty()
    .trim(),
    email: z.string()
    .email({ message: 'Please enter a valid email.' })
    .regex(/^[a-zA-Z0-9._%+-]+@emu\.edu\.tr$/, { message: 'Email must end with @emu.edu.tr(Use school assigned email)' })
    .trim(),
    phoneno: z
    .string()
    .min(7, { message: 'Phone number must be at least 7 characters long.' })
    .trim(),
    password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})