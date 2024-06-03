"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signInValidation } from "@/schemas/signinScema";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

import PasswordInputPage from "@/components/passwordInput";

export default function SigninPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubitting] = useState(false);
  const router = useRouter();
  // now check how to use zod
  const register = useForm<z.infer<typeof signInValidation>>({
    // here we can use different resolver, but now we use zod resolver
    resolver: zodResolver(signInValidation),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInValidation>) => {
    setIsSubitting(true);

    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast({
          className: "bg-red-500 text-white",
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error: any) {
      setIsSubitting(false);
      console.log("error in sigin in: ", error?.message || error);
    } finally {
      setIsSubitting(false);
    }
  };
  return (
    <section className="md:mt-8 my:9">
      <div className="md:mt-8 mt-11 flex flex-col items-start  max-w-sm mx-auto p-6 shadow-md bg-gray-50 rounded-md">
        <div className="flex flex-col text-center w-full gap-y-1">
          <h1
            className="text-primary text-4xl font-bold"
            style={{ letterSpacing: "-1.5px" }}
          >
            Let&#39;s get it done.
          </h1>
          <p className="mb-4 text-secondry font-semibold text-sm leading-5">
            login to continue
          </p>
        </div>
        <div className="w-full">
          <Form {...register}>
            <form
              onSubmit={register.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <FormField
                name="identifier"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="identifier" className="form-label">
                      Email/Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-black text-sm font-semibold"
                        type="text"
                        placeholder="username/email"
                        {...field}
                        name="identifier"
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Password</FormLabel>
                    <FormControl>
                      <PasswordInputPage fieldValue={{ ...field }} />
                      {/* <Input
                        className="text-black"
                        type="password"
                        placeholder="password"
                        {...field}
                        name="password"
                      /> */}
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-between items-center">
                <div className="flex space-x-1 items-center">
                  <Checkbox id="remember" className="w-3.5 h-3.5" />
                  <label
                    htmlFor="remember"
                    className="text-xs text-secondry font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <Link
                    href={"/emailForgotPassword"}
                    className="text-xs text-secondry font-medium leading-none peer-disabled:opacity-70"
                  >
                    forgot password?
                  </Link>
                </div>
              </div>
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
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
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
