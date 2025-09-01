"use client";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import Footer from "@/components/ui/footer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import SelectComponent from "@/components/select-component";
import updateUserSchema from "@/schemas/updateUserValidationSchema";
import { z } from "zod";

export default function UpdateUser() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    name: false,
    username: false,
    avatar: false,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      username: "",
      avatar: undefined,
    },
  });

  const handleFieldChange = (field: string, checked: boolean) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: checked,
    }));

    // Clear field when unchecked
    if (!checked) {
      form.clearErrors(field as keyof z.infer<typeof updateUserSchema>);
      if (field === "avatar") {
        form.setValue("avatar", undefined);
      } else {
        form.setValue(field as keyof z.infer<typeof updateUserSchema>, "");
      }
    }
  };

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username && username.trim().length >= 3) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
          const response = await axios.get(
            `${baseUrl}/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<{ message: string }>;
          setUsernameMessage(
            axiosError.response?.data?.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    console.log("[UpdateUser] onSubmit called with data:", data);

    // Validate name if selected
    if (selectedFields.name) {
      if (!data.name || data.name.trim().length < 3) {
        form.setError("name", {
          message: "Name should be atleast 3 characters",
        });
        return;
      }
    }

    // Validate username if selected
    if (selectedFields.username) {
      if (!data.username || data.username.trim().length < 3) {
        form.setError("username", {
          message: "Username should atleast be 3 characters",
        });
        return;
      }
      if (data.username.length > 20) {
        form.setError("username", {
          message: "Username can't be more than 20 characters long.",
        });
        return;
      }
      if (!/^[a-zA-Z0-9_-]{3,20}$/.test(data.username)) {
        form.setError("username", {
          message: "Username must not contain any special character.",
        });
        return;
      }
    }

    // Validate avatar if selected
    if (selectedFields.avatar && !data.avatar) {
      form.setError("avatar", { message: "Please select an avatar image" });
      return;
    }

    // Check if at least one field is selected
    if (
      !selectedFields.name &&
      !selectedFields.username &&
      !selectedFields.avatar
    ) {
      // You might want to show a toast or alert here
      console.log("Please select at least one field to update");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (selectedFields.name && data.name) {
        formData.append("name", data.name);
      }
      if (selectedFields.username && data.username) {
        formData.append("username", data.username);
      }
      if (selectedFields.avatar && data.avatar) {
        formData.append("avatar", data.avatar);
      }

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const response = await axios.post(
        `${baseUrl}/api/update-user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      setIsSubmitting(false);
      setSuccessMessage("Profile updated successfully!");
      // You might want to show a success message or redirect here
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{ message: string }>;
      setIsSubmitting(false);
      setSuccessMessage("");

      // You might want to show an error message here
      console.error(
        "Update failed:",
        axiosError.response?.data?.message ?? "Error updating user"
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <DashboardNavbar />
      <main>
        <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-4 mx-auto my-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Update your profile
            </h1>
          </div>

          <div className="text-center mb-4">
            <p className="text-muted-foreground">
              Select what you want to update
            </p>
          </div>

          <SelectComponent
            selectedFields={selectedFields}
            onFieldChange={handleFieldChange}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {selectedFields.name && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {selectedFields.username && (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isCheckingUsername && (
                        <Loader2 className="animate-spin" />
                      )}
                      <p
                        className={`text-sm ${
                          usernameMessage === "Username is available"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedFields.avatar && (
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file || undefined);
                          }}
                          {...field}
                          value={undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(selectedFields.name ||
                selectedFields.username ||
                selectedFields.avatar) && (
                <div className="flex flex-col items-center">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  {successMessage && (
                    <div className="mt-4 text-green-600 bg-green-100 border border-green-200 rounded-lg px-4 py-3 text-center font-medium">
                      {successMessage}
                    </div>
                  )}
                </div>
              )}
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
