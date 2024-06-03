"use client";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { profileValidation } from "@/schemas/profileSchema";

interface UserProfile {
  profile_picture_url?: string;
  full_name?: string;
  bio?: string;
}

const initialUserProfile: UserProfile = {};

interface userIdInterface {
  userId: string;
}

export default function ProfilePage() {
  const [userId, setUserId] = useState<userIdInterface | null>(null);
  //const [userProfile, setUserProfile] = useState<UserProfile[]>([]);
  const [userProfile, setUserProfile] =
    useState<UserProfile>(initialUserProfile);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const { toast } = useToast();
  const session = useSession();
  const [isSubmitting, setIsSubitting] = useState(false);
  const register = useForm<z.infer<typeof profileValidation>>({
    resolver: zodResolver(profileValidation),
    defaultValues: {
      fullName: "",
      bio: "",
    },
  });
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.status === "authenticated") {
        const userEmail: any = session?.data?.user?.email;

        if (userEmail) {
          try {
            const userIdResponse = await axios.get("/api/users/profile", {
              params: { email: userEmail },
            });
            if (userIdResponse.data.success) {
              const userId = userIdResponse.data.data.id;
              setUserId({ userId: userId });

              const userProfileResponse = await axios.get(
                "/api/users/profile",
                {
                  params: { id: userId },
                }
              );

              if (userProfileResponse.data.success) {
                setLoadingForm(false);
                setUserProfile(userProfileResponse.data.data);
                register.setValue(
                  "fullName",
                  userProfileResponse.data?.data?.full_name || "",
                  { shouldDirty: true }
                );
                register.setValue(
                  "bio",
                  userProfileResponse.data?.data?.bio || "",
                  { shouldDirty: true }
                );
              } else {
                console.error(
                  "Error fetching user profile data:",
                  userProfileResponse.data.message
                );
                toast({
                  title: "Info",
                  description: userProfileResponse.data.message,
                  className: "bg-blue-500 text-red",
                  variant: "destructive",
                });
              }
            } else {
              console.error(
                "Error fetching user ID:",
                userIdResponse.data.message
              );
              toast({
                title: "Failed",
                description: "while fetching user Id",
                className: "bg-red-500 text-white",
                variant: "destructive",
              });
            }
          } catch (error) {
            setLoadingForm(false);
            console.error("Error during Profile API calls:", error);
            toast({
              title: "Error",
              description: "while fetching user profile",
              className: "bg-red-500 text-white",
              variant: "destructive",
            });
          } finally {
            setLoadingForm(false);
          }
        }
      }
    };

    if (session?.status !== "loading") {
      fetchUserData();
    }
  }, [session?.status, userProfile?.profile_picture_url]);

  if (session?.status === "loading") {
    return (
      <div className="max-w-sm mx-auto flex items-center mt-8">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-300" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-slate-300" />
            <Skeleton className="h-4 w-[200px] bg-slate-300" />
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: z.infer<typeof profileValidation>) => {
    try {
      setIsSubitting(true);

      const res = await axios.post("/api/users/profile", data, {
        params: { id: userId?.userId },
      });
      if (res.data.success) {
        toast({
          title: "✔ Updated",
          description: res.data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
      }
    } catch (error: any) {
      setIsSubitting(false);
      console.log("error while uploading form: ", error);
      let errorMessage = error.response?.data.message;
      ("There was a problem with profile data. Please try again.");
      toast({
        title: "💀 Error",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsSubitting(false);
    }
  };

  async function handleImageFile(ev: any) {
    setLoadingAvatar(true);
    const pdFile = ev.target.files[0];
    if (pdFile && userId) {
      const data = new FormData();
      data.set("pdFile", pdFile);
      data.set("id", userId.userId);

      try {
        const response = await axios.post("/api/users/uploadAvatar", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          setUserProfile({
            ...userProfile,
            profile_picture_url: response.data.profile_picture_url,
          });
          toast({
            title: "✔ Uploaded",
            description: response.data.message,
            className: "bg-green-500 text-white",
          });
        }
      } catch (error: any) {
        setLoadingAvatar(false);
        console.log("error in uploaidng avatar: ", error);
        let errorMessage = error.response?.data.message;
        ("There was a problem with your avatar. Please try again.");
        toast({
          title: "Avatar Upload Failed",
          description: errorMessage,
          variant: "destructive",
          className: "bg-red-500 text-white",
        });
      } finally {
        setLoadingAvatar(false);
      }
    }
  }

  if (session?.status === "authenticated") {
    return (
      <section className="mt-8">
        <div className="max-w-xl mx-auto p-6 flex flex-col items-center gap-y-4">
          <h1 className="text-6xl font-bold tracking-tight text-primary">
            User Profile
          </h1>
          {loadingForm ? (
            <div className="max-w-sm mx-auto flex items-center mt-8">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-12 w-12 rounded-full bg-slate-300" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-slate-300" />
                  <Skeleton className="h-4 w-[200px] bg-slate-300" />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="block sm:grid sm:grid-cols-2 items-start gap-6 w-full"
              style={{ gridTemplateColumns: ".3fr .7fr" }}
            >
              <div className="flex flex-col gap-y-1 items-center justify-center">
                {loadingAvatar ? (
                  <Skeleton className="h-12 w-12 rounded-full bg-slate-300" />
                ) : (
                  <Avatar className="md:w-full md:h-full mb-2">
                    <AvatarImage
                      src={
                        userProfile?.profile_picture_url
                          ? userProfile?.profile_picture_url
                          : ""
                      }
                    />
                    <AvatarFallback className="bg-gray-300 rounded-full overflow-hidden p-2">
                      <span className="text-sm font-semibold">DP</span>
                    </AvatarFallback>
                  </Avatar>
                )}

                <label className="">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageFile}
                    accept="image/png"
                  />
                  <span
                    className={`block text-center p-2 border border-gray-300 
        rounded-lg cursor-pointer hover:bg-primary ${
          loadingAvatar ? "cursor-not-allowed opacity-50" : ""
        }`}
                  >
                    {loadingAvatar ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>wait ...</span>
                      </div>
                    ) : (
                      "Upload"
                    )}
                    {/* {link ? "Update" : "Upload"} */}
                  </span>
                </label>
              </div>
              <div className="w-full grow pt-3">
                <Form {...register}>
                  <form onSubmit={register.handleSubmit(onSubmit)} className="">
                    <FormField
                      control={register.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid w-full max-w-sm items-center gap-1 ">
                            <Label htmlFor="fullname" className="form-label">
                              Full Name*
                            </Label>

                            <Input
                              className="text-black"
                              type="text"
                              id="fullname"
                              {...field}
                              placeholder="your full name"
                            />
                          </div>

                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="bio"
                      control={register.control}
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid w-full max-w-sm items-center gap-1">
                            <Label htmlFor="bio" className="form-label">
                              Bio
                            </Label>

                            <Textarea
                              id="bio"
                              placeholder="write your bio"
                              {...field}
                              className="block text-black w-full mb-2 rounded-lg border p-2 border-secondry bg-gray-100"
                            />
                          </div>

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
                          <Loader className=" h-4 w-4 animate-spin" /> please
                          wait
                        </>
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
}
