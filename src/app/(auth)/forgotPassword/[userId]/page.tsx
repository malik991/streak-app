"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPasswordValidation } from "@/schemas/forgotPasswordSchema";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import Link from "next/link";
import PasswordInputPage from "@/components/passwordInput";
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubitting] = useState(false);
  const router = useRouter();
  const { userId } = useParams();
  const [showMessage, setShowMessage] = useState("");
  const register = useForm<z.infer<typeof forgotPasswordValidation>>({
    // here we can use different resolver, but now we use zod resolver
    resolver: zodResolver(forgotPasswordValidation),
    defaultValues: {
      verifyToken: "",
      newPassword: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(data: z.infer<typeof forgotPasswordValidation>) {
    try {
      setIsSubitting(true);
      setShowMessage("");
      const response = await axios.put(
        `/api/users/forgotPassword?userId=${userId}`,
        data,
        { timeout: 30000 }
      );
      if (response.data.success) {
        toast({
          title: "✔ Success",
          description: response.data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        router.replace(`/signin`);
      } else {
        toast({
          title: "Failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error in enter code: ", error);
      const axiosError = error as any;
      let errorMessage = axiosError.response?.data.message;
      ("error in enter 6 digit code and new password.");

      toast({
        title: "FAILED 😒",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
      setShowMessage(errorMessage);
    } finally {
      setIsSubitting(false);
    }
  }
  //console.log(userId);

  return (
    <section className="mt-8">
      <div className="flex flex-col items-start  max-w-md mx-auto p-6 shadow-md bg-gray-50">
        <div className="flex flex-col text-center w-full gap-y-1">
          <h1
            className="text-primary text-4xl font-bold"
            style={{ letterSpacing: "-1.5px" }}
          >
            Update Your Password.
          </h1>
          <p className="mb-4 text-secondry font-semibold text-sm leading-5">
            check your email and enter 6 digit code
          </p>
        </div>
        <div className="w-full">
          <Form {...register}>
            <form
              onSubmit={register.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                name="verifyToken"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Token Code</FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        type="text"
                        placeholder="enter 6 digit code"
                        {...field}
                        name="verifyToken"
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                name="newPassword"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">New Password</FormLabel>
                    <FormControl>
                      <PasswordInputPage fieldValue={{ ...field }} />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                name="passwordConfirm"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInputPage fieldValue={{ ...field }} />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> please wait
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div className="w-full mt-2">
          {showMessage && (
            <div className="flex flex-col items-center">
              <p className="text-red-500 text-md font-semibold leading-3 text-center p-3">
                {showMessage}
              </p>
              <Link
                href={"/emailForgotPassword"}
                className="text-secondry font-semibold"
              >
                Re-Generate
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-4">
        <p>
          Not a member yet?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-terniry font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
