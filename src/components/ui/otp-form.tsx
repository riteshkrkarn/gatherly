import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "./passwordInput";

interface Props {
  email?: string;
  phone?: string;
}

export default function OTPForm({ email, phone }: Props) {
  return (
    <div className="className=w-screen h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the code sent to {email || phone}
          </p>
        </CardHeader>
        <CardContent>
          <form>
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="phone" value={phone} />
            <div className="space-y-4">
               <PasswordInput 
              name="otp" 
              placeholder="Enter OTP" 
              maxLength={6}
              required 
            />
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
