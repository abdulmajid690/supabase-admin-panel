import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";
import { console } from "inspector";

const Categories = () => {
  const { toast } = useToast();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const filteredCategory = categories.filter((category) => {
    const matchesSearch = category.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddCategory = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (name === "") {
      return;
    } else {
      setBtnLoading(true);
      const { data, error, status } = await supabase
        .from("categories")
        .insert([{ name }]);

      if (status === 201) {
        setIsAddCategoryOpen(false);
        setBtnLoading(false);
        setName("");
      }
    }
  };

  const findCategory = async (id: number) => {
    console.log("Fetching category with ID:", id);
    // return;
    // const res = await supabase.from("categories").select("*").eq("id", id);
    // console.log(res);
    // if (res?.status === 200) {
    //   setCategories(res.data);
    // }
  };

  useEffect(() => {
    const getData = async () => {
      const res = await supabase.from("categories").select("*");

      if (res?.status === 200) {
        setCategories(res.data);
      }
    };

    getData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category List</h1>
        </div>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              {/* <DialogDescription>
                Create a new user account with specified role and permissions.
              </DialogDescription> */}
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="categoryName"
                    name="categoryName"
                    placeholder="category name..."
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={btnLoading}
                  onClick={handleAddCategory}
                >
                  {btnLoading ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category ({filteredCategory.length})</CardTitle>
          {/* <CardDescription>
            A list of all categories in your system including their role and
            status.
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategory.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="flex items-center space-x-3">
                    {/* <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {user.full_name?.charAt(0).toUpperCase() ||
                          user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div> */}
                    {index + 1}
                  </TableCell>
                  {/* <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell> */}
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {/* <Calendar className="mr-1 h-3 w-3" /> */}
                      {row.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.created_at ? (
                      <div className="text-sm text-muted-foreground">
                        {moment(row.created_at).format("MMM ddd, yyyy")}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Never
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => findCategory(row.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                        // onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          // onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
