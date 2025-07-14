"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { submitLead } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const leadSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  caseType: z.string().min(1, "Please select a case type"),
  accidentDate: z.string().optional(),
  description: z.string().min(10, "Please provide at least 10 characters describing your case"),
  consent: z.boolean().refine((val) => val === true, "You must agree to be contacted"),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadCaptureModalProps {
  trigger: React.ReactNode
  source: string
  city: string
  caseType?: string
}

export function LeadCaptureModal({ trigger, source, city, caseType }: LeadCaptureModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      caseType: caseType || "",
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    try {
      const result = await submitLead({
        ...data,
        city,
        source,
        timestamp: new Date().toISOString(),
      })

      if (result.success) {
        // Track conversion
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "conversion", {
            send_to: "AW-CONVERSION_ID/CONVERSION_LABEL",
            value: 1.0,
            currency: "USD",
            event_category: "Lead",
            event_label: source,
          })
        }

        toast({
          title: "Success!",
          description: "Your information has been submitted. An attorney will contact you within 24 hours.",
        })
        setOpen(false)
        reset()
      } else {
        throw new Error(result.error || "Failed to submit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Get Your Free Case Review</DialogTitle>
          <p className="text-center text-gray-600">
            Fill out this form and an experienced attorney will contact you within 24 hours.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="caseType">Type of Case *</Label>
            <Select onValueChange={(value) => setValue("caseType", value)} defaultValue={caseType || ""}>
              <SelectTrigger className={errors.caseType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your case type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car-accident">Car Accident</SelectItem>
                <SelectItem value="slip-fall">Slip & Fall</SelectItem>
                <SelectItem value="medical-malpractice">Medical Malpractice</SelectItem>
                <SelectItem value="workplace-injury">Workplace Injury</SelectItem>
                <SelectItem value="product-liability">Product Liability</SelectItem>
                <SelectItem value="wrongful-death">Wrongful Death</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.caseType && <p className="text-red-500 text-sm mt-1">{errors.caseType.message}</p>}
          </div>

          <div>
            <Label htmlFor="accidentDate">When did the accident occur?</Label>
            <Input id="accidentDate" type="date" {...register("accidentDate")} />
          </div>

          <div>
            <Label htmlFor="description">Describe your case *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Please provide details about your accident and injuries..."
              className={errors.description ? "border-red-500" : ""}
              rows={4}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              onCheckedChange={(checked) => setValue("consent", checked as boolean)}
              className={errors.consent ? "border-red-500" : ""}
            />
            <Label htmlFor="consent" className="text-sm leading-5">
              I agree to be contacted by phone, email, or text message by LawProactive or partner attorneys regarding my
              case. Message and data rates may apply. *
            </Label>
          </div>
          {errors.consent && <p className="text-red-500 text-sm">{errors.consent.message}</p>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Get My Free Case Review"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By submitting this form, you agree to our Terms of Service and Privacy Policy. No attorney-client
            relationship is formed until you sign a retainer agreement.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
