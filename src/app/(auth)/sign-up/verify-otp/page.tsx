// /app/signup/verify-otp/page.tsx
import OTPForm from "@/components/ui/otp-form";
import { redirect } from "next/navigation";

// Add this to force dynamic rendering
export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    email?: string;
    phone?: string;
  };
}

export default function VerifyOTPPage({ searchParams }: Props) {
  if (!searchParams.email && !searchParams.phone) {
    redirect("/signup");
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <OTPForm email={searchParams.email} phone={searchParams.phone} />
    </div>
  );
}
