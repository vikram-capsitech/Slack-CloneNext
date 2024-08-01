"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { HashLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token");
      return;
    }
    newVerification(token)
      .then((data: any) => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, error, success]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

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
