'use server'; // explicit server declaration
/**
 * These server functions can then be imported and used in Client and Server components.
 * Any functions included in this file that are not used will be automatically removed from the final application bundle.
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer'
    }),
    amount: z.coerce.number()
        // coercing to 0 will default to 0 if empty. So we check for greater than
        .gt(0, { message: 'Please enter an amount greater than $0' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please enter an invoice status.'
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

export async function createInvoice(prevState: State, formData: FormData) {

    const validationOutcome = CreateInvoice.safeParse({ // changed from .parse to enable validation
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    if (!validationOutcome.success) {
        return {
            errors: validationOutcome.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create invoice.'
        };
    }
    const { customerId, amount, status } = validationOutcome.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try{
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `
    } catch (error) {
        // This will happen on the server
        console.log(error);
    }

    /**
     * This will clear the cache and trigger a new request to the server
     */
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {

    const validationOutcome = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if(!validationOutcome.success){
        return {
            errors: validationOutcome.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to update invoice.'
        }
    }

    const { customerId, amount, status } = validationOutcome.data;

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId},
                amount      = ${amountInCents},
                status      = ${status}
            WHERE id = ${id}
        `
    } catch (error) {
        // Will log on the server side
        console.error(error);
    }

    // Calling revalidatePath to clear the client cache and make a new server request.
    revalidatePath('/dashboard/invoices');
    // Navigation
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    throw new Error('Error here!')
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}