import * as React from "react";
import { Html, Button } from "@react-email/components";

export default function VerificationEmail({email,otp}) {
  let url = `http://localhost:3000/`

  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  );
}
