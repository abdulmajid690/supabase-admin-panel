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
import moment from "moment";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";

const Products = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productState, setProductState] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    status: false,
  });

  const filteredProduct = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddProduct = async () => {
    if (Object.values(productState).some((value) => value === "")) {
      return;
    } else {
      // console.log("handleUpdateProduct", productState);
      // return;
      setBtnLoading(true);
      const { data, error, status } = await supabase
        .from("products")
        .insert([productState]);
      // console.log("status", status);
      // console.log("error", error);
      if (status === 201) {
        setIsAddProductOpen(false);
        setBtnLoading(false);
        setProductState({
          name: "",
          description: "",
          price: "",
          category_id: "",
        });
      }

      setBtnLoading(false);
    }
  };

  const findProduct = async (id: number) => {
    const res = await supabase.from("products").select("*").eq("id", id);
    if (res?.status === 200) {
      setIsAddProductOpen(true);
      setProductState({
        name: res.data[0].name,
        description: res.data[0].description,
        price: res.data[0].price,
        category_id: res.data[0].category_id,
        status: res.data[0].status,
      });
      setEditingProductId(id);
    }
  };

  const handleUpdateProduct = async () => {
    console.log("handleUpdateProduct");
    if (
      Object.values(productState).some((value) => value != "") &&
      editingProductId
    ) {
      setBtnLoading(true);
      const { data, error, status } = await supabase
        .from("products")
        .update(productState)
        .eq("id", editingProductId);

      if (status === 204) {
        setIsAddProductOpen(false);
        setBtnLoading(false);
        setProductState({
          name: "",
          description: "",
          price: "",
          category_id: "",
        });
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      const [resCategory, resProduct] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("products").select(
          `
            id,
            name,
            price,
            description,
            created_at,
            categories (
              id,
              name
            )
          `
        ),
      ]);

      if (resProduct.status === 200) {
        setProducts(resProduct.data);
        if (resCategory?.status === 200) {
          setCategories(resCategory.data);
        }
      }
    };

    if (!isAddProductOpen) {
      getData();
    }
  }, [isAddProductOpen]);
  console.log("products", products);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product List</h1>
        </div>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
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
                    id="productName"
                    name="productName"
                    placeholder="product name..."
                    className="col-span-3"
                    value={productState.name}
                    onChange={(e) =>
                      setProductState({
                        ...productState,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="0.00"
                    className="col-span-3"
                    value={productState.price}
                    onChange={(e) =>
                      setProductState({
                        ...productState,
                        price: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="details..."
                    className="col-span-3"
                    value={productState.description}
                    onChange={(e) =>
                      setProductState({
                        ...productState,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Category
                  </Label>
                  <Select
                    name="category"
                    value={
                      productState.category_id
                        ? parseFloat(productState.category_id)
                        : productState.category_id
                    }
                    onValueChange={(value) =>
                      setProductState({ ...productState, category_id: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category, index) => (
                        <SelectItem key={index} value={category?.id}>
                          {category?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Checkbox
                    checked={productState.status}
                    onChange={() =>
                      setProductState({
                        ...productState,
                        status: !productState.status,
                      })
                    }
                  />
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  disabled={btnLoading}
                  onClick={
                    Object.values(productState).some((value) => value != "") &&
                    editingProductId
                      ? handleUpdateProduct
                      : handleAddProduct
                  }
                >
                  {btnLoading
                    ? Object.values(productState).some(
                        (value) => value === ""
                      ) && editingProductId
                      ? "Updating..."
                      : "Creating..."
                    : Object.values(productState).some(
                        (value) => value === ""
                      ) && editingProductId
                    ? "Update Product"
                    : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        {/* <CardHeader>
                <CardTitle>Category ({filteredCategory.length})</CardTitle>
                <CardDescription>
                  A list of all categories in your system including their role and
                  status.
                </CardDescription>
              </CardHeader> */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProduct.map((row, index) => (
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
                    <div className="flex items-center text-sm text-muted-foreground">
                      {/* <Calendar className="mr-1 h-3 w-3" /> */}
                      {row.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {/* <Calendar className="mr-1 h-3 w-3" /> */}
                      {row.price}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {/* <Calendar className="mr-1 h-3 w-3" /> */}
                      {row.categories?.name}
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
                        <DropdownMenuItem onClick={() => findProduct(row.id)}>
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

export default Products;
