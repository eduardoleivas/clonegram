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
import { SignupValidation } from "@/lib/validation";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
//import { ToastViewport } from "@radix-ui/react-toast";

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
    if(!newUser) {
      return toast({
        title: "Sign up failed",
        description: "Please try again later."
      });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    });

    if(!session) {
      return toast({
        title: "Sign in failed",
        description: "Please try again later."
      })
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Sign up failed.",
        description: "Please try again later."
      });
    }
  }

  return (
    <Form {...form} >
      <div className="flex flex-center flex-1 flex-col 2xl:w-420 2xl:leading-2 sm:w-350 sm:leading-none">
        <img src="/clonegram/assets/images/logo1.svg" alt="logo"/>
        <h2 className="h3-bold 2xl:pt-5 sm:pt-3">Create a new Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">And start sharing with your friends</p>
      
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ): "Sign up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account? <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign in</Link>

          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm