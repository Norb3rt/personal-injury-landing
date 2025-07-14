"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { submitLead } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle } from "lucide-react"

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  caseType: z.string().min(1, "Please select a case type"),
  urgency: z.string().min(1, "Please select urgency level"),
  description: z.string().min(10, "Please provide at least 10 characters describing your case"),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  city: string
}

export function ContactForm({ city }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const result = await submitLead({
        ...data,
        city,
        source: "contact-form",
        timestamp: new Date().toISOString(),
        consent: true, // Implied consent for contact form
      })

      if (result.success) {
        // Track conversion
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "conversion", {
            send_to: "AW-CONVERSION_ID/CONVERSION_LABEL",
            value: 1.0,
            currency: "USD",
            event_category: "Lead",
            event_label: "contact-form",
          })
        }

        setIsSubmitted(true)
        toast({
          title: "Success!",
          description: "Your message has been sent. We'll contact you within 24 hours.",
        })
        reset()
      } else {
        throw new Error(result.error || "Failed to submit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your information has been submitted successfully. An experienced attorney will contact you within 24 hours
            to discuss your case.
          </p>
          <p className="text-sm text-gray-500">
            In the meantime, please gather any relevant documents related to your case.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Your Free Case Evaluation</CardTitle>
        <p className="text-gray-600">Complete this form for a detailed case review</p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-firstName">First Name *</Label>
            <Input
              id="contact-firstName"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="contact-lastName">Last Name *</Label>
            <Input
              id="contact-lastName"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="contact-email">Email Address *</Label>
          <Input
            id="contact-email"
            type="email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="contact-phone">Phone Number *</Label>
          <Input
            id="contact-phone"
            type="tel"
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-caseType">Type of Case *</Label>
            <Select onValueChange={(value) => setValue("caseType", value)}>
              <SelectTrigger className={errors.caseType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select case type" />
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
            <Label htmlFor="contact-urgency">How urgent is your case? *</Label>
            <Select onValueChange={(value) => setValue("urgency", value)}>
              <SelectTrigger className={errors.urgency ? "border-red-500" : ""}>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (within 24 hours)</SelectItem>
                <SelectItem value="urgent">Urgent (within 1 week)</SelectItem>
                <SelectItem value="normal">Normal (within 2 weeks)</SelectItem>
                <SelectItem value="planning">Just planning ahead</SelectItem>
              </SelectContent>
            </Select>
            {errors.urgency && <p className="text-red-500 text-sm mt-1">{errors.urgency.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="contact-description">Tell us about your case *</Label>
          <Textarea
            id="contact-description"
            {...register("description")}
            placeholder="Please describe your accident, injuries, and any other relevant details..."
            className={errors.description ? "border-red-500" : ""}
            rows={5}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send My Information"
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to be contacted regarding your case. All information is confidential.
        </p>
      </form>
    </Card>
  )
}
