"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, User, FileText, Shield, Clock } from "lucide-react"

async function submitLeadToAPI(leadData: any) {
  const apiUrl = process.env.NEXT_PUBLIC_CRM_API_URL || 'https://lawproactive-crm.vercel.app/api/leads'

  const response = await fetch(`${apiUrl}/api/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(leadData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to submit lead')
  }

  return await response.json()
}



const step1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
})

const step2Schema = z.object({
  caseType: z.string().min(1, "Please select a case type"),
  accidentDate: z.string().optional(),
  urgency: z.string().min(1, "Please select urgency level"),
  description: z.string().min(10, "Please provide at least 10 characters describing your case"),
  consent: z.boolean().refine((val) => val === true, "You must agree to be contacted"),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type FullFormData = Step1Data & Step2Data

interface TwoStepLeadModalProps {
  trigger: React.ReactNode
  source: string
  city: string
  state?: string
  caseType?: string
  onOpenChange?: (open: boolean) => void
}

export function TwoStepLeadModal({ trigger, source, city, state, caseType, onOpenChange }: TwoStepLeadModalProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const { toast } = useToast()

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  })

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      caseType: caseType || "",
    },
  })

  const onStep1Submit = (data: Step1Data) => {
    setStep1Data(data)
    setCurrentStep(2)

    // Track step 1 completion
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_step_1_complete", {
        event_category: "Lead",
        event_label: source,
      })
    }
  }

  const onStep2Submit = async (data: Step2Data) => {
    if (!step1Data) return

    setIsSubmitting(true)
    try {
      // Usar el estado pasado como prop o extraer de la URL/source como fallback
      const finalState = state || extractStateFromSource(source)

      const fullData: FullFormData & { city: string; state: string; source: string; timestamp: string } = {
        ...step1Data,
        ...data,
        city,
        state: finalState, // Usar estado dinámico
        source: "Personal Injury", // Always use "Landing Page" for CRM constraint
        timestamp: new Date().toISOString(),
      }

      const result = await submitLeadToAPI(fullData)

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

        setIsSuccess(true)
        toast({
          title: "Success!",
          description: "Your information has been submitted. An attorney will contact you within 24 hours.",
        })
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

  const resetForm = () => {
    setCurrentStep(1)
    setStep1Data(null)
    setIsSuccess(false)
    step1Form.reset()
    step2Form.reset()
  }

  const handleClose = () => {
    setOpen(false)
    onOpenChange?.(false)

    // Emit global event for banner to listen
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("leadModalClose"))
    }

    setTimeout(resetForm, 300) // Reset after modal closes
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)

    // Emit global events for banner to listen
    if (typeof window !== "undefined") {
      if (newOpen) {
        window.dispatchEvent(new Event("leadModalOpen"))
      } else {
        window.dispatchEvent(new Event("leadModalClose"))
      }
    }
  }

  const SuccessContent = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-4 text-gray-900">Thank You for Contacting Us!</h3>
      <p className="text-gray-600 mb-6">
        We have received your information. A specialized personal injury attorney will contact you within the next 24
        hours to discuss your case.
      </p>
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          <strong>In the meantime:</strong> Gather any documents related to your accident (police reports, medical
          bills, photos, etc.)
        </p>
      </div>
      <Button onClick={handleClose} style={{ backgroundColor: '#0B6B65' }} className="hover:opacity-90">
        Close
      </Button>
    </motion.div>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        {isSuccess ? (
          <div className="p-6">
            <SuccessContent />
          </div>
        ) : (
          <>
            {/* Header with Progress */}
            <div className="text-white p-6 rounded-t-lg" style={{ background: 'linear-gradient(to right, #0B6B65, #0B6B65)' }}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Free Case Evaluation</DialogTitle>
                <p className="text-center text-white/80 mt-2">
                  Step {currentStep} of 2 - {currentStep === 1 ? "Contact Information" : "Case Details"}
                </p>
              </DialogHeader>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Progress</span>
                  <span className="text-sm text-white/70">{currentStep === 1 ? "50%" : "100%"}</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: '#e06e00' }}
                    initial={{ width: "0%" }}
                    animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0B6B65', opacity: 0.1 }}>
                        <User className="h-5 w-5" style={{ color: '#0B6B65' }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Contact Information</h3>
                        <p className="text-gray-600 text-sm">So we can reach you quickly</p>
                      </div>
                    </div>

                    <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            {...step1Form.register("firstName")}
                            className={step1Form.formState.errors.firstName ? "border-red-500" : ""}
                            placeholder="Your first name"
                          />
                          {step1Form.formState.errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.firstName.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            {...step1Form.register("lastName")}
                            className={step1Form.formState.errors.lastName ? "border-red-500" : ""}
                            placeholder="Your last name"
                          />
                          {step1Form.formState.errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...step1Form.register("email")}
                          className={step1Form.formState.errors.email ? "border-red-500" : ""}
                          placeholder="your@email.com"
                        />
                        {step1Form.formState.errors.email && (
                          <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...step1Form.register("phone")}
                          className={step1Form.formState.errors.phone ? "border-red-500" : ""}
                          placeholder="(555) 123-4567"
                        />
                        {step1Form.formState.errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.phone.message}</p>
                        )}
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800 mb-2">
                          <Shield className="h-4 w-4" />
                          <span className="font-semibold text-sm">This is an Attorney Advertisement</span>
                        </div>
                        <p className="text-green-700 text-xs">
                          By submitting this form, you agree to be contacted by an attorney (or intake). Results may vary.
                        </p>
                      </div>

                      <Button type="submit" className="w-full text-lg py-3 text-white hover:opacity-90" style={{ backgroundColor: '#0B6B65' }}>
                        Continue to Step 2
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0B6B65', opacity: 0.1 }}>
                        <FileText className="h-5 w-5" style={{ color: '#0B6B65' }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Case Details</h3>
                        <p className="text-gray-600 text-sm">Tell us about your accident</p>
                      </div>
                    </div>

                    <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                      <div>
                        <Label htmlFor="caseType">Type of Case *</Label>
                        <Select
                          onValueChange={(value) => step2Form.setValue("caseType", value)}
                          defaultValue={caseType || ""}
                        >
                          <SelectTrigger className={step2Form.formState.errors.caseType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select the type of accident" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="car-accident">🚗 Car Accident</SelectItem>
                            <SelectItem value="slip-fall">⚠️ Slip & Fall</SelectItem>
                            <SelectItem value="medical-malpractice">🏥 Medical Malpractice</SelectItem>
                            <SelectItem value="workplace-injury">🏗️ Workplace Injury</SelectItem>
                            <SelectItem value="product-liability">📦 Product Liability</SelectItem>
                            <SelectItem value="wrongful-death">💔 Wrongful Death</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {step2Form.formState.errors.caseType && (
                          <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.caseType.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="accidentDate">When did it occur?</Label>
                          <Input id="accidentDate" type="date" {...step2Form.register("accidentDate")} />
                        </div>
                        <div>
                          <Label htmlFor="urgency">Urgency *</Label>
                          <Select onValueChange={(value) => step2Form.setValue("urgency", value)}>
                            <SelectTrigger className={step2Form.formState.errors.urgency ? "border-red-500" : ""}>
                              <SelectValue placeholder="Urgency level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate (24 hours)</SelectItem>
                              <SelectItem value="urgent">Urgent (1 week)</SelectItem>
                              <SelectItem value="normal">Normal (2 weeks)</SelectItem>
                              <SelectItem value="planning">Just planning ahead</SelectItem>
                            </SelectContent>
                          </Select>
                          {step2Form.formState.errors.urgency && (
                            <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.urgency.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Describe your case *</Label>
                        <Textarea
                          id="description"
                          {...step2Form.register("description")}
                          placeholder="Please describe your accident, injuries, and any other relevant details..."
                          className={step2Form.formState.errors.description ? "border-red-500" : ""}
                          rows={4}
                        />
                        {step2Form.formState.errors.description && (
                          <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.description.message}</p>
                        )}
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="consent"
                          onCheckedChange={(checked) => step2Form.setValue("consent", checked as boolean)}
                          className={step2Form.formState.errors.consent ? "border-red-500" : ""}
                        />
                        <Label htmlFor="consent" className="text-sm leading-5">
                          I agree to be contacted by phone, email, or text message by LawProactive or partner attorneys
                          regarding my case. Message and data rates may apply. *
                        </Label>
                      </div>
                      {step2Form.formState.errors.consent && (
                        <p className="text-red-500 text-sm">{step2Form.formState.errors.consent.message}</p>
                      )}

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800 mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold text-sm">Guaranteed Quick Response</span>
                        </div>
                        <p className="text-yellow-700 text-xs">
                          A specialized attorney will contact you within 24 hours. No upfront cost.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 service-button">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 text-white hover:opacity-90"
                          style={{ backgroundColor: '#e06e00' }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Get My Free Evaluation"
                          )}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs text-gray-500 text-center mt-6">
                By submitting this form, you agree to our Terms of Service and Privacy Policy. No attorney-client
                relationship is formed until you sign a retainer agreement.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Función helper para extraer estado del source
function extractStateFromSource(source: string): string {
  // Si el source incluye información del estado
  if (source.includes('california')) return 'California'
  if (source.includes('texas')) return 'Texas'
  if (source.includes('florida')) return 'Florida'
  if (source.includes('new-york')) return 'New York'
  if (source.includes('nevada')) return 'Nevada'
  if (source.includes('arizona')) return 'Arizona'
  if (source.includes('washington')) return 'Washington'
  if (source.includes('oregon')) return 'Oregon'
  if (source.includes('colorado')) return 'Colorado'
  if (source.includes('utah')) return 'Utah'
  if (source.includes('new-mexico')) return 'New Mexico'
  if (source.includes('montana')) return 'Montana'
  if (source.includes('wyoming')) return 'Wyoming'
  if (source.includes('idaho')) return 'Idaho'
  if (source.includes('north-dakota')) return 'North Dakota'
  if (source.includes('south-dakota')) return 'South Dakota'
  if (source.includes('nebraska')) return 'Nebraska'
  if (source.includes('kansas')) return 'Kansas'
  if (source.includes('oklahoma')) return 'Oklahoma'
  if (source.includes('arkansas')) return 'Arkansas'
  if (source.includes('louisiana')) return 'Louisiana'
  if (source.includes('mississippi')) return 'Mississippi'
  if (source.includes('alabama')) return 'Alabama'
  if (source.includes('tennessee')) return 'Tennessee'
  if (source.includes('kentucky')) return 'Kentucky'
  if (source.includes('missouri')) return 'Missouri'
  if (source.includes('iowa')) return 'Iowa'
  if (source.includes('minnesota')) return 'Minnesota'
  if (source.includes('wisconsin')) return 'Wisconsin'
  if (source.includes('illinois')) return 'Illinois'
  if (source.includes('michigan')) return 'Michigan'
  if (source.includes('indiana')) return 'Indiana'
  if (source.includes('ohio')) return 'Ohio'
  if (source.includes('west-virginia')) return 'West Virginia'
  if (source.includes('virginia')) return 'Virginia'
  if (source.includes('north-carolina')) return 'North Carolina'
  if (source.includes('south-carolina')) return 'South Carolina'
  if (source.includes('georgia')) return 'Georgia'
  if (source.includes('pennsylvania')) return 'Pennsylvania'
  if (source.includes('maryland')) return 'Maryland'
  if (source.includes('delaware')) return 'Delaware'
  if (source.includes('new-jersey')) return 'New Jersey'
  if (source.includes('connecticut')) return 'Connecticut'
  if (source.includes('rhode-island')) return 'Rhode Island'
  if (source.includes('massachusetts')) return 'Massachusetts'
  if (source.includes('vermont')) return 'Vermont'
  if (source.includes('new-hampshire')) return 'New Hampshire'
  if (source.includes('maine')) return 'Maine'
  if (source.includes('alaska')) return 'Alaska'
  if (source.includes('hawaii')) return 'Hawaii'

  // Fallback: extraer de la URL actual
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    const segments = pathname.split('/')
    if (segments[1]) {
      const stateSlug = segments[1]
      return stateSlug.charAt(0).toUpperCase() + stateSlug.slice(1).replace(/-/g, ' ')
    }
  }

  return 'Unknown'
}