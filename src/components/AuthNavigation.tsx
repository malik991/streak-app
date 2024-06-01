import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import DropdownMenuDemo from "@/components/dropDownMenu/index";
import { ModeToggle } from "./dropDownMenu/darkLightMode";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "./ui/use-toast";

export interface AuthNavigationProps {
  userName: string;
  status: string;
}

function AuthNavigation(inputParam: AuthNavigationProps): any {
  const session = useSession();
  const [imagelink, setImageLink] = useState("");
  const { toast } = useToast();
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
              //setUserId({ userId: userId });

              const userProfileResponse = await axios.get(
                "/api/users/profile",
                {
                  params: { id: userId },
                }
              );

              if (userProfileResponse.data.success) {
                //setLoadingForm(false);
                setImageLink(
                  userProfileResponse.data.data?.profile_picture_url
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
            //setLoadingForm(false);
            console.error("Error during Profile API calls:", error);
            toast({
              title: "Error",
              description: "while fetching user profile",
              className: "bg-red-500 text-white",
              variant: "destructive",
            });
          }
        }
      }
    };

    if (session?.status === "authenticated") {
      fetchUserData();
    }
  }, [session?.status, imagelink]);
  if (inputParam.status === "loading") {
    return <Loader2 className="animate-spin" />;
  }
  if (inputParam.status === "authenticated") {
    return (
      <div className="flex gap-4">
        <DropdownMenuDemo linkimage={imagelink} />
        <ModeToggle />
      </div>
    );
  } else {
    return (
      <>
        <Link href="/signin" className="text-secondry text-lg">
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-primary px-5 py-1 text-white rounded-lg"
        >
          Register
        </Link>
        <ModeToggle />
      </>
    );
  }
}

export default AuthNavigation;
