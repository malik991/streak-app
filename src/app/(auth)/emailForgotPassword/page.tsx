"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import Link from "next/link";
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const emailForForgotPass = z.object({
  email: z.string().email({ message: "email is not valid 💀" }),
});

export default function EmailForgotPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubitting] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  //const router = useRouter();
  // now check how to use zod
  const register = useForm<z.infer<typeof emailForForgotPass>>({
    // here we can use different resolver, but now we use zod resolver
    resolver: zodResolver(emailForForgotPass),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof emailForForgotPass>) {
    setIsSubitting(true);
    setShowMessage("");
    try {
      const res = await axios.post("/api/users/forgotPassword", data);
      if (res.data.success) {
        toast({
          title: "Success",
          description: res.data.message,
        });
        setShowMessage(res?.data?.message);
        //router.replace(`/forgotPassword`);
      }
    } catch (error) {
      console.log("error in email forgot for password: ", error);
      const axiosError = error as any;
      let errorMessage = axiosError.response?.data.message;
      ("error in email forgot for password.");

      toast({
        title: "Email Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setShowMessage(errorMessage);
    } finally {
      setIsSubitting(false);
    }
  }

  return (
    <section className="mt-8">
      <div className="flex flex-col items-start  max-w-lg mx-auto p-9 rounded-lg shadow-lg bg-gray-50">
        <div className="flex flex-col text-center w-full gap-y-1">
          <h1
            className="text-primary text-4xl font-bold"
            style={{ letterSpacing: "-1.5px" }}
          >
            Enter Your Email.
          </h1>
          <p className="mb-4 text-secondry font-semibold text-sm leading-5">
            use that email which is registered in our system
          </p>
        </div>
        <div className="w-full">
          <Form {...register}>
            <form
              onSubmit={register.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                name="email"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        type="text"
                        placeholder="email"
                        {...field}
                        name="email"
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-white text-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> please wait
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div className="w-full mt-2">
          {showMessage && (
            <p className="text-red-500 text-md font-semibold leading-3 text-center p-3">
              {showMessage}
            </p>
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
