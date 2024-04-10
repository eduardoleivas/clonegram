import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast"
import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
//import { ToastViewport } from "@radix-ui/react-toast";

const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    toast({
      title:"Signing into your account",
      description:"Welcome back!"
    });

    const session = await signInAccount({
      email: values.email,
      password: values.password
    });

    if(!session) {
      return toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Please check your username and password."
      })
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        variant: "destructive",
        title: "Sign in failed.",
        description: "Please check your username and password."
      });
    }
  }

  return (
    <Form {...form} >
      <div className="flex flex-center flex-1 flex-col 2xl:w-420 2xl:leading-2 sm:w-350 sm:leading-1">
        <img src="/clonegram/assets/images/logo1.svg" alt="logo"/>
        <h2 className="h3-bold 2xl:pt-5 sm:pt-3">Sign in to your Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back to Clonegram</p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full mt-4 2xl:gap-5 sm:gap-[7px]">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary mt-2">
            {isUserLoading? (
              <div className="flex-center gap-5">
                <Loader /> Loading...
              </div>
            ): "Sign in"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account? <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>

          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm