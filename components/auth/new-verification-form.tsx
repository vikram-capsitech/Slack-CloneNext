"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { HashLoader } from "react-spinners";
import { useEffect, useState, useRef } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const hasSubmittedRef = useRef(false); // useRef to track submission without triggering re-renders

  const token = searchParams?.get("token");

  useEffect(() => {
    if (hasSubmittedRef.current || success || error) return;

    if (!token) {
      setError("Missing token");
      return;
    }

    hasSubmittedRef.current = true; // Set flag to true to prevent multiple submissions

    newVerification(token)
      .then((data: any) => {
        debugger
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <HashLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
