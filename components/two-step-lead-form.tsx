"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Step {
  id: number
  label: string
  content: React.ReactNode
}

interface TwoStepLeadFormProps {
  city: string
}

const TwoStepLeadForm: React.FC<TwoStepLeadFormProps> = ({ city }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  const steps = [
    {
      id: 1,
      label: "Tell us about your accident",
      content: (
        <div>
          <Label htmlFor="accidentType">Type of Accident</Label>
          <Input type="text" id="accidentType" name="accidentType" />
        </div>
      ),
    },
    {
      id: 2,
      label: "Your contact information",
      content: (
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input type="tel" id="phone" name="phone" />
        </div>
      ),
    },
  ]

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1)
  }

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === steps.length - 1) {
      alert(JSON.stringify(formData))
    } else {
      nextStep()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
      data-hero-form
    >
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-gray-700 text-xl font-bold mb-2">{steps[currentStep].label}</h2>
          <div>{steps[currentStep].content}</div>
        </div>

        <div className="flex items-center justify-between">
          {currentStep > 0 && (
            <Button type="button" onClick={prevStep} variant="outline">
              Previous
            </Button>
          )}

          {currentStep < steps.length - 1 ? <Button type="submit">Next</Button> : <Button type="submit">Submit</Button>}
        </div>
      </form>
    </motion.div>
  )
}

// --- exports ---
export { TwoStepLeadForm }
export default TwoStepLeadForm
