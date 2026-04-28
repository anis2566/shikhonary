"use client";

import {
  useForm,
  zodResolver,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Calendar as CalendarIcon,
  CreditCard,
  User,
  Banknote,
  Hash,
  Clipboard,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useRouter } from "next/navigation";
import {
  AdmissionPaymentFormValues,
  admissionPaymentFormSchema,
} from "@workspace/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import {
  useUpdateAdmissionPayment,
  useAcademicYearsForSelection,
} from "@workspace/api-client";
import { admissionPaymentMethods } from "@workspace/utils/constants";
import { toast } from "sonner";
import { TenantTypes } from "@workspace/db";
import { cn } from "@workspace/ui/lib/utils";

interface EditAdmissionPaymentFormProps {
  payment: TenantTypes.AdmissionPayment;
}

export const EditAdmissionPaymentForm = ({
  payment,
}: EditAdmissionPaymentFormProps) => {
  const router = useRouter();

  const { mutateAsync: updatePayment, isPending } = useUpdateAdmissionPayment();
  const { data: academicYears } = useAcademicYearsForSelection();

  const form = useForm<AdmissionPaymentFormValues>({
    resolver: zodResolver(admissionPaymentFormSchema),
    defaultValues: {
      studentId: payment.studentId,
      academicYearId: payment.academicYearId,
      amount: Number(payment.amount),
      discount: Number(payment.discount),
      paidAmount: Number(payment.paidAmount),
      paymentDate: new Date(payment.paymentDate),
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId || "",
      status: payment.status,
      remarks: payment.remarks || "",
      collectedById: payment.collectedById,
    },
  });

  async function onSubmit(values: AdmissionPaymentFormValues) {
    try {
      await updatePayment({
        id: payment.id,
        ...values,
      });
      router.push("/payments/admission-payments");
    } catch (error: unknown) {
      toast.error("Failed to update admission payment");
      console.error(error);
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden border-none animate-fade-in transition-all duration-500">
      <div className="p-8 border-b border-surface-container/50 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 shadow-sm border border-emerald-100/50">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-on-background tracking-tight">
              Payment Details
            </h3>
            <p className="text-xs text-on-surface-variant font-medium">
              Update information for this transaction
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <FormItem className="space-y-2">
              <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Student
              </FormLabel>
              <FormControl>
                <Input
                  value={payment.student?.name || "N/A"}
                  disabled
                  className="h-12 bg-surface-container-low border-none rounded-lg px-4 py-3.5 font-medium text-slate-500"
                />
              </FormControl>
            </FormItem> */}

            <FormField
              control={form.control}
              name="academicYearId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Academic Year
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary/40">
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {academicYears?.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase flex items-center gap-2">
                    <Banknote className="w-3.5 h-3.5" />
                    Total Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus-visible:ring-2 focus-visible:ring-primary/40"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                    Discount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus-visible:ring-2 focus-visible:ring-primary/40"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paidAmount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                    Paid Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus-visible:ring-2 focus-visible:ring-primary/40 font-bold text-emerald-600"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Payment Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"ghost"}
                          className={cn(
                            "w-full h-12 bg-surface-container-low border-none rounded-lg px-4 text-left font-normal hover:bg-surface-container-low/80 transition-all focus:ring-2 focus:ring-primary/40",
                            !field.value && "text-on-surface-variant/40",
                          )}
                          disabled={isPending}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ms-auto text-on-surface-variant/60 w-5 h-5" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                    Payment Method
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary/40">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {admissionPaymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5" />
                    Transaction ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., TXN123456"
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus-visible:ring-2 focus-visible:ring-primary/40"
                      {...field}
                      value={field.value || ""}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                    Payment Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary/40">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase flex items-center gap-2">
                  <Clipboard className="w-3.5 h-3.5" />
                  Remarks
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Optional notes about this payment"
                    className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus-visible:ring-2 focus-visible:ring-primary/40"
                    {...field}
                    value={field.value || ""}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex items-center justify-end gap-3 -mx-8 -mb-8 p-8 bg-slate-50/50 border-t border-surface-container/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="px-6 h-11 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all active:scale-95"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 h-11 gradient-signature text-white rounded-lg font-bold text-sm shadow-glow hover:shadow-glow/80 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 border-none"
              disabled={isPending}
            >
              Update Payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
