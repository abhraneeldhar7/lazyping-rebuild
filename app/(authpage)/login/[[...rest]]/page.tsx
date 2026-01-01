import SigninFall from "@/components/signinFall";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (<SignIn fallbackRedirectUrl="/dashboard" fallback={<SigninFall />} />
    )
}
