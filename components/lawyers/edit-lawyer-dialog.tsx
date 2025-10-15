"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useLawyers, type Lawyer } from "@/hooks/use-lawyers"
import { useToast } from "@/hooks/use-toast"

interface EditLawyerDialogProps {
  lawyer: Lawyer
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditLawyerDialog({ lawyer, open, onOpenChange, onSuccess }: EditLawyerDialogProps) {
  const { updateLawyer } = useLawyers()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: lawyer.first_name || "",
    last_name: lawyer.last_name || "",
    email: lawyer.email,
    phone: lawyer.phone || "",
    location: lawyer.location || "",
    law_firm: lawyer.law_firm || "",
    bar_number: lawyer.bar_number || "",
    specialization: lawyer.specialization || "",
    years_experience: lawyer.years_experience || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await updateLawyer(lawyer.id, formData)

      if (success) {
        toast({
          title: "Success",
          description: "Lawyer profile updated successfully",
        })
        onSuccess()
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to update lawyer profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lawyer Profile</DialogTitle>
          <DialogDescription>
            Update the lawyer's information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="John"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@lawfirm.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="law_firm">Law Firm</Label>
              <Input
                id="law_firm"
                value={formData.law_firm}
                onChange={(e) => setFormData({ ...formData, law_firm: e.target.value })}
                placeholder="Smith & Associates"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bar_number">Bar Number</Label>
              <Input
                id="bar_number"
                value={formData.bar_number}
                onChange={(e) => setFormData({ ...formData, bar_number: e.target.value })}
                placeholder="123456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Los Angeles, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Personal Injury"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                placeholder="5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

