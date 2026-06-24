"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Building,
  Scale,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  CreditCard,
  Shield,
} from "lucide-react"
import { type Lawyer } from "@/hooks/use-lawyers"
import { format } from "date-fns"

interface ViewLawyerDialogProps {
  lawyer: Lawyer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewLawyerDialog({ lawyer, open, onOpenChange }: ViewLawyerDialogProps) {
  const getFullName = () => {
    return `${lawyer.first_name || ""} ${lawyer.last_name || ""}`.trim() || "N/A"
  }

  const getInitials = () => {
    const firstName = lawyer.first_name || ""
    const lastName = lawyer.last_name || ""
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "?"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lawyer Profile</DialogTitle>
          <DialogDescription>
            Complete profile information for this lawyer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{getFullName()}</h3>
              <p className="text-muted-foreground">{lawyer.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {lawyer.is_admin && (
                  <Badge variant="default">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
                {lawyer.banned ? (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Banned
                  </Badge>
                ) : (
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
                {lawyer.has_payment_method && (
                  <Badge variant="secondary">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Payment Setup
                  </Badge>
                )}
                {lawyer.trial_used && (
                  <Badge variant="outline">Trial Used</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h4 className="font-semibold text-lg mb-4">Professional Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lawyer.law_firm && (
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Law Firm</p>
                      <p className="text-sm text-muted-foreground">{lawyer.law_firm}</p>
                    </div>
                  </div>
                )}

                {lawyer.bar_number && (
                  <div className="flex items-start space-x-3">
                    <Scale className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Bar Number</p>
                      <p className="text-sm text-muted-foreground">{lawyer.bar_number}</p>
                    </div>
                  </div>
                )}

                {lawyer.specialization && (
                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Specialization</p>
                      <p className="text-sm text-muted-foreground">{lawyer.specialization}</p>
                    </div>
                  </div>
                )}

                {lawyer.years_experience !== null && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Years of Experience</p>
                      <p className="text-sm text-muted-foreground">{lawyer.years_experience} years</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h4 className="font-semibold text-lg mb-4">Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{lawyer.email}</p>
                  </div>
                </div>

                {lawyer.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{lawyer.phone}</p>
                    </div>
                  </div>
                )}

                 {(lawyer.street_address || lawyer.city || lawyer.state || lawyer.zip_code) ? (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Office Address</p>
                      <p className="text-sm text-muted-foreground">
                        {lawyer.street_address}
                        {lawyer.suite_unit && `, ${lawyer.suite_unit}`}
                        <br />
                        {lawyer.city && `${lawyer.city}, `}
                        {lawyer.state} {lawyer.zip_code}
                      </p>
                    </div>
                  </div>
                ) : lawyer.location ? (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{lawyer.location}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h4 className="font-semibold text-lg mb-4">Account Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(lawyer.created_at), "PPP")}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(lawyer.updated_at), "PPP")}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground capitalize">{lawyer.role}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-sm text-muted-foreground">
                    {lawyer.banned ? "Banned" : "Active"}
                  </p>
                </div>

                {lawyer.banned && lawyer.banned_reason && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-destructive">Ban Reason</p>
                    <p className="text-sm text-muted-foreground">{lawyer.banned_reason}</p>
                    {lawyer.banned_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Banned on {format(new Date(lawyer.banned_at), "PPP")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

