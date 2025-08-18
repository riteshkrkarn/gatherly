"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifyCodeSchema } from "@/schemas/verifyValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios, { AxiosError } from "axios";
import { createApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async function (data: z.infer<typeof verifyCodeSchema>) {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      router.replace(`/sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError;
      return createApiResponse(
        false,
        axiosError.response?.data.message || "Error",
        400
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-10 p-4">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-4">
        <div className="text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            {" "}
            Verify your account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
