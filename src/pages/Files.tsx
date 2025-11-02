import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Upload, 
  Search, 
  Download, 
  Trash2, 
  File,
  Image,
  Video,
  FileText,
  Archive,
  MoreHorizontal,
  Eye,
  Calendar,
  HardDrive
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploaded_by: string
  uploaded_at: string
}

// Mock file data
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'presentation.pdf',
    size: 2048576,
    type: 'application/pdf',
    url: '/files/presentation.pdf',
    uploaded_by: 'john@example.com',
    uploaded_at: '2024-01-30T10:30:00Z'
  },
  {
    id: '2',
    name: 'dashboard-mockup.png',
    size: 1024000,
    type: 'image/png',
    url: '/files/dashboard-mockup.png',
    uploaded_by: 'sarah@example.com',
    uploaded_at: '2024-01-29T14:20:00Z'
  },
  {
    id: '3',
    name: 'demo-video.mp4',
    size: 15728640,
    type: 'video/mp4',
    url: '/files/demo-video.mp4',
    uploaded_by: 'mike@example.com',
    uploaded_at: '2024-01-28T16:45:00Z'
  },
  {
    id: '4',
    name: 'project-docs.zip',
    size: 5242880,
    type: 'application/zip',
    url: '/files/project-docs.zip',
    uploaded_by: 'emma@example.com',
    uploaded_at: '2024-01-27T11:15:00Z'
  }
]

export default function Files() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || file.type.startsWith(selectedType)
    return matchesSearch && matchesType
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4 text-green-600" />
    if (type.startsWith('video/')) return <Video className="h-4 w-4 text-purple-600" />
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-4 w-4 text-red-600" />
    if (type.includes('zip') || type.includes('archive')) return <Archive className="h-4 w-4 text-orange-600" />
    return <File className="h-4 w-4 text-gray-600" />
  }

  const getFileTypeBadge = (type: string) => {
    if (type.startsWith('image/')) return { label: 'Image', variant: 'default' as const }
    if (type.startsWith('video/')) return { label: 'Video', variant: 'secondary' as const }
    if (type.includes('pdf')) return { label: 'PDF', variant: 'outline' as const }
    if (type.includes('zip')) return { label: 'Archive', variant: 'outline' as const }
    return { label: 'File', variant: 'outline' as const }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate file upload with progress
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Add file to list
      const newFile: FileItem = {
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploaded_by: 'current-user@example.com',
        uploaded_at: new Date().toISOString()
      }

      setFiles(prev => [newFile, ...prev])
    }

    setUploading(false)
    setUploadProgress(0)
    setIsUploadOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId))
  }

  const handleDownloadFile = (file: FileItem) => {
    // In a real app, this would trigger a download from Supabase Storage
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const storageLimit = 1024 * 1024 * 1024 * 5 // 5GB limit
  const storageUsed = (totalSize / storageLimit) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">
            Manage and organize your uploaded files
          </p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>
                Select files to upload to your storage. Supported formats: images, videos, documents, and archives.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Or drag and drop files here
                </p>
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Storage Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
            <Progress value={storageUsed} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {storageUsed.toFixed(1)}% of 5GB used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Image className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {files.filter(f => f.type.startsWith('image/')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {files.filter(f => f.type.includes('pdf') || f.type.includes('document')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={selectedType === 'image' ? 'default' : 'outline'}
            onClick={() => setSelectedType('image')}
            size="sm"
          >
            Images
          </Button>
          <Button
            variant={selectedType === 'video' ? 'default' : 'outline'}
            onClick={() => setSelectedType('video')}
            size="sm"
          >
            Videos
          </Button>
          <Button
            variant={selectedType === 'application' ? 'default' : 'outline'}
            onClick={() => setSelectedType('application')}
            size="sm"
          >
            Documents
          </Button>
        </div>
      </div>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>Files ({filteredFiles.length})</CardTitle>
          <CardDescription>
            A list of all uploaded files with their details and actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => {
                const typeBadge = getFileTypeBadge(file.type)
                return (
                  <TableRow key={file.id}>
                    <TableCell className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium">{file.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeBadge.variant}>
                        {typeBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {file.uploaded_by}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(file.uploaded_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}