"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Mail, Check, Search, Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  read: boolean
}

interface ApiMessage {
  id: string | number
  name: string
  email: string
  subject?: string | null
  message: string
  createdAt: string
  isRead: boolean
}

export function InboxList() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [messageToMarkRead, setMessageToMarkRead] = useState<Message | null>(null)
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  
  // Search, Filter, and Pagination State
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("unread")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { toast } = useToast()

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages")
      if (!res.ok) throw new Error("Failed to fetch messages")
      const data: ApiMessage[] = await res.json()
      
      const formattedMessages = data.map((msg) => ({
        id: msg.id.toString(),
        name: msg.name,
        email: msg.email,
        subject: msg.subject || "No Subject",
        message: msg.message,
        date: msg.createdAt,
        read: msg.isRead,
      }))
      
      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      })
      
      if (!res.ok) throw new Error("Failed to update message")

      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      toast({
        title: "Marked as read",
        description: "Message has been archived",
      })
    } catch (error) {
      console.error("Error marking message as read:", error)
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      })
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      })
      
      if (!res.ok) throw new Error("Failed to delete message")

      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      toast({
        title: "Message deleted",
        description: "The message has been permanently removed",
      })
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  const deleteAllArchived = async () => {
    try {
      const res = await fetch("/api/admin/messages?type=all_archived", {
        method: "DELETE",
      })
      
      if (!res.ok) throw new Error("Failed to delete messages")

      setMessages((prev) => prev.filter((m) => !m.read))
      toast({
        title: "Archived messages deleted",
        description: "All archived messages have been permanently removed",
      })
    } catch (error) {
      console.error("Error deleting archived messages:", error)
      toast({
        title: "Error",
        description: "Failed to delete archived messages",
        variant: "destructive",
      })
    }
  }

  // Filter Logic
  const filteredMessages = messages.filter((message) => {
    // Status Filter
    if (statusFilter === "unread" && message.read) return false
    if (statusFilter === "read" && !message.read) return false
    
    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage)
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const replyViaEmail = (email: string, subject: string) => {
    window.location.href = `mailto:${email}?subject=Re: ${subject}`
  }

  const unreadCount = messages.filter((m) => !m.read).length

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-50 border-neutral-200 text-black">
        <CardHeader>
          <CardTitle>Off-Platform Workflow</CardTitle>
          <CardDescription>How to handle customer inquiries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Read the message details below</li>
            <li>Click "Reply via Email" to open your default mail app</li>
            <li>Send your response directly from your email client</li>
            <li>Mark the message as read to archive it</li>
          </ol>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-lg font-semibold">Inbox</h3>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {statusFilter === "read" && messages.some(m => m.read) && (
          <Button 
            size="sm" 
            className="h-8 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setShowDeleteAllDialog(true)}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete All Archived
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unread">Unread (Default)</SelectItem>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="read">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {paginatedMessages.map((message) => (
          <div
            key={message.id}
            className={`group relative flex flex-col rounded-lg border transition-all ${
              !message.read 
                ? "bg-white border-neutral-200 border-l-4 border-l-black shadow-sm" 
                : "bg-neutral-50 border-neutral-200 opacity-75"
            }`}
          >
            {/* Clickable Area for View */}
            <div 
              className="p-5 cursor-pointer"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-base ${!message.read ? "text-black" : "text-neutral-600"}`}>
                      {message.name}
                    </span>
                    {!message.read && <div className="h-2 w-2 rounded-full bg-black animate-pulse" />}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(message.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <span className={`text-sm font-medium ${!message.read ? "text-black" : "text-neutral-600"}`}>
                  {message.subject}
                </span>
                <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>

            {/* Visible Actions Footer */}
            <div className="flex items-center gap-2 p-3 pt-0 border-t-0">
              <Button 
                size="sm" 
                className="flex-1 bg-black text-white hover:bg-neutral-800 h-9"
                onClick={(e) => {
                  e.stopPropagation()
                  replyViaEmail(message.email, message.subject)
                }}
              >
                <Mail className="mr-2 h-3.5 w-3.5" />
                Reply
              </Button>
              {!message.read && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 border-neutral-200 hover:bg-neutral-100 h-9 text-neutral-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMessageToMarkRead(message)
                  }}
                >
                  <Check className="mr-2 h-3.5 w-3.5" />
                  Mark Read
                </Button>
              )}
              {message.read && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 h-9 text-neutral-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMessageToDelete(message)
                  }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-10 text-muted-foreground bg-neutral-50 rounded-lg border border-dashed">
            <p>No messages found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <span aria-hidden="true">‹</span>
                </Button>
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <span aria-hidden="true">›</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-md sm:max-w-lg bg-white text-black border-neutral-200 p-0 overflow-hidden gap-0">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-xl">{selectedMessage?.subject}</DialogTitle>
                <DialogDescription className="text-base text-black font-medium">
                  {selectedMessage?.name} <span className="text-muted-foreground font-normal">&lt;{selectedMessage?.email}&gt;</span>
                </DialogDescription>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap mt-1">
                {selectedMessage && new Date(selectedMessage.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </span>
            </div>
          </DialogHeader>
          
          <div className="p-6 pt-2 space-y-6">
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-800">
              {selectedMessage?.message}
            </div>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
              <Button
                className="w-full bg-black text-white hover:bg-neutral-800 h-11"
                onClick={() => {
                  if (selectedMessage) {
                    replyViaEmail(selectedMessage.email, selectedMessage.subject)
                  }
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Reply via Email
              </Button>
              
              {selectedMessage && !selectedMessage.read && (
                <Button
                  variant="outline"
                  className="w-full h-11 border-neutral-200 hover:bg-neutral-50"
                  onClick={() => {
                    if (selectedMessage) {
                      setMessageToMarkRead(selectedMessage)
                    }
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Read
                </Button>
              )}

              {selectedMessage && selectedMessage.read && (
                <Button
                  variant="outline"
                  className="w-full h-11 border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  onClick={() => {
                    if (selectedMessage) {
                      setMessageToDelete(selectedMessage)
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Message
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!messageToMarkRead} onOpenChange={() => setMessageToMarkRead(null)}>
        <AlertDialogContent className="bg-white text-black border-neutral-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as read?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600">
              This action will archive the message. It does NOT send a response to the user, and you will not see this chat again in the inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-200 hover:bg-neutral-50 text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-black text-white hover:bg-neutral-800"
              onClick={() => {
                if (messageToMarkRead) {
                  markAsRead(messageToMarkRead.id)
                  setMessageToMarkRead(null)
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
        <AlertDialogContent className="bg-white text-black border-neutral-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600">
              This action cannot be undone. This will permanently delete the message from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-200 hover:bg-neutral-50 text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (messageToDelete) {
                  deleteMessage(messageToDelete.id)
                  setMessageToDelete(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent className="bg-white text-black border-neutral-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Archived Messages?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600">
              This action cannot be undone. This will permanently delete all {messages.filter(m => m.read).length} archived messages from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-200 hover:bg-neutral-50 text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                deleteAllArchived()
                setShowDeleteAllDialog(false)
              }}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
