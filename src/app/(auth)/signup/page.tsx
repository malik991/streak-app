"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUpValidation } from "@/schemas/signupSchema";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export default function signupPage() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubitting] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isLoadingUsername, setIsLoadingUsername] = useState(false);
  // now check how to use zod
  const register = useForm<z.infer<typeof signUpValidation>>({
    // here we can use different resolver, but now we use zod resolver
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  // to hit the api
  useEffect(() => {
    const getUsernameUniqueOrNot = async () => {
      if (username) {
        setIsLoadingUsername(true);
        setUsernameMessage("");
        try {
          const res = await axios.get(
            `/api/users/unique-user-name?username=${username}`,
            { timeout: 30000 }
          );
          if (res.data) {
            setUsernameMessage(res.data.message);
          }
        } catch (error) {
          const handleAxiosError = error as any;
          setUsernameMessage(
            handleAxiosError.response?.data.message ??
              "Error while checking user name"
          );
        } finally {
          setIsLoadingUsername(false);
        }
      }
    };
    getUsernameUniqueOrNot();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
    setIsSubitting(true);
    try {
      console.log("Data for signup form: ", data);
      const res = await axios.post("/api/sign-up", data);
      if (res.data.success) {
        toast({
          title: "Success",
          description: res.data.message,
        });
      } else {
        toast({
          title: "Failed",
          description: res.data.message,
          variant: "destructive",
        });
      }
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error during sign-up submitting:", error);
      const axiosError = error as any;
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubitting(false);
    }
  };

  return (
    <section className="mt-8">
      <div className="flex flex-col items-start gap-y-3 max-w-sm mx-auto p-3">
        <div className="">
          <h1
            className="text-primary text-4xl"
            style={{ letterSpacing: "-1.5px" }}
          >
            Sign Up
          </h1>
          <p className="mb-4 text-secondry font-semibold text-xs leading-5">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <div className="w-full">
          <Form {...register}>
            <form
              onSubmit={register.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                name="username"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">User Name</FormLabel>
                    <Input
                      className=""
                      placeholder="username"
                      type="text"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />

                    {isLoadingUsername && <Loader className="animate-spin" />}
                    {!isLoadingUsername && usernameMessage && (
                      <p
                        className={`text-sm ${
                          usernameMessage === "username is available"
                            ? "text-green-500"
                            : "text-red-500 font-semibold"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Email</FormLabel>

                    <Input type="email" placeholder="enter email" {...field} />
                    <p className="text-muted text-secondry font-semibold text-xs">
                      * We will send you a verification email
                    </p>

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
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      name="password"
                    />
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
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}