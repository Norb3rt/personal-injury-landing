"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  RefreshCw,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Loader2,
  Grid3X3,
  List,
  Filter,
  UserCheck,
  Building,
  Scale,
  Phone,
  Mail,
} from "lucide-react"
import { useLawyers, type Lawyer } from "@/hooks/use-lawyers"
import { EditLawyerDialog } from "./edit-lawyer-dialog"
import { ViewLawyerDialog } from "./view-lawyer-dialog"

export function LawyerManagement() {
  const { lawyers, loading, error, fetchLawyers, deleteLawyer } = useLawyers({
    autoFetch: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [lawyerToDelete, setLawyerToDelete] = useState<Lawyer | null>(null)

  useEffect(() => {
    setFilteredLawyers(lawyers)
  }, [lawyers])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredLawyers(lawyers)
      return
    }

    const searchTerm = query.toLowerCase()
    const filtered = lawyers.filter(
      (lawyer) =>
        lawyer.first_name?.toLowerCase().includes(searchTerm) ||
        lawyer.last_name?.toLowerCase().includes(searchTerm) ||
        lawyer.email.toLowerCase().includes(searchTerm) ||
        lawyer.phone?.toLowerCase().includes(searchTerm) ||
        lawyer.law_firm?.toLowerCase().includes(searchTerm) ||
        lawyer.bar_number?.toLowerCase().includes(searchTerm) ||
        lawyer.location?.toLowerCase().includes(searchTerm) ||
        lawyer.specialization?.toLowerCase().includes(searchTerm)
    )
    setFilteredLawyers(filtered)
  }

  const handleEdit = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
    setIsEditDialogOpen(true)
  }

  const handleView = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
    setIsViewDialogOpen(true)
  }

  const handleDeleteClick = (lawyer: Lawyer) => {
    setLawyerToDelete(lawyer)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!lawyerToDelete) return

    const success = await deleteLawyer(lawyerToDelete.id)
    if (success) {
      setIsDeleteDialogOpen(false)
      setLawyerToDelete(null)
    }
  }

  const getFullName = (lawyer: Lawyer) => {
    return `${lawyer.first_name || ""} ${lawyer.last_name || ""}`.trim() || "N/A"
  }

  const getInitials = (lawyer: Lawyer) => {
    const firstName = lawyer.first_name || ""
    const lastName = lawyer.last_name || ""
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "?"
  }

  const LawyersCardView = ({ lawyers }: { lawyers: Lawyer[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-fr w-full">
      {lawyers.map((lawyer) => (
        <Card key={lawyer.id} className="border hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(lawyer)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{getFullName(lawyer)}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{lawyer.email}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleView(lawyer)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(lawyer)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteClick(lawyer)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            <div className="space-y-2 text-sm">
              {lawyer.law_firm && (
                <div className="flex items-center text-muted-foreground">
                  <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{lawyer.law_firm}</span>
                </div>
              )}
              {lawyer.bar_number && (
                <div className="flex items-center text-muted-foreground">
                  <Scale className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Bar #: {lawyer.bar_number}</span>
                </div>
              )}
              {lawyer.phone && (
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{lawyer.phone}</span>
                </div>
              )}
              {lawyer.location && (
                <div className="flex items-center text-muted-foreground">
                  <UserCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{lawyer.location}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {lawyer.specialization && (
                <Badge variant="secondary" className="text-xs">
                  {lawyer.specialization}
                </Badge>
              )}
              {lawyer.years_experience && (
                <Badge variant="outline" className="text-xs">
                  {lawyer.years_experience} years
                </Badge>
              )}
              {lawyer.banned && (
                <Badge variant="destructive" className="text-xs">
                  Banned
                </Badge>
              )}
              {lawyer.has_payment_method && (
                <Badge variant="default" className="text-xs">
                  Payment Setup
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const LawyersListView = ({ lawyers }: { lawyers: Lawyer[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium hidden sm:table-cell">Email</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Phone</th>
            <th className="text-left p-3 font-medium">Law Firm</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">Bar Number</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">Location</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lawyers.map((lawyer) => (
            <tr key={lawyer.id} className="border-b hover:bg-muted/50">
              <td className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(lawyer)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{getFullName(lawyer)}</div>
                    <div className="text-sm text-muted-foreground sm:hidden">{lawyer.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 text-muted-foreground hidden sm:table-cell">{lawyer.email}</td>
              <td className="p-3 text-muted-foreground hidden md:table-cell">{lawyer.phone || "N/A"}</td>
              <td className="p-3">{lawyer.law_firm || "N/A"}</td>
              <td className="p-3 hidden lg:table-cell">{lawyer.bar_number || "N/A"}</td>
              <td className="p-3 hidden lg:table-cell">{lawyer.location || "N/A"}</td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {lawyer.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </div>
              </td>
              <td className="p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(lawyer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(lawyer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(lawyer)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lawyer Management</h1>
          <p className="text-muted-foreground">
            Manage registered lawyers and their profiles
            {loading && <span className="ml-2 text-blue-600">• Syncing...</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={fetchLawyers}
            disabled={loading}
            className="hover:scale-105 transition-all duration-200"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lawyers by name, email, phone, firm, bar number, location..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLawyers.length} of {lawyers.length} lawyers
        </p>
      </div>

      {/* Loading State */}
      {loading && lawyers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <h3 className="text-lg font-semibold mb-2">Loading lawyers...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the data.</p>
          </CardContent>
        </Card>
      )}

      {/* Lawyers Display */}
      {!loading && filteredLawyers.length > 0 && (
        viewMode === "cards" ? <LawyersCardView lawyers={filteredLawyers} /> : <LawyersListView lawyers={filteredLawyers} />
      )}

      {/* Empty State */}
      {!loading && filteredLawyers.length === 0 && lawyers.length > 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No lawyers found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {!loading && lawyers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No lawyers registered yet</h3>
            <p className="text-muted-foreground">Lawyers will appear here once they register.</p>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {selectedLawyer && (
        <>
          <EditLawyerDialog
            lawyer={selectedLawyer}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={fetchLawyers}
          />
          <ViewLawyerDialog
            lawyer={selectedLawyer}
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lawyer account for{" "}
              <strong>{lawyerToDelete && getFullName(lawyerToDelete)}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

