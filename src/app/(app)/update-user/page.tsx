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
import { updateUserSchema } from "@/schemas/updateUserValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NextResponse } from "next/server";
import { useForm } from "react-hook-form";
import z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import SelectComponent from "@/components/select-component";

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
  const debounced = useDebounceCallback(setUsername, 500);

  const handleFieldChange = (field: string, checked: boolean) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      username: "",
      avatar: undefined,
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username && username.trim().length >= 3) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
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
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      const response = await axios.post("/api/update-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSubmitting(false);
      return NextResponse.json(response.data);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{ message: string }>;
      setIsSubmitting(false);
      return NextResponse.json(
        {
          success: false,
          message: axiosError.response?.data?.message ?? "Error updating user",
        },
        { status: 400 }
      );
    }
  };

  return (
    <div className="flex flex-col  min-h-screen bg-gray-100 ">
      <DashboardNavbar />
      <main>
        <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-4 mx-auto my-8">
          <div className="text-center">
            <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              {" "}
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
                        className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
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
                  render={({ field: { onChange, value, ...field } }) => (
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
                <div className="flex justify-center">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Update"
                    )}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
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
