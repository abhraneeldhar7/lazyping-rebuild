import SigninFall from "@/components/signinFall";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
    return (<SignUp fallbackRedirectUrl="/dashboard" fallback={<SigninFall />} />
    )
}